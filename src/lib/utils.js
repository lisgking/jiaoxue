/**
 * @description 工具类
 * @author hbli
 * @date 2018/10/09
 */
import moment from 'moment';
import axios from 'axios';
const utils = {
  // 时间格式化
  getFormatDateString(date, format = 'HH:mm:ss') {
    let historyDate = date;
    // if (date instanceof String) {
    historyDate = moment(date);
    // }
    const today = moment();
    const yesterday = moment(Date.now()).subtract(1, 'days');
    // const beforeYesterday = moment(Date.now()).subtract(2,'days');
    if (moment(today.format('YYYY-MM-DD')).isSame(historyDate.format('YYYY-MM-DD'))) {
      return historyDate.fromNow();
    } else if (moment(yesterday.format('YYYY-MM-DD')).isSame(historyDate.format('YYYY-MM-DD'))) {
      return `昨天 ${historyDate.format(format)}`;
    }
    return historyDate.format('YYYY.MM.DD HH:mm:ss');
  },
  // 高亮字符串里面的关键字
  highLightStr(string, keyword) {
    let str = '';
    if (!keyword || !string) return string;
    const reg = new RegExp(keyword, 'gi');
    str = string.replace(reg, `<span class='highlight'>${keyword}</span>`);
    return str;
  },
  // 通过window.abc_sso_env来判断所属环境，并返回研报对应的域名或接口地址
  getServerUrl(number, typeName) { // 1:返回域名 2:返回接口地址
    let serverUrl = '';
    if (window.abc_sso_env === 'dev') {
      serverUrl = `http://${number === 1 ? typeName : 'api'}.researchreport.cn`;
    } else if (window.abc_sso_env === 'pre') {
      serverUrl = `https://${number === 1 ? `${typeName}-dev` : 'api-dev'}.analyst.ai`;
    } else if (window.abc_sso_env === 'prod') {
      serverUrl = `https://${number === 1 ? typeName : 'api'}.analyst.ai`;
    }
    return serverUrl;
  },
  // 通过window.abc_sso_env来判断所属环境，并返回综搜主站的域名
  getHostServerUrl() {
    let serverUrl = '';
    if (window.abc_sso_env === 'dev') {
      serverUrl = 'http://www.researchreport.cn';
    } else if (window.abc_sso_env === 'pre') {
      serverUrl = 'https://www-dev.analyst.ai';
    } else if (window.abc_sso_env === 'prod') {
      serverUrl = 'https://www.analyst.ai';
    }
    return serverUrl;
  },
  // 获取下载文件的URL（pdf、word、excel、ppt等）
  getDownloadUrl(title, url) {
    if (!url) return null;
    const serverUrl = this.getServerUrl(2);
    const url_split = url.split('.');
    const download_url = `${serverUrl}/api/usercenter/file/pdf?name=${encodeURIComponent(title)}.${url_split[url_split.length - 1]}&url=${
      window.btoa(url.indexOf('https') > -1 ? url : `https://abc-crawler.oss-cn-hangzhou.aliyuncs.com${url}`)}`;
    return download_url;
  },
  toDecimal(x, length) {
    let f = parseFloat(x);
    if (isNaN(f)) {
      return false;
    }
    f = Math.round(x * 100) / 100;
    let s = f.toString();
    let rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + length) {
      s += '0';
    }
    return s;
  },
};

  // 下载文件
export function downloadFile(url, name) {
  axios.get(url, {
    responseType: 'blob', // 重要
  }).then((response) => {
    const linkUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = linkUrl;
    link.setAttribute('download', `${name}`);
    document.body.appendChild(link);
    link.click();
  });
}

export default utils;
