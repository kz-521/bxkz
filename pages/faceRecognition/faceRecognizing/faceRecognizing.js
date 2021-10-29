// pages/takephoto/takephoto.js
// import wxRequest from '../../../utils/wxRequest'
// import regeneratorRuntime from '../../../utils/regenerator'
// const { $Message } = require('../../../dist/iview/base/index')
const app = getApp()
const util = require("../../../utils/util");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageHost: app.globalData.imageHost,
    count: 0, // 设置 计数器 初始为0
    countTimer: null, // 设置 定时器 初始为null
    complete: false,
    mainColor: '#81be48',
    textColor: '#000000',
    userCode: '',
    base64Str: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mainColor: app.globalData.mainColor ,
      textColor: app.globalData.textColor 
    });
    let machineNO = options.machineNO;
    this.setData({
      userCode: machineNO
    });
  },
  onReady: function () {
    if (wx.createCameraContext()) {
      // this.cameraContext = wx.createCameraContext('myCamera')
      // this.drawProgressbg();
      // this.drawCircle();
      // this.countInterval();
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

  },
  takePhoto() {
    wx.showToast({
      title: '正在验证',
      icon: "loading",
      duration: 15000,
      mask: true
    });
    var ctx = wx.createCameraContext()
    var that = this
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log(res.tempImagePath);
        wx.getFileInfo({
          filePath: res.tempImagePath,
          success(res) {
            console.log(res.size / 1024, '拍照后的大小');
          }
        })
        wx.compressImage({
          src: res.tempImagePath,
          quality: 10,
          success(resp) {
  
            wx.getFileInfo({
              filePath: resp.tempImagePath,
              success(res) {
                console.log(res.size / 1024, '压缩后的大小');
              }
            })
            var base64Str = wx.getFileSystemManager().readFileSync(resp.tempFilePath, "base64");
            that.setData({
              base64Str
            });
            wx.getScreenBrightness({
              success: (screenRes) => {
                wx.setScreenBrightness({
                  value: 1,
                  success() {
                    that.uploadImg(screenRes.value)
                  },
                })
              },
            })
          },
          fail(errr) {
        console.log("2");

            console.log(errr, "000000000");
          }
        })

      },
      fail(err){
        console.log("拍照失败");
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },
  startdrawCanvas() {
    console.log('相机初始化成功')
  },

  uploadImg(screenValue) {
    let that = this;
    let url = app.globalData.baseUrl + "user/faceCheck.do";
    let userCode = app.globalData.machineNO;
    let base64Str = this.data.base64Str;
    let param = {
      userCode,
      base64Str,
    }
    app.checkToken(token => {
      if (token.length > 0) {
        param.token = token;
        wx.request({
          url: url,
          data: param,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          timeout: 15000,
          success(res) {
            res = res.data;

            if (res.ret) {
              wx.hideToast();
              // console.log("验证成功");
              wx.showToast({
                title: '人脸识别通过',
                icon: "success",
                success() {
                  app.globalData.faceRecognize = true;
                  wx.setScreenBrightness({
                    value: screenValue,
                    success() {
                      wx.redirectTo({
                        url: '../../machineStatus/machineStatus?machineNO=' + app.globalData.machineNO
                      })
                    }
                  })

                }
              })
            } else {
              wx.hideToast();
              console.log(res);
              if (res.code == "-20008") {
                util.showModal("人脸识别失败", () => {

                  // that.takePhoto();
                });
              }
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }
          },
          fail(err) {
            wx.hideToast();
            let content = '';
            if (err.errMsg == "request:fail timeout") {
              content = "认证失败：请求超时";
            }
            wx.showModal({
              title: '温馨提示',
              content,
              showCancel: false
            })
          }
        })
      }
    });




    //  app.checkToken(token=>{
    //    if(token.length > 0){
    //      param.token = token;
    //      util.request(url,param,(res)=>{
    //        wx.hideToast();
    //       console.log(res,"11111111111111111");
    //       if(res.ret){
    //         console.log("验证成功");
    //         wx.showToast({
    //           title: '人脸识别通过',
    //           icon:"success",
    //           success(){
    //             wx.redirectTo({
    //               url: '../../machineStatus/machineStatus',
    //             })
    //           }
    //         })
    //       }
    //     });
    //    }

    //  });





    // var res = await wxRequest.post('http://10.18.31.67:8881/face/byte/api/search?imgByte=' + url, {
    //   imgByte: url
    // })
    // console.log(res)
    // if(res.code == 200){
    //   if (res.data.faceMsg == 'pic not has face'){
    //     this.goBack('未捕获到人脸，请重新录入！')
    //   } else if (res.data.faceMsg == 'liveness check fail') {
    //     this.goBack('人脸匹配失败，请重新录入！')
    //   } else {
    //     $Message({
    //       content: '正在跳转',
    //       type: 'success'
    //     });
    //     wx.navigateTo({
    //       url: '../completeFetch/completeFetch'
    //     })
    //   }
    // }else{
    //   this.goBack('网络错误，请重新录入！')
    // }
  },
  goBack(info) {
    $Message({
      content: info,
      type: 'error'
    });
    setTimeout(function () {
      wx.navigateBack();
    }, 2000)
  },


  drawProgressbg: function () {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg')
    ctx.setLineWidth(5); // 设置圆环的宽度
    ctx.setStrokeStyle('#a9a9a9'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath(); //开始一个新的路径
    ctx.arc(110, 110, 100, 0, 2 * Math.PI, false);
    //设置一个原点(100,100)，半径为90的圆的路径到当前路径
    ctx.stroke(); //对当前路径进行描边
    ctx.draw();
  },
  drawCircle: function (step) {
    var context = wx.createCanvasContext('canvasProgress');
    // 设置渐变
    var gradient = context.createLinearGradient(200, 100, 100, 200);
    gradient.addColorStop("0", "#2661DD");
    gradient.addColorStop("0.5", "#2661DD");
    gradient.addColorStop("1.0", "#2661DD");
    context.setLineWidth(5);
    context.setStrokeStyle(gradient);
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(110, 110, 100, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw()
  },
  countInterval: function () {
    // 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈
    this.countTimer = setInterval(() => {
      if (this.data.count <= 60) {
        /* 绘制彩色圆环进度条
        注意此处 传参 step 取值范围是0到2，
        所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
        */
        this.drawCircle(this.data.count / (60 / 2))
        this.data.count++;
      } else {
        this.setData({
          complete: true
        });
        clearInterval(this.countTimer);
      }
    }, 100)
  },
  startPhoto: function () {

    this.takePhoto()
  }
})