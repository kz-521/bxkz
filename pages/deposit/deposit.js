//认证界面
//获取应用实例
let app = getApp();
let util = require('../../utils/util.js');
let appColor = require('../../utils/config.js').appColor
Page({
  data: {
    money: 0,
    userInfo: {},
    disabled: false, 
    mainColor: '',
    textColor: '',
    isFreeDeposit:"",
    freeDepositTip:'我要免押金',
    isFreeDepositing:false
  },
  onShow:function(){
    let self = this;
    app.getDeposit((res) => {
      console.log(res.depositStatus,'这是押金');
      self.setData({
        isFreeDeposit:res.wxZffDeposit == 1 ? true : false
      });
        if(res.depositStatus == 8){
          self.setData({
            isFreeDepositing :true
          });
        }else{
          self.setData({
            isFreeDepositing : false
          });
        }
        if(app.globalData.isFreeDeposit && self.data.isFreeDepositing){
          this.setData({
            freeDepositTip:"我要取消免押"
          });
        }else{
          self.setData({
            freeDepositTip:"我要免押金"
          });
        };
    });
  },
  onLoad: function (options) {
    this.setData({
      mainColor: app.globalData.mainColor,
      textColor: app.globalData.textColor,
      isFreeDeposit:app.globalData.isFreeDeposit
    })
    let that = this
    let money = (Number(options.money) / 100).toFixed(2);
    this.adAccountId = options.adAccountId;
    if (app.globalData.adAccountId && app.globalData.adAccountId.length != 0) {
      this.adAccountId = app.globalData.adAccountId;
    }
    // if (this.adAccountId === undefined){
    //   this.adAccountId = app.globalData.adAccountId;
    // }
    //调用应用实例的方法获取全局数据
   // app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        //userInfo: userInfo,
        money: money,
      })
    //})
  },
  deposit: function () {
    console.log(this.data.isFreeDepositing);
    if(this.data.isFreeDepositing){
      util.showModal_nocancel('您已经授权免押,无需缴纳押金');
      return;
    }
    let that = this;
    /*that.setData({
      disabled: true
    })*/
    wx.showToast({
      title: '请稍候...',
      icon: 'loading',
      mask: true,
      duration: 15000
    })
    app.checkToken(function (token) {
      if (token.length > 0)
        wx.login({
          success: function (res) {
            if (res.code) {
              console.log(res.code);
              let order_url = app.globalData.baseUrl + "weixinPay/createOrder_weixin.do";
              let order_param = { token: token, deposit: true, code: res.code };
              if (app.globalData.adAccountId && app.globalData.adAccountId.length != 0) {
                order_param.adAccountId = app.globalData.adAccountId;
              }
              util.request(order_url, order_param, function (resp) {
             //   console.info("order_param", order_param);
                let data = JSON.parse("\{" + resp.data.replace(/'/g, '\"') + "\}");
                wx.hideToast();
                wx.requestPayment(
                  {
                    'timeStamp': data.timeStamp,
                    'nonceStr': data.nonceStr,
                    'package': data.package,
                    'signType': 'MD5',
                    'paySign': data.paySign,
                    'success': function (res) {
                      wx.navigateBack({
                        delta: 1,
                        success: function (res) {
                          // success
                        },
                        fail: function () {
                          // fail
                        },
                        complete: function () {
                          // complete
                        }
                      })
                    },
                    'fail': function (res) { }
                  })
              })

            }
          }
        })
    });

  },
  
  freeDeposit: function () {
    var that = this;
    app.checkToken((token) => {
      if (token.length > 0) {
        let url = app.globalData.baseUrl + 'payPoint/leadData.do';
        let param = {
          token: token,
        };
        wx.request({
          url: url,
          data:param,
          success(res){
            console.log(res);
            if (res.data.ret) {
              if(wx.openBusinessView){
                wx.openBusinessView({
                  businessType: 'wxpayScoreEnable',
                    extraData: {
                      mch_id: res.data.data.mch_id, //商户id
                      service_id: res.data.data.service_id, //服务id
                      out_request_no: res.data.data.out_request_no, //调用授权服务接口提交的商户请求唯一标识
                      timestamp: res.data.data.timestamp,  //时间戳
                      nonce_str: res.data.data.nonce_str, //生成签名随机串
                      sign_type: res.data.data.sign_type, //签名类型  仅支持
                      sign: res.data.data.sign //得到的签名值
                    },
                    success(res) {
                      console.log('已经成功跳转到支付分小程序',res)
                    //  wx.hideLoading();
                    },
                    fail(err) {
                      console.log('fail');
                    },
                    complete() {
                    }
                })
              }else{
              //引导用户升级微信版本
                wx.showModal({
                  title: '温馨提示',
                  content: '微信版本过低，请升级微信',
                  showCancel: false
                });
              }
            } else {
               util.showModal_nocancel('服务器错误，请联系客服');
            }
          },
          fail(err){
            console.log(err);
          }
        })
      }
    })
  
  },
})