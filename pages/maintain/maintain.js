// pages/maintain/maintain.js
var app = getApp()
var util = require('../../utils/util.js')
var appColor = require('../../utils/config.js').appColor;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    machineNO: '',
    fault: '',
    imgUrls:[],
    imageIds: false, 
    error1:true,
    error2:true,
    error3:true,
    error4:true,
    error5:true,
    error6:true,
    error7:true,
    carError:false,
  },

  change(e) {
    let that = this 
  if( e.currentTarget.dataset.num == 1) {
    this.setData({
      error1 :!that.data.error1
    })
  }
  if( e.currentTarget.dataset.num == 2) {
    this.setData({
      error2 : !that.data.error2
    })
  }
  if( e.currentTarget.dataset.num == 3) {
    this.setData({
      error3 : !that.data.error3
    })
  }
  if( e.currentTarget.dataset.num == 4) {
    this.setData({
      error4 : !that.data.error4
    })
  }
  if( e.currentTarget.dataset.num == 5) {
    this.setData({
      error5 : !that.data.error5
    })
  }
  if( e.currentTarget.dataset.num == 6) {
    this.setData({
      error6 : !that.data.error6
    })
  }
  if( e.currentTarget.dataset.num == 7) {
    this.setData({
      error7: false
    })
  }
  },

  getError() {
    this.setData({
      carError: !this.data.carError
    })
  },
  /**
   * 提交
   */
  commitFault: function () {
    if (app.globalData.locationInfo) {
      this.sendFault();
    } else {
      app.getLocationInfo('gcj02', (res) => {
        this.sendFault();
      })
    }
  },

  /**
   * 发送故障
   */
  sendFault: function () {
    let that = this;
    let machineNO = that.data.machineNO;
    let fault = that.data.fault;
    let select = that.data.select;
    let picture = that.data.picture;
    let url = app.globalData.baseUrl + "machineFault/add.do";
    if (that.data.select == "") {
      wx.showToast({
        title: '请选择故障类型！',
        icon: 'none'
      })
      return;
    }
    if (that.data.select == "其他" && that.data.fault == "") {
      wx.showToast({
        title: '请输入备注说明',
        icon: 'none'
      })
      return;
    }
    if (!machineNO) {
      wx.showToast({
        title: '请输入车辆编号',
        icon: 'none'
      })
      return;
    }
    wx.showToast({
      title: '正在上传...',
      icon: 'loading',
      mask: true,
      duration: 5000
    })
    let param = {
      userCode: machineNO,
      faults: select,            //选择的故障
      remark: fault,             // 备注
      lo: app.globalData.locationInfo.longitude,
      la: app.globalData.locationInfo.latitude,
      mapType: 2
    };
    app.checkToken((token) => {
      if (token.length > 0) {
        param.token = token;
        if (picture && picture.length != 0) {
          that.uploadImg(picture,param, (res) => {
            if (res) {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
              }, 1000);
            }

          });
        } else {
          wx.request({
            url: url,
            data: param,
            success: function (res) {
              res = res.data;
              wx.hideToast();
              if (res.ret) {
                wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  duration: 2000,
                  mask: true,
                  success:function(res){
                    wx.navigateBack({
                    })
                  }
                })
              } else {
                if (res.code == "-30005") {
                  wx.showToast({
                    title: '车辆不存在',
                    icon: 'none'
                  });
                  that.setData({
                    machineNO: ''
                  });
                }
              }
            }
          })
        }
      }
    })
  },

  /**
   * 选择图片触发
   * @param {*} e 
   */
  chooseImage: function (e) {
    //  this.changeLock(true);
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['camera'],
      success: (res) => {
        console.log(res);
        let temp = res.tempFilePaths;
        this.setData({
          imgUrls: [temp],
          picture: temp,
          imageIds: true
        })
        console.log(this.imgUrls,'-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==--=imgUrls');
      },
      fail: (err) => {
        console.log(err);
      }
    });
  },

  /**
   * 开启扫码
   */
  openScanCode: function () {
    console.log("开启扫码");
    wx.scanCode({
      success: (res) => {
        let result = res.result;
        if (result.length == 0) {
          wx.showModal({
            title: '提示',
            content: '未识别到内容，请重新扫描!',
            showCancel: false,
            success: function (res) {
              return;
            }
          })
        } else {
          console.log("内部扫描内容:" + result);
          let machineNO = '';
          if (result.indexOf('?machineNO') > -1) {
            machineNO = result.split("=")[1];
          } else
            machineNO = result;

          this.setData({
            machineNO: machineNO
          })
        }
      }
    });
  },

  /**
   * 输入车辆编号
   * @param {} e 
   */
  inputTitle: function (e) {
    this.setData({
      machineNO: e.detail.value
    })
  },

  /**
   * 输入触发 设置值给fault
   * @param {*} e 
   */
  bindTextAreaBlur: function (e) {
    console.log('失去焦点 设置值给fault');
    this.setData({
      fault: e.detail.value
    })
  },

  // 红叉叉 删除图片
  deleteImage: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      imgUrls: [],
      imageIds: false,
      picture:[]
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})