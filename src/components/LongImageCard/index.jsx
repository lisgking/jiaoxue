/**
 * @description 信息长图（运营）（组件名称：LongImageCard)
 * @author wxiong
 * date: 2018-10-10
 */
import React, { PureComponent, Component, Fragment } from 'react';
import {
  Icon, Avatar,
  Divider, Button,
} from 'antd';
import { inject } from 'mobx-react';
import { toJS } from 'mobx';
import classNames from 'classnames';
import moment from 'moment';

import { CHARTTABLE_URL } from '../../env';

import './index.scss';

// 组件BEM基础类（Block）
const blockClass = 'long-image-card';

@inject(stores => ({ ...stores.xwStore.LongImageCard }))
class LongImageCard extends PureComponent {
  static cardType = 'C_014';

  openPage = () => {
    window.open(`${CHARTTABLE_URL}/bigpic/${this.props.id}`, '_blank');
  }

  render() {
    const {
      className, title,
      articlePubTime, imageUrl,
      origin, category,
    } = this.props;
    const cardClassName = classNames(blockClass, className);
    return (
      <div
        className={cardClassName}
        onClick={this.openPage}
      >
        <div className="header">
          <p className="image-title">
            {title}
          </p>
          <p className="publish-time">
            {moment(articlePubTime).format('YYYY/MM/DD')}
          </p>
        </div>
        <img src={imageUrl} alt="operation" />
        <div className={`${blockClass}__footer`}>
          <p className="origin">
            来源：{origin}
          </p>
          <p className="category">
              类别：{category}
          </p>
        </div>
      </div>
    );
  }
}

export default LongImageCard;