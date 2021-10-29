// pages/myMessage/myMessage.js
let app = getApp();
let util = require("../../utils/util.js");
let index = '';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mainColor: "",
    textColor: "",
    headColor: "",
    hadReadArr: [],
    status: 1,
    noReadArr: [],
    readArr: [],
    lastMsdId: 0,
    mainColor: '',
    textColor: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMessage(0);
    this.getMessage(1);
    this.setData({
      mainColor: app.globalData.mainColor,
      textColor: app.globalData.textColor
    });
  },
  //得到未读的信息
  getMessage: function (msgState) { // 0
    let lastMsdId = 0;
    let noReadArr = []; //未读队列  
    let hadReadArr = []; //已读队列
    let readArr = []  // 所有消息
    let that = this; 
    let url = app.globalData.baseUrl + "userMsg/queryPage.do"
    let param = {};
    if (msgState != undefined) { // 0 true
      param.msgState = msgState; // 没值为0 有值为1
    }
    app.checkToken((token) => {  
      if (token.length > 0) {
        param.token = token;   
        util.request(url, param, (resp) => {
          console.log(resp);
          if (resp.ret) { // 1
            if (msgState == 0) {  // 0 是未读
              noReadArr = resp.data; //未读消息 赋值给未读队列（空） 
              // noReadArr = [{title:'1',content:'1'}]; 
              if (resp.data && resp.data.length != 0) { 
                let len = resp.data.length - 1;
                lastMsdId = resp.data[len].userMsgId;   // 1005687
              for (let i = 0; i < noReadArr.length; i++) {  
                noReadArr[i].createTime = noReadArr[i].createTime.slice(0, 16);  //处理未读队列的创建时间 
              }
            }
              that.setData({
                noReadArr: noReadArr,  //未读队列赋值
                lastMsdId: lastMsdId,  // 1005687
              });
            } else {   // 已读 1   
              hadReadArr = resp.data; //拿到消息 队列arr  已读数组
              if (resp.data && resp.data.length != 0) {  //消息不为空
                let len = resp.data.length - 1;
                lastMsdId = resp.data[len].userMsgId;
              for (let i = 0; i < hadReadArr.length; i++) {
                hadReadArr[i].createTime = hadReadArr[i].createTime.slice(0, 16);  //处理已读队列的创建时间 
              };
            }
              that.setData({
                hadReadArr: hadReadArr,
                lastMsdId: lastMsdId,
              });
            }
          }
        });
      }
      // that.setData({
      //  readArr: that.data.hadReadArr.push.apply(that.data.hadReadArr,that.data.noReadArr)
      // })
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
      this.getMessage(0);
     this.getMessage(1);
  },

  readMessage: function (e) {
    index = e.currentTarget.dataset.index;
    console.log(this.data.noReadArr[index]);
    let readMessage = this.data.noReadArr[index]
    app.checkToken((token) => {
      if (token.length > 0) {
        let url = app.globalData.baseUrl + "userMsg/read.do"
        let param = {
          token: token,
          userMsgId: readMessage.userMsgId
        }
        util.request(url, param, (resp) => {
          if (resp.ret) {
            console.log("阅读一条消息");
          }
        });
      }
      wx.navigateTo({
        url: '../myMessage/detailMessage/detailMessage?message=' + JSON.stringify(readMessage)
      });
    });


  },

  readHadMessage: function (e) {
    console.log(this.data.hadReadArr);
    let hadReadIndex = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../myMessage/detailMessage/detailMessage?message=' + JSON.stringify(this.data.hadReadArr[hadReadIndex])
    })
  },

  statusChange: function (e) {
    let status = e.currentTarget.dataset.value;
    console.log(status);
    this.setData({
      status: status
    });
    if (status == 1) { //未读
      this.getMessage(0);
    } else {  //已读
      this.getMessage(1);
    }
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
    let status = this.data.status;
    let lastMsdId = this.data.lastMsdId; //记录每页最后的消息id
    if (status == 1) {  //未读
      this.getNextMessage(0, lastMsdId);
    } else {  //已读
      this.getNextMessage(1, lastMsdId);
    }
  },


  //得到未读的信息
  getNextMessage: function (msgState, lastMsdId) {
    let noReadArr = [];
    let hadReadArr = [];
    let that = this;
    let url = app.globalData.baseUrl + "userMsg/queryPage.do"
    let param = {
      pageNO: lastMsdId,
    };
    if (msgState != undefined) {
      param.msgState = msgState;
    }
    app.checkToken((token) => {
      if (token.length > 0) {
        param.token = token;
        util.request(url, param, (resp) => {
          if (resp.ret) {
            if (msgState == 0) {
              if (resp.data && resp.data.length == 0) {
                util.showModal_nocancel('没有更多的消息了');
                return;
              }
              noReadArr = that.data.noReadArr.concat(resp.data);
              let len = resp.data.length - 1;
              lastMsdId = resp.data[len].userMsgId;
              for (let i = 0; i < noReadArr.length; i++) {
                noReadArr[i].createTime = noReadArr[i].createTime.slice(0, 16);
              };
              that.setData({
                noReadArr: noReadArr,
                lastMsdId: lastMsdId
              });
            } else {
              if (resp.data && resp.data.length == 0) {
                util.showModal_nocancel('没有更多的消息了');
                return;
              }
              hadReadArr = that.data.hadReadArr.concat(resp.data);
              let len = resp.data.length - 1;
              lastMsdId = resp.data[len].userMsgId;
              for (let i = 0; i < hadReadArr.length; i++) {
                console.log(hadReadArr[i].createTime);
                hadReadArr[i].createTime = hadReadArr[i].createTime.slice(0, 16);
              };
              that.setData({
                hadReadArr: hadReadArr,
                lastMsdId: lastMsdId
              });
            }
          }
        });
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})