import React, { Component, Fragment } from 'react';
import { Divider, Input, message, Button, Tooltip, Icon } from 'antd';
import { SourceAndAuthorList, MessageTypeAndDate, SummaryAndMasterImage } from '../CardPublic';
import LongString from '../LongString';
import Utils from '../../lib/utils';
import './index.scss';
import logo from './app_log.png';

export default class NewsOrWeiChatCard extends Component {
  static cardType = 'C_001'
  // constructor(props) {
  //   super(props);
  // }
  static defaultProps = {
    data: {
      title: '',
      summary: '',
      masterImageUrl: null,
      source: '',
      author: '',
      infoType: '资讯',
      publishAt: '',
      linkUrl: '',
      cardStatus: 'detail',
    },
    keyWord: '',
  }
  componentDidMount() {
  }
  render() {
    const { data: { title, summary, masterImageUrl, source, author, infoType, publishAt, id, cardStatus }, keyWord } = this.props;
    return (
      <div className="news_or_weichat_card_container">
        <a href={`${Utils.getServerUrl(1, 'news')}#/search/detail/${id}`} target="_blank">
          <div className="card_title str_ellpsis_2" dangerouslySetInnerHTML={{ __html: Utils.highLightStr(title, keyWord) }} />
          {/* <LongString content={title} lines={2} lineHeight={22} className="card_title" keyWord={keyWord} /> */}
          {
            // cardStatus === 'detail' && (
            <Fragment>
              <SummaryAndMasterImage data={{ masterImageUrl, summary, keyWord }} />
              <div style={{ marginTop: '10px ' }}>
                <SourceAndAuthorList source={source} authorList={author} />
              </div>
            </Fragment>
            // )
          }
          <MessageTypeAndDate messageType={infoType} date={publishAt} />
        </a>
      </div>
    );
  }
}

