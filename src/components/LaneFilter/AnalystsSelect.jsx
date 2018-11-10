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

export default class AnalystsSelect extends FilterSuper {
  constructor(props) {
    super(props);
    this.state.defaultLabel = '分析师';
  }
  selectionType = 8
  static propTypes = {

  }
  initialValue = ''
  render() {
    const {
      type,
      label,
    } = this.props;
    const { defaultLabel,
      options,
      form,
      defaultOptions } = this.state;
    const allChildren = options || defaultOptions;
    const matchOptions = this.localFilter(allChildren);
    matchOptions.unshift({ key: 'undefined', value: '' });
    return (<FilterItem
      label={label || defaultLabel}
    >
      <span ref={el => this.$el = el} />
      <Select
        getPopupContainer={() => this.$el}
        allowClear
        showArrow={false}
        defaultValue={''}
        showSearch
        onSearch={this.handleSearch}
        placeholder={'全部'}
        notFoundContent={''}
        filterOption={this.filterOptionFunc}
        style={{ width: '100%' }}
        {...form}
      >
        {matchOptions.map((v, i) => {
          return <Option key={`${i + 1}${v.value}`} value={v.value}>{v.text || v.value}</Option>;
        })}
      </Select>
    </FilterItem>
    );
  }
}

