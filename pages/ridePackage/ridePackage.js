// machineStatus.js
let app = getApp();
let util = require('../../utils/util.js');
let appColor = require('../../utils/config.js').appColor
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choose:1,
    maney: 30,
    mode: 'scaleToFill',
    src: '',
    mode: 'scaleToFill',

    setMeal: [],
    selected: null,
    money: '',
    payTip: [],  //购买须知的提示
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

  // 选择套餐
  choose(e) {
    console.log(e);
    e.currentTarget.dataset.buy = !e.currentTarget.dataset.buy
    this.setData({
      choose:e.currentTarget.dataset.choose,
      maney:e.currentTarget.dataset.choose,
    })
  },
  /**
   * 跳转会员卡
   */
  toCard() {
    wx.navigateTo({
      url: '../ridePackage/ridePackage?type=' + e.currentTarget.dataset.type
    });
  },

  // 跳转购买记录
  toHistoryRidePackage: function () {
    wx.navigateTo({
      url: './historyRidePackage/historyRidePackage?type=' + this.data.type,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let type = options.type; // 0骑行套餐；1免押套餐；2会员卡
    this.busType = type;   // 0
    let img = "", tip = [];

    console.log("options: ", options);  // 0 
    console.log("type: ", type);     // 0

    // if (type == 0) {

      // img = `${app.globalData.imagesUrl}${app.globalData.accountId}/ridePackage/qixingtaocan_image@3x.png`;

      tip = '1、购买以后不支持退款，请确认后再购买。\n 2、只能在套餐生效期间使用，逾期无效，超过最大使用次数无效。\n 3、骑行会员不支持叠加购买，需要使用完或者到期以后才能再次购买。\n 4、如果有骑行时长限制，超过以后只能使用余额支付。\n 5、如果有骑行次数限制，超过以后无效。'   // 购买须知
      wx.setNavigationBarTitle({
        title: '骑行套餐'
      })  //设置页面title 为骑行套餐

    if(options.scan == 'true'){
      this.scan = true;
    }

    this.setData({
      type,    //0骑行套餐；1免押套餐；2会员卡
      src: img,   //无
      payTip: tip, //购买须知的提示
      mainColor: app.globalData.mainColor,
      textColor: app.globalData.textColor 
    })

  },

  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (app.globalData.locationInfo){
      this.initPackage(); //获取位置
      this.initDeposit(); //如果是免押套餐
        this.initbusDes(); //拿到 购买须知的提示
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
    }else if(type == 1){  //1免押套餐
      busType = 1;
    }else if(type == 2){  //1免押套餐；2会员卡
      busType = 3;
    }
    console.log(busType); //2
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
            payTip:res.data.des  //拿到 购买须知的提示
          });
        }
      })
    })
  
  },

  //如果是免押套餐
  initDeposit: function(){
    // if (this.data.type == 1){ //如果是免押套餐
    //   if (!app.globalData.locationInfo) {
    //     wx.showModal({
    //       title: '温馨提示',
    //       content: '无法获取位置',
    //       showCancel: false,
    //       complete() {
    //         wx.navigateBack();
    //       }
    //     })
    //     return;
    //   }
    //   app.checkToken((token) => {
    //     if (token.length > 0) {
    //       let url = app.globalData.baseUrl + "adAccountDeposit/getByLocation.do";
    //       let param = {
    //         accountId: app.globalData.accountId,
    //         lo: app.globalData.locationInfo.longitude,
    //         la: app.globalData.locationInfo.latitude,
    //         mapType: 2,
    //         token
    //       }
    //       util.request(url, param, (res) => {
    //         if (res.ret) {
    //           let deposit = '';
    //           let depositMoney = 0;
    //           if (res.data.depositMoney != 0 || res.data.useDeposit != 0) {
    //             switch (Number(res.data.depositStatus)) {
    //               case 0:
    //                 deposit = '押金';
    //                 depositMoney = (res.data.depositMoney / 100).toFixed(2);
    //                 break;
    //               case 1:
    //                 deposit = '已交押金';
    //                 depositMoney = (res.data.useDeposit / 100).toFixed(2);
    //                 break;
    //               case 2:
    //                 deposit = '押金退还中';
    //                 break;
    //               case 3:
    //                 deposit = '芝麻信用';
    //                 break;
    //               case 4:
    //                 deposit = '押金冻结';
    //                 break;
    //               case 5:
    //                 deposit = '学生认证免押';
    //                 break;
    //               case 6:
    //                 let m = Number(res.data.depositMoney) - Number(res.data.useDeposit);
    //                 deposit = '押金不足,请补交';
    //                 depositMoney = (m / 100).toFixed(2);
    //                 break;
    //             }
    //           }
    //           this.setData({
    //             deposit: deposit,
    //             depositMoney: depositMoney,
    //             depositState: res.data.depositStatus
    //           })
    //         } else if (res.code == '-3050') {

    //         }
    //       })
    //     }
    //   })
    // }
  },

  //退还押金
  // returnDeposit: function () {
  //   let that = this;
  //   app.checkToken(function (token) {
  //     if (token.length > 0)
  //       wx.showModal({
  //         title: '提示',
  //         content: '押金退还时间为1-3个工作日，在此期间无法用车，是否仍然退押金？',
  //         success: function (res) {
  //           if (res.confirm) {
  //             let url = app.globalData.baseUrl + "returnDeposit/apply.do";
  //             let param = { token: token };
  //             util.request(url, param, function (resp) {
  //               if (resp) {
  //                 util.showModal('请留意微信通知!');
  //                 that.initDeposit();
  //               }

  //             })
  //           }
  //         }
  //       })
  //   });
  // },

  // 获取位置
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
        } 
        // else if (that.data.type == 1) { // 免押套餐
        //   ridePackage_url = app.globalData.baseUrl + "memberFee/findMemberFee.do";
        // } else if (that.data.type == 2) { // 会员卡
        //   ridePackage_url = app.globalData.baseUrl + "vipCard/queryPage.do";
        // }

        util.request(ridePackage_url, ridePackage_param, function (resp) {
          wx.hideToast();
          if (resp.ret && resp.data.length != 0) {
            that.adAccountId = resp.data[0].accountId;
            that.setData({
              money: (Number(resp.data[0].money) / 100).toFixed(2),
              setMeal: resp.data, //设置套餐
            })
            console.log(that.data);
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
  // select: function (e) {
  //   let that = this;
  //   let selected = e.currentTarget.dataset.selected;
  //   let money = e.currentTarget.dataset.money;
  //   let btnText = ''
  //   //let item = e.currentTarget.dataset.item;
  //   if(selected == -2){
  //     btnText = '缴付'
  //   }else{
  //     btnText = '开通'
  //   }
  //   that.setData({
  //     selected: selected,
  //     money: money,
  //     isSelect: true,
  //     btnText: btnText
  //   })

  // },




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
  //支付
  // auth: function (money) {
  //   // if (this.data.setMeal.length == 0 || !this.data.selected) {
  //     if (this.data.maney.length == 0 || !this.data.choose) {
  //     return;
  //   }
  //   let that = this;
  //   wx.showToast({
  //     title: '请稍候...',
  //     icon: 'loading',
  //     mask: true,
  //     duration: 2000
  //   })
  //   let token = app.checkToken(function (token) {
  //     if (token.length > 0)
  //       wx.login({
  //         success: function (res) {
  //           if (res.code) {
  //             let order_url = app.globalData.baseUrl + "weixinPay/createMemberOrder_weixin.do";
  //             let order_param = {
  //               token: token,
  //               code: res.code,
  //               adAccountId: that.adAccountId
  //             };
  //             // if (that.data.type == 0) {
  //             //   order_url = app.globalData.baseUrl + "weixinPay/createRideCardOrder_weixin.do";
  //             //   order_param.rideCardId = that.data.selected;
  //             //   //order_param.adAccountId = that.adAccountId;
  //             // }else
  //             //   order_param.memberFeeId = that.data.selected;

  //             // if (that.data.selected == -2){
  //             //   order_url = app.globalData.baseUrl + "weixinPay/createOrder_weixin.do";
  //             //   order_param.deposit = true;
  //             // }

  //             let order_url = "",
  //                 order_param = {
  //                   token: token,
  //                   code: res.code,
  //                   adAccountId: that.adAccountId
  //                 };
              
            
  //               order_url = app.globalData.baseUrl + "weixinPay/createRideCardOrder_weixin.do";
  //               order_param.rideCardId = that.data.selected;

  //             util.request(order_url, order_param, function (resp) {
  //               let data = JSON.parse("\{" + resp.data.replace(/'/g, '\"') + "\}");
  //               wx.requestPayment({
  //                 'timeStamp': data.timeStamp,
  //                 'nonceStr': data.nonceStr,
  //                 'package': data.package,
  //                 'signType': 'MD5',
  //                 'paySign': data.paySign,
  //                 'success': function (res) {

  //                   console.log(res);
  //                   let msg = res.errMsg.split(':')[1];
  //                   if (msg == 'ok') {
  //                     wx.showToast({
  //                       title: '支付成功！',
  //                       icon: 'success',
  //                       duration: 3000
  //                     })
  //                     setTimeout(() => {
  //                       wx.navigateBack({
  //                         delta: 1
  //                       })
  //                     }, 2000)
  //                   }

  //                 },
  //                 'fail': function (res) {
  //                   console.info("fail res: ", res);
  //                   // 支付失败大致分两种情况：
  //                   // 1.在支付界面，用户取消支付（errMsg为requestPayment:fail cancel）
  //                   // 2.在支付界面，用户点击支付但失败了（errMsg为requestPayment:fail (detail message)）
  //                   // 情况1无需弹出报错提示
  //                   let error = res.errMsg.split(':')[1];
  //                   if (error !== "fail cancel") {
  //                     // 情况2
  //                     wx.showToast({
  //                       title: error,
  //                       icon: 'none',
  //                       duration: 2000
  //                     });
  //                   } else {
  //                     // 情况1
  //                     console.log("用户取消支付");
  //                   }
  //                 }
  //               })
  //             })

  //           }
  //         }
  //       })
  //   });

  // },

  valuationRule: function () {
    let that = this;
    wx.navigateTo({
      url: '../valuationRule/valuationRule?machineNO=' + that.data.machineNO,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})