// pages/faceDistinguish/startFetch/startFetch.js
const app = getApp();
const util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainColor: '#81be48' ,
    textColor: '#000000' ,
    machineNO:"",
    userName:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mainColor: app.globalData.mainColor ,
      textColor: app.globalData.textColor 
    });
    
    let machineNO = options.machineNO;
    let userInfo = app.globalData.userInfo;
    let userName = "";
    if(userInfo.name){
      userName =  this.formatStr(userInfo.name);
      this.setData({
        userName
      });
    }else{
      util.showModal("您还未进行实名验证，是否前去验证",()=>{
        wx.navigateTo({
          url: '../authentication/authentication',
        })
      });
    }
    this.setData({
      machineNO
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
formatStr:  function (str) {
    return str.substring(0,1) + new Array(str.length).join('*')
  },

  startRecog:function(){
    wx.redirectTo({
      url: './faceRecognizing/faceRecognizing',
    })
  },
  cancel:function(){
     wx.navigateBack({
       delta: 1
     });
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

})