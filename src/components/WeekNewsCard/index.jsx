import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Divider, Input, message, Button, Tooltip, Icon, List } from 'antd';
import LongString from '../LongString';
import Utils from '../../lib/utils';
import './index.scss';

export default class WeekNewsCard extends Component {
  static cardType = 'C_003';
  // constructor(props) {
  //   super(props);
  // }
  componentDidMount() {
  }
  render() {
    const { flashNewsDate, itemList } = this.props;
    // 今天
    const today = moment();
    // 是否显示顶部日期
    let isShow = true;
    if (moment(today.format('YYYY-MM-DD')).isSame(moment(flashNewsDate).format('YYYY-MM-DD'))) {
      isShow = false;
    } else {
      isShow = true;
    }
    return (
      <div className="week_news_card_container" >
        {
          isShow && (
            <div className="card_day_date">
              <span>{moment(flashNewsDate).format('MMM DD')}日</span>
              <span>{moment(flashNewsDate).format('dddd')}</span>
            </div>
          )
        }
        <List
          itemLayout="horizontal"
          dataSource={itemList || []}
          renderItem={item => (
            <List.Item>
              <ItemNewCard data={item} showMore lines={3} lineHeight={22} />
            </List.Item>
          )}
        />
      </div>
    );
  }
}
// 单条快讯卡片
class ItemNewCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { publishTime, content } = this.props.data;
    return (
      <div className="card_item_container" >
        <div className="card_item_time center_middle">{moment(publishTime).format('HH:mm')}</div>
        <LongString content={content} lines={4} lineHeight={22} showMore />
      </div>
    );
  }
}