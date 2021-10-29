var app = getApp();
var util = require('../../utils/util.js')
Component({

  behaviors: [],

  // 属性定义（详情参见下文）
  properties: {
    visible: Boolean, // 简化的定义方式
    mainColor: String,
    textColor: String,
    imgUrls: Array,
    setTop: String
  },

  observers: {
    
  },

  data: {
    guideImage: '../../images/bluetooth_g_b.png',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    checked: false,
    contentHeight: 300,
  }, // 私有数据，可用于模板渲染


  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {

    },
    moved: function () { },
    detached: function () { },
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () { 
    // setTimeout(()=>{
    //   this.getImageDom();
    // },500)
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      // if (app.globalData.mobileOS.indexOf("iOS") > -1) {
      //   this.setData({
      //     guideImage: '../../images/bluetooth_g_a.png'
      //   })
      // }	
    },
    hide: function () { },
    resize: function () { },
  },

  methods: {

    getImageDom: function(){
      const query = this.createSelectorQuery();
      query.select('#img_0').boundingClientRect();
      query.exec((res) => {
        console.log(res);
        if (res[0] != "" && res[0] != null){
          this.setData({
            contentHeight: res[0].height + 10
          })
        }else {
          setTimeout(()=>{
            this.getImageDom();
          },200)
        }
      })
    },

    knownTap: function () { //关闭蓝牙引导
      this.triggerEvent('knownTap', {}, {})
    },

    checkboxChange: function (e) {
      console.log(e.detail.value);
      // this.setData({
      //   checked: e.detail.value
      // })
      if (e.detail.value[0] == 'check'){
        this.check = true;
      }else
        this.check = false;
    },

    toTarget: function(e){
      let targetUrl = e.currentTarget.dataset.url;
      if(targetUrl && targetUrl.length > 0){
        if(targetUrl.indexOf('http')>-1){
          wx.navigateTo({
            url: '../../pages/urlTarget/urlTarget?targetUrl=' + targetUrl,
          })
        }else{
          if(app.globalData.userInfo){
            // wx.navigateTo({
            //   url: targetUrl,
            // })
            if (targetUrl === "recharge") {
              wx.navigateTo({
                url: '/pages/recharge/recharge',
              })
            } else if (targetUrl === "depositvip") {
              wx.navigateTo({
                url: '/pages/ridePackage/ridePackage?type=1',
              })
            } else if (targetUrl === "ridecard") {
              wx.navigateTo({
                url: '/pages/ridePackage/ridePackage?type=0',
              })
            } else if (targetUrl === "vip") {
              wx.navigateTo({
                url: '/pages/ridePackage/ridePackage?type=2',
              })
            } else {
              wx.navigateTo({
                url: targetUrl,
              })
            }
          }else{
            // wx.navigateTo({
            //   url: '../login/login?unknowUrl=' + targetUrl,
            // })
            let url = '';
            if (targetUrl === "recharge") {
              url = '/pages/recharge/recharge';
            } else if (targetUrl === "depositvip") {
              url = '/pages/ridePackage/ridePackage&type=1'; // 注意这里是&不是?，不然无法传参
            } else if (targetUrl === "ridecard") {
              url = '/pages/ridePackage/ridePackage&type=0'; // 注意这里是&不是?，不然无法传参
            } else if (targetUrl === "vip") {
              url = '/pages/ridePackage/ridePackage&type=2'; // 注意这里是&不是?，不然无法传参
            } else {
              url = targetUrl;
            }
            wx.navigateTo({
              url: '../login/login?unknowUrl=' + url
            })
          }
        }
      }
    }
  }

})