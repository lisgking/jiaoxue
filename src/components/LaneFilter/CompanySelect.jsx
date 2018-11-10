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
  const { tagKey = 'induName', valueKey = 'induName', paramKey = '', valueFn } = config;
  if (data.length === undefined) {
    throw new Error('错误的数据类型');
  }
  return data.map((v, i) => {
    if (v.industry !== undefined) {
      const key = `${i}`;
      const target = {
        title: v.marketName,
        key,
        disableCheckbox: true,
        value: `${v.marketCode}-${v.marketName}`,
      };
      if (v.marketName === undefined) {
        // debugger;
      }
      target.children = transToTree(v.industry, { tagKey, valueKey, paramKey: key, valueFn });
      return target;
    }
    if (v.induName === undefined) {
      // debugger;
    }
    const key = `${paramKey}-${i}`;
    const child = {
      title: v[tagKey],
      key,
      value: `${v.induUniCode}-${v.induName}`,
    };
    // console.log(key, value);
    if (v.child !== null && v.child !== undefined) {
      child.children = transToTree(v.child, { tagKey,
        paramKey: key,
        valueKey,
        valueFn });
    }
    return child;
  });
}


export default class StockSelect extends FilterSuper {
  constructor(props) {
    super(props);
    this.state.defaultLabel = '行业';
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
    ask('industries', { params }).then((res) => {
      if (res.code === 200) {
        const { tagKey, valueKey, valueFn } = this.props;
        let options = transToTree(res.data, { tagKey, valueKey, valueFn });
        if (options.length === 1) {
          options = options[0].children;
        }
        this.setState({
          loading: false,
          loaded: true,
          options,
        });
        const list = this.getRegOptionsArray(options);
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
