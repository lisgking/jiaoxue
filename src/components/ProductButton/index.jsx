/**
 * @description 用户登录信息按钮
 * @author wxiong
 * date: 2018-10-12
 */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ProductMenuButton from 'abc-product-menu-button';

import './index.scss';

@inject('userStore')
@observer
class ProductButton extends Component {
  render() {
    return (
      <ProductMenuButton
        title="应用"
        popoverPlacement="rightBottom"
        loadState={this.props.userStore.state}
        userInfo={this.props.userStore.userInfo}
      />
    );
  }
}

export default ProductButton;