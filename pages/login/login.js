let util = require('../../utils/util.js')
let app = getApp()
Page({

  data: {
    src: `${app.globalData.imagesUrl}${app.globalData.accountId}/login/bg.png`,
    mode: 'scaleToFill',
    authCodeBtn: '获取验证码',
    phone: "",
    timer: null,
    disabled: true,
    display: false,
    mainColor: '',
    textColor: '',
    isWXLogin: true,
    loginCount: 0,
    confirmText: 3,
    showRetry: false,
    hideDialogBackground: true,
    secretDetail: null
  },

  /**
   * 登录 拿到loginCode 置空 拿到mainColor 和 textColor 取信息
   * @param {*} options 
   */
  onLoad: function(options){
    app.globalData.noRefresh = false
    this.getLoginCode()
    this.unknowUrl = null
    this.type = null
    this.setData({
      mainColor: app.globalData.mainColor || wx.getStorageSync('mainColor'), 
      textColor: app.globalData.textColor || wx.getStorageSync('textColor')
    })
    console.log(app.globalData.mainColor,'---');
    console.log(wx.getStorageSync('mainColor'));
    this.baseUrl = app.globalData.baseUrl || wx.getStorageSync('baseUrl')
    if(options.unknowUrl){
      this.unknowUrl = options.unknowUrl
    }
    if(options.type){
      this.type = options.type
    }
  },

  onUnload: function() {
    clearInterval(this.data.setInterval1)
  },

  /**
   * 微信授权登录 改变登录方式 isWXLogin取反 disabled 取反做判断条件
   */
  changeLoginType: function () {
    this.setData({
      isWXLogin: !this.data.isWXLogin,
      // phone: '',
      disabled: true,
    })
  },

  //获取手机号 失败返回
  getPhoneNumber:  function (e) {
    console.log(e);
    let that = this 
    let time = 0 
   that.data.setInterval1 = setInterval(function() {
      time = time + 1
      if(time < 2){
        return 
      }
    },1000)
    if (e.detail.errMsg.indexOf('ok') > -1) {
      that.wxLogin(e.detail)
    } 
  },

  /**
   * 获取登录 某个状态码
   */
  getLoginCode() {
    let that = this
    // 微信开放登陆接口
    wx.login({
      success (res) {
        if (res.code) {
          console.log("*** loginCode: ", res.code)
          that.loginCode = res.code
        } else {
          console.log('*** 登录失败！' + res.errMsg)
        }
      }
    })
  },

  cancelTip: function(){
    this.setData({
      showRetry: false,
    })
    setTimeout(()=>{
      this.setData({
        hideDialogBackground: false,
        confirmText: 3,
      })
    },300)//与动画同步，设置定时器
  },

  /**
   * 没有调用
   */
  retry: function(){
    if(this.data.confirmText == '重试'){
      this.wxLogin(this.data.secretDetail)
      this.cancelTip();
    }
  },

  /**
   * 点击用户协议 跳转用户协议
   */
  toAgreement: function(){
    wx.navigateTo({
      url: '../agreement/agreement',
    })
  },

  dialogCount: function(){
    let count = this.data.confirmText;
    count = Number(count);
    if(!isNaN(count)){
      if(count>0){
        setTimeout(()=>{
          this.setData({
            confirmText: --count
          })
          this.dialogCount();
        },1024)
      }else{
        this.setData({
          confirmText: '重试'
        })
      }
    }
  },

  wxLogin: function(detail) {
    console.log("***getPhoneNumb er detail: ", detail)
    wx.showToast({
      title: '登录中',
      icon: 'loading',
      mask: true,
      duration: 15000
    })
    setTimeout(() => {
      if (!this.hadLogined) {
        wx.showToast({
          title: '服务器未响应',
          icon: 'none'
        })
      }
      this.getLoginCode();
    }, 16000);
      console.log(this.loginCode,'获取来的code');
    if (!this.loginCode) {
      console.log("*** wx.login失败")
      return;
    }
    let url = this.baseUrl + 'user/wxLogin.do';
    let param = {
      accountId: app.globalData.accountId,
      code: this.loginCode,
      encryptedData: detail.encryptedData,
      iv: detail.iv,
      mapType: 2
    }
    let locationInfo = app.globalData.locationInfo;
    if (locationInfo && locationInfo.longitude && locationInfo.latitude) {
      param.lon = locationInfo.longitude;
      param.lat = locationInfo.latitude;
      wx.request({
        url: url,
        data: param,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: res => {
          this.hadLogined = true;
          res = res.data;
          if (res.ret) {
            app.getAdAccountId();
            console.log(res.data,res);
            wx.setStorageSync('token', res.data.token);
            app.globalData.userInfo = res.data;
            wx.hideToast();
            if (this.unknowUrl) {
              if (this.type) {
                wx.redirectTo({
                  url: this.unknowUrl + "?type=" + this.type,
                })
              } else {
                wx.redirectTo({
                  url: this.unknowUrl,
                })
              }
            } else {
              if (!res.data.nameAuth && app.globalData.pushNameAuth == 1) {
                wx.redirectTo({
                  url: '../authentication/authentication',
                })
              } else {
                if (app.globalData.autoAction == 'scan')
                  app.globalData.autoAction = 'auto'
  
                wx.navigateBack({
                  delta: 2
                });
              }
            }
          } else if(res.code == "-1005"){
            wx.hideToast();
            wx.showModal({
              title: '温馨提示',
              content: '小程序授权登录失败，请稍候重试！',
              showCancel: false,
              success: (res)=>{
                if(res.confirm){
                  
                }
              }
            })
          } else {
            wx.hideToast();
            console.log(res);
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        },
        fail: err => {
          wx.hideToast();
          console.log('登录失败', err);
          let content = '';
          if (err.errMsg == "request:fail timeout") {
            content = "登录失败：请求超时";
          } else if (err.errMsg == "request:fail url not in domain list") {
            content = "登录失败：获取配置信息失败，请重新进入小程序";
          } else {
            content = "登录失败";
          }
          wx.showModal({
            title: '温馨提示',
            content,
            showCancel: false
          })
        }
      })

    } else {
      app.getLocationInfo('gcj02',(res) => {
        console.log("*** 重新获取定位：", res);
        param.lon = res.longitude;
        param.lat = res.latitude;

        wx.request({
          url: url,
          data: param,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: res => {
            this.hadLogined = true;
            res = res.data;
            if (res.ret) {
              app.getAdAccountId();
    
              console.log(res.data);
              wx.setStorageSync('token', res.data.token);
              app.globalData.userInfo = res.data;
              wx.hideToast();
              if (this.unknowUrl) {
                if (this.type) {
                  wx.redirectTo({
                    url: this.unknowUrl + "?type=" + this.type,
                  })
                } else {
                  wx.redirectTo({
                    url: this.unknowUrl,
                  })
                }
              } else {
                if (!res.data.nameAuth && app.globalData.pushNameAuth == 1) {
                  wx.redirectTo({
                    url: '../authentication/authentication',
                  })
                } else {
                  if (app.globalData.autoAction == 'scan')
                    app.globalData.autoAction = 'auto'
    
                  wx.navigateBack({
                    delta: 2
                  });
                }
              }
            } else if(res.code == "-1005"){
              wx.hideToast();
              wx.showModal({
                title: '温馨提示',
                content: '小程序授权登录失败，请稍候重试！',
                showCancel: false,
                success: (res)=>{
                  if(res.confirm){
                    
                  }
                }
              })
            } else {
              wx.hideToast();
              console.log(res);
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }
          },
          fail: err => {
            wx.hideToast();
            console.log('登录失败', err);
            let content = '';
            if (err.errMsg == "request:fail timeout") {
              content = "登录失败：请求超时";
            } else if (err.errMsg == "request:fail url not in domain list") {
              content = "登录失败：获取配置信息失败，请重新进入小程序";
            } else {
              content = "登录失败";
            }
            wx.showModal({
              title: '温馨提示',
              content,
              showCancel: false
            })
          }
        })
      })
    }
  },

  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  inputAuth: function (e) {
    if (e.detail.value.length == 4 && this.data.phone.length == 11) {
      this.setData({
        disabled: false,
      })
    }else{
      this.setData({
        disabled: true,
      })
    }
  },

  formSubmit: function (e) {
    let authCode = e.detail.value.authCode;
    let that = this;
    // console.log(that.data.phone);
    if (authCode.length != 4) {       //验证码 不是四位
      util.showModal("请输入正确的四位验证码!");
      return;
    } else {
      wx.showToast({
        title: '登录中',
        icon: 'loading',
        mask: true,
        duration: 15000
      })
      // setTimeout(() => {
      //   if (!this.hadLogined) {
      //     wx.showToast({
      //       title: '服务器未响应',
      //       icon: 'none'
      //     })
      //   }
      // }, 16000);
      let url = this.baseUrl + "user/login.do";
      let param = {
        accountId: app.globalData.accountId,
        phone: that.data.phone,
        authCode: authCode,
        // lon: app.globalData.locationInfo.longitude,
        // lat: app.globalData.locationInfo.latitude,
        mapType: 2
      };
      let locationInfo = app.globalData.locationInfo;
      if (locationInfo && locationInfo.longitude && locationInfo.latitude) {
        param.lon = locationInfo.longitude;
        param.lat = locationInfo.latitude;
        util.request(url, param, (resp) => {
          this.hadLogined = true;
          if (resp.ret == 1) {
            app.getAdAccountId();
            wx.hideToast();
            console.log("登录token!" + resp.data.token);
            wx.setStorageSync('token', resp.data.token); 
            app.globalData.userInfo = resp.data;
            // wx.reLaunch({
            //   url: '../map/map',
            // })
            if (this.unknowUrl) {
              if (this.type) {
                wx.redirectTo({
                  url: this.unknowUrl + "?type=" + this.type,
                })
              } else {
                wx.redirectTo({
                  url: this.unknowUrl,
                })
              }
            } else {
              if (!resp.data.nameAuth && app.globalData.pushNameAuth == 1) {
                wx.redirectTo({
                  url: '../authentication/authentication',
                })
              } else {
                if (app.globalData.autoAction == 'scan')
                  app.globalData.autoAction = 'auto';
                wx.navigateBack({
                  delta: 2
                });
              }
            }
          }
        });
      } else {
        app.getLocationInfo('gcj02',(res) => {
          console.log("*** 重新获取定位：", res);
          param.lon = res.longitude;
          param.lat = res.latitude;
          util.request(url, param, (resp) => {
            this.hadLogined = true;
            if (resp.ret == 1) {
              app.getAdAccountId();
              wx.hideToast();
              console.log("登录token!" + resp.data.token);
              wx.setStorageSync('token', resp.data.token); 
              app.globalData.userInfo = resp.data;
              // wx.reLaunch({
              //   url: '../map/map',
              // })
              if (this.unknowUrl) {
                if (this.type) {
                  wx.redirectTo({
                    url: this.unknowUrl + "?type=" + this.type,
                  })
                } else {
                  wx.redirectTo({
                    url: this.unknowUrl,
                  })
                }
              } else {
                if (!resp.data.nameAuth && app.globalData.pushNameAuth == 1) {
                  wx.redirectTo({
                    url: '../authentication/authentication',
                  })
                } else {
                  if (app.globalData.autoAction == 'scan')
                    app.globalData.autoAction = 'auto';            
                  wx.navigateBack({
                    delta: 2
                  });
                }
              }
            }
          });
        })
      }      
      // util.request(url, param, (resp) => {       // 放开之后 多调了一次 然后 出两次 对话框
      //   this.hadLogined = true;
      //   if (resp.ret == 1) {
      //     app.getAdAccountId();
          
      //     wx.hideToast();
      //     console.log("登录token!" + resp.data.token);
      //     wx.setStorageSync('token', resp.data.token); 
      //     app.globalData.userInfo = resp.data;
      //     // wx.reLaunch({
      //     //   url: '../map/map',
      //     // })
      //     if (this.unknowUrl) {
      //       if (this.type) {
      //         wx.redirectTo({
      //           url: this.unknowUrl + "?type=" + this.type,
      //         })
      //       } else {
      //         wx.redirectTo({
      //           url: this.unknowUrl,
      //         })
      //       }
      //     } else {
      //       if (!resp.data.nameAuth && app.globalData.pushNameAuth == 1) {
      //         wx.redirectTo({
      //           url: '../authentication/authentication',
      //         })
      //       } else {
      //         if (app.globalData.autoAction == 'scan')
      //           app.globalData.autoAction = 'auto';

      //         wx.navigateBack({
      //           delta: 2
      //         });
      //       }
      //     }
      //   }
      // });
    }
  },

  getAuth: function () {
    let that = this;
    if (!that.data.timer) {//为空进
      if (that.data.phone.length != 11) {
        util.showModal("请输入正确的手机号码!");
        return;
      }
      let url = this.baseUrl + "sms/sendAuthCode.do";
      let param = {
        accountId: app.globalData.accountId,
        phone: that.data.phone
      }
      util.request(url, param, (resp) => {
        if (resp.ret == 1) {
          console.log("发送成功!");
        }
      });
      let second = 60;
      that.setData({
        authCodeBtn: second + "S" + "重新发送",
        color: '#e5e5e5'
      })
      if (that.data.timer) clearInterval(that.data.timer);
      else {
        that.data.timer = setInterval(function () {
          if (second == 1) {
            clearInterval(that.data.timer);
            that.setData({
              authCodeBtn: "获取验证码",
              timer: null
            })
          } else {
            second--;
            that.setData({
              authCodeBtn: second + "S" + "重新发送"
            })
          }
        }, 1000)
      }
    }
  },

  onShareAppMessage: function() {
    return {
      title: '',
      path: '/pages/map/map',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})