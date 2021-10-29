let app = getApp()
Page({
  /**
   * 页面初始数据 拼接用户协议地址
   */
  data: {
    url: `${app.globalData.serviceUrl}userAgreement/${app.globalData.accountId}/index.html?time=${new Date().getTime()}`
  },
  
  onLoad: function(options){
    app.globalData.userTrack.push(['/agreement','/用户协议'])
  }
})