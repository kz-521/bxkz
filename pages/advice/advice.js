var app = getApp()
var util = require('../../utils/util.js')
var appColor = require('../../utils/config.js').appColor;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    advice: '',
    title: '',
    mainColor: '',
    textColor: '',
  },

  selectAdvice: function (e) {
    let title = e.currentTarget.dataset.title;
    this.setData({
      title: title,
    })
  },

  bindTextAreaBlur: function(e){
    this.setData({
      advice: e.detail.value
    })
  },

  inputTitle: function(e){
    this.setData({
      title: e.detail.value
    })
  },

  commitAdvice: function(){
    if (app.globalData.locationInfo) {
      this.sendAdvice();
    } else {
      app.getLocationInfo('gcj02', (res) => {
        this.sendAdvice();
      })
    }
  },

  sendAdvice: function(){
    let title = this.data.title;
    let advice = this.data.advice;
    if (title.indexOf(' ') == 0 || title.length == 0) {
      wx.showToast({
        title: '请选择问题类型',
        icon: 'none'
      })
      return;
    }
    if (advice.indexOf(' ') == 0 || advice.length == 0) {
      wx.showToast({
        title: '请输入问题反馈',
        icon: 'none'
      })
      return;
    }
    if(util.isEmojiCharacter(advice)){
      wx.showToast({
        title: '请不要输入表情',
        icon:'none'
      });
      return;
    }
    wx.showToast({
      title: '请稍候...',
      icon: 'loading',
      mask: true,
      duration: 15000
    })
    app.checkToken((token) => {
      if (token.length > 0) {
        let url = app.globalData.baseUrl + "suggestion/add.do";
        let param = {
          token: token,
          title: title,
          content: advice,
          accountId: app.globalData.accountId,
          lo: app.globalData.locationInfo.longitude,
          la: app.globalData.locationInfo.latitude,
          mapType: 2,
        };
        util.request(url, param, (res) => {
          wx.hideToast();
          if (res.ret) {
            util.showModal_nocancel('提交成功！', () => {
              wx.navigateBack({
              })
            })
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 3000
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.userTrack.push(['/advice','/意见反馈']);
    this.setData({
      mainColor: app.globalData.mainColor,
      textColor: app.globalData.textColor
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