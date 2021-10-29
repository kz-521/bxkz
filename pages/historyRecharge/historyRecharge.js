
let app = getApp();
let util = require('../../utils/util.js')
let appColor = require('../../utils/config.js').appColor
Page({
  data: {
    historyRecords: [],
    historyRecordsAll: [],
    height: '',
    tip: '',
    operaTime:'2021-07-16 00:09:14',
    mainColor: '#3fd572',
    textColor: '',
    time: '',
  },
  /**
   * 日期选择器
   */
  bindTimeChange(e) {
    console.log('picker发送选择改变，携带值为', e, e.detail.value)
    this.setData({
      time: e.detail.value.substring(0,4) + '年' + ( e.detail.value.substring(5,8) >= 10 ?  e.detail.value.substring(5,8) :   e.detail.value.substring(6,8) ) + '月' //日期选择器 选择把时间赋值给日期显示
    })
    this.setData({                                          // 把要用给的数组置空
      historyRecords : []
    })
    let arr = []                                            // 临时变量arr
    this.data.historyRecordsAll.forEach(item=>{             // 所有数据遍历 把符合条件的项放进临时变量 然后传给 historyRecords
      if((( item.operaTime.substring(0,7)) === (this.data.time)) || (( item.operaTime.substring(0,8)) === (this.data.time)) ){
        arr.push(item)
       }
      })
      this.setData({
        historyRecords: arr
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 100
      })
  },

  //一个页面只会调用一次。
  onLoad: function () {
    app.globalData.userTrack.push(['/historyRecharge','/历史充值']);
    this.setData({
      textColor: app.globalData.textColor || '#3fd572',
        })
    let that = this;
    let url = app.globalData.baseUrl + 'userAccountLog/getByUserId.do';
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      mask: true,
      duration: 15000
    })
    // 请求数据
    app.checkToken(function (token) {
      if (token.length > 0) {
        util.request(url, { token: token }, function (resp) {
          wx.hideToast();
          if (typeof resp.data != 'undefined' && resp.data.length != 0) {
            console.log(resp.data);
            that.setData({
              time: new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月'    //初始当前月
            })
            resp.data.forEach( item => {                                                    // 遍历时间 切割字符串 修改格式
              let year =  item.operaTime.substring(0,4) 
              let month = item.operaTime.substring(5,7) < 10 ? item.operaTime.substring(6,7) : item.operaTime.substring(5,7)
              let day =   item.operaTime.substring(8,10)
              let time =  item.operaTime.substring(11,16)
              item.operaTime = year + '年' + month + '月' + day + '日'+' '+time
              if(item.remark === 'user_refund_deduction') {                                   // 处理用户退款        
                item.remark = '用户退款'
              }
            })
            // that.setData({
              that.data.historyRecords = resp.data,                                             // 操作后 赋值 
              that.data.historyRecordsAll = resp.data,                                        // 操作后 赋值 
              // time: resp.data[resp.data.length].
            // })
            that.setData({                                                                      //把要用给的数组置空
              historyRecords : []
            })
            let arr = []                                                                        //临时变量arr
            console.log(that.data.time);
            that.data.historyRecordsAll.forEach(item=>{                                         //所有数据遍历 把符合条件的项放进临时变量 然后传给 historyRecords
              // console.log(item.operaTime);
              // console.log(item.operaTime.substring(0,7));
             if((( item.operaTime.substring(0,7)) === (that.data.time)) || (( item.operaTime.substring(0,8)) === (that.data.time)) ){
              arr.push(item)
             }
              })
              // console.log(arr);
              that.setData({
                historyRecords: arr
              })
          } else {
            that.setData({
              tip: '没有更多记录了 ',
            })
          }
        })
      } else {
        console.log('没有token');
      }
    });
  },
  //页面初次渲染完成
  onReady: function () {
  },
  //每次显示都会调用一次
  onShow: function () {
  }
})
