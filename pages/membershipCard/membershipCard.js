// pages/membershipCard/membershipCard.js
let app = getApp();
let util = require('../../utils/util.js');
let appColor = require('../../utils/config.js').appColor
Page({
  /**
   * 页面的初始数据
   */
  data: {
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    mode: 'scaleToFill',
    src: '',
    mode: 'scaleToFill',
    setMeal: [],
    selected: null,
    money: '',
    payTip: [],
    balance: '',
    type: 0,
    isSelect: false, 
    mainColor: '',
    textColor: '',
    btnText: '开通',
    deposit: '',
    depositMoney: 0, //押金
    depositState: -1,
  },

  toHistoryRidePackage: function () {
    wx.navigateTo({
      url: './historyRidePackage/historyRidePackage?type=' + this.data.type,
    })
  },

  /**
   * 开通会员卡按钮
   * @param {*} options 
   */
  pay() {
    console.log("开通了会员卡");
  },

  /**
   * 生命周期函数--监听页面加载
   */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.type);
    let type = options.type; // 0骑行套餐；1免押套餐；2会员卡
    this.busType = type; // 2 
    let img = "", tip = [];
    console.log("options: ", options);
    console.log("type: ", type);
      img = `${app.globalData.imagesUrl}${app.globalData.accountId}/ridePackage/huiyuanka_image@3x.png`;
      tip = '1、会员卡一经购买，即时生效。\n 2、会员折扣在会员有效期间生效，逾期无效。\n 3、购买以后不支持退款，请确认后再购买。\n 4、支持重复购买会员卡，折扣按当时购买的计算。'
      wx.setNavigationBarTitle({
        title: '会员卡'
      })
    if(options.scan == 'true'){
      this.scan = true;
    }

    this.setData({
      type,
      src: img,
      payTip: tip,
      mainColor: app.globalData.mainColor,
      textColor: app.globalData.textColor
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (app.globalData.locationInfo){
      this.initPackage();
      this.initDeposit();
        this.initbusDes();
    }else{
      app.getLocationInfo('gcj02',(res)=>{
        this.initPackage();
        this.initDeposit();
        this.initbusDes();

      })
    }
  },
  initbusDes:function(){
    let busType = '';
    let type = this.busType; // 前端和后台一开始没有定义好，需要转化一下
    console.log(type);
    if(type == 0){  //前端骑行套餐  后台对应的是 2
      busType = 2;
    }else if(type == 1){
      busType = 1;
    }else if(type == 2){
      busType = 3;
    }
    console.log(busType);
    let url = app.globalData.baseUrl + "busDes/getByAccountId.do";
    let param = {
      accountId: app.globalData.adAccountId,
      busType:busType
    };
    app.checkToken(token=>{
      if(token.length > 0){
        param.token = token;
      }
      util.request(url,param,(res)=>{
        console.log(res);
        if(res.ret && res.data){
          console.log(res.data.des,"00000000000");
          this.setData({
            payTip:res.data.des
          });
        }
      })
    })
  
  },

  initDeposit: function(){
    if (this.data.type == 1){
      if (!app.globalData.locationInfo) {
        wx.showModal({
          title: '温馨提示',
          content: '无法获取位置',
          showCancel: false,
          complete() {
            wx.navigateBack();
          }
        })
        return;
      }
      app.checkToken((token) => {
        if (token.length > 0) {
          let url = app.globalData.baseUrl + "adAccountDeposit/getByLocation.do";
          let param = {
            accountId: app.globalData.accountId,
            lo: app.globalData.locationInfo.longitude,
            la: app.globalData.locationInfo.latitude,
            mapType: 2,
            token
          }
          util.request(url, param, (res) => {
            if (res.ret) {
              let deposit = '';
              let depositMoney = 0;
              if (res.data.depositMoney != 0 || res.data.useDeposit != 0) {
                switch (Number(res.data.depositStatus)) {
                  case 0:
                    deposit = '押金';
                    depositMoney = (res.data.depositMoney / 100).toFixed(2);
                    break;
                  case 1:
                    deposit = '已交押金';
                    depositMoney = (res.data.useDeposit / 100).toFixed(2);
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
                    let m = Number(res.data.depositMoney) - Number(res.data.useDeposit);
                    deposit = '押金不足,请补交';
                    depositMoney = (m / 100).toFixed(2);
                    break;
                }
              }
              this.setData({
                deposit: deposit,
                depositMoney: depositMoney,
                depositState: res.data.depositStatus
              })
            } else if (res.code == '-3050') {
            }
          })
        }
      })
    }
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
                  util.showModal('请留意微信通知!');
                  that.initDeposit();
                }

              })
            }
          }
        })
    });
  },

  initPackage: function(){
    if (!app.globalData.locationInfo){
      wx.showModal({
        title: '温馨提示',
        content: '无法获取位置',
        showCancel: false,
        complete() {
          wx.navigateBack();
        }
      })
      return;
    }

    if (!app.globalData.adAccountId) {
      wx.showModal({
        title: '温馨提示',
        content: '不在运营区域内',
        showCancel: false,
        complete() {
          wx.navigateBack();
        }
      })
      return;
    }

    let that = this;

    app.checkToken(function (token) {
      //获取骑行套餐
      if (token.length > 0) {

        wx.showToast({
          title: '正在加载',
          icon: 'loading',
          mask: true,
          duration: 15000
        })

        let ridePackage_url = "",
            ridePackage_param = {
              pageNO: 1,
              rowCount: 50,
              adAccountId: app.globalData.adAccountId,
              token: token,
            };

        if (that.data.type == 0) { // 骑行套餐
          ridePackage_url = app.globalData.baseUrl + "rideCard/queryPage.do";
        } else if (that.data.type == 1) { // 免押套餐
          ridePackage_url = app.globalData.baseUrl + "memberFee/findMemberFee.do";
        } else if (that.data.type == 2) { // 会员卡
          ridePackage_url = app.globalData.baseUrl + "vipCard/queryPage.do";
        }

        util.request(ridePackage_url, ridePackage_param, function (resp) {
          wx.hideToast();
          if (resp.ret && resp.data.length != 0) {
            that.adAccountId = resp.data[0].accountId;
            that.setData({
              money: (Number(resp.data[0].money) / 100).toFixed(2),
              setMeal: resp.data,
            })
            // if (that.data.type == 0) {
            //   that.setData({
            //     money: resp.data[0].money,
            //     setMeal: resp.data,
            //   })
            // } else {
            //   that.setData({
            //     money: resp.data[0].money,
            //     setMeal: resp.data,
            //   })
            // }
          } else {
            that.setData({
              isSelect: false
            })
            wx.showModal({
              title: '温馨提示',
              content: '该套餐暂未开设',
              showCancel: false,
              complete() {
                wx.navigateBack();
              }
            })
          }
        });
      }
    });
  },

  select: function (e) {

    let that = this;
    let selected = e.currentTarget.dataset.selected;
    let money = e.currentTarget.dataset.money;
    let btnText = ''
    //let item = e.currentTarget.dataset.item;
    if(selected == -2){
      btnText = '缴付'
    }else{
      btnText = '开通'
    }
    that.setData({
      selected: selected,
      money: money,
      isSelect: true,
      btnText: btnText
    })

  },

  //支付
  auth: function (money) {
    if (this.data.setMeal.length == 0 || !this.data.selected) {
      return;
    }
    let that = this;
    wx.showToast({
      title: '请稍候...',
      icon: 'loading',
      mask: true,
      duration: 2000
    })
    let token = app.checkToken(function (token) {
      if (token.length > 0)
        wx.login({
          success: function (res) {
            if (res.code) {
              // let order_url = app.globalData.baseUrl + "weixinPay/createMemberOrder_weixin.do";
              // let order_param = {
              //   token: token,
              //   code: res.code,
              //   adAccountId: that.adAccountId
              // };
              // if (that.data.type == 0) {
              //   order_url = app.globalData.baseUrl + "weixinPay/createRideCardOrder_weixin.do";
              //   order_param.rideCardId = that.data.selected;
              //   //order_param.adAccountId = that.adAccountId;
              // }else
              //   order_param.memberFeeId = that.data.selected;

              // if (that.data.selected == -2){
              //   order_url = app.globalData.baseUrl + "weixinPay/createOrder_weixin.do";
              //   order_param.deposit = true;
              // }

              let order_url = "",
                  order_param = {
                    token: token,
                    code: res.code,
                    adAccountId: that.adAccountId
                  };
              
              if (that.data.type == 0) {
                order_url = app.globalData.baseUrl + "weixinPay/createRideCardOrder_weixin.do";
                order_param.rideCardId = that.data.selected;
              } else if (that.data.type == 1) {
                order_url = app.globalData.baseUrl + "weixinPay/createMemberOrder_weixin.do";
                order_param.memberFeeId = that.data.selected;
              } else if (that.data.type == 2) {
                order_url = app.globalData.baseUrl + "weixinPay/createVipOrder_weixin.do";
                order_param.vipId = that.data.selected;
              }

              if (that.data.selected == -2){
                order_url = app.globalData.baseUrl + "weixinPay/createOrder_weixin.do";
                order_param.deposit = true;
              }

              util.request(order_url, order_param, function (resp) {
                let data = JSON.parse("\{" + resp.data.replace(/'/g, '\"') + "\}");
                wx.requestPayment({
                  'timeStamp': data.timeStamp,
                  'nonceStr': data.nonceStr,
                  'package': data.package,
                  'signType': 'MD5',
                  'paySign': data.paySign,
                  'success': function (res) {

                    console.log(res);
                    let msg = res.errMsg.split(':')[1];
                    if (msg == 'ok') {
                      wx.showToast({
                        title: '支付成功！',
                        icon: 'success',
                        duration: 3000
                      })
                      setTimeout(() => {
                        wx.navigateBack({
                          delta: 1
                        })
                      }, 2000)
                    }

                  },
                  'fail': function (res) {
                    console.info("fail res: ", res);
                    // 支付失败大致分两种情况：
                    // 1.在支付界面，用户取消支付（errMsg为requestPayment:fail cancel）
                    // 2.在支付界面，用户点击支付但失败了（errMsg为requestPayment:fail (detail message)）
                    // 情况1无需弹出报错提示
                    let error = res.errMsg.split(':')[1];
                    if (error !== "fail cancel") {
                      // 情况2
                      wx.showToast({
                        title: error,
                        icon: 'none',
                        duration: 2000
                      });
                    } else {
                      // 情况1
                      console.log("用户取消支付");
                    }
                  }
                })
              })

            }
          }
        })
    });

  },

  valuationRule: function () {
    let that = this;
    wx.navigateTo({
      url: '../valuationRule/valuationRule?machineNO=' + that.data.machineNO,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
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