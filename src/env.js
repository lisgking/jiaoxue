// 生产环境域名
const prod = [
  'report.analyst.ai',
  'mystock.analyst.ai',
  'filing.analyst.ai',
  'www.analyst.ai',
  'show.analyst.ai',
  'www.fenxi.ai',
  'passport.abcfintech.com',
  'v1.analyst.ai',
  'p.analyst.ai',
  'charttable.analyst.ai',
  'simu.analyst.ai',
];

// 测试环境域名
const onlineTest = [
  'report-dev.analyst.ai',
  'mystock-dev.analyst.ai',
  'filing-dev.analyst.ai',
  'compre-dev.analyst.ai',
  'show-dev.analyst.ai',
  'www-dev.fenxi.ai',
  'passport-pre.abcfintech.com',
  'qw-dev.aqlicai.cn',
  '118.31.236.187',
  'charttable-dev.analyst.ai',
  'simu-dev.analyst.ai',
];


let COMPRE_ANALYST = 'https://www.analyst.ai';
let REPORT_URL,
  MYSTOCK_URL,
  FILING_URL,
  ANALYST_URL,
  SHOW_URL,
  FENXI_URL,
  PASSPORT_URL,
  V1_URL,
  PARSING_URL,
  CHARTTABLE_URL,
  NEWS_URL;
if (prod.indexOf(window.location.hostname) !== -1) {
  COMPRE_ANALYST = 'https://www.analyst.ai';
  REPORT_URL = 'https://report.analyst.ai';
  MYSTOCK_URL = 'https://mystock.analyst.ai';
  FILING_URL = 'https://filing.analyst.ai';
  ANALYST_URL = 'https://www.analyst.ai';
  SHOW_URL = 'https://show.analyst.ai';
  FENXI_URL = 'https://www.fenxi.com';
  PASSPORT_URL = 'https://passport.abcfintech.com';
  V1_URL = 'https://v1.analyst.ai';
  PARSING_URL = 'http://p.analyst.ai';
  CHARTTABLE_URL = 'https://charttable.analyst.ai';
  NEWS_URL = 'https://news.analyst.ai';
} else if (onlineTest.indexOf(window.location.hostname) !== -1) {
  COMPRE_ANALYST = 'https://www.analyst.ai';
  REPORT_URL = 'https://report-dev.analyst.ai';
  MYSTOCK_URL = 'https://mystock.analyst.ai';
  FILING_URL = 'https://filing.analyst.ai';
  ANALYST_URL = 'https://compre-dev.analyst.ai';
  SHOW_URL = 'https://show-dev.analyst.ai';
  FENXI_URL = 'https://www-dev.fenxi.ai';
  PASSPORT_URL = 'https://passport-pre.abcfintech.com';
  V1_URL = 'http://qw-dev.aqlicai.cn';
  PARSING_URL = 'http://118.31.236.187';
  CHARTTABLE_URL = 'https://charttable-dev.analyst.ai';
  NEWS_URL = 'https://news-dev.analyst.ai';
} else {
  ANALYST_URL = 'https://compre-dev.analyst.ai';
  V1_URL = 'http://qw-dev.aqlicai.cn';
  PARSING_URL = 'http://118.31.236.187';
}

if (window.location.href.indexOf('http://localhost') !== -1 ||
  window.location.href.indexOf('dev') !== -1
) {
  COMPRE_ANALYST = 'http://compre-dev.analyst.ai';
  CHARTTABLE_URL = 'https://charttable-dev.analyst.ai';
  FILING_URL = 'https://filing-dev.analyst.ai';
  REPORT_URL = 'https://report-dev.analyst.ai';
  MYSTOCK_URL = 'https://mystock-dev.analyst.ai';
}


const env = {
  COMPRE_ANALYST,
  MYSTOCK_URL,
  REPORT_URL,
  FILING_URL,
  ANALYST_URL,
  SHOW_URL,
  FENXI_URL,
  PASSPORT_URL,
  V1_URL,
  PARSING_URL,
  CHARTTABLE_URL,
  NEWS_URL,
};

module.exports = env;
