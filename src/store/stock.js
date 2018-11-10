import {
  observable,
  action,
  runInAction,
} from 'mobx';
import ask from '../lib/ask';


class StockStore {
  @observable stockDetail = {};
  @observable isLoading = true;

  @action
  fetchStockDetail(name, params = {}) {
    this.isLoading = true;
    this.getStockDetail(name, params);
  }
  @action.bound
  getStockDetail = async (name, payload = {}) => {
    try {
      const response = await ask('stockCard', {
        params: {
          stock_code: payload.stockCode,
        },
      });

      if (response.code !== 200) {
        throw new Error(`Response exception code ${response.code} message ${response.message}`);
      }
      if (response && response.code === 200 && response.data) {
        runInAction(() => {
          this.stockDetail = response.data;
          this.isLoading = false;
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}
export default StockStore;