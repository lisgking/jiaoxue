/**
|--------------------------------------------------
| @author hawk
| @day 2018/10/10
|--------------------------------------------------
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

import FilterSuper from './FilterSuper';
import FilterItem from './FilterItem';
const { Option } = Select;

export default class SourceSelect extends FilterSuper {
  constructor(props) {
    super(props);
    this.state.defaultLabel = '类型';
    this.state.defaultOptions = [];
  }
  selectionType = 1
  auto=true
  static propTypes = {

  }
  static initialValue = '0'
  render() {
    const {
      label,
    } = this.props;
    const { defaultLabel,
      options,
      form,
      defaultOptions } = this.state;
    const allChildren = options || defaultOptions;
    return (<FilterItem
      label={label || defaultLabel}
    >
      <span ref={el => this.$el = el} />
      <Select
        getPopupContainer={() => this.$el}
        showArrow={false}
        showSearch
        placeholder={'全部'}
        filterOption={this.filterOptionFunc}
        style={{ width: '100%' }}
        {...form}
      >
        {allChildren.map((v) => {
          return <Option key={v.value} value={v.value}>{v.text || v.value}</Option>;
        })}
      </Select>
    </FilterItem>
    );
  }
}

