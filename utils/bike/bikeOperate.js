let app = getApp()
let util = require('../util.js')

function BikeOperate(){
  let _threadTimer_park = null;
  let _threadTimer = null;
  let _returnBikeTime = 0;

  this.returnBike = (res, dispatchType, cb) => {
    console.log('正在 returnBike 正在还车 22');
    wx.showToast({
      title: '正在还车',
      icon: 'loading',
      mask: true,
      duration: 15000
    })
    app.checkToken(function (token) {
      if (token.length > 0) {
        let url = app.globalData.baseUrl + 'machine/returnBike.do';
        let param = {
          token: token,
          dispatchType: dispatchType,
          orderSource: 3
        }
        if (res != undefined && res !== '' && typeof res.latitude !== 'undefined') {                    //通过手机定位确定站点位置时需要传参
          param.la = res.latitude;  
          param.lo = res.longitude;
        }
        console.log(param);
        util.request(url, param, function (respo) {
          console.log(respo);
          if (respo.ret) {
            _checkMachineBorrow(10, function (isReturn) {
              console.log(isReturn);
              // console.log(isReturn,"11111111111111111");
              if(isReturn == 'rfid'){
                // console.log("rfid返回还车的界面");
                wx.hideToast();
                cb && cb('rfid');
              }else if (isReturn && isReturn!= 'rfid') {                                                  // console.log("rfid返回还车的界面");
                app.lockAudio();                                                                          // 锁车语音
                wx.hideToast();                                                                           // 隐藏toast
                cb && cb('success')
              }  else {
                wx.hideToast();
                cb && cb('timeout')
              }
            })
          } else if (respo.code === '-3008') { //还车不在站点/在禁停区
            // 两次判断不在站点，转蓝牙。
            if (_returnBikeTime >= 2) {
              // util.log(app.globalData.machineNO, app.globalData.mobileBrand, app.globalData.mobileOS, `小程序终端不在站点判断两次，${app.globalData.version}`, function () {               
              // });
              _returnBikeTime = 0;
              wx.hideToast();
              cb('-3008')
            } else {
              _returnBikeTime++;
              let tips = '', confirmText = '';
              if (app.globalData.modelType == 0) { // 站点模式
                tips = '车辆不在站点，请骑到站点内还车哦!如果已经在站点，请重试!';
                confirmText = '好的';
              } else if (app.globalData.modelType == 1) { // 禁停区模式
                tips = '车辆在禁停区内，请骑到禁停区外还车哦!如果已经在禁停区外，请重试!';
                confirmText = '好的';
              }
              setTimeout(function () {
                wx.hideToast();
                wx.showModal({
                  title: '',
                  content: tips, 
                  confirmText,
                  confirmColor: '#65ae56',
                  showCancel: false,
                })
              }, 2000); //后台会发送立即定位指令。两秒后提示。
            }
          } else if (respo.code == '-3006'){
            cb('-3006')
          } else if (respo.code === '-3004') {
            wx.hideToast();
            cb('-3004', respo.data)
          } else if (respo.code === '-3050') {
            wx.hideToast();
            wx.showModal({
              content: respo.msg,
              confirmColor: '#65ae56',
              showCancel: false,
            })
          }else if(respo.code == '-160005'){
            wx.hideToast();
            cb('-160005');
          }
        });
      }
    })
  }

  this.getOrderStatus = (cb) => {
    _checkMachineBorrow(10, function (isReturn) {
      if (isReturn) {  
        app.lockAudio();
        wx.hideToast();
        cb && cb('success')
      } else {
        wx.hideToast();
        cb && cb('timeout')
      }
    })
  }

  this.tempPark = (cb) => {
    wx.showToast({
      title: '正在停车',
      icon: 'loading',
      mask: true,
      duration: 15000
    })
    app.checkToken(function (token) {
      if (token.length > 0) {
        let url = app.globalData.baseUrl + 'park/parkRide.do';
        let param = {
          token: token,
          orderSource: 3
        };
        util.request(url, param, function (resp) {
          if (resp.ret) {
            _checkMachineLocked(10, 'lock', function (isLock) {
              if (isLock) {
                app.lockAudio();
                wx.hideToast();
                cb && cb(true);
              } else { //更新锁车的状态
                wx.hideToast();
                cb && cb(false);
              }
            });
          }
        });
      }
    })
  }

  this.continueRide = (cb) => {
    wx.showToast({
      title: '请稍候',
      icon: 'loading',
      mask: true,
      duration: 15000
    })
    app.checkToken(function (token) {
      if (token.length > 0) {
        let url = app.globalData.baseUrl + 'park/continueRide.do';
        let param = {
          token: token,
          orderSource: 3
        };
        util.request(url, param, function (respo) {
          if (respo.ret) {
            _checkMachineLocked(10, 'unlock', function (isLock) {
              if (isLock) {
                wx.hideToast();
                cb && cb(true);
              } else { //更新锁车的状态
                app.unlockAudio();
                wx.hideToast();
                cb && cb(false);
              }
            });
          }
        });
      }
    })
  }

  //轮询借车状态
  const _checkMachineBorrow = (time, cb) => {
    console.log('1232132131');
    app.checkToken(function (token) {
      if (token.length > 0) {
        if (_threadTimer) {
          clearInterval(_threadTimer);
          _threadTimer = null;
        }
        let isOk = true;
        let count = 0;
        _threadTimer = setInterval(function () {
          if (isOk) {
            isOk = false;
            let url = app.globalData.baseUrl + 'machine/getBorrowing.do';
            let param = {
              token: token
            };
            util.request(url, param, function (resp) {
              console.log(resp);
              if(resp.data) {
                console.log(resp);
                let data = resp.data  
              if (data.machineNO  && data.errorCode != 50005) {
                count++;
                if (count > time) {
                  clearInterval(_threadTimer);
                  cb && cb(false);
                }
              }else if( data.machineNO  && data.errorCode != undefined && data.errorCode == 50005){
                // console.log("rfid界面");
                 clearInterval(_threadTimer);
                 cb && cb('rfid')
              } else  { //还车成功
                console.log('还车成功还车成功还车成功还车成功还车成功还车成功还车成功还车成功还车成功还车成功还车成功还车成功还车成功');
                clearInterval(_threadTimer);
                cb && cb(true);
              }
            } else {   // 新加的代码
              clearInterval(_threadTimer);
              cb && cb(true);
            }
              isOk = true;
            }, () => {
              isOk = true;
            })
          }
        }, 1024);
      }
    });
  }

  //轮询锁车状态
  const _checkMachineLocked = (time, wantType, cb) => {
    app.checkToken(function (token) {
      if (token.length > 0) {
        if (_threadTimer_park) {
          clearInterval(_threadTimer_park);
          _threadTimer_park = null;
        }
        let finishFlag = true;
        let count = 0;
        _threadTimer_park = setInterval(function () {
          if (finishFlag) {
            finishFlag = false; //关闭入口
            let url = app.globalData.baseUrl + 'park/getByUserId.do';;
            let param = {
              token: token
            };
            util.request(url, param, function (resp) {
              if (wantType == 'lock') {
                if (resp.data && resp.data.length != 0) {
                  clearInterval(_threadTimer_park);
                  cb && cb(true);
                } else {
                  count++;
                  if (count > time) {
                    clearInterval(_threadTimer_park);
                    cb && cb(false);
                  }
                }
              } else if (wantType == 'unlock') {
                if (resp.data && resp.data.length != 0) {
                  count++;
                  if (count > time) {
                    clearInterval(_threadTimer_park);
                    cb && cb(true);
                  }
                } else {
                  clearInterval(_threadTimer_park);
                  cb && cb(false);
                }
              }
              finishFlag = true;
            }, () => {
              finishFlag = true;
            })
          }
        }, 1024);
      }
    });
  }

  //开锁 蓝牙
  this.openLock = (operateType, cb, dispatchType) => {
    console.log('1、蓝牙临时停车 2、蓝牙继续骑行 3、蓝牙还车---',operateType)
    //operateType 1、蓝牙临时停车 2、蓝牙继续骑行 3、蓝牙还车
    if (operateType == 1) {
      wx.showToast({
        title: '上锁中',
        icon: 'loading',
        mask: true,
        duration: 15000
      })
    
      //为了兼容新中控可以临时锁车
      let url_1 = app.globalData.baseUrl + 'machine/checkNewParkVoice.do';
      let parm_1 = {
      userCode : app.globalData.machineNO
      };
      util.request(url_1,parm_1,(resp) => {
        console.log("兼容临时停车新语音:",resp)
        if(resp.ret){
            _tempBluePark('temp'); //新中控有临时锁车语音
        }else{
           _tempBluePark('close'); //旧中控无临时锁车语音
        }
      });

   //   _tempBluePark('close');
       
    } else if (operateType == 2) {
      wx.showToast({
        title: '开锁中',
        icon: 'loading',
        mask: true,
        duration: 15000
      })
      app.checkToken((token) => {
        if (token.length > 0) {
          app.operateBluetooth('open', app.globalData.machineNO, (flag)=>{
            if(flag){
              let url = app.globalData.baseUrl + 'park/continueRide.do';
              let param = {
                token: token,
                ble: true,
                orderSource: 3
              };
              util.request(url, param, (resp) => {
                if (resp.ret) {
                  wx.hideToast();
                  app.unlockAudio();
                  cb && cb();
                }
              })
            }else{
              util.showModal_nocancel('蓝牙操作失败，请重试！')
            }
          })
        }
      })
    } else if (operateType == 3) {
      wx.showToast({
        title: '上锁中',
        icon: 'loading',
        mask: true,
        duration: 15000
      })
      console.log('执行蓝牙还车');
      this.judgePhoneLocation().then(([res,newDispatchType]) => {
        app.operateBluetooth('close', app.globalData.machineNO,(flag)=>{
          if(flag){
            console.log(newDispatchType);
            _bleReturnBike(res, cb, newDispatchType);
          } else {
            util.showModal_nocancel('蓝牙操作失败，请重试！')
          }
        });
      });
    }
  }
  const _tempBluePark = (type,cb) => {
    console.log('蓝牙临时锁车指令',type);
    app.checkToken((token) => {
      if (token.length > 0) {
        app.operateBluetooth(type,app.globalData.machineNO,(flag)=>{
            if(flag){
              let url = app.globalData.baseUrl + 'park/parkRide.do';
              let param = {
                token: token,
                ble: true,
                orderSource: 3
              };
              util.request(url, param, (resp) => {
                if (resp.ret) {
                  wx.hideToast();
                  app.lockAudio();
                  cb && cb();
                }
              })
            } else {
              util.showModal_nocancel('蓝牙操作失败，请重试！')
            }
          })
        }
      })
  }

  //判断手机位置是否在站点
  this.judgePhoneLocation = () => {
    return new Promise((resolve, reject) => {
      app.getLocationInfo('gcj02', (res)=>{
        // util.log(app.globalData.machineNO, app.globalData.mobileBrand, app.globalData.mobileOS, '位置已打开并成功执行')
        console.log(`位置:${JSON.stringify(res)}`);

        app.checkToken((token) => {
          if (token.length > 0) {
            let checkIn_url = app.globalData.baseUrl + 'dispatch/check.do';
            let checkIn_param = {
              token: token,
              userCode: app.globalData.machineNO,
              lo: res.longitude,
              la: res.latitude,
              mapType: 2
            }
            util.request(checkIn_url, checkIn_param, function (respo) {
              if (respo.ret) {
                let type = respo.data.type;
                if (type == 2) {
                  //util.showModal_nocancel('手机不在站点，请确认后重试');
                  wx.showModal({
                    title: '',
                    content: '手机不在站点，请确认后重试',
                    confirmText: '好的',
                    confirmColor: '#65ae56',
                    showCancel: false,
                  })
                } else {
                  resolve([res,type])
                }
              }
            })
          }
        })
      })
    })
  }

  //蓝牙还车
  const _bleReturnBike = (res, cb, dispatchType) => {
    console.log('BleReturnBike')
    app.checkToken((token) => {
      if (token.length > 0) {
        let url = app.globalData.baseUrl + 'machine/returnBike.do'
        let param = {
          lo: res.longitude,
          la: res.latitude,
          token: token,
          ble: true,
          orderSource: 3
        };
        if (dispatchType != undefined)
          param.dispatchType = dispatchType;
        console.log(param);
        util.request(url, param, function (resp) {
          if (resp.ret) {
            wx.hideLoading();
            app.lockAudio();
            cb && cb();
            // wx.navigateTo({ //跳转到订单
            //   url: '../../pages/order/order',
            // })
            //_toOrder();
          } else if (resp.code == '-3008'){
            wx.showModal({
              title: '温馨提示',
              content: '请在停车点内还车',
            })
            // wx.showModal({
            //   title: '',
            //   content: '车辆不在站点，请骑到站点内还车哦!如果已经在站点，请重试!',
            //   confirmText: '好的',
            //   confirmColor: '#65ae56',
            //   showCancel: false,
            // })
          } else if (resp.code == '-3004'){
            wx.showModal({
              title: '温馨提示',
              content: resp.msg,
            })
          }else{
            console.log(resp);
          }
        });
      }
    });
  }

  const _toOrder = () => {
    let url = app.globalData.baseUrl + 'rideLog/queryPage.do';
    wx.showToast({
      title: '正在查询订单',
      icon: 'loading',
      mask: true
    })
    app.checkToken((token) => {
      if (token.length > 0) {
        let param = { token: token, rowCount: 1, pageNO: 1 };
        util.request(url, param, (resp) => {
          wx.hideToast();
          app.globalData.historyItem = resp.data[0];
          wx.navigateTo({
            url: `/pages/historyOrder/historicalTrack/historicalTrack?action=order`,
          })
        });
      }
    });
  }

}

module.exports = BikeOperate