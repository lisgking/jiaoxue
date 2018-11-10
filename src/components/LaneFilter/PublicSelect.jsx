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

export default class PublicSelect extends FilterSuper {
  constructor(props) {
    super(props);
    this.state.defaultLabel = '公众号';
  }
  selectionType = 7
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
        showSearch
        onSearch={this.handleSearch}
        placeholder={'全部'}
        notFoundContent={''}
        // filterOption={this.filterOptionFunc}
        style={{ width: '100%' }}
        {...form}
      >
        {matchOptions.map((v) => {
          return <Option key={v.value} value={v.value}>{v.text || v.value}</Option>;
        })}
      </Select>
    </FilterItem>
    );
  }
}

