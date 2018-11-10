/**
 * @description 获奖分析师研报、我订阅的分析师研报卡片(组件名：AuthorCard)
 * @author wxiong
 * date: 2018-10-10
 */
import React, { PureComponent, Component, Fragment } from 'react';
import {
  Icon, Avatar,
  Divider, Button,
  Spin, Tooltip,
} from 'antd';
import { inject } from 'mobx-react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

import StringTruncate from '../StringTruncate';
import ask from '../../lib/ask';
import { COMPRE_ANALYST, REPORT_URL } from '../../env';

import './index.scss';

import jinniu from './images/icon_jinniu.png';
import xincaifu from './images/icon_xincaifu.png';

// 组件BEM基础类（Block）
const blockClass = 'author-card';

@withShowMore
class AuthorCard extends PureComponent {
  static cardType = 'C_007';

  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
      showMoreStatus: 'pending',
    };
  }

  openAuthorPage = (id) => {
    window.open(`${COMPRE_ANALYST}/entity-search/analyst?id=${this.props.authorId}`, '_blank');
  }

  openReportPage = (id) => {
    window.open(`${REPORT_URL}/report/article/${id}`);
  }

  showMoreBtnClickHandler = () => {
    const { showMore } = this.props;
    // this.setState({
    //   showMore: true,
    // }, () => {
    //   if (showMore)showMore(topicId, topicTitle, this.setState);
    // });
  }

  packBtnClickHandler = () => {
    this.setState({
      showMore: false,
    });
  }

  moreListBtnClickHandler = () => {
    this.openAuthorPage(this.props.authorId);
  }

  componentDidMount() {
    // shave('.author-card .brief-content', 234);
  }
  render() {
    const {
      className,
      authorName, authorIcon,
      authorAwards, authorId,
      authorOrganization, authorDirection,
      moreBtnVisible, moreStatus,
      reportList, keyword,
      moreBtnClickHandler, showMore,
      packBtnClickHandler,
    } = this.props;
    const cardClassName = classNames(blockClass, className);
    const firstBrief = reportList[0];
    const listMore = reportList.slice(1);
    return (
      <div className={cardClassName}>
        {/* <Button
          className="sub-btn"
          icon="plus"
          size="small"
        >
          订阅
        </Button> */}
        <div className="header">
          <Avatar
            icon="user"
            src={authorIcon}
            alt="头像图片"
            onClick={this.openAuthorPage}
          />
          <div className="header-right">
            <div className="header-right-top">
              <span
                className="author-name"
                onClick={this.openAuthorPage}
              >
                {authorName}
              </span>
              {
                authorAwards.map(item => (
                  <Tooltip
                    key={item}
                    title={
                      <span className="tooltip-title">
                        {item === jinniu ? '中国证券业分析师金牛奖' : '新财富最佳分析师'}
                      </span>
                    }
                  >
                    <img key={item} src={item} alt="honor-img" />
                  </Tooltip>
                ))
              }
            </div>
            <div className="header-right-bottom">
              <StringTruncate maxWidth={188}>
                <span className="company-name">
                  {authorOrganization}
                </span>
                <Divider type="vertical" />
                <span className="research-direction">
                  {authorDirection}
                </span>
              </StringTruncate>
            </div>
          </div>
        </div>
        <Divider />
        <div
          className="brief-content"
          onClick={() => { this.openReportPage(firstBrief.id); }}
        >
          <StringTruncate maxHeight={66} truncateTargetSelector=".brief-content-ellipse" >
            {
              firstBrief.stockCode && firstBrief.stockName &&
              <span className="company-stock-code">{`${firstBrief.stockName} ${firstBrief.stockCode}`}</span>
            }
            <span className="brief-content-ellipse">
              {firstBrief.title}
            </span>
          </StringTruncate>
        </div>
        <div className="brief-footer">
          <span className="author-list">
            {firstBrief.authorList.join(' ')}
          </span>
          <span className="round-dot" />
          <span className="pub-time">
            {moment(firstBrief.pubTime).format('YYYY.MM.DD')}
          </span>
          {
            moreBtnVisible &&
            <i className="show-more-btn" onClick={moreBtnClickHandler}>展开</i>
          }
        </div>
        {
          moreStatus === 'pending' &&
          <Spin size="small" delay={200} />
        }
        {
          moreStatus === 'error' &&
          <span>暂无更多</span>
        }
        {
          moreStatus === 'done' && showMore === true &&
          <Fragment>
            {
              listMore.length === 0 &&
              <span>暂无更多</span>
            }
            {
              listMore.length > 0 &&
              <Fragment>
                <Divider />
                <ul className="brief-list">
                  {
                    listMore.map((item, index, arr) => {
                      return (
                        <Fragment key={`${index}-${item.id}`}>
                          <AuthorCardItem {...item} briefClickHanlder={this.openReportPage} />
                          {
                            index !== arr.length - 1 &&
                            <Divider />
                          }
                        </Fragment>
                      );
                    })
                  }
                </ul>
                <Divider />
                <div className={`${blockClass}__footer`}>
                  <span className="pack-list-btn" onClick={packBtnClickHandler}>
                收起
                  </span>
                  <span className="read-more-btn" onClick={this.moreListBtnClickHandler}>
                更多
                  </span>
                </div>
              </Fragment>
            }
          </Fragment>
        }
      </div>
    );
  }
}


AuthorCard.defaultProps = {
  direction: '',
  honors: [
    { imgUrl: jinniu },
    { imgUrl: xincaifu },
  ],
  image: 'https://abc-crawler.oss-cn-hangzhou.aliyuncs.com/sac.net_4010d62e-5c69-38d2-8c07-4fb168a9b8d3.jpg',
  item: [
    {
    },
  ],
};

class AuthorCardItem extends PureComponent {
  render() {
    const {
      id, stockName,
      stockCode, title,
      authorList, pubTime,
      briefClickHanlder,
    } = this.props;
    return (
      <Fragment>
        <li className="brief-item">
          <p
            className="brief-content"
            onClick={() => { briefClickHanlder(id); }}
          >
            <StringTruncate maxHeight={66} truncateTargetSelector=".brief-content-ellipse" >
              {
                stockCode && stockName &&
                <span className="company-stock-code">{`${stockName} ${stockCode}`}</span>
              }
              <span className="brief-content-ellipse">
                {title}
              </span>
            </StringTruncate>
          </p>
          <div className="brief-footer">
            {
              authorList &&
              <Fragment>
                <span className="author-list">
                  {authorList.join(' ')}
                </span>
                <span className="round-dot" />
              </Fragment>
            }
            <span className="pub-time">
              {moment(pubTime).format('YYYY.MM.DD')}
            </span>
          </div>
        </li>
      </Fragment>
    );
  }
}

function withShowMore(WrappedComponent) {
  class WithShowMore extends Component {
    state = {
      status: '',
      showMore: false,
      list: [],
      moreBtnVisible: true,
    }

    loaded = false;

    askMore = async () => {
      if (this.loaded) {
        this.setState({
          showMore: true,
          moreBtnVisible: false,
        });
        return false;
      }
      this.setState({
        status: 'pending',
        moreBtnVisible: false,
      });
      try {
        const res = await ask('privateReport', {
          params: {
            order_by: 'all_score',
            offset: 0,
            page: 1,
            limit: 8,
            selected: `author,${this.props.authorName}`,
          },
        });

        if (res.code !== 200) {
          throw new Error(`Reponse exception ${res.code} ${res.message}`);
        }

        if (res.data && res.data.length) {
          this.loaded = true;
          this.setState({
            status: 'done',
            showMore: true,
            moreBtnVisible: false,
            list: res.data.slice(1).map((item) => {
              return {
                id: item.id,
                stockName: item.stockname,
                stockCode: item.stockcode,
                title: item.title,
                authorList: item.author,
                pubTime: item.time * 1000,
              };
            }),
          });
        }
      } catch (error) {
        this.setState({
          status: 'error',
          showMore: true,
          moreBtnVisible: false,
        });
        console.error(error);
      }
    }

    debouncedAsk = _.debounce(this.askMore, 200)

    closeMore = () => {
      this.setState({
        showMore: false,
        moreBtnVisible: true,
      });
    }

    render() {
      const { reportList } = this.props;
      const { status, list, showMore, moreBtnVisible } = this.state;
      const arr = reportList.slice().concat(list);
      return (
        <WrappedComponent
          {...this.props}
          reportList={arr}
          moreBtnClickHandler={this.debouncedAsk}
          packBtnClickHandler={this.closeMore}
          moreStatus={status}
          showMore={showMore}
          moreBtnVisible={moreBtnVisible}
        />
      );
    }
  }

  hoistNonReactStatics(WithShowMore, WrappedComponent);

  return WithShowMore;
}

export default AuthorCard;