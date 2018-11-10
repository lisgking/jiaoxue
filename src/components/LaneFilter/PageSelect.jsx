/**
|--------------------------------------------------
| @author hawk
| @day 2018/10/10
|--------------------------------------------------
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

import FilterItem from './FilterItem';
import FilterSuper from './FilterSuper';

const { Option } = Select;

export default class PageSelect extends FilterSuper {
  static propTypes = {

  }
  selectionType = 3
  constructor(props) {
    super(props);
    this.state = {
      defaultLabel: '页数',
      defaultOptions: [{
        value: '10页以下',
      }, {
        value: '10-20页',
      }, {
        value: '20页以上',
      }],
    };
  }
  render() {
    const {
      type,
      label,
    } = this.props;
    const { defaultLabel, options, defaultOptions, form } = this.state;
    const children = options || defaultOptions;
    return (<FilterItem
      label={label || defaultLabel}
    >
      <span ref={el => this.$el = el} />
      <Select
        getPopupContainer={() => this.$el}
        placeholder={'全部'}
        {...form}
        mode="multiple"
        style={{ width: '100%' }}
      >
        {children.map((v) => {
          return <Option key={v.value} value={v.text}>{v.text || v.value}</Option>;
        })}
      </Select>
    </FilterItem>
    );
  }
}
