/**
 * @description Home
 * @date 2018.01.15
 * @author dhhuang1
 */


/**
 * 这个例子 里面包括 inject 的两种写法
 * 注释的是第一种写法
 * 未注释是第二种写法
 *
 * 函数的写法有几种 如果 不使用箭头函数 就要在 constructor
 * .bind(this)
 *
 */

// @inject((defaultStore) => {
//   console.log(defaultStore)
//   let stroe = defaultStore.defaultStore
//   return {
//     abc: stroe.abc,
//     arr: stroe.toList.map(item => { return item }),
//     addList: stroe.addList,
//   }
// })


import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
// import ReactTooltip from 'react-tooltip';
import { Button, Alert } from 'antd';
import Container from '../Container';
import MenuBar from '../MenuBar';
import CardList from '../../components/CardList';
import testData from '../../lib/testData';
import './layout.scss';

const { NewsOrWeiChatCardData, SubjectReportCardData, ReportCardData, SelectionNewsCardData, WeekNewsCardData, WeiChatCardData } = testData;
const { NewsOrWeiChatCard, SelectionNewsCard, WeekNewsCard, WeiChatCard, ReportCard, SubjectReportCard } = CardList;
@inject('laneStore')
@observer
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { fetchLanes } = this.props.laneStore;
    fetchLanes();
  }
  render() {
    const Input = styled.input`
                padding: 0.5em;
                margin: 0.5em;
                color: palevioletred;
                background: papayawhip;
                border: none;
                border-radius: 3px;
                `;
    return (
      <div className="main" data-for="scrollTime">
        <MenuBar />
        <Container />
        {/* <div style={{ background: '#b4b4b4', padding: '0 10px', position: 'fixed', right: '10px', height: '100%', overflowY: 'auto' }}>
          <NewsOrWeiChatCard
            data={NewsOrWeiChatCardData.data}
            keyWord={NewsOrWeiChatCardData.keyWord}
          />
          <SubjectReportCard dataList={SubjectReportCardData.dataList} />
          <ReportCard
            reportDetail={ReportCardData.reportDetail}
            keyWord={ReportCardData.keyWord}
          />
          <SelectionNewsCard
            data={SelectionNewsCardData.data}
            keyWord={SelectionNewsCardData.keyWord}
          />
          <WeekNewsCard dataList={WeekNewsCardData.dataList} />
          <WeiChatCard dataList={WeiChatCardData.dataList} />
        </div> */}
      </div>
    );
  }
}
export default Home;
