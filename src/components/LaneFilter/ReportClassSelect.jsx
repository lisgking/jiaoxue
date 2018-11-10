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

function transToTree(data, i = 0) {
  if (data.length === undefined) {
    throw new Error('错误的数据类型');
  }
  return data.map((v) => {
    const child = {
      title: v.name,
      key: `${v.id}-${v.name}`,
      value: `${v.id}-${v.name}`,
    };
    if (v.child !== null && v.child !== undefined) {
      child.children = transToTree(v.child, i + 1);
    }
    return child;
  });
}

export default class ReportClassSelect extends FilterSuper {
  constructor(props) {
    super(props);
    this.state.defaultLabel = '研报类型';
    this.state.defaultOptions = [];
    this.state.options = [];
  }
  auto = true
  static propTypes = {
  }
  fetchFilterData = (keyword) => {
    const { laneId, type, name } = this.props;
    this.setState({
      loading: true,
    });
    ask('categories').then((res) => {
      if (res.code === 200) {
        const opts = transToTree(res.data[0] && res.data[0].child);
        this.setState({
          loading: false,
          loaded: true,
          options: opts,
        });
        const filterTags = this.getRegOptionsArray(opts);
        console.log(res.data);
        this.props.regOptions(name || type, filterTags);
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
