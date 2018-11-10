/**
|--------------------------------------------------
| @author hawk
| @day 2018/10/10
|--------------------------------------------------
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import cs from 'classnames';
import styled from 'styled-components';

import StockSelect from './StockSelect';
import SourceSelect from './SourceSelect';
import SubjectSelect from './SubjectSelect';
import CompanySelect from './CompanySelect';
import PublicSelect from './PublicSelect';
import AnalystsSelect from './AnalystsSelect';
import ClassSelect from './ClassSelect';
import ReportClassSelect from './ReportClassSelect';
import PageSelect from './PageSelect';
import OrgSelect from './OrgSelect';
import FilingSelect from './FilingSelect';
import ImportantFilingSelect from './ImportantFilingSelect';
import CodeSelect from './CodeSelect';
import KeywordsSearch from './KeywordsSearch';

import './style.scss';
import FilterTags from '../FilterTags';

const filterDict = {
  stockSelect: StockSelect,
  sourceSelect: SourceSelect,
  subjectSelect: SubjectSelect,
  companySelect: CompanySelect,
  publicSelect: PublicSelect,
  analystsSelect: AnalystsSelect,
  classSelect: ClassSelect,
  reportClassSelect: ReportClassSelect,
  pageSelect: PageSelect,
  orgSelect: OrgSelect,
  filingSelect: FilingSelect,
  importantFilingSelect: ImportantFilingSelect,
  codeSelect: CodeSelect,
  keywords: KeywordsSearch,
};

const LaneFilterWrap = styled.div`
  /* padding: 0 14px; */
`;

const LaneFilters = styled.div`
  padding: 19px 14px 14px 14px;
`;


class LaneFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  static propTypes = {

  }
  filterDict = filterDict
  getFilter = (name, filterOption) => {
    const target = this.filterDict[name];
    if (target === undefined) {
      throw new Error('过滤器类型未定义');
    }
    const defaultOptions = {
      key: name,
    };
    const { form, laneId, filterStatus, regOptions, filterTags } = this.props;
    // 这里可以从配置, 或者是组件的配置里面取初始值
    const ComponentInitialValue = target.initialValue;
    const { initialValue } = filterOption;
    const fieldDecorator = form.getFieldDecorator(filterOption.name || name, {
      initialValue: initialValue || ComponentInitialValue,
    });
    const itemProps = { ...defaultOptions,
      ...filterOption,
      laneId,
      filterTags,
      filterStatus,
      regOptions };
    const child = fieldDecorator(React.createElement(target, itemProps));
    return child;
  }

  handleRemoveFilterTag = (key, value) => {
    const { form, values } = this.props;
    const formData = values;
    const target = formData[key];
    const type = typeof target;
    if (type === 'boolean' || type === 'string' || type === 'number') {
      form.resetFields([key]);
      delete formData[key];
    } else if (type === 'object' && target.length > 0) {
      const nextData = target.filter(v => v !== value);
      form.setFieldsValue({ [key]: nextData });
      formData[key] = nextData;
    } else if (key === 'groupType') {
      delete values.groupType;
    } else {
      console.warn(`一个未知的类型${type}未被处理`);
    }
    this.props.onChange(formData);
    // 这里只处理数组
  }

  renderTag = (filterStatus) => {
    const { filterTags, showMoreFilter } = this.props;
    if (filterTags.length > 0) {
      // debugger;
    }
    return (<div className={cs('lane-filterTags', { 'lane-hide': filterStatus })}>
      <FilterTags
        onRemoveTag={this.handleRemoveFilterTag}
        tags={[...filterTags]}
        showMoreFilter={showMoreFilter}
      />
    </div>);
  }
  render() {
    const { options, filterStatus, filterTags } = this.props;
    return (<span>
      <LaneFilterWrap className={cs('lane-filter', {
        'lane-hide': !filterStatus,
      })}
      >
        {options ? <LaneFilters>
          {options.map((v) => {
            return this.getFilter(v.type, v);
          })}
        </LaneFilters> : null}
        {this.props.footer}
      </LaneFilterWrap>
      {filterTags.length > 0 ?
        this.renderTag(filterStatus) : null}
    </span>);
  }
}

export default Form.create({
  onFieldsChange(props, fields) {
    const fieldValue = {};
    Object.keys(fields).forEach((v) => {
      fieldValue[v] = fields[v].value;
    });
    const formValues = { ...props.values, ...fieldValue };
    props.onChange(formValues);
  },
  mapPropsToFields(props) {
    const { values } = props;
    const mapProps = {};
    if (values !== undefined) {
      Object.keys(values).forEach((v) => {
        const value = values[v];
        if (typeof value === 'string') {
          mapProps[v] = Form.createFormField({
            value: value === undefined ? '' : value,
          });
        } else if (typeof value === 'object') {
          mapProps[v] = Form.createFormField({
            value: [...value],
          });
        } else {
          mapProps[v] = Form.createFormField({
            value: value === undefined ? '' : value,
          });
        }
      });
    }
    return mapProps;
  },
})(LaneFilter);
