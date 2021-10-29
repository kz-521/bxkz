// pages/openLock/openLock.js
let app = getApp();
let util = require('../../utils/util');
let appColor = require('../../utils/config.js').appColor;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: 'http://bxkz.oss-cn-hangzhou.aliyuncs.com/openLock.png',
    machineNO: '',
    flag: false,
    guideImage: '../../images/bluetooth_g_b.png',
    mainColor: '',
    textColor: '',
    progress_txt: '开锁中...',
    dotColor: '#fb9126',
    bluetoothState: '请手动打开手机蓝牙'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.globalData.noRefresh = false
   // app.globalData.userTrack.push(['/openLock','/开锁']);
    this.aminCount = 0;
    this.countTimer = null;
    this.setData({
      mainColor: app.globalData.mainColor,
      textColor: app.globalData.textColor,
      machineNO: options.machineNO
    })
    if (app.globalData.mobileOS.indexOf("iOS") > -1) {
      this.setData({
        guideImage: '../../images/bluetooth_g_a.png'
      })
    }
    this.lock = false
  },

  //画内圆
  drawProgressbg: function () {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg', this)
    ctx.setLineWidth(4);// 设置圆环的宽度
    ctx.setStrokeStyle('#20183b'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath();//开始一个新的路径
    ctx.arc(130, 130, 120, 0, 2 * Math.PI, false);
    //设置一个原点(110,110)，半径为100的圆的路径到当前路径
    ctx.stroke();//对当前路径进行描边
    ctx.draw();
  },

  //画外圆
  drawCircle: function (step) {
    var context = wx.createCanvasContext('canvasProgress', this);
    // 设置渐变
    var gradient = context.createLinearGradient(200, 100, 100, 200);
    gradient.addColorStop("0", "#2661DD");
    gradient.addColorStop("0.5", "#40ED94");
    gradient.addColorStop("1.0", "#5956CC");

    context.setLineWidth(10);
    context.setStrokeStyle(gradient);
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(130, 130, 120, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw()
  },

  //动画渲染
  countInterval: function (step,speed) {
    return new Promise((resolve) => {
      if (!speed)
        speed = 50;
      // 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈
      this.countTimer = setInterval(() => {
        //console.log('come', step, speed);
        if (this.aminCount <= step) {
          /* 绘制彩色圆环进度条  
          注意此处 传参 step 取值范围是0到2，
          所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
          */
          this.drawCircle(this.aminCount / (100 / 2))
          this.aminCount++;
        } else {
          clearInterval(this.countTimer);
          resolve();
        }
      }, speed)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.drawProgressbg();
    this.openLock();
    //this.countInterval(90);
  },

  openLock: function(){
    let that = this;
    let count = 0;
    app.checkToken((token) => {
      let timer = null;
      if (token.length > 0)
        timer = setInterval(() => {
          if(!this.lock){
            this.lock = true;
            count++;
            console.log(count);
            if (count > 9) {
              clearInterval(timer);
              timer = null;
              this.bluetoothOpenLock();
              this.lock = false;
              return;
            }
            this.countInterval(Math.floor(count * 10), 50).then(() => {
              let url = app.globalData.baseUrl + 'machine/getBorrowing.do';
              let param = {
                token: token
              };
              util.request(url, param, (resp) => {
                console.log(resp);
                if(resp.data) {
                if (resp.data.machineNO ) { 
                 console.log('开锁成功,耗时:' + count + "s");
                  app.globalData.isShowHelMetTip = true;                                                                               // 判断是否需要打开头盔锁引导图
                  clearInterval(timer);
                  timer = null;
                  this.countInterval(100, 10).then(() => {
                    app.bluetooth.end();
                    app.unlockAudio();
                    this.setData({                          // 开锁
                      dotColor: '#68dd32',
                      progress_txt: '开锁成功'
                    })
                    app.globalData.isRiding = true          // 在骑行 状态
                    setTimeout(() => {                       // 0.7秒后返回map   
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 700)
                    this.lock = false;
                  });
                }else{
                  this.lock = false;              
                }
              } else {
                this.lock = false;
              }                 
              },()=>{
                this.lock = false;
              });
            });
          }
        }, 1000);
    });
  },

  retry: function(){
    this.setData({
      flag: false,
    })
    this.bluetoothOpenLock();
  },

  //蓝牙开锁
  bluetoothOpenLock: function () {
    wx.openBluetoothAdapter({
      success: (res) => {
        this.setData({
          progress_txt: '启用蓝牙开锁'
        })
        app.checkToken((token) => {
          this.setData({
            progress_txt: '蓝牙开锁中...'
          })
          if (token.length > 0) {
            app.operateBluetooth('open', app.globalData.machineNO, (flag) => {
              if(flag){
                let url = app.globalData.baseUrl + 'machine/borrowBike.do';
                let param = {
                  userCode: app.globalData.machineNO,
                  token: token,
                  ble: true,
                  orderSource: 3
                };
                util.request(url, param, (resp) => {
                  if (resp.ret) {
                    this.countInterval(100, 10).then(() => {
                      if(app.globalData.isSupportHelMet){
                        // app.openHelMetLock(this.data.machineNO,false);
                      }
                      app.unlockAudio();
                      app.globalData.isShowHelMetTip = true;  // 判断是否需要打开头盔锁引导图
                      this.setData({
                        dotColor: '#68dd32',
                        progress_txt: '蓝牙开锁成功'
                      })
                      app.globalData.isRiding = true 
                      console.log(app.globalData.isRiding);
                      setTimeout(() => {
                        wx.navigateBack({
                          delta: 1
                        })
                      }, 700)
                    })
                  }
                });
              } else {
                util.showModal_nocancel('蓝牙操作失败，请重试！',()=>{
                  wx.navigateBack({
                    delta: 2
                  })
                })
              }
            });
          }
        })
      },
      fail: (err) => {
        console.log(err);
        if (err.errCode == '10001' || err.errCode == '10008') {
          this.setData({
            flag: true,
            bluetoothState: '请手动打开手机蓝牙'
          })
        }
      }
    })

  },

})