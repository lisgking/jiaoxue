/**
|--------------------------------------------------
| 过滤选项
|--------------------------------------------------
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ItemLabel = styled.div`
  width: 70px;
  font-size:12px;
  line-height:32px;
  font-weight: 500;
  color:#666;
  text-align:left;
`;

const ItemContent = styled.div`
  width: 100%;
  max-width: 186px;
`;

export default class FilterItem extends Component {
  static propTypes = {

  }

  render() {
    const { label, children } = this.props;
    return (
      <Item className="filter-item">
        <ItemLabel className="filter-item-label">
          {label}
        </ItemLabel>
        <ItemContent className="filter-item-content">
          {children}
        </ItemContent>
      </Item>
    );
  }
}

