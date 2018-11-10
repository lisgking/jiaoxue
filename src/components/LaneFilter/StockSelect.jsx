/**
|--------------------------------------------------
| @author hawk
| @day 2018/10/10
|--------------------------------------------------
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Tooltip } from 'antd';

import FilterItem from './FilterItem';
import ask from '../../lib/ask';
import FilterSuper from './FilterSuper';
const { Option } = Select;

export default class StockSelect extends FilterSuper {
  constructor(props) {
    super(props);
    this.state.defaultLabel = '公司';
    this.state.defaultOptions = [];
    this.state.options = [];
  }
  initialValue = ''
  auto = false
  static propTypes = {
  }
  componentDidMount() {
    super.componentDidMount();
    const { value, filterTags } = this.props;
    if (value) {
      const strings = filterTags
        .find(v => v.key === 'company' || v.key === 'stockCode');
      if (strings !== undefined) {
        this.fetchFilterData(strings.tag);
      }
      // this.fetchFilterData(this.props.value);
    }
  }
  fetchFilterData = (keyword) => {
    const { laneId, name, type, valueKey = 'abc_code', tagKey = 'sec_name' } = this.props;
    const { selectionType: defaultSelectionType } = this;
    this.setState({
      loading: true,
    });
    ask('stockSelectList', { params: { keyword } }).then((res) => {
      if (res.code === 200) {
        const formatOptions = res.data.map(v => ({
          text: v[tagKey],
          value: `${v[valueKey]}`,
          beforeTag: v.abc_code }));
        this.setState({
          loading: false,
          loaded: true,
          options: formatOptions,
        });
        this.props.regOptions(name || type, formatOptions);
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
  handleBlur = () => {
    this.setState({
      options: [],
    });
  }
  render() {
    const {
      value,
      label,
    } = this.props;
    const { defaultLabel, form } = this.state;
    const options = this.state.options.map(d => (<Option key={d.value}>
      {d.beforeTag}<Tooltip title={d.text}>{d.text.length > 6 ?
        `${d.text.split(0, 6)}...` : d.text}</Tooltip>
    </Option>));
    return (<FilterItem
      label={label || defaultLabel}
    >
      <span ref={el => this.$el = el} />
      <Select
        getPopupContainer={() => this.$el}
        allowClear
        onBlur={this.handleBlur}
        style={{ width: '100%' }}
        showSearch
        className={'lane-filter-select'}
        placeholder={'简称/代码'}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleSearch}
        {...form}
        value={value || ''}
        notFoundContent={null}
      >
        <Option key={'undefined'} value={''} />
        {options}
      </Select>
    </FilterItem>
    );
  }
}
