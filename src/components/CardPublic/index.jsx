import React, { Component } from 'react';
import { Divider, Input, message, Button, Tooltip } from 'antd';
import LongString from '../LongString';
import Utils from '../../lib/utils';
import './index.scss';
import logo from './app_log.png';

export default class CardPublic {

}
// 机构和作者展示组件
export function SourceAndAuthorList(props) {
  const { source, authorList } = props;
  return (
    <div className="card_source_author_container middle">
      {
        source && source.length > 0 && <div className="card_source">{source}</div>
      }
      {
        source && source.length > 0 && authorList && authorList.length > 0 && <Divider type="vertical" style={{ marginTop: '3px', height: '0.8em' }} />
      }
      {
        authorList && (authorList instanceof Array) && authorList.length > 0 && (
          <div className="card_author middle">
            {
              (authorList).map((item) => {
                return (
                  <div key={item} style={{ marginRight: '5px' }}>{item}</div>
                );
              })
            }
          </div>
        )
      }
      {
        authorList && !(authorList instanceof Array) && (typeof authorList === 'string') && (
          <div className="card_author middle">{authorList}</div>
        )
      }
    </div>
  );
}

// 来源和时间的展示组件
export function MessageTypeAndDate(props) {
  const { messageType, date } = props;
  return (
    <div className="card_message_type_container middle">
      <span className="card_message_from">{messageType}</span>
      <span style={{ color: '#ddd', margin: '0 5px' }}>•</span>
      <span>{date && Utils.getFormatDateString(date)}</span>
    </div>
  );
}

// 简介和图片展示组件
export function SummaryAndMasterImage(props) {
  const { masterImageUrl, summary, keyWord } = props.data;
  return (
    <div className={`space_between card_summary_image_container ${summary && summary.length > 0 ? '' : 'display_none'}`}>
      <div className="card_summary str_ellpsis_2" dangerouslySetInnerHTML={{ __html: Utils.highLightStr(summary, keyWord) }} />
      {/* <LongString content={summary} lines={2} className="card_summary" keyWord={keyWord} /> */}
      {
        masterImageUrl && (
          <img className="card_image" src={masterImageUrl} alt={masterImageUrl} />
        )
      }
    </div>
  );
}
// 评级小卡片
export class RatingCard extends Component {
  getRatingColor = (rating) => {
    let color = '#DD4B39';
    if (!rating) return color;
    if (rating.indexOf('增持') > -1) color = '#EF8A46';
    if (rating.indexOf('中性') > -1) color = '#F8CB49';
    if (rating.indexOf('减持') > -1) color = '#7FB800';
    if (rating.indexOf('卖出') > -1) color = '#40A176';
    return color;
  }
  clickRating = (value) => {
    const { clickRating } = this.props;
    if (clickRating) clickRating(value);
  }
  render() {
    const { rating, clickRating } = this.props;
    return (
      <div className={`card_rating ${clickRating ? 'cursor_pointer' : ''} ${rating.length > 0 ? '' : 'display_none'}`}
        style={{ backgroundColor: this.getRatingColor(rating) }}
        onClick={() => { this.clickRating(rating); }}
      >
        {rating}
      </div>
    );
  }
}
