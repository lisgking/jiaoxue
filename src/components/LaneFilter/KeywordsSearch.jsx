/**
 |--------------------------------------------------
 | @author hawk
 | @day 2018/10/10
 |--------------------------------------------------
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

import FilterItem from './FilterItem';
const Search = Input.Search;

export default class KeywordsSearch extends Component {
  constructor(props) {
    super(props);
    this.state.valueMode = 'form';
    this.state.inputValue = '';
  }
  static propTypes = {

  }

  state = {
    defaultLabel: '关键字',
  }
  handleChange = (e) => {
    const { value } = e.target;
    this.setState({
      valueMode: 'input',
      inputValue: `${value}`,
    });
  }
  handleFocus = () => {
    this.setState({
      valueMode: 'input',
      focus: true,
    });
  }
  handleBlur = () => {
    this.setState({
      focus: false,
    });
  }
  static getDerivedStateFromProps(props) {
    const state = {};
    if (props.filterStatus === false) {
      state.valueMode = 'form';
      state.inputValue = props.value;
    }
    return state;
  }
  handleSearch = (value) => {
    const { onChange } = this.props;
    this.setState({
      valueMode: 'form',
    });
    onChange(value);
  }
  render() {
    const {
      label,
      value,
    } = this.props;
    const { defaultLabel, form, valueMode, inputValue } = this.state;
    let showValue = '';
    if (valueMode === 'form') {
      showValue = value;
    } else if (valueMode === 'input') {
      showValue = this.state.inputValue;
    }
    return (<FilterItem
      label={label || defaultLabel}
    >
      <Search
        onClick={this.handleClick}
        value={showValue}
        defaultValue={value}
        placeholder="请输入"
        style={{ width: '100%' }}
        onChange={this.handleChange}
        onSearch={this.handleSearch}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      />
    </FilterItem>
    );
  }
}
