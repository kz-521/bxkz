let app = getApp()
let util = require('../../utils/util')
let appColor = require('../../utils/config.js').appColor;
Page({
  data: {
  },
  onLoad: function () {
    app.globalData.userTrack.push(['/authentication','/实名认证']);
  },

  formSubmit: function (e) {
    let that = this;
    let name = e.detail.value.name;
    let idNO = e.detail.value.idNO;
    name = name.replace(/\s+/g, ""); // 去除全部空格
    let match = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (name.length == 0 || idNO.length == 0) {
      wx.showToast({
        title: '您还有必选项没有输入',
        icon: 'none',
      })
    } else if (!match.test(idNO)) {
      wx.showToast({
        title: '请输入正确的身份证号码',
        icon: 'none',
      })
    } else {
      console.log("格式正确 a01 ----- ")
      wx.showToast({
        title: '正在加载',
        icon: 'loading',
        mask: true,
        duration: 15000
      })
      app.checkToken(function (token) {
        if (token.length > 0) {
          console.log('--------- call 实名认证接口 -------------');
          let url = app.globalData.baseUrl + "user/nameAuth.do";
          let param = {
             token: token,
             name: name, 
             idNO: idNO 
            };
          util.request(url, param, (resp) => {
            console.log("--------- user/nameAuth.do 实名认证结果 ------",resp);
            if (resp.ret){
              if (app.globalData.autoAction == 'scan')
                app.globalData.autoAction = 'auto'                //refreshInfo 仅仅是刷新用户信息,成功不成功都无所谓,继续执行
              that.refreshInfo(() => {
                wx.hideToast();
                app.globalData.userInfo.nameAuth = true;
                wx.showModal({
                  title: '温馨提示',
                  content: '认证成功！',
                  showCancel: false,
                  success: (res) => {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
              })
            }
          });
        }
      });
    }
  },

  refreshInfo: function(cb){
    app.checkToken((token) => {
      if (token.length > 0) {
        let user_url = app.globalData.baseUrl + "user/getByUserId.do";
        let user_param = { token: token};
        if (app.globalData.adAccountId && app.globalData.adAccountId != ""){
          user_param.adAccountId = app.globalData.adAccountId
        }
        util.request(user_url, user_param, (resp) => {
          console.log("用户信息:" + JSON.stringify(resp));
          if (typeof resp.data != 'undefined') {
            app.globalData.userInfo = resp.data;
            cb && cb();
          }
        });
      } else {
        wx.hideToast();
        app.globalData.userInfo = null;
        cb && cb();
      }
    });
  }
});