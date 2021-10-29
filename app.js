//app.js
let util = require('utils/util.js');
let Bluetooth = require('utils/bluetooth-wx-jssdk2.0/bluetooth.js')
App({
  onLaunch: function (options) {                                                                                  // 全局触发一次 
    console.log(options);
    // this.checkTest()
    // console.log("基础库版本:", wx.getSystemInfoSync().SDKVersion);                                                // 当前小程序运行的基础库的版本号
    let accountId = this.globalData.accountId;                                                                      // 百姓快租服务器配置表里面的记录
    let newServiceAccountId = this.globalData.newServiceAccountId;                                                  // 新业务域名的accountId名单
    for (let newAccountId of newServiceAccountId) {                                                                 // 遍历名单 重置地址
      if (accountId == newAccountId) {
        this.globalData.serviceUrl = 'https://client1.uqbike.cn/shared_bike_mp/';
        break;
      }
    }
    let that = this;
    let sysinfo = wx.getSystemInfoSync();                                                                         //设备信息
    that.globalData.mobileBrand = sysinfo.model;                                                                 // 设备型号
    that.globalData.mobileOS = sysinfo.system;                                                                    //操作系统及版本
    that.globalData.systemInfo = sysinfo;                                                                        // 赋值给全局系统信息
    let sdkVersion = sysinfo.SDKVersion.split('.');                                                               // 客户端基础库版本
    if (sdkVersion[0] < 2) {
      util.showModal_nocancel("客户端基础库版本过低，请检查微信版本！");
    }
    // console.log(`${that.globalData.mobileBrand},${that.globalData.mobileOS}`)  // 设备型号 操作系统及版本
    wx.login({
      success: function (res) {
        that.globalData.code = res.code;                                                                            // 登录凭证 openid unionid session_key code 只有五分钟有效期
      }
    })
    this.bluetooth = new Bluetooth();                                                                             //使用唯一蓝牙对象
    that.repeatInitTimes = 0;
    this.checkApp() 
    // this.checkTest()
    // let accountInfo = wx.getAccountInfoSync(); 
    // let version = accountInfo.miniProgram.version;                                                             // 1.0.0 小程序版本号
    // console.log(version);
  },

  onError() {
  },

  onPageNotFound(msg) {
    console.log(msg);
  },

  // checkTest() {
  //   if(this.glabalData.getTest) {
  //     this.glabalData.baseUrl = 'https://client.hyitcom.com:9116/'
  //     this.glabalData.initUrl = 'https://client.hyitcom.com:9116/mpBrand/getByAccountId.do'                        //百姓快租测试版
  //     this.glabalData.serviceUrl = 'https://client.hyitcom.com:9116/shared_bike_mp/'                               //百姓快租测试版
  //   } else {
  //     return 
  //   }
  // },

  checkApp() {
    const updateManager = wx.getUpdateManager()
  updateManager.onCheckForUpdate(function (res) {                                                                      // 请求完新版本信息的回调console.log(res.hasUpdate)
  })
  updateManager.onUpdateReady(function () {
    wx.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success(res) {
        if (res.confirm) {                                                                                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      }
    })
  })
  updateManager.onUpdateFailed(function () {
  })
  },

  onShow: function (res) {
  },

  initApp: function (cb) {                                                      // 初始化
    let that = this;
    let url = this.globalData.initUrl;                                           //地址
    let param = {
      accountId: this.globalData.accountId                                        // 百姓快租服务器配置表里面的记录
    };
    wx.request({
      url,
      data: param,
      success: res => {
        if (res.data.ret && typeof res.data.data != undefined) {
          that.appForm(res.data.data);
          cb && cb(res.data.data);
        } else {
          util.showModal_nocancel('无此定制品牌');
        }
      },
      fail: res => {                                                                   // 请求失败，重新调用获取品牌配置信息
        that.repeatInitTimes++;
        if (that.repeatInitTimes <= 3) {                                                // 重试三次
          that.initApp(cb);
        } else {                                                                       // 重试三次都不行就弹框提示
          wx.showModal({
            title: '温馨提示',
            content: '获取配置信息失败，请重新打开小程序',
            confirmText: '好的',
            showCancel: false
          });
        }
      }
    });
  },

  appForm: function (config) {                                                            // 配置
    try {
      let mainColor = wx.getStorageSync('mainColor');
      let textColor = wx.getStorageSync('textColor');
      let headColor = wx.getStorageSync('headColor');
      let baseUrl = wx.getStorageSync('baseUrl');
      let phone = wx.getStorageSync('phone');
      let name = wx.getStorageSync('name');
      if (mainColor.length == 0 || mainColor != config.mainColor) {
        mainColor = config.mainColor;
        wx.setStorageSync('mainColor', mainColor);
      }
      if (textColor.length == 0 || textColor != config.textColor) {
        textColor = config.textColor || "#000000";
        if (config.accountId == 314 || config.accountId == 315)
          textColor = "#000000";
        wx.setStorageSync('textColor', textColor);
      }
      if (headColor.length == 0 || headColor != config.headColor) {
        headColor = config.headColor;
        wx.setStorageSync('headColor', headColor);
      }
      if (baseUrl.length == 0 || baseUrl != config.baseURL) {
        baseUrl = config.baseURL;
        wx.setStorageSync('baseUrl', baseUrl);
        //util.showModal_nocancel('域名已更新，请重新进入小程序！');
      }
      if (phone.length == 0 || phone != config.phone) {
        phone = config.phone;
        wx.setStorageSync('phone', phone);
      }
      if (name.length == 0 || name != config.name) {
        name = config.name;
        wx.setStorageSync('name', name);
      }
      this.globalData.baseUrl = baseUrl + "/";
      this.globalData.mainColor = mainColor;
      this.globalData.textColor = textColor;
      this.globalData.headColor = headColor;
      this.globalData.phone = phone;
      wx.setNavigationBarTitle({
        title: name,
      })
    } catch (e) {
      console.log(e);
    }
  },

  getAdAccountId: function (cb) {
    let that = this;
    this.getLocationInfo('gcj02', (res) => {
      that.returnAdAccountId(res, cb);
    })
  },

  //  判断是否支持头盔锁
  isSupportFuns:function(machineNO,cb){
    let that = this;
    let url = that.globalData.baseUrl + "machine/isSupport.do";
    let param = {
      userCode:machineNO
    }
    that.checkToken(token=>{
      if(token.length > 0){
        param.token = token;
        wx.request({
          url: url,
          data:param,
          success(res){
            console.log(res);
            var resp = res.data;
            if(resp.ret){
              var data = resp.data;
              for(var i=0; i < data.length; i++){
                if(data[i].functionType == 1){
                  that.globalData.isSupportHelMet = true;
                }
              }
              cb && cb("success")
            }else{
              cb && cb("fail");
              that.globalData.isSupportHelMet = false;
            }         
          },
          fail(err){
            console.log(err);
          }
        })
      }
    })
  },
  
  // 每个3s检查车辆状态位置
  getMachineStatusOnRiding:function(userCode,cb){
    let that = this;
    let url = that.globalData.baseUrl + "machineStatus/getByUserCode.do";
    let param = {
      userCode,
      mapType: 2
    };
    that.checkToken(token =>{
      if(token.length > 0){
         param.token = token;
         util.request(url, param, (res)=>{
          console.log('g etMachineStatusOnRiding每个3s检查车辆状态位置',res);
          if (res.data){
            // console.log(res.data);
            that.checkInGeo(res.data.lonC,res.data.latC) // 传入经纬度       // lon 原始        lonC 校准数据
          }
              that.globalData.socPercent = res.data.socPercent;    // 电量 
              that.globalData.surplusMileage = res.data.surplusMileage; // 可骑行公里
              if(res.ret){
                that.globalData.socPercent = res.data.socPercent;
              that.globalData.surplusMileage = res.data.surplusMileage;
                cb && cb(res.data)
              }
        });
      }
    });
  },

isInPolygon(checkPoint, polygonPoints) {
  var counter = 0;
  var i;
  var xinters;
  var p1, p2;
  var pointCount = polygonPoints.length;
  p1 = polygonPoints[0];
  for (i = 1; i <= pointCount; i++) {
      p2 = polygonPoints[i % pointCount];
      if (
          checkPoint[0] > Math.min(p1[0], p2[0]) &&
          checkPoint[0] <= Math.max(p1[0], p2[0])
      ) {
          if (checkPoint[1] <= Math.max(p1[1], p2[1])) {
              if (p1[0] != p2[0]) {
                  xinters =
                      (checkPoint[0] - p1[0]) *
                          (p2[1] - p1[1]) /
                          (p2[0] - p1[0]) +
                      p1[1];
                  if (p1[1] == p2[1] || checkPoint[1] <= xinters) {
                      counter++;
                  }
              }
          }
      }
      p1 = p2;
  }
  if (counter % 2 == 0) {
      return false;
  } else {
      return true;
  }
},

// 检查是否在电子围栏
  checkInGeo(lo,la) {
    let url = this.globalData.baseUrl + "geo/getInGeo.do";
    let param = {
      lo, 
      la, 
      mapType: 0, 
      accountId: this.globalData.accountId
    }
    util.request(url,param,(res)=>{
      if(res.ret){                               // 运营区的 电子围栏 存在
        // console.log( '电子围栏是否存在？',res);
        if(res.data){
        let arr = res.data.pointsC.split(';')
        // console.log(arr);
        let arr1 = []
        arr.forEach((item,index) => {
          arr1.push([item])
        })
        var arr2 = []
        var lastArr = []
        arr1.forEach(item => {
          arr2 = item[0].split(',')
          lastArr.push([parseFloat( arr2[0]),parseFloat(arr2[1])])
        })
        let flag1 =  this.isInPolygon([lo,la],lastArr)
      //  console.log(flag1);
        if(flag1){  // data 存在就是 在区域内
          this.globalData.notArea = false 
        }else{      // 不在 超区
          this.globalData.notArea = true 
        }
      }else{                                  // 获取不到运营区的 电子围栏
         this.globalData.notArea = true 
      }
    }
    })
  },

  //url参数编码
  URLencode: function(sStr) {
    return escape(sStr).replace(/\+/g, '%2B').replace(/\"/g,'%22').replace(/\'/g, '%27').replace(/\//g,'%2F');
},  

  // 车辆编号 ===》 设备编号
  userCodeToMachineNO:function(machineNO,cb){
    let url = this.globalData.baseUrl + "machine/getBleSecret.do";
    let param = {
      userCode:machineNO
    }
    this.checkToken(token=>{
      if(token.length > 0){
        param.token = token;
      }
      util.request(url,param,(res)=>{
        if(res.ret){
          cb && cb(res.data.machineNO)
        }
      })
    });
   
  },

  openHelMetLock: function (machineNO,cb) {
    let that = this;
    if(that.globalData.clickHelmetTimer || that.globalData.clickHelmetCount != 0){
      if(that.globalData.clickHelmetTimer){
  
        clearInterval(that.globalData.clickHelmetTimer);
      }
      that.globalData.clickHelmetTimer = null;
      that.globalData.clickHelmetCount = 0;
    }
    that.userCodeToMachineNO(machineNO,(machineNO)=>{
      that.checkToken((token) => {
        let url = that.globalData.baseUrl + "terControl/sendControl.do";
        let param = {
          token: token,
          machineNO: machineNO,
          controlType: 'control',
          paramName: 22
        };
        util.request(url, param, (res) => {
          if (res.ret) {
            cb && cb();
            that.globalData.clickHelmetTimer= setInterval(()=>{
              that.globalData.clickHelmetCount ++;
            },1000);
          }
        })
      })
    })
  },

  returnAdAccountId: function (location, cb) {
    console.log(location);
    console.log("------ returnAdAccountId() ------");
    let that = this;
    that.checkToken((token) => {
      let url = that.globalData.baseUrl + "adAccountDeposit/getByLocation.do";
      console.log("请求url:"+ url);
      let param = {
        accountId: that.globalData.accountId,
        lo: location.longitude,
        la: location.latitude,
        mapType: 2,
      }
      if (token.length > 0) {
        param.token = token;
      }
      util.request(url, param, (res) => {
        // console.log("returnAdAccountId(), 请求数据响应");
        console.log(res);
        if (res.ret) {
          that.globalData.adAccountId = res.data.accountId;
          //that.globalData.areaId = res.data.accountId;
          //console.log(that.globalData.areaId,"这是移动的区域id");
          //console.log('区域adAccountId', res.data.accountId);
          that.globalData.modelType = res.data.modelType ? res.data.modelType : 0;
          that.globalData.pushNameAuth = res.data.nameAuth != undefined ? res.data.nameAuth : 1;
          that.globalData.supportAppoint = res.data.appoint == 1;
          that.globalData.wxModelMsg = res.data.wxModelMsg;
          that.globalData.wxZffDeposit = res.data.wxZffDeposit;
          that.globalData.isFreeDeposit = that.globalData.wxZffDeposit == 1 ? true : false;
          // that.globalData.isNeedFaceRecognize  = resp.data.faceCheck; //人脸识别
          cb && cb();
        } else if (res.code == '-3050') {
          util.showModal_nocancel(res.msg);
          that.globalData.adAccountId = "";
          cb && cb();
        }
      })
    })
  },

  initUserInfo: function (cb) {  //初始化小程序预加载个人信息数据
    let that = this;
    this.checkToken((token) => {
      if (token.length > 0) {
        let url = that.globalData.baseUrl + "user/getByUserId.do";
        let param = {
          token: token
        }
        if (that.globalData.adAccountId && that.globalData.adAccountId != "") {
          param.adAccountId = that.globalData.adAccountId
        }
        wx.request({
          url: url,
          data: param,
          method: 'GET',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: res => {
            console.log(res);
            res = res.data;
            if (res.ret) {
              that.globalData.userInfo = res.data;
            } else {
              //console.log(res)
              if (res.msg == "请先登录") {
                console.log('没有token了--------------------------------------------');
                wx.setStorageSync('token', '')
                that.globalData.userInfo = null;
              }
            }
            cb && cb();
          }
        })
      }
    })
  },

  //检测登录是否过期
  checkToken: function (cb) {
    let value = ''
    try {
      value = wx.getStorageSync('token');
    } catch (e) {
      wx.showModal({
        content: e,
      })
    }
    if (value.length > 0) {         // console.log('token存在', value);
      this.globalData.judgeLoginStatus = true;
      cb && cb(value);
    } else {                       // console.log('token不存在');
      this.globalData.judgeLoginStatus = false;
      cb && cb("");
    }
  },

  //锁车成功语音
  lockAudio: function () {
    let that = this;
    //播放语音
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = that.globalData.baseUrl + 'audio/lock.mp3'
    innerAudioContext.onPlay(() => {
      console.log('锁车成功播放')
    })
  },

  //开锁成功语音
  unlockAudio: function () {
    let that = this;
    //播放语音
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = that.globalData.baseUrl + 'audio/unlock.mp3'
    innerAudioContext.onPlay(() => {
      console.log('开锁成功播放')
    })
  },

  //获取信息
  getLocationInfo: function (type, cb) {
    let that = this;
    wx.getLocation({   // 默认为 wgs84 返回 gps 坐标，gcj02(腾讯、谷歌地图专用，国标) 返回可用于 wx.openLocation 的坐标
      type: type,
      success: function (res) {                // console.log(`位置：${JSON.stringify(res)}`);
        that.globalData.locationInfo = res;    //保存用户位置
         that.globalData.userLastPosition = {
          longitude: res.longitude,
          latitude: res.latitude
        };
        wx.setStorage({
          key: 'userLastLocation',
          data: res
        });
        cb(that.globalData.locationInfo)
      },
      fail: (err) => {
        wx.hideLoading();
        wx.hideToast();
        console.log('位置错误：', err)
        if (err.errMsg.indexOf('fail auth deny') > -1 || err.errMsg.indexOf('fail authorize no') > -1) {
          console.log('拒绝授权定位')
          wx.showModal({
            title: '温馨提示',
            content: '请在小程序设置中开打位置授权。',
            confirmText: '好的',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {
                    console.log(res.authSetting)
                    console.log(res.authSetting['scope.userLocation']);
                    if (!res.authSetting['scope.userLocation']) {
                      // that.getLocationInfo(type, cb);
                    }
                  }
                })
              }
            }
          })
        } else if (err.errCode == 2 || err.errMsg.indexOf('ERROR_NOCELL&WIFI_LOCATIONSWITCHOFF') > -1) {
          console.log('没有开启定位服务');
          wx.showModal({
            title: '温馨提示',
            content: '请打开手机定位。',
            confirmText: '重试',
            success: (res) => {
              if (res.confirm) {
                that.getLocationInfo(type, cb);
              }
            }
          })
        } else if (err.errMsg.indexOf('fail:system permission') > -1 || err.errMsg.indexOf('fail system permission') > -1) {
          console.log('系统禁止定位获取')
          wx.showModal({
            title: '温馨提示',
            content: '微信地理位置访问权限被禁用。',
            confirmText: '重试',
            success: (res) => {
              if (res.confirm) {
                that.getLocationInfo(type, cb);
              }
            }
          })
        }else if(err.errMsg.indexOf("getLocation:fail") > -1){   //新接口变化，对getLocation获取有时间限制
          cb && cb(that.globalData.locationInfo)
        }
      },
      complete: function () {
      }
    })
  },

  //获取系统消息
  getSystemInfo: function (cb) {
    // console.log('获取系统消息');
    let that = this;
    if (this.globalData.res_system) {
      // console.log('获取系统消息1');
      cb(this.globalData.res_system)
    } else {
      console.log('获取系统消息2');
      wx.getSystemInfo({
        success: function (res) {
          console.log('获取系统消息3');
          that.globalData.res_system = res;
          cb(that.globalData.res_system)
        }
      })
    }
  },

  //是否认证
  isAuth: function (cb) {
    let that = this;

    let third_session = wx.getStorageSync('third_session');
    if (third_session.length == 0) {
      that.login(function (data) {
        that.getAccountInfo(data, cb);
      })
    } else {
      that.getAccountInfo(third_session, cb);
    }
  },

  //获取账号信息
  getAccountInfo: function (third_session, cb) {
    let that = this;
    if (this.globalData.account)
      cb(this.globalData.account)
    else
      wx.request({
        url: that.glabalData.baseUrl + 'account/getBySessionKey.do',
        data: {
          sessionKey: third_session
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          /*{"errMsg":"request:ok","data":{"data":{"accountId":3,"deposit":true,"joinTime":"2017-03-09 11:57:11","money":321.8,"openId":"ohy8Z0TWtr8RFCk3I9hDVLTqmxOc","updateTime":"2017-03-10 11:52:47"},"ret":1},"statusCode":200}*/
          console.log("account信息（认证，金额，时间）：" + JSON.stringify(res));
          if (res.errMsg == "request:ok") {
            that.globalData.account = res.data.data;
            cb && cb(that.globalData.account)
          } else {
            console.log('获取认证状态失败：' + res.errMsg);
          }

        },
        fail: function () {
        },
        complete: function () {
        }
      })
  },


  /////////////////////////////////蓝牙相关////////////////////////////
  operateBluetooth: function (operateType, machineNO, cb) { //蓝牙操作调用
    let that = this;
    this.getSecretKey(machineNO).then((key) => {
      that.bluetooth.start(operateType, key.machineNO, key.secret, (res) => {
        that.saveLog(machineNO, that.globalData.mobileBrand, that.globalData.mobileOS, JSON.stringify(
          that.bluetooth.getLog()))
        console.log(that.bluetooth.getMachinevoltage())
        cb && cb(res)
      });
    })
  },

  saveLog: function (machineNO, mobileBrand, mobileOS, remark, cb) {
    console.log(remark);
    this.checkToken((token) => {
      let url = this.globalData.baseUrl + 'debug/addLog.do';
      let param = {
        machineNO,
        mobileBrand,
        mobileOS,
        remark,
        token
      };
      wx.request({
        url: url,
        data: param,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          if (res.statusCode == '200') {
            if (res.data.ret) {
              console.log('日志上传成功！')
              cb && cb();
            } else {
              console.log(res.data.msg);
            }
          }
        },
        fail: function (res) {
          wx.showModal(res)
        },
        complete: function (res) {},
      })
    })
  },

  //获取秘钥
  getSecretKey: function (machineNO) { //获取蓝牙密钥
    let that = this;
    return new Promise((res, rej) => {
      let url = that.globalData.baseUrl + '/machine/getBleSecret.do';
      that.checkToken((token) => {
        let timer = null;
        if (token.length > 0) {
          let param = {
            token: token,
            userCode: machineNO
          };
          util.request(url, param, (resp) => {
            console.log("获取的秘钥", resp.data);
            res(resp.data);
          })
        } else {
          wx.hideToast();
        }
      });
    });
  },

  //获取押金
  getDeposit: function (cb) {
    console.log("------ getDeposit() --------");
    this.checkToken((token) => {
      if (token.length > 0) {
        let url = this.globalData.baseUrl + "adAccountDeposit/getByLocation.do";
        console.log("请求url:" + url);
        let param = {
          accountId: this.globalData.accountId,
          lo: this.globalData.locationInfo.longitude,
          la: this.globalData.locationInfo.latitude,
          mapType: 2,
          token
        }
        util.request(url, param, (res) => {
          console.log("----- getDeposit() 请求响应:");
          console.log(res);
          if (res.ret) {
            console.log(res.data);
            cb && cb(res.data);
          } else if (res.code == '-3050') {
            cb && cb(false);
          }
        })
      }
    })
  },

  //全局变量
  globalData: {
    getTest: false,
    baseUrl: 'https://client.bxkuaizu.cn/', 
    initUrl: 'https://client.bxkuaizu.cn/mpBrand/getByAccountId.do', //百姓快租  
    serviceUrl: 'https://client.bxkuaizu.cn/shared_bike_mp/',     // 百姓快租
    mainColor: '#3fd572',
    textColor: '',
    headColor: '',
    phone: '',
    version: 'v1.0.17d',
    accountId: 100197,                                           // 百姓快租服务器配置表里面的记录
    accountIdPart: 100201,                                        // 小地区配置号
    imagesUrl: 'https://mp.uqbike.cn/images/',                  // 统一使用阿里云服务器上的图片，提高加载速度
    noRefresh:false,                                               // 返回不刷新map onshow
    hadPay:false,                                                 // 首次弹出未支付状态控制
    scanPay: false,                                               // 扫码首次弹出未支付状态控制
    formatTime1:'',
    borrowStart:'',
    notArea:false,
    prpgressTime:0,
    surplusMileageSelf: '',                                             // 骑行页面的可骑行公里
    socPercent:'',
    surplusMileage:'',
    userLastPosition:null,                                              //用户最后位置
    userInfo: null,
    locationInfo: null,
    res_system: null,
    account: null,
    mobileBrand: '',
    mobileOS: '',
    systemInfo: null,
    sequenceId_heart_16: '',                                           //心跳包流水号16进制
    btId: '',
    repeatConnetTip: false,                                            //连接断开，是否重新连接
    machineNO: '',
    connected: false,
    code: null,
    areaLocation: null,                                           //初始坐标，用于限制搜索区域
    areaCity: null,
    areaPolygon: null,                                           //保存当前进入的电子围栏
    firstRender: true,
    firstLoad:true,
    adAccountId: "",
    areaId: "",                                                   //中心带你所在区域id
    adUserAccountId: "",                                         //用户所在区域id
    autoAction: null,                                              //判断是否执行自动借车流程
    modelType: 0,                                                  //0：站点模式；1：禁停区模式
    pushNameAuth: 1,                                               //0：取消强制实名；1：启用强制实名
    boundImage: [],                                                //弹窗广告图片
    isScanCode: false,                                             //是否扫码进入
    newServiceAccountId: [5, 327, 10, 10264, 10258, 10203, 348, 10327, 10328, 10456, 10466, 10482, 10568, 10580, 10608, 10569, 10584, 10579, 10604, 10578, 10583, 10719, 10670, 10732, 10720, 10854, 10872, 10899],                      //新业务域名的accountId名单
    isBicycle: false,                                              // true单车模式 false电动车模式
    mac: "",                                                       // 单车锁mac地址
    supportAppoint: false,                                          // 电动车true支持预约 false不支持预约
    fromZhiFuFen: 0,
    changeAvator: '',
  faceRecognize:false,                                             // 人脸识别是否通过
    isNeedFaceRecognize:false,                                       //是否需要人脸识别
    isOnlineContact:false,
    onlineServiceURL:'',
    clickHelmetTimer:null,
    clickHelmetCount:0,
    isSupportHelMet:false,                                           //车辆是否支持头盔锁
    userTrack: [{'page': 'page'}],
    isShowHemMetTip:false,                                               // 开锁后需要打开头盔锁引导图
    markerIndex: 0,                                                      //控制markers序号
    judgeLoginStatus: true,                                              //判断登录状态
    loadingPark:false,
    lastLoadingParkTime:0,
    payed:false,                                                      // 支付了,
    isRiding:false,
    studyLead:true,                                                    // 是否需要学习引导
    hadGoPay:false,
    serveTime:'',
    serveTime1:'',
    isHistroyBack: false,                                               // 从历史记录返回
    noPayHistory: false,
    subkey:'VYUBZ-LNCCU-LJCVJ-2C6MK-U4CH5-N4BH7',                        // 地图个性化秘钥
    // getTest: true,
    // baseUrl : 'https://client.hyitcom.com:9116/',
    // initUrl : 'https://client.hyitcom.com:9116/mpBrand/getByAccountId.do',                        //百姓快租测试版
    // serviceUrl : 'https://client.hyitcom.com:9116/shared_bike_mp/',                               //百姓快租测试版
  }
})