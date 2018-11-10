/**
 * @description 用户登录信息按钮
 * @author wxiong
 * date: 2018-10-12
 */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import LoginUserInfo from 'abc-login-user-info';

import './index.scss';

@inject('userStore')
@observer
class UserButton extends Component {
  componentDidMount() {
    this.props.userStore.fetchUserInfo();
  }
  render() {
    const { userStore } = this.props;
    const { xingming, email, avatar } = userStore.userInfo;
    const userName = xingming || email;
    return (
      <LoginUserInfo
        popoverPlacement="rightBottom"
        loadState={userStore.state}
        userName={userName}
        userEmail={email}
        userAvatar={avatar}
        onLogout={window.sso_logout}
      />
    );
  }
}

export default UserButton;