import React, { Component, Fragment } from 'react';
import {
  Menu, Avatar, Button,
  Input, Icon, Divider,
  Drawer,
} from 'antd';
import { inject, observer } from 'mobx-react';
import Scrollbar from 'react-smooth-scrollbar';
import ReactTooltip from 'react-tooltip';
import IconSvg from '../../components/IconSvg';
import RecommendCard from './component/RecommendCard';
import SearchInput from './component/SearchInput';

import DragMenus from './component/DragMenus';
import './index.scss';
import logo from './images/logo.svg';
import A from './images/A.svg';
import workbench from './images/workbench.png';
import market from './images/market.png';

import UserButton from '../../components/UserButton';
import ProductButton from '../../components/ProductButton';
const SubMenu = Menu.SubMenu;
const { SearchSVG, AppSVG, ExpandSVG, PackUpSVG } = IconSvg;

/**
 * 分割线
 * @param {样式} style object
 */
const getDivider = (style) => {
  return (
    <Divider
      style={{
        ...{
          margin: '0 10px',
          width: '130px',
          backgroundColor: 'rgba(148, 156, 179, 0.3)',
        },
        ...style,
      }}
    />
  );
};

@inject('laneStore')
@observer
class MenuBar extends Component {
  static defaultProps = {
    dataSource: [
      {
        id: 0,
        name: '',
        type: 'png',
        icon: 'AppSVG',
      },
      {
        id: 1,
        type: 'png',
        name: '市场动态',
        icon: 'AppSVG',
      },
    ],
  }
  constructor(props) {
    super(props);
    this.state = {
      isExpand: true,
      visible: false,
      openKeys: ['market'],
      isExpandMarket: true,
      tooltipKey: 0,
      searchInputValue: '',
      showSearchInput: false,
    };
  }

  componentDidMount = () => {
    const { fetchRecommendGroup } = this.props.laneStore;
    fetchRecommendGroup();
  }

  /**
   * 展开收起操作
   */
  handleExpandChange = (expand) => {
    this.setState({
      isExpand: !expand,
    });
  }
  /**
   * 收起推荐看板
   */
  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  /**
   * 展示推荐看板
   */
  showRecommend = () => {
    this.setState({
      visible: true,
    });
  };

  onClickRecommendBtn=(visible) => {
    this.setState({
      visible: !visible,
    });
  }

  /**
   * 获取Menu的Icon，Icon类型会有图片（png）或者 Svg
   */
  getMenuIcon = (item) => {
    const { icon } = item;
    if (item.type === 'svg') {
      return (
        <Icon
          component={() => {
            return (
              <svg className="icon" aria-hidden="true">
                <use xlinkHref={`#${icon}`} />
              </svg>
            );
          }}
        />
      );
    } else if (item.type === 'png') {
      return <Avatar src={icon} />;
    }
  }

  /**
   * 展开收起市场子菜单
   */
  expandMenu = (openkey) => {
    this.setState({
      openKeys: [openkey],
    });
  }

  updateTooltip = () => {
    this.$tooltip.setState({});
  }

  handleSearchInputChange=(e) => {
    const { value } = e.target;
    this.setState({
      searchInputValue: value,
    });
  }

  onPressEnter = () => {
    const { laneStore } = this.props;
    const { addLane } = laneStore;
    const { searchInputValue } = this.state;
    addLane('Y_1000', searchInputValue);
    this.setState({
      searchInputValue: '',
    });
  }

  /**
   * 展开渲染
   */
  renderExpand = () => {
    const { openKeys, isExpand, visible } = this.state;
    const [openkey] = openKeys;
    const { dataSource, laneStore } = this.props;
    const { lanes, getLaneOptionsById, addLane, updateLaneSort } = laneStore;
    const { setCategoryTypes } = laneStore;
    const divider = getDivider();
    return (
      <div className="fixed">
        {/* logo */}
        <img className="logo" src={logo} alt="Analyst.私募" />
        {/* 搜索 */}
        <SearchInput
          placeholder="搜索"
          addLane={addLane}
          onPressEnter={() => { this.onClickRecommendBtn(true); }}
        />
        {divider}
        {/* 菜单栏 */}
        <div className="menu" ref={(node) => { this.menuNode = node; }}>
          <div
            key="workteam"
            className="item middle"
            level="1"
            isexpand={openkey === 'workteam' ? 'true' : 'false'}
            onClick={() => {
              this.expandMenu('workteam');
              this.onClickRecommendBtn(true);
            }}
          >
            <div>
              <span className="menuIcon image">
                <Avatar size={20} src={workbench} />
              </span>
              <span className="menuName">
                工作台
              </span>
            </div>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-jiantouxia" />
            </svg>
          </div>
          <Scrollbar
            className="subMenu"
            thumbMinSize={20}
          >
            <DragMenus
              getLaneOptionsById={getLaneOptionsById}
              lanes={lanes}
              isExpand={isExpand}
              onDrop={updateLaneSort}
            />
            {/* 推荐看板 */}
            {/* <div className="item"> */}
            <Button className={`showRecommendBtn ${visible ? 'active' : ''}`}
              onClick={() => {
                setCategoryTypes(['团队消息', '团队关注']);
                this.onClickRecommendBtn(visible);
              }}
            >
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-plus" />
              </svg>
              <span style={{ marginLeft: '10px' }}>推荐看板</span>
            </Button>
            {/* </div> */}
          </Scrollbar>
          {divider}
          <div
            key={1}
            className="item middle"
            isexpand={openkey === 'market' ? 'true' : 'false'}
            level="1"
            onClick={() => {
              this.expandMenu('market');
              this.onClickRecommendBtn(true);
            }}
          >
            <div>
              <span className="menuIcon image">
                <Avatar size={20} src={market} />
              </span>
              <span className="menuName">
                市场动态
              </span>
            </div>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-jiantouxia" />
            </svg>
          </div>
          {/* TODO 市场动态子菜单 */}
          <Scrollbar
            className="subMenu"
            thumbMinSize={20}
          >
            <DragMenus
              getLaneOptionsById={getLaneOptionsById}
              lanes={lanes}
              isExpand={isExpand}
              onDrop={updateLaneSort}
            />
            {/* 推荐看板 */}
            {/* <div className="item"> */}
            <Button className={`showRecommendBtn ${visible ? 'active' : ''}`}
              onClick={() => {
                setCategoryTypes(['综合看板', '资讯看板', '研报看板', '公告看板']);
                this.onClickRecommendBtn(visible);
              }}
            >
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-plus" />
              </svg>
              <span style={{ marginLeft: '10px' }}>推荐看板</span>
            </Button>
            {/* </div> */}
          </Scrollbar>
        </div>

        {/* 底边工具栏 */}
        <div className="bottomBar">
          {divider}
          <div className="item product-item">
            {/* <span className="menuIcon">
              <AppSVG style={{ fontSize: '12px' }} />
            </span>
            <span className="menuName">应用</span> */}
            <ProductButton />
          </div>
          {divider}
          <div className="item user-item">
            {/* <span className="menuIcon">
              <AppSVG style={{ fontSize: '12px' }} />
            </span>
            <span className="menuName">应用</span> */}
            <UserButton />
          </div>
          {divider}
          <div
            className="item expandBtn"
            onClick={() => {
              this.handleExpandChange(this.state.isExpand);
            }}
          >
            <PackUpSVG />
          </div>
        </div>

      </div>
    );
  }

  /**
   * 收起渲染
   */
  renderPackUp = () => {
    const { isExpand, openKeys, visible, showSearchInput } = this.state;
    const [openkey] = openKeys;
    const { dataSource, laneStore } = this.props;
    const { lanes, getLaneOptionsById, updateLaneSort, addLane } = laneStore;
    const divider = getDivider({ width: '40px' });
    return (
      <div
        className="fixed"
      >
        {/* logo */}
        <img className="logo" src={A} alt="Analyst.私募" />
        {/* 搜索 */}
        {/* <Input
          // placeholder="搜索"
          suffix={<SearchSVG style={{ fontSize: '17px', color: '#407CD5' }} />}
        /> */}
        <div className="searchWrap">
          <Button
            className="searchBtn"
            onClick={() => {
              this.setState({
                showSearchInput: true,
              });
            }}
          >
            <SearchSVG style={{ fontSize: '17px', color: '#407CD5' }} />
          </Button>
          {
            showSearchInput
              ? <SearchInput
                placeholder="搜索"
                addLane={addLane}
                width={130}
                onBlur={() => {
                  this.setState({
                    showSearchInput: false,
                  });
                }}
              />
              : ''
          }

        </div>
        {divider}
        <div
          className="menu"
          ref={(node) => { this.minMenuNode = node; }}
        >
          <div
            key={0}
            className="item"
            data-for="menuTooltip"
            data-tip="工作台"
            isexpand={openkey === 'workteam' ? 'true' : 'false'}
            level="1"
            onClick={() => {
              this.onClickRecommendBtn(true);
              this.expandMenu('workteam');
            }}
          >
            <span className="menuIcon image">
              <Avatar size={20} src={workbench} />
            </span>
          </div>
          <Scrollbar
            className="subMenu"
            thumbMinSize={20}
          >
            {
              <DragMenus
                isExpand={isExpand}
                getLaneOptionsById={getLaneOptionsById}
                lanes={lanes}
                onDrop={updateLaneSort}
              />
            }
            {/* 推荐看板 */}
            <Button
              className={`showRecommendBtn ${visible ? 'active' : ''}`}
              onClick={() => { this.onClickRecommendBtn(visible); }}
            >
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-plus" />
              </svg>
            </Button>
          </Scrollbar>
          {divider}
          <div
            key={1}
            className="item"
            level="1"
            data-for="menuTooltip"
            data-tip="市场动态"
            isexpand={openkey === 'market' ? 'true' : 'false'}
            onClick={() => { this.expandMenu('market'); }}
          >
            <span className="menuIcon image">
              <Avatar size={20} src={market} />
            </span>
            {/* <span className="menuName">
              市场动态
            </span> */}
          </div>
          {/* TODO 市场动态子菜单 */}

          <Scrollbar
            className="subMenu"
            thumbMinSize={20}
          >
            {
              <DragMenus
                isExpand={isExpand}
                getLaneOptionsById={getLaneOptionsById}
                lanes={lanes}
                onDrop={updateLaneSort}
              />
            }
            {/* 推荐看板 */}
            <Button
              className={`showRecommendBtn ${visible ? 'active' : ''}`}
              onClick={() => { this.onClickRecommendBtn(visible); }}
            >
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-plus" />
              </svg>
            </Button>
          </Scrollbar>
        </div>

        {/* 底边工具栏 */}
        <div className="bottomBar">
          {divider}
          <div
            className="item product-item"
            data-for="menuTooltip"
            data-tip="应用"
          >
            {/* <span className="menuIcon">
              <AppSVG style={{ fontSize: '12px' }} />
            </span> */}
            {/* <span className="menuName">应用</span> */}
            <ProductButton />
          </div>
          {divider}
          <div
            className="item user-item"
            data-for="menuTooltip"
            data-tip="个人中心"
          >
            {/* <span className="menuIcon">
              <AppSVG style={{ fontSize: '12px' }} />
            </span> */}
            {/* <span className="menuName">应用</span> */}
            <UserButton />
          </div>
          {divider}
          <div
            className="item expandBtn"
            onClick={() => {
              this.handleExpandChange(this.state.isExpand);
            }}
          >
            <ExpandSVG />
          </div>
        </div>
        <ReactTooltip
          className="menuTooltip"
          offset={{ left: 10 }}
          place="right"
          type="dark"
          effect="solid"
          id="menuTooltip"
          delayUpdate={1000}
        />
      </div>
    );
  }

  render() {
    const { isExpand } = this.state;
    return (
      <div
        className={`menuBar ${isExpand ? '' : 'min'}`}
        ref={(node) => { this.node = node; }}
      >
        {
          isExpand
            ? this.renderExpand()
            : this.renderPackUp()
        }
        <Drawer
          title="推荐看板"
          placement="left"
          // closable={false}
          width={540}
          onClose={this.onClose}
          visible={this.state.visible}
          getContainer={this.node}
        >
          <RecommendCard onClick={() => {
            this.setState({
              isExpand: true,
            });
          }}
          />
        </Drawer>
      </div>
    );
  }
}

export default MenuBar;
