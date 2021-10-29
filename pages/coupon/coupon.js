var app = getApp();
let util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    notUseList:'',
    canUseList:'',
    mainColor: '#81be48',
    textColor: '#000',
    couponList: [],
    showInput: false
  },

  // 获取优惠券列表
  getCoupon() {
    if (!app.globalData.locationInfo) {                                                                 // 没有位置信息 就弹框 然后返回上一页面
      console.log(">>>>>> 无法获取位置 ");
      util.showModal_nocancel('无法获取位置', () => {
        wx.navigateBack({
        })
      })
      return;
    }
    app.checkToken((token) => {
      let url = app.globalData.baseUrl + "couponUser/getByLocation.do";
      console.log("请求url:" + url);
      let param = {
        accountId: app.globalData.accountId,
        lo: app.globalData.locationInfo.longitude,
        la: app.globalData.locationInfo.latitude,
        mapType: 2,
        token,
      }
      util.request(url,param,(res) => {
        console.log(res,"-------getCoupon()请求结果:");
        if(res.ret){
          let notUseList = []
          let canUseList = []
          res.data.forEach(item => {
            if ((item.isValid == 1) && (item.isUse == 0) ) {   // 未失效 且 0未使用
              canUseList.push(item)
            }
            if ( item.isValid == 0 || item.isUse == 1 ){       // 失效 且 1 已经使用
              notUseList.push(item)
            } 
          })
          this.setData({
            couponList: res.data,
            notUseList: notUseList,
            canUseList: canUseList
          })
        }
      })
    })
  },

  onLoad: function (options) {
    app.globalData.userTrack.push(['/coupon','/优惠券详情']);                                         // 添加用户记录
    this.setData({
      mainColor: app.globalData.mainColor,
      textColor: app.globalData.textColor
    })
  },

  onReady: function () {
    if (app.globalData.locationInfo) {
      this.getCoupon();
    } else {
      app.getLocationInfo('gcj02', (res) => {
        this.getCoupon();
      })
    }
  },

  inputCtrl: function(){
    this.setData({
      showInput: !this.data.showInput
    })
  },

  onShow: function () {  // 获取优惠券的数据 
    if (app.globalData.locationInfo) {
      this.getCoupon();
    } else {
      app.getLocationInfo('gcj02', (res) => {
        this.getCoupon();
      })
    }
  },

  onHide: function () {
  },

  onUnload: function () {
  },

  onPullDownRefresh: function () {
  },

  onReachBottom: function () {
  },

  onShareAppMessage: function () {
  }
})