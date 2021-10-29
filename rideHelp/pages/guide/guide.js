// pages/guide/guide.js
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    url:'https://guide.bxkuaizu.cn/BX_1_AE-1.html',
    items:[
      {title: '1、电单车仅限本人账户骑行，根据法律条款规定，年龄必须在16周岁至65周岁之间方可驾驶。',src: '../../image/9@2x.png',width:'662rpx',height:'300rpx' },
      {title: '2、全程佩戴头盔，遵循道路法规，不闯红灯、不逆行、不驶入机动车道，保障骑行安全。',src: '../../image/10@2x.png',width:'662rpx',height:'300rpx'},
      {title: '3、一人一车，不载他人，不运载体积或重量超标物品，除车筐外，不在车辆其他地方挂载任何物品。',src: 'http://bxkz.oss-cn-hangzhou.aliyuncs.com/tupian3.png',width:'662rpx',height:'300rpx'},
      {title: '4、百姓快租为您的每次骑行购买意外险（非本人骑行除外）,守护您的每一程安全。如出现事故，可快速联系人工客服协助现场处理。',width:'662rpx',height:'0rpx'},
    ],
    not:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    setTimeout(function() {
      that.setData({
        not: [
          'http://bxkz.oss-cn-hangzhou.aliyuncs.com/not1.png',
          'http://bxkz.oss-cn-hangzhou.aliyuncs.com/not2.png',
          'http://bxkz.oss-cn-hangzhou.aliyuncs.com/not3.png',
          'http://bxkz.oss-cn-hangzhou.aliyuncs.com/not4.png',
          'http://bxkz.oss-cn-hangzhou.aliyuncs.com/not5.png',
          'http://bxkz.oss-cn-hangzhou.aliyuncs.com/not6.png',
        ]
      })
    },500)
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
    app.globalData.noRefresh = true
    console.log('骑行指南卸载了 onRefresh为true');
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