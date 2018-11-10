/**
 * @description 用户相关状态仓库
 * @author jhqu
 * date: 2018-05-28
 */

import { observable, computed, flow, toJS } from 'mobx';
import _ from 'lodash';
import Cookies from 'js-cookie';
import ask from '../lib/ask';

const USER_ID = Cookies.get('userId');
const USER_TOKEN = Cookies.get('token');
class UserStore {
  // 用户信息数据
  @observable userInfo = {};
  @observable
  userData={}


  // 获取用户信息数据的状态：pending / done / error
  @observable state = 'pending';

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  // 当前用户可查看的菜单项
  @computed get userMenuShowItemKeys() {
    if (this.state !== 'done') {
      return [];
    }

    const { menu, permission: { showItmes } } = this.userInfo;

    // 全部菜单项id与key的映射表
    const allMenuKeyMap = menu.reduce((map, item) => (
      Object.assign(map, { [item.id]: item.key })
    ), {});

    // 要显示的菜单项key数组
    const showItemKeys = showItmes.reduce((keys, id) => (
      allMenuKeyMap[id] && keys.concat(allMenuKeyMap[id])
    ), []);

    return showItemKeys;
  }

  @computed get getAllMenuItems() {
    if (this.state !== 'done') {
      return [];
    }
    const { menu, opmenu } = this.userInfo;

    // 全部菜单项id与key的映射表
    const allMenuKeyMap = menu.reduce((map, item) => (
      Object.assign(map, { [item.id]: item.key })
    ), {});

    const opmenuJs = toJS(opmenu);

    let allMenuItems;
    if (opmenuJs && Array.isArray(opmenuJs.opMenu)) {
      allMenuItems = opmenuJs.opMenu.map((item) => {
        const key = allMenuKeyMap[item.permission];
        return {
          id: item.id,
          title: item.title,
          key,
          icon: item.icon,
          link: item.url,
          permission: item.permission,
        };
      });
    }
    return allMenuItems;
  }

  @computed get getShowMenuItems() {
    const { permission } = this.userInfo;
    const permissionJs = toJS(permission);
    const showItmes = permissionJs && Array.isArray(permissionJs.showItmes) ? permissionJs.showItmes : [];
    return this.getAllMenuItems.filter(item => showItmes.includes(item.permission));
  }

  // 获取用户信息数据
  fetchUserInfo = flow(function* ({ refresh = false } = {}) {
    // 非强制刷新时，且用户信息数据已加载时直接返回当前用户信息数据
    if (!refresh && !_.isEmpty(this.userInfo)) {
      return this.userInfo;
    }

    this.userInfo = {};
    this.state = 'pending';
    try {
      const { code, data, message } = yield ask('UserInfo', {
        params: {
          userId: USER_ID,
          token: USER_TOKEN,
        },
      });

      // 响应异常
      if (code !== 200) {
        throw new Error(`Response Exception: ${message};code: ${code}`);
      }

      // 获取成功
      this.userInfo = data;
      this.state = 'done';
      Object.assign(this.userData, data);
    } catch (error) {
      console.error(error);

      // 获取失败
      this.state = 'error';
    }
  });
}

export default UserStore;
