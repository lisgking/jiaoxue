import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Divider, Input, Avatar, Button, Tooltip, Icon, List } from 'antd';
import LongString from '../LongString';
import { SummaryAndMasterImage } from '../CardPublic';
import Utils from '../../lib/utils';
import test from './app_log.png';
import './index.scss';

// export default class WeiChatCard extends Component {
//   static cardType = 'C_004'
//   // constructor(props) {
//   //   super(props);
//   // }
//   componentDidMount() {
//   }
//   render() {
//     const { dataList = [] } = this.props;
//     return (
//       <div className="weichat_card_container">
//         {
//           dataList.map((obj) => {
//             return (
//               <DayArticleCard dayData={obj} key={obj.weiChatNo} />
//             );
//           })
//         }
//       </div>
//     );
//   }
// }

// 当天公众号文章
export default class WeiChatCard extends Component {
  static cardType = 'C_004'
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }
  componentDidMount() {
  }
  clickHandle = () => {
    const { clickCallback } = this.props;
    if (clickCallback) clickCallback();
  }
  linkDetail = (chatNo) => {
    const linkUrl = Utils.getServerUrl(1, 'news');
    window.open(linkUrl);
  }
  render() {
    const { data: { publishAt, weiChatNo, weiChatImage, weiChatStatus, articleList = [] }, keyWord } = this.props;
    const { isOpen } = this.state;
    const showDay = moment(publishAt).format('YYYY-MM-DD');
    return (
      <div className="weichat_card_container" >
        <div className="card_day_top space_between">
          <div className="card_day_header middle">
            {
              weiChatImage && <Avatar size={32} src={weiChatImage} style={{ marginRight: '7px' }} />
            }
            {

              !weiChatImage && <Avatar size={32} icon="user" style={{ marginRight: '7px' }} />
            }
            <div className="card_chatno_container">
              <div>{weiChatNo}</div>
              <div>{showDay}</div>
            </div>
          </div>
          {/* {
            !weiChatStatus && <Button className="card_chat_subcribe" size="small" icon="plus" onClick={() => { this.clickHandle(weiChatStatus); }}>订阅</Button>
          }
          {
            weiChatStatus && <Button className="card_chat_subcribed" size="small" onClick={() => { this.clickHandle(weiChatStatus); }} >已订阅</Button>
          } */}
        </div>
        <List
          itemLayout="horizontal"
          dataSource={isOpen ? articleList : articleList.slice(0, 2)}
          renderItem={(item, index) => (
            <List.Item>
              <ItemNewCard data={item} index={index} keyWord={keyWord} />
            </List.Item>
          )}
        />
        {
          articleList.length > 2 && <Divider style={{ margin: '0px' }} />
        }
        <div className="space_between">
          {
            isOpen && articleList.length > 2 ? <div className="card_day_open_btn" onClick={() => { this.setState({ isOpen: !isOpen }); }}>收起</div> : <div />
          }
          {
            articleList.length > 2 && <div className="card_day_open_btn right"
              onClick={() => {
                if (isOpen) {
                  this.linkDetail(weiChatNo);
                } else {
                  this.setState({ isOpen: !isOpen });
                }
              }}
            >{isOpen ? '更多' : '展开'}</div>
          }
        </div>
      </div>
    );
  }
}

// 单条快讯卡片
function ItemNewCard(props) {
  const { data: { title, first_image_oss: masterImageUrl, url, id }, index, keyWord } = props;
  const linkUrl = `${Utils.getServerUrl(1, 'news')}/#/search/detail/${id}`;
  return (
    <div className="card_item_container" >
      <a href={linkUrl} target="_blank">
        {
          index === 0 && (
            <div className="card_item_first">
              <div className="card_summary str_ellpsis_2" dangerouslySetInnerHTML={{ __html: Utils.highLightStr(title, keyWord) }} />
              {/* <LongString content={title} lines={2} lineHeight={22} className="card_summary" keyWord={keyWord} /> */}
              {
                masterImageUrl && (
                  <img className="card_image center" src={masterImageUrl} alt={masterImageUrl} />
                )
              }
            </div>
          )
        }
        {
          index !== 0 && <SummaryAndMasterImage data={{ masterImageUrl, summary: title, keyWord }} />
        }
      </a>
    </div>
  );
}