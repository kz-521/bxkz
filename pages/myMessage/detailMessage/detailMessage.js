// pages/myMessage/detailMessage/detailMessage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     detailData:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let detailData = [];
      let message = JSON.parse(options.message);
      detailData.push(message);
      console.log(message);
      if(message.readTime) {
        message.readTime = (message.readTime).substring(0,16)
      }
      this.setData({
        detailData:detailData 
      });
      console.log(this.data.detailData);
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