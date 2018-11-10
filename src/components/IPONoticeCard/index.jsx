/**
 * @description IPO公告（组件名称：IPONoticeCard）
 * @author wxiong
 * date: 2018-10-10
 */
import React, { PureComponent, Component } from 'react';
import {
  Icon, Avatar,
  Divider, Button,
} from 'antd';
import moment from 'moment';
import { inject } from 'mobx-react';
import classNames from 'classnames';

import ask from '../../lib/ask';
import { FILING_URL } from '../../env';

import StockCard from '../StockCard';

import './index.scss';

// 组件BEM基础类（Block）
const blockClass = 'ipo-notice-card';

@inject(stores => ({ ...stores.xwStore.IPONoticeCard }))
class IPONoticeCard extends PureComponent {
  static cardType = 'C_011';

  clickHandler = () => {
    const { stockName } = this.props;
    window.open(`${FILING_URL}/search?id=0&type=0&selected=company,${stockName};categoryIds,S004004`);
  }

  render() {
    const {
      className, stockName,
      subscribeStockCode, issueAmount,
      issuePrice, issueTime,
    } = this.props;
    const cardClassName = classNames(blockClass, className);
    return (
      <div
        className={cardClassName}
        onClick={this.clickHandler}
      >
        <div className="header">
          <span className="stock-name">
            {stockName}
          </span>
          <span className="subscribe-stock-code">
            申购代码：{subscribeStockCode}
          </span>
        </div>
        <div className="issue-brief">
          <div className="issue-brief-left">
            <p className="issue-index">
              发行总数
              <span className="unit">(万股)</span>
            </p>
            <p className="issue-amount">
              {issueAmount}
            </p>
          </div>
          <div className="issue-brief-right">
            <p className="issue-index">
              发行价格
            </p>
            <p className="issue-price">
              {issuePrice}
            </p>
          </div>
        </div>
        <div className="issue-info">
          <span className="issue-date">
            申购日期：{moment(issueTime).format('YYYY.MM.DD')}
          </span>
          <span className="detail-btn">详情</span>
        </div>
      </div>
    );
  }
}

export default IPONoticeCard;