import React, { Component, Fragment } from 'react';
import { Divider, Input, message, Button, Tooltip, Icon } from 'antd';
import moment from 'moment';
import { SourceAndAuthorList, MessageTypeAndDate } from '../CardPublic';
import LongString from '../LongString';
import Utils from '../../lib/utils';
import './index.scss';
import logo from './app_log.png';

export default class SelectionNewsCard extends Component {
  static cardType = 'C_002';
  // constructor(props) {
  //   super(props);
  // }
  static defaultProps = {
    data: {
      title: '',
      masterImageUrl: null,
      source: '',
      author: '',
      infoType: '资讯',
      publishAt: moment(),
    },
    keyWord: '',
  }
  componentDidMount() {
  }
  render() {
    const { data: { title, masterImageUrl, source, author, infoType, publishAt, id }, keyWord } = this.props;
    return (
      <div className="selection_news_card_container">
        <a href={`${Utils.getServerUrl(1, 'news')}#/news/detail/${id}`} target="_blank">
          {
            masterImageUrl && (
              <img className="card_image" src={masterImageUrl} alt={masterImageUrl} />
            )
          }
          {/* {
            !masterImageUrl && <img className="card_image" src={logo} alt={logo} />
          } */}
          <div className="card_info_container">
            <div className="card_title str_ellpsis_2" dangerouslySetInnerHTML={{ __html: Utils.highLightStr(title, keyWord) }} />
            {/* <LongString content={title} lines={2} lineHeight={22} className="card_title" keyWord={keyWord} /> */}
            <SourceAndAuthorList source={source} authorList={author} />
            <MessageTypeAndDate messageType={infoType} date={publishAt} />
          </div>
        </a>
      </div>
    );
  }
}
