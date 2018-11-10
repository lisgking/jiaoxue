/**
|--------------------------------------------------
| @author hawk
| @day 2018/10/10
|--------------------------------------------------
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Icon } from 'antd';

import FilterItem from './FilterItem';
import FilterSuper from './FilterSuper';
const { Option } = Select;

export default class SubjectSelect extends FilterSuper {
  constructor(props) {
    super(props);
    this.state.defaultLabel = '专题';
  }
  selectionType = 5
  static propTypes = {

  }
  initialValue = ''
  render() {
    const {
      type,
      value,
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
        {...form}
        showSearch
        filterOption={this.filterOptionFunc}
        style={{ width: '100%' }}
        value={value || ''}
      >
        <Option key={'全部'} value={''}>全部</Option>
        {allChildren.map((v) => {
          return <Option key={v.text} value={v.text}>{v.text || v.value}</Option>;
        })}
      </Select>
    </FilterItem>
    );
  }
}

