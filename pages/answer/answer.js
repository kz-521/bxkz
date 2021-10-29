// pages/answer/answer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:'120',
    mach:20,
    getNest:true,
    isError:true,
    getNest1:true,
    getNest2:true,
    getNest3:true,
    select1:true,
    select2:true,
    select3:true,
    select4:true,
  },

  countDown() {
    let that = this 
    let count = 120 
   that.data.setInterval =  setInterval(() => {
     count = count - 1
     if( count === -1 ) {  // 倒计时等于-1 离开页面
        that.toGiveUp()
     } else {
     that.setData({
      count 
     })
    }
   }, 1000);
  },
  toGiveUp() {
    wx.navigateBack({
      delta: 1,
    })
  },
  select() {
    this.setData({
      select1: false
    })
  },
  select2() {
    this.setData({
      select2: false
    })
  },
  select3() {
    this.setData({
      select3: false
    })
  },
  select4() {
    this.setData({
      select4: false
    })
  },
  flag() {
    this.setData({
      getNest: false
    })
    // this.getError()
    this.setData({
      isError: false
    })
  },
  flag1() {
    this.setData({
      getNest1: false
    })
  },
  flag2() {
    this.setData({
      getNest2: false
    })
  },
  flag2() {
    this.setData({
      getNest3: false
    })
  },
  getError() {
    this.setData({
      isError: false
    })
    wx.showModal({
      title: '提示',
      content: '您的答案不正确,请重新选择',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  toNest() {
    if(this.data.mach == 100 ){
      if(!this.data.select1 && !this.data.select2 && !this.data.select3 && !this.data.select4){
        wx.navigateBack({
          delta: 1,
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '请选择所有正确答案',
          success (res) {
            if (res.confirm) {
            } else if (res.cancel) {
            }
          }
        })
      }
    }else{
    if(this.data.getNest | this.data.getNest ) {
      wx.showModal({
        title: '提示',
        content: '请选择正确答案',
        success (res) {
          if (res.confirm) {
          } else if (res.cancel) {
          }
        }
      })
      
    } else{
    this.setData({
      mach: this.data.mach + 20,
      getNest: true,
      isError: true
    })
  }
}
  },

    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.countDown() 
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
    clearInterval(this.data.setInterval)
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