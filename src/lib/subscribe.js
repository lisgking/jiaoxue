
import moment from 'moment';
import { MYSTOCK_URL, NEWS_URL } from '../env';
/**
  *  filter: [{  //
  *   label: '',
  *   type: '', //[
  *    'select',  // 单选
  *    'companySelect',
  *    'analystsSelect',
  *    'orgSelect',
  *    'mulSelect',
  *    'treeSelect'],
  *    options: []
  * }],
  * showSearch: true // 是否显示关键字搜索
  * showCustomStock: true // 是否显示关键字搜索
  * showSetting: true
*/

function addStartOrEndTimeToParams(params, lane, dataSite) {
  // const { startTime, endTime } = lane;
  // if (dataSite === 'before') {
  //   params.startTime = convertTimestamp(startTime);
  // } else if (dataSite === 'after') {
  //   params.endTime = convertTimestamp(endTime);
  // }
  // return params;
}

function addIndustry(params, lane, dataSite) {
  const industryIds = [];
  const industryNames = [];
  if (params.industryIds) {
    params.industryIds.forEach((v) => {
      if (v.split === undefined) {
        console.warn('请尝试删除泳道再添加, 历史版本的数据可能造成污染, 引发BUG');
      }
      const d = v.split('-');
      industryIds.push(d[0]);
      industryNames.push(d[1]);
    });
  }
  params.industryIds = industryIds.join('|');
  params.industryNames = industryNames.join('|');
}

function addLimit(params, lane, dataSite) {
  const { length } = lane.cards;
  if (dataSite === 'after') {
    params.limit = length + 10;
  } else {
    params.limit = length;
  }
  if (params.limit === 0) {
    delete params.limit;
  }
}

function addPageToParams(params, lane, dataSite) {
  const { cards = [] } = lane;
  const offset = cards.length;
  const [card] = cards;

  if (card && dataSite === 'before') {
    params.startId = card.cardId;
  } else if (offset !== undefined && dataSite === 'after') {
    params.startId = card.cardId;
    params.offset = offset;
    // 7*24小时快讯的offset，前端来传递
    if (lane.subscribeId === 'Y_1011') {
      params.offset = card.offset;
    }
  }
  if (params.stockCode) {
    params.stockName = lane.filterTags.find(v => v.key === 'stockCode').tag;
  }
  return params;
}

const subscribe = {
  Y_1000: {
    name: '关键字搜索泳道',
    iconSvg: 'icon-sousuo',
    showCustomStock: true,
    search: '搜索内容',
    fetchType: 'feed推送',
    updateInterval: 10e3,
    freshType: '直接刷新',
    formatParams(params, { lane, dataSite }) {
      const nextParams = {
        ...params,
        keyword: lane.name,
        // limit: 10,
      };
      addStartOrEndTimeToParams(nextParams, lane, dataSite);
      addPageToParams(nextParams, lane, dataSite);
      if (nextParams.sourceType === undefined) {
        nextParams.sourceType = '0';
      }
      return nextParams;
    },
    filter: [{
      label: '类型',
      name: 'sourceType',
      type: 'sourceSelect',
      valueKey: 'value',
      tagKey: 'text',
    }],
  },
  /**
  |--------------------------------------------------
  | 综合看板
  |--------------------------------------------------
  */
  Y_1001: {
    name: '精选推荐',
    icon: '&#xe658;',
    iconSvg: 'icon-a-remen',
    fetchType: 'feed推送',
    freshType: '消息提醒',
    updateInterval: 3600e3,
    formatParams(params, { lane, dataSite }) {
      const nextParams = { ...params };
      addStartOrEndTimeToParams(nextParams, lane, dataSite);
      addPageToParams(nextParams, lane, dataSite);
      if (nextParams.sourceType === undefined) {
        nextParams.sourceType = '0';
      }
      return nextParams;
    },
    filter: [{
      type: 'sourceSelect',
      name: 'sourceType',
      includes: ['资讯', '研报'],
    }],
  },
  Y_1002: {
    name: '精选专题研报',
    updateInterval: 3600e3,
    icon: '&#xe659;',
    iconSvg: 'icon-a-jingxuanzhuantibaogao',
    fetchType: 'feed推送',
    autoFetchMode: 'allReplace',
    freshType: '消息提醒',
    showCustomStock: true,
    formatParams(params, { lane, dataSite }) {
      const nextParams = { ...params };
      addStartOrEndTimeToParams(nextParams, lane, dataSite);
      // 这里需要全量更新, 传递 limit 为条数
      addLimit(nextParams, lane, dataSite);
      // 专题参数
      if (!params.topicName) {
        delete nextParams.topicName;
      }
      if (nextParams.startTime) {
        nextParams.startTime = nextParams.startTime.unix() + 1;
      }
      if (nextParams.endTime) {
        nextParams.endTime = nextParams.endTime.unix() - 1;
      }
      if (nextParams.limit === 0) {
        delete nextParams.limit;
      }
      return nextParams;
    },
    filter: [{
      type: 'subjectSelect',
      name: 'topicName',
      valueKey: 'text',
    }, {
      type: 'keywords',
      name: 'keyword',
    }],
  },
  Y_1003: {
    name: '自选股动态',
    updateInterval: 300e3,
    icon: '&#xe654;',
    iconSvg: 'icon-a-zixuangudongtai',
    fetchType: 'feed推送',
    freshType: '消息提醒',
    showSetting: true,
    settingTips: '管理自选股',
    settingLink: MYSTOCK_URL,
    formatParams(params, { lane, dataSite }) {
      const nextParams = {
        ...params,
        groupType: -1,
      };
      addStartOrEndTimeToParams(nextParams, lane, dataSite);
      addPageToParams(nextParams, lane, dataSite);
      if (nextParams.filterType === undefined) {
        nextParams.filterType = '0';
      }
      return nextParams;
    },
    afterMergeServerOptions(params) {
      addIndustry(params);
    },
    filter: [
      // {
      //   type: 'companySelect',
      //   name: 'industryIds',
      //   valueKey: 'induUniCode',
      //   tagKey: 'induName',
      // },
      {
        type: 'sourceSelect',
        name: 'filterType',
        includes: ['公告', '资讯', '研报'],
      }, {
        type: 'stockSelect',
        name: 'stockCode',
      }, {
        type: 'keywords',
        name: 'keyword',
      }],
  },
  Y_1004: {
    name: '持仓动态',
    updateInterval: 300e3,
    icon: '&#xe657;',
    iconSvg: 'icon-a-chicangdongtai',
    fetchType: 'feed推送',
    freshType: '消息提醒',
    showSetting: true,
    settingTips: '管理持仓',
    settingLink: `${MYSTOCK_URL}/mystock-owned`,
    formatParams(params, { lane, dataSite }) {
      const nextParams = {
        ...params,
        groupType: -2,
      };
      addStartOrEndTimeToParams(nextParams, lane, dataSite);
      addPageToParams(nextParams, lane, dataSite);
      if (params.stockCode) {
        nextParams.stockName = lane.filterTags.find(v => v.key === 'stockCode').tag;
      }
      if (nextParams.filterType === undefined) {
        nextParams.filterType = '0';
      }
      return nextParams;
    },
    afterMergeServerOptions(params) {
      addIndustry(params);
    },
    filter: [{
      type: 'sourceSelect',
      name: 'filterType',
      includes: ['公告', '资讯', '研报'],
    },
    // {
    //   type: 'companySelect',
    //   name: 'industryIds',
    //   valueKey: 'induUniCode',
    //   tagKey: 'induName',
    // },
    {
      type: 'stockSelect',
    }, {
      type: 'keywords',
      name: 'keyword',
    }],
  },
  Y_1008: {
    name: '热搜榜',
    updateInterval: 3600e3,
    icon: '&#xe67b;',
    autoFetchMode: 'replace',
    iconSvg: 'icon-a-xiaoshiresou',
    fetchType: '定时读取数据库',
    freshType: '直接刷新',
    toolsMode: 'tips',
  },
  /**
  |--------------------------------------------------
  | 资讯
  |--------------------------------------------------
  */
  Y_1011: {
    name: '7*24小时快讯',
    updateInterval: 10e3,
    icon: '&#xe660;',
    iconSvg: 'icon-b-xiaoshikuaixun',
    // 这里有个模式, 用于替换, 还是全量替换, 待完成
    autoFetchMode: 'allReplace',
    fetchType: 'feed推送',
    freshType: '直接刷新',
    toolsMode: 'tips',
    formatParams(params, { lane, dataSite }) {
      const nextParams = { ...params };
      addStartOrEndTimeToParams(nextParams, lane, dataSite);
      addPageToParams(nextParams, lane, dataSite);
      if (nextParams.startTime) {
        nextParams.startTime = nextParams.startTime.unix() + 1;
      }
      if (nextParams.endTime) {
        nextParams.endTime = nextParams.endTime.unix() - 1;
      }
      return nextParams;
    },
  },
  Y_1012: {
    name: '公众号动态',
    updateInterval: 3600e3,
    icon: '&#xe65f;',
    iconSvg: 'icon-a-dingyuedegongzhonghao',
    fetchType: 'feed推送',
    freshType: '消息提醒',
    autoFetchMode: 'allReplace',
    showSetting: true,
    settingTips: '配置公众号',
    settingLink: `${NEWS_URL}`,
    formatParams(params, { lane, dataSite }) {
      const nextParams = { ...params };
      addStartOrEndTimeToParams(nextParams, lane, dataSite);
      // 需要全量更新, 传递 limit 为条数
      addLimit(nextParams, lane, dataSite);

      return nextParams;
    },
    filter: [{
      type: 'publicSelect',
      name: 'publicAccount',
    }, {
      type: 'keywords',
      name: 'keyword',
    }],
  },
  Y_1013: {
    name: 'new资讯',
    updateInterval: 180e3,
    icon: '&#xe663;',
    iconSvg: 'icon-b-zuixinzixun',
    fetchType: 'feed推送',
    freshType: '直接刷新',
    showCustomStock: true,
    formatParams(params, { lane, dataSite }) {
      const nextParams = { ...params };
      addStartOrEndTimeToParams(nextParams, lane, dataSite);
      addPageToParams(nextParams, lane, dataSite);
      if (nextParams.startTime) {
        nextParams.startTime = nextParams.startTime.unix() + 1;
      }
      if (nextParams.endTime) {
        nextParams.endTime = nextParams.endTime.unix() - 1;
      }
      return nextParams;
    },
    filter: [{
      type: 'keywords',
      name: 'keyword',
    }],
    // filter: [{
    //   type: 'classSelect',
    //   includes: ['证券', '宏观', '产经', '全球', '科技', '其他', '公众号'],
    // }],
  },
  /**
  |--------------------------------------------------
  | 研报
  |--------------------------------------------------
  */
  Y_1015: {
    name: 'new研报',
    updateInterval: 180e3,
    icon: '&#xe664;',
    iconSvg: 'icon-czuixinyanbao',
    fetchType: 'feed推送',
    freshType: '直接刷新',
    showCustomStock: true,
    formatParams(params, { lane, dataSite }) {
      const nextParams = { ...params };
      if (params.category_name !== undefined) {
        try {
          nextParams.category_name = params.category_name
            .map(v => v.split('-')[1]).join('|');
        } catch (e) {
          console.log(e);
        }
      }
      addStartOrEndTimeToParams(nextParams, lane, dataSite);
      addPageToParams(nextParams, lane, dataSite);
      // TODO
      return nextParams;
    },
    afterMergeServerOptions(params) {
      let selected = '';
      if (params.industry_txt) {
        params.industry_txt = params.industry_txt.map(v => v.split('-')[1]).join('|');
        selected += `industry_txt,${params.industry_txt};`;
        delete params.industry_txt;
      }
      if (params.page_area) {
        params.page_area = params.page_area.join('|');
        selected += `page_area,${params.page_area};`;
        delete params.page_area;
      }
      if (params.category_name && params.category_name.length > 0) {
        selected += `category_name,${params.category_name};`;
        delete params.category_name;
      }
      if (selected.length > 0) params.selected = selected;
    },
    filter: [{
      type: 'companySelect',
      name: 'industry_txt',
      params: {
        marketCodes: '1004001',
      },
    }, {
      label: '类型',
      type: 'reportClassSelect',
      name: 'category_name',
    }, {
      type: 'pageSelect',
      name: 'page_area',
      tagKey: 'text',
      valueKey: 'text',
    }, {
      type: 'keywords',
      name: 'keyword_filter',
    }],
  },
  Y_1016: {
    name: '获奖分析师研报',
    updateInterval: 180e3,
    icon: '&#xe666;',
    iconSvg: 'icon-c-huojiangfenxishiyanbao',
    fetchType: 'feed推送',
    freshType: '消息提醒',
    autoFetchMode: 'allReplace',
    showCustomStock: true,
    formatParams(params, { lane, dataSite }) {
      const nextParams = { ...params };
      addStartOrEndTimeToParams(nextParams, lane, dataSite);
      // addPageToParams(nextParams, lane, dataSite);
      // if (nextParams.startTime) {
      //   nextParams.startTime = nextParams.startTime.unix() + 1;
      // }
      // if (nextParams.endTime) {
      //   nextParams.endTime = nextParams.endTime.unix() - 1;
      // }
      // 需要全量更新, 传递 limit 为条数
      addLimit(nextParams, lane, dataSite);
      return nextParams;
    },
    filter: [{
      type: 'analystsSelect',
      name: 'analyst',
    }, {
      type: 'keywords',
      name: 'keyword',
    }],
  },
  Y_1017: {
    name: '晨会&早报',
    updateInterval: 600e3,
    icon: '&#xe665;',
    iconSvg: 'icon-c-chenhuizaobao',
    fetchType: 'feed推送',
    freshType: '消息提醒',
    formatParams(params, { lane, dataSite }) {
      const nextParams = { ...params };
      addStartOrEndTimeToParams(nextParams, lane, dataSite);
      addPageToParams(nextParams, lane, dataSite);
      if (nextParams.startTime) {
        nextParams.startTime = nextParams.startTime.unix() + 1;
      }
      if (nextParams.endTime) {
        nextParams.endTime = nextParams.endTime.unix() - 1;
      }
      if (params.groupType === -1) {
        nextParams.groupId = 1;
      }
      return nextParams;
    },
    afterMergeServerOptions(params) {
      if (params.source) {
        if (params.selected === undefined) {
          params.selected = '';
        }
        params.selected += `;source,${params.source}`;
        delete params.source;
      }
    },
    filter: [{
      type: 'orgSelect',
      name: 'source',
    }, {
      type: 'keywords',
      name: 'keyword_filter',
    }],
  },
  /**
  |--------------------------------------------------
  | 公告
  |--------------------------------------------------
  */
  Y_1018: {
    name: 'new公告',
    updateInterval: 180e3,
    icon: '&#xe667;',
    iconSvg: 'icon-d-zuixingonggao1',
    fetchType: 'feed推送',
    freshType: '直接刷新',
    showCustomStock: true,
    formatParams(params, { lane, dataSite }) {
      const nextParams = { ...params };
      addStartOrEndTimeToParams(nextParams, lane, dataSite);
      addPageToParams(nextParams, lane, dataSite);
      if (nextParams.endTime) {
        nextParams.endTime = nextParams.endTime.format('YYYY-MM-DD');
      }
      if (nextParams.startTime) {
        nextParams.startTime = nextParams.startTime.format('YYYY-MM-DD');
      }
      return nextParams;
    },
    afterMergeServerOptions(params) {
      if (params.category) {
        const nextCategory = [...params.category].map(v => v.split('-')[1]).join('|');
        if (nextCategory === '') {
          delete params.category;
        } else {
          params.category = nextCategory;
        }
      }
      addIndustry(params);
    },
    filter: [{
      type: 'companySelect',
      name: 'industryIds',
      valueKey: 'induUniCode',
      tagKey: 'induName',
    }, {
      type: 'filingSelect',
      name: 'category',
    }, {
      type: 'stockSelect',
      name: 'company',
      valueKey: 'sec_name',
    }, {
      type: 'keywords',
      name: 'keyword',
    }],
  },
  Y_1019: {
    name: '今日重要公告',
    updateInterval: 3600e3,
    icon: '&#xe668;',
    iconSvg: 'icon-d-zhongyaogonggao',
    fetchType: 'feed推送',
    freshType: '消息提醒',
    showCustomStock: true,
    formatParams(params, { lane, dataSite }) {
      const nextParams = { ...params };
      addStartOrEndTimeToParams(nextParams, lane, dataSite);
      addPageToParams(nextParams, lane, dataSite);
      if (params.categoryIds) {
        if ([...params.categoryIds].length > 0) {
          nextParams.categoryIds = [...params.categoryIds].join('|');
        }
      }
      return nextParams;
    },
    afterMergeServerOptions(params) {
      addIndustry(params);
    },
    filter: [{
      type: 'companySelect',
      name: 'industryIds',
      valueKey: 'induUniCode',
      tagKey: 'induName',
    }, {
      type: 'importantFilingSelect',
      name: 'categoryIds',
      selectionType: 4,
    }, {
      type: 'stockSelect',
      name: 'company',
      valueKey: 'sec_name',
    }, {
      type: 'keywords',
      name: 'keyword',
    }],
  },
  Y_1020: {
    name: '评论',
    updateInterval: 3600e3,
    icon: '&#xe668;',
    iconSvg: 'icon-d-zhongyaogonggao',
    fetchType: 'feed推送',
    freshType: '消息提醒',
    showCustomStock: true,
    formatParams(params, { lane, dataSite }) {
      const nextParams = { ...params };
      addStartOrEndTimeToParams(nextParams, lane, dataSite);
      addPageToParams(nextParams, lane, dataSite);
      if (params.categoryIds) {
        if ([...params.categoryIds].length > 0) {
          nextParams.categoryIds = [...params.categoryIds].join('|');
        }
      }
      return nextParams;
    },
    afterMergeServerOptions(params) {
      addIndustry(params);
    },
    filter: [{
      type: 'companySelect',
      name: 'industryIds',
      valueKey: 'induUniCode',
      tagKey: 'induName',
    }, {
      type: 'importantFilingSelect',
      name: 'categoryIds',
      selectionType: 4,
    }, {
      type: 'stockSelect',
      name: 'company',
      valueKey: 'sec_name',
    }, {
      type: 'keywords',
      name: 'keyword',
    }],
  },
};


export default subscribe;
