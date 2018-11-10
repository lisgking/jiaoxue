/**
|--------------------------------------------------
| @author hawk
| @day 2018/10/10
|--------------------------------------------------
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import ask from '../../lib/ask';

function filterOptionFunc(input, option) {
  return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

export default class FilterSuper extends Component {
  static propTypes = {
    regOptions: PropTypes.func,
  }
  auto = true
  static defaultProps = {
    regOptions: () => null,
  }
  getRegOptionsArray = (options, list = []) => {
    options.forEach((v) => {
      list.push({ value: v.value, text: v.title });
      if (v.children) {
        this.getRegOptionsArray(v.children, list);
      }
    });
    return list;
  }
  componentDidUpdate() {
    // 注释掉泳道过滤延时加载filter
    // if (this.auto === false) {
    //   return;
    // }
    const { filterStatus } = this.props;
    const { loaded, loading } = this.state;
    // if (filterStatus === true) {
    if (loading === false && loaded === false) {
      this.fetchFilterData();
    }
    // }
  }
  constructor(props) {
    super(props);
    this.state = {
      form: {},
      loading: false,
      loaded: false,
      defaultLabel: '未设置类型',
      searchValue: '',
      defaultOptions: [{
        value: '测试数据1',
      }, {
        value: '测试数据2',
      }],
      options: [],
    };
  }
  handleSearch = (value) => {
    this.setState({
      searchValue: value,
    });
  }
  localFilter = (array) => {
    const { searchValue } = this.state;
    const matchOptions = [];
    if (searchValue !== '') {
      array.forEach((v) => {
        if (v.text.indexOf(searchValue) !== -1) {
          matchOptions.push(v);
        }
      });
    }
    return matchOptions;
  }
  componentDidMount() {
    if (this.auto === false) {
      return;
    }
    // const { filterStatus } = this.props;
    // if (filterStatus === true) {
    this.fetchFilterData();
    // }
  }
  filterOptionFunc = filterOptionFunc
  fetchFilterData = () => {
    const { laneId, name, type } = this.props;
    const { selectionType: defaultSelectionType } = this;
    const selectionType = this.props.selectionType || defaultSelectionType;
    if (laneId !== undefined && selectionType !== undefined) {
      const laneTemplateId = parseInt(laneId.match(/\d+/), 10);
      this.setState({
        loading: true,
      });
      ask('filterSelection', { params: { laneTemplateId, selectionType } }).then((res) => {
        if (res.code === 200) {
          this.setState({
            options: res.data,
            loading: false,
            loaded: true,
          });
          const { valueKey = 'value', tagKey = 'text' } = this.props;
          const opts = res.data.map((v) => {
            return {
              value: v[valueKey],
              text: v[tagKey],
            };
          });
          this.props.regOptions(name || type, opts);
        } else {
          this.setState({
            loading: false,
            loaded: false,
          });
          console.log('获取列表失败');
        }
      });
    }
  }
  static propTypes = {

  }
  static getDerivedStateFromProps(props) {
    const state = {};
    const key = ['type',
      'options',
      'includes',
    ];
    key.forEach((v) => {
      if (props[v] !== undefined) {
        state[v] = props[v];
      }
    });
    // 注入来源于form的相关内容
    state.form = {};
    const formOptionsKey = ['data-__field',
      'data-__meta',
      'onChange',
      'value',
    ];
    formOptionsKey.forEach((v) => {
      if (props[v] !== undefined) {
        state.form[v] = props[v];
      }
    });
    return state;
  }
}

