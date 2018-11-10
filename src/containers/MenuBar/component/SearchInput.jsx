import React, { Component } from 'react';
import { AutoComplete, Input } from 'antd';
import ask from '../../../lib/ask';
import IconSvg from '../../../components/IconSvg';
import './SearchInput.scss';

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;
const { SearchSVG } = IconSvg;


export default class SearchInput extends Component {
  static defaulProps = {
    placeholder: '搜索',
    style: {
      width: '150px',
    },
    addLane: () => { console.log('addLane'); },
  }
  state = {
    searchInputValue: '',
    dataSource: [],
  }
  componentDidMount=() => {
    const preomes = ask('hotSearch', {
      params: {
        cate: 70001,
        lan: 0,
        limit: 5,
        module: 70001,
        type: 2,
      },
    });
    preomes.then((resp) => {
      this.setState({
        dataSource: (resp.data || []),
      });
    });
  }

  handleSearchInputChange=(value) => {
    this.setState({
      searchInputValue: value,
    });
  }

  onPressEnter = (value) => {
    if (!value) return false;
    const { addLane, onPressEnter } = this.props;
    addLane('Y_1000', value);
    this.setState({
      searchInputValue: '',
    });
    if (onPressEnter) {
      onPressEnter();
    }
  }

  getOptions =() => {
    const { dataSource } = this.state;
    return [<OptGroup
      key="热门搜索"
    >
      {dataSource.map(opt => (
        <Option key={opt.id} value={opt.query}>
          {opt.display_Name}
        </Option>
      ))}
    </OptGroup>,
    ];
  }

  render() {
    const { width } = this.props;
    return (
      <div ref={(node) => { this.node = node; }} className="searchInput">
        <AutoComplete
          autoFocus
          className="category-search"
          dropdownClassName="category-search-dropdown"
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ width: width || 150, left: 10 }}
          // size="large"
          // style={{ width: '100%' }}
          dataSource={this.getOptions()}
          backfill={false}
          optionLabelProp="value"
          // getPopupContainer={() => { return this.node; }}
          defaultActiveFirstOption={false}
          // onSearch={this.onPressEnter}
          onChange={this.handleSearchInputChange}
          onSelect={this.handleSearchInputChange}
          onBlur={() => {
            const { onBlur } = this.props;
            if (onBlur) {
              onBlur();
            }
          }}
          value={this.state.searchInputValue}
        >
          <Input
            placeholder="搜索"
            suffix={
              <span onClick={() => {
                this.onPressEnter(this.state.searchInputValue);
              }}
              >
                <SearchSVG style={{ fontSize: '17px', color: '#fff' }} />
              </span>
            }
            // onChange={this.handleSearchInputChange}
            onPressEnter={() => { this.onPressEnter(this.state.searchInputValue); }}
          />
        </AutoComplete>

      </div>
    );
  }
}