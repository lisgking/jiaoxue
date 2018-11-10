/**
 * @author hawk
 * @date 2018年10月09日
 */
import { observable, action, runInAction, flow, computed } from 'mobx';
import { CancelToken } from 'axios';
import { message } from 'antd';

import subscribe from '.././lib/subscribe';
import ask from '../lib/ask';
import mapSourceToCard from '../lib/mapSourceToCard';
const source = CancelToken.source();

function getKeyText(lane, key, value) {
  const { keyMaps } = lane;
  if (key === 'groupType' && value === -1) {
    return '自选股';
  }
  const target = keyMaps[key];
  if (target === undefined) {
    return '';
  }

  const targetItem = target.find(v => v.value === value);
  if (targetItem !== undefined && targetItem.text !== undefined) {
    return targetItem.text;
  }
  return '';
}

function goToLane(target, id) {
  const l = target.getLaneById(id);
  if (l.goToLane) {
    l.goToLane();
  } else {
    setTimeout(() => goToLane(target, id), 100);
  }
}

function filterEmpty(props) {
  const data = {};
  Object.keys(props).forEach((v) => {
    if (props[v] !== '' && props[v] !== undefined) {
      data[v] = props[v];
    }
  });
  return data;
}

const workteamGroup = [{
  category: '团队消息',
  itemList: [
    {
      id: 30,
      isAdd: 0,
      templateId: 1016,
      name: '评论',
      iconUrl: 'icon-c-huojiangfenxishiyanbao',
      category: '研报看板',
      option: null,
      filter: null,
      status: 1,
      sort: 0,
    },
    {
      id: 31,
      isAdd: 1,
      templateId: 1017,
      name: '批注',
      iconUrl: 'icon-c-chenhuizaobao',
      category: '研报看板',
      option: null,
      filter: null,
      status: 1,
      sort: 0,
    },
    {
      id: 29,
      isAdd: 0,
      templateId: 1015,
      name: '团队@',
      iconUrl: 'icon-czuixinyanbao',
      category: '研报看板',
      option: null,
      filter: null,
      status: 1,
      sort: 0,
    },
  ],
}];

class LaneStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }
  $name = '泳道'
  $description = '存放泳道相关数据'
  subscribe = subscribe
  // 推荐看板列表
  // @observable
  // recommendGroup = []
  categoryItems = []

  @observable
  channelGroup = [];

  /**
   * @description
   * @lane = {
   *  subscribeId: 1001,
   *  name: '',泳道标题 或者是搜索泳道关键字
   *  willUpdate: true, // 用于控制是否有新的消息
   *  loading: false, // 泳道处于加载中
   *  showRefresh: false, // 是否显示手动刷新
   *  cards: [],  // 列表项
   * }
   */
  @observable
  lanes = [
    // {
    //   subscribeId: 'Y_1000', // OK
    //   keywords: '京东',
    // },
    // {
    //   subscribeId: 'Y_1001', //OK
    //   showFilter: false,
    //   willUpdate: true,
    // }, {
    //   subscribeId: 'Y_1002', // 参数应该怎么传还没有确定
    //   showFilter: false,
    //   cards: [],
    // },
    // {
    //   subscribeId: 'Y_1003', // 筛选项行业未完成
    //   showFilter: false,
    //   cards: [],
    // },
    // {
    //   subscribeId: 'Y_1004', // 筛选项行业未完成
    //   showFilter: false,
    //   cards: [],
    // }, {
    //   subscribeId: 'Y_1008',  // ok, 没有筛选
    //   showFilter: false,
    //   cards: [],
    // }, {
    //   subscribeId: 'Y_1011', // ok, 没有筛选
    //   showFilter: false,
    //   cards: [],
    // }, {
    //   subscribeId: 'Y_1012', // ok
    //   showFilter: false,
    //   cards: [],
    // }, {
    // subscribeId: 'Y_1013',  // ok
    // showFilter: false,
    // cards: [],
    // subscribeId: 'Y_1015',   // ok
    // showFilter: false,
    // cards: [],
    // },
    // }, {
    // subscribeId: 'Y_1016',  // ok
    // showFilter: false,
    // cards: [],
    // }, {
    // subscribeId: 'Y_1017', // ok
    // showFilter: false,
    // cards: [],
    // }, {
    // subscribeId: 'Y_1018', // 公司, 行业, 公告分类未完成
    // showFilter: false,
    // cards: [],
    // }, {
    // subscribeId: 'Y_1019', // 公司, 行业, 公告分类未完成
    // showFilter: false,
    // cards: [],
  ]
  @computed get allLanes() {
    return this.lanes;
  }
  // @action.bound
  // updateLane(subscribeId) {
  //   const target = this.lanes.find(v => v.subscribeId === subscribeId);
  //   if (target === undefined) {
  //     console.log('泳道ID未被订阅');
  //   }
  // }
  @observable
  categoryTypes = ['综合看板', '资讯看板', '研报看板', '公告看板']

  @action
  setCategoryTypes = (categoryTypes) => {
    this.categoryTypes = categoryTypes;
  }

  @computed
  get getBoardItems() {
    return this.channelGroup.reduce((a, c) => {
      if (this.categoryTypes.indexOf(c.category) > -1) {
        a.push(c);
      }
      return a;
    }, []);
  }

  @computed
  get workteamGroup() {
    const list = ['团队消息', '团队关注'];
    const resultList = this.channelGroup.reduce((a, c) => {
      if (c.category.indexOf(list)) {
        a.push(c);
      }
      return a;
    }, []);
  }
  @computed
  get recommendGroup() {
    const list = ['综合看板', '资讯看板', '研报看板', '公告看板'];
    return this.channelGroup.reduce((a, c) => {
      if (c.category.indexOf(list)) {
        a.push(c);
      }
      return a;
    }, []);
  }

  @action.bound
  updateLanes() {
    this.lanes.length = 0;
  }

  /**
  |--------------------------------------------------
  | 方法相关
  |--------------------------------------------------
  */
  /**
  * @description 根据传入的泳道ID, 返回泳道对应的选项
  * @param {*} subscribeId
  * @returns
  * @memberof LaneStore
  */
  getLaneOptionsById = (subscribeId) => {
    const target = this.subscribe[subscribeId];
    if (target === undefined) {
      // debugger;
      // throw new Error('传入的泳道ID不存在');
      return undefined;
    }
    const recommend = this.getRecommendById(subscribeId);
    if (recommend) {
      const data = { ...recommend, filterData: recommend.filter };
      delete data.filter;
      return { ...target, ...data };
    }
    return { ...target };
  };
  getLaneByIndex = (index) => {
    return this.lanes[index];
  }

  getLaneById = (id) => {
    return this.lanes.find(v => v.id === id);
  }

  /**
  |--------------------------------------------------
  | 泳道操作
  |------------------------------getLaneOptionsById--------------------
  */
  refreshLanes = () => {
    runInAction(() => {
      this.lanes = [...this.lanes];
    });
  }
  @action.bound
  moveLane(firstLaneIndex, secondLaneIndex) {
    const firstLane = this.lanes[firstLaneIndex];
    const secondLane = this.lanes[secondLaneIndex];
    this.lanes[firstLaneIndex] = secondLane;
    this.lanes[secondLaneIndex] = firstLane;
    this.lanes = this.lanes.slice();
  }

  @action.bound
  removeLane(index) {
    this.lanes.splice(index, 1);
    this.lanes = [...this.lanes];
  }

  @action.bound
  changeLaneOption(index, key, options) {
    if (index === undefined || key === undefined) {
      throw new Error('请传入正确参数, index, key, ?options');
    }
    const lane = this.getLaneByIndex(index);
    if (lane === undefined) {
      throw new Error('泳道不可为undefined');
    }
    if (lane[key] === undefined || lane[key] === null) {
      lane[key] = {};
    }

    // 这里做一个判断, 作为filter的筛选作用, 用于处理筛选请求
    if (key === 'filterData') {
      Object.assign(lane[key], options);
      lane.allData = [];
      lane.cacheData = [];
      lane.cards = [];
      lane.isFilterLoading = true;
      lane.willUpdate = false;
      lane.startTime = Date.now();
      lane.dataSite = 'init';
      delete lane.endTime;
      const filterTags = [];
      Object.keys(options).forEach((v) => {
        if (options[v] === undefined || options[v] === '') {
          return;
        }
        const type = typeof options[v];
        if (type !== 'string' && type !== 'number') {
          if (typeof options[v].forEach === 'function') {
            options[v].forEach((val) => {
              filterTags.push({
                key: v,
                value: val,
                tag: this.getKeyText(lane, v, val),
              });
            });
          } else {
            console.error('一个错误的类型未被处理');
          }
        } else if (v === 'keyword' || v === 'keyword_filter') {
          if (options[v] !== '' && options[v] !== undefined) {
            filterTags.push({
              key: v,
              value: options[v],
              tag: options[v],
            });
          }
        } else if (v === 'groupType') {
          if (options[v] === -1) {
            filterTags.push({
              key: v,
              value: options[v],
              tag: '自选股',
            });
          }
        } else if (v === 'filterType' || v === 'sourceType') {
          if (options[v] !== '0') {
            filterTags.push({
              key: v,
              value: options[v],
              tag: this.getKeyText(lane, v, options[v]),
            });
          }
        } else {
          filterTags.push({
            key: v,
            value: options[v],
            tag: this.getKeyText(lane, v, options[v]),
          });
        }
      });
      lane.filterTags = [...filterTags];
      lane.refresh({});
      Object.keys(options).forEach((v) => {
        if (options[v] === undefined || options[v] === '') {
          delete options[v];
        }
      });
      lane.filterData = options;
      this.fetchLane({
        laneId: lane.id,
        subscribeId: lane.subscribeId,
      });
      const filterUndefined = {};
      Object.keys(options).forEach((v) => {
        if (options[v] !== undefined && options[v] !== '') {
          filterUndefined[v] = options[v];
        }
      });
      try {
        const resp = ask('updateLaneFilter', {
          data: {
            id: lane.id,
            filter: JSON.stringify({ filterTags, filterData: filterUndefined } || {}),
          },
        });
      } catch (error) {
        console.error(`${lane.name}更新过滤条件失败`, error);
      }
      // this.fetchLane(options).then((res) => {
      //   console.log(res);
      // });
    } else {
      Object.keys(options).forEach((v) => {
        if (options[v] === undefined || options[v] === '') {
          delete options[v];
        }
      });
      lane[key] = options;
    }
    // this.lanes = this.lanes.slice();
  }

  @action.bound
  addLane = async (subscribeId, keyword) => {
    // 判断是否关键字搜索频道
    if (keyword && subscribeId === 'Y_1000') {
      const keywordLane = this.lanes.find((v) => {
        return v.subscribeId === subscribeId && v.name === keyword;
      });
      if (keywordLane) {
        keywordLane.goToLane();
        return;
      }
    }
    try {
      const lane = this.getRecommendById(subscribeId);
      const sort = this.lanes.length;
      const resp = await ask('addLane', {
        data: {
          keyword,
          sort,
          templateId: lane ? lane.templateId : '1000',
        },
      });
      runInAction(() => {
        if (resp && resp.code === 200) {
          console.log(`创建泳道${subscribeId}成功`);
          if (keyword === undefined) {
            const laneData = {
              id: resp.data.id,
              subscribeId,
              name: resp.data.name,
              showFilter: false,
              filterData: {},
              allData: [], // 存放泳道所有数据
              cacheData: [], // 缓存待刷新的数据
              cards: [], // 卡片列表
              keyMaps: {}, // 保存filterData的下拉字典
              filterTags: [], // 保存所有的下拉标签
            };
            if (resp.data.option !== null) {
              laneData.serverOptions = JSON.parse(resp.data.option);
            }
            this.lanes.push(laneData);
          } else {
            this.lanes.push({
              id: resp.data.id,
              subscribeId,
              keywords: keyword,
              name: keyword,
              showFilter: false,
              allData: [], // 存放泳道所有数据
              cacheData: [], // 缓存待刷新的数据
              cards: [], // 卡片列表
              keyMaps: {}, // 保存filterData的下拉字典
              filterTags: [], // 保存所有的下拉标签
            });
          }
        }
        this.lanes = [...this.lanes];
        goToLane(this, resp.data.id);
      });
    } catch (error) {
      console.log(error);
    }
  }
  @action.bound
  deleteLane = async ({ index, subscribeId }) => {
    if (this.lanes.length < 2) {
      message.warning('看板至少保留1个泳道。');
      return;
    }
    let lane = '';
    if (index !== undefined) {
      lane = this.lanes[index];
      this.removeLane(index);
    } else if (subscribeId !== undefined) {
      const i = this.lanes.findIndex(v => v.subscribeId === subscribeId);
      lane = this.lanes.find(v => v.subscribeId === subscribeId);
      this.removeLane(i, this.lanes);
    } else {
      console.log('传入参数错误');
    }
    try {
      const { id } = lane;
      const resp = await ask('deleteLane', {
        data: {
          id,
        },
      });
    } catch (error) {
      console.error('删除频道失败', error);
    }
  }
  /**
  |--------------------------------------------------
  | 数据加载相关
  |--------------------------------------------------
  */
  /**
   * @description 获取当前用户所有泳道
   *
   * @memberof LaneStore
   */
  fetchLanes = async (options) => {
    // const data = await new Promise((resolve, reject) => {
    //   setTimeout(() => resolve('666'), 1000);
    // });
    try {
      const resp = await ask('fetchUseLaneList');
      runInAction(() => {
        if (resp && resp.code === 200) {
          this.lanes = resp.data.map((item) => {
            const filter = item.filter ? JSON.parse(item.filter) : {};
            const laneData = {
              id: item.id,
              subscribeId: `Y_${item.templateId}`,
              showFilter: false,
              name: item.name,
              willUpdate: false,
              cards: [],
              filterData: filter.filterData || {},
              keyMaps: {}, // 保存filterData的下拉字典
              filterTags: filter.filterTags || [], // 保存所有的下拉标签
            };
            const { option } = item;
            if (option !== null && option !== undefined && option !== '') {
              const serverOptions = JSON.parse(option);
              laneData.serverOptions = serverOptions;
            }
            return laneData;
          });
          window.lanes = this.lanes;
        }
      });
    } catch (error) {
      console.error('查询已添加频道失败', error);
    }
  };
  /**
   * @description 获取泳道数据
   *
   * @memberof LaneStore
   */
  fetchLane = async ({ subscribeId,
    laneId,
    filterData = {},
    autoFetch,
    dataSite = 'init' } = {}) => {
    let lane;
    if (laneId !== undefined) {
      lane = this.lanes.find(v => v.id === laneId);
    } else {
      message.error('泳道查询失败');
    }
    if (lane === undefined) {
      throw new Error(`传入了一个错误的泳道参数: ${subscribeId}${laneId}`);
    }
    if (lane !== undefined) {
      if (lane.loading === true) {
        console.log('block ajax in here');
      }
    } else {
      console.log('找不到泳道');
      return [];
    }
    Object.assign(filterData, lane.filterData);
    const option = this.getLaneOptionsById(subscribeId);
    lane.autoFetch = autoFetch;
    // 这里判断是否可以从缓存取数据
    if (lane.willUpdate === true && autoFetch === false) {
      lane.cards = [...lane.cacheData,
        ...lane.cards];
      lane.cacheData = [];
      lane.willUpdate = false;
      return lane.cards;
    }
    // let data = [],
    let askMethod;
    // 关键字搜索泳道
    if (subscribeId === 'Y_1000') {
      askMethod = 'privateKeywordSearch';
      // 精选推荐
    } else if (subscribeId === 'Y_1001') {
      askMethod = 'privateSelectionRecommend';
      // 重要公告
    } else if (subscribeId === 'Y_1018') {
      askMethod = 'notice';
      // new公告
    } else if (subscribeId === 'Y_1019') {
      askMethod = 'importantNotice';
      // 自选股, 持仓
    } else if (subscribeId === 'Y_1003' || subscribeId === 'Y_1004') {
      askMethod = 'myStockTimeLine';
      // 获奖分析师
    } else if (subscribeId === 'Y_1016') {
      // return;
      askMethod = 'analystReport';
      // new资讯
    } else if (subscribeId === 'Y_1013') {
      askMethod = 'privateNews';
      // 7*24小时快讯
    } else if (subscribeId === 'Y_1011') {
      askMethod = 'flashNews';
      // 精选专题研报
    } else if (subscribeId === 'Y_1002') {
      // 精选专题研报
      askMethod = 'privateSubjectReport';
      // 公众号动态
    } else if (subscribeId === 'Y_1012') {
      askMethod = 'privateWechatTime';
      // 热搜
    } else if (subscribeId === 'Y_1008') {
      askMethod = 'privateTopSearch';
      // new研报
    } else if (subscribeId === 'Y_1015') {
      askMethod = 'privateReport';
      // 晨会早报也是一种研报
    } else if (subscribeId === 'Y_1017') {
      askMethod = 'privateReport';
    }
    if (askMethod === undefined) {
      // debugger;
    }
    const resData = await this.fetchLaneWithParams({
      askMethod,
      lane,
      subscribeId,
      filterData,
      autoFetch,
      dataSite,
    });
    if (resData === null) {
      lane.loading = 'done';
      lane.refresh({});
      return;
    }
    const filterUndefined = {};
    Object.keys(filterData).forEach((v) => {
      if (filterData[v] !== undefined && filterData[v] !== '') {
        filterUndefined[v] = filterData[v];
      }
    });
    const { autoFetchMode } = option;
    let data;
    if (autoFetchMode === 'allReplace') {
      const item = resData || [];
      if (dataSite === 'init') {
        lane.allData = [...item];
      } else if (dataSite === 'before') {
        lane.allData = [...item, ...lane.allData];
      } else if (dataSite === 'after') {
        lane.allData = [...lane.allData, ...item];
      }
      // 如果是公众号动态和精选专题研报，需要全量替换lane.allData
      if (subscribeId === 'Y_1012' || subscribeId === 'Y_1002' || subscribeId === 'Y_1016') {
        lane.allData = [...item];
        if (subscribeId === 'Y_1016') {
          lane.allData = item;
        }
      }
      const daysData = mapSourceToCard({
        subscribeId,
        data: lane.allData,
        filterData: filterUndefined,
      });
      if (Object.keys(daysData).length > 0) {
        if (daysData.startTime) {
          if (dataSite === 'init' || dataSite === 'before') {
            lane.startTime = daysData.startTime;
          }
        }
        if (daysData.endTime) {
          if (dataSite === 'init' || dataSite === 'after') {
            lane.endTime = daysData.endTime;
          }
        }
        lane.cards = [...daysData.list];
      }
    } else {
      data = mapSourceToCard({ subscribeId, filterData: filterUndefined, data: resData });
      if (Object.keys(data).length > 0) {
        this.handleFetchDataWithLane({ subscribeId, lane, data, autoFetch, dataSite });
      }
    }
    const cardSet = new Set();
    const filteredCards = lane.cards.filter((v) => {
      if (cardSet.has(v.cardId)) {
        console.warn(`发现重复卡片数据: 卡片ID${v.cardId}, 数据已被泳道过滤`);
        return false;
      }
      cardSet.add(v.cardId);
      return true;
    });
    lane.isFilterLoading = false;
    // lane.cards = filteredCards;
    lane.refresh({});
    return lane.cards;
  }
  /**
   * @description 下面方法用于对泳道收到数据之后的处理, 比如缓存, 比如更新
   * @param subscribeId
   * @param lane
   * @param data
   * @param autoFetch
   * @param dataSite
   */
  handleFetchDataWithLane = ({ subscribeId, lane, data = [], autoFetch, dataSite }) => {
    // 判断数据是前面还是后面, 用于更新 startTime 与 endTime, 并且添加数据到所有的列表
    if (data.length === undefined) {
      const { startTime, endTime } = data;
      data = data.list;
      console.log(data);
      if (lane.allData === undefined) { lane.allData = [...data]; }
      if (dataSite === 'before') {
        lane.startTime = startTime || lane.startTime;
        lane.allData = [...data, ...lane.allData];
      } else if (dataSite === 'after') {
        lane.endTime = endTime || lane.endTime;
        lane.allData = [...lane.allData, ...data];
      } else if (dataSite === 'init') {
        lane.endTime = endTime;
        lane.startTime = startTime;
      }
    }
    if (data === null) { data = []; }

    const option = this.getLaneOptionsById(subscribeId);
    const { freshType } = option;
    if (freshType === '消息提醒') {
      // 判断是否自动刷新, 根据泳道获取数据的模式, 显示tips 还是直接加载数据
      // 7*24小时快讯需要单独处理
      if (autoFetch === true) {
        if (lane.cacheData === null || lane.cacheData === undefined) {
          lane.cacheData = [...data];
        } else {
          lane.cacheData = [...data, ...lane.cacheData];
        }
        if (lane.cacheData.length > 0) {
          lane.willUpdate = true;
        }
      }
      // console.log('消息提醒, 这里放缓存');
    } else if (freshType === '直接刷新') {
      const { autoFetchMode } = option;
      if (autoFetchMode === 'replace' || autoFetchMode === 'allReplace') {
        lane.cards = [...data];
        lane.refresh({});
        return;
      }
      // console.log('直接刷新, 添加卡片到卡片列表');
    }
    // 初始化
    runInAction(() => {
      if (dataSite === 'init') {
        lane.cards = data;
      } else if (freshType === '直接刷新') {
        if (dataSite === 'before') {
          lane.cards = [...data, ...lane.cards];
        } else if (dataSite === 'after') {
          lane.cards = [...lane.cards, ...data];
        }
      } else if (freshType === '消息提醒' && dataSite === 'after') {
        lane.cards = [...lane.cards, ...data];
      }
    });
  }

  @action.bound
  async fetchLaneWithParams({ askMethod,
    lane,
    subscribeId,
    filterData,
    autoFetch,
    dataSite = 'after' }) {
    const { lanes } = this;
    const { formatParams = d => d, afterMergeServerOptions } = this.getLaneOptionsById(subscribeId);
    const { serverOptions = {} } = lane;
    return new Promise((resolve, reject) => {
      if (lane.cancel) {
        lane.cancel('请求已经被打断');
      }
      lane.loading = 'pending';
      if (lane.refresh) {
        lane.refresh({});
      }
      const formattedParams = formatParams({ ...filterData }, { lane, dataSite });
      const params = { ...serverOptions, ...formattedParams };
      if (afterMergeServerOptions) {
        afterMergeServerOptions(params);
      }
      // TODO本地覆盖serverOptions
      lane.fetchDataFunc = ask(askMethod, {
        params: filterEmpty(params),
        CancelToken: new CancelToken((c) => {
          lane.cancel = c;
        }),
      }).then((res) => {
        resolve(res.data);
        delete lane.cancel;
        lane.loading = 'done';
        // 需要根据响应code判断是否暂未添加自选股
        lane.resCode = res.code;
      }).catch((e) => {
        lane.loading = 'done';
        resolve(null);
      });
      lane.cancel = source.cancel;
    });
  }

  async fetchLaneFilterSelection(laneTemplateId, selectionType) {
    const data = await ask('filterSelection', { params: { laneTemplateId, selectionType } });
    console.log(this);
    return data;
  }
  /**
  |--------------------------------------------------
  | 获取推荐看板分组列表
  |--------------------------------------------------
   */
  @action
  fetchRecommendGroup = async () => {
    try {
      const resp = await ask('fetchRecommendList');
      runInAction(() => {
        if (resp && resp.code === 200) {
          // this.recommendGroup = this.sortRecommend(resp.data);
          this.channelGroup = resp.data.concat(workteamGroup);
          this.categoryItems = this.getRecommendList(resp.data);
        }
      });
    } catch (error) {
      console.error('获取推荐看板列表失败', error);
    }
  }

  sortRecommend = (recommendGroup = []) => {
    const sortMap = {
      综合看板: 1,
      资讯看板: 2,
      研报看板: 3,
      公告看板: 4,
    };
    recommendGroup = recommendGroup.map((group) => {
      group.sort = sortMap[group.category];
      return group;
    }).sort((a, b) => {
      return a.sort - b.sort;
    });
    return recommendGroup;
  }

  /**
  |--------------------------------------------------
  | 获取推荐看板列表
  |--------------------------------------------------
   */
  getRecommendList = (recommendGroup) => {
    let list = [];
    recommendGroup.forEach((group) => {
      list = list.concat(group.itemList);
    });
    return list;
  }

  getRecommendById = (subscribeId) => {
    const target = this.categoryItems.find(v => `Y_${v.templateId}` === subscribeId);
    return target ? { ...target } : target;
  }

  getKeyText = getKeyText

  /**
  |--------------------------------------------------
  | 频道排序操作更新
  |--------------------------------------------------
   */
  updateLaneSort = async () => {
    try {
      const laneIds = this.lanes.map((lane) => {
        const { id } = lane;
        return id;
      });
      const resp = await ask('updateLaneSort', {
        data: {
          laneIds,
        },
      });
    } catch (error) {
      console.error('频道更新排序失败', error);
    }
  }

  @action
  updateLane = async (lane, { name, callback }) => {
    const { id } = lane;
    try {
      // 没有回调只修改前端数据源
      if (!callback) {
        return;
      }
      const resp = await ask('updateLane', {
        data: {
          id,
          option: JSON.stringify({ keyword: name }),
        },
      });
      runInAction(() => {
        lane.name = name;
        if (resp && resp.code === 200) {
          if (callback) {
            callback();
          }
        }
      });
    } catch (error) {
      console.error(`${lane.name}更新失败`, error);
    }
  }
}


export default LaneStore;
