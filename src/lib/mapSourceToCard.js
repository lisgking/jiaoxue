import moment from 'moment';
import { transformLaneDataByMap, recognizeCardMap } from './cardDataTransformer';
export default function ({ data, subscribeId, filterData }) {
  let dataList = {};
  if (data === 'ERROR') return {};
  if (data && data instanceof Array && data.length === 0) return {};
  // lihengbo
  // 精选推荐泳道
  if (subscribeId === 'Y_1001') {
    dataList = handleSelectionNewsCard(data, filterData);
  }
  // 精选专题研报泳道
  if (subscribeId === 'Y_1002') {
    dataList = handleSubjectReportCard(data, filterData);
  }
  // 热搜榜泳道
  if (subscribeId === 'Y_1008') {
    dataList = handleTopSearchCard(data, filterData);
  }
  // 7*24小时热搜泳道
  if (subscribeId === 'Y_1011') {
    dataList = handleWeekNewsCard(data, filterData);
  }
  // new研报泳道 晨会早报泳道
  if (subscribeId === 'Y_1015' || subscribeId === 'Y_1017') {
    dataList = handleReportCard(data, filterData);
  }
  // new资讯泳道
  if (subscribeId === 'Y_1013') {
    dataList = handleNewsOrWeiChatCard(data, filterData);
  }
  // 公众号动态泳道
  if (subscribeId === 'Y_1012') {
    dataList = handleWeiChatCard(data, filterData);
  }


  // 关键字搜索泳道、自选股动态泳道、持仓动态泳道、获奖分析师研报、new公告泳道、今日重要公告
  if (recognizeCardMap[subscribeId]) {
    let startTime,
      endTime;
    dataList = {
      list: transformLaneDataByMap(data, subscribeId, filterData),
    };
    if (dataList.list.length === 0) {
      return {};
    }
    if (data && data.length > 0) {
      dataList.startTime = data[0].updateTime;
      dataList.endTime = data[data.length - 1].updateTime;
      dataList.startId = data[0].id;
      dataList.offset = data.length;
    }
    if (subscribeId === 'Y_1019' || subscribeId === 'Y_1018') {
      if (data && data.items && data.items.length) {
        dataList.startTime = data.items[0].publishAt;
        dataList.endTime = data.items[data.items.length - 1].publishAt;
      }
    }
  }
  console.log('dataList', dataList);
  return dataList;
}

// 精选推荐泳道处理函数
function handleSelectionNewsCard(data = [], filterData = {}) {
  if (data && data.length === 0) return {};
  const list = data.map((item = {}) => {
    return {
      cardId: item.sourceType === 'report' ? item.content.id : item.content._id,
      cardType: item.sourceType === 'report' ? 'C_005' : 'C_002',
      data: item.sourceType === 'report' ? { ...item.content, filePages: item.content.file_pages, category: item.content.report_type, publishAt: item.content.time, fileType: item.content.file_type, infoType: '研报' } : { id: item.content._id, title: item.content.title, source: item.content.site_source, masterImageUrl: item.content.thumbnail && item.content.thumbnail[0], author: item.content.author, publishAt: item.content.update_time, infoType: '资讯' },
      keyWord: filterData.keywords,
    };
  });
  return {
    startTime: data && data.length > 0 && data[0].updateTime,
    endTime: data && data.length > 0 && data[data.length - 1].updateTime,
    list,
  };
}
// 精选专题研报泳道处理函数
function handleSubjectReportCard(data, filterData = {}) {
  // 区分筛选前、删选后的状态
  const status = Object.keys(filterData).some((f) => {
    return filterData[f];
  });
  const list = (data || []).map((item = {}) => {
    if (status) {
      return { cardType: 'C_006', data: { topicTitle: filterData.topicName ? filterData.topicName : '', title: item.content.title, time: item.content.time, tag: item.content.tag, id: item.content.id }, cardId: item.id, keyWord: filterData.keywords };
    }
    return { cardType: 'C_006', cardId: item.topicTitle, data: { ...item, loading: 'done' }, keyWord: filterData.keywords };
  });
  return {
    startTime: data && data.length > 0 && data[0].newestTime,
    endTime: data && data.length > 0 && data[data.length - 1].newestTime,
    list,
  };
}
// 热搜榜泳道处理函数
function handleTopSearchCard(data = []) {
  return {
    list: [{
      cardType: 'C_016',
      dataList: data,
    }],
  };
}
// 7*24小时热搜泳道处理函数
function handleWeekNewsCard(data = [], filterData = {}) {
  const map = new Map();
  const cardList = [];
  data.forEach((ele) => {
    const day = moment(ele.publishTime).format('YYYY-MM-DD');
    if (map.has(day)) {
      map.get(day).push(ele);
    } else {
      map.set(day, [ele]);
    }
  });
  for (const [key, value] of map) {
    const obj = { cardType: 'C_003', flashNewsDate: key, cardId: value && value[0].id, offset: data.length, itemList: value };
    cardList.push(obj);
  }
  return {
    startTime: data && data.length > 0 && data[0].publishTime,
    endTime: data && data.length > 0 && data[data.length - 1].publishTime,
    list: cardList,
  };
}
// new研报泳道处理函数
function handleReportCard(data = [], filterData = {}) {
  // const items =data;
  const list = data.map((item) => {
    return {
      cardType: 'C_005',
      cardId: item.id,
      data: { ...item, infoType: '研报', fileType: item.file_type, filePages: item.file_pages, publishAt: item.publish_at },
      keyWord: filterData.keywords,
    };
  });
  return {
    startTime: data && data.length > 0 && data[0].publish_at,
    endTime: data && data.length > 0 && data[data.length - 1].publish_at,
    list,
  };
}
// 公众号动态泳道
function handleWeiChatCard(dataObj, filterData = {}) {
  if (!dataObj || (dataObj && dataObj.length === 0)) return [];
  let data = [];
  if (dataObj && dataObj[0] && dataObj[0].doclist) {
    data = dataObj.map((item) => {
      const { account } = item;
      return { ...item, weiChatImage: account && account.publicImage };
    });
  } else {
    data = dataObj;
  }
  const list = data.map((item) => {
    if (item.source_name_s && item.source_name_s.length > 0) {
      return {
        cardType: 'C_004',
        cardId: item.source_name_s,
        data: { publishAt: item.doclist && item.doclist.length > 0 && item.doclist[0].publish_time, weiChatNo: item.source_name_s, weiChatImage: item.weiChatImage, articleList: item.doclist },
        keyWord: filterData.keywords,
      };
    }
    const { content } = item;
    return {
      cardType: 'C_001',
      cardId: content.id,
      data: {
        title: content.title,
        summary: content.brief,
        masterImageUrl: content.first_image_oss || null,
        source: content.source_name,
        author: content.author,
        infoType: '资讯',
        publishAt: content.publish_time,
        linkUrl: content.url,
        id: content.id,
        cardStatus: 'detail',
      },
      keyWord: filterData.keywords,
    };
  });
  return {
    startTime: data && data.length > 0 && data[0].updateTime,
    endTime: data && data.length > 0 && data[data.length - 1].updateTime,
    list,
  };
}
// new资讯泳道处理函数
function handleNewsOrWeiChatCard(data = {}, filterData = {}) {
  const list = (data || []).map((ele) => {
    return {
      cardType: 'C_001',
      cardId: ele.id,
      data: {
        title: ele.title,
        summary: ele.brief,
        masterImageUrl: ele.first_image_oss,
        source: ele.source_name,
        author: ele.author,
        infoType: '资讯',
        publishAt: ele.publish_time,
        linkUrl: ele.url,
        id: ele.id,
        cardStatus: 'detail',
      },
      keyWord: filterData.keywords,
    };
  });
  return {
    startTime: data && data.length > 0 && data[0].publish_time,
    endTime: data && data.length > 0 && data[data.length - 1].publish_time,
    list,
  };
}
