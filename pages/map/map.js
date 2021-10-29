let dataTransition = require('../../utils/bluetooth-wx-jssdk2.0/dataTransition_new');
let BikeOperate = require('../../utils/bike/bikeOperate.js');
let Bluetooth_new = require('../../utils/bluetooth-wx-jssdk2.0/bluetooth_new.js');
let util = require('../../utils/util.js');
let extraMap = require('../../utils/extraMap.js');
let app = getApp();
Page({
  data: {
    phone:'',
    buttons:[{text: '取消'}, {text: '确定',extClass:'button'}],  //弹出框按钮
    dialogShow: false,
    showMyInfo: false,
    items:[
      {index: 0,url:'../../images/myInfo/info1.png',title:'我的钱包'},
      {index: 1,url:'../../images/myInfo/info2.png',title:'优惠券'},
      {index: 2,url:'../../images/myInfo/info3.png',title:'会员卡'},
      {index: 3,url:'../../images/myInfo/info4.png',title:'骑行套餐'},
      {index: 4,url:'../../images/myInfo/info5.png',title:'我的消息',hasMessage:false},
      {index: 5,url:'../../images/myInfo/info6.png',title:'账单明细'},
      {index: 6,url:'../../images/myInfo/info7.png',title:'骑行记录'},
      {index: 7,url:'../../images/myInfo/info7.png',title:'退出登录'},
      // {index: 7,url:'../../images/myInfo/info7.png',title:'答题返充'},
    ],
    imgUrls: [],
    isHemetFalse: false,     // 头盔是否损坏
    forfeitNum:'19.9',      // 罚金金额
    forfeit: false,         // 控制罚金弹出层显示
    rideItem:[
      {event:'toGuide',src:'../../images/map/userhelp.png',text:"用户指南"},
      {event:'showRule',src:'../../images/map/rule.png',text:"计费规则"},
      {event:'recharge',src:'../../images/map/pay.png',text:"优惠充值"},
      {event:'toHelp',src:'../../images/map/kefu@3x1.png',text:"平台客服"},
    ],
    subkey:'VYUBZ-LNCCU-LJCVJ-2C6MK-U4CH5-N4BH7',
    lucency: false,
    setInterval4: '',
    swiperMapApp: false,
    needFlash: false,
    isLastPark: true, 
    noToApp: true,
    toMapApp: false,
    hadInput:false,
    keyword: '',
    textColor: '',
    suggest: [],
    isSearch:false,             // 是搜索状态
    notMove: false,
    isButtonLendHelmetShowTip:false,
    time1:'',
    isIos:true,
    // isNotAreaPhoto:false,       // 不在运营区新需求判定标志
    notArea: '',                // 不在运营区
    studyLead:false,
    socPercent:'70',
    haveLookFor:true,
    surplusMileage11:'',
    historicalTrack:'',
    showHelMet:false,           // 展示头盔按钮 
    time:'',                    // 骑行事件
    prpgress:0,                 // 进度条长度
    SupportHelMet: false,       // 是否有头盔锁
    hasMessage:false,
    waitPay:'',
    hadPay: '',
    needPay:'',
    ruleShow:false,             // machineStatus:{}, //借车时候机器状态
    hasSama: true,
    isCloseSwiper: true,        //轮播公告是否关闭
    background:  [{text:'请打开手机蓝牙，避免因网络问题无法使用'}, {text:'骑行中请佩戴头盔遵守交规'}, {text:'请在地图红色范围内行驶，避免超区断电'}],
    vertical: true,               // 轮播图是否垂直   
    autoplay: true,               // 轮播图是否自动播放
    circular: true,
    interval: 3000,               // 轮播定时器 时间
    duration: 500,                // 持续时长    
    //显示控制
    showView: false,              // 控制借车弹窗
    isPark: true,                 // 控制还车、临停按钮
    isRide: false,                // 控制继续骑行按钮
    flag: false,                  // 控制蓝牙提示开打开
    tipDialog: false,             // 控制选项框
    guideDialog: false,           // 广告
    showEx: false,                // 更多操作显示
    showContact: false,           // 显示客服弹窗
    showActivity: true,           // 显示活动弹窗
    isInGeo: false,               // 电子围栏内外控制
    //样式控制
    title: '百姓快租',
    searchHeight: 0,
    topHeight: 0,
    topHeightone: 0,
    confirmbg: '#888888',
    bleTip: '',
    dialogTip: '余额不足，请先充值。',
    noBalanceData: 0,
    topImage: [],
    boundImage: [],
    indexImage: [],
    showType: -1,                 // 切换车辆模式和站点模式
    phoneList: [],                // 默认客服电话
    textColor: app.globalData.textColor,
    mainColor: app.globalData.mainColor,
    headColor: app.globalData.headColor,
    applyPointImage: '../../images/map/huanchedian@3x.png',
    myImage:     `${app.globalData.imagesUrl}${app.globalData.accountId}/map/my.png` || `../../images/map/my.png`,
    guideImage: '../../images/bluetooth_g_b.png',
    topImageWidth: 0,
    topImageHeight: 0,
    longitude: 120.21155882102968,  // 经纬
    latitude: 30.168200077342654,   // 经纬
    scale: 13,                      // 地图缩放倍率
    markers: [],                    // 地图标记点数组
    circles: [],  
    polyline: [],                   // 地图路线数组
    polygon: [],                    // 站点围栏
    polygonArea: [],                // 区域围栏
    lastGeoId: '',                  // 当前区域围栏ID，重复不变则不获取数据
    geoIds: [],                     // 所有当前已加载的电子围栏id
    machineNO: '',                  // 设备信息
    longMachineNO: '',          
    modelType: 0,                   // 站点模式或禁停区模式
    isBicycle: false,               // true单车模式，false电动车模式
    userCode: '',                   // 车辆编号
    controls: [],                   // 地图上的标记
    topAreaHeight: 0,               // 地图上方区域距离小程序顶部的高度
    showAppoint: false,             // 是否展示预约
    isAppointing: false,            // 是否正在预约
    thisBicycle: null,              // 当前点击的车辆
    appointFormatTime: '',          // 预约剩余时间
    mapHeight: 0,                   // 地图高度
    hadGetGeoData: false,           // 是否已获取围栏数据
    showStartAd: true,              // 是否展示启动页广告
    startAdImage: "",               // 启动页广告
    startAdImageArr: [],
    showSkip: false,                // 是否展示“跳过广告”
    startPageAdTime: 3,             // 启动页广告时长
    hadLoadStartAdImage: false,     // 启动页广告图片是否已经加载完成
    isLoaded: false,
    topAreaHeights: 0,
    verticalTip: false, 
    isOnlineContact: false,         // 是否支持在线客服
    parkMachineTip: false,
    isShowLocation: true,
    showHelmetTip: false,           // 控制头盔锁引导图提示
    isFalseReturn: false,           // 控制垂直停车7s后间隔
    isClickParkPoint: false,        // 清除覆盖物开关
    returnHelmetShowTip:false,      // 归还头盔锁提示
    lendHelmetShowTip:false,        // 借头盔锁提示
    helmetTop: 0,                   // 头盔锁引导提示top
  },

  // 拍摄故障头盔上传
  submit() {
    if(this.data.imgUrls.length  < 1) {
      return
    } else {
      console.log('发送请求调接口 返回');
      wx.showToast({
        title: '发送请求调接口 返回',
      })
    }
  },

  deleteImage(e) {
    let arr = [] 
    let index1 = e.currentTarget.dataset.index + 1
    this.data.imgUrls.forEach((item,index)=> {
      if( (index+ 1) != index1) {
        arr.push(item)
      } 
    })
    this.setData({
      imgUrls: arr
    })
  },

  /**
   * 拍照上传
   */
  chooseImage: function (e) {                                 //  this.c hangeLock(true);
    wx.chooseImage({
      count: 3,                                               //最多可以选择的图片总数  
      sizeType: ['compressed'],                               // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['camera'],
      success: (res) => {
        let temp = res.tempFilePaths;
        this.setData({
          imgUrls: this.data.imgUrls.concat([temp]),
          picture: temp,
          imageIds: true
        })
      },
      fail: (err) => {
        console.log(err);
      }
    });
  },


  exitForfeit() {
    this.setData({
      forfeit : false 
    })
  },

  forfeitFalse() {
    this.setData({
      isHemetFalse: true
    })
  },

  forfeit() {
    this.closeLendOrReturnHelMetTip()
    this.setData({
      forfeit : true 
    })
  },

  isShowView() {
    if(this.data.showView) {
      this.setData({
        isClickParkPoint:true
      })
    } else {
      this.setData({
        isClickParkPoint:false
      })
    }
  },

  // 清空输入框的内容
 clearText() {
  this.setData({
    // keyword:'',
    hadInput:false,
    suggest: [],
  })
},

clearText1() {
  this.setData({
    keyword:'',
    hadInput:false,
    suggest: [],
  })
},

inputBack() {
  this.setData({
    keyword:'',
    hadInput:false,
    suggest: [],
    isSearch:false
  })
},

  // 聚焦函数:如果字符串长度为0，则不显示清空图标，否则显示清空图标。
  bindKeyBlur() {
    if( this.data.keyword ) {
      console.log('存在');
      this.setData({
        hadInput:true
      })
    }else{
      this.setData({
        hadInput:false
      })
    }
  },

// 获取距离
  GetDistance( lat1,  lng1,  lat2,  lng2){
    var radLat1 = lat1*Math.PI / 180.0;
    var radLat2 = lat2*Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s *6378.137 ;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    s = s.toFixed(1)  // 四舍五入留一位
    return s ;
},

// 点击目的地
toTargetMap: function(e){                                                                               // 目的地点击
  let lo = e.currentTarget.dataset.aim.longitude
  let la = e.currentTarget.dataset.aim.latitude
  this.setData({
    goToLa: la,
    goToLo: lo,
    goToName: e.currentTarget.dataset.aim.title,
    goToAddress: e.currentTarget.dataset.aim.addr,
  })
  let that = this 
      that.mapCtx.moveToLocation({                                                                          //移动到指定地点
        longitude: lo,
        latitude: la,
        success:() => {},
        fail:(err) => {},
        complete:(res => {    
          setTimeout(function() {
            that.getPark1()
          },1000)
        })
      });
    that.setData({                                                                                          // 变成找还车点状态
      hadInput:false,
      suggest: [],
    })
    
},

// // 跳转第三方导航软件
nav() {         
  let that = this   
  wx.openLocation({
    latitude:that.data.goToLa,	//维度
    longitude:that.data.goToLo, //经度
    name:  '还车点',	//目的地定位名称
    scale: 15,	//缩放比例
    address: '还车点',	//导航详细地址
  })
  if ( !that.data.isLastPark) {
    that.setData({
      swiperMapApp: false,
      noToApp: true,
      needFlash: true,
      markers: [],
      polyline: [that.data.polyline[0]],
  })
  }
},

// 跳转第三方导航软件
nav1() {         
  let that = this   
  wx.openLocation({
    latitude:that.data.goToLa,	//维度
    longitude:that.data.goToLo, //经度
    name:  '还车点',	//目的地定位名称
    scale: 15,	//缩放比例
    address: '还车点',	//导航详细地址
  })
  if ( !that.data.isLastPark ) {
    that.setData({
      swiperMapApp: false,
      noToApp: true,
      needFlash: true,
      markers: [],
      polyline: [],
  })
  }
},

// 关闭nav
closeNav() {
  this.setData({
    swiperMapApp: false,
    noToApp: true,
    polyline:[],
    notMove: false,
    isLastPark: false   // 是否找寻最近的一个站点
  })
},

  inputSearch(e){
    this.setData({
      keyword: e.detail.value,
    })
    if(e.detail.value.length > 0){
      extraMap.getSuggest(e.detail.value, (res) => {
        res.forEach(item => {
          item.space = this.GetDistance(app.globalData.userLastPosition.latitude,app.globalData.userLastPosition.longitude,item.latitude,item.longitude)
        }) 
        this.setData({
          suggest: res,
        })
      },app.globalData.areaCity);
    }else{
      this.setData({
        suggest: [],
      })
      console.log(this.data.suggest);
    }
   this.bindKeyBlur() // 判断清空
  },

  getSearch() {
    wx.showLoading({
      title: '正在搜索',
    })
    let that = this 
    setTimeout(function() {
      if(that.data.keyword.length > 0){
        extraMap.getSuggest(that.data.keyword, (res) => {
          res.forEach(item => {
            item.space = that.GetDistance(app.globalData.userLastPosition.latitude,app.globalData.userLastPosition.longitude,item.latitude,item.longitude)
          }) 
          that.setData({
            suggest: res,
          })
        },app.globalData.areaCity);
      }else{
        that.setData({
          suggest: [],
        })
      }
      wx.hideLoading({
        success: (res) => {
        },
      },)
    },500)
  },

  // 去往未支付
  goPay() {
 if(this.data.historicalTrack) {
  app.globalData.noPayHistory = true
  app.globalData.historyItem = this.data.historicalTrack;
  wx.navigateTo({
    url: `/pages/historyOrder/historicalTrack/historicalTrack?action=history&Pay=false`,
  })
 }
  },

  waitPay() {
    this.setData({
      waitPay:false,
    })
    app.globalData.hadPay = true
  },

  // 跳转活动中心
  toEvnet() {
    if (app.globalData.userInfo) {
      wx.navigateTo({
        url: '../../packageA/pages/event/event'
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },

  showRule() {
    // if (app.globalData.userInfo) {
      this.setData({
        ruleShow: true
        })
    // } else {
      // wx.navigateTo({
        // url: '../login/login',
      // })
    // }
  },

  closeRule() {
    this.setData({
      ruleShow: false
      })
  },

  // 关闭轮播
  closeSwiper() {
    this.setData({
      isCloseSwiper: false,
    })
  },

  outArea1() {
    this.setData({
      isNotAreaPhoto1: true
    })
  },

  tooNextLead2() {
    this.setData({
      isNotAreaPhoto1: false
    })
  },

  matchState (type, cb) {                                                                           // 机器状态
    let that = this;
    app.checkToken((token) => {
      if (token.length > 0) {
        let url = app.globalData.baseUrl + 'machine/getRemand.do';
        let param = {
          token: token
        };
        util.request(url, param, (res) => {
          if (res.data != undefined && res.data.length != 0) {                                      //正在借车
            console.log(res,'[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[');
            let userCode = res.data.userCode;
            that.setData({
              userCode
            });
            if ((app.globalData.adAccountId && app.globalData.adAccountId == '10614' && // 单车真实投放区域
                userCode.indexOf("1003538") === 0 && userCode.slice(7, 10) >= 133 && userCode.slice(7, 10) <= 632) || userCode.indexOf('901') == 0 || userCode.indexOf('902') == 0) {
              that.setData({
                isBicycle: true
              });
              app.globalData.isBicycle = true;
              app.isSupportFuns(this.data.userCode, (res) => {// console.log("***单车模式")
                this.judgeUserStateBicycle().then(res => {
                    if (res == 'isBorrowing') {
                      this.isBorrow = true;
                      this.setData({
                        guideDialog: false
                      }) // console.log('借车');
                      cb && cb('isBorrowing'); // this.setMapControls();
                      this.showTypeAlter(1, type); //还车点
                    }
                  },
                  rej => {
                    if (rej == 'noBorrowing') {
                      this.isBorrow = false;
                      cb && cb('noBorrowing');
                      console.log('无借车')
                      this.showTypeAlter(1, type);
                    } else if (rej == 'logout') {
                      this.isBorrow = false;
                      cb && cb('logout');
                      this.showTypeAlter(1, type);
                    }
                  });
              })
            }    // 测试区域
            else if ((app.globalData.adAccountId && app.globalData.adAccountId == '248' &&
                userCode.indexOf("1003538") === 0 && userCode.slice(7, 10) >= 133 && userCode.slice(7, 10) <= 632) || userCode.indexOf('901') == 0 || userCode.indexOf('902') == 0) { // 单车
              that.setData({
                isBicycle: true
              });
              app.globalData.isBicycle = true;
              // console.log("***单车模式")
              app.isSupportFuns(this.data.userCode, (res) => {
                this.judgeUserStateBicycle().then(res => {
                    if (res == 'isBorrowing') {
                      this.isBorrow = true;
                      this.setData({
                        guideDialog: false
                      })
                      this.setMapControls();
                      // console.log('借车');
                      cb && cb('isBorrowing');
                      this.showTypeAlter(1, type); //还车点
                    }
                  },
                  rej => {
                    if (rej == 'noBorrowing') {
                      this.isBorrow = false;
                      cb && cb('noBorrowing');
                      // console.log('无借车')
                      this.showTypeAlter(1, type);
                    } else if (rej == 'logout') {
                      this.isBorrow = false;
                      cb && cb('logout');
                      this.showTypeAlter(1, type);
                    }
                  });
              });
            } else {
              // console.log("***电动车模式")
              that.setData({
                isBicycle: false
              });
              app.globalData.isBicycle = false;
              app.isSupportFuns(this.data.userCode, (res) => {
                this.judgeUserState().then(res => {
                    if (res == 'isBorrowing') {
                      this.isBorrow = true;
                      this.setData({
                        guideDialog: false
                      });           
                      // 是否处于借车，没有广告弹窗  不是自行车  从开锁那边返回，支持头盔锁
                      // console.log(this.isBorrow ,!this.data.guideDialog , !this.data.isBicycle , app.globalData.isShowHelMetTip , app.globalData.isSupportHelMet)
                      if (this.isBorrow && !this.data.guideDialog && !this.data.isBicycle && app.globalData.isShowHelMetTip && app.globalData.isSupportHelMet) {
                        console.log('3333');
                        this.setData({
                          lendHelmetShowTip: true, //开锁后打开引导图
                          isClickParkPoint: true
                        });
                      };
                      setTimeout(() => {
                        app.globalData.isShowHelMetTip = false //从开锁界面后隔3s  为了显示站点信息和提示图
                      }, 3000);
                      this.allMarkers = []; //markers 清零
                      this.setMapControls();
                      console.log('借车');
                      cb && cb('isBorrowing');
                      this.showTypeAlter(1, type); //还车点
                    }
                  },
                  rej => {
                    if (rej == 'noBorrowing') {
                      this.isBorrow = false;
                      cb && cb('noBorrowing');
                      console.log('无借车')
                      this.showTypeAlter(1, type);
                    } else if (rej == 'logout') {
                      this.isBorrow = false;
                      cb && cb('logout');
                      this.showTypeAlter(1, type);
                    }
                  });
              })
            }
          } else {
            if (this.data.isBicycle) { // 单车模式
              console.log("***单车模式")
              this.judgeUserStateBicycle().then(res => {
                  if (res == 'isBorrowing') {
                    this.isBorrow = true;
                    this.setData({
                      guideDialog: false
                    })
                    this.setMapControls();
                    console.log('借车');
                    cb && cb('isBorrowing');
                    this.showTypeAlter(1, type); //还车点
                  }
                },
                rej => {
                  if (rej == 'noBorrowing') {
                    this.isBorrow = false;
                    cb && cb('noBorrowing');
                    console.log('无借车')
                    this.showTypeAlter(1, type);
                  } else if (rej == 'logout') {
                    this.isBorrow = false;
                    cb && cb('logout');
                    this.showTypeAlter(1, type);
                  }
                });

            } else { // 电动车模式
              console.log("***电动车模式")
              this.judgeUserState().then(res => {
                  if (res == 'isBorrowing') {
                    this.isBorrow = true;
                    this.setData({
                      guideDialog: false
                    })
                    this.setMapControls();
                    console.log('借车');
                    cb && cb('isBorrowing');
                    this.showTypeAlter(1, type); // 还车点
                  }
                },
                rej => {
                  if (rej == 'noBorrowing') {
                    this.isBorrow = false;
                    cb && cb('noBorrowing');
                    console.log('无借车')
                    this.showTypeAlter(1, type);
                  } else if (rej == 'logout') {
                    this.isBorrow = false;
                    cb && cb('logout');
                    this.showTypeAlter(1, type);
                  }
                });
            }
          }
        })
      }
    })
  },


  getMileage() {
    let that = this 
    let url = app.globalData.baseUrl + "machineStatus/getByUserCode.do";
    if( app.globalData.machineNO ){
      let param = {
        userCode: app.globalData.machineNO,
        mapType: 2
      };
      app.checkToken(token =>{
        if(token.length > 0){
           param.token = token;
           if(that.data.showView){   // 出现提示框多次 判断是否在借车 然后解决
           util.request(url, param, (res)=>{
            let res1 = res
            that.setData({
            surplusMileage11 : res1.data.surplusMileage
            })
          })
        }
        }
      })
    } else {
      console.log('没有 全局车辆编号');
    }
  },

  // 退出登录 重置
  initSet() {
    if (!app.globalData.userInfo) {                                                                 // 用户主动退出账号，把一些状态置为默认值
      this.setData({
        showView: false,
        showType: 1
      });
      this.setMapControls();
    }
  },

  // 获取电量等
  getCarInfo() {
    let that = this 
    wx.getStorage({
      key: 'surplusMileage',
      success(res) {                                                                                   // console.log(res.data)
        that.setData({
          surplusMileage11: res.data
        })
      }
    })
    wx.getStorage({
      key: 'socNumber',
      success(res) {                                                                                   // console.log(res.data)
        that.setData({
          socPercent: res.data
        })
      }
    })
  },

  showSet() {
    let isLoaded = wx.getStorageSync('token');
    this.setData({
      polygon: [],
      polygonArea: [],
      lastGeoId: "",
      geoIds: [],
      isLoaded: isLoaded ? true : false                                                            //判断用户是否登录
    });
  },

  showProfile() {
    let isLoaded = wx.getStorageSync('token');
    this.setData({
      isLoaded: isLoaded ? true : false                                                            //判断用户是否登录
    });
  },

  onLoad: function (options) {
    if(this.setInterval4) {
      clearInterval(this.setInterval4)
    }
    this.setInterval4 = setInterval(()=> {
    this.haveCar()
   },5000)
    console.log('load执行',options);
    let q = decodeURIComponent(options.q);                                                          //扫码跳转到该页面
    this.outSideMsg = q;
    this.loadSet() 
    this.setTop()                                                                                  //设置顶部文字高度 
    this.preInit()                                                                                 //取本地数据 
    let that = this
    app.initApp((config) => {                                                                        // 首先使用上次用户使用小程序时最后的定位，提高地图定位速度
      let userLastLocation = wx.getStorageSync("userLastLocation");
      if (userLastLocation && userLastLocation.longitude && userLastLocation.latitude) {            // 如果有上次的地理位置及记录 
        that.setData({
          longitude: userLastLocation.longitude,
          latitude: userLastLocation.latitude
        }) 
      } else {                                                                                        //没有 就写死一个地理位置
        that.setData({
          longitude: 120.21155882102968,
          latitude: 30.168200077342654,
        });
      }
      that.phone = config.phone           //手机
      let textColor = config.textColor;  
      that.setData({
        mainColor: config.mainColor,
        textColor: textColor,
        headColor: config.headColor,
        title: config.name
      })
      app.getAdAccountId((flag) => {
        that.setData({
          modelType: app.globalData.modelType,   // 站点模式或禁停区模式
        });
        that.getUserLocation(() => {
          that.matchState('first', (state) => {
            if (state != "isBorrowing") {
              if (q != 'undefined' && flag == 'no token') {
                app.globalData.isScanCode = true;
                that.analysisMachineNO(q)
              } else {
                app.initUserInfo(() => {
                  if (typeof q != 'undefined' && (q.indexOf("?machineNO") > -1 || q.indexOf("?userCode") > -1)) {
                    app.globalData.isScanCode = true;
                    that.analysisMachineNO(q)
                  }
                });
              }
            } else {
              app.initUserInfo();
            }
          });
        }, true);
      })
      if (typeof options.returnBike != 'undefined') {
        let returnBike = options.returnBike;
        console.log("补足余额，立即还车" + returnBike);
        if (returnBike == 1) {
          that.returnBike();
        }
      }
    });
    that.bikeOperate = new BikeOperate(); //设备操作对象            
    that.getNoPay(options)                                                                                // 获取未付款订单
  },

  onShow: function () {
    if(this.setInterval4) {
      clearInterval(this.setInterval4)
    }
    this.setInterval4 = setInterval(()=> {
    this.haveCar()
   },5000)
    if(app.globalData.noRefresh) {
      console.log('不执行')
      if(this.data.needFlash) {
        this.setData({
          needFlash: false 
        })
        this.getPark()
      }
    } else {
      console.log('执行了show');
      this.showSet()                                                                             // 判断是否登陆 重置地图信息
      if (!app.globalData.firstRender) {                                                             // console.log('user:', app.globalData.userInfo)
        this.getUserLocation(() => {
          this.matchState('first');
        });
      } else {
        app.globalData.firstRender = false;
      }                                                                         // console.log('实名情况', app.globalData.pushNameAuth,'自动流程', app.globalData.autoAction, 
      if (app.globalData.autoAction == 'auto') {
        app.globalData.autoAction = null;
        if (typeof this.outSideMsg != 'undefined' && (this.outSideMsg.indexOf("?machineNO") > -1 || this.outSideMsg.indexOf("?userCode") > -1)) {
          this.analysisMachineNO(this.outSideMsg);
        } else {
          this.scanCode();
        }
      }
        let that = this 
        setTimeout(function() {
          if(app.globalData.isRiding) {
            console.log('44444');
            that.setData({
              isClickParkPoint : true
            })
          }
          if(!that.data.showView) {   
            console.log('5555');                                                                  // 4 没在骑车 
            that.setData({
              isClickParkPoint : false
            })
          } 
        if(!that.data.showView) {                                                                 // 不在骑车 
          app.globalData.prpgressTime = 0
          app.globalData.formatTime1 = 0
          that.data.time1 = null
        }
        },1200)
    if(app.globalData.surplusMileageSelf){                                                        // 从借车的车辆状态页面 存到全局的一个可骑行公里数 然后在o nshow拿到设置
      this.setData({
        surplusMileage11 :app.globalData.surplusMileageSelf
       })
    }
    this.getAppointing()
    this.getAppointStatus()
    this.moveTo()
    }
    console.log('-------------------------------onshow无论如何都执行的方法---------------------------------------------->')
    this.initSet()                                                                                // 未登录重置信息
    this.getMesssage(0)                                                                           // 重新调 未读消息
    this.getMileage()                                                                             // 获取里程数
    this.getCarInfo()                                                                             // 获取电量等
    this.isHistroyBack()                                                                          // 是否从历史记录返回 
    this.showProfile()                                                                            // 更新个人头像   
    this.infoOnshow()                                                                              //我的信息的onshow
  },

  onReady: function () {
    if(app.globalData.surplusMileageSelf){                                                    // 从借车的车辆状态页面 存到全局的一个可骑行公里数 然后在o nshow拿到设置
      this.setData({
        surplusMileage11 :app.globalData.surplusMileageSelf
       })
    }
    setTimeout(() => {
      this.adChangeTime();
    }, 1000);
  },  

  onHide: function () {
    let that = this 
    console.log('hide---------------------------------.');
    app.globalData.noRefresh = true 
    if(this.time1){                                                                                                           // 页面卸载清除定时器
      clearTimeout(this.time1)
    }
    if (this.machineNOStatusTimer) {
      clearInterval(this.machineNOStatusTimer);
    }
  },

  onUnload: function () {
    console.log('卸载');
    if(this.time1){ // 页面卸载清除定时器
    clearTimeout(this.time1)
  }
    app.globalData.clickHelmetCount = 0;
    if (app.globalData.clickHelmetTimer) {
      clearInterval(app.globalData.clickHelmetTimer);
      app.globalData.clickHelmetTimer = null;
    }
    if (this.machineNOStatusTimer) {
      clearInterval(this.machineNOStatusTimer);
    }
    if(this.setInterval4) {
      clearInterval(this.setInterval4)
    }
  },

  // 获取当前是否有借用车辆
  haveCar() {
    let that = this 
    let url = app.globalData.baseUrl + "machine/getBorrowing.do";
    app.checkToken((token) => {
      if (token.length > 0) {
      util.request(url,{
        token : token
      }, (resp) => {                        
        if(resp) {
          if(resp.data) {
        if (resp.data.machineNO ) {
          if ( !that.data.showView ) {
            that.setData({
              showView : true,  // 骑车状态
            })
            that.judgeUserState()   // 不但是骑车  还要拿状态
          }
        } else {
          that.setData({
            showView : false,   // 没骑
          })
        }
      }
    }
      });
    }
    })
  },

  getAppointing() {
    let that = this 
    let url = app.globalData.baseUrl + "appointMent/getByUserId.do";
    let param = {}
    app.checkToken((token) => {
      if (token.length > 0) {
        param.token = token;
      util.request(url,param, (resp) => {
        if (resp.data) {
          console.log(resp);
          that.data.isAppointing = true 
          wx.getStorage({
            key:'lookFor',
            success(res){
              console.log(res);
              that.markertap1(res.data)
            }
          })
        } else {
        }
      });
    }
    })
  },

  markertap1(e) {
    let index = e.markerId;                                                                                       // 拿到标记点下表 当前渲染列表的下标 0 
    let markerType = ''; 
    let that = this;
    let adAccountId = app.globalData.adUserAccountId || wx.getStorageSync('adAccountId') || '100201';
    let url = app.globalData.baseUrl + "machineStatus/getNearMachine.do";
    let lo = '',la = '';
    wx.getStorage({
      key:'current',
      success(res) {
        console.log(res);
        if(res.data) {
          lo = res.data.longitude;
          la = res.data.latitude;
        }
      }
    })
    console.log(app.globalData);
    let param = {
      accountId: app.globalData.accountId,
      radius: 250,
      mapType: 2,
      lo: app.globalData.locationInfo.longitude || lo,
      la:  app.globalData.locationInfo.latitude || la,
    };
    console.log(param.lo,param.la);
    if (adAccountId && adAccountId != undefined) {
      param.adAccountId = adAccountId;
    }
    app.checkToken((token) => {
      console.log('token');
      if (token.length > 0) {
        param.token = token;
      }
  //     wx.startLocationUpdateBackground({   // 新定位接口
  //   success(res) {
  //     console.log('开启后台定位', res)
  //   },
  //   fail(res) {
  //     console.log('开启后台定位失败', res)
  //   }
  // })
  // wx.onLocationChange(function(res) {
  //   console.log('location change', res)
  // })
      util.request(url, param, (resp) => {
        console.log(resp);
        let _markers = [];
        if (resp.data.length > 0) {
          let machines = resp.data;
          machines.forEach((machine, index) => {                                                                        // 遍历车辆 添加 属性
            let iconPath = `${app.globalData.imagesUrl}${app.globalData.accountId}/map/car/icon_che.png`;
            let marker = {
              id: index,
              machineId: machine.machineId,
              iconPath: iconPath,
              markerTip: 'machine',
              latitude: machine.latC ? machine.latC : machine.lat,
              longitude: machine.lonC ? machine.lonC : machine.lon,
              width: 34,
              height: 38,
              userCode: machine.userCode,
              socPercent: machine.socPercent,
              surplusMileage: machine.surplusMileage,
              callout: {
                content: '可骑行' + machine.surplusMileage + '公里',
                bgColor: '#444',
                color: '#fff',
                borderRadius: 5,
                padding: 8,
                textAlign: 'center',
                borderWidth: 2,
                borderColor: app.globalData.mainColor
              }
            }
            _markers.push(marker);
          })
          that.machineMarkrs = _markers;                                                                            //  保存一份markers 用于渲染
          that.allMarkers = _markers;                                                                               // 保存一份，用户后续parkPoint marker id计数
          that.lastMarkerId = null;
          that.setData({
            markers: _markers,
            polyline: [],
          });
          console.log(that.data.markers);
          that.data.markers.forEach((item,index1) => {  
            console.log(index,that.data.markers);                                                                    // 遍历标记列表 匹配到了 就拿到 标记类型和下标
            if(item.id == index){
               markerType = item.markerTip;
               index = index1
            }
          })
          that.data.markers[index].accountId = 100197;
          that.data.markers = that.data.markers[that.data.markers[index]]
          let current = that.data.markers[index]
          var getAppointInterval = setInterval(function() {
            extraMap.getQQWalkingRoute(current, (res) => {                      
              let polyline = that.data.polyline;
              polyline.pop(); 
              console.log(res,that.clickFirstMarker,polyline);
              that.clickFirstMarker = true;                                                 // 判断是否点击过marker
              polyline.push(res[0]);      
              that.setData({
                polyline
              });
            })
          },2000)
          that.data.getAppointInterval = getAppointInterval
        } else {                //  没有车辆就给空
          that.allMarkers = [];
        };
      });
    })   
    //   console.log(that.data.polyline);
    //   // if (res[0].distance) {
      //   that.appointDistance = res[0].distance;
      // }
    // })         
    // this.data.markers.forEach((item,index1) => {  
    //   console.log(index,this.data.markers);                                                                    // 遍历标记列表 匹配到了 就拿到 标记类型和下标
    //   if(item.id == index){
    //      markerType = item.markerTip;
    //      index = index1
      },

  markerChange1: function (index) {
    let markers = this.data.markers;                                                                                              // 拿到标记列表 复制
    let that = this;
    extraMap.getQQWalkingRoute(markers[index], (res) => {                         
      let polyline = that.data.polyline;
        polyline.pop();    // 
      console.log(res,that.clickFirstMarker,polyline);
      that.clickFirstMarker = true;                                                 // 判断是否点击过marker
      polyline.push(res[0]);      
      that.setData({
        polyline
      });
      console.log(that.data.polyline);
    })
  },

  // 获取到用户一开始的区域id
  firstGetAdAccountId(cb) {
    let lo1 = null;
    let la1 = null;
    wx.getStorage({
      key:'userLastLocation',
      success(res) {
        console.log(res);
        lo1 = res.data.longitude,
        la1 = res.data.latitude
      }
    })
    app.getLocationInfo('gcj02', (locationInfo) => {
      let lo = locationInfo.longitude || lo1;
      let la = locationInfo.latitude || la1;
      let url = app.globalData.baseUrl + "adAccountDeposit/getByLocation.do";
      let param = {
        lo,
        la,
        mapType: 2,
        accountId: app.globalData.accountId
      }
      app.checkToken((token) => { 
        if (token.length > 0) {
          param.token = token;
        }
        util.request(url, param, (resp) => {
          if (resp.ret) {
            if (resp.data != undefined) {
              console.log(resp.data.accountId);
              app.globalData.adUserAccountId = resp.data.accountId;
              console.log(resp.data.accountId);
              if (app.globalData.adUserAccountId != undefined) {
                wx.setStorageSync('adAccountId', resp.data.accountId);
              }
              cb && cb();
              console.log("第一次定位区域id:", app.globalData.adUserAccountId);
            }
          } else {
            cb && cb();
          }
        });
      })
    });
  },

  analysisMachineNO (q) {                                                                                           // 分析机器编码
    console.log('外部扫描内容：q' + q);
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      mask: true,
      duration: 15000
    })
    let machineNO = q.split("=")[1];
    this.data.machineNO = machineNO;
    if (machineNO && machineNO.length > 9) {
      this.data.longMachineNO = machineNO.substring(machineNO.length - 9, machineNO.length);
    }
    let that = this;
    this.checkUserStatus().then(() => {
      wx.hideToast();
      if (machineNO.length > 0) {
        wx.navigateTo({
          url: "../machineStatus/machineStatus?machineNO=" + machineNO
        })
      }
    }, () => {
      wx.hideToast();
      that.stillOutSideCode = true;
    })
  },

  // 检查用户状态 用户信息已经存在,但是没有实名认证, pushNameAuth标志,跳到实名认证页面
  checkUserStatus () {
    return new Promise((resolve, reject) => {
      let userInfo = app.globalData.userInfo;
      if (userInfo) {
        if (app.globalData.pushNameAuth && !userInfo.nameAuth) {
          reject();
          app.globalData.autoAction = 'scan';
          wx.navigateTo({
            url: '../authentication/authentication',
          })
        } else {
          app.globalData.autoAction = '';
          resolve();
        }
      } else {                                                          // 用户信息不存在,跳到登录界面
        app.globalData.autoAction = 'scan';
        reject();
        wx.navigateTo({
          url: '../login/login',
        })
      }
    })
  },

  getAdvertisement (location) {
    let that = this;  
    this.startAdTimeout = setTimeout(() => {                              // 如果一定时间内没获取到广告图片，则跳过启动页
      that.setData({
        showStartAd: false
      });
    }, 3000);
    let url = app.globalData.baseUrl + "adAccount/getByLocation.do";
    let param = {
      accountId: app.globalData.accountId,
      lo: location.longitude ,
      la: location.latitude,
      mapType: 2
    }
    util.request(url, param, (res) => {
      if (res.ret) {
        clearTimeout(that.startAdTimeout);                                      // 清除startAdTimeout
        let topImage = [];
        let boundImage = [];
        let indexImage = [];
        res.data.forEach((advertisement, index) => {
          let img = '';
          if (advertisement.imageId && advertisement.imageId.indexOf("http") > -1) {
            img = advertisement.imageId;                                        // 兼容阿里云上的图片
          } else {
            img = app.globalData.baseUrl + '/image/getByImageId.do?imageId=' + advertisement.imageId
          }
          if (advertisement.adType == 0) {                                      // 启动页广告
            indexImage.push({
              src: img,
              target: advertisement.openURL
            });    
          } else if (advertisement.adType == 1) {                                 // 首页弹窗广告
            boundImage.push({
              src: img,
              target: advertisement.openURL
            });
          } else if (advertisement.adType == 2) {                                 // 首页顶部广告
            topImage.push({
              src: img,
              target: advertisement.openURL
            });
          }
        })
        if (indexImage.length > 0) {                                               // 如果有启动页广告则展示，否则跳过启动页
          that.showStartAdFunc(indexImage[0].src);
          that.setData({
            indexImage
          });
          setTimeout(function() {                                                 // 有启动页 3秒执行 跳转
          },3000)
        } else {                                                                  // 没有就立即跳转
          that.setData({
            showStartAd: false
          })
        }
        app.globalData.boundImage = boundImage;                                     //中间广告是否有数据，有数据就进行展示
        if (boundImage.length > 0) {
          that.setData({
            boundImage: boundImage,
            topImage: topImage,
            guideDialog: that.isBorrow ? false : true,
          })    
          that.setMapControls();                                                      // console.log("guanggao", that.isBorrow, that.isBorrow ? "false" : "true");
        } else {                 
          that.setData({
            boundImage: boundImage,
            topImage: topImage
          })
        }
      } else {            // 没有 广告的时候正常执行
        console.log('没有广告');
      }
    })
  },

  //获取用户地址
  getUserLocation: function (cb, isOnload) {
    let that = this;
    app.getLocationInfo('gcj02', (locationInfo) => {
      that.setData({
        longitude: locationInfo.longitude,
        latitude: locationInfo.latitude,
        centerLongitude: locationInfo.longitude,
        centerLatitude: locationInfo.latitude
      });
      app.globalData.areaLocation = locationInfo;                              // 保存用户定位          
         app.globalData.userLastPosition = {
          longitude: locationInfo.longitude,
          latitude: locationInfo.latitude
        };
      if (isOnload) {
        that.getAdvertisement(locationInfo);                                   // 2020/8/10，加个值判断是o nShow还是o nLoad调用此方法来决定是否弹广告
      }                                                                        // console.log("用户位置：", locationInfo.longitude, locationInfo.latitude)
      that.firstGetAdAccountId(() => {
        that.geoForm(locationInfo.longitude, locationInfo.latitude, cb);       // 渲染电子围栏
      });
    });
  },

  clearSome() {
    if(this.data.polygon.length) {
      this.setData({
        polygon : [this.data.polygon[0]] || []
      })
    } else {
      this.setData({
        polygon :  []
      })
    }
  },
  
  //视野变化事件
  regionchange (e) {                                                                                   //计算两个中心的的距离，如果移动的距离小于X米则不加载
    if(this.data.notMove) {                                                                                       // 点击了停车点 或者别的 就不能移动了
      return  
    }
    let that = this;
    if (e.type == 'end') {
      that.mapCtx.getCenterLocation({
        success: (res) => {
          let from = {                                                                                              //开始如果没有位置，则应该用户的位置
            latitude: that.data.centerLatitude,
            longitude: that.data.centerLongitude
          };
          let to = {
            latitude: res.latitude,
            longitude: res.longitude
          }
          let distance = util.getDistance(from.longitude, from.latitude, to.longitude, to.latitude) * 1000          //console.log(`移动${distance}米,模式：${that.data.showType}`);
          if (distance >= 200) {                                                                                     //  console.log("移动距离大于200米");
            that.geoForm(res.longitude, res.latitude);                                                                //获取区域围栏，后台判断是否需要重新加载。添加多个电子围栏
          }
            if(that.data.isAppointing && !that.data.isClickParkPoint) {
            console.log('预约状态 移动无效');
            return 
          } else {
            console.log('还车点状态  切换渲染还车点');
          }
        }
      });
      that.showParkeOrVerticalLine();
    }
  },

  //加载电子围栏
  loadGeo(lo, la) {
    let that = this;
    let url = app.globalData.baseUrl + "geo/getInGeo.do";
    let adAccountId = app.globalData.adUserAccountId || wx.getStorageSync('adAccountId');               // 拿品牌id
    let param = {
      lo,
      la,
      mapType: 2,
      accountId: app.globalData.accountId,
    }
    if (adAccountId != undefined && adAccountId) {                                                        // 有id 放进参数里
      param.adAccountId = adAccountId
    };
    return new Promise((res, rej) => {
      app.checkToken((token) => {
        if (token.length > 0) {
          param.token = token;
        }
        util.request(url, param, (resp) => {                                                               // // console.log(param, " =====> getInGeo 响应数据: ", resp);
          that.setData({
            hadGetGeoData: true                                                                             //是否已获取围栏数据
          });
          if (resp.data != undefined) {                                                                       // console.log('有电子围栏');
            let geoIds = that.data.geoIds;                                                                 // console.log(geoIds);
            app.globalData.areaPolygon = resp.data;                                                           // 保存当前进入的电子围栏
            that.setData({ 
              isInGeo: true                                                                                   //电子围栏内外控制
            })
            if (!that.isRepeat(geoIds, resp.data.geoId)) {
              res(resp);
            } else {                                                                                        // console.log('repeat p oint');
              that.setData({
                lastGeoId: resp.data.geoId,
              })
              rej('repeat p oint')
            }
          } else {                                                                                           // console.log('没有电子围栏');
            that.setData({
              isInGeo: false
            })
            app.globalData.areaPolygon = null;
            rej('without p oint')
          }
        });
      })
    });
  },

  //验证数组重复
  isRepeat: function (arr, target) {
    let len = arr.length
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        if (arr[i] == target)
          return true;
      }
    }
    return false;
  },

  //加载区域围栏
  geoForm: function (lon, lat, cb) {
    let that = this;
    this.loadGeo(lon, lat).then((geoDatas) => {
      if (geoDatas.data) {
        let polygon = [];
        let points = geoDatas.data.points.split(';');
        let pointArr = [];
        for (let j = 0; j < points.length; j++) {
          let point = {};
          point.longitude = points[j].split(',')[0];
          point.latitude = points[j].split(',')[1];
          pointArr.push(point);
        }
        // console.log('strokeWidth 1',);
        polygon = [{
          points: pointArr,
          strokeWidth: 3,
          strokeColor: '#FF0000DD',
          fillColor: '#FF000012',
          zIndex: -9
        }]
        let geoIds = that.data.geoIds;
        geoIds.push(geoDatas.data.geoId);                                                                       //电子围栏id数组
        let polygonArea = that.data.polygonArea;
        polygonArea = polygonArea.concat(polygon);                                                            //新加入电子围栏
        this.geoPolygon = polygon;                                                                              // 保存一下电子围栏
        that.setData({
          polygon: polygon,
          polygonArea: polygonArea,
          lastGeoId: geoDatas.data.geoId,
          geoIds: geoIds
        })                                                                                                         // console.log('渲染围栏');
        cb && cb(); 
      }
    }, (err) => {
      console.log('重复电子围栏');
      cb && cb();
    })
  },

  //电单车/还车点的切换
  showTypeAlter: function (showType, type) {                                                                     //车辆模式站点模式切换方法 console.log(showType,type,)
    let that = this;                                                                                             // let s howView = this.data.s howView;
    that.clickFirstMarker = false;  
    console.log('s howTypeAlter方法', this.data.showType, showType);
    if (this.data.showType != showType || type == 'first') {                                                       //其他页面进来
      console.log('操作类型：', showType);
      this.setData({
        showType: showType,
        markers: [],
        polyline: []
      });
      if (!that.data.isBicycle && that.isBorrow && showType == 1) {                                                 // 不是骑单车 是被借状态 且 showtype 为1
        let machineNO = this.data.userCode;
        if (that.machineNOStatusTimer) {                                                                            // 存在就先清除永远存在一个
          clearInterval(that.machineNOStatusTimer);
        }
        app.getMachineStatusOnRiding(machineNO, (machineNOStatus) => {                                                // 用户骑行时 显示电单车位置，  一开始先进行显示
          that.machineFormOnRiding(machineNOStatus, 'first', () => {
          });
        })
        if(that.data.checkOut){
          clearInterval(that.data.checkOut)
        } 
        that.data.checkOut = setInterval(function() {
          that.getMachineStatusOnRiding(machineNO)
        },3000)
        that.machineNOStatusTimer = setInterval(function () {
          app.getMachineStatusOnRiding(machineNO, (machineNOStatus) => {
            that.machineFormOnRiding(machineNOStatus);
          })
          if(that.data.checkOut){
            clearInterval(that.data.checkOut)
          } 
          that.data.checkOut = setInterval(function() {
            that.getMachineStatusOnRiding(machineNO)
          },3000)
        }, 5000);
      } else {
        // console.log('这个执行了');
        if (that.machineNOStatusTimer) {
          clearInterval(that.machineNOStatusTimer);
        }
        if (type == 'first') {
          wx.getLocation({
            type: 'gcj02',
            success: (resp) => { 
              that.loadParksOrCars(resp.longitude, resp.latitude, showType);
            }
          })
        } else {
          this.mapCtx.getCenterLocation({
            success: (res) => {          
              that.loadParksOrCars(res.longitude, res.latitude, showType);
            }
          });
        }
      }
    }
    setTimeout(() => {
      this.isShowView()
    }, 200);
  },

  machineFormOnRiding (machineData, type, cb) {                                                                   //machineNOStatus   underfined    underfined
    let that = this;
    if (type == 'first') {                                                                                                  //先渲染一个骑行中车辆，然后每个5s进行轮询
      that.setData({
        markers: [],
        polyline: [],
        circles: [],
      });
      if (this.geoPolygon || this.data.polygon[0]) {                                                                        //第一个是电子围栏,当用户重新进入小程序时，需要进行判断
        that.setData({
          polygon: this.geoPolygon || this.data.polygon[0]
        });
      };
    } else {
      if (that.data.markers[0]) {
      let m1 = that.data.markers[0].surplusMileage
      let m2 = that.data.markers[0].socPercent
      if(m1) {
        this.setData({
        surplusMileage11: m1 ,
        })
      that.setData({
        markers: that.data.markers,
        socPercent:m2
      });
      wx.setStorage({
          key:'surplusMileage',
          data:m1
        })
        wx.setStorage({
          key:'socPercent',
          data:m2
        })
      }
    }
    }
    let lonLat = {
      lo: machineData.lonC || machineData.lon, // 精确校准坐标 短路或 普通坐标
      la: machineData.latC || machineData.lat
    };
    let iconPath = `${app.globalData.imagesUrl}${app.globalData.accountId}/map/car/icon_ridingche.png`;
    let marker = {
      id: 0,
      markerTip: 'ridingChe',
      machineId: machineData.machineId,
      iconPath: iconPath,
      latitude: lonLat.la,
      longitude: lonLat.lo,
      width: 34,
      height: 38,
      userCode: machineData.userCode,
      socPercent: machineData.socPercent,
      surplusMileage: machineData.surplusMileage,
      callout: {
        content: '可骑行' + machineData.surplusMileage + '公里',
        bgColor: '#444',
        color: '#fff',
        borderRadius: 5,
        padding: 8,
        textAlign: 'center',
        borderWidth: 2,
        display: 'BYCLICK',
        borderColor: app.globalData.mainColor
      }
    }
    var markers = this.data.markers;
    that.setData({
      markers                                                                                                    //始终让骑行中的marker保持在第一位markers中
    });
    this.machineMarkrs = [marker];                                                                                         //记录一份车辆marker
    this.allMarkers = [marker];
    cb && cb();
  },

  setAppintFalse() {
    this.setData({                                                                          // 找车还车点切换时 把预约头部置false
      showAppoint: false
    })
  },

  getCar(isswitch) {
    if(!this.data.isClickParkPoint){ // 如果在还车点就不需要切换了
      return 
    }
    this.setAppintFalse()  
    if (this.data.appointFormatTime) {
    this.setData({                                                                                                           // 找车还车点切换时 把预约头部置false
      appointFormatTime: '0:00'
    }) 
  }
    let timeNow = new Date().getTime();
    if(timeNow - app.globalData.lastLoadingParkTime < 300) {
      this.setData({
        lucency : true 
      })
      wx.showToast({
        title: '正在加载',
        icon: 'loading',
        duration: 1500
      });
      setTimeout(() => {
        wx.hideToast({
          success: () => {},
        })
        this.setData({
          lucency : false 
        })
      },1500)
        return;
    }
    app.globalData.lastLoadingParkTime = timeNow;
    if(app.globalData.loadingPark1) {            
      return;
    }
    app.globalData.loadingPark1 = true;
    if(this.time12) {
    clearTimeout(this.time12);
    }
    this.time12 = setTimeout(()=>{
      app.globalData.loadingPark1 = false;
    }, 5000);
    this.setData({
      markers: [],
      polyline: [],             
      notMove : false,
      isClickParkPoint: false,
      polygon: [this.data.polygon[0]]                                      // 找车时 清空 停车站点框线  
    })
      let that = this 
      that.mapCtx.getCenterLocation({                                         //获取地图中心位置。  //  if (this.data.is ClickParkPoint) {  // 点击 点击了还车点，加载停车点
        success: (res) => {
          res = {
            longitude: res.longitude.toFixed(6),
            latitude: res.latitude.toFixed(6)
          };
          that._loadCars(res.longitude, res.latitude, ()=>{
            app.globalData.loadingPark = false;
          });
          setTimeout(() => {
            that._getProhibitArea(res.longitude,res.latitude)                        // 加载禁停区
          }, 200);
          app.globalData.loadingPark1 = false;
        },
      })
      that.setData({
        isSearch: false,
      })
  },

  getPark(isswitch) {
    if(this.data.isClickParkPoint){ // 如果在还车点就不需要切换了
      return 
    }
    this.setAppintFalse()  
    let timeNow = new Date().getTime();
    if(timeNow - app.globalData.lastLoadingParkTime < 300) {
      this.setData({
        lucency : true 
      })
      wx.showToast({
        title: '正在加载',
        icon: 'loading',
        duration: 1500
      });
      setTimeout(() => {
        wx.hideToast({
          success: () => {},
        })
        this.setData({
          lucency : false 
        })
      },1500)
        return;
    }
    app.globalData.lastLoadingParkTime = timeNow;
    if(app.globalData.loadingPark2) {
      return;
    }
    app.globalData.loadingPark2 = true;
    if(this.time1) {
    clearTimeout(this.time1);
    }
    this.time1 = setTimeout(()=>{
      app.globalData.loadingPark2 = false;
    }, 5000);
    this.setData({          
      markers: [],
      polyline: [],                    // 清空线    
      circles: [], 
      notMove : false,
      isClickParkPoint: true          // 清除覆盖物开关
    })  
      let that = this 
      that.mapCtx.getCenterLocation({                                                       //获取地图中心位置。  //  if (this.data.is ClickParkPoint) {  // 点击 点击了还车点，加载停车点
        success: (res) => {
          res = {
            longitude: res.longitude.toFixed(6),
            latitude: res.latitude.toFixed(6)
          };
          that._getParks(res.longitude, res.latitude, 1);
          app.globalData.loadingPark2 = false;
        }  
      })
  },

  getPark1(isswitch) {
    this.setAppintFalse() 
    console.log('9999');
    this.setData({          
      markers: [],
      polygon: [this.data.polygon[0]], //第一个是电子围栏
      polyline: [],                    // 清空线    
      notMove : false,
      isClickParkPoint: true  // 清除覆盖物开关
    })  
    let that = this 
    that._getParks(that.data.goToLo, that.data.goToLa, 1);
    setTimeout(()=> {
      if(that.data.markers.length > 0) {
        if(that.data.markers[0].markerTip === "parkPoint") {
          let index = 0
          extraMap.getQQWalkingRoute(that.data.markers[index], (res) => {     
            let polyline = that.data.polyline;
              polyline.pop();   
            that.clickFirstMarker = true;                                                 // 判断是否点击过marker
            polyline.push(res[0]);      
            that.setData({
              polyline,
              notMove : true,
              toMapApp: true 
            });
          })
        } else {
          console.log('第一个点不是停车点');
        }
      } else {
        console.log('marker 没东西');
      }
      },3000)
  },

  //显示停车和垂直停车线 
  showParkeOrVerticalLine: function () {
    this.setAppintFalse()  
    let timeNow = new Date().getTime();                                                              // 限制200ms号码
    if(timeNow - app.globalData.lastLoadingParkTime < 500) {
        return;
    }
    app.globalData.lastLoadingParkTime = timeNow;
    if(app.globalData.loadingPark) {
      return;
    }
    app.globalData.loadingPark = true;
    if(this.time1) {
    clearTimeout(this.time1);
    }
    this.time1 = setTimeout(()=>{
      app.globalData.loadingPark = false;
    }, 30000);
    this.setData({
      markers: [],
      polyline: [],                                                                                     // 清空线
      circles: [], 
      notMove : false
    })
    this.mapCtx.getCenterLocation({                                                                     //获取地图中心位置//if (this.data.is ClickParkPoint) {点击了还车点，加载停车点
      success: (res) => {
        res = {
          longitude: res.longitude.toFixed(6),
          latitude: res.latitude.toFixed(6)
        };
          if(this.data.isClickParkPoint) {                                                                 // 找 点
            this.setData({
              markers: [],
            })
            this._getParks(res.longitude, res.latitude, 1);
            // this._getProhibitArea(res.longitude,res.latitude)
          }else{                                                                                           // 找车
            this._loadCars(res.longitude, res.latitude, ()=>{
              app.globalData.loadingPark = false;
            });
            // setTimeout(() => {
              // console.log('dsfffffffffff');
              // that._getProhibitArea(res.longitude,res.latitude)
            // }, 200);
          }
      }
    })
  },

  clearAllAboutPark: function () {  //  this.data.markers.length = this.allMarkers.length; //保留车辆marker
    console.log(" ====> clearAllAboutPark()...");
    this.setData({
      markers: this.machineMarkrs,
      polygon: this.geoPolygon || [this.data.polygon[0]], //第一个是电子围栏
      polyline: [],
      circles: [],
    });
    this.lastMarkerId = null; //清除覆盖物之后，
  },

  //加载站点/车辆
  loadParksOrCars: function (lo, la, showType) {
    if (this.data.showType == 1 && !this.isBorrow) {                    //1 且没借车
      this._loadCars(lo, la, () => {
        if (this.data.isClickParkPoint) {                               // 如果用户点击了还车点，加载停车点
          this._getParks(lo, la, showType);
        }
      });
    }
  },

  //绘制周围的站点
  _getParks: function (lo, la, showType) {                                                  // _getParks(res.longitude, res.latitude, 1);
    this.data.markers.length = this.allMarkers.length;                                      // 先获取车辆图标，然后获取站点禁停区，垂直停车线等，站点等的图标获取之前始终是车辆图标，
    let that = this;
    let adAccountId = app.globalData.adUserAccountId || wx.getStorageSync('adAccountId');   // 用户所在区域id
    let url = app.globalData.baseUrl + "parkPoint/getNear.do";
    let param = {
      adAccountId: adAccountId || '',
      accountId: app.globalData.accountId,
      radius: 400,
      mapType: 2,
      lo: lo,
      la: la,
    };
    if (this.data.showView) {  // 骑行展示页面 机器编号
      param.userCode = that.data.machineNO || that.data.userCode
    }
    app.checkToken((token) => {
      if (token.length > 0) {
        param.token = token;
      }
      util.request(url, param, (resp) => {    // 获取的还车点列表 
        // console.log(resp);
        let markerIndex = this.allMarkers.length;
        if (resp.ret) {
          if (that.arrowPolylines) {  
            that.setData({
              polyline: that.arrowPolylines
            });
          }
          if (resp.data.length > 0) {    // 如果拿到数据 数据赋值
            let markers = [];             // 标记点
            let circles = [];             //
            let polygons = [];            // 线 路线
            let parkPoints = resp.data;   // 停车点
            parkPoints.forEach((parkPoint, index) => {
              let marker = { //标记点
                id: markerIndex,
                accountId: parkPoint.accountId,
                markerTip: 'parkPoint',
                parkPointId: parkPoint.parkPointId,
                iconPath: '../../images/map/huanchedian@3x.png',   // 还车点 ,
                latitude: parkPoint.laC ? parkPoint.laC : parkPoint.la,
                longitude: parkPoint.loC ? parkPoint.loC : parkPoint.lo,
                width: 25,          // 还车点 宽高比 
                height: 40,  
                zIndex: 100,
                callout: {}
              };
              markerIndex++;
              markers.push(marker);
              if (parkPoint.pointsC && parkPoint.parkPointType == 1) { //多边形站点。               
                let points = parkPoint.pointsC.split(';');
                let len = points.length;
                let pArr = [];
                for (let j = 0; j < len; j++) {
                  let tempPoint = points[j].split(',');
                  let p = {
                    latitude: tempPoint[1],
                    longitude: tempPoint[0]
                  }
                  pArr.push(p);
                }   
                // console.log('strokeWidth 2',);
                let _polygon = {
                  points: pArr,
                  fillColor: "#00a2e91F",      //  map 区域内 填充色
                  strokeColor: "#00a2e9FF",    // map 边框 填充色 
                  strokeWidth: 2,
                  zIndex: -9
                }
                polygons.push(_polygon);
                // console.log(polygons);
              } else { //圆形站点
                let circle = {
                  latitude: parkPoint.laC,
                  longitude: parkPoint.loC,
                  radius: parkPoint.allowRange,
                  color: '#00a2e95F',
                  fillColor: '#00a2e97F',
                }
              }
            })
            that.siteArr = polygons; //记录上次获取的站点
            that.siteMarkerArr = markers;
            that.setData({
              circles
            });
          } else {
            that.siteArr = [];
            that.siteMarkerArr = [];
          }
          if (resp.prohibitArea) {                                                                 // 禁停区
            that.clickFirstMarker = false;
            let prohibitAreaMarker = [];                                                                            //置空
            let prohibitAreas = [];                                                                                   // 数组赋空
            let prohibitArr = resp.prohibitArea;                                                                     // 把结果的禁停区 赋值给禁停区数组
            console.log('points3-----------------------------------------');
            prohibitArr.forEach((prohibit, index) => {                                                                 // 数组循环 把poinsC的字符串按；分割
             let points = prohibit.pointsC.split(';'); 
              let len = points.length;                                                                                 // 数组长度赋值
              let pArr = [];  
              for (let j = 0; j < len; j++) {
                let tempPoint = points[j].split(',' ) ;                                                               // 每一组 按照经纬度分割
                let p = {                                 
                  latitude: Number(tempPoint[1]),                                                                        //  金纬度 赋值
                  longitude: Number(tempPoint[0])
                }
                pArr.push(p);                                                                                         // push进数组
              }
              let marker = {                                                                                            //   禁停区 标记点    map业 
                id: markerIndex,
                accountId: prohibit.accountId,
                markerTip: 'prohibit',
                prohibitAreaId: prohibit.prohibitAreaId,
                iconPath: '/images/map/jintingqu@3x.png',                                                                  // 禁停区
                latitude: prohibit.laC ? prohibit.laC : prohibit.la,
                longitude: prohibit.loC ? prohibit.loC : prohibit.lo,
                width: 25,
                height: 40,                                                                                               // 禁停区  图标比例 25 40     
                zIndex: 100,
                callout: {}
              }
              markerIndex++;  // 
              prohibitAreaMarker.push(marker);
              // console.log('strokeWidth 3',);
              let _polygon = {                                                                                            // 禁停区显示的图标属性
                points: pArr,
                fillColor: "#ff223366",
                strokeColor: "#ff22339a",
                strokeWidth: 2,
                zIndex: -9
              }
              prohibitAreas.push(_polygon);                                                                                // 追加进入禁停区的数组
            });
            that.prohibitArr = prohibitAreas                                                                               // 禁停区的数组
            that.prohibitMarkerArr = prohibitAreaMarker;                                                                  // 禁停区的数组
            that.setData({
              markers: that.data.markers.concat(prohibitAreaMarker),
              polygon: that.data.polygon.concat(prohibitAreas),
            });
          } else {
            that.prohibitArr = [];
            that.prohibitMarkerArr = [];
          };
          if (resp.vert) { // 箭头                                                                // 应该是垂直停车线 把标记 设置为不可用的状态 如果去除功能可能会有妨碍  console.log('箭头加载');
          that.arrowPolylines = [];
          that.arrowMarkerArr = [];
          that.setData({
            polyline: []
          });
          } else {                                                                                // 没有箭头啥的数据 就 给空
            that.arrowPolylines = [];
            that.arrowMarkerArr = [];
            that.setData({
              polyline: []
            });
          }
        };
        var geoArr = this.geoPolygon || (that.data.polygon[0] != undefined) ?[that.data.polygon[0]]:[] || []; // 电子围栏
        var carMarkerArr = that.allMarkers || that.data.markers || [];
        var allM = [];
        let there = allM
        var allMarker = carMarkerArr.concat(that.siteMarkerArr).concat(that.prohibitMarkerArr).concat(that.arrowMarkerArr);
        allMarker.forEach(item => {                                                                  // 把 没有机器id的项目添加入数组然后 渲染这个没有机器id的数组
          if(!item.machineId) {
             there.push(item)
          } 
        })
        that.setData({
          polygon: geoArr.concat(that.siteArr).concat(that.prohibitArr),
          markers: allM || carMarkerArr.concat(that.siteMarkerArr).concat(that.prohibitMarkerArr).concat(that.arrowMarkerArr)
        });
        app.globalData.loadingPark = false;
      })
    });
  },

  // 加载车
  _loadCars(lo, la, cb) {
    this.clearSome();                                                                       // 清除周围站点 禁停
    let that = this;
    let adAccountId = app.globalData.adUserAccountId || wx.getStorageSync('adAccountId');
    let url = app.globalData.baseUrl + "machineStatus/getNearMachine.do";
    let param = {
      accountId: app.globalData.accountId,
      radius: 250,
      mapType: 2,
      lo: lo,
      la: la,
    };
    if (adAccountId && adAccountId != undefined) {
      param.adAccountId = adAccountId;
    }
    app.checkToken((token) => {
      if (token.length > 0) {
        param.token = token;
      }
      util.request(url, param, (resp) => {
        console.log(resp);
        let _markers = [];
        if (resp.data.length > 0) {
          let machines = resp.data;
          machines.forEach((machine, index) => {                                                                        // 遍历车辆 添加 属性
            let iconPath = `${app.globalData.imagesUrl}${app.globalData.accountId}/map/car/icon_che.png`;
            let marker = {
              id: index,
              machineId: machine.machineId,
              iconPath: iconPath,
              markerTip: 'machine',
              latitude: machine.latC ? machine.latC : machine.lat,
              longitude: machine.lonC ? machine.lonC : machine.lon,
              width: 34,
              height: 38,
              userCode: machine.userCode,
              socPercent: machine.socPercent,
              surplusMileage: machine.surplusMileage,
              callout: {
                content: '可骑行' + machine.surplusMileage + '公里',
                bgColor: '#444',
                color: '#fff',
                borderRadius: 5,
                padding: 8,
                textAlign: 'center',
                borderWidth: 2,
                borderColor: app.globalData.mainColor
              }
            }
            _markers.push(marker);
          })
          that.data.machineMarkrCopy = _markers
          that.machineMarkrs = _markers;                                                                                 //保存一份markers 用于渲染
          that.allMarkers = _markers;                                                                                     //保存一份，用户后续parkPoint marker id计数
          that.lastMarkerId = null;
          that.setData({
            markers: _markers,
            polyline: [],
          });
          if (app.globalData.supportAppoint) {                                                                              // 支持预约的 设置预约
            that.getAppointStatus();
          }
        } else {                                                                                                           //  没有车辆就给空
          that.allMarkers = [];
        };
        cb && cb();('11, 初始化时候 没在骑车就设置成找车');                                                                     // 客服结束的时候 从这里 重置成找车
      });
    })
  },

  //加载禁停区
  _getProhibitArea: function (lo, la, showType) {
    let that = this
    let adAccountId = app.globalData.adUserAccountId || wx.getStorageSync('adAccountId') // 用户所在区域id
    let url = app.globalData.baseUrl + "parkPoint/getNear.do"
    let param = {
      adAccountId: adAccountId || '',
      accountId: app.globalData.accountId,
      radius: 400,
      mapType: 2,
      lo: lo,
      la: la,
    }
    let markerIndex = that.allMarkers.length;
    app.checkToken((token) => {
      if (token.length > 0) {
        param.token = token;
      }
      util.request(url, param, (resp) => {
        if (resp.prohibitArea) {                                                                                  // 禁停区
          that.clickFirstMarker = false;
          let prohibitAreaMarker = [];                                                                            //置空
          let prohibitAreas = [];                                                                                 // 数组赋空
          let prohibitArr = resp.prohibitArea;                                                                    // 把结果的禁停区 赋值给禁停区数组
          prohibitArr.forEach((prohibit, index) => {                                                               // 数组循环 把poinsC的字符串按；分割
           let points = prohibit.pointsC.split(';'); 
            let len = points.length;                                                                               // 数组长度赋值
            let pArr = [];  
            for (let j = 0; j < len; j++) {
              let tempPoint = points[j].split(',') ;                                                               // 每一组 按照经纬度分割
              let p = {                                 
                latitude: Number(tempPoint[1]),                                                                     //  金纬度 赋值
                longitude: Number(tempPoint[0])
              }
              pArr.push(p);                                                                                           // push进数组
            }
            let marker = {                                                                                            //   禁停区 标记点    map业 
              id: markerIndex,
              accountId: prohibit.accountId,
              markerTip: 'prohibit',
              prohibitAreaId: prohibit.prohibitAreaId,
              iconPath: '/images/map/jintingqu@3x.png',                                                                  // 禁停区
              latitude: prohibit.laC ? prohibit.laC : prohibit.la,
              longitude: prohibit.loC ? prohibit.loC : prohibit.lo,
              width: 25,
              height: 40,                                                                                               // 禁停区  图标比例 25 40     
              zIndex: 100,
              callout: {}
            }
            markerIndex++;  // 
            prohibitAreaMarker.push(marker);
            // console.log('strokeWidth 4',);
            let _polygon = {                                                                                            // 禁停区显示的图标属性
              points: pArr,
              fillColor: "#ff223366",
              strokeColor: "#ff22339a",
              strokeWidth: 2,
              zIndex: -9
            }
            prohibitAreas.push(_polygon);                                                                                // 追加进入禁停区的数组
          });
          that.prohibitArr = prohibitAreas                                                                               // 禁停区的数组
          that.prohibitMarkerArr = prohibitAreaMarker;                                                                  // 禁停区的数组
          that.setData({
            markers: that.data.markers.concat(prohibitAreaMarker),
            polygon: [that.data.polygon[0]].concat(prohibitAreas),                                                      // 保留一块电子围栏区域
          });
        }
      })
    })
  },

  markerChange (index) {
    let markers = this.data.markers;                                                                                              // 拿到标记列表 复制
    console.log(markers);
    wx.setStorage({
      key:'current',
      data:markers[index]
    })
    let height,
        width,
        tab_height,
        tab_width,
        tab_callout;
        // console.log(markers,'周围标记点个数')
    if (markers != undefined && markers != null) {                                                                                  //标记点列表有内容不为空
      console.log(markers[index]);
      if(markers[index].userCode) {
        app.globalData.currentUserCode = markers[index].userCode
      }
      this.setData({
          goToLa: markers[index].latitude,
          goToLo: markers[index].longitude
        })
      // console.log('如果标记点列表有内容不为空',markers);
      height = markers[index].height + 10;                                                                                          // 宽高
      width = markers[index].width + 10;
      tab_height = "markers[" + index + "].height";                                                                                 // 点击的宽高和包容内容
      tab_width = "markers[" + index + "].width";
      tab_callout = "markers[" + index + "].callout.display";
    }
    if (this.lastMarkerId != undefined && this.lastMarkerId != null) {
      console.log(this.lastMarkerId,'如果lastMarkerId 不为空 不为null');
      let last_height = "markers[" + this.lastMarkerId + "].height";
      let last_width = "markers[" + this.lastMarkerId + "].width";
      let last_callout = "markers[" + this.lastMarkerId + "].callout.display"
      this.setData({
        [tab_height]: height,
        [tab_width]: width,
        [tab_callout]: 'ALWAYS',
        [last_height]: height - 10,
        [last_width]: width - 10,
        [last_callout]: 'BYCLICK'
      })
      console.log(last_height,last_width,last_callout);
    } else {
      this.setData({
        [tab_height]: height,
        [tab_width]: width,
        [tab_callout]: 'ALWAYS',
      })
    }
    this.lastMarkerId = index;
    let that = this;
    extraMap.getQQWalkingRoute(markers[index], (res) => {                          //
      // console.log(markers[index] ,'绘制路线');
      let polyline = that.data.polyline;
      // console.log(that.data.polyline,'polyline数组');
      if (that.clickFirstMarker) {
        // console.log('如果clickFirstMarker 为true ');
        polyline.pop();    // 
        // console.log('polyline数组删除并返回数组的最后一个元素');
      }
      that.clickFirstMarker = true;                                                 // 判断是否点击过marker
      polyline.push(res[0]);    
      that.setData({
        polyline
      });
      // console.log(res[0], 'that.data.polyline',that.data.polyline,'把clickFirstMarker 为true polyline 追加res[0] 把polyline 赋值');  
      if (res[0].distance) {
        that.appointDistance = res[0].distance;
        // console.log(res[0] ,'如果 res[0] 的distance 存在 把 这个值赋值给appointDistance' );
      }
    })
  },

  judgeUserState () {
    // console.log('judgeUserState-------检查用户状态 是否骑行------------->');
    let that = this;
    clearTimeout(this.borrowBikeTimer);
    this.borrowBikeTimer = null;
    return new Promise((resolve, reject) => {
      app.checkToken((token) => {
        if (token.length > 0) {
          let url = app.globalData.baseUrl + 'machine/getBorrowing.do';
          let param = {
            token: token
          }; 
          util.request(url, param, (res,res1) => {
            console.log(res);
            if(res.data) {
            if (res.data.machineNO) {                                                             //正在借车
                app.globalData.serveTime1 = new Date((res1.header.Date).replace(/-/g, "/")).getTime()
                  if(res.data.startTime) {
                    app.globalData.serveTime = new Date((res.data.startTime).replace(/-/g, "/")).getTime()
                    let serveTime = (new Date(res.data.startTime).getTime())
                  }
              resolve('isBorrowing');
              that.borrowBikeTimer = setTimeout(() => {
                that.judgeUserState();
              }, 5000)
              let park_url = app.globalData.baseUrl + 'park/getByUserId.do';
              let park_param = {
                token: token
              };
              util.request(park_url, park_param, (resp) => {                                                                    //判断有没有锁车
                if (resp.data != undefined && resp.data.length != 0) {                                                        //有数据代表临时停车
                  that.setControls(true, true, res.data);                                                                       //显示顶部控件,正在借车，临时锁车，状态
                } else {
                  that.setControls(true, false, res.data);                                                                      //显示顶部控件,正在借车，没有锁车，状态
                }
              })
            } else {                                                                                                            //没有借车
              this.setData({
                swiperMapApp: false,
                noToApp: true,
                isCloseSwiper:true,
                isSearch : false
              })
              this.setControls(false);
              reject('noBorrowing');
            }
          } else {                                                                                                            //没有借车
            this.setData({
              swiperMapApp: false,
              noToApp: true,
              isCloseSwiper:true,
              isSearch : false,
              isClickParkPoint: false,
            })
            this.setControls(false);
            reject('noBorrowing');
          }
          })
        } else {
          this.setControls(false);
          reject('logout');
        }
      });
    })
  },

  judgeUserStateBicycle () {
    console.log('-------->judgeUserStateBicycle')
    let that = this
    clearTimeout(this.borrowBikeTimer)
    this.borrowBikeTimer = null
    return new Promise((resolve, reject) => {
      app.checkToken((token) => {
        if (token.length > 0) {
          let url = app.globalData.baseUrl + 'machine/getRemand.do'
          let param = {
            token: token
          };
          util.request(url, param, (res) => {
            if (res.data != undefined && res.data.length != 0) { // 正在借车  // console.log(res);
              resolve('isBorrowing');
              that.borrowBikeTimer = setTimeout(() => {
                that.judgeUserStateBicycle();
              }, 1000)
            } else {                                              // 没有借车
              reject('noBorrowing');
            }
          })
        } else {
          reject('logout');
        }
      });
    })
  },

  setControls: function (isBorrow, isLock, borrowData) {
    // console.log(borrowData);
    let that = this;
    app.getSystemInfo((res_system) => {
      if (!isBorrow) {                                                                                                                      //没有借车
        this.setData({
          showView: false,
          markers: [],
          polyline: [],
          circles: [],
        });
        if (this.geoPolygon || this.data.polygon[0]) {
          this.setData({
            polygon: this.geoPolygon || [this.data.polygon[0]]
          })
        }
        that.setMapControls();
        if (that.machineNOStatusTimer) {                                                                                                  // 如果是强制结束订单的话，结束定时
          clearInterval(that.machineNOStatusTimer);
        }
        wx.getLocation({                                                                                                                  // 如果检测到结束订单，返回到车辆模式，渲染车辆
          type: 'gcj02',
          success: (resp) => {     
            that._loadCars(resp.longitude, resp.latitude);                                                                                //保存用户定位
             app.globalData.userLastPosition = {
              longitude: resp.longitude,
              latitude: resp.latitude
            };
          }
        });
      } else {                                                                                                                              //正在借车
        let currentTime = util.formatTime(new Date());
        app.globalData.machineNO = borrowData.machineNO;                                                                                    // 车辆编号
        let longMachineNO = '';    
        if (borrowData.machineNO.length > 9) {  
          longMachineNO = borrowData.machineNO.substring(borrowData.machineNO.length - 9, borrowData.machineNO.length)                      // 车辆编号 截取
        }
        let moneyFixed = (Number(borrowData.money) / 100).toFixed(2);                                                                         //处理费用
        let socPercent = app.globalData.socPercent;
        let surplusMileage = app.globalData.surplusMileage;
        if (isLock) {                                                                                                                           // 临时锁车
          // console.log('在临时锁车');
          app.globalData.borrowStart = borrowData.startTime
          if(!that.data.showView) {
            that.setData({
              showView: true,
            })
          }
          that.setData({
            isPark: false,  
            isRide: true,
          })
        } else {                                                                                                                                  // 没有临时锁车 骑行中 
          // console.log('在骑行');
          app.globalData.borrowStart = borrowData.startTime
          if(!that.data.showView) {
            that.setData({
              showView: true,
            })
          }
          that.setData({
            isPark: true,
            isRide: false,
          })   
        }
        if(that.data.setInter1) {
          clearInterval(that.data.setInter1)
        }
        that.data.setInter1 = setInterval( function() {
           app.globalData.serveTime1 = parseInt(app.globalData.serveTime1) + 1000
            that.setData({
              prpgress: (((borrowData.rideDeltaTime ) % 60) * 3.5),
              time: (Math.ceil((( parseInt(app.globalData.serveTime1)/1000) - (parseInt(app.globalData.serveTime)/1000))/60).toFixed(0)) + '分钟',      
            })
          borrowData.rideDeltaTime = borrowData.rideDeltaTime + 1  // 每秒都在动 
        },1000)
        that.setData({
          machineNO: borrowData.machineNO,
          longMachineNO: longMachineNO,
          mileage: borrowData.mileage + 'km',
          money: moneyFixed,  
          socPercent: socPercent,
          surplusMileage: surplusMileage,
          lastStopDeltaTimeNum : borrowData.lastStopDeltaTime || 0 ,
          // prpgress: ((borrowData.rideDeltaTime % 60) * 3.5 )
        })   
        // if(that.progressSetInterval) {
        //   clearInterval(that.progressSetInterval)
        // }
        // that.progressSetInterval = setInterval(() => {
        //   that.setData({
        //     prpgress: (((borrowData.rideDeltaTime + 1) % 60) * 3.5 )
        //   })
        // },1000);
        that.lastStopDeltaTimeSetInterval()
        app.globalData.formatTime1 = new Date(currentTime.replace(/-/g, "/")).getTime();
        app.globalData.borrowStart = new Date(borrowData.startTime.replace(/-/g, "/")).getTime(); 
        that.setMapControls();
      }
    });
  },

  // 临时停车 计时器 临停时间
  lastStopDeltaTimeSetInterval() {
    let that = this 
    if( that.data.timer11 ) {
      clearInterval(that.data.timer11)
    }
    var timer11 =  setInterval(function() {
      that.setData({ 
        lastStopDeltaTime: (parseInt(that.data.lastStopDeltaTimeNum / 60) + ':' + ((that.data.lastStopDeltaTimeNum % 60) > 9 ? (that.data.lastStopDeltaTimeNum % 60) :'0' +  (that.data.lastStopDeltaTimeNum % 60))),
        lastStopDeltaTimeNum: parseInt(that.data.lastStopDeltaTimeNum) + 1
      })
  },1000)
  that.setData({
    timer11:timer11
  })
  },

  //还车
  returnBike: function () { 
    let that = this;
    if (that.data.isFalseReturn) {                                      // 如果 未垂直停车
      // app.checkToken({
      //   if(token) {
      //     let url = app.globalData.baseUrl + 'dispatch/check.do';
      //     let param = {
      //     token: token,
      //     mapType: 2,
      //     lo : location.longitude,
      //     la : location.latitude
      //     }
      //   util.returnCheckRequest(url, param, (res) => {
      //     if (res.ret) { 
      //       let type = res.data.type;  
      //       if(type == 2 | type == 5) {
      //         console.log('不收取调度费后不需要检查头盔');
      //       } else{
      //         util.showModal_nocancel('请将车头对准主路路面\r\n摆正后再次尝试还车!');
      //         return
      //       }
      //     } else {
      //       util.showModal_nocancel('请将车头对准主路路面\r\n摆正后再次尝试还车!');
      //       return
      //     }
      //   })
      //   } 
      // })
          util.showModal_nocancel('请将车头对准主路路面\r\n摆正后再次尝试还车!');
          return
    }
    let returnAddTime = new Date().getTime()                            // new一个新时间 还车时间 赋值给全局 
    app.globalData.returnAddTime = returnAddTime  
    console.log(returnAddTime, "还车开始时间")
    if ((app.globalData.clickHelmetTimer && app.globalData.clickHelmetCount >= 10) || (app.globalData.clickHelmetCount == 0 && !app.globalData.clickHelmetTimer)) {
      if (app.globalData.clickHelmetTimer) {
        clearInterval(app.globalData.clickHelmetTimer);
        app.globalData.clickHelmetTimer = null;
        app.globalData.clickHelmetCount = 0;
      };
      wx.showToast({
        title: '正在查询',
        icon: 'loading',
        mask: true,
        duration: 15000
      })
      this.dispatchMachine((dispatchType, location) => {
        console.log('disp atchMachine开始执行');
        that.dispatchType = dispatchType;
        that.bikeOperate.returnBike(location, dispatchType, (result, money) => {
          if (result == 'timeout') {
            that.operateType = 3;       // 还车
            that.bluetoothOperate();    // 蓝牙与监测
          } else if (result == 'rfid') {
            console.log("rfid返回还车map界面");
            that.setData({
              parkMachineTip: true
            })
          } else if (result == 'success') {
            let way = "网络";
            let returnEndTime = new Date().getTime();                       // that.sendReturnBike(returnEndTime, way);
            let tip = '小程序网络还车成功(设备位置)';
            if (location != undefined && (location === '' || typeof location.longitude !== 'undefined')) {  //1.设备在线在站点、2，设备在线用手机位置。
              if (typeof location.longitude !== 'undefined')
                tip = '小程序网络还车成功(手机位置)'
              else
                tip = '小程序网络还车成功(设备位置第二次)'
            }
            app.globalData.isRiding = false   // app.globalData.noRefresh = false 
            that.setMapControls();                // 设置地图控件显示
            app.globalData.isBicycle = false;     // 全局false电动车模式
            that.toOrder();
            that.setData({
              // showView: false,   
              isClickParkPoint: true
            });
          } else if (result == '-3008') {         // 网络还车判断不在站点两次
            that.operateType = 3;
            that.bluetoothOperate();
          } else if (result == '-3004') {         
            let confirmTime = 0;           
            let interval = setInterval(() => {    // 一秒一加 弹出弹框 清除计时器 如果过了十五秒 就重新执行一次还车逻辑 没过就调用充值
              confirmTime++;  
            }, 1000);
            util.showModal('余额不足，请先充值！', () => {
              clearInterval(interval);
              if (confirmTime > 15) {
                that.returnBike();
              } else {
                that.noBalance(money, dispatchType);
              }
            })
          } else if (result == '-3006') {
            that.matchState('change');
          } else if (result == '-160005') {       // 垂直停车提示框弹出
            that.setData({
              verticalTip: true,
              isFalseReturn: true,
            });
            setTimeout(() => {
              that.setData({
                isFalseReturn: false
              });
            }, 10000)
          }
        })
      })
    } else {
      util.showModal_nocancel("归还头盔后请等待10秒再点击还车");
    }
  },

  //继续骑行
  continueRide: function () {
    let that = this;
    this.bikeOperate.continueRide((isLock) => {
      if (isLock) {
        that.operateType = 2;
        that.bluetoothOperate();
      } else {
        app.checkToken((token) => {
          let url = app.globalData.baseUrl + 'machine/getBorrowing.do';
          let param = {
            token: token
          };
          util.request(url, param, (res) => {
            if (res.data.machineNO) {
              let currentTime = util.formatTime(new Date());
              app.globalData.formatTime1 = new Date(currentTime).getTime()
              that.setData({
                time: util.timeDifference(util.isTimeUndefined(res.data.startTime), currentTime),
                mileage: res.data.mileage + 'km',
                money: (Number(res.data.money) / 100).toFixed(2),
                isPark: true,
                isRide: false,
              })
            }
          })
        })
      }
    })
  },

  // 分页查询骑行日志 跳转到骑行记录里 
  toOrder() {
    let url = app.globalData.baseUrl + 'rideLog/queryPage.do'; //4.4.2分页查询骑行日志
    wx.showToast({
      title: '正在查询订单',
      icon: 'loading',
      mask: true
    })
    app.checkToken((token) => {
      if (token.length > 0) {
        let param = {
          token: token,
          rowCount: 1,
          pageNO: 1
        };
        util.request(url, param, (resp) => {
          wx.hideToast();
          // console.log(resp.data,'分页查询骑行日志 跳转到骑行记录页面');
          app.globalData.historyItem = resp.data[0];  
          wx.navigateTo({ 
            url: `../historyOrder/historicalTrack/historicalTrack?action=order`,
          })
        });
      }
    });
  },

  //临时停车
  parkRide: function () {
    let that = this;
    wx.showModal({
      title: '温馨提示',
      content: '临时停车按正常骑行收费',
      confirmText: '临时停车',
      cancelText: '取消',
      success: (res) => {     
        that.setData({
          lastStopDeltaTimeNum: 0                                                                     // 临停时间 数字 
        })
        if (res.confirm) {
          that.bikeOperate.tempPark((isLock) => {                                                         // 蓝牙操作
            if (isLock) {
              that.setData({
                isPark: false,
                isRide: true,
                lastStopDeltaTimeNum: 0                                                                     // 临停时间 数字 
              })
              that.lastStopDeltaTimeSetInterval()
            } else {
              that.operateType = 1;
              that.bluetoothOperate();
            }  
          })
        }
      }
    });
  },

  //车辆调度查询
  dispatchMachine: function (cb) {       
    let that = this;                    
    console.log('车辆调度开始', app.globalData.userInfo)
    app.checkToken(function (token) {
      if (token.length > 0) {
        if (that.getLocationTimer) {      // 定时器 存在就先销毁 然后重新生成一个
          clearTimeout(that.getLocationTimer);
        }
        that.getLocationTimer = setTimeout(() => {
         that.returnBikeCheck(()=>{
          //  console.log('车辆调度开始1');
          that._dispatchOperate(cb, token);
         }) 
        }, 6000);
        wx.getLocation({
          type: 'gcj02',
          success(res) {
            that.returnBikeCheck(()=>{
              // console.log('车辆调度开始2',res);
              that._dispatchOperate(cb, token, res);
             }) 
          },
          fail(err) {
            // console.log(err,'车辆调度开始3');
            that.returnBikeCheck(()=>{
              that._dispatchOperate(cb, token);
             }) 
          }
        })
      }
    })
  },

  _dispatchOperate: function (cb, token,location) {
    console.log('_d ispatchOperate开始 获取区域信息的定时器存在就清楚掉');
    let that = this;
    if(that.getLocationTimer){ // 定时器存在就清除
      clearTimeout(that.getLocationTimer);
    };
    let url = app.globalData.baseUrl + 'dispatch/check.do';
    let param = {
      token: token,
      mapType: 2
    }
    if (location != undefined && location != '') {
      console.log('_dispa tchOperate开始 location 传入了 拿到经纬度 用作param参数 lo la');
      param.lo = location.longitude;
      param.la = location.latitude;
    }
    if(that.checkStatusTimer){                
      clearInterval(that.checkStatusTimer);
    }
    var count = 0;
    that.checkStatusTimer = setInterval(()=>{
      util.returnCheckRequest(url, param, (res) => {
        count ++;
        console.log("count计数",count);  
        if (res.ret) { 
        let needPay = 0; 
        if (res.data.money !== undefined) { 
          needPay = (Number(res.data.money) / 100).toFixed(2)  // 需要支付的钱
        } 
        let type = res.data.type;  // type = 3 
        console.log('调度情况：' + type + "，2不支持调度，不在还车点，3支持调度，不在运营区域还车，4支持调度，不在站点还车点 10 rfid");
          if(count > 3 || type == 1){
            clearInterval(that.checkStatusTimer);
            wx.hideToast();
            if( type == 1){                                                             // 条件都满足
              cb(type, location);
            }else if(count > 3){
              console.log('多走了一次 多走了一次 多走了一次');
              switch (type) {
                case 2:                                                                //不支持调度，不在还车点
                  that.getLastPark();
                  break;
                case 3:                                                                //支持调度，不在运营区域还车
                  if (that.data.modelType == 0) {
                    wx.showModal({
                      title: '温馨提示',              
                      content: '您目前不在运营区，请移到还车点(P点)还车，强制还车需要支付调度费用' + needPay + '元。',
                      confirmText: '强制还车',
                      confirmColor: '#65ae56',
                      cancelText: '导航',
                      success: (res) => {
                        if (res.confirm) {
                            // that.getLastPark()                        
                          cb && cb(type, location); //?
                        } else {
                          that.getLastPark();
                        }
                      }
                    })
                  } else {                                                                 // else 没有添加括号 导致现版本 两种情况没有判定全部生效了 老版本未出现 具体情况不知
                    wx.showModal({
                      title: '温馨提示',
                      content: '您目前不在运营区，强制还车需要支付调度费用' + needPay + '元。',
                      confirmText: '强制还车',
                      confirmColor: '#65ae56',
                      success: (res) => {
                        if (res.confirm) {
                          cb && cb(type, location);
                        } else {
                        }
                      }
                    })
                  }
                  break;
                case 4:                                                                         //支持调度，不在站点还车点
                  if (this.data.modelType == 0)
                    wx.showModal({
                      title: '温馨提示',
                      content: '您目前不在站点，请骑到还车点(P点)还车，强制还车需要支付调度费用' + needPay + '元。',
                      confirmText: '强制还车',
                      confirmColor: '#65ae56',
                      cancelText: '导航',
                      success: (res) => {
                        if (res.confirm) {
                          cb && cb(type, location);
                        } else {
                          that.getLastPark();
                        }
                      }
                    })
                  else
                    wx.showModal({
                      title: '温馨提示',
                      content: '当前位置为禁停区禁止还车，请骑到非禁停区还车' + needPay + '元。',
                      confirmText: '强制还车',
                      confirmColor: '#65ae56',
                      success: (res) => {
                        if (res.confirm) {
                          cb && cb(type, location);
                        } else {
                        }
                      }
                    })
                  break;
                  case 5:                                                                                        //支持调度，不在站点还车点
                    that.setData({
                      returnHelmetShowTip:true,
                    });
                    // that.getLastPark();
                  break;
                  case 6:                                                                                        //车辆运动中
                  util.showModal_nocancel("车辆在运动中，请停车后再还车!");
                  break;
                case 7:                                                                                          //未获取到车辆状态
                  util.showModal_nocancel("校验车辆状态失败，请重试!");
                  break;
                  case 8:                                                                                        //支持调度，不在站点还车点
                    that.setData({
                      verticalTip:true,
                    });
                    break;
                    case 9:                                                                                        //道钉  还未确定
                    // that.setData({
                    //   verticalTip: true
                    // });
                    break;
                  case 10:                                                                                           //rfid
                    that.setData({
                      parkMachineTip: true
                    });
                    break;
                  case 11:                                                                                           //nfc
                    util.showModal_nocancel("NFC提示:请摆正车辆");
                    break;
              }
            }
          }
        } else if (res.code == '-3006' && count > 3) {                                                                  // 在最后一次抛出异常
          wx.hideToast();
          clearInterval(that.checkStatusTimer);
          that.matchState('change');
        }else if(res.code == '-160005' && count > 3){                                                                  // 在最后一次抛出异常
          wx.hideToast();
          clearInterval(that.checkStatusTimer);
          that.setData({
            verticalTip: true,
            isFalseReturn: true,
          });
          setTimeout(() => {
            that.setData({
              isFalseReturn: false
            });
          }, 10000)
        }else if(res.code && res.msg && count > 3){                                                                     // 在最后一次抛出异常
          console.log('提示框');
          wx.hideToast();
         clearInterval(that.checkStatusTimer);
         util.showModal_nocancel(res.msg);
       } 
      })
    },1000);
  },

  //检测车辆状态  可以以后添加
  returnBikeCheck(cb){
    console.log('r eturnBikeCheck开始 传入函数 调用接口 res.ret存在 执行cb 传入的函数');
    let url = app.globalData.baseUrl + "dispatch/returnCheck.do";  // 
    let param = {
      userCode: this.data.machineNO
    };
    app.checkToken((token)=>{
      if(token.length > 0 ){
        param.token = token;
        util.request(url,param,(res)=>{
          if(res.ret){
            cb && cb();
          }
       });
      }
    });
  },
  
  //获取最近的一个站点 new
  getLastPark (cb) {
    wx.showModal({  
      title: '提示',
      content: '非还车点内禁止还车，请至附近站点还车，或按导航路径骑行至最近站点。',
      showCancel: false,
    })
    console.log('获取最近的一个站点');
    let that = this;
    let iconPath = '../../images/map/huanchedian@3x.png'; 
    app.checkToken((token) => {  
      if (token.length > 0) {
        app.getLocationInfo('gcj02', (location) => {
          let url = app.globalData.baseUrl + "parkPoint/getPark.do";
          let param = {
            token,
            lo: location.longitude,
            la: location.latitude,
            mapType: 2,
            accountId: app.globalData.accountId
          };
          util.request(url, param, (res) => {
            if (res.ret && res.data != undefined) {
              console.log(res, that.data.markers,'==========');
              this.setData({                                                                                           // 拿到 最近的还车点 的经纬度 
                goToLa: res.latitude,
                goToLo: res.longitude,
                swiperMapApp: true
              })
              that.setData({
                polyline: [],
                polygon: that.geoPolygon || [that.data.polygon[0]],                                                    //电子围栏
                markers: [],                                                                                           //骑行中的车辆
              });
              let currentMarker = res.data;
              let marker = {                                                                                           //标记点
                id: 0,
                accountId: currentMarker.accountId,
                markerTip: 'parkPoint',
                parkPointId: currentMarker.parkPointId,
                iconPath: iconPath,
                latitude: currentMarker.laC ? currentMarker.laC : currentMarker.la,
                longitude: currentMarker.loC ? currentMarker.loC : currentMarker.lo,
                width: 25,
                height: 38, // 新
                zIndex: 100,
                callout: {}
              }
              console.log('-points----8--',currentMarker);
              let points = currentMarker.pointsC.split(';');
              let len = points.length;
              let pArr = [];
              for (let j = 0; j < len; j++) {
                let tempPoint = points[j].split(',');
                let p = {
                  latitude: tempPoint[1],
                  longitude: tempPoint[0]
                }
                pArr.push(p);
              }
              // console.log('-points----9--',pArr);
              // console.log('strokeWidth 5',);
              let _polygon = {
                points: pArr,
                fillColor: "#00a2e933",
                strokeColor: "#00a2e955",
                strokeWidth: 2,
                zIndex: -9
              };
              that.setData({
                isClickParkPoint: true,
                polygon: that.data.polygon.concat([_polygon]),                                                        //电子围栏
                markers: [marker],                                                                                     //还车点
              });
              this.lastMarkerId = null;                                                                                //只出现一个最近停车点
              that.markerChange(0);                                                                                    // 0 是骑行中车辆  1 为附近站点
              that.setData({
                notMove:true
              })
              cb && cb();
            } else {
              console.log(res,'获取最近一个还车点 拿到结果 不符合 要求');
            }
          })
        })
      } else {
        console.log('获取最近的站点没有token');
      }
    })
  },

   //获取最近的一个站点 旧
   getLastPark1 (cb) {
    let that = this;
    let iconPath = '../../images/map/huanchedian@3x.png'; 
    app.checkToken((token) => {
      if (token.length > 0) {
        app.getLocationInfo('gcj02', (location) => {
          let url = app.globalData.baseUrl + "parkPoint/getPark.do";
          let param = {
            token,
            lo: location.longitude,
            la: location.latitude,
            mapType: 2,
            accountId: app.globalData.accountId
          };
          util.request(url, param, (res) => {
            if (res.ret && res.data != undefined) {
              console.log(res, that.data.markers);
              that.setData({
                polyline: [],
                polygon: that.geoPolygon || [that.data.polygon[0]],       // 电子围栏
                markers: [],                                              // 骑行中的车辆
              });
              let currentMarker = res.data;
              let marker = {                                              // 标记点
                id: 1,
                accountId: currentMarker.accountId,
                markerTip: 'parkPoint',
                parkPointId: currentMarker.parkPointId,
                iconPath: iconPath,
                latitude: currentMarker.laC ? currentMarker.laC : currentMarker.la,
                longitude: currentMarker.loC ? currentMarker.loC : currentMarker.lo,
                width: 25,
                height: 40,                                                 // 新
                zIndex: 100,
                callout: {}
              }
              console.log('pointspointspoints',currentMarker);
              let points = currentMarker.pointsC.split(';');
              let len = points.length;
              let pArr = [];
              for (let j = 0; j < len; j++) {
                let tempPoint = points[j].split(',');
                let p = {
                  latitude: tempPoint[1],
                  longitude: tempPoint[0]
                }
                pArr.push(p);
              }
              // console.log('point',pArr);
              // console.log('strokeWidth 6',);
              let _polygon = {
                points: pArr,
                fillColor: "#00a2e933",
                strokeColor: "#00a2e955",
                strokeWidth: 2,
                zIndex: -9
              };
              console.log('12121212',);
              that.setData({
                isClickParkPoint: true,
                polygon: that.data.polygon.concat([_polygon]),               // 电子围栏
                // polygon: _polygon,                                        // 电子围栏
                markers: that.data.markers.concat([marker]),                 // 骑行中的车辆
                // markers: marker,                                          // 骑行中的车辆
              });
              console.log(that.data.polygon,that.data.markers);
              this.lastMarkerId = null;                                       // 只出现一个最近停车点
              that.markerChange(1);                                           // 0 是骑行中车辆  1 为附近站点
              that.setData({
                notMove:true
              })
              cb && cb();
            } else {
            }
          })
        })
      }
    })
  },

  //余额不足
  noBalance (money, dispatchType) {
    let that = this;
    wx.showToast({
      title: '请稍候...',
      icon: 'loading',
      mask: true,
      duration: 2000
    })
    let token = app.checkToken(function (token) {
      console.log('user:', app.globalData.userInfo)
      if (token.length > 0)
        wx.login({
          success: function (res) {
            if (res.code) {
              let order_url = app.globalData.baseUrl + "weixinPay/createOrder_weixin.do";
              let order_param = {
                token: token,
                deposit: false,
                money: money,
                code: res.code,
                rechargeType: 3,
                dispatchType: dispatchType,
                adAccountId: app.globalData.adAccountId
              };
              util.request(order_url, order_param, function (resp) {
                let data = JSON.parse("\{" + resp.data.replace(/'/g, '\"') + "\}");
                wx.requestPayment({
                  'timeStamp': data.timeStamp,
                  'nonceStr': data.nonceStr,
                  'package': data.package,
                  'signType': 'MD5',
                  'paySign': data.paySign,
                  'success': function (res) {
                    // that.returnBike();
                    that.bikeOperate.getOrderStatus((result) => {   // success
                      if (result == 'timeout') {
                        that.operateType = 3;
                        that.bluetoothOperate();
                      } else if (result == 'success') {
                        let tip = '小程序网络还车成功'               
                        app.globalData.isBicycle = false;
                        that.toOrder();
                      }
                    })
                  },
                  'fail': function (res) {
                    console.log('支付出现问题');
                  }
                })
              })
            }
          }
        })
    });
  },

  // 地图标记点点击事件触发
  markertap (e) {
    let that = this 
    console.log('拿到触发事件的e',e,this.data.markers,);                                                            // 拿到标记点 // 获取到此刻的标记列表
    wx.setStorage({
      key:'lookFor',
      data: e
    })
    let index = e.markerId ;                                                                                          // 拿到标记点下表 当前渲染列表的下标 0 
    let markerType = '';      
    this.data.markers.forEach((item,index1) => {                                                                      // 遍历标记列表 匹配到了 就拿到 标记类型和下标
      if(item.id == index){
          index = index1
          markerType = item.markerTip;
      }
      console.log('标记类型 和 下标', markerType, index);
      if(markerType === 'machine' | markerType === 'parkPoint') {                                                      // 车              停车点 点击后地图不能移动 
        this.setData({
          notMove:true
        })
      }
    })
    if (!this.data.isAppointing && markerType != 'arrow' && markerType != 'ridingChe') {                                    //parkPointLength为站点标记的长度没有预约 且 是arrow 且不是车子标记
      // console.log(this.data.isAppointing,markerType,'当前没在预约 标记类型 不是arrow 也不是 ridingChe 时触发');
      if (!this.data.showAppoint) {
        // console.log(this.data.showAppoint,'当前没在展示预约 ，执行markerChange');
        this.markerChange(index);
      } else if (markerType != 'parkPoint' && markerType != 'prohibit') {                                                     // 如果点击预约，不能再点击其他站点和禁停区 
        // console.log(markerType,'标记类型不是停车点 且 不是禁停区 执行markerChange'); 
        this.markerChange(index);
      }
    } else {
      // console.log('1');
      // console.log(index,this.data.machineMarkrCopy);
      if(markerType === 'parkPoint') {
        this.markerChange(index)
      }
    }
    // 支持预约并且处于非预约、非借车状态 不是垂直箭头  不是骑行中车辆  不是站点和禁停区
    if (app.globalData.supportAppoint && !this.data.isAppointing && !this.data.showView && this.data.showType == 1 && markerType != 'arrow' && markerType != 'ridingChe' && markerType != 'parkPoint' && markerType != 'prohibit') {
      this.showTopAppoint(index);
      // console.log('showTopAppoint');
    }
    console.log(markerType);
    if(markerType === 'parkPoint') {                                                                                                // 还车点      搜索状态变为不能搜索
      this.setData({
        swiperMapApp: true,
        noToApp: false,
      })   
    }
  },

  noInput() {
    if(this.data.keyword === '') {                                                                                                // 如果这个输入框没有内容 点击地图 设置成轮播图
          this.setData({
            // isCloseSwiper: false,
            hadInput: false,
            // isSearch: false,
            suggest: [],
          })
        }
  },

  tabMap() {
    this.setData({
      swiperMapApp: false,
      noToApp: true,
      isLastPark: false   // 是否找寻最近的一个站点
    })
    // this.noInput()                                                                     
    console.log('点击了地图',this.lastMarkerId,!this.data.isAppointing);
    // if (this.lastMarkerId != undefined && this.lastMarkerId != null) {
    if (this.lastMarkerId != undefined && this.lastMarkerId != null && !this.data.isAppointing) {
      let markers = this.data.markers;
      let height = markers[this.lastMarkerId].height - 10;
      let width = markers[this.lastMarkerId].width - 10;
      let last_height = "markers[" + this.lastMarkerId + "].height";
      let last_width = "markers[" + this.lastMarkerId + "].width";
      let last_callout = "markers[" + this.lastMarkerId + "].callout.display"
      console.log(this.data.markers,height,width,last_height,last_width,last_callout,);
      this.setData({
        [last_height]: height,
        [last_width]: width,
        [last_callout]: 'BYCLICK',        //byclick
      })
      if (this.isBorrow && this.arrowPolylines) {                                           //借车，有垂直停车线
        console.log('借车，有垂直停车线',this.data.polyline);
        let polyline = this.data.polyline;
        let newPolyline = [];
        for (var i = 0; i < polyline.length - 1; i++) {
          newPolyline.push(polyline[i]);
        }
        this.clickFirstMarker = false;
        this.setData({
          polyline: newPolyline
        })
        console.log('遍历后的新polyline数组',this.data.polyline);
      } else {                                                                              // 没借车 或者没有垂直停车线
        this.setData({
          polyline: []
        });
        console.log('没有polyline数组 数组为空',this.data.polyline);
      }
      this.lastMarkerId = null; 
      console.log('最后把这个lastMarkerId为null',this.data.lastMarkerId);
    }
    if (!this.data.isAppointing && this.data.showAppoint) {
      console.log(this.data.isAppointing,this.data.showAppoint,'前false 后true 就把 showAppoint 为false ',this.data.showAppoint);           
      this.setData({
        showAppoint: false,
        notMove:false
      });
    }
    this.setData({
      notMove:false
    })
  },

  showExtraMenu: function () {
    let that = this;
    app.checkToken((token) => {
      if (token.length > 0) {
        that.setData({
          showEx: true,
        })
      } else {
        wx.navigateTo({
          url: '../login/login',
        })
      }
    })
  },

  moveTo: function () {
    this.mapCtx.moveToLocation();
  },

  // moveTo1: function () {
  //   // this.mapCtx.moveToLocation();
  //   this.getLastPark()
  // },

  tipCancel: function (e) { //关闭提示框
    this.setData({
      tipDialog: false
    })
  },

  tipConfirm: function (e) { //提示框点击确认
    this.noBalance(this.data.noBalanceData)
    this.setData({
      tipDialog: false
    })
  },

  hideEx: function () {
    this.setData({
      showEx: false
    })
    //this.exAnimation('down')
  },

  hideContactEx: function () {
    this.setData({
      showContact: false
    })
    //this.exAnimation('down')
  },

  knownTap () { //关闭蓝牙引导
    console.log('8',this.data.guideDialog);     
    this.setData({
      guideDialog: false,
    })
    console.log('88',this.data.guideDialog);     
    this.setMapControls();
  },

  closeVerticalTip: function () {
    this.setData({
      verticalTip: false,
    });
  },
  closeParkMachineTip: function () {
    this.setData({
      parkMachineTip: false,
    });
  },

  phoneCall: function (e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },

  toSearch: function () {
    this.setData({
      isSearch: true, 
      swiperMapApp:false
    })
  },

  /**
   * 我的信息 未登录跳转登录
   */
  toMyInfo () {
    if (app.globalData.userInfo) {
      // this.setData({
      //   showMyInfo: true
      // })
      wx.navigateTo({
        url: '../myInfo/myInfo',
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },

  toInstructions () {
    wx.navigateTo({
      url: '../instructions/instructions',
    })
  },

  /**
   * 点击 用户指南
   */
  toGuide () {
      wx.navigateTo({
        url: '../../rideHelp/pages/guide/guide'
      })
  },

  /**
   * 平台客服
   */
  toHelp () {
    wx.navigateTo({
      url: '../help/help'
    })
  },

  onShareAppMessage () {
    return {
      title: '',
      path: '/pages/map/map',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  renderError() {
    console.log("*** 同层渲染失败！！！")
  },

  initMapControls() {   
    var that = this;
    app.getSystemInfo(function (res_system) {
      let controls = [];
      that.setData({
        controls
      });
    })
  },

  setMapControls() {
    let that = this;
    let guideDialog = this.data.guideDialog;
    let showView = this.data.showView;
    app.getSystemInfo(function (res_system) {
        that.setData({
          SupportHelMet: (!guideDialog && showView && app.globalData.isSupportHelMet) ? true : false,
          showHelMet: (!guideDialog && showView && app.globalData.isSupportHelMet) ? true : false,
        })
    });
  },

  //控件事件
  controlsEvent: function (e) {
    var that = this;
     if (e.controlId == 6) {
      that.openHelMetLock()
    }
  },
  
  openHelMetLock () {
    let that = this;
    let machineNO = this.data.machineNO;
    app.openHelMetLock(machineNO, ()=>{
      that.setData({
        lendHelmetShowTip:true,
        isButtonLendHelmetShowTip:true
        // helmetTipSrc:"../../images/lendHelmetTip.gif"
      });
    });
  },

  showTopAppoint (index) {                                    // 拿到标记列表拿到 指定标记 赋值相关编号 电量 可行驶距离
    let markers = this.data.markers;
    let thisMarker = markers[index];
    this.thisMarker = thisMarker;
    let bicycleInfo = {
      userCode: thisMarker.userCode,
      socPercent: thisMarker.socPercent,
      surplusMileage: thisMarker.surplusMileage
    }
    this.setData({
      showAppoint: true,
      thisBicycle: bicycleInfo
    });
    console.log(this.data.thisBicycle);
  },

  getAppointStatus: function () {                                                                                   // 预约状态
    let that = this;
    if (app.globalData.baseUrl) {
      console.log("app.globalData.baseUrl存在 is not borrowing... 循环处于借车状态")
      let url = app.globalData.baseUrl + "appointMent/getByUserId.do";
      app.checkToken((token) => {
        if (token.length > 0) {
          util.request(url, {token}, (res) => {    
            if (res.ret && res.data) {
              let data = res.data;
              let appointMaxTime = data.time * 60;                                                                // 最大预约时间
              let nowTime = Date.parse(new Date());                                                                   // 当前时间戳
              let pastTime = (nowTime - data.appointmentTime) / 1000;                                               // 距离开始预约，已经过去的时间
              let restTime = appointMaxTime - pastTime;                                                              // 预约剩余时间（单位：秒）
              that.appointRestTimeCounter(restTime);                                                                  // 预约倒计时 计时器
              let bicycleInfo = {                                                                                     // 赋值 编码
                machineNO: data.machineNO,
                userCode: data.userCode,
                socPercent: data.socPercent,
                surplusMileage: data.surplusMileage,
              }
              if (!that.thisMarker) {
                let allMarkers = that.allMarkers;
                allMarkers.forEach((item) => {
                  if (item.userCode == data.userCode) {
                    that.thisMarker = item;
                  }
                });
              }
              // if(bicycleInfo.machineNO && that.data.appointFormatTime){                                   // 拿到机器码才 设置 
                that.setData({ 
                  markers: [that.thisMarker],
                  thisBicycle: bicycleInfo,
                  showAppoint: true,
                  isAppointing: true
                });
              // }
              extraMap.getQQWalkingRoute(that.thisMarker, (res) => {                                             // 保证只有一条预约线路
                that.setData({
                  polyline: [].concat(res)
                })
              })
            } else {
              clearInterval(this.data.getAppointInterval2)                                                // 清除定时器
              that.setData({
                markers: that.allMarkers,
                thisBicycle: null,
                showAppoint: false,
                isAppointing: false,
                polyline: []
              });
            }
          });
        }
      })
    } else {
      setTimeout(() => {
        that.getAppointStatus();
      }, 100);
    }
  },

  // 预约事件
  appoint () { 
      console.log("距离车的距离：", this.appointDistance);
      if (this.appointDistance > 500) {      // 距离车大于500不给借
        // if (this.appointDistance > 50000) {
        wx.showModal({
          title: '温馨提示',
          content: '本车距离过远，为避免不能及时骑车，请换辆车试试',
          confirmText: '好的',
          showCancel: false
          })
        return;
      }
      let url = app.globalData.baseUrl + "appointMent/add.do";
      app.checkToken((token) => {
        if (token.length > 0) {                // 有token 
          util.request(url,{
            userCode: this.data.thisBicycle.userCode,
            token : token,
          }, (res) => {
            if (res.ret) {
              // this.getAppointStatus() 
              this.setData({
                isAppointing:true
              })
              wx.showToast({
                title: '预约成功',
                icon: 'none'
              })
              let that = this 
              var getAppointInterval2 = setInterval(function(){                        // 预约路径渲染
                if(!that.data.isClickParkPoint) {
                  that.getAppointStatus();
                } else {
                  console.log('还车点状态 不渲染路径');
                }
              },3000)
              this.data.getAppointInterval2 = getAppointInterval2
            }else{
              this.setData({
                isAppointing:false
              })
            }
          });
        } else {                                                                                                              // 没有token 退出到登录
          wx.navigateTo({
            url: '../login/login'
          })
        }
      })
    // } )
  },

  cancelAppoint: function () {
    let that = this;
    let url = app.globalData.baseUrl + "appointMent/del.do";
    app.checkToken((token) => {
      if (token.length > 0) {
        let param = {
          token
        };
        util.request(url, param, (res) => {
          console.log(res);
          if (res.ret) {
            clearInterval(that.appointRestTimer);
            that.setData({
              appointFormatTime: '',
              thisBicycle: null,
              showAppoint: false,
              isAppointing: false,
              polyline: []
            });
            if (!that.isBorrow) {
              that.setData({
                markers: that.allMarkers, 
              });
            }
          }
        })
      }
    })
    clearInterval(that.data.getAppointInterval)        // clearInterval(getAppointInterval) // 清除获取预约路线的定时器
    clearInterval(that.data.getAppointInterval2)
    that.setData({
      getAppointInterval : null,
      getAppointInterval2: null,
        notMove:false    
    })         // clearInterval(getAppointInterval2) // 清除获取预约路线的定时器
  },

  searchAppointBicycle () {
    console.log('1');
    let that = this;
    app.checkToken((token) => {
      wx.showToast({
        title: '指令发送中',
        icon: 'none'
      });
      let url = app.globalData.baseUrl + "terControl/sendControl.do";
      let param = {
        token: token,
        machineNO: that.data.thisBicycle.machineNO, // machineNO
        controlType: 'control',
        paramName: 9
      };
      util.request(url, param, (res) => {
        if (res.ret) {
          wx.showToast({
            title: '指令发送成功',
            icon: 'none'
          });
        }
      })
    })
  },

  // 预约时间计数器
  appointRestTimeCounter (restTime) {
    // restTime剩余预约时间
    let that = this;
    let thisRestTime = restTime;
    clearInterval(that.appointRestTimer);
    that.appointRestTimer = setInterval(() => {
      if (thisRestTime <= 0) {
        wx.showToast({
          title: '预约超时',
          icon: 'none'
        });
        clearInterval(that.appointRestTimer);
        that.getAppointStatus();
      }
      let appointFormatTime = '';
      if (thisRestTime < 60 && thisRestTime >= 0) {
        let seconds = '';
        if (thisRestTime < 10) {
          seconds = '0' + thisRestTime;
        } else {
          seconds = thisRestTime;
        }
        appointFormatTime = '00:' + seconds;
      } else if (thisRestTime >= 60 && thisRestTime <= 3600) {
        let minutes = ((thisRestTime / 60).toFixed(2)).split(".")[0];
        let seconds = thisRestTime % 60;
        if (seconds < 10) {
          seconds = '0' + seconds;
        }
        appointFormatTime = minutes + ':' + seconds;
      }
      that.setData({
        appointFormatTime
      });
      thisRestTime--;
    }, 1000);
  },

  showStartAdFunc (img) {
    this.setData({
      startAdImage: img
    });
  },

  //点击跳过广告
  skipStartAd () {
    this.setData({
      showStartAd: false
    });
  },

  loadStartAdImage: function () { // 图片载入完毕时触发
    this.setData({
      hadLoadStartAdImage: true,
      showSkip: true
    });
  },
  //定时器的更改
  adChangeTime() {
    let that = this;
    let interval = setInterval(() => {
      let startPageAdTime = that.data.startPageAdTime;
      if (startPageAdTime == 0) {
        clearInterval(interval);
        that.setData({
          showStartAd: false
        });
        // that.()   
        return;
      }
      startPageAdTime--;
      that.setData({
        startPageAdTime
      });
    }, 1000);

  },

  closeLendOrReturnHelMetTip() {
    this.setData({
      lendHelmetShowTip: false,
      isButtonLendHelmetShowTip:false
    });
    app.globalData.isShowHelMetTip = false; 
    this.setData({
      returnHelmetShowTip:false, //归还头盔锁提示
      lendHelmetShowTip:false,  //借头盔锁提示
    });
  },

//点击充值
recharge () {
  if (app.globalData.userInfo) {    //跳转界面
    wx.navigateTo({
      url: `../recharge/recharge`
    });
  } else {
    wx.navigateTo({
      url: '../login/login',
    })
  }
},

// 点击(骑行)套餐
ridePackage (e) {
  let userInfo = app.globalData.userInfo;
  if (userInfo) {
    wx.navigateTo({
      url: '../ridePackage/ridePackage?type=' + e.currentTarget.dataset.type
    });
  } else {
    wx.navigateTo({
      url: '../login/login',
    })
  }
},

  //获得未读消息 有显示小红点 没有显示没红点
  getMesssage(msgState) {
    let that = this; 
    let url = app.globalData.baseUrl + "userMsg/queryPage.do"
    let param = {};
    if (msgState != undefined) {                                              // 0 true
      param.msgState = msgState;                                              // 没传值 也赋值给0
    }
    app.checkToken((token) => {
      if (token.length > 0) {
        param.token = token;  
        util.request(url, param, (resp) => {                                   // console.log(resp,'11request1121122222222222222222211111');
          if (resp.ret) {                                                      // 1   // console.log(resp);
             if(resp.data.length){
               that.setData({
                hasMessage: true,                                              //  设置有未读消息
               })
             }else{
              that.setData({
                hasMessage: false,                                              // 设置没有未读消息
               })
             }
            } 
            })
          }
      })
    },

    // 前往未付款
    getNoPay(options) {
      let that = this
      let url = app.globalData.baseUrl + 'rideLog/queryPage.do';
      app.checkToken(function (token) {
        if (token.length > 0) {
          util.request(url, { token: token, rowCount: 1, pageNO: 1 }, function (resp) {
            console.log(resp);
          if(resp.data.length != 0) {                                                                                             // 有数据 
            if(resp.data[0].startTime) {                                                                                          // 如果这个订单有开始时间 
                let newTime = new Date().getTime()
                if(((newTime - (new Date((resp.data[0].startTime)).getTime())) > 60480000)){ // 存储的时间如果大于7天 就是十天没订单 出现学习 然后存储后面十天的时间戳
                  console.log(options);
                  if(options.studyLead === 'false') {
                    console.log('h5返回');
                  } else {
                    wx.navigateTo({
                      url: '../lookPark/lookPark',
                    })
                    }
                  }                           
                } 
            if( (resp.data[0].payTime) === '' ) {        // 支付时间为空 就是没有支付的一般是客服结束
              if ( resp.data.length != 0) {
                let historyOrder = {}
                  let time = "";
                  if (resp.data[0].endTime){
                    time = util.timeDifference(resp.data[0].startTime, resp.data[0].endTime)
                    time = 60 * ( parseInt(time) )
                  }
                  historyOrder = {
                    userCode: resp.data[0].userCode,
                    machineId: resp.data[0].machineId,
                    startTime: resp.data[0].startTime,
                    endTime: resp.data[0].endTime,
                    mileage: resp.data[0].mileage,
                    time: time ,
                    money: resp.data[0].money,
                    remark: resp.data[0].remark
                  }
                  that.setData({
                    historicalTrack: historyOrder
                  })        
              }
                setTimeout(() => {
                  that.goPay()
                }, 1000);   
              } else {
              }
              }
            })
          } 
        })
  },

      
  loadSet() {
    this.conctrlLoading = false;                                         //控制锁
    this.clicked = false;                                               //点击控制，防重复
    this.isBorrow = false;                                              //标记是否处于借车状态
    this.machineMarkrs = [];                                            //记录
    this.mapCtx = wx.createMapContext('myMap');                         // 使用 wx.createMapContext 获取 map 上下文 
    this.stillOutSideCode = false;
    this.allMarkers = [];                                                // 所有的标记 为空
    this.showStartAdTime = 5000;                                        // 启动页广告展示时间 
    this.showParkLock = false;
    this.bluetooth_new = new Bluetooth_new();                           // 单车锁蓝牙方法
    if(!this.data.showView){                                          // 如果s howView不存在 把头盔锁 置false
      this.setData({
       returnHelmetShowTip:false,
       subkey: app.globalData.subkey
      })
     }
    if (app.globalData.mobileOS.indexOf("iOS") > -1) {                  //判断是安卓就更换蓝牙提示图片 且设置为不是ios
      this.setData({
        guideImage: '../../images/bluetooth_g_a.png',
        isIos: false
      })
    }
  },

    // 拿默认数据
    preInit () {
      let mainColor = wx.getStorageSync('mainColor');
      let textColor = wx.getStorageSync('textColor');
      let headColor = wx.getStorageSync('headColor');
      let baseUrl = wx.getStorageSync('baseUrl');
      let phone = wx.getStorageSync('phone');
      let name = wx.getStorageSync('name');
      this.phone = phone;
      this.setData({
        mainColor: mainColor,
        textColor: textColor,
        headColor: headColor,
        title: name || '百姓快租'   //默认标题 
      })
    },
  
   //设置顶部文字高度
   setTop: function () {
    let that = this;
    setTimeout(() => {
      let sysinfo = wx.getSystemInfoSync();
      let jiaonangheight = wx.getMenuButtonBoundingClientRect().height + 10
      console.log(sysinfo,jiaonangheight);
      let topImageHeight = (55 / 355) * (sysinfo.windowWidth - 20);
      let topTitleHeight = 0,
          mapHeaderHeight = 0;
      const query = this.createSelectorQuery();
      query.select('.top-title').boundingClientRect(rect => { // .top-title虽然高度已知（40px），但也需要通过这种方式获取实际高度，
        console.log(rect);
        topTitleHeight = rect.height; // 因为它在部分真机中并不是40px
      }).exec();
      query.select('.map-header').boundingClientRect(rect => {
        mapHeaderHeight = rect.height;
      }).exec();
      let setCSSInterval = setInterval(() => {
        if (topTitleHeight && mapHeaderHeight) {
          setCSS();
        }
      }, 300);
      function setCSS() {
        clearInterval(setCSSInterval);
        that.setData({
          jiaonangheight : jiaonangheight,
          topHeight: sysinfo.statusBarHeight,
          topHeightone:sysinfo.statusBarHeight + (sysinfo.titleBarHeight - 32)/2,
          topImageWidth: sysinfo.windowWidth - 20,
          topImageHeight: topImageHeight,
          //  topAreaHeight: sysinfo.statusBarHeight + mapHeaderHeight + topTitleHeight,
          topAreaHeights: sysinfo.statusBarHeight + mapHeaderHeight + topTitleHeight,
          mapHeight: sysinfo.windowHeight - 230, //地图距离顶端的距离
        })
        console.log(that.data.topHeight);
      }
      // that.setData({
      //   topHeight: sysinfo.statusBarHeight,
      //   topImageWidth: sysinfo.windowWidth - 20,
      //   topImageHeight: topImageHeight
      // })
    }, 500)
  },

    // 每个3s检查车辆状态位置
  getMachineStatusOnRiding:function(userCode){
    // console.log( 'getMachineStatusOnRiding 检查车辆状态位置');
    if(userCode){ 
    let that = this;
    let url = app.globalData.baseUrl + "machineStatus/getByUserCode.do";
    let param = {
      userCode,
      mapType: 2
    };
    app.checkToken(token =>{
      if(token.length > 0){
         param.token = token;
         util.request(url, param, (res)=>{
          if (res.data){
            // console.log(res);
            that.setData({
              surplusMileage11 : res.data.surplusMileage,
            })
            that.checkInGeo(res.data.lonC,res.data.latC)                                                                // 传入经纬度       // lon 原始        lonC 校准数据
          } 
        });
      }
    });
  } else {
    console.log('开始无车');
  }
  },

  // 检查是否在电子围栏
  checkInGeo(lo,la) {
    let that = this 
    let url = app.globalData.baseUrl + "geo/getInGeo.do";
    let param = {
      lo, 
      la,
      mapType: 0, 
      accountId: app.globalData.accountId
    }
    util.request(url,param,(res)=>{
      if(res.ret){                                                                      // 运营区的 电子围栏 存在
        // console.log( '电子围栏是否存在？',res);
        if(res.data){
        let arr = res.data.pointsC.split(';')
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
        let flag1 =  that.isInPolygon([lo,la],lastArr)                                     // 带入计算点是否在多边形的算法中 返回 true  false
        if(flag1){                                                                           // data 存在就是 在区域内
          that.setData({ 
            notArea : false  
          })
        }else{                                                                               // 不在 超区
          that.setData({
            notArea : true 
          })
        }
      }else{                                                                                 // 获取不到运营区的 电子围栏
        that.setData({
          notArea : true 
        })
      }
    }
    })
  },

// 检查点是否在多边形中算法
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

  isHistroyBack() {
    if(app.globalData.isHistroyBack) {
      this.setData({
        swiperMapApp: false,
        noToApp: true,
        isCloseSwiper:true,
         isSearch : false
      })
      app.globalData.isHistroyBack = false 
    }
  },

   //点击扫码骑行
   riding: function() {
    this.setData({
      hasSama: false,
      // waitPay: false,
    })
    let that = this
    that.scanCode();
},

  //扫码 
  scanCode () {
    console.log('12');
    let that = this;
    app.globalData.autoAction = 'scan';
    this.checkUserStatus().then(() => {
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
          } else {                                                                                                                // 获取到设备号了
            let machineNORex = /\d{6,}/;
            let ret = result.match(machineNORex);                                                                                   // console.log("内部扫描内容:", result, ret);
            if (ret) {                                                                                                              // 手动取消预约
              if (that.data.isAppointing) {
                that.cancelAppoint();
              }
              if(that.data.isClickParkPoint){
                that.clearAllAboutPark();
                that.setData({
                  isClickParkPoint:false
                });
              }
              let machineNO = ret[0];
              app.globalData.machineNO = machineNO;
              that.setData({ 
                keyword : '',
                hadInput: false,
                isCloseSwiper: true,
                isSearch: false 
              })
              wx.navigateTo({
                url: "../machineStatus/machineStatus?machineNO=" + machineNO                                                            //跳转到机器状态页面了
              })
            } else {
              wx.showToast({
                title: '无效二维码',
                icon: 'none',
              })
            }
          }
        }
      });
    }, () => {
      wx.hideToast();
      this.stillOutSideCode = true;
    })
  },

    // 蓝牙连接 重试 执行蓝牙与检测
    retry: function () {
      this.setData({
        flag: false,
      })
      this.bluetoothOperate();
    },
  
    //执行蓝牙与检测
    bluetoothOperate: function () {
      let that = this;
      wx.openBluetoothAdapter({
        success: (res) => {
          if (that.operateType == 1) { //临时停车
            that.bikeOperate.openLock('1', () => {
              that.setData({
                isPark: false,
                isRide: true
              })
            })
          } else if (that.operateType == 2) { //继续骑行
            that.bikeOperate.openLock('2', () => {
              that.setData({
                isPark: true,
                isRide: false
              })
            })
          } else if (that.operateType == 3) { //还车
            that.bikeOperate.openLock('3', () => {
              let returnEndTime = new Date().getTime();
              that.setData({ 
                showView: false, //控制借车弹窗
              });
              that.setMapControls();
              app.globalData.isBicycle = false; //不是单车
              that.toOrder(); 
            }, that.dispatchType);
          }
        },
        fail: (err) => {
          console.log(err);
          if (err.errCode == '10001' || err.errCode == '10008') {
            that.setData({
              flag: true,
            })
          }
        }
      })
    },
  
    //蓝牙未开提示弹窗
    cancel: function (e) { //取消蓝牙还车流程
      app.bluetooth.end();
      this.setData({
        flag: false,
      })
    },

     //跳转广告url
  toTarget (e) {
    let targetUrl = e.currentTarget.dataset.url;
    if (targetUrl && targetUrl.length > 0) {
      if (targetUrl.indexOf('http') > -1) {
        wx.navigateTo({
          url: '../urlTarget/urlTarget?targetUrl=' + targetUrl,
        })
      } else if (targetUrl.indexOf('wx') > -1) {
        wx.navigateToMiniProgram({ // 跳转小程序主界面
          appId: targetUrl, //appid
          path: '', //path
          envVersion: 'release', //开发版develop 开发版 trial   体验版 release 正式版 
          success(res) {
          }
        })
      } else {
        if (app.globalData.userInfo) {
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
        } else {
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
        setTimeout(() => {
          this.setData({
            showStartAd: false
          });
        }, 500);
      }
    }
  },

  refresh() {
    wx.showToast({
      title: '正在刷新',
      icon: 'loading',
      mask: true,
      duration: 1500
    });
    wx.reLaunch({
      url: 'map',
    })
  },
  closeMyInfo() {
    this.setData({
      showMyInfo: false,
      })
  },
  nothing() {
    console.log('1');
  },
  /**
   * 选择项目
   * @param {} e 
   */
  toWhith(e) {
    if(e.currentTarget.dataset.title == 0) {
     this.toWallet()
    } else if(e.currentTarget.dataset.title == 1) {
     this.toCoupon()
    } else if(e.currentTarget.dataset.title == 2) {
     this.toCard(2)
    } else if(e.currentTarget.dataset.title == 3) {
      this.ridePackage(0)
    } else if(e.currentTarget.dataset.title == 4) {
      this.topMyMessage()
    } else if(e.currentTarget.dataset.title == 5) {
     this.topUpDetail()
    } else if(e.currentTarget.dataset.title == 6) {
     this.usingRecord()
    } else if(e.currentTarget.dataset.title == 7) {
    //  this.toAnswer()
    this.exitLogin()
    } 
   },
   /**
   * 跳转到钱包
   */
  toWallet: function () {
    wx.navigateTo({
      url: `../wallet/wallet?depositState=${app.globalData.userInfo.depositState}&depositMoney=${app.globalData.userInfo.depositMoney}&actualMoney=${app.globalData.userInfo.money}`
    });
},
   /**
     * 跳转到优惠卷页面
     */
    toCoupon: function(){
      wx.navigateTo({
        url: `../coupon/coupon`
      });
  },
   /**
   * 跳转到会员卡
   */
  toCard(num) {
    wx.navigateTo({
      url: '../membershipCard/membershipCard?type=' + num
    });
},
 /**
   * 点击骑行套餐
   * @param {*} e 
   */
  ridePackage: function (num) {
    wx.navigateTo({
      url: '../ridePackage/ridePackage?type=' + num
    });
},
    //我的消息
    topMyMessage:function(){
      //登录正常点击后 设置状态为已读true
      this.setData({
        hasRead:  true
      })
      wx.navigateTo({
        url:"../myMessage/myMessage"
      })
  },
    //充值记录 账单明细
    topUpDetail: function () {
      wx.navigateTo({
        url: '../historyRecharge/historyRecharge'
      });
  },
    //骑行记录
    usingRecord: function () {
      wx.navigateTo({
        url: '../historyOrder/historyOrder'
      });
  },
    //充值记录 账单明细
    toAnswer: function () {
      wx.navigateTo({
        url: '../answer/answer'
      });
  },
  // 退出登录
  exitLogin() {
    this.setData({
      dialogShow: true
    })
  },
  /**
 * 取消事件 退出登录事件 
 * @param {*} e 
 */
 tapDialogButton(e) {
  let that = this;
  if(e.detail.index == 0){
       this.setData({
           dialogShow: false,
       })
     }else{
       wx.setStorageSync('token', '')
       app.globalData.userInfo = null;
       // app.globalData.noRefresh = false
       wx.reLaunch({
         url: '../map/map',
       })
     }
   },
   infoOnshow() {
     let that = this 
    let userInfo = app.globalData.userInfo;                                        // 全局用户信息
    console.log(userInfo);                                                         // 打印用户信息
    if(userInfo){                                                                  // 如果存在
      this.setData({
        phone: app.globalData.userInfo.phone || '',
        isNeedDeposit:app.globalData.accountId == 100197 ? false : true    // 百姓快租不需要免押
       })
      that.infoForm(userInfo)       
      app.checkToken(function (token) {
        if (token.length > 0) {
          //that.getMsg(token);
          let user_url = app.globalData.baseUrl + "user/getByUserId.do";
          let user_param = { 
            token: token ,
          };
          if (app.globalData.adAccountId && app.globalData.adAccountId != "") {
            user_param.adAccountId = app.globalData.adAccountId
          }
          util.request(user_url, user_param, function (resp) {    //wx.hideToast();
            console.log("用户信息:" + JSON.stringify(resp));
            if (typeof resp.data != 'undefined') {
              app.globalData.userInfo = resp.data;
              that.infoForm(resp.data); 
            }
          });
        } else {                                           //wx.hideToast();
          app.globalData.userInfo = null;
          that.setData({
            isLogin: false,
          })
        }
      });
    }else{
      app.globalData.userInfo = null;
      that.setData({
        isLogin: false,
      })
    }
    this.getMesssage(0)   // 获取是否有未读消息
   },
   infoForm: function(userInfo){
    wx.setStorageSync('nameAuth', userInfo.nameAuth)                                                // true实名 false 未实名 
    let nameAuth = userInfo.nameAuth ? "已实名" : '点击前往实名认证';                                 // 实名 名字真实 
    let studentAuth = userInfo.depositState == 5 ? "已认证" : "未认证"                              // 学生认证 
    this.setData({
      nameAuth: nameAuth,
      studentAuth: studentAuth,
      isLogin: true,
      // rideCardDate: userInfo.rideCardDate ? userInfo.rideCardDate : null,
      // depositDate: userInfo.depositDate ? userInfo.depositDate : null,
      // vipDate: userInfo.vipDate ? userInfo.vipDate : null,
      rideCardDate: userInfo.rideCardDate || null,                                                     // 骑行卡 日期
      depositDate: userInfo.depositDate || null,                                                      //  押金
      vipDate: userInfo.vipDate || null,                                                              // 套餐
    })
  },
})