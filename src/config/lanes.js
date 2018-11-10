/**
 * @description 账户相关API
 * @author hawk
 * date: 2018-10-16
 */
const Lanes = {
  filterSelection: { // 模块的API定义均要以模块名称开头，后跟接口描述
    method: 'GET', // 定义API请求方法
    url: '/api/privatefund/board-lane/selection', // 定义API请求地址
    right: true, // 是否需要登录
  },
  // 行业
  industries: {
    method: 'GET',
    url: '/api/filing/notice/industries',
    right: true,
  },
  // 公告
  noticeCategories: {
    method: 'GET',
    url: '/api/filing/notice/categories',
    right: true,
  },
  // 股票
  stockSelectList: {
    method: 'GET',
    right: true,
    url: '/api/usercenter/suggest/security',
  },
  categories: {
    method: 'GET',
    right: true,
    url: '/api/report/categories',
  },
  fetchRecommendList: {
    method: 'GET',
    url: '/api/privatefund/board-lane/recommend',
    right: undefined,
  },
  addLane: {
    method: 'POST',
    url: '/api/privatefund/board-lane',
    right: undefined,
  },
  deleteLane: {
    method: 'DELETE',
    url: '/api/privatefund/board-lane',
    right: undefined,
  },
  fetchUseLaneList: {
    method: 'GET',
    url: '/api/privatefund/board-lane/user-lane-list',
    right: undefined,
  },
  importantNotice: { // 重要公告
    method: 'GET',
    right: true,
    url: '/api/privatefund/feed/important-notice',
  },
  notice: { // 最新公告
    method: 'GET',
    right: true,
    url: '/api/privatefund/feed/notice',
  },
  myStockTimeLine: {
    method: 'GET',
    right: true,
    url: '/api/privatefund/feed/mystock-timeline',
  },
  analystReport: {
    method: 'GET',
    right: true,
    url: '/api/privatefund/feed/analyst-report',
  },
  privateNews: {
    method: 'GET',
    right: true,
    url: '/api/privatefund/news',
  },
  flashNews: {
    method: 'GET',
    right: true,
    url: '/api/privatefund/news/7day',
  },
  privateSubjectReport: {
    method: 'GET',
    right: true,
    url: '/api/privatefund/feed/subject-report',
  },
  privateWechatTime: {
    method: 'GET',
    right: true,
    url: '/api/privatefund/feed/wechat-timeline',
  },
  privateTopSearch: {
    method: 'GET',
    right: true,
    url: '/api/privatefund/feed/top-search',
  },
  privateSelectionRecommend: {
    method: 'GET',
    right: true,
    url: '/api/privatefund/feed/selection-recommend',
  },
  privateKeywordSearch: {
    method: 'GET',
    right: true,
    url: '/api/privatefund/feed/keyword-search',
  },
  privateReport: {
    method: 'GET',
    right: true,
    // url: '/api/report/searchReport',
    url: '/api/privatefund/feed/searchReport',
  },
  privateWechatSearch: {
    method: 'GET',
    right: true,
    url: '/api/privatefund/feed/wechat-search',
  },
  updateLaneSort: {
    method: 'PUT',
    right: true,
    url: '/api/privatefund/board-lane/lane-sort',
  },
  updateLaneFilter: {
    method: 'PUT',
    right: true,
    url: ' /api/privatefund/board-lane/update-lane-filter',
  },
  updateLane: {
    method: 'PUT',
    right: true,
    url: ' /api/privatefund/board-lane/update-lane-option',
  },
};

export default Lanes;
