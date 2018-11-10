/**
 * @description 数据表（组件名称：DataTableCard)
 * @author wxiong
 * date: 2018-10-10
 */
import React, { PureComponent, Component, Fragment } from 'react';
import {
  Icon, Avatar,
  Divider, Button,
} from 'antd';
import { inject } from 'mobx-react';
import { toJS } from 'mobx';
import classNames from 'classnames';
import moment from 'moment';

import { COMPRE_ANALYST, REPORT_URL } from '../../env';

import './index.scss';

// 组件BEM基础类（Block）
const blockClass = 'data-table-card';

@inject(stores => ({ ...stores.xwStore.DataTableCard }))
class DataTableCard extends PureComponent {
  static cardType = 'C_015';

  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
      showMoreStatus: 'pending',
    };
  }

  openOriginPage = (evt) => {
    evt.stopPropagation();
    window.open(this.props.articleUrl, '_blank');
  }

  openTablePage = () => {
    window.open(this.props.tableUrl, '_blank');
  }

  render() {
    const {
      className, tableTitle,
      pubTime, tableData,
      stockName, articleTitle,
      articleIndustry,
    } = this.props;
    const cardClassName = classNames(blockClass, className);
    return (
      <div
        className={cardClassName}
        onClick={this.openTablePage}
      >
        <div className="header">
          <p className="table-title">
            {tableTitle}
          </p>
          <p className="publish-time">
            {moment(pubTime).format('YYYY/MM/DD')}
          </p>
        </div>
        {
          tableData && tableData.length &&
          <DataTable
            maxRow={7}
            maxCol={4}
            data={transformData(tableData)}
          />
        }
        <div className={`${blockClass}__footer`}>
          <p className="stock-name">
            公司：{stockName}
          </p>
          <p className="article-tile" onClick={this.openOriginPage}>
            来源：{articleTitle}
          </p>
          <p className="article-industry">
            类别：{articleIndustry}
          </p>
        </div>
      </div>
    );
  }
}

class DataTable extends PureComponent {
  render() {
    const {
      data,
      maxCol,
      maxRow,
    } = this.props;
    return (
      <table width="120%" border="0" cellSpacing="0" cellPadding="0">
        <tbody>
          {
            data.map((item, index, arr) => {
              return (
                <tr key={index} className={item.colorFlag}>
                  {item.map((t, i) => {
                    if (typeof maxRow === 'number' && !isNaN(maxRow)) {
                      if (t.row > maxRow - 1) {
                        return null;
                      }
                    }
                    if (typeof maxCol === 'number' && !isNaN(maxCol)) {
                      if (t.column > maxCol - 1) {
                        return null;
                      }
                    }
                    if (t.row === 0) {
                      return (
                        <th
                          key={`${i}-${t.row}-${t.column}`}
                          colSpan={t.colSpan ? t.colSpan : ''}
                          rowSpan={t.rowSpan ? t.rowSpan : ''}
                        >
                          {t.text}
                        </th>
                      );
                    }
                    return (
                      <td
                        key={`${i}-${t.row}-${t.column}`}
                        colSpan={t.colSpan ? t.colSpan : ''}
                        rowSpan={t.rowSpan ? t.rowSpan : ''}
                      >
                        {t.text}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  }
}

// 将table数据转为按行排列的二维数组
function transformData(arr) {
  const toArr = [];
  arr.forEach((item) => {
    const row = item.row;
    if (!toArr[row]) {
      toArr[row] = [];
    }
    toArr[row].push(item);
  });


  return toArr;
}

export default DataTableCard;