import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Divider, Input, Avatar, Button, Tooltip, Spin, List } from 'antd';
import { SummaryAndMasterImage } from '../CardPublic';
import LongString from '../LongString';
import Utils from '../../lib/utils';
import test from './app_log.png';
import './index.scss';

export default class SubjectReportCard extends Component {
  static cardType = 'C_006'
  // constructor(props) {
  //   super(props);
  // }
  componentDidMount() {
  }
  render() {
    const { data = {}, keyWord } = this.props;
    return (
      <div className="subject_report_card_container">
        {data.topicUrl && <OneSubjectCard data={data} keyWord={keyWord} />}
        {!data.topicUrl && <div className="item_card"><ItemReportCard data={data} keyWord={keyWord} topicTitle={data.topicTitle} /></div>}
      </div>
    );
  }
}

// 单个专题卡片
class OneSubjectCard extends Component {
  static cardType = 'C_006'
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }
  componentDidMount() {
  }
  linkDetail = (topicUrl) => {
    window.open(topicUrl);
  }
  loadMore = (topicId, topicTitle, isOpen) => {
    const { showMore } = this.props;
    this.setState({ isOpen: !isOpen }, () => {
      if (showMore) showMore(topicId, topicTitle, this.setState);
    });
  }
  render() {
    const { data: { topicTitle = '', topicSub = '', topicUrl, topicImg: masterImageUrl, item: reportList = [], topicId, loading }, keyWord } = this.props;
    const { isOpen } = this.state;
    return (
      <div className="card_one_container" >
        <div className="card_one_top space_between">
          <div className="card_one_header">
            <a href={topicUrl} target="_blank">
              <div className="card_title">{topicTitle.length <= 6 ? topicTitle : `${topicTitle.substr(0, 6)}...`}</div>
              <div className="card_sub str_ellipsis">{topicSub}</div>
            </a>
          </div>
          {
            masterImageUrl && (
              <img className="card_image" src={masterImageUrl} alt={masterImageUrl} />
            )
          }

        </div>
        <Divider style={{ margin: '0' }} />
        <List
          itemLayout="horizontal"
          dataSource={isOpen ? reportList : reportList.slice(0, 1)}
          renderItem={item => (
            <List.Item>
              <ItemReportCard data={item} keyWord={keyWord} topicTitle={topicTitle} />
            </List.Item>
          )}
        />
        {
          loading === 'pending' && (
            <Fragment>
              <Divider style={{ margin: '0px' }} />
              <div className="center_middle" style={{ height: '60px' }}>
                <Spin />
              </div>
            </Fragment>
          )
        }
        <Divider style={{ margin: '0px' }} />
        <div className="space_between">
          {
            isOpen && reportList.length > 1 ? <div className="card_one_open_btn" onClick={() => { this.setState({ isOpen: !isOpen }); }}>收起</div> : <div />
          }
          {
            loading === 'pending' && <div className="card_one_open_btn_disabled right">更多</div>
          }
          {
            loading === 'done' && <div className="card_one_open_btn right"
              onClick={() => {
                if (isOpen) {
                  this.linkDetail(topicUrl);
                } else {
                  this.loadMore(topicId, topicTitle, isOpen);
                }
              }}
            >{isOpen && reportList.length > 1 ? '更多' : '展开'}</div>
          }
        </div>
      </div>
    );
  }
}

// 单条研报卡片
export class ItemReportCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
  }
  render() {
    const { data: { title, time, tag, id }, keyWord, topicTitle } = this.props;
    return (
      <div className="subject_report_card_item_container" >
        <a href={`${Utils.getServerUrl(1, 'report')}/report/article/${id}`} target="_blank">
          <div className="card_report_title str_ellpsis_2" dangerouslySetInnerHTML={{ __html: Utils.highLightStr(title, keyWord) }} />
          {/* <LongString content={title} lines={2} lineHeight={22} className="card_report_title" keyWord={keyWord} /> */}
        </a>
        <div className="card_bottom_container middle">
          <span className="card_message_tag">{topicTitle || (tag && tag.length > 0 && tag[0])}</span>
          {
            (topicTitle || (tag && tag.length > 0)) && <span style={{ color: '#ddd', margin: '0 5px' }}>•</span>
          }
          <span>{time && moment(time * 1000).format('YYYY.MM.DD')}</span>
        </div>
      </div>
    );
  }
}