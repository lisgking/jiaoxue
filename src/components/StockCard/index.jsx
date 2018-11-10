import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Divider, Popover } from 'antd';
import ReactHighcharts from 'react-highcharts';
import ask from '../../lib/ask';
import Loading from '../Loading';
import utils from '../../lib/utils';
import './StockCard.scss';
import { COMPRE_ANALYST } from '../../env';

@withRouter
@inject('stockStore')
@observer
export default class StockCard extends Component {
  state = {
    disabled: true,
    stockInfo: '',
  }

  componentDidMount = () => {
    const { stockCode } = this.props;
    ask('stockInfo', {
      async: false,
      params: {
        stock_code: stockCode,
      },
    }).then((resp) => {
      if (resp.code === 200 && resp.data && resp.data.com_uni_code) {
        const {
          com_uni_code,
          abc_code,
          sec_uni_code,
          sec_type,
          sec_name,
          sec_small_type,
        } = resp.data;
        let url;
        if (sec_type === 1004003) {
          // 基金
          if (sec_small_type === 1004003001) {
            // 场内基金
            this.setState({
              disabled: false,
            });
          }
        } else if (sec_type === 1004001) {
          // 沪深股票
          this.setState({
            disabled: false,
          });
        }
        this.setState({
          stockInfo: {
            com_uni_code,
            abc_code,
            sec_uni_code,
            sec_type,
            sec_name,
            sec_small_type,
          },
        });
      }
    });
  }

  getStockChart = () => {
    const resp = this.props.stockStore.stockDetail;
    const data = resp.stock_price_icon;
    const pctchange = resp.f9.differ_range ? resp.f9.differ_range : '';
    const isUp = pctchange === 0 ? 'eq' : pctchange > 0 ? 'up' : 'down';

    let basicColor = '#717D8C';
    if (isUp === 'up') {
      basicColor = '#F97F6C';
    } else if (isUp === 'down') {
      basicColor = '#71DE9D';
    }
    const seriesArr = [];
    const basicConfig = {
      chart: {
        backgroundColor: 'transparent',
        margin: [0, 0, 0, 0],
        spacing: [0, 0, 0, 0],
        height: '80px',
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      title: {
        text: null,
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        enabled: false,
      },
      xAxis: {
        visible: false,
      },
      yAxis: {
        visible: false,
      },
      plotOptions: {
        series: {
          marker: {
            enabled: false,
          },
          states: {
            hover: {
              enabled: false,
            },
          },
        },
      },
      series: [
        {
          type: 'area',
          color: basicColor,
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [
                0,
                ReactHighcharts.Highcharts.Color(basicColor)
                  .setOpacity(0.2)
                  .get('rgba'),
              ],
              [
                1,
                ReactHighcharts.Highcharts.Color(basicColor)
                  .setOpacity(0)
                  .get('rgba'),
              ],
            ],
          },
          data: seriesArr,
        },
      ],
    };
    if (data == null || data.indicator_value == null) {
      return basicConfig;
    }
    const rawchartJson = JSON.parse(data.indicator_value);
    let timearr = [];

    for (const key in rawchartJson) {
      if (Object.prototype.hasOwnProperty.call(rawchartJson, key)) {
        timearr.push(key);
      }
    }
    timearr = timearr.sort();
    for (const k of timearr) {
      const value = parseFloat(rawchartJson[k]);
      seriesArr.push(value);
    }
    return basicConfig;
  };
  gotoStockDetail = (stockCode, stockName) => {
    const {
      com_uni_code,
      abc_code,
      sec_uni_code,
      sec_type,
      sec_name,
      sec_small_type,
    } = this.state.stockInfo;
    const newPage = window.open();
    let url;
    if (sec_type === 1004003) {
      // 基金
      if (sec_small_type === 1004003001) {
        // 场内基金
        url = `${COMPRE_ANALYST}/entity-search/fund/${
          abc_code.split('.')[0]
        }.OF?sec_uni_code=${sec_uni_code}`;
      } else {
        url = `${COMPRE_ANALYST}/entity-search/fund/${abc_code}?sec_uni_code=${sec_uni_code}`;
      }
    } else {
      // 股票
      url = `${COMPRE_ANALYST}/entity-search/listed-company?stock_code=${abc_code}&stock_name=${sec_name}&com_uni_code=${com_uni_code}&sec_uni_code=${sec_uni_code}`;
    }
    if (url) {
      newPage.location.href = url;
    } else {
      newPage.location.href =
        `${window._External_Site_.analyst
        }/entity-search/listed-company?stock_code=${
          stockCode
        }&stock_name=${
          stockName
        }&com_uni_code=${
          com_uni_code
        }&sec_uni_code=${
          sec_uni_code}`;
    }
  };
  getContent = () => {
    let showContent = '';
    const { stockName, stockCode } = this.props;
    const { isLoading } = this.props.stockStore;
    const resp = this.props.stockStore.stockDetail;
    if (resp && resp.f9) {
      const pctchange = resp.f9.differ_range
        ? `${resp.f9.differ_range > 0 ? '+' : ''}${utils.toDecimal(
          resp.f9.differ_range,
          2
        )}%`
        : '--';
      const totalMarketValue = resp.f9.total_market_value
        ? utils.toDecimal(resp.f9.total_market_value / 100000000, 2)
        : '--';
      let currentPrice = resp.f9.close_price
        ? utils.toDecimal(resp.f9.close_price, 2)
        : '--';
      const peValue = resp.f9.pe ? utils.toDecimal(resp.f9.pe, 2) : '--';
      const zdNum = resp.f9.differ
        ? `${resp.f9.differ > 0 ? '+' : ''}${utils.toDecimal(
          resp.f9.differ,
          2
        )}`
        : '--';

      let isUp =
        resp.f9.differ_range === 0
          ? 'eq'
          : resp.f9.differ_range > 0
            ? 'up'
            : 'down';
      if (resp.suspend) {
        currentPrice = '停牌';
        isUp = 'eq';
      }
      const configData = this.getStockChart();
      showContent = (
        <div className={`stock_popover ${isUp}`}>
          <div>
            <ReactHighcharts config={configData} />
          </div>
          <div className={'sotck_title'}>
            <a onClick={this.gotoStockDetail.bind(this, stockCode, stockName)}>
              {`${stockName}(${stockCode})`}
            </a>
          </div>
          <div className={'up_or_down'}>
            <div className={'center_middle'}>{currentPrice}</div>
            <div className={'center_middle'}>
              <div className={'middle right'} style={{ width: '50%' }}>
                {/* <img className={isUp === 'up' ? '' : 'display_none'} src={up} alt={up} style={{ width: '7px', height: '11px' }} />
                <img className={isUp === 'down' ? '' : 'display_none'} src={down} alt={down} style={{ width: '7px', height: '11px' }} /> */}
                <span style={{ paddingLeft: '12px' }}>{zdNum}</span>
              </div>
              <Divider type="vertical" style={{ marginTop: '3px' }} />
              <span style={{ width: '50%' }}>{pctchange}</span>
            </div>
          </div>
          <div className={'info center_middle'}>
            <div className={'center_middle'} style={{ width: '50%' }}>
              <div>
                <div className={'center info_num'}>{totalMarketValue}</div>
                <div className={'center info_title'}>总市值(亿)</div>
              </div>
            </div>
            <Divider
              type="vertical"
              style={{ color: '#ddd', height: '30px', marginTop: '3px' }}
            />
            <div className={'center_middle'} style={{ width: '50%' }}>
              <div>
                <div className={'center info_num'}>{peValue}</div>
                <div className={'center info_title'}>PE值</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        {isLoading === false ? (
          showContent
        ) : (
          <div
            className="loading-wrap"
            style={{ width: '255px', height: '150px' }}
          >
            <Loading />
          </div>
        )}
      </div>
    );
  };
  handleVisible = (visible) => {
    const { stockCode } = this.props;
    if (visible) {
      this.props.stockStore.fetchStockDetail('fetchStockDetail', { stockCode });
    }
  };
  handleClick = () => {
    const { stockCode, stockName, clickStockCallback } = this.props;
    if (clickStockCallback) {
      clickStockCallback(stockName, stockCode);
    } else {
      window.location.href =
        `/search?id=0&selected=company,${stockName}&type=0`;
    }
  };
  parseFloatNum = (val) => {
    if (!(Math.abs(val) >= 0)) return '--';
    return utils.formatMoney(parseFloat(val), 2);
  };

  render() {
    const { stockName, stockCode, titleBold } = this.props;
    return (
      <div
        className={`stock_container ${
          stockCode.length > 0 ? '' : 'display_none'
        }`}
      >
        {!this.props.disabled && !this.state.disabled ? (
          <Popover
            placement="bottomLeft"
            content={this.getContent()}
            onVisibleChange={this.handleVisible}
            overlayClassName={'stock_card'}
          >
            <div
              className={'stock_name'}
              onClick={this.handleClick}
              style={{ fontWeight: titleBold || '700' }}
            >{`${stockName} ${stockCode}`}</div>
          </Popover>
        ) : (
          <div
            className="stock_name"
            onClick={this.handleClick}
            style={{ fontWeight: titleBold || '700' }}
          >{`${stockName} ${stockCode}`}</div>
        )}
      </div>
    );
  }
}
