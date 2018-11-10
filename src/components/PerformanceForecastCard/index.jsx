/**
 * @description 业绩预告（组件名称：PerformanceForecastCard）
 * @author wxiong
 * date: 2018-10-10
 */
import React, { PureComponent, Component } from 'react';
import {
  Icon, Avatar,
  Divider, Button,
} from 'antd';
import classNames from 'classnames';
import moment from 'moment';

import ask from '../../lib/ask';
import { FILING_URL } from '../../env';

import StockCard from '../StockCard';

import './index.scss';

// 组件BEM基础类（Block）
const blockClass = 'performance-forecast-card';


class PerformanceForecastCard extends PureComponent {
  static cardType = 'C_010';

  constructor(props) {
    super(props);
    this.state = {
      showMoreStatus: 'pending',
    };
  }

  clickHandler = () => {
    window.open(`${FILING_URL}/detail/text?srcId=${this.props.id}`);
  }

  render() {
    const {
      className, stockName,
      stockCode, title,
      forcastProfit, lastYearProfit,
      differ, infoType,
      format, pageNumber, pubTime, id,
    } = this.props;
    const cardClassName = classNames(blockClass, className);
    return (
      <div className={cardClassName}>
        <div className="header">
          {
            stockCode && stockName &&
              <span className="company-stock-code">{`${stockName} ${stockCode}`}</span>
          }
          {title}
          <a
            className="icon-perspective"
            target="_blank"
            rel="noopener noreferrer"
            onClick={evt => evt.stopPropagation}
            href={`https://v1.analyst.ai/notice/notice-detail?src_id=${id}&tab=perspectiveviewer`}
          >
            <font>公告透视</font>
          </a>
        </div>
        <div className="market-brief">
          <div className="market-brief-left">
            <p className="market-index">
              预计净利润
              <span className="unit">(亿)</span>
            </p>
            <p className="market-value">
              {forcastProfit}
            </p>
          </div>
          <div className="market-brief-right">
            <p className="last-year-compare">
              去年
              <span className="last-year-value">
                {lastYearProfit} 万
              </span>
            </p>
            <p className="market-change">
              同比
              <span className="market-change-range">
                {differ}%
              </span>
            </p>
          </div>
        </div>
        <div className="notice-info">
          <span className="notice-info-item">
            {infoType || '公告'}
          </span>
          <span className="round-dot" />
          {
            (format || pageNumber) &&
            <span className="notice-info-item">
              {`${format} ${pageNumber}页`}
            </span>
          }
          {
            (format || pageNumber) &&
            <span className="round-dot" />
          }
          <span className="notice-info-item">
            {moment(pubTime).format('YYYY.MM.DD')}
          </span>
        </div>
      </div>
    );
  }
}

export default PerformanceForecastCard;