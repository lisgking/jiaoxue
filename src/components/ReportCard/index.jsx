import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Divider, Input, message, Button, Tooltip, Icon } from 'antd';
import { defaultProps } from 'recompose';
import { RatingCard } from '../CardPublic';
import StringTruncate from '../StringTruncate';
import LongString from '../LongString';
import Utils from '../../lib/utils';
import './index.scss';
import honorImg from './icon_honor.png';

export default class ReportCard extends Component {
  static cardType = 'C_005'
  // constructor(props) {
  //   super(props);
  // }
  static defaultProps = {
    cardStatus: 'detail',
  }
  componentDidMount() {
  }
  downloadFile = (e) => {
    const { title, url } = this.props.data;
    const downloadUrl = Utils.getDownloadUrl(title, url);
    // 阻断冒泡
    e.stopPropagation();
    if (downloadUrl) document.location.href = downloadUrl;
  }
  getShowTitle = () => {
    const { stockname = '', stockcode = '', title = '' } = this.props.data;
    const strLength = 50 - (stockname.length + stockcode.length);
    let str = '';
    if (strLength >= title.length) {
      str = title;
    } else {
      str = `${title.substr(0, strLength)}...`;
    }
    // return str;
    return title;
  }
  render() {
    const { data, keyWord } = this.props;
    const { stockname, stockcode, title, source, category, industry1, author = [],
      analyst_honor, tag = [], infoType, publishAt, filePages, id, fileType, rating, cardStatus, url } = data;
    let summary = data.summary || '';
    if (summary && summary.length > 0) {
      // 去除所有的空格
      summary = summary.replace(/\s*/g, '');
      // 去除所有的<br>
      const reg = new RegExp('<br>', 'gi');
      summary = summary.replace(reg, '');
    }
    return (
      <div className="report_card_container">
        <a href="javascript:void(0);" className="report_card_title_container" onClick={() => { window.open(`${Utils.getServerUrl(1, 'report')}/report/article/${id}`); }}>
          <div className="report_card_title_container">
            <StringTruncate maxHeight={66} truncateTargetSelector=".card_title" >
              {
                stockcode && stockcode.length > 0 && (
                  <div className="card_stock_container">
                    <span>{`${stockname} ${stockcode}`}</span>
                  </div>
                )
              }
              <div className="card_title" dangerouslySetInnerHTML={{ __html: Utils.highLightStr(this.getShowTitle(), keyWord) }} />
              <div className="card_rating_container">
                {
                  rating && rating.length > 0 && <RatingCard rating={rating} />
                }
              </div>
            </StringTruncate>
          </div>
          {
            summary && summary.length > 0 && cardStatus !== 'simple' && <div className="report_card_summary_container str_ellpsis_3" dangerouslySetInnerHTML={{ __html: Utils.highLightStr(summary, keyWord) }} />
            // summary && summary.length > 0 && cardStatus !== 'simple' && <LongString content={summary} lines={3} lineHeight={20} keyWord={keyWord} className="report_card_summary_container" />
          }
          {
            cardStatus !== 'simple' && (
              <div className="card_source_category_container middle">
                {source && <span dangerouslySetInnerHTML={{ __html: source }} />}
                {
                  industry1 && (
                    <Fragment>
                      <Divider type="vertical" />
                      <span>{industry1}</span>
                    </Fragment>
                  )
                }
                {
                  category && (
                    <Fragment>
                      <Divider type="vertical" />
                      <span>{category}</span>
                    </Fragment>
                  )
                }
              </div>
            )
          }
          {
            author && author.length > 0 && cardStatus !== 'simple' && (
              <div className="card_author_container">
                {
                  author.map((authorName) => {
                    const hasHonor = analyst_honor.some((item) => {
                      return item.name === authorName;
                    });
                    return (
                      <span key={authorName} className="card_author middle">
                        {
                          hasHonor && <img className="card_author_honor" src={honorImg} alt={honorImg} />
                        }
                        <span dangerouslySetInnerHTML={{ __html: authorName }} />
                        {/* <Divider type="vertical" /> */}
                      </span>
                    );
                  })
                }
              </div>
            )
          }
          {
            tag && tag.length > 0 && cardStatus !== 'simple' && (
              <div className="card_tag_container">
                {
                  tag.map((tagName) => {
                    return (
                      <div key={tagName} className="card_tag middle">
                        <span className="card_tag_name">{tagName}</span>
                      </div>
                    );
                  })
                }
              </div>
            )
          }
          <div className="card_bottom_container middle">
            {
              infoType && <span className="card_message_from">{infoType}</span>
            }
            <span style={{ color: '#ddd', margin: '0 5px' }}>•</span>
            {
              fileType === '网页' && <span className="card_file" style={{ color: '#999999' }}>{`${fileType} ${filePages || '1'}页 `}</span>
            }
            {
              !(fileType === '网页') && <span className="card_file" onClick={(e) => { this.downloadFile(e); }}>{`${fileType} ${filePages || '1'}页 `}</span>
            }
            <span style={{ color: '#ddd', margin: '0 5px' }}>•</span>
            <span>{publishAt && moment(publishAt * 1000).format('YYYY.MM.DD')}</span>
          </div>
        </a>
      </div>
    );
  }
}
