/**
|--------------------------------------------------
| @author hawk
| @day 2018/10/10
|--------------------------------------------------
*/
import React from 'react';
import PropsTypes from 'prop-types';
import cs from 'classnames';
import _ from 'lodash';
import { Spin, Tooltip, Input, Icon } from 'antd';
import Scrollbar from 'react-smooth-scrollbar';

import styled from 'styled-components';
import CardList from '../CardList';
import LaneFilter from '../../components/LaneFilter';
import DefaultCard from '../../components/DefaultCard';
import jt from './assets/jt.png';

const LaneFilterFooter = styled.div`
  display:flex;
  justify-content: space-between;
  cursor: pointer;
  height:36px;
  border: 1px solid #efefef;
  padding: 0 14px;
  background:#f3f5f8;
  font-size:12px;
  color:#666;
  line-height:36px;
`;

const LaneFilterIcon = styled.span`
  position: absolute;
  height: 6px;
  width: 8px;
  top: 38px;
  right: 10px;
  background:url(${jt});
`;

export default class Lane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
      keyMap: {},
      loading: 'done',
      updateTime: Date.now(),
    };
  }
  static PropsTypes = {
    data: PropsTypes.object.isRequired,
    toggleFilter: PropsTypes.func,
  }
  static defaultProps = {
    toggleFilter: status => console.log(status),
  }
  static getDerivedStateFromProps(props) {
    const state = {};
    Object.assign(state, props.defaultOptions, props.option);
    return state;
  }

  componentDidMount() {
    const { defaultOptions } = this.props;
    const { freshType } = defaultOptions;
    if (freshType === '消息提醒') {
      this.state.updateMode = 'showMessage';
    } else if (freshType === '直接刷新') {
      this.state.updateMode = 'auto';
    }
    this.refreshLane();
    this.regComponentToOptionSource();
    this.autoFetchData();
  }
  regOptions = (key, options) => {
    const { option: { keyMaps } } = this.props;
    keyMaps[key] = options;
  }
  autoFetchData = () => {
    const { option } = this.props;
    const { updateTask } = option;
    const { updateMode, updateInterval = 10e3 } = this.state;
    clearTimeout(updateTask);
    option.updateTask = setTimeout(() => {
      this.refreshLane({ autoFetch: true, updateMode, dataSite: 'before' });
      this.autoFetchData();
    }, updateInterval);
  }
  componentWillUnmount() {
    const { option } = this.props;
    const { updateTask } = option;
    clearTimeout(updateTask);
  }
  regComponentToOptionSource = () => {
    const { option } = this.props;
    // 注册跳转到方法
    option.goToLane = () => this.goToAndFocusComponent();
    // 注册刷新方法
    option.refresh = (...args) => this.setState(...args);
  }
  goToAndFocusComponent = () => {
    const { $el } = this;
    this.setState({
      active: true,
    });
    clearTimeout(this.state.activeTimer);
    this.state.activeTimer = setTimeout(() => this.setState({ active: false }), 3000);
    $el.scrollIntoView({ behavior: 'smooth' });
  }
  getCardByType = (id) => {
    const target = Object.keys(CardList).map(v => CardList[v]).find(v => v.cardType === id);
    if (target) {
      return target;
    }
    return null;
  }
  refreshLane = ({ autoFetch = false, dataSite } = {}) => {
    const { fetchData, option } = this.props;
    const { subscribeId } = option;
    const { updateMode } = this.state;
    this.setState({
      dataSite,
      loading: 'pending',
    });
    const { updateTask, id } = option;
    clearTimeout(updateTask);
    fetchData({ laneId: id, subscribeId, autoFetch, updateMode, dataSite }).then((res) => {
      this.setState({
        loading: 'done',
        updateTime: Date.now(),
      });
      this.autoFetchData();
    });
  }
  renderSearchLaneTitle = () => {
    const { option, updateLane } = this.props;
    const { name } = option;
    const onPressEnter = (value) => {
      // const { value } = e.target;
      if (!value) return true;
      updateLane(option, { name: value,
        callback: () => {
          this.refreshLane();
        } });
    };
    return (<Input
      className={'lane-searchLaneTitle'}
      defaultValue={name}
      suffix={
        <svg
          onClick={(e) => {
            const { serverOptions } = option;
            const { keyword } = serverOptions;
            if (keyword) {
              onPressEnter(keyword);
            }
          }}
          style={{
            fontSize: '17px',
          }}
          className="icon"
          aria-hidden="true"
        >
          <use xlinkHref="#icon-sousuo" />
        </svg>}
      onPressEnter={(e) => { onPressEnter(e.target.value); }}
      style={{ width: '180px' }}
    />);
  }
  renderTitle = () => {
    const {
      connectDragSource,
      option,
    } = this.props;
    const { name, iconSvg } = this.state;
    const { subscribeId } = option;
    const showSearchLaneTitle = subscribeId === 'Y_1000';
    return (
      <div
        className={cs('lane-head', { canDrag: !!connectDragSource })}
        ref={el => this.$el = el}
      >
        <div className="lane-head-dragArea">
          <i style={{ fontSize: '17px' }} className="iconfont">
          &#xe672;
          </i>
          {
            iconSvg
              ? <svg className="icon iconfont primary" aria-hidden="true">
                <use xlinkHref={`#${iconSvg}`} />
              </svg>
              : ''
          }
        </div>
        <div className="lane-head-icon" />
        <div className="lane-title">
          {showSearchLaneTitle ? this.renderSearchLaneTitle() : name}
        </div>
      </div>);
  }
  handleChangeFilter = (data) => {
    if (data === undefined) {
      this.setState({});
    } else {
      this.setState({
        dataSite: 'init',
      });
      this.props.changeOptions('filterData', { ...data });
    }
  }
  changeFilter = (status) => {
    const { option } = this.props;
    const { showFilter } = option;
    if (status === undefined) {
      this.props.changeOptions('showFilter', !showFilter);
    } else {
      this.props.changeOptions('showFilter', status);
    }
    this.setState({});
  }
  filterStock = () => {
    const { option: { filterData = {} } } = this.props;
    const status = filterData.groupType === -1;
    if (status) {
      delete filterData.groupType;
    } else {
      filterData.groupType = -1;
    }
    this.setState({
      dataSite: 'init',
    });
    this.props.changeOptions('filterData', filterData);
    // this.props.changeOptions('isFilterStock', );
  }
  renderTools = () => {
    const { changeOptions, option, defaultOptions: { toolsMode } } = this.props;
    const { filter,
      showCustomStock,
      showSetting,
      name,
      settingTips,
      settingLink } = this.state;
    const { showFilter } = option;
    const filterDisplay = filter && filter.length > 0;
    const { filterData = {} } = option;
    const { groupType } = filterData;
    if (toolsMode && toolsMode === 'tips') {
      return (
        <Tooltip
          title="移除看板"
          placement="left"
        >
          <span className="lane-head-tips" onClick={this.props.onRemove}>
            <i className="iconfont mr5">&#xe603;</i>
          </span>
        </Tooltip>

      );
    }
    return (<div
      className="lane-tools"
    >
      {showCustomStock ? <Tooltip
        overlayClassName="lane-filter-tooltips"
        placement="left"
        title="一键筛选自选股"
      >
        <i
          onClick={() => this.filterStock()}
          className={cs('iconfont', { active: groupType === -1 })}
        >&#xe63e;</i>
      </Tooltip> : null}
      {showSetting ? <Tooltip
        overlayClassName="lane-filter-tooltips"
        placement="left"
        title={`${settingTips || `管理${name}`}`}
      >
        <a style={{ color: '#949cb3' }} href={settingLink} target={'_blank'}>
          <i className="iconfont">&#xe742;</i>
        </a>
      </Tooltip> : null}
      <i
        onClick={() => this.changeFilter()}
        className={cs('iconfont', { opened: showFilter })}
      >&#xe60f;</i>
    </div>);
  }
  renderMore = () => {
    return (<LaneFilterFooter className={'lane-more-footer'}>
      <span
        onClick={this.props.onRemove}
      >
        <i className="iconfont mr5">&#xe603;</i>
        移除看板</span>
      <span
        onClick={() => this.changeFilter(false)}
      >
        <i className="iconfont mr5">&#xe653;</i>
        收起
      </span>
    </LaneFilterFooter>);
  }
  getCardsHeight = () => {
    const { wrap, headWrap } = this;
    if (wrap === undefined || headWrap === undefined) {
      return '100%';
    }
    const parentHeight = wrap.getBoundingClientRect().height;
    const headHeight = headWrap.getBoundingClientRect().height;
    return `${parentHeight - headHeight}px`;
  }

  handleScroll = (scrollOption, scrollBar) => {
    const { limit, offset } = scrollOption;
    if (limit.y === offset.y) {
      if (this.state.loading !== 'pending') {
        this.refreshLane({ autoFetch: false, dataSite: 'after' });
      }
      this.setState({});
    }
  }

  throttle = _.throttle(this.handleScroll, 200);

  getCards = () => {
    const { updateTime } = this.state;
    const { option } = this.props;
    const { cards = [] } = option;
    const cardComponents = cards.reduce((a, b) => {
      const card = this.getCardByType(b.cardType);
      if (card !== null) {
        b.component = card;
        a.push(b);
      }
      return a;
    }, []);
    const cardSet = new Set();
    return cardComponents.filter((v) => {
      if (cardSet.has(v.cardId)) {
        return false;
      }
      cardSet.add(v.cardId);
      return true;
    }).map((v) => {
      return React.createElement(v.component, { ...v, updateTime, key: `${option.subscribeId}${v.cardId}` });
    });
  }
  // 获取缺省图类型
  getDefaultCardType = () => {
    const { option: { subscribeId: laneId, resCode, filterData } } = this.props;
    let type = 0;
    if (resCode === 80006) { // 无订阅或者没有添加自选股
      if (laneId === 'Y_1004') {
        return 2;
      }
      return 1;
    }
    if (!`${resCode}`.startsWith('8') && resCode !== 200) { // 数据请求异常
      return 4;
    }

    if (laneId === 'Y_1003' && _.isEmpty(filterData)) { // 自选股泳道
      type = 1;
    }
    if (laneId === 'Y_1004' && _.isEmpty(filterData)) { // 持仓泳道
      type = 2;
    }
    if (laneId === 'Y_1005' || laneId === 'Y_1006' || laneId === 'Y_1007') {
      type = 3;
    }
    return type;
  }
  render() {
    const { connectDragSource, option, defaultOptions = {} } = this.props;
    const { filter, active, dataSite } = this.state;
    const { showFilter, filterData, filterTags,
      willUpdate, isFilterLoading, loading,
      autoFetch = false, cards = [], subscribeId, resCode } = option;
    const { freshType } = defaultOptions;
    let beforeLoading = false;
    if (loading === 'pending' && dataSite === undefined) {
      beforeLoading = true;
    } else if (loading === 'pending' && autoFetch === false) {
      beforeLoading = true;
    }
    if (freshType === '直接刷新' && dataSite === 'before' && autoFetch === true) {
      beforeLoading = false;
    }
    if (dataSite === 'after') {
      beforeLoading = false;
    }
    return (<div
      ref={el => this.wrap = el}
      className={cs('lane', { inActive: active, 'hot-search-lane': subscribeId === 'Y_1008' })}
    >
      <div
        ref={el => this.headWrap = el}
        className="lane-head-wrap"
        style={cards.length > 0 ? {} : { position: 'absolute' }}
      >
        {connectDragSource ? connectDragSource(this.renderTitle()) : this.renderTitle()}
        {this.renderTools()}
        <div className="lane-search">
          <div className="lane-search-filter">
            {showFilter ? <LaneFilterIcon /> : null}
            <LaneFilter
              regOptions={this.regOptions}
              filterStatus={showFilter}
              values={filterData}
              filterTags={filterTags}
              laneId={option.subscribeId}
              footer={this.renderMore()}
              onChange={this.handleChangeFilter}
              options={filter}
              showMoreFilter={() => {
                this.changeFilter();
              }}
            />
          </div>
        </div>
        <div className="lane-fresh-wrap">
          {willUpdate ? <div
            onClick={() => this.refreshLane({ dataSite: 'before' })}
            className="lane-refresh"
          >
            <i className="iconfont">&#xe61c;</i>
            当前面板有数据更新, 点击查看
          </div> : null}
        </div>

        { beforeLoading ? <div
          className="lane-refresh"
        >
          <Spin />
        </div> : null}

      </div>
      <div
        className={'lane-scroll-wrap'}
      >
        <Scrollbar
          onScroll={this.throttle}
          damping={0.5}
          thumbMinSize={200}
        >
          <div
          // style={{ height: this.getCardsHeight() }}
            className="lane-cards"
          >
            {cards.length > 0 && this.getCards()}
            {
              loading === 'done' && cards.length === 0 &&
              <DefaultCard
                type={this.getDefaultCardType()}
              />
            }
          </div>
        </Scrollbar>
      </div>
      {loading === 'pending' && dataSite === 'after' ? <div
        className="lane-refresh lane-refresh-bottom-loading"
      >
        <Spin />
      </div> : null}
    </div>
    );
  }
}
