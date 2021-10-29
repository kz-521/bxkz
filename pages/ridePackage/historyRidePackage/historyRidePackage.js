let app = getApp();
let util = require('../../../utils/util.js');
let appColor = require('../../../utils/config.js').appColor;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: null, //会员类型 0骑行 1免押
    pageSize: 50,
    currentPage: 1,
    orderList: null,
    mainColor: '',
    textColor: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      mainColor: app.globalData.mainColor,
      textColor: app.globalData.textColor
    })
    if (app.globalData.locationInfo) {
      this.getHistoryOrder();
    } else {
      app.getLocationInfo('gcj02', (res) => {
        this.getHistoryOrder();
      })
    }
  },

  getHistoryOrder: function(){
    if (!app.globalData.locationInfo) {
      util.showModal_nocancel('无法获取位置', () => {
        wx.navigateBack({
        })
      })
      return;
    }
    app.checkToken((token)=>{
      if(token.length > 0){
        // let url = app.globalData.baseUrl + "rideCardUser/queryPage.do";
        // let param = {
        //   pageNO: this.data.currentPage,
        //   rowCount: this.data.pageSize,
        //   // accountId: app.globalData.accountId,
        //   // lo: app.globalData.locationInfo.longitude,
        //   // la: app.globalData.locationInfo.latitude,
        //   // mapType: 2,
        //   adAccountId: app.globalData.adAccountId,
        //   token: token
        // };
        // if (this.data.type == 1)
        //   url = app.globalData.baseUrl + "memberFee/findHistory.do";

        let url = "",
            param = {
              pageNO: this.data.currentPage,
              rowCount: this.data.pageSize,
              adAccountId: app.globalData.adAccountId,
              token: token
            };
        
        if (this.data.type == 0) {
          url = app.globalData.baseUrl + "rideCardUser/queryPage.do";
        } else if (this.data.type == 1) {
          url = app.globalData.baseUrl + "memberFee/findHistory.do";
        } else if (this.data.type == 2) {
          url = app.globalData.baseUrl + "vipCard/userVipPage.do";
        }
          
        util.request(url, param, (res) => {
          if (res.ret) {
            //console.log(res.data);
            res.data.map((order) => {
              let tempTime = order.expireTime;
              let now = util.formatTime(new Date(),true);
              if ((new Date(now).getTime()) - (new Date(tempTime).getTime()) > 0){
                order.overTime = true;
              }else{
                order.overTime = false;
              }
            })
            this.setData({
              orderList: res.data,
            })
          }
        })
      }
    })
  },

  formatTime: function (date) {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()

    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    let milliseconds = date.getMilliseconds();

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':') ;
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