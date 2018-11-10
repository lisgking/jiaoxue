/**
 * @description 多语言切换组件
 * @author jhqu
 * date: 2018-05-18
 */

import React, { Component } from 'react';
import classNames from 'classnames';
// import { Layout, List, Input, Icon, Select } from 'antd';
import { translate } from 'react-i18next';
import { Link, withRouter } from 'react-router-dom';
import i18nConfig from '../../i18n-config.json';
import './style.scss';

// 应用支持的语言列表映射对象
const { supportedLanguages } = i18nConfig;

// 多语言切换组件
@withRouter
@translate()
export default class LanguageToggle extends Component {
  getLanguagePath = (lang) => {
    const { match, location } = this.props;
    const currentLang = match.params.lang;
    const pathname = currentLang
      ? location.pathname.replace(new RegExp(`^/${currentLang}/?`), `/${lang}/`)
      : `/${lang + location.pathname}`;
    return {...location, pathname};
  }

  render () {
    const { i18n } = this.props;

    return (
      <div
        className={classNames('language-toggle', this.props.className)}
        style={this.props.style}
      >
        {Object.entries(supportedLanguages).map(([lang, text]) => {
          let linkClass = classNames('language-toggle__item', {
            'is-active': lang === i18n.language
          });

          return (
            <Link
              key={lang}
              className={linkClass}
              to={this.getLanguagePath(lang)}
            >
              {text}
            </Link>
          );
        })}
      </div>
    );
  }
}
