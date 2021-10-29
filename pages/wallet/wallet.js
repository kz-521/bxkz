let app = getApp()
let util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalMoney: Number(0).toFixed(0),
    actualMoney: Number(0).toFixed(0),
    cardMoney: Number(0).toFixed(0),
    deposit: '',
    depositState: -1, 
    textColor: '',
    mainColor: '',
    showInput: false,
    cardNO: "",
    isFreeDeposit:"",
  },

  inputCtrl: function () {
    this.setData({
      showInput: !this.data.showInput
    })
  },

  closeCard() {
this.setData({
  showInput: false
})
  },
  toRecharge() {
    wx.navigateTo({
      url: '../recharge/recharge',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isFreeDeposit:app.globalData.isFreeDeposit,
      textColor: app.globalData.textColor,
      mainColor: app.globalData.mainColor,
    })
    this.depositState = options.depositState;
    this.useDeposit = options.depositMoney;
    this.actualMoney = options.actualMoney;
  },

  onShow: function(){
    this.depositState = app.globalData.userInfo.depositState;
    this.useDeposit = app.globalData.userInfo.depositMoney;
    this.actualMoney = app.globalData.userInfo.money;
    if (app.globalData.locationInfo) {
      this.depositFormat();
    } else {
      app.getLocationInfo('gcj02', (res) => {
        this.depositFormat();
      })
    }
  },

  inputCtrl: function () {
    this.setData({
      showInput: !this.data.showInput
    })
  },

  inputCardNO: function(e){
    var value = e.detail.value
    if(Number(e.detail.value)) {
      this.setData({
        cardNO: value
      })
    }else {
      value = ''
    }
    return {                   //  return
      value : value  
    }
  },
  
  exchange: function(){
    let cardNO = this.data.cardNO;
    if(cardNO.length == 0){
      wx.showToast({
        title: '请输入卡券号码',
        icon: 'none'
      })
      return;
    }
    app.checkToken((token) =>{
      if(token.length > 0){
        let url = app.globalData.baseUrl + "giftCard/exchange.do";
        let param = {
          cardNO,
          token
        }
        util.request(url,param,(res) => {
          if(res.ret){
            console.log(res.data);
            wx.showToast({
              title: '兑换成功！',
              icon: 'none',
              duration: 3000
            })
            this.inputCtrl();
            this.getGiftCard();
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

  depositFormat: function(){
    if (!app.globalData.locationInfo) {
      util.showModal_nocancel('无法获取位置', () => {
        wx.navigateBack({
        })
      })
      return;
    }
    this.getDeposit((res) => {
      this.depositMoney = res ? res.depositMoney : 0;
      this.useDeposit = res && res.useDeposit != 0 ? res.useDeposit : this.useDeposit;
      this.adAccountId = res ? res.accountId : '';
      // this.depositState = res && this.depositState == 0 ? res.depositStatus : this.depositState;
      this.depositState = res.depositStatus;
      this.actualMoney = res && res.actualMoney != 0 ? res.actualMoney : this.actualMoney;
      let deposit = '';
      console.log((this.depositMoney / 100).toFixed(2),this.depositState);
      if (this.depositMoney != 0 || this.useDeposit !=0){
        switch (Number(this.depositState)) {
          case 0:
            deposit = '押金' + (this.depositMoney / 100).toFixed(2) + '元';
            break;
          case 1:
            deposit = '已交' + (this.useDeposit / 100).toFixed(2) + '元押金';
            break;
          case 2:
            deposit = '押金退还中';
            break;
          case 3:
            deposit = '芝麻信用';
            break;
          case 4:
            deposit = '押金冻结';
            break;
          case 5:
            deposit = '学生认证免押';
            break;
          case 6:
            let m = Number(this.depositMoney) - Number(this.useDeposit);
            deposit = '押金不足,请补交' + (m / 100).toFixed(2) + "元";
            this.depositMoney = m;
            break;
          case 7:
            deposit = '';
            break;
          case 8:
            deposit = '免押中';
            break;
        }
      }
      this.setData({
        depositState: this.depositState,
        deposit,
        actualMoney: (Number(this.actualMoney) / 100).toFixed(2),
        cardMoney: (Number(res ? res.cardMoney : 0) / 100).toFixed(2),
        totalMoney: (Number(res && res.totalMoney != 0 ? res.totalMoney : this.actualMoney) / 100).toFixed(2)
      });
    //  console.log(this.data.isFreeDeposit,this.data.depositState,this.data.deposit);
    })
  },

  // 余额明细
  walletDetail() {
    wx.navigateTo({
      url: '../historyRecharge/historyRecharge'
    });
  },

  // 点击充值 跳转充值页面 
  recharge: function () {
    wx.navigateTo({
      url: `../recharge/recharge`
    });
  },

  //押金
  toDeposit: function(){
    wx.navigateTo({
      url: '../deposit/deposit?money=' + this.depositMoney + '&adAccountId=' + this.adAccountId
    })
  },

  toRecord: function(){
    wx.navigateTo({
      url: './record/record',
    })
  },

  //退还押金
  returnDeposit: function () {
    let that = this;
    app.checkToken(function (token) {
      if (token.length > 0)
        wx.showModal({
          title: '提示',
          content: '押金退还时间为1-3个工作日，在此期间无法用车，是否仍然退押金？',
          success: function (res) {
            if (res.confirm) {
              let url = app.globalData.baseUrl + "returnDeposit/apply.do";
              let param = { token: token };
              util.request(url, param, function (resp) {
                if (resp) {
                  util.showModal_nocancel('请留意微信通知');
                  // that.setData({
                  //   deposit: ''
                  // })
                  that.useDeposit = 0;
                  that.depositFormat();
                }

              })
            }
          }
        })
    });
  },

  //获取押金
  getDeposit: function (cb) {
    console.log("--------- getDeposit() -------");
    app.checkToken((token) => {
      if (token.length > 0) {
        let url = app.globalData.baseUrl + "adAccountDeposit/getByLocation.do";
        console.log("请求url:" + url);
        let param = {
          accountId: app.globalData.accountId,
          lo: app.globalData.locationInfo.longitude,
          la: app.globalData.locationInfo.latitude,
          mapType: 2,
          token
        }
        util.request(url, param, (res) => {
          if (res.ret) {
            console.log(res.data);
            cb && cb(res.data);
          }else if(res.code == '-3050'){
            cb && cb(false);
          }
        })
      }
    })
  },

  getGiftCard: function(){
    console.log("---------- getGiftCard() --------");
    app.checkToken((token) => {
      if(token.length > 0){
        let url = app.globalData.baseUrl + "giftCardUser/getByLocation.do";
        console.log("请求url:" + url);
        
        let param = {token};

        if (app.globalData.adAccountId) {
          param.adAccountId = app.globalData.adAccountId;
        } else {
          param.accountId = app.globalData.accountId;
          param.lo = app.globalData.locationInfo.longitude;
          param.la = app.globalData.locationInfo.latitude;
          param.mapType = 2;
        }

        util.request(url, param, (res) => {
          console.log(res);
          // this.setData({
          //   cardMoney: (Number(res.data.money) / 100).toFixed(2)
          // })
          this.depositFormat();
        })
      }
    })
  }

})