/**
 * @description 账户相关API
 * @author kygeng
 * date: 2018-05-28
 */
const User = {
  UserInfo: { // 模块的API定义均要以模块名称开头，后跟接口描述
    method: 'GET', // 定义API请求方法
    url: '/api/usercenter/user/info', // 定义API请求地址
    right: true, // 是否需要登录
  },
  SSOSpacetime: {
    method: 'GET',
    url: '/api/usercenter/user/config',
    right: true,
  },
};

export default User;