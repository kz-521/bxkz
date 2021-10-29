var app = getApp()
var util = require('../../../utils/util')
var appColor = require('../../../utils/config.js').appColor;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:'', // 当前所故障部位
    machineNO: '',
    fault: '',
    unselect:[],
    select:'',
    table1:[{ index:0,name:'电门把手',class:false }, { index:1,name:'车铃铛',class:false }, { index:2,name:'刹车',class:false }, { index:3,name:'二维码',class:false },],
    table2:[{ index:0,name:'没电不走',class:false }, { index:1,name:'车辆异响' ,class:false }, { index:2,name:'车身刮涂',class:false }, ],
    table3:[{ index:0,name:'前大灯',class:false }, { index:1,name:'车筐',class:false }, { index:2,name:'头盔',class:false }, { index:3,name:'头盔锁',class:false },],
    table4:[{ index:0,name:'坐垫',class:false,margin:'0 7px 0 0' }, { index:1,name:'车后架',class:false,margin:'0 7px 0 0' }, { index:2,name:'后灯',class:false },{ index:3,name:'二维码',class:false,margin:'0 7px 0 0' }, { index:4,name:'车牌',class:false,margin:'0 7px 0 0' }, ],
    table5:[{ index:0,name:'前挡泥板',class:false }, { index:1,name:'前轮',class:false }, { index:2,name:'前避震',class:false }],
    table6:[{ index:0,name:'脚踏',class:false },     { index:1,name:'脚撑',class:false }, { index:2,name:'车链条',class:false }],
    table7:[{ index:0,name:'后挡泥板',class:false }, { index:1,name:'后轮',class:false }, { index:2,name:'后减震' ,class:false }],
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
    advice: '',
    title: '',
    mainColor: '',
    textColor: '',
    tempFilePaths: '',
    imageIds: false,
    picture: ''
  },

  change(e) {
    let that = this 
  if( e.currentTarget.dataset.num == 1) {
    let flag = false
    that.data.table1.forEach(item=>{
      if(item.class){
        flag = true
      } 
    })
    if (flag == true ) {
      that.setData({
        current: 1
      })
    }else{
      that.setData({
        error1 :!that.data.error1,
        current: 1
      })
    }
  }
  if( e.currentTarget.dataset.num == 2) {
    let flag = false
    that.data.table2.forEach(item=>{
      if(item.class){
        flag = true
      } 
    })
    if (flag == true ) {
      that.setData({
        current: 2
      })
    }else{
      that.setData({
        error2 :!that.data.error2,
        current: 2
      })
    }
  }
  if( e.currentTarget.dataset.num == 3) {
    let flag = false
    that.data.table3.forEach(item=>{
      if(item.class){
        flag = true
      } 
    })
    if (flag == true ) {
      that.setData({
        current: 3
      })
    }else{
      that.setData({
        error3 :!that.data.error3,
        current: 3
      })
    }
  }
  if( e.currentTarget.dataset.num == 4) {
    let flag = false
    that.data.table4.forEach(item=>{
      if(item.class){
        flag = true
      } 
    })
    if (flag == true ) {
      that.setData({
        current: 4
      })
    }else{
      that.setData({
        error4 :!that.data.error4,
        current: 4
      })
    }
  }
  if( e.currentTarget.dataset.num == 5) {
    let flag = false
    that.data.table5.forEach(item=>{
      if(item.class){
        flag = true
      } 
    })
    if (flag == true ) {
      that.setData({
        current: 5
      })
    }else{
      that.setData({
        error5 :!that.data.error5,
        current: 5
      })
    }
  }
  if( e.currentTarget.dataset.num == 6) {
    let flag = false
    that.data.table6.forEach(item=>{
      if(item.class){
        flag = true
      } 
    })
    if (flag == true ) {
      that.setData({
        current: 6
      })
    }else{
      that.setData({
        error6:!that.data.error6,
        current: 6
      })
    }
  }
  if( e.currentTarget.dataset.num == 7) {
    let flag = false
    that.data.table7.forEach(item=>{
      if(item.class){
        flag = true
      } 
    })
    if (flag == true ) {
      that.setData({
        current: 7
      })
    }else{
      that.setData({
        error7 :!that.data.error7,
        current: 7
      })
    }
  }
  },
  /**
   * 拍照上传
   */
  chooseImage: function (e) {                                 //  this.c hangeLock(true);
    wx.chooseImage({
      count: 1,                                               //最多可以选择的图片总数  
      sizeType: ['compressed'],                               // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['camera'],
      success: (res) => {
        console.log(res);
        let temp = res.tempFilePaths;
        this.setData({
          imgUrls: [temp],
          picture: temp,
          imageIds: true
        })
      },
      fail: (err) => {
        console.log(err);
      }
    });
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

  getError(e) {
    let that = this 
    console.log(e);
    let type = e.currentTarget.dataset.type
    let item = parseInt(e.currentTarget.dataset.item)
        if(type == 1 ) { 
    let theClass = "table1[" + item + "].class"
    if(  that.data.select.indexOf(that.data.table1[item].name) == -1) {
      that.setData({
      [theClass] : !that.data.table1[item].class,
      select: that.data.select + ',' + that.data.table1[item].name 
    })
    }else{
      that.setData({
        [theClass] : !that.data.table1[item].class,
        select:   that.data.select.replace((','+ that.data.table1[item].name ),'')
      })
    }
    }else if(type == 2) {
      let theClass = "table2[" + item + "].class"
        that.setData({
          [theClass] : !that.data.table2[item].class,
          select:   that.data.select + ',' + that.data.table2[item].name
        })
    }else if(type == 3) {
      let theClass = "table3[" + item + "].class"
        that.setData({
          [theClass] : !that.data.table3[item].class,
          select: that.data.select + ',' + that.data.table3[item].name 
        })
    }else if(type == 4) {
      let theClass = "table4[" + item + "].class"
      that.setData({
        [theClass] : !that.data.table4[item].class,
        select:  that.data.select + ',' + that.data.table4[item].name 
      })
    }else if(type == 5) {
      let theClass = "table5[" + item + "].class"
      that.setData({
        [theClass] : !that.data.table5[item].class,
        select: that.data.select + ',' + that.data.table5[item].name
      })
    }else if(type == 6) {
      let theClass = "table6[" + item + "].class"
      that.setData({
        [theClass] : !that.data.table6[item].class,
        select:   that.data.select + ',' + that.data.table6[item].name 
      })
    }else if(type == 7) {
      let theClass = "table7[" + item + "].class"
      that.setData({
        [theClass] : !that.data.table7[item].class,
        select: that.data.select + ',' + that.data.table7[item].name 
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
    if (!machineNO) {   // 没有机器编号 
      wx.showToast({
        title: '请输入车辆编号',
        icon: 'none'
      })
      return;
    }
    if (that.data.select == "") {     //
      wx.showToast({
        title: '请选择故障类型！或输入备注说明',
        icon: 'none'
      })
      return;
    }
    if (that.data.select == "" && that.data.fault == "") {
      wx.showToast({
        title: '请输入备注说明',
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
            success: function (res) {    // 请求成功
              res = res.data;
              wx.hideToast();
              if (res.ret) {        // 有返回值
                util.showModal_nocancel('提交成功！', () => {
                  wx.navigateBack({
                  })
                })
                // wx.showToast({    // 上传成功 
                //   title: '上传成功',
                //   icon: 'success',
                //   duration: 4000,
                //   mask: true,
                //   success:function(res){    // 成功跳转回去
                //     // wx.navigateBack({
                //     // })
                //   }
                // })
              } else {
                if (res.code == "-30005") {  //车辆不存在
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
  // 红叉叉 删除图片
  deleteImage: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      imgUrls: [],
      imageIds: false,
      picture:[]
    });
    console.log(this.data.imgUrls);
  },


  /**
   * 选择建议类型问题类型 获取titile
   * @param {*} e 
   */
  selectAdvice: function (e) {
    let title = e.currentTarget.dataset.title;
    this.setData({
      title:title,
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

 /**
   * 输入车辆编号
   * @param {} e 
   */
  inputTitle: function (e) {
    console.log('输入车辆编号');
    this.setData({
      machineNO: e.detail.value
    })
  },

  /**
   * 问题反馈 意见提交 ...
   */
  commitAdvice: function(){
    if (app.globalData.locationInfo) {
      this.sendAdvice();
    } else {
      app.getLocationInfo('gcj02', (res) => {
        this.sendAdvice();
      })
    }
  },

  /**
   * 发送建议 标题建议赋值 判断两者是否有一个为空为空提示选择 判断是否是表情 提示请等候 ...
   */
  sendAdvice: function(){
    let title = this.data.title;
    let advice = this.data.advice;
    let picture = this.data.picture;
    let url = app.globalData.baseUrl + "machineFault/add.do";
    if (title.indexOf(' ') == 0 || title.length == 0) {
      wx.showToast({
        title: '请选择问题类型',
        icon: 'none'
      })
      return;
    }
    if (advice.indexOf(' ') == 0 || advice.length == 0) {
      wx.showToast({
        title: '请输入问题反馈',
        icon: 'none'
      })
      return;
    }
    if(util.isEmojiCharacter(advice)){
      wx.showToast({
        title: '请不要输入表情',
        icon:'none'
      });
      return;
    }
    wx.showToast({
      title: '请稍候...',
      icon: 'loading',
      mask: true,
      duration: 15000
    })
    // 参数
    // let param = {
    //   userCode: machineNO,
    //   faults: select,            //选择的故障
    //   remark: fault,             // 备注
    //   lo: app.globalData.locationInfo.longitude,
    //   la: app.globalData.locationInfo.latitude,
    //   mapType: 2
    // };
    app.checkToken((token) => {
      if (token.length > 0) {
        let url = app.globalData.baseUrl + "suggestion/add.do";
        let param = {
          token: token,
          title: title,
          content: advice,
          accountId: app.globalData.accountId,
          lo: app.globalData.locationInfo.longitude,
          la: app.globalData.locationInfo.latitude,
          mapType: 2,
        };
        util.request(url, param, (res) => {
          wx.hideToast();
          if (res.ret) {
            util.showModal_nocancel('提交成功！', () => {
              wx.navigateBack({

              })
            })
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 3000
            })
          }
        })
      }
    })
  },
  uploadImg: function (picture, param, cb) {

    wx.showToast({
      title: '正在上传...',
      icon: 'loading',
      duration: 10000,
      mask: true
    })
    wx.uploadFile({
      url: app.globalData.baseUrl + 'machineFault/add.do',
      filePath: picture[0],
      name: `files`,
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        token: param.token,
        userCode: param.userCode,
        faults: param.faults,
        remark: param.remark,
        lo:param.lo,
        la: param.la,
        mapType: param.mapType
      },
      success: (resp) => {
        console.log('图片上传', resp.data)
        var resp = JSON.parse(resp.data);
        if (resp.ret) {
          wx.hideLoading();
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 2000,
            mask: true
          })
          let imageIds = this.data.imageIds;
          let imgUrls = this.data.imgUrls;
          if (imgUrls[0].indexOf('/images/image') > -1) {
            console.log("调用了");
            imageIds = false;
            imgUrls = [];
          }
          this.setData({
            imageIds,
          })
          cb && cb(true)
        } else {
          wx.hideLoading();
          if(resp.code == "-30005"){
            wx.showToast({
              title: "车辆不存在",
              icon: 'none'
            });
          }else{
            wx.showToast({
              title: resp.msg,
              icon: 'none'
            });
          }
          this.setData({
            imageIds: false,
            machineNO: ''
          })
          cb && cb(false)
        }
      },
      fail: (res) => {
        console.log('错误信息：' + res);
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.userCode) ;
    if(options.userCode) {      //跳转页面携带参数 赋值给车辆编号
    this.setData({        
      machineNO: options.userCode
    })
  }
    app.globalData.userTrack.push(['/advice','/意见反馈']);
    this.setData({
      mainColor: app.globalData.mainColor,
      textColor: app.globalData.textColor
    })
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