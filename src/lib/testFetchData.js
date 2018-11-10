import testData from './testData';
export default function (laneId) {
  const ret = [];
  if (laneId === 'Y_1001') {
    // ret.push({
    //   cardType: testData.ReportCardData.cardType,
    //   dataList: [testData.ReportCardData.reportDetail],
    // });
    ret.push({
      cardType: testData.WeiChatCardData.cardType,
      dataList: testData.WeiChatCardData.dataList,
    });
    // ret.push({
    //   cardType: testData.NewsOrWeiChatCardData.cardType,
    //   dataList: [testData.NewsOrWeiChatCardData.data],
    // });
  }
  return ret;
}
