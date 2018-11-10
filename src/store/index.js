/**
 * store中心
 * @description 总 store 分配中心
 * @author dhhuang1
 * @date 2018/5/8 上午9:17:14
 */

import { configure } from 'mobx';
import DefaultStore from './default';
import LaneStore from './lane';
import UserStore from './user';
import StockStore from './stock';
import XWStore from './xw';

// 只允许 内部改变 state
configure({ enforceActions: true });

class Store {
  constructor() {
    this.defaultStore = new DefaultStore(this);
    this.laneStore = new LaneStore(this);
    this.userStore = new UserStore(this);
    this.stockStore = new StockStore(this);
    this.xwStore = new XWStore(this);
  }
}


export default Store;
