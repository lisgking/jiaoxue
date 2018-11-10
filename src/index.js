import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import 'moment/locale/zh-cn';
import { BrowserRouter, Route } from 'react-router-dom';
import Store from './store';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';

import LanguageProvider from './components/LanguageProvider';
import i18nConfig from './i18n-config.json';

// 应用支持的语言列表
const supportedLanguages = Object.keys(i18nConfig.supportedLanguages);

const Wrap = (
  <Provider {...new Store()}>
    <BrowserRouter basename="/">
      <LanguageProvider>
        <Route
          path={`/:lang(${supportedLanguages.join('|')})?`}
          component={App}
        />
      </LanguageProvider>
    </BrowserRouter>
  </Provider>
);
ReactDOM.render(
  Wrap,
  document.getElementById('root')
);
// registerServiceWorker();
