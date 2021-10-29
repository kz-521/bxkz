//充值界面
//获取应用实例
let app = getApp()
let util = require('../../utils/util.js');
let appColor = require('../../utils/config.js').appColor;
Page({
  data: {
    items: [],
    disabled: false,
    money: '',
    selfInput: false,
    mainColor: '#35D723',
    textColor: '',
    headColor: '',
    selfMoney: '',
    selected: 1,
    payTip:''
  },

  onLoad: function(options) {
    console.log( app.globalData.textColor,app.globalData.mainColor,app.globalData.headColor );
    this.setData({
      textColor: '#fff',  //获取三个 颜色
      mainColor: '#3FD572',
      headColor: '#3FD572',
    })
    this.getRecharge((flag)=> {
      // 设置默认 项目
      if(!flag){
        this.setData({
          items: [
            // {
            //   id: 5,
            //   name: '其他金额',
            //   value: '',
            //   // tip: '送1元赠送金',
            //   // input: true,
            //   radioCan: false
            // },
            {
              id: 50,
              name: '其他金额',
              value: '',
              tip: '请输入整数金额',
              input: true,
              radioCan: false
            },]
        })
      }
      //   接受items作为list
      let list = this.data.items;
      for (let item of list) {
        if (item.id == this.data.selected) {
          this.setData({ money: item.value });
          break;
        }
      }
      let that = this;
      let debt = options.debt;
      if (debt < 0) {
        that.data.items.unshift({
          name: `骑行欠款￥\n${debt * (-1)}元`,  // 特殊空格站位
          value: debt * (-1), 
          checked: true,
          id: -1,
        })
        that.setData({
          items: that.data.items,
          money: debt * (-1),
          selected: -1,
        })
      } else {
        that.data.items[0].checked = true;
        that.setData({
          items: that.data.items
        })
      }
      let money = options.money;
      if (money != undefined) {
        this.setData({
          selfMoney: money,
          money: money,
          selected: 50
        })
      }
    });

  },

   /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.globalData.noRefresh = true
    console.log('充值卸载了 onRefresh为true');
  },

  getRecharge: function(cb){
    app.checkToken((token)=>{
      if(token.length > 0){
        let url = app.globalData.baseUrl + "rechargeConfig/getByAccountId.do";
        let param = {token}
        if (app.globalData.adAccountId && app.globalData.adAccountId.length != 0) {
          param.accountId = app.globalData.adAccountId;
          util.request(url, param, (res) => {
            console.log(res);
            if (res.ret && res.data && res.data.length > 0) {
              console.log(res)
              this.accountForm(res.data,cb)
            } else 
              cb && cb(false)
          })
        } else 
          cb && cb(false)
      }else
        cb && cb(false)
    })
  },

  accountForm: function(data,cb){
    let items = [];
    let inputItem = {};
    data.forEach((account,index) => {
      let item = {};
      if(account.money != -1){
        let money = Number(account.money / 100).toFixed(2)
        item = {
          id: index,
          name: money + "元",
          value: Number(money),
        }
        if (account.desc && account.desc.length > 0)
          item.tip = account.desc;
        items.push(item);
      } else {
        inputItem = {
          id: 50,
          name: '其他金额',
          value: '',
          tip: '请输入整数金额',
          input: true,
        }
      }
    })
    if(data[0].money == -1){
      items.push(inputItem);
    }
    this.setData({
      items
    })

    cb && cb(true)
  },
  onShow: function() {
    this.initbusDes();
  },
  otherBalance: function (e) {
    console.log(e);
    let that = this;
    // if(e.detail.value.indexOf('元') != -1) {
    // e.detail.value =  e.detail.value.substring(0,e.detail.value.indexOf('元')).concat( e.detail.value.substring(e.detail.value.indexOf('元')+1,e.detail.value.length) )
    // }
    that.setData({
      money: e.detail.value,
      // selfMoney: e.detail.value + '元',
      selfMoney: e.detail.value,
      selfInput: true
    });
    // console.log(e.detail.value);
    // return {
    //   value: e.detail.value,
    // }
  },
  radioChange: function(e) {
    let that = this;
    that.setData({
      money: e.detail.value,
      selfMoney: ''
    });
  },

  selectBalance: function(e){
    let money = e.currentTarget.dataset.money;
    let id = e.currentTarget.dataset.id;
    this.setData({
      money: money,
      selected: id,
      selfMoney: ''
    });
  },

  initbusDes:function(){
    let busType = 0;
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
        
          this.setData({
            payTip:res.data.des
          });
        }
      })
    })
  
  },

  //充值,flag为true，代表是余额不足，充值成功，直接去还车操作
  auth: function(flag) {
    let that = this;
    //点击一次，需要设置为不能点击
    if (this.data.money.length == 0) {
      util.showModal_nocancel('请输入金额');
      return;
    } else if (this.data.selfInput == true && this.data.money % 1 != 0) {
      this.setData({
        selfInput: false,
        selfMoney: '',
        money: ''
      })
      util.showModal_nocancel('请输入整数金额');
      return;
    } 
    else if (this.data.money == 0) {
      util.showModal_nocancel('金额不能为0');
      return;
    }
    if (this.data.selfInput == true && this.data.money.length > 4){
      util.showModal_nocancel('充值金额过大');
      return;
    }
    // that.setData({
    //   disabled: true
    // })
    wx.showToast({
      title: '请稍候...',
      icon: 'loading',
      mask: true,
      duration: 2000
    })
    let token = app.checkToken(function(token) {
      if (token.length > 0)
        // if (app.globalData.adAccountId == null){
        //   // wx.hideToast();
        //   // util.showModal_nocancel('区域id获取失败！')
        //   app.globalData.adAccountId = ""
        // }
        wx.login({
          success: function(res) {
            if (res.code) {
              let order_url = app.globalData.baseUrl + "weixinPay/createOrder_weixin.do";
              let order_param = {
                token: token,
                deposit: false,
                money: Number(that.data.money) * 100,
                code: res.code,
              };
              if (app.globalData.adAccountId && app.globalData.adAccountId.length != 0){
                order_param.adAccountId = app.globalData.adAccountId
              }
              console.log('区域id',order_param.adAccountId);
              util.request(order_url, order_param, function(resp) {

                let data = JSON.parse("\{" + resp.data.replace(/'/g, '\"') + "\}");
                /*{ "data":"'appId':'wxc94c724f58518673','timeStamp':'1502190431',
                'nonceStr':'UQBIKE20170808967175','package':'prepay_id=wx20170808190711e25f29c3e50941717652',
                'signType' : 'MD5','paySign':'65F53489A678DB0FF15F7C05F0CD1DDE'", 
                "ret":1 }*/

                that.setData({
                  disabled: false
                })
                // 支付
                wx.requestPayment({
                  'timeStamp': data.timeStamp,
                  'nonceStr': data.nonceStr,
                  'package': data.package,
                  'signType': 'MD5',
                  'paySign': data.paySign,
                  'success': function(res) {
                    app.initUserInfo(() => {
                      wx.navigateBack({
                        delta: 1
                      })
                    })
                  },
                  'fail': function(res) {}
                })
              })

            }
          },
          fail: (err) => {
            util.showModal(err.errMsg);
          }
        })
         else{
          wx.hideToast();
          util.showModal_nocancel('请重新登录')
        }
    });




  },
  fail: function() {
    // fail
  },
  complete: function() {
    // complete
  }
})