/**
 * @description 国际化相关配置供应商组件
 * @author jhqu
 * date: 2018-05-18
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { I18nextProvider, translate } from 'react-i18next';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';
import i18n from '../../i18n';
import i18nConfig from '../../i18n-config.json';

// 应用默认使用的语言环境
const { defaultLanguage } = i18nConfig;

// 应用支持的语言列表
const supportedLanguages = Object.keys(i18nConfig.supportedLanguages);

// antd国际化数据映射
const localeMap = {
  en: enUS,
  'zh-cn': zhCN,
};

// antd国际化供应商组件包装组件，使其能根据当前的语言环境自动配置
const LocaleProviderWrapper = translate()((obj) => {
  const { children } = obj;
  const i18nn = obj.i18n;
  const locale = localeMap[i18nn.language] || localeMap[defaultLanguage];
  return (
    <LocaleProvider locale={locale}>
      {children}
    </LocaleProvider>
  );
});

// 国际化供应商组件，将根据路由中的语言参数自动切换当前语言环境
// 如果路由中不包含语言参数，将由i18next的语言环境探测器自动配置
@withRouter
export default class LanguageProvider extends Component {
  // 当路由发生变化时判断是否需要切换语言环境
  componentDidUpdate() {
    const willChangeLang = this.shouldChangeLanguage();
    if (willChangeLang !== false) {
      i18n.changeLanguage(willChangeLang);
    }
  }

  // 根据当前路由地址中的语言参数判断是否需要切换语言环境
  // 是：返回需要切换到的语言代码
  // 否：返回false
  shouldChangeLanguage() {
    const routeLang = this.props.location.pathname.split('/')[1].toLowerCase();
    const isSupported = supportedLanguages.some(lang => lang === routeLang);
    const currentLang = i18n.language;

    // 如果当前路由中的语言参数为应用支持的语言且与当前语言环境不匹配时
    // 返回将要切换到的语言代码，否则返回false
    return isSupported && currentLang !== routeLang ? routeLang : false;
  }

  render() {
    return (
      <I18nextProvider i18n={i18n}>
        <LocaleProviderWrapper>
          {this.props.children}
        </LocaleProviderWrapper>
      </I18nextProvider>
    );
  }
}
