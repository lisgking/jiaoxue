import React, { Component, Fragment } from 'react';
import { Divider, Input, message, Button, Tooltip, Icon } from 'antd';
import PropTypes from 'prop-types';
import LongString from '../LongString';
import Utils from '../../lib/utils';
import './index.scss';
const hostSeverUrl = Utils.getHostServerUrl();
export default class TopSearchCard extends Component {
  static cardType = 'C_016'
  // constructor(props) {
  //   super(props);
  // }
  static defaultProps = {
    dataList: [], // top数据列表
  }
  componentDidMount() {
  }
  clickItem = (keyWord) => {
    const { clickCallback } = this.props;
    window.open(`${hostSeverUrl}/comprehensive-search/chart?keyword=${keyWord}`);
  }
  render() {
    const { dataList } = this.props;
    return (
      <div className="top_search_card_container">
        {
          dataList.map((item, i) => {
            return (
              <div key={item.id} className="tree_node middle" onClick={() => { this.clickItem(item.title); }} >
                <span className={`top${i + 1} center`}>{i + 1}</span>
                <div title={item.title} className="str_ellipsis" dangerouslySetInnerHTML={{ __html: item.title }} />
                {/* <LongString content={item.title} lineHeight={22} className="" /> */}
              </div>
            );
          })
        }
      </div>
    );
  }
}
TopSearchCard.PropTypes = {
  dataList: PropTypes.array,
};
