// machineStatus.js
let app = getApp();
let util = require('../../utils/util.js');
let Bluetooth_new = require('../../utils/bluetooth-wx-jssdk2.0/bluetooth_new.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    alreadyShowRechargeModal: false,
    subkey:'VYUBZ-LNCCU-LJCVJ-2C6MK-U4CH5-N4BH7',
    hadOpenBluetooth:false,
    background: [{text:'开启蓝牙，开锁更便捷'},],
    vertical: true,
    circular: true,
    autoplay: true, 
    interval: 3000,
    duration: 500,
    topHeight:0,
    latitude: '22.550114',
    longitude: '113.949354',
    scale: '14',
    polygons: '',
    mode: 'scaleToFill',
    machineNO: ".",
    socPercent: '0%',                             // socPercent: null,
    surplusMileage: 0,
    socNumber: 0,                                 // socNumber: null
    mainColor: '#3fd572',
    textColor: '',
    baseTime_A: '计费规则',
    dispatchConfig: null,
    baseTime_C: null,
    guideDialog: false,                             //广告
    boundImage: [],
    modelType: app.globalData.modelType,
    isBicycle: false,                               // true单车，false电动车
    userCode: '',
    tmplIds: ['BA-M4sALql01yRV00OgNcHbFfdbSFaHIoOszJoOJ0I8']
  },

  getGeoByMachine1(machineNO) {
    let that = this 
    let url = app.globalData.baseUrl + "geo/getByMachineNO.do";
    app.checkToken((token) => {
      if (token.length > 0) {
        let param = {
          token: token,
          machineNO: machineNO,
        }
        util.request(url, param, (res) => {
          if (res.ret) {
            if (res.geo) {
              that.getRule(res.adAccountFee);
            }
          }
        })
      } else {
      }
    })
  },

  getRule (adAccountFee) {
    if (adAccountFee.rechargeBase) {
      this.rechargeBase = (Number(adAccountFee.rechargeBase) / 100).toFixed(2);
    }
    let baseTime = adAccountFee.baseTime;                                   //起步时间
    let baseTimeFee = (Number(adAccountFee.baseTimeFee) / 100).toFixed(2);  /*起步金额*/
    let overTime = adAccountFee.overTime;                                   //超时时间
    let overTimeFee = (Number(adAccountFee.overTimeFee) / 100).toFixed(2);  /*超时时间费用*/
    let freeTime = adAccountFee.freeTime;                                   //免费时间
    let dispatchConfig = null;
    let baseTime_A = '计费规则';
    let baseTime_C = null;
    if (baseTime != 0) {
      if (freeTime != undefined && freeTime != 0) {
        baseTime_C = "前" + freeTime + "分钟内免费";
      }
      if(baseTimeFee){
        if(baseTimeFee - (Number(baseTimeFee).toFixed(0)) === 0 ) {
          baseTimeFee = Number(baseTimeFee).toFixed(0)
        }
      }
      if(overTimeFee ){
        if(overTimeFee - (Number(overTimeFee).toFixed(0)) === 0 ) {
          overTimeFee = Number(overTimeFee).toFixed(0)
        }
      }
        baseTime_A = baseTime + "分钟内" + baseTimeFee + "元，超出" + overTimeFee + "元/" + overTime + "分钟";
    } else {
      baseTime_A = "按" + overTimeFee + "元/" + overTime + "分钟"
    }
    if (adAccountFee.dispatchSwitch) {
      // if(dispatchConfig.parkPointFee) {
      dispatchConfig = {
        parkPointFee: (Number(adAccountFee.parkPointMoney) / 100).toFixed(2),
        areaFee: (Number(adAccountFee.areaMoney) / 100).toFixed(2),
      }
    // }
  }
    if((parseInt(overTimeFee) - overTimeFee) === 0) {
      overTimeFee = parseInt(overTimeFee)
    } 
    if((parseInt(overTime) - overTime) === 0) {
      overTime = parseInt(overTime)
    } 
    if((parseInt(baseTimeFee) - baseTimeFee) === 0) { 
      baseTimeFee = parseInt(baseTimeFee)
    } 
    if(dispatchConfig){
    if(dispatchConfig.parkPointFee != 'null') {
    if((parseInt(dispatchConfig.parkPointFee) - (dispatchConfig.parkPointFee)) === 0) {
      dispatchConfig.parkPointFee = parseInt(dispatchConfig.parkPointFee).toFixed(0)
    } 
  } else {
    console.log('dispatchConfig.parkPointFee 不存在');
  }
  if(dispatchConfig.areaFee) {
    if((parseInt(dispatchConfig.areaFee) - (dispatchConfig.areaFee)) === 0) {
      dispatchConfig.areaFee = parseInt(dispatchConfig.areaFee)
    } 
  } else {
    console.log('dispatchConfig.areaFee 不存在');
  }
  }
    // console.log(baseTimeFee,dispatchConfig.parkPointFeeimeFee,dispatchConfig.areaFee,overTime,baseTimeFee);
    this.setData({
      baseTime_A: baseTime_A,
      baseTime_C: baseTime_C,
      dispatchConfig: dispatchConfig,
      overTimeFee: overTimeFee,
      overTime: overTime,
      baseTimeFee:baseTimeFee
    })
  },

  onLoad: function (options) {
    app.globalData.autoAction = null;                                                       //判断是否执行自动借车流程
    this.setData({
      subkey: app.globalData.subkey,
      textColor: app.globalData.textColor,
      boundImage: app.globalData.boundImage                                                   //弹窗广告图片
    })
    this.mapCtx = wx.createMapContext('statusMap');
    let machineNO = options.machineNO;
    this.data.machineNO = machineNO;
    this.sendMachineNO(machineNO);
    app.globalData.machineNO = machineNO;
    this.alreadyUnlock = false;
    if (app.globalData.boundImage.length > 0 && app.globalData.isScanCode) {                    // 如果有弹窗广告 且 是扫码进入  就 放广告好像 
      app.globalData.isScanCode = false
      this.setData({
        guideDialog: true                     
      })
    }
    this.bluetooth_new = new Bluetooth_new(); // 单车锁蓝牙方法
    this.getBluetooth()
  },

  onUnload() {
    clearInterval( this.data.setInterval1)                                                        // 页面销毁清除定时器
  },

  getBluetooth() {                                                                                  //1. 判断用户手机蓝牙是否打开
    var that = this 
    let setInterval1 =  setInterval(function() {                                                    // 3秒检测一次蓝牙是否开启
    wx.openBluetoothAdapter({                                                                       //调用微信小程序api 打开蓝牙适配器接口
      success: function (res) {
        that.setData({
          hadOpenBluetooth:false
        })
      },
      fail: function (res) {                                                                     //如果手机上的蓝牙没有打开，可以提醒用户
        that.setData({
          hadOpenBluetooth:true
        })
      }
    })
   },3000)
   that.data.setInterval1 = setInterval1
  },

  showRule() {
    this.setData({
    ruleShow: true
    })
  },
  
  closeRule() {
    this.setData({
      ruleShow: false
      })
  },

  checkLockStatus() {
    let that = this;
    wx.showLoading({
      title: "请稍候",
      mask: true
    });
    setTimeout(function () {                                       // 超时时间：15秒
      wx.hideLoading()
    }, 15000);
      let mac = wx.getStorageSync('mac'),
      encryptionKey = wx.getStorageSync('encryptionKey'),
      pwd = wx.getStorageSync('pwd');
      that.bluetooth_new.start(2, that.data.machineNO, '', (res) => {
      wx.hideLoading();
      if (!res) {
        wx.showToast({
          title: '开锁成功',
          icon: 'none'
        });
        this.borrowBicycle();                                        // 开锁成功后上报给后端
      }
    }, 1, mac, encryptionKey, pwd);
  },

  // 新增 发送车辆编号 数据埋点
  sendMachineNO (machineNO) {
    app.checkToken(token => {
      let url = app.globalData.baseUrl + "machine/addNum.do";
      let param = {
        userCode: machineNO,
        token: token
      }
      util.request(url, param, function (res) {
        if (res.ret) {
          console.log("上报编号成功", machineNO);
        } else {
          console.log('开车前 上报编号失败');
        }
      });
    });
  },

  onShow: function () {                                             //重新进入之后会触发开锁程序
    if (this.alreadyUnlock && !this.alreadyShowRechargeModal) {
      // this.realUnlock();
    }
    if (this.data.isBicycle && this.alreadyUnlock) {
      this.checkLockStatus();
    }
    if(app.globalData.faceRecognize && app.globalData.isNeedFaceRecognize){
        // this.unlock();
    }
  },

  onReady: function () {
    let that = this;
    this.getGeoByMachine1((app.globalData.getTest ? '80203623': '80222909'))
    app.checkToken(function (token) {                                                           //获取平台状况,如押金、计费规则
      if (token.length > 0) {                                                                   // *** 这里开始区分电动车还是单车 ***
        let machineNO = that.data.machineNO;                                                    //单车真实投放区域(筛选条件:优驱品牌 && 10614区域 && 003538开头而且后面为133~632的车辆编号)
          wx.showToast({
            title: '正在加载',
            icon: 'loading',
            mask: true,
            duration: 15000
          }) 
          let machineStatus_url = app.globalData.baseUrl + "machineStatus/getByMachineNO.do";
          let machineStatus_param = {
            userCode: that.data.machineNO,
            token: token
          };
          util.request(machineStatus_url, machineStatus_param, function (resp) {
            wx.hideToast();
            console.log("1，扫描获取最新状态:" + JSON.stringify(resp));
            if (typeof resp.data == 'undefined') {
              util.showModal_nocancel('故障车，请扫描其它车辆',
                function () {
                  wx.navigateBack({
                    delta: 1
                  })
                })
            } else {
              app.globalData.surplusMileageSelf = resp.data.surplusMileage
              console.log(app.globalData.surplusMileageSelf);
              wx.setStorage({
                key: 'socPercent',
                data: resp.data.socPercent
              })
              that.setData({
                machineNO: resp.data.machineNO,
                socPercent: resp.data.socPercent + "%",
                surplusMileage: resp.data.surplusMileage, //+ "KM"
                socNumber: resp.data.socPercent
              })
              that.getGeoByMachine(that.data.machineNO);
              //   that.sendLocation();
            }
          });
      }
    });
  },

  // 小程序借车前发送定位
  sendLocation (cb) {
    let that = this;
    // if (this.alreadySendLocation) {
    //   if(cb){
    //    cb && cb()
    //   }
    // } else {
      if(that.sendLocationTimer){
        clearTimeout(that.sendLocationTimer);
      }
      that.sendLocationTimer = setTimeout(()=>{                //为了解决部分安卓机拿去不到经纬度问题
         that.sendLastUserMsg(cb);
      },5000);
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          res = {
            longitude: res.longitude.toFixed(6),
            latitude: res.latitude.toFixed(6)
          };
          console.log('扫码人信息： 调用接口拿到位置', res.longitude, res.latitude);
          that.sendLastUserMsg(cb,res);
        },
        fail: (err) => {
          console.log('小程序借车前发送定位sendLocation错误信息',err);
          that.sendLastUserMsg(cb);
        },
        complete:()=>{}
      })
  },

  sendLastUserMsg(cb,res){
    let that = this;
    let machineNO = that.data.machineNO;
    if(that.sendLocationTimer){               // 存在这个定时器 清除
      clearTimeout(that.sendLocationTimer);
    }
    app.checkToken((token) => {
      if (token.length > 0) {
        let url = app.globalData.baseUrl + "machine/lastUse.do";
        let param = {
          mapType: 2,
          userCode: machineNO,
          token: token
        }
        if(res != undefined && res != ""){
          param.lo = res.longitude,
          param.la = res.latitude
        } else {
          console.log("--------res=null, 使用app全局的定位数据重新设置");
          res = {
            longitude: app.globalData.userLastPosition.longitude,
            latitude: app.globalData.userLastPosition.latitude
          };
          console.log(res);
          param.lo = res.longitude,
          param.la = res.latitude
        };
        console.log(param,"--------- 请求数据:");
        util.request(url, param, (resp) => {
          // this.alreadySendLocation = true;
          if (resp.ret) {
            if (cb) {
              console.log(cb);
              cb();
              // that.sendMsgToMonitor(res.longitude, res.latitude, machineNO,cb);
            } else {
              wx.hideToast();
            }
          } else {
            wx.hideToast();
          }
        })
      }
    })
  },

  getGeoByMachine (machineNO) {
    console.log('借车界面 发请求  获得机器状态 ');
    let url = app.globalData.baseUrl + "geo/getByMachineNO.do";
    app.checkToken((token) => {
      if (token.length > 0) {
        let param = {
          token: token,
          machineNO: machineNO,
        }
        util.request(url, param, (res) => {
          if (res.ret) {
            console.log(res,'拿到 返回的结果');
            let polygons = [];
            let dispatchConfig = null;
            if (res.geo) {
              console.log('has geo')
              let points = res.geo.points.split(';');
              let pointArr = [];
              for (let j = 0; j < points.length; j++) {
                let point = {};
                point.longitude = points[j].split(',')[0];
                point.latitude = points[j].split(',')[1];
                pointArr.push(point);
              }
              polygons = [{
                points: pointArr,
                strokeWidth: 3,
                strokeColor: '#FF0000DD',
                fillColor: '#FF000012',
                zIndex: -9
              }]
              this.mapCtx.includePoints({
                padding: [20],
                points: pointArr
              })
            } else {
              console.log('none geo')
              wx.showToast({
                title: '运营区域未设置',
                icon: 'none',
                duration: 2000,
              })
            }
            this.setData({
              polygons: polygons
            })
            this.getRule(res.adAccountFee);
          }
        })
      }
    })
  },

  //换一辆
  exchange () {
    wx.navigateBack({
      delta: 100
    })
  },

  //订阅消息
  unlock() {
    let theTime = new Date()
    let borrowAddTime = theTime.getTime();                                                                        //数据埋点 收集借车开始时间
    console.log(theTime, borrowAddTime, "我是网络开始时间");                                                        // wx.setStorageSync('borrowAddTime', borrowAddTime);
    app.globalData.borrowAddTime = borrowAddTime;
    if(app.globalData.isNeedFaceRecognize && !app.globalData.faceRecognize ){                                        // 如果需要人脸验证 或者没通过人脸验证
      // wx.redirectTo({
        // url: '../faceRecognition/faceRecognition',
      // })   
    }else{                                                                                                            // 没通过就执行下列
      let that = this;
      if( app.globalData.wxZffDeposit){                                                                               // 只有打开支付分才需要上传oppid
        that.returnOppId();  
      }
      if(app.globalData.isNeedFaceRecognize){                                                                          //如果需要人脸识别 为真置false
        app.globalData.faceRecognize = false; 
      }
      if (app.globalData.wxModelMsg) {
        wx.requestSubscribeMessage({
          tmplIds: that.data.tmplIds,
          success(res) {
            if (res['xNwfkXfutQE0q1aXioiH0EEcJUPK11heDg1l7BG73U0'] == "accept") {
              wx.showToast({
                title: '消息订阅成功',
                icon: 'success',
                mask: true,
              });
              that.realUnlock();
            } else {
              that.realUnlock();
            }
          },
          fail(err) {
            console.log(err);
            that.realUnlock();
          }
        })
      } else {
        that.realUnlock();
      }
    }
  },

  //上传openid
  returnOppId() {
    app.checkToken(token => {
      wx.login({
        success(res) {
          if (res.code) {
            wx.request({
              url: app.globalData.baseUrl + 'user/setOpenId.do',
              data: {
                code: res.code,
                token: token
              },
              success: function (resp) {
                console.log(resp);
              },
              fail: function (err) {
                console.log(err);
              }
            });
          }
        }
      })
    })
  },

  //开锁
  realUnlock () {
    app.globalData.surplusMileageSelf = this.data.surplusMileage
    app.globalData.socNumber = this.data.socNumber
    wx.setStorage({                                                               // 本地存储
      key:'surplusMileage',
      data:this.data.surplusMileage
    })
    wx.setStorage({
      key:'socNumber',
      data:this.data.socNumber
    })
    let that = this;
    wx.showToast({
      title: '请稍候',
      icon: 'loading',
      mask: true,
      duration: 15000
    })
    app.checkToken(function (token) {
      wx.hideToast()
      if (token.length > 0) {
        if (!that.data.isBicycle){                                                                     // 电动车开锁
          wx.showToast({
            title: '请稍候',
            icon: 'loading',
            mask: true,
            duration: 15000
          })
           app.isSupportFuns(that.data.machineNO,(res)=>{                            // 判断是否支持头盔锁
            that.sendLocation(() => {
              let borrowBike_url = app.globalData.baseUrl + "machine/borrowBike.do";
              let borrowBike_param = {
                userCode: that.data.machineNO,
                token: token,
                orderSource: 3
              };
              that.alreadyUnlock = true;                                                  // 已经开锁 
              wx.setStorage({
                key: 'openTime',
                data:(new Date())
              })
              util.request(borrowBike_url, borrowBike_param, function (resp,res1) {
                if( !app.globalData.serveTime ){
                  app.globalData.serveTime = new Date((res1.header.Date).replace(/-/g, "/")).getTime()
                }
                if (resp.ret) {
                  if(app.globalData.isNeedFaceRecognize){
                    app.globalData.faceRecognize = false;                               // 不管需不需要人脸识别，
                  }
                  wx.hideToast();
                  app.globalData.isRiding = true 
                  wx.redirectTo({
                    url: '../openLock/openLock?machineNO=' + that.data.machineNO
                  })
                } else if (resp.code == '-3004') {                                          //  没有出现过
                  wx.hideLoading();
                  wx.hideToast();
                  that.alreadyShowRechargeModal = true;
                  wx.showModal({
                    title: '温馨提示',
                    content: "骑行最低充值金额为" + that.rechargeBase + "元，请前往充值！",
                    confirmText: '前往充值',
                    success: (res) => {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '../recharge/recharge'
                        })
                      }
                    }
                  })
                }  else {                                                                   // 其他异常情况
                  wx.hideLoading();
                  wx.hideToast();
                  wx.showModal({
                    title: '温馨提示',
                    content: resp.msg
                  })
                }
              });
            })
           });
        }
      }
    });
  },

  // 蓝牙开锁成功后，网络上报
  borrowBicycle() {
    let that = this;
    app.checkToken(function (token) {
      if (token.length > 0) {
        let url = app.globalData.baseUrl + "machine/borrow.do";
        let param = {
          userCode: that.data.userCode,
          token
        };
        util.request(url, param, (res) => {
          console.log("***单车借车：", res);
          if (res.ret) {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 700)
          }
        })
      }
    })
  },

  knownTap () {                                // 关闭蓝牙引导
    this.setData({
      guideDialog: false,
    })
  },

  onHide: function () {                         // 监听页面隐藏
    console.log("---- 页面隐藏 ----")
    wx.hideLoading();
    this.bluetooth_new.end();
  },
  
   // 给政府上传车辆信息
  sendMsgToMonitor(lon , lat, machineNO, cb){
    // console.log(lon , lat, machineNO, cb);
    // cb && cb();
    // return;
    console.log('873');
    if( !lon || !lat){                            // 这里是为了防止部分安卓手机拿不到经纬度
      cb && cb();
      return;
    }
     let url = "https://push.bxkuaizu.com/bxkz/unlockVerify";
     let param =  {
       companyId: "baixing",
       recordNo: machineNO,
       longi: lon || app.globalData.locationInfo.longitude,
       lati: lat || app.globalData.locationInfo.latitude,
       type: "1",  //电单车
     };
       wx.request({
       url: url,
       data:{
         param:JSON.stringify(param)
       },
       timeout: 500,    //小程序 -> 后台 -> 后台请求城管局(100ms) -> 城管局 -> 后台 -> 小程序  先预定 500ms
       success(res){
        //  console.log(res);
         var res = res.data;
         if(res.ret && res.data){
           let data = JSON.parse(res.data);
          //  console.log(data,"8888888888");
            if(data.code == 1){
              cb && cb()
            }else{
              wx.hideToast();
              // cb && cb()
               util.showModal_nocancel("该车辆未进行备案，请扫码其他车辆!");
            }
         }
        //  console.log(res.data)
       },
       fail(err){
         if (err.errMsg == "request:fail timeout") {    //超时回复 -> 借车
          //  content = "登录失败：请求超时";
           cb && cb()
         }
       }
     })
   },
})