import _ from 'lodash';

import { REPORT_URL, FILING_URL, CHARTTABLE_URL, NEWS_URL } from '../env';
import jinniu from '../components/AuthorCard/images/icon_jinniu.png';
import xincaifu from '../components/AuthorCard/images/icon_xincaifu.png';

export const recognizeCardMap = {
  Y_1000: { // 关键字搜索泳道
    cardRecognizeKey: 'sourceType', // 识别泳道数据列中元素所属卡片类型所需的键
    news: 'C_001', // 资讯卡片
    report: 'C_005', // 研报卡片
    filing: {
      cardRecognizeKey: 'categoryId',
      T004001005: 'C_008', // 业绩预告卡片
      T004001006: 'C_008', // 业绩快报卡片
      defaultCardType: 'C_008', // 公告卡片
    },
    table: 'C_015', // 数据表卡片
    chart: 'C_012', // 数据图卡片
  },
  Y_1003: { //  自选股动态泳道
    cardRecognizeKey: 'sourceType', // 识别泳道数据列中元素所属卡片类型所需的键
    news: 'C_001', // 资讯、公众号卡片
    report: 'C_005', // 研报卡片
    filing: {
      cardRecognizeKey: 'categoryId',
      T004001005: 'C_008', // 业绩预告卡片
      T004001006: 'C_008', // 业绩快报卡片
      defaultCardType: 'C_008', // 公告卡片
    },
  },
  Y_1004: { // 持仓动态泳道
    cardRecognizeKey: 'sourceType', // 识别泳道数据列中元素所属卡片类型所需的键
    news: 'C_001', // 资讯、公众号卡片
    report: 'C_005', // 研报卡片
    filing: {
      cardRecognizeKey: 'categoryId',
      T004001005: 'C_008', // 业绩预告卡片
      T004001006: 'C_008', // 业绩快报卡片
      defaultCardType: 'C_008', // 公告卡片
    },
  },
  Y_1016: { // 获奖分析师研报泳道
    filteredCardType: 'C_005', // 研报卡片
    defaultCardType: 'C_007', // 获奖分析师研报卡片
  },
  Y_1018: { // new公告泳道
    cardRecognizeKey: 'categoryId',
    T004001005: 'C_008', // 业绩预告卡片
    T004001006: 'C_008', // 业绩快报卡片
    defaultCardType: 'C_008', // 公告卡片
  },
  Y_1019: { // 今日重要公告
    filteredCardType: 'C_008',
    defaultCardType: 'C_008', // 公告卡片
  },
};

export const commonCardDataMap = {
  C_001: { // 资讯卡片
    title: 'title',
    summary: 'brief',
    masterImageUrl: 'first_image_oss',
    author: 'author',
    publishAt: 'publish_time',
    source: 'source_name',
    linkUrl: 'url',
    id: 'id',
    infoType(data, filterData) {
      const { filterType } = filterData;
      if (filterType === '9') {
        return '公众号';
      }
      return '资讯';
    },
  },
  C_005: { // 研报卡片
    stockname: 'stockname',
    stockcode: 'stockcode',
    title: 'title',
    summary: 'summary',
    source: 'source',
    category: 'category',
    industry1: 'industry1',
    author: 'author',
    analyst_honor: 'honor',
    tag: 'tag',
    publishAt: 'time',
    filePages: 'file_pages',
    id: 'id',
    fileType: 'file_type',
    rating: 'rating',
    url: 'url',
    infoType() {
      return '研报';
    },
  },
  C_007: { // 获奖分析师研报卡片
    authorName: 'name',
    authorIcon: 'image',
    authorAwards(data) {
      return data.honors.map((item) => {
        let img;
        if (item === '金牛奖') {
          img = jinniu;
        }
        if (item === '新财富') {
          img = xincaifu;
        }
        return img;
      });
    },
    authorId: 'peoUniCode',
    authorOrganization: 'organ',
    authorDirection: 'direction',
    reportList(data) {
      const obj = data.item;
      return [{
        id: obj.id,
        stockName: obj.stockname,
        stockCode: obj.stockcode,
        title: obj.title,
        authorList: obj.author,
        pubTime: obj.time * 1000,
      }];
    },
  },
  C_008: { // 公告
    id: 'srcId',
    stockName: 'stockName',
    stockCode: 'stockCode',
    title: 'title',
    brief: 'summary',
    industry: 'industry',
    category: 'category',
    isPerspective(data) {
      return data.perspective === 1;
    },
    tagList(data) {
      let arr = [];
      if (data.tags instanceof Array) {
        arr = data.tags;
      }
      if (data.tags instanceof String) {
        arr = data.tags.split(',');
      }
      return arr;
    },
    format: 'fileType',
    fileName(data) {
      return `${data.title}.${data.fileType}`;
    },
    pageNumber: 'pageCount',
    pubTime(data) {
      return data.publishAt * 1000;
    },
    fileUrl: 'url',
  },
  C_009: {

  },
  C_010: {
  },
  C_012: {
    data(data) {
      return data;
    },
    detailLink(data) {
      return `${CHARTTABLE_URL}/chart/${encodeURIComponent(data.real_id || data.id)}`;
    },
    sourceLink(data) {
      return `${REPORT_URL}/report/article/${data.file_id}`;
    },
    chartSize() {
      return {
        width: '248px',
        height: '180px',
      };
    },
  },
  C_015: {
    tableTitle: 'table_title',
    pubTime: 'time',
    tableData: (data) => {
      return JSON.parse(data.table_data);
    },
    stockName: 'company',
    articleTitle: 'title',
    articleUrl: (data) => {
      const page = (function () {
        return data.table_id.split('_')[2];
      }());
      if (data.table_source === 'juchao_tables') { // 表格来源于公告
        return `${FILING_URL}/detail/text?srcId=${data.src_id}&page=${page}`;
      }
      if (data.table_source === 'hb_tables') { // 表格来源于研报
        return `${REPORT_URL}/report/article/${data.src_id}?page=${page}`;
      }
    },
    articleIndustry: 'industry_name',
  },
  tableUrl: (data) => {
    return `${CHARTTABLE_URL}/table/${data.id}`;
  },
};

const originDataToCardDataMap = {
  Y_1000: { // 关键字搜索泳道
    in: 'content',
    C_001: commonCardDataMap.C_001,
    C_005: commonCardDataMap.C_005,
    C_008: commonCardDataMap.C_008,
    C_009: commonCardDataMap.C_008,
    C_010: commonCardDataMap.C_008,
    C_015: commonCardDataMap.C_015,
    C_012: commonCardDataMap.C_012,
  },
  Y_1003: { // 自选股动态泳道
    in: 'content',
    C_001: commonCardDataMap.C_001,
    C_005: commonCardDataMap.C_005,
    C_008: commonCardDataMap.C_008,
    C_009: commonCardDataMap.C_008,
    C_010: commonCardDataMap.C_008,
  },
  Y_1004: { // 持仓动态泳道
    in: 'content',
    C_001: commonCardDataMap.C_001,
    C_005: commonCardDataMap.C_005,
    C_008: commonCardDataMap.C_008,
    C_009: commonCardDataMap.C_008,
    C_010: commonCardDataMap.C_008,
  },
  Y_1016: { // 获奖分析师研报泳道
    C_005: {
      stockname(data) {
        return data.content.stockname;
      },
      stockcode(data) {
        return data.content.stockcode;
      },
      title(data) {
        return data.content.title;
      },
      summary(data) {
        return data.content.summary;
      },
      source(data) {
        return data.content.source;
      },
      category(data) {
        return data.content.report_type;
      },
      industry1(data) {
        return data.content.industry1;
      },
      author(data) {
        return data.content.author;
      },
      analyst_honor(data) {
        return data.content.analyst_honor;
      },
      tag(data) {
        return data.content.tag;
      },
      publishAt(data) {
        return data.content.time;
      },
      filePages(data) {
        return data.content.file_pages;
      },
      id(data) {
        return data.content.id;
      },
      fileType(data) {
        return data.content.file_type;
      },
      rating(data) {
        return data.content.rating;
      },
      url(data) {
        return data.content.url;
      },
      infoType() {
        return '研报';
      },
    },
    C_007: commonCardDataMap.C_007,
  },
  Y_1018: { // 最新公告泳道
    C_008: commonCardDataMap.C_008,
    C_009: commonCardDataMap.C_008,
    C_010: commonCardDataMap.C_008,
  },
  Y_1019: { // 重要公告泳道
    C_008: commonCardDataMap.C_008,
  },

};

function getCardTypeByMap(originData, laneid, filterData) {
  const o = recognizeCardMap[laneid];
  if (!o.cardRecognizeKey) {
    if (!_.isEmpty(filterData)) {
      return o.filteredCardType;
    }
    return o.defaultCardType;
  }
  if (o.cardRecognizeKey) {
    if (typeof o[originData[o.cardRecognizeKey]] === 'object') {
      const obj = o[originData[o.cardRecognizeKey]];
      if (obj.cardRecognizeKey) {
        return obj[originData[obj.cardRecognizeKey]] || obj.defaultCardType;
      }
    } else {
      return o[originData[o.cardRecognizeKey]] || o.defaultCardType;
    }
  }
}

function getCardKeyValueData(originData, keyValue, filterData) {
  if (typeof keyValue === 'function') {
    return keyValue(originData, filterData);
  }
  return originData[keyValue];
}

function transformToCardData({ item: obj, laneid, cardType, filterData }) {
  const o = originDataToCardDataMap[laneid];
  const resultObj = {};
  for (const key in o[cardType]) {
    if (o[cardType].hasOwnProperty(key)) {
      if (o.in) {
        resultObj[key] = getCardKeyValueData(obj[o.in], o[cardType][key], filterData);
      } else {
        resultObj[key] = getCardKeyValueData(obj, o[cardType][key], filterData);
      }
    }
  }
  return resultObj;
}

export function transformLaneDataByMap(originData, laneid, filterData) {
  let data = originData;
  if (!originData) {
    return [];
  }
  if (laneid === 'Y_1016') { // 获奖分析师泳道
    if (_.isEmpty(filterData)) {
      const idArr = data.ids.split(',');
      data = originData.list;
      data.forEach((item, index) => {
        item.id = idArr[index];
      });
    }
  }
  // if (laneid === 'Y_1018') { //  最新公告泳道
  //   data = originData && originData.items;
  // }
  if (data instanceof Array) {
    return data.map((item) => {
      const cardType = getCardTypeByMap(item, laneid, filterData);
      let o = null;
      if (cardType === 'C_001' || cardType === 'C_005') {
        o = {
          cardType,
          data: transformToCardData({
            item,
            laneid,
            filterData,
            cardType,
          }),
          cardId: item.id,
          keyWord: filterData.keywords,
        };
      } else {
        o = {
          cardType,
          ...transformToCardData({
            item,
            laneid,
            filterData,
            cardType,
          }),
          cardId: item.id,
          keyWord: filterData.keywords,
        };
      }
      return o;
    });
  }
  return [];
}