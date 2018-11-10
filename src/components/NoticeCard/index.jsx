/**
 * @description 公告(组件名：NoticeCard)
 * @author wxiong
 * date: 2018-10-10
 */
import React, { PureComponent, Component, Fragment } from 'react';
import {
  Icon, Avatar,
  Divider, Button,
  Tooltip,
} from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import Cookies from 'js-cookie';

import StringTruncate from '../StringTruncate';

import { FILING_URL, V1_URL } from '../../env';
import { downloadFile } from '../../lib/utils';

import './index.scss';


const curToken = Cookies.get('token');
const curUserId = Cookies.get('userId');
// 组件BEM基础类（Block）
const blockClass = 'notice-card';


class NoticeCard extends PureComponent {
  static cardType = 'C_008';

  constructor(props) {
    super(props);
    this.state = {
      showMoreStatus: 'pending',
    };
  }

  clickHandler = () => {
    window.open(`${FILING_URL}/detail/text?srcId=${this.props.id}`);
  }

  download = () => {
    downloadFile(this.props.fileUrl, this.props.fileName);
  }

  render() {
    const {
      className, stockName,
      stockCode, title,
      brief, industry,
      category, tagList,
      format, pageNumber,
      pubTime, id,
      infoType, fileUrl,
      isPerspective,
    } = this.props;
    const cardClassName = classNames(blockClass, className);
    return (
      <div
        className={cardClassName}
        onClick={this.clickHandler}
      >
        <div className="header">
          <StringTruncate maxHeight={70} truncateTargetSelector=".brief-content-ellipse">
            {
              stockCode && stockName &&
              <span className="company-stock-code">{`${stockName} ${stockCode}`}</span>
            }
            <span className="brief-content-ellipse">
              {title}
            </span>
            {
              isPerspective &&
              <Tooltip title={<span className="tooltip-title">公告透视</span>}>
                <a
                  className="icon-perspective"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={evt => evt.stopPropagation()}
                  href={`${V1_URL}/notice/notice-detail?src_id=${id}&tab=perspectiveviewer&token=${curToken}&userId=${curUserId}`}
                >
                  <font>公告透视</font>
                </a>
              </Tooltip>
            }
          </StringTruncate>
        </div>
        { brief &&
          <div
            className="company-brief"
          >
            {brief}
          </div>
        }
        <div className="notice-type">
          <span className="notice-type-item">
            {industry}
          </span>
          {
            industry &&
            <Divider type="vertical" />
          }
          <span className="notice-type-item">
            {category}
          </span>
        </div>
        <div className="notice-tag">
          {
            tagList.map((item, index, array) => {
              let clsName = '';
              if (item === '利好' || item === '业绩预增' || item === '业绩增') {
                clsName = ' red';
              } else if (item === '利空' || item === '业绩预减' || item === '业绩减') {
                clsName = ' green';
              }
              return (
                <Fragment key={index}>
                  <span className={`notice-tag-item${clsName}`}>{item}</span>
                  {index !== array.length - 1 && <Divider type="vertical" />}
                </Fragment>
              );
            })
          }
        </div>
        <div
          className="notice-info"
          onClick={evt => evt.stopPropagation()}
        >
          <span className="notice-info-item notice-info-type-item">
            {infoType || '公告'}
          </span>
          <span className="round-dot" />
          {
            (format || (pageNumber || pageNumber === 0)) &&
            <span className="notice-info-item">
              <a onClick={this.download}>
                {`${format && format.toUpperCase()} ${(pageNumber || pageNumber === 0) ? `${pageNumber}页` : ''}`}
              </a>
            </span>
          }
          {
            (format || (pageNumber || pageNumber !== 0)) &&
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

export default NoticeCard;