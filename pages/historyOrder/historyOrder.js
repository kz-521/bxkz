let app = getApp();
let util = require('../../utils/util');
let appColor = require('../../utils/config.js').appColor
Page({
  data: {
    startTime:'',
    endTime:'',
    time: '',
    pageNO:1,
    rowCount:20,
    historyOrders: [],
    tip: '',
    mainColor: '#3fd572',
    textColor: '',
    mileageAll: '',
  },

  setTime() {
    let month = parseInt( new Date().getMonth() ) + 1 
    this.setData({
      startTime:( new Date().getFullYear() + '-' + (month >= 10 ? month  : ('0' + (month)))) + '-' + '01',
      endTime: (new Date().getFullYear() + '-' + ((month + 1 ) >= 10 ? (month + 1 ) : ( '0' +(month + 1 )))) + '-' + '01'
    })  
  },

   //日期选择器
   bindTimeChange: function(e) {
    console.log(e);
    if(e) {
      if(e == false ) {
   console.log('不变');     
      } else {
        let value = e.detail.value
    this.setData({
      time: value.substring(0,4) + '年' + ( value.substring(5,8) >= 10 ?  value.substring(5,8) :   value.substring(6,8) ) + '月', //日期选择器 选择把时间赋值给日期显示
      startTime: (value.substring(0,4) + '-' + ( value.substring(5,8) >= 10 ?  value.substring(5,8) : ('0' + parseInt(value.substring(6,8))) ) + '-01' ),
      endTime: (value.substring(0,4) + '-' + ( parseInt(value.substring(5,8)) >= 9 ? (parseInt( value.substring(5,8)) + 1 ) : ('0' + (parseInt(value.substring(6,8)) + 1))) + '-01' ),
    })
    console.log(this.data);
  }
  } else {
    this.setData({
      time: new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月'            //初始当前月
    })
  }
    this.setData({                                                                          //把要用给的数组置空
      historyRecords : []
    })
      this.getList()
  },

  getList() {
    let that = this;
    let url = app.globalData.baseUrl + 'rideLog/queryPage.do'
    let rowCount = this.data.rowCount
    let pageNO = this.data.pageNO
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      mask: true,
      duration: 15000
    })
    app.checkToken(function (token) {
      if (token.length > 0)
        util.request(url, { token: token,pageNO:pageNO,rowCount:rowCount,startTime:that.data.startTime,endTime:that.data.endTime, }, function (resp) {
          wx.hideToast();
          if (typeof resp.data != 'undefined' && resp.data.length != 0) {
            that.setData({
              mileageAll: resp.totalMileage
            })
            let historyOrders = [];
            let mileages = 0
            for (let i = 0; i < resp.data.length; i++) {
              let time = "骑行中";
              if (resp.data[i].endTime){
                time = util.timeDifference(resp.data[i].startTime, resp.data[i].endTime)
                time = 60 * ( parseInt(time) )
              }
                let remark = resp.data[i].remark                     // 笨方法 找到下标 下标到指定字符截取 赋值
                  let all = 0
                 let index1 =  remark.indexOf('骑行费用')  //骑行费用
                 let ridingPay = 0
                 if(index1 != -1){
                   if ((remark.indexOf('系统超时自动结束订单')) != -1) {
                    let res1 = remark.substring(index1,remark.length)
                    let res1i = parseInt(res1.indexOf('='))
                    let res1k = parseInt(res1.indexOf('；'))
                    ridingPay = res1.substring(res1i+1,res1k)
                   }else{
                 let res1 = remark.substring(index1,remark.length)
                 let res1i = parseInt(res1.indexOf('='))
                 let res1k = parseInt(res1.indexOf('元'))
                 ridingPay = res1.substring(res1i+1,res1k)
                 }
                } else if((remark.indexOf('正常骑行扣费')) != -1){
                  let ress = remark.substring(remark.indexOf('正常骑行扣费'),remark.length)
                  ridingPay = ress.substring(parseInt(ress.indexOf('费')) + 1,parseInt(ress.indexOf('元')))
                }
                 let index2 = remark.indexOf('调度费用') //调度费用
                 let transfer = 0
                 if(index2 != -1){
                 let res2 = remark.substring(index2,remark.length)
                 let res2i = parseInt(res2.indexOf('='))
                 let res2k = parseInt(res2.indexOf(','))
                 if(res2k != -1){
                   transfer = res2.substring(res2i+1,res2k)
                 }else{
                   transfer = res2.substring(res2i+1,res2.length)
                 }
                 }         
                 ridingPay = parseFloat(ridingPay)
                 transfer = parseFloat(transfer)
                 all = ridingPay + transfer
                //  all = all.toFixed(2)
                all = all%1 !=0 ? parseFloat(all.toFixed(2)) : all       // 总费用偶尔有出现小数点后 很多位的情况  
                //  console.log(all )
              let historyOrder = {
                userCode: resp.data[i].userCode,
                machineId: resp.data[i].machineId,
                startTime: resp.data[i].startTime.slice(0,16),
                endTime: resp.data[i].endTime.slice(0,16),
                mileage: resp.data[i].mileage,
                time: time ,
                payTime: resp.data[i].payTime || '',
                money: resp.data[i].money,
                remark: resp.data[i].remark,
                ridingPay: ridingPay ,
                transfer: transfer ,
                all:all
            }
              historyOrders.push(historyOrder);            
            }
            console.log(historyOrders);
            if(!(historyOrders[0].payTime)) {
              historyOrders[0].theOne = true          // 给数组的第一项属性 赋值
            }
            historyOrders.forEach(item => {
              mileages += item.mileage 
            })
            that.setData({
              historyOrders: historyOrders,
              // [historyOrders[0].theOne] : true
            })
          }else{
            that.setData({
              tip: '没有更多记录了 ',
            })
          }
        })
    });
  },
  //一个页面只会调用一次。
  onLoad: function () {
    app.globalData.userTrack.push(['/historyOrder','/骑行记录']);
    if(app.globalData.noPayHistory) {
      this.setData({
        noPayHistory : true 
      })
    }
    wx.stopPullDownRefresh()                                                                                                    //刷新完成后停止下拉刷新动效
    this.setTime()
    this.setData({
      time: new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月'                                                  //初始当前月
    })
    this.getList()
  },

  toTrack: function(e) {
    console.log(e.currentTarget.dataset.item);
    let item = e.currentTarget.dataset.item;
    if( item.payTime === '') {
      if (typeof item != 'undefined' && item.length != 0) {
        let historyOrder ={};
          let time = "";
          if (item.endTime){
            time = util.timeDifference(item.startTime, item.endTime)
            time = 60 * ( parseInt(time) )
            // console.log(time);
          }
          // let time =  ( resp.data.endTime.getTime() - resp.data.startTime.getTime() ) / 3600
           historyOrder = {
            userCode: item.userCode,
            machineId: item.machineId,
            startTime: item.startTime,
            endTime: item.endTime,
            mileage: item.mileage,
            payTime:item.payTime || '',
            time: time ,
            money: item.money,
            remark: item.remark
          }
          this.setData({
            historicalTrack: historyOrder
          })        
      }
    }
    app.globalData.historyItem = item;
    wx.navigateTo({
      url: `./historicalTrack/historicalTrack?action=history`,
    })
  },

    /**
   * 日期选择器
   */
  bindTimeChange: function(e) {
    console.log(e,'picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value.substring(0,4) + '年' +( e.detail.value.substring(5,8) >= 10 ?  e.detail.value.substring(5,8) :   e.detail.value.substring(6,8) ) + '月' //日期选择器 选择把时间赋值给日期显示
    })
  },

  //页面初次渲染完成
  onReady: function () {

  },
  //每次显示都会调用一次
  onShow: function () {
  },

 /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
 onPullDownRefresh: function () {
  var that = this;
  // that.setData({
  //   currentTab: 0 //当前页的一些初始数据，视业务需求而定
  // })
  this.getList(); //重新加载onLoad()
},

  loadOtherWaitOrder() {
    let that = this;
    let url = app.globalData.baseUrl + 'rideLog/queryPage.do'
    let rowCount = parseInt(this.data.rowCount) 
    let pageNO = parseInt(this.data.pageNO) + 1
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      mask: true,
      duration: 15000
    })
    app.checkToken(function (token) {                             // 获取token 发送请求 应该单独拿出来
      if (token.length > 0)
        util.request(url, { token: token,pageNO:pageNO,rowCount:rowCount }, function (resp) {
          wx.hideToast();
          if (typeof resp.data != 'undefined' && resp.data.length != 0) {
            let historyOrders = [];
            for (let i = 0; i < resp.data.length; i++) {
              let time = "骑行中";
              if (resp.data[i].endTime){
                time = util.timeDifference(resp.data[i].startTime, resp.data[i].endTime)
                time = 60 * ( parseInt(time) )
              }
                let remark = resp.data[i].remark                     // 笨方法 找到下标 下标到指定字符截取 赋值
              //    let index =  remark.indexOf('总费用')  //总费用
              //    let allPay = '0.0'
              //    if(index != -1){
              //    let i = parseInt(remark.indexOf('='))
              //   let k =parseInt( remark.indexOf('元'))
              //  allPay = remark.substring(i+1,k)
              //    }
                  let all = 0
                 let index1 =  remark.indexOf('骑行费用')      //骑行费用
                 let ridingPay = 0
                 let res1k = 0
                 if(index1 != -1){
                 let res1 = remark.substring(index1,remark.length)
                 let res1i = parseInt(res1.indexOf('='))
                 let res1k1 = parseInt(res1.indexOf('元'))
                 let res1k2 = parseInt(res1.indexOf('；'))
                 if(res1k1 != -1) {
                  res1k = res1k1
                 } else {
                  res1k = res1k2
                 }
                //  console.log(res1,res1i,res1k1,res1k2);
                 ridingPay = res1.substring(res1i+1,res1k)
                 }
                 let index2 = remark.indexOf('调度费用')         //  调度费用
                 let transfer = 0
                 if(index2 != -1){
                 let res2 = remark.substring(index2,remark.length)
                 let res2i = parseInt(res2.indexOf('='))
                 let res2k = parseInt(res2.indexOf(','))
                 if(res2k != -1){
                   transfer = res2.substring(res2i+1,res2k)
                 }else{
                   transfer = res2.substring(res2i+1,res2.length)
                 }
                 }         
                 ridingPay = parseFloat(ridingPay)
                 transfer = parseFloat(transfer)
                //  console.log(ridingPay,transfer);
                 all = ridingPay + transfer
                 all = all % 1 != 0 ? parseFloat(all.toFixed(2)) : all       // 总费用偶尔有出现小数点后 很多位的情况  
              let historyOrder = {
                userCode: resp.data[i].userCode,
                machineId: resp.data[i].machineId,
                startTime: resp.data[i].startTime.slice(0,16),
                endTime: resp.data[i].endTime.slice(0,16),
                mileage: resp.data[i].mileage,
                time: time ,
                money: resp.data[i].money,
                remark: resp.data[i].remark,
                ridingPay: ridingPay ,
                transfer: transfer ,
                all:all
            }
              historyOrders.push(historyOrder);            
            }
            that.setData({
              historyOrders: that.data.historyOrders.concat(historyOrders),
            })
          }else{
            that.setData({
              tip: '没有更多记录了 ',
            })
          }
        })
        that.setData({
          pageNO: parseInt(that.data.pageNO) + 1
        })
    });
  },
    /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadOtherWaitOrder()
  },
})
