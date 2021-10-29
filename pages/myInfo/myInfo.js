let app = getApp()
let util = require('../../utils/util.js');
let appColor = require('../../utils/config.js').appColor;
Page({
  data: {
    hasMessage:false,
    items:[
      {index: 0,url:'../../images/myInfo/info1.png',title:'我的钱包'},
      {index: 1,url:'../../images/myInfo/info2.png',title:'优惠券'},
      {index: 2,url:'../../images/myInfo/info3.png',title:'会员卡'},
      {index: 3,url:'../../images/myInfo/info4.png',title:'骑行套餐'},
      {index: 4,url:'../../images/myInfo/info5.png',title:'我的消息',hasMessage:false},
      {index: 5,url:'../../images/myInfo/info6.png',title:'账单明细'},
      {index: 6,url:'../../images/myInfo/info7.png',title:'骑行记录'},
      // {index: 7,url:'../../images/myInfo/info7.png',title:'答题返充'},
    ],
    title:'我的信息',
    navHeight: 0,
    top: 0,
    stateHeight: 0,
    buttons:[{text: '取消'}, {text: '确定',extClass:'button'}],  //弹出框按钮
    dialogShow: false,
    userInfo: {},
    textColor: '',
    mainColor: '',
    headColor: '',
    isLogin: false,
    hasRead:false,
    rideCardDate: null,     
    depositDate: null,
    vipDate: null,
    version: app.globalData.version,
    fillHeader: true,
  },

  onLoad: function () {
    app.globalData.userTrack.push(['/myInfo','/我的信息']);
    let that = this
    this.setData({
      textColor: app.globalData.textColor, 
      mainColor: app.globalData.mainColor,
      headColor: app.globalData.headColor,
      phone: app.globalData.userInfo.phone,
      isNeedDeposit:app.globalData.accountId == 100197 ? false : true    // 百姓快租不需要免押
      })
  },

  onShow: function () {
    let that = this;
    let userInfo = app.globalData.userInfo;     // 全局用户信息
    console.log(userInfo);                      // 打印用户信息
    if(userInfo){                               // 如果存在
      that.infoForm(userInfo)       
      app.checkToken(function (token) {
        if (token.length > 0) {                      //that.getMsg(token);
          let user_url = app.globalData.baseUrl + "user/getByUserId.do";
          let user_param = { 
            token: token ,
          };
          if (app.globalData.adAccountId && app.globalData.adAccountId != "") {
            user_param.adAccountId = app.globalData.adAccountId
          }
          util.request(user_url, user_param, function (resp) {  //wx.hideToast();
            console.log("用户信息:" + JSON.stringify(resp));
            if (typeof resp.data != 'undefined') {
              app.globalData.userInfo = resp.data;
              that.infoForm(resp.data); 
            }
          });
        } else {                                  //wx.hideToast();
          app.globalData.userInfo = null;
          that.setData({
            isLogin: false,
          })
        }
      });
    }else{
      app.globalData.userInfo = null;
      that.setData({
        isLogin: false,
      })
    }
    this.getMesssage(0)   // 获取是否有未读消息
  },

  onUnload: function () {
    app.globalData.noRefresh = true
    console.log('myinfo卸载了 onRefresh为true');
  },

   /**
   * 获得未读消息 有显示小红点 没有显示没红点
   */
  getMesssage(msgState) {
    let url = app.globalData.baseUrl + "userMsg/queryPage.do"
    let param = {};
    if (msgState != undefined) {                                              // 0 true
      param.msgState = msgState;                                              // 没传值 也赋值给0
    }
    app.checkToken((token) => {
      if (token.length > 0) {
        param.token = token;  
        util.request(url, param, (resp) => {
          if (resp.ret) { // 1
            console.log(resp);
             if(resp.data.length > 0){
               this.setData({
                'items[4].hasMessage': true,                                  // 未读消息 红点  有就设置为true
               })   
             }else{
              this.setData({
                'items[4].hasMessage': false,                                 // 未读消息 红点  没有设置位false
               })
             }
            } 
            })
          }
      })
    },

  /**
   * 选择项目
   * @param {} e 
   */
  toWhith(e) {
   if(e.currentTarget.dataset.title == 0) {
    this.toWallet()
   } else if(e.currentTarget.dataset.title == 1) {
    this.toCoupon()
   } else if(e.currentTarget.dataset.title == 2) {
    this.toCard(2)
   } else if(e.currentTarget.dataset.title == 3) {
     this.ridePackage(0)
   } else if(e.currentTarget.dataset.title == 4) {
     this.toMyMessage()
   } else if(e.currentTarget.dataset.title == 5) {
    this.toUpDetail()
   } else if(e.currentTarget.dataset.title == 6) {
    this.usingRecord()
   } else if(e.currentTarget.dataset.title == 7) {
    this.toAnswer()
   } 
  },

  /**
   * 点击领卷中心
   * @param {*} e 
   */
  toCardCenter() {
      wx.navigateTo({
        url: `../coupon/coupon`
      });
  },

  /**
   * 点击骑行套餐
   * @param {*} e 
   */
  ridePackage (num) {
      wx.navigateTo({
        url: '../ridePackage/ridePackage?type=' + num
      });
  },

  infoForm(userInfo){
    wx.setStorageSync('nameAuth', userInfo.nameAuth)                                                // true实名 false 未实名 
    this.setData({
      isLogin: true,
    })
  },


  toLogin () {
    wx.navigateTo({
      url: '../login/login',
    })
  },
/**
   * 跳转到钱包
   */
  toWallet () {
      wx.navigateTo({
        url: `../wallet/wallet?depositState=${app.globalData.userInfo.depositState}&depositMoney=${app.globalData.userInfo.depositMoney}&actualMoney=${app.globalData.userInfo.money}`
      });
  },

  /**
   * 跳转到会员卡
   */
  toCard(num) {
      wx.navigateTo({
        url: '../membershipCard/membershipCard?type=' + num
      });
  },

    //我的消息
  toMyMessage(){
      //登录正常点击后 设置状态为已读true
      this.setData({
        hasRead:  true
      })
      wx.navigateTo({
        url:"../myMessage/myMessage"
      })
  },

    /**
     * 跳转到优惠卷页面
     */
  toCoupon(){
      wx.navigateTo({
        url: `../coupon/coupon`
      });
  },

  //充值记录 账单明细
  toUpDetail () {
      wx.navigateTo({
        url: '../historyRecharge/historyRecharge'
      });
  },

   //答题返充
   toAnswer () {
      wx.navigateTo({
        url: '../answer/answer'
      });
  },

  //骑行记录
  usingRecord () {
      wx.navigateTo({
        url: '../historyOrder/historyOrder'
      });
  },

  /**
   * 退出登录点击
   */
  exit() {
    this.setData({
      dialogShow: true
    })
  },

/**
 * 取消事件 退出登录事件 
 * @param {*} e 
 */
 tapDialogButton(e) {
   if(e.detail.index == 0){
        this.setData({
            dialogShow: false,
        })
      }else{
        wx.setStorageSync('token', '')
        app.globalData.userInfo = null;
        // app.globalData.noRefresh = false
        wx.reLaunch({
          url: '../map/map',
        })
      }
    },
})