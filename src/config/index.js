import BaseApi from './baseApi';
import User from './user';
import Market from './market';
import Lanes from './lanes';

export default Object.assign({},
  BaseApi, User, Market, Lanes
);
