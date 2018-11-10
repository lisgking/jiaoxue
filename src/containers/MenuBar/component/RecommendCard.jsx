
/**
 * 推荐看板
 */
import React, { Component } from 'react';
import { Tabs, Row, Col, Card, Avatar } from 'antd';
import { inject, observer } from 'mobx-react';
import Scrollbar from 'smooth-scrollbar';
import RecommendButton from './RecommendButton';
import './RecommendCard.scss';
// 综合
import Integration from '../images/Integration.png';
// 公告
import filing from '../images/filing.png';
// 研报
import report from '../images/report.png';
// 资讯
import news from '../images/news.png';


const { TabPane } = Tabs;

const getCardIcon = (category) => {
  let icon = '';
  switch (category) {
  case '综合看板':
    icon = Integration;
    break;
  case '公告看板':
    icon = filing;
    break;
  case '研报看板':
    icon = report;
    break;
  case '资讯看板':
    icon = news;
    break;
  case '团队消息':
    icon = news;
    break;
  case '团队关注':
    icon = news;
    break;
  default:
    break;
  }
  return icon;
};

@inject('laneStore')
@observer
export default class RecommendCard extends Component {
  static defaultProps = {
    onClick: () => { },
    boardItems: ['团队消息', '团队关注'],
  }
  state = {}

  componentDidMount = () => {
    const options = {
      thumbMinSize: 20,
    };
    Scrollbar.init(document.querySelector('.ant-drawer-body'), options);
  }

  callback = () => {

  }

  onChangeRecommend = (subscribeId, checked) => {
    const { onClick } = this.props;
    const { addLane, deleteLane } = this.props.laneStore;
    if (checked) {
      deleteLane({ subscribeId });
    } else {
      addLane(subscribeId);
    }
    if (onClick) {
      onClick(subscribeId, checked);
    }
  }

  render() {
    const { laneStore, boardItems } = this.props;
    const { lanes, getBoardItems } = laneStore;
    const list = getBoardItems;
    return (
      <div className="recommendCard" ref={(node) => { this.node = node; }}>
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="推荐" key="1">
            {
              list.map((card) => {
                const { itemList, id, category } = card;
                const icon = getCardIcon(category);
                return (
                  <Card
                    bordered={false}
                    key={id}
                    title={
                      <div className="middle">
                        <Avatar size={20} src={icon} />
                        <span style={{ marginLeft: '10px' }}>{category}</span>
                      </div>
                    }
                  >
                    <Row gutter={16}>
                      {
                        itemList.map((item) => {
                          return (
                            <Col key={item.id} span={8}>
                              <RecommendButton
                                key={item.id}
                                id={`Y_${item.templateId}`}
                                name={item.name}
                                checked={item.checked}
                                lanes={lanes}
                                onChange={this.onChangeRecommend}
                              />
                            </Col>
                          );
                        })
                      }
                    </Row>
                  </Card>
                );
              })
            }
          </TabPane>
          {/* <TabPane disabled tab="自定义" key="2">Content of Tab Pane 2</TabPane> */}
        </Tabs>
      </div >
    );
  }
}