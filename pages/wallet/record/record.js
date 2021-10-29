let app = getApp()
let util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainColor: '#81be48',
    textColor: '#000',
    historyRecord: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.userTrack.push(['/record','/卡券兑换记录']);
    this.setData({
      mainColor: app.globalData.mainColor,
      textColor: app.globalData.textColor
    })
    if (app.globalData.locationInfo) {
      this.getRecord();
    } else {
      app.getLocationInfo('gcj02', (res) => {
        this.getRecord();
      })
    }
  },

  getRecord: function(){
    app.checkToken((token)=>{
      if(token){
        let url = app.globalData.baseUrl + "giftCard/query.do";
        // let param = {
        //   token,
        //   // accountId: app.globalData.accountId,
        //   // lo: app.globalData.locationInfo.longitude,
        //   // la: app.globalData.locationInfo.latitude,
        //   // mapType: 2,
        //   adAccountId: app.globalData.adAccountId,
        // }

        let param = {token};

        if (app.globalData.adAccountId) {
          param.adAccountId = app.globalData.adAccountId;
        } else {
          param.accountId = app.globalData.accountId;
          param.lo = app.globalData.locationInfo.longitude;
          param.la = app.globalData.locationInfo.latitude;
          param.mapType = 2;
        }

        util.request(url,param,(res) => {
          if(res.ret){
            this.setData({
              historyRecord: res.data
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})