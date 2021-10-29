Page({

  /**
   * 页面的初始数据
   */
  data: {
    instructionArr: [
      {
        imgSrc: '../../images/instructions/1@2x.png',
        title: '资费说明',
        description: '根据时间计费，借车时显示车辆价格，临时停车正常计费。'
      }, {
        imgSrc: '../../images/instructions/2@2x.png',
        title: '道路救援说明',
        description: '因骑行太远车辆电量不足，无法返回还车点还车，用户需要支付救援产生的费用。'
      }, {
        imgSrc: '../../images/instructions/3@2x.png',
        title: '还车区域',
        description: '请在地图上的还车区域内还车。'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.userTrack.push(['/instructions','/工具指令']);
    
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