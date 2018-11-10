/**
 * @description 业绩快报（组件名称：PerformanceResultCard）
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
const blockClass = 'performance-result-card';


class PerformanceResultCard extends PureComponent {
  static cardType = 'C_009';

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
      marketValue, marketValueDiffer,
      profitValue, profitValueDiffer,
      infoType, format,
      pageNumber, pubTime,
      id,
    } = this.props;

    const cardClassName = classNames(blockClass, className);
    return (
      <div
        className={cardClassName}
        onClick={this.clickHandler}
      >
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
              营收
              <span className="unit">(亿元)</span>
            </p>
            <p className="market-value">
              {marketValue}
            </p>
            <p className="market-change">
              同比
              <span className="market-change-range">
                {marketValueDiffer}%
              </span>
            </p>
          </div>
          <div className="market-brief-right">
            <p className="market-index">
              净利润
              <span className="unit">(亿元)</span>
            </p>
            <p className="market-value">
              {profitValue}
            </p>
            <p className="market-change">
              同比
              <span className="market-change-range">
                {profitValueDiffer}%
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

export default PerformanceResultCard;