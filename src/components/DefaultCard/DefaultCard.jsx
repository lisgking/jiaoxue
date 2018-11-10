/**
 * @description 泳道无数据时的缺省值
 * @author wxiong
 * date: 2018-10-26
 */
import React, { PureComponent, Fragment } from 'react';
import {
  Icon, Avatar,
  Divider, Button,
  Spin, Tooltip,
} from 'antd';
import hoistNonReactStatics from 'hoist-non-react-statics';
import classNames from 'classnames';
import _ from 'lodash';

import { MYSTOCK_URL, REPORT_URL } from '../../env';

import './index.scss';

import defaultImg from './images/default.png';
import defaultMyStockImg from './images/default-mystock.png';
import defaultHoldStockImg from './images/default-holdstock.png';
import defaultSubscribeImg from './images/default-subscribe.png';
import defaultDataErrorImg from './images/default-data-error.png';

// 组件BEM基础类（Block）
const blockClass = 'default-card';

export function EmptyCard(props) {
  const { className, title, btnText, isBtnVisible, imgSrc, btnClickHandler } = props;
  const cardClassName = classNames(blockClass, className);
  return (
    <div className={cardClassName}>
      {
        imgSrc &&
        <img src={imgSrc} alt="defalut img" />
      }
      {
        title &&
        <p className="title">
          {title}
        </p>
      }
      {
        isBtnVisible &&
        <Button onClick={btnClickHandler}>
          {btnText}
        </Button>
      }
    </div>
  );
}


export function WithDefaultOption(WrappedComponent) {
  return function ExtendedComponent(props) {
    const { type, ...rest } = props;
    const options = {
      btnClickHandler() {},
    };
    if (_.isUndefined(type) || type === 0) {
      options.title = '当前看板没有找到你要看的内容';
      options.imgSrc = defaultImg;
      options.isBtnVisible = false;
    }
    if (type === 1) {
      options.title = '您尚未添加自选股';
      options.imgSrc = defaultMyStockImg;
      options.isBtnVisible = true;
      options.btnText = '立即添加';
      options.btnClickHandler = function () {
        window.open(MYSTOCK_URL, '_blank');
      };
    }
    if (type === 2) {
      options.title = '您尚未添加持仓';
      options.imgSrc = defaultHoldStockImg;
      options.isBtnVisible = true;
      options.btnText = '立即添加';
      options.btnClickHandler = function () {
        window.open(`${MYSTOCK_URL}/mystock-owned`, '_blank');
      };
    }
    if (type === 3) {
      options.title = '您暂无订阅';
      options.imgSrc = defaultSubscribeImg;
      options.isBtnVisible = false;
      // options.btnText = '立即添加';
      // options.btnClickHandler = function () {
      //   window.open(`${MYSTOCK_URL}/mystock-owned`, '_blank');
      // };
    }
    if (type === 4) {
      options.title = '数据异常，请稍后再试';
      options.imgSrc = defaultDataErrorImg;
      options.isBtnVisible = false;
      // options.btnText = '立即添加';
      // options.btnClickHandler = function () {
      //   window.open(`${MYSTOCK_URL}/mystock-owned`, '_blank');
      // };
    }
    return (
      <WrappedComponent
        {...rest}
        {...options}
      />
    );
  };
}

export default WithDefaultOption(EmptyCard);