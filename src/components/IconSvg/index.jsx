import React, { Component } from 'react';
import { Icon } from 'antd';

const IconSvg = {
  /**
   * 搜索Icon
   */
  SearchSVG: (props) => {
    const { style } = props;
    return (
      <svg style={style} className="icon" aria-hidden="true">
        <use xlinkHref="#icon-sousuo" />
      </svg>
    );
  },
  /**
   * 展开Icon
   */
  ExpandSVG: (props) => {
    const { style, className } = props;
    return (
      <svg
        style={style}
        className="icon"
        aria-hidden="true"
      >
        <use xlinkHref="#icon-jt-zhankai" />
      </svg>
    );
  },
  /**
   * 收起Icon
   */
  PackUpSVG: (props) => {
    const { style, className } = props;
    return (
      <svg
        style={style}
        className="icon"
        aria-hidden="true"
      >
        <use xlinkHref="#icon-jt-shouqi" />
      </svg>
    );
  },
  get: (name) => {
    return (this[name] instanceof Function) ? this[name]() : '';
  },
};

export default IconSvg;