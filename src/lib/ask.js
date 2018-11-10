/**
 * @description 异步请求核心
 * @author dhhuang1
 * @date 2018/5/8 下午2:33:41
 */
import uuidv4 from 'uuid/v4';
import axios from 'axios';
import { message } from 'antd';
import Cookies from 'js-cookie';
import api from '../config';

// 可以拿到 不同环境 需要在
// webpack.config不同配置文件中设置
const env = process.env.NODE_ENV;

// 可以 确定前缀地址
// 在这个框架里面可以配置 packjson 里面的 proxy 来确定代理
// 正式开发的时候 去掉 baseURL
// const baseURL = 'http://rap2api.taobao.org/app/mock/12201/'
const userId = Cookies.get('userId');
const token = Cookies.get('token');
export default function ask(name, opt = {}) {
  // 取传进来的用户信息
  let {
    data,
    params,
  } = opt;
  const {
    headers,
    responseType,
  } = opt;
  /**
     * 获取接口信息
     * 如果后期涉及到权限
     * 可以在接口信息里面
     * 设定 并取到
     */
  const {
    method,
    url,
  } = api[name];
  const instance = axios.create({
    // baseURL,
    // `withCredentials` 表示跨域请求时是否需要使用凭证
    withCredentials: false,
  });

  // 响应中间处理层
  instance.interceptors.response.use((response) => {
    // 请求成功后 处理在此
    return response.data;
  }, (error) => {
    // 请求失败 错误在此
    return Promise.reject(error);
  });
  if (!params) {
    params = {};
  }
  params.userId = userId;
  params.token = token;
  if (method !== 'GET') {
    if (!data) {
      data = {};
    }
    data.userId = userId;
    data.token = token;
  }
  params.request_id = uuidv4();
  const promise = instance.request({
    responseType,
    url,
    method,
    headers,
    params,
    data,
  });
  return promise;
}