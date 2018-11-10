/**
 * @description 市场或公司行情API
 * @author wxiong
 * date: 2018-10-12
 */

const marketApi = {
  // 公司卡片股票详情
  stockInfo: {
    method: 'GET',
    url: '/api/usercenter/stock/stock-info',
    right: true,
  },
  // 公司行情
  stockCard: {
    method: 'GET',
    url: '/api/usercenter/stock/stock-card',
    right: true,
  },
};

export default marketApi;