/**
 |--------------------------------------------------
 | @author hawk
 | @day 2018/10/10
 |--------------------------------------------------
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, TreeSelect } from 'antd';

import FilterItem from './FilterItem';
import ask from '../../lib/ask';
import FilterSuper from './FilterSuper';

function transToTree(data, config = {}) {
  const { tagKey = 'name', valueKey = 'name', valueFn } = config;
  if (data.length === undefined) {
    throw new Error('错误的数据类型');
  }
  return data.map((v) => {
    const child = {
      title: v[tagKey],
      key: `${v.id}-${v.name}`,
      value: `${v.id}-${v.name}`,
    };
    if (v.child !== null && v.child !== undefined) {
      child.children = transToTree(v.child, { tagKey, valueKey, valueFn });
    }
    return child;
  });
}

function getRegOptionsArray(options, list = []) {
  options.forEach((v) => {
    list.push({ value: v.value, text: v.title });
    if (v.children) {
      getRegOptionsArray(v.children, list);
    }
  });
  return list;
}
export default class FilingSelect extends FilterSuper {
  constructor(props) {
    super(props);
    this.state.defaultLabel = '类型';
    this.state.defaultOptions = [];
    this.state.options = [];
  }
  auto = true
  static propTypes = {
  }
  fetchFilterData = (keyword) => {
    const { params, type, name } = this.props;
    const { selectionType: defaultSelectionType } = this;
    this.setState({
      loading: true,
    });
    ask('noticeCategories', { params }).then((res) => {
      if (res.code === 200) {
        const { tagKey, valueKey, valueFn } = this.props;
        const options = transToTree(res.data, { tagKey, valueKey, valueFn });
        console.log(options);
        this.setState({
          loading: false,
          loaded: true,
          options,
        });
        const list = getRegOptionsArray(options);
        this.props.regOptions(name || type, list);
      } else {
        this.setState({
          loading: false,
          loaded: true,
        });
        console.log('获取列表失败');
      }
    });
  }

  handleSearch = (value) => {
    this.setState({
      highLight: value,
    });
    this.fetchFilterData(value, data => this.setState({ options: data }));
  }
  filterOptionFunc = function (input, option) {
    return option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }
  render() {
    const {
      type,
      label,
    } = this.props;
    const { defaultLabel, form } = this.state;
    const tProps = {
    };
    return (<FilterItem
      label={label || defaultLabel}
    >
      <span ref={el => this.$el = el} />
      <TreeSelect
        getPopupContainer={() => this.$el}
        showCheckedStrategy={TreeSelect.SHOW_PARENT}
        dropdownClassName={'lane-filter-treeFilter'}
        dropdownStyle={{ maxHeight: '70vh' }}
        filterTreeNode={this.filterOptionFunc}
        treeData={this.state.options}
        searchPlaceholder="请选择"
        treeCheckable
        showSearch
        style={{ width: '100%' }}
        {...form}
        {...tProps}
      />
    </FilterItem>
    );
  }
}
