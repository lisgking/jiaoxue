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

export default class ClassSelect extends Component {
  static propTypes = {

  }

  state = {
    defaultLabel: '分类',
  }

  render() {
    const {
      type,
      label,
    } = this.props;
    const { defaultLabel } = this.state;
    return (<FilterItem
      label={label || defaultLabel}
    >
      <Select style={{ width: '100%' }} />
    </FilterItem>
    );
  }
}
