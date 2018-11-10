/**
 * @description 联调数据集合
 * @author hbli
 * @date 2018/10/09
 */
const testData = {
  // 卡片1：资讯、公众号
  NewsOrWeiChatCardData: {
    cardType: 'C_001',
    data: { title: '附近的开始登记了肯定是了', summary: '附近的六角恐龙积累积累服了是的放假了说到付交了首付了商贷交放声大哭附件是', source: '天风证券', author: ['张三', '李四'], infoType: '资讯', publishAt: 1539070353000, linkUrl: 'www.baidu.com', cardStatus: 'detail' },
    keyWord: '了',
  },
  // 卡片6：专题研报（运营）
  SubjectReportCardData: {
    cardType: 'C_006',
    data: { loading: 'done', topicImg: 'http://abc-market-web-image.oss-cn-hangzhou.aliyuncs.com/topicBGP/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD.png', topicSub: '2018人工智能趋势报告', topicTitle: '人工智能', topicId: 25, topicUrl: 'http://op.analyst.ai/report/detail/25', item: [{ publish_at: 1539073953000, title: '国信证券-中国联通（600050）财报点评：混改效应显现，继续看好公司发展-180907', tag: ['人工智能'], id: 17683951 }, { publish_at: 1539073953000, title: '国信证券-中国联通（600050）财报点评：混改效应显现，继续看好公司发展-180907', tag: ['人工智能'], id: 17683951 }] },
    keyWord: '了',
  },
  // 卡片5：研报
  ReportCardData: {
    cardType: 'C_005',
    data: {
      // cardStatus: 'simple',
      industry1: '通信运营',
      summary: '中国联通（600050）财报点评：混改效应显现，继续看好公司发展微信号 guosen_research功能介绍 关注国信研究，实时了解国信证券经济研究所的各类信息。行业与公司中国联通（600050）财报点评：混改效应显现，继续看好公司发展事项：9月5日，中国联通发布“5G+视频”推进计划，首批合作伙伴涵盖政府、内容、终端、芯片、系统等视频全产业链。评论：混改初显成效，继续推动变革落地上半年，公司全面推进与战略投资者的深度合作。与腾讯、阿里、百度、京东等公司持续推进互联网触点合作，以低成本和薄补贴的发展模式有效触达新用户，尤其是青年市场。2I2C 业务快速增长，用户总数达到约7700 万户，带动4G 用户快速增长。与阿里、腾讯合作推出以“沃云”为品牌的公有云产品，为用户提供差异化产品及服务；开展云联网产品合作，为用户提供混合云组网能力；与阿里成立合资公司，强强联合，为政企客户打造定制化的应用软件服务。积极探索建设新零售试点门店，联合阿里、苏宁、京东、腾讯等，依托大数据能力，丰富门店品类、强化线上线下相互引流，对业务发展拉动效果显著。在IPTV、手机视频内容、大数据、物联网、AI 等创新业...',
      stockname: '中国联通',
      author: [
        '李亚军',
        '程成',
      ],
      honor: [
        '中国证券业分析师金牛奖',
        '新财富最佳分析师',
      ],
      rating: '增持',
      source: '国信证券',
      title: '国信证券-中国联通（600050）财报点评：混改效应显现，继续看好公司发展-180907',
      file_type: '网页',
      id: 17683951,
      tag: [
        '科技', '人工智能', '一带一路',
      ],
      create_at: 1536305490,
      file_pages: 1,
      category: '公司点评',
      uploaduser: '国信研究',
      stockcode: '600050.SH',
      publish_at: 1536283347,
      industry: '通信运营',
      infoType: '研报',
      analyst_honor: [
        {
          id: '79941563',
          honor: [
            '新财富',
            '金牛奖',
          ],
          is_new: false,
          name: '李亚军',
          avatar: 'https://abc-crawler.oss-cn-hangzhou.aliyuncs.com/sac.net_dc4cf7eb-7409-34d8-a709-fdf1c430e9bb.jpg',
        },
      ],
    },
    keyWord: '混改',
  },
  // 卡片2：精选资讯（运营）
  SelectionNewsCardData: {
    data: { title: '附近的开始登记了肯定是了', summary: '附近的六角恐龙积累积累服了是的放假了说到付交了首付了商贷交放声大哭附件是', source: '天风证券', author: ['张三', '李四'], infoType: '资讯', publishAt: 1539070353000, linkUrl: 'www.baidu.com', cardStatus: 'detail' },
    keyWord: '了',
  },
  // 卡片3：7*24小时快讯
  WeekNewsCardData: {
    dataList: [
      { flashNewsDate: 1539070353000, itemList: [{ publishAt: 1539073953000, content: '老师街坊邻居疯狂夺金服了是的尖峰时刻了房间了房间施蒂利克防守反击独守空房交点税了附件是打开方式缴费了手机焚枯食淡交付了' }, { publishAt: 1539092313000, content: '简历发监考老师街坊邻居疯狂夺金服了是,的尖峰时刻了房间了房，间施蒂利克aa防守反击独守空,房交点税了附件是打开方式缴费了手机焚枯食淡交付了' }] },
      { flashNewsDate: 1539265113000, itemList: [{ publishAt: 1539221913000, content: '放假了房间简历发监考老师街坊邻居疯狂夺金服了是的尖峰时刻了房间了房间施蒂利克防守反击独守空房交点税了附件是打开方式缴费了手机焚枯食淡交付了' }, { publishAt: 1539265113000, content: '简历发监考老师街坊邻居疯狂夺金服了是的尖峰时刻了房间了房间施蒂利克防守反击独守空房交点税了附件是打开方式缴费了手机焚枯食淡交付了' }] },
    ],
  },
  // 卡片4：公众号
  WeiChatCardData: {
    cardType: 'C_004',
    data: { publishAt: 1539070353000, weiChatNo: '张三', weiChatStatus: false, articleList: [{ publishAt: 1539073953000, title: '老师街坊邻居疯狂夺金服了是的尖峰时刻了房间了房间施蒂利克防守反击独守空房交点税了附件是打开方式缴费了手机焚枯食淡交付了', linkUrl: 'www.baidu.com' }, { publishAt: 1539073953000, title: '老师街坊邻居疯狂夺金服了是的尖峰时刻了房间了房间施蒂利克防守反击独守空房交点税了附件是打开方式缴费了手机焚枯食淡交付了', linkUrl: 'www.baidu.com' }, { publishAt: 1539073953000, title: '老师街坊邻居疯狂夺金服了是的尖峰时刻了房间了房间施蒂利克防守反击独守空房交点税了附件是打开方式缴费了手机焚枯食淡交付了', linkUrl: 'www.baidu.com' }] },
    keyWord: '邻居',
  },
  // 卡片16：公众号
  TopSearchCardData: {
    cardType: 'C_016',
    dataList: [
      {
        news: 1,
        change: 1,
        id: 2,
        link: '',
        order: 2,
        query: '人工智能',
        title: '人工智能',
      },
      {
        news: 1,
        change: 3,
        id: 3,
        link: '',
        order: 3,
        query: '中美贸易战',
        title: '中美贸易战',
      },
      {
        news: 1,
        change: 3,
        id: 4,
        link: '',
        order: 4,
        query: '贵州茅台',
        title: '贵州茅台',
      },
      {
        news: 1,
        change: 2,
        id: 5,
        link: '',
        order: 5,
        query: '资管规模',
        title: '资管规模',
      },
      {
        news: 1,
        change: 1,
        id: 6,
        link: '',
        order: 6,
        query: '独角兽',
        title: '独角兽',
      },
      {
        news: 1,
        change: 2,
        id: 7,
        link: '',
        order: 7,
        query: '原油期货',
        title: '原油期货',
      },
      {
        news: 1,
        change: 1,
        id: 8,
        link: '',
        order: 8,
        query: '爱艺奇',
        title: '爱艺奇',
      },
      {
        news: 1,
        change: 1,
        id: 1,
        link: '',
        order: 9,
        query: '工业互联网',
        title: '工业互联网',
      },
    ],
  },
};

export default testData;
