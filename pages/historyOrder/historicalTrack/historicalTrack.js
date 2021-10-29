let app = getApp();
let util = require('../../../utils/util');
Page({

  //页面的初始数据
  data: {
    subkey:'VYUBZ-LNCCU-LJCVJ-2C6MK-U4CH5-N4BH7',
    areaPolygon:[],
    membershipCard:'',
    isPay:true,
    gift:'',
    hadPay:false,
    noPay:false,
    ruleShow:false,
    surplusMileage:'',
    scale: 20,
    longitude: '113.949702',
    latitude: '22.55011',
    polyline: [{
      points: [],
      color: '#dd52ac',
      width: 2,
    }],
    polygons: [{                     // 新需求 订单详情增加运营区 解决超区纠纷
      points: [],
      strokeWidth: 5,
      strokeColor: '#FF0000DD',
      fillColor: '#FF000009',
      zIndex: -9
    }],
    markers: [],
    item: {},
    all: '',                          // 总费用
    riding:'',                        //骑行费用
    stopPay:'',                       //停车费用
    stopTime:'',                      //停车测时长
    card:'',                          //礼品卡费用
    dispatch:'',                      //调度费用
    circles: [],
    mainColor: '#3FD572',
    textColor: '',
    faultDialog: false,
    isBicycle: false,                    // true单车模式，false电动车模式
  },

  getGeoByMachine() {
    let that = this 
    let url = app.globalData.baseUrl + "geo/getByAccountId.do";
    app.checkToken((token) => {
      if (token.length > 0) {
        let param = {
          token: token,
          accountId: app.globalData.accountIdPart,
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
    console.log(adAccountFee);  
    if (adAccountFee.rechargeBase) {
      this.rechargeBase = (Number(adAccountFee.rechargeBase) / 100).toFixed(2);
    }
    let baseTime = adAccountFee.baseTime;                                   //起步时间
    let baseTimeFee = (Number(adAccountFee.baseTimeFee) / 100).toFixed(2); /*起步金额*/
    let overTime = adAccountFee.overTime;                                   //超时时间
    let overTimeFee = (Number(adAccountFee.overTimeFee) / 100).toFixed(2); /*超时时间费用*/
    let freeTime = adAccountFee.freeTime;                                   //免费时间
    let dispatchConfig = null;
    let baseTime_A = '计费规则';
    let baseTime_C = null;
    if (baseTime != 0) {
      if (freeTime != undefined && freeTime != 0) {
        baseTime_C = "前" + freeTime + "分钟内免费";
      }
        baseTime_A = baseTime + "分钟内" + baseTimeFee + "元，超出" + overTimeFee + "元/" + overTime + "分钟";
    } else {
      baseTime_A = "按" + overTimeFee + "元/" + overTime + "分钟"
    }
    if (adAccountFee.dispatchSwitch) {
      dispatchConfig = {
        parkPointFee: (Number(adAccountFee.parkPointMoney) / 100).toFixed(2),
        areaFee: (Number(adAccountFee.areaMoney) / 100).toFixed(2),
      }
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
   if(dispatchConfig) {
    if(dispatchConfig.parkPointFee) {
    if((parseInt(dispatchConfig.parkPointFee) - (dispatchConfig.parkPointFee)) === 0) {
      dispatchConfig.parkPointFee = parseInt(dispatchConfig.parkPointFee)
    } 
    if((parseInt(dispatchConfig.areaFee) - (dispatchConfig.areaFee)) === 0) {
      dispatchConfig.areaFee = parseInt(dispatchConfig.areaFee)
    }
  }
}
    this.setData({
      baseTime_A: baseTime_A,
      baseTime_C: baseTime_C,
      dispatchConfig: dispatchConfig,
      overTimeFee: overTimeFee,
      overTime: overTime,
      baseTimeFee:baseTimeFee
    })
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    app.globalData.userTrack.push(['/historicalTrack','/历史轨迹']);
    if(app.globalData.noPayHistory) {
      this.setData({
        noPayHistory : true 
      })
    }
    this.setData({
      subkey: app.globalData.subkey,
      textColor: app.globalData.textColor,
      isBicycle: app.globalData.isBicycle,
    })
    this.getGeoByMachine()
    this.action = options.action;
    this.mapCtx = wx.createMapContext('historyMap');
    let item = app.globalData.historyItem;
    if(options.Pay == 'false') {                                                                      // 是没支付的
      console.log('没支付的进来');
      this.setData({
        noPay:true,
        isPay:false,
        remark: item.remark,
        item: item
      })
      if(item.payTime) {
        this.setData({
          hadPay:true,
          noPay:false,
        })
      }
      this.setTitle() 
    }else{
      if(item.remark){
   let remark = item.remark      
   let allPay = 0.0, ridingPay = 0.0, transfer = 0.0, membershipCard = 0.0,tiket = 0.0,gift = 0.0      // 笨方法 找到下标 下标到指定字符截取 赋值
  if( (remark.indexOf('总费用') == -1) && (remark.indexOf('免费骑行') == -1)){                          // 不包含总费用 不报含 免费骑行 是没支付的 人工结束的
    this.setData({
      noPay:true,
      isPay:false
    })
    if(item.payTime) {
      this.setData({
        hadPay:true,
        noPay:false,
      })
    }      
  }   
  if((remark.indexOf('系统超时自动结束订单') != -1) && item.payTime){   // 自动结束 且 还有付款时间
    this.setData({
      hadPay:true,
      noPay:false,
    })
  }                                       
    if(remark.indexOf('总费用') != -1){                                                                  //总费用
  allPay = remark.substring(parseInt(remark.indexOf('='))+1,parseInt( remark.indexOf('元')))
    }
    if( remark.indexOf('骑行费用') != -1){                                                             //骑行费用                          
    let res1 = remark.substring(remark.indexOf('骑行费用'),remark.length)
    ridingPay = res1.substring(parseInt(res1.indexOf('=')) + 1,parseInt(res1.indexOf('元')))
    } else if(remark.indexOf('正常骑行扣费')){
      let ress = remark.substring(remark.indexOf('正常骑行扣费'),remark.length)
      ridingPay = ress.substring(parseInt(ress.indexOf('费')) + 1,parseInt(ress.indexOf('元')))
    }
    if(remark.indexOf('调度费用') != -1){                                                              //调度费用
    let res2 = remark.substring(remark.indexOf('调度费用'),remark.length)
    if(parseInt(res2.indexOf(',')) != -1){
      transfer = res2.substring(parseInt(res2.indexOf('='))+1,parseInt(res2.indexOf(',')))
    }else{
      transfer = res2.substring(parseInt(res2.indexOf('='))+1,res2.length)
    }
    }
    // let index4 = remark.indexOf('会员卡折扣')
    // // if(index4 !=-1) {
    //   app.checkToken((token) => {
    //     if (token.length > 0) {
    //       let url = app.globalData.baseUrl + 'vipCard/userVipPage.do';
    //     let param = {
    //       adAccountId: 100201,
    //       pageNO:1,
    //       rowCount:10,
    //       token:token
    //     };
    //     util.request(url, param, (resp) => {
    //       console.log(resp);
    //     })
    //     }
    //   })
    // }
    if(remark.indexOf('优惠券抵消') != -1) {
      if(remark.indexOf('优惠券抵消骑行时长') != -1) {   // 优惠券抵消了骑行时长      
      } else {  // 优惠券抵消了金额
        let res6 = remark.substring(remark.indexOf('优惠券抵消'),remark.length)
        tiket = parseInt(res6.substring(parseInt(res6.indexOf('消'))+1,parseInt(res6.indexOf('元')))) 
        // console.log(tiket,res6.substring(parseInt(res6.indexOf('消'))+1,parseInt(res6.indexOf('元'))))
    }
  }
    if(remark.indexOf('礼品卡扣费') != -1){                                //礼品卡扣费
      let res4 = remark.substring(remark.indexOf('礼品卡扣费'),remark.length)
      gift = res4.substring(parseInt(res4.indexOf('费')) + 1,parseInt(res4.indexOf('元')))
    }
    ridingPay = parseFloat(ridingPay)
    transfer = parseFloat(transfer)
    let money = ridingPay + transfer
    console.log(tiket,gift);
    console.log(parseFloat(tiket),parseFloat(gift));
    // console.log(money);
    // console.log(item.money / 100);
    if((parseInt(tiket) - tiket) === 0) {                             // 优惠卷取整
      tiket = parseInt(tiket).toFixed(0)
    }
    if((parseInt(gift) - gift) === 0) {                               // 礼品卡取整
      gift = parseInt(gift).toFixed(0)
    }
    this.setData({
      money: money || item.money / 100,                                 // 会员卡   
      allPay: allPay || 0,                                              // 会员卡
      ridingPay: ridingPay || 0,                                        // 会员卡
      transfer: transfer || 0,                                          // 会员卡 
      gift: gift || 0,                                                  // 礼品卡
      membershipCard: membershipCard || 0,                               // 会员卡
      tiket: tiket || 0,                                                 // 优惠卷
      sale: parseInt(tiket) + parseInt(gift),
      remark: remark
    })
  }
  }
    let diff = 0;                                                                                     // 用时
    if (item.endTime) {
      let _date1 = new Date(item.startTime.replace(/-/g, "/")).getTime();
      let _date2 = new Date(item.endTime.replace(/-/g, "/")).getTime();
      if (_date2 >= _date1) {
        diff = Math.ceil((_date2 - _date1) / 60000);                                                    /*分钟*/  //骑行的分钟
      }
      item.time = diff;
    }     
    if (this.action == 'order' && diff <= 2){
      this.setData({
        faultDialog: true,
        surplusMileage:app.globalData.surplusMileage,
        machineNO:app.globalData.machineNO,
      })
    }
    this.getHistory(item.startTime, item.endTime, item.machineId);
    this.setData({
      item
    })
    this.geoForm()                                                                                        //  加载电子围栏 新需求 订单详情增加运营区 解决超区纠纷
  },
  
  onUnload: function () {
    app.globalData.noRefresh = false 
    app.globalData.noPayHistory = false 
},
  setTitle() {
    wx.setNavigationBarTitle({
      title: '未支付订单详情',                                                                               //页面标题
      success: () => {},                                                                                    //接口调用成功的回调函数
      fail: () => {},                                                                                       //接口调用失败的回调函数
      complete: () => {}                                                                                    //接口调用结束的回调函数（调用成功、失败都会执行）
    })
  },

   /**
   * 平台客服
   */
  toHelp () {
    wx.navigateTo({
      url: '../../help/help'
    })
  },
  
  geoForm () {
    if(app.globalData.areaPolygon){
      let points = app.globalData.areaPolygon.points.split(';');
      let pointArr = [];
      for (let j = 0; j < points.length; j++) {
        let point = {};
        point.longitude = points[j].split(',')[0];
        point.latitude = points[j].split(',')[1];
        pointArr.push(point);
      }
      console.log(this.data.polygons);
      this.setData({
        ['polygons[0].points']: pointArr
      })
    }else{
      if(this.data.noPayHistory) {
        console.log('未支付的');
      } else {
        wx.showToast({
          title: '运营区未获取',
          icon: 'none',
        })
      }
    }
  },

  open_detail() {
    this.setData({
      show_sale: !this.data.show_sale
    })
  },

  toPay() {
    let that = this;
    let money = that.data.item.money
    //点击一次，需要设置为不能点击
    let token = app.checkToken(function(token) {
      if (token.length > 0)
        wx.login({
          success: function(res) {
            if (res.code) {
              let order_url = app.globalData.baseUrl + "weixinPay/createOrder_weixin.do";
              let order_param = {
                token: token,
                deposit: false,
                money: Number(money / 100) * 100,                                        // 根据客服的扣款进行 计算要付款多少钱
                code: res.code,
              };
              // if (app.globalData.adAccountId && app.globalData.adAccountId.length != 0){
              //   order_param.adAccountId = app.globalData.adAccountId
              // }
              // console.log('区域id',order_param.adAccountId);
              util.request(order_url, order_param, function(resp) {
                let data = JSON.parse("\{" + resp.data.replace(/'/g, '\"') + "\}");
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
                    app.globalData.payed = true              //设置全局 已支付 为true
                    that.setData({
                      hadPay:true,
                      noPay:false
                    })
                    // app.initUserInfo(() => {
                    //   that.setData({
                    //     hadPay:true
                    //   })
                    //   // wx.navigateBack({
                    //   //   delta: 1
                    //   // })
                    // })
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
    });
  },

  closeRule() {
    this.setData({
      ruleShow: false
      })
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {  
    // console.log('onReady',this.data);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.globalData.isHistroyBack = true
  },

  getHistory (startTime, endTime, machineId) {
    app.checkToken((token) => {
      if (token.length > 0) {
        let url = app.globalData.baseUrl + "history/query.do";
        let param = {
          mapType: 2,
          machineId,
          startTime,
          endTime,
          token
        }
        util.request(url, param, (res) => {
          if (res.ret) {
            console.log(res);
            if(res.data.length == 0){
              // let markers = [];
              // let points = [];
              app.getLocationInfo('gcj02', (res) => {
                this.setData({
                  longitude: app.globalData.locationInfo.longitude,
                  latitude: app.globalData.locationInfo.latitude,
                })
                // let point = {
                //   latitude,
                //   longitude
                // }
                // points.push(point)
                // let marker = {
                //   id: 'start',
                //   latitude,
                //   longitude,
                //   iconPath: '/images/map/start.png',
                //   width: 35,
                //   height: 35
                // }
                // markers.push(marker);
                // let marker1 = {
                //   id: 'end',
                //   latitude,
                //   longitude,
                //   iconPath: '/images/map/end.png',
                //   width: 35,
                //   height: 35
                // }
                //this.getParks(longitude, latitude);
                // markers.push(marker1);
              })
            } else {
              let markers = [];
              let points = [];
              res.data.forEach((history,index) => {
                let latitude = history.latC ?history.latC: history.lat;
                let longitude = history.lonC ? history.lonC : history.lon;
                let point = {
                  latitude,
                  longitude
                }
                points.push(point)
                if(index == 0){
                  let marker = {
                    id: 'start',
                    latitude,
                    longitude,
                    iconPath: '/images/map/start.png',
                    width: 35,
                    height: 35
                  }
                  //this.getParks(longitude,latitude);
                  markers.push(marker);
                }else if(index == res.data.length - 1){
                  let marker = {
                    id: 'end',
                    latitude,
                    longitude,
                    iconPath: '/images/map/end.png',
                    width: 35,
                    height: 35
                  }
                  //this.getParks(longitude, latitude);
                  markers.push(marker);
                }
              })
              this.setData({
                markers: markers.concat(this.data.markers),
                polyline: [{
                  points: points,
                  // color: '#dd5255', 
                  color: '#3629CC', 
                  width: 4,
                }],
              })
              this.mapCtx.includePoints({
                points: points,
                padding: [20,20,20,20]
              })
            }
          }
        })
      }
    })
  },

  // getParks (lo, la) {
  //   let url = app.globalData.baseUrl + "parkPoint/getNear.do";
  //   let param = {
  //     accountId: app.globalData.accountId,
  //     radius: 200,
  //     mapType: 2,
  //     lo: lo,
  //     la: la
  //   };
  //   app.checkToken((token) => {
  //     if (token.length > 0) {
  //       param.token = token;
  //     }
  //     util.request(url, param, (resp) => {
  //       if (resp.data.length > 0) {
  //         let markers = [];
  //         let circles = [];
  //         let polygons = [];
  //         let parkPoints = resp.data;
  //         parkPoints.forEach((parkPoint, index) => {
  //           let iconPath = '';
  //           iconPath = `${app.globalData.imagesUrl}${app.globalData.accountId}/map/park/huanchedian.png`;

  //           let marker = { //标记点
  //             id: index,
  //             accountId: parkPoint.accountId,
  //             iconPath: iconPath,
  //             latitude: parkPoint.laC ? parkPoint.laC : parkPoint.la,
  //             longitude: parkPoint.loC ? parkPoint.loC : parkPoint.lo,
  //             width: 26,
  //             height: 36
  //           }
  //           markers.push(marker);

  //           if (parkPoint.pointsC && parkPoint.parkPointType == 1) { //多边形站点。
  //             let points = parkPoint.pointsC.split(';');
  //             let len = points.length;
  //             let pArr = [];
  //             for (let j = 0; j < len; j++) {
  //               let tempPoint = points[j].split(',');
  //               let p = {
  //                 latitude: tempPoint[1],
  //                 longitude: tempPoint[0]
  //               }
  //               pArr.push(p);
  //             }
  //             let _polygon = {
  //               points: pArr,
  //               fillColor: "#00a2e933",
  //               strokeColor: "#00a2e955",
  //               strokeWidth: 2,
  //               zIndex: -9
  //             }
  //             polygons.push(_polygon);
  //           } else {
  //             let circle = {
  //               latitude: parkPoint.laC,
  //               longitude: parkPoint.loC,
  //               radius: parkPoint.allowRange,
  //               color: '#00a2e955',
  //               fillColor: '#00a2e933',
  //               //strokeWidth:0
  //             }
  //             circles.push(circle);
  //           }
  //         })
  //         this.setData({
  //           markers: markers.concat(this.data.markers),
  //           polygons: polygons.concat(this.data.polygons),
  //           circles: circles.concat(this.data.circles)
  //         });
  //         console.log("站点和区域点个数:", this.data.polygon.length);
  //       }
  //     });
  //   })
  // },

  close(){
    this.setData({
    faultDialog: false
    })
  },

  sendReport (e) {
    let q = e.currentTarget.dataset.item;
    if (q == "没有问题") {         // 点击没有问题 就取消这个覆盖层
      this.close()
      return;
    }
    app.checkToken((token) => { //拿token 不过期
      if (token.length > 0) {
        app.getLocationInfo('gcj02',(location) => {
          let url = app.globalData.baseUrl + "suggestion/add.do";
          console.log(q + this.data.item.userCode,  );
          let param = {
            token: token,
            title: '两分钟内结束订单',
            content: q + this.data.item.userCode,      //   内容
            accountId: app.globalData.accountId,      // id 
            lo: location.longitude,           
            la: location.latitude,                // 经纬度
            mapType: 2,      // 车辆类型 电车
          };        
          util.request(url, param, (res) => {
            if (res.ret) {        // ret: 1 接口返回数据 
              // util.showToast('意见反馈成功')
              // util.showModal_nocancel('意见反馈成功!')
              this.close()
            }
          })
          this.close()
        })
      }
      this.close()
    })
    let jump = e.currentTarget.dataset.jump;  // 不能囊括的情况 点击 执行跳转建议
    if(jump && jump == 'toFault'){
      // this.toFault();
      wx.navigateTo({
        url: '/pages/advice/advice',
      })
    }
    this.setData({
      faultDialog: false
    })
  },

  toAdvice () {
    wx.navigateTo({
      url: '../../advice/advice?userCode=' + this.data.item.userCode,
    })
  },

  showDetail () {
    wx.showModal({
      title: '',
      content: this.data.item.remark,
      showCancel: false
    })
  },

  toFault () {
    wx.navigateTo({
      url:'../../../packageA/pages/fault/fault?userCode=' + this.data.item.userCode
    })
  },

  showRule () {
    this.setData({
      ruleShow:true
    })
  },

  activeSheet () {
    wx.showActionSheet({
      itemList: ['计费规则','费用申诉','故障上报'],
      success: (res) => {
        if(res.tapIndex == 0){
          this.setData({
            ruleShow:true
          })
          // wx.navigateTo({
          //   url: '/pages/valuationRule/valuationRule?machineNO=' + this.data.item.userCode,
          // })
        } else if (res.tapIndex == 1){
          wx.navigateTo({
            url: '/pages/advice/advice',
          })
        } else{
          this.toFault();
        }
      }
    })
  },

})