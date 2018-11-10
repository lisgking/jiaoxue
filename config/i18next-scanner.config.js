/**
 * @description 国际化插件i18next的翻译提取器配置文件
 * @author jhqu
 * date: 2018-05-18
 */

const path = require('path');
const i18nConfig = require('../src/i18n-config.json');

module.exports = {
  src: path.resolve(__dirname, '../src/**/*'),
  dest: path.resolve(__dirname, '../public/locales'),
  options: {
    debug: true,
    lngs: Object.keys(i18nConfig.supportedLanguages),
    defaultLng: i18nConfig.defaultLanguage,
    fallbackLng: i18nConfig.defaultLanguage,
    ns: i18nConfig.NSList,
    defaultNs: i18nConfig.defaultNS,
    defaultValue: '__NOT_TRANSLATED__',

    func: {
      list: ['t', 'i18n.t', 'i18next.t'],
      extensions: ['.js', '.jsx'],
    },

    trans: {
      extensions: ['.js', '.jsx'],
      fallbackKey: (ns, value) => {
        return value;
      },
    },

    resource: {
      loadPath: path.resolve(__dirname, '../public/locales', '{{lng}}/{{ns}}.json'),
      savePath: '{{lng}}/{{ns}}.json',
    },

    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
  },
};
