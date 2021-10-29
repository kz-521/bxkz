let app = getApp();
let util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phoneList: [], //默认客服电话
    phone:'4008019800',
    animationData: {},
    questions: [
      {id: '1、车辆中途断电', value: '车辆驶出地图上红线框显示的运营区外会有语音提示同时断电，当车辆重新回到运营区后车辆会自动通电，建议您尝试将车辆向运营区内推行，如在运营区内断电请确认车辆是否电量为0，具体请在骑行时间下方的续航与电量上查看，如遇车辆无电无法行驶的情况建议您更换车辆或者致电人工客服处理。' },
      {id: '2、在还车点需要调度费', value: '建议您先查看车辆是否停在“还车点”即公共自行车泊位的白线框内，也可以在小程序里查看车辆定位是否在蓝色线框的P点内，然后点击左下角的“定位”按钮，刷新定位。'},
      { id: '3、无法还车', value: '如提示头盔未还请将头盔锁插到底同时静等10秒钟车锁复位，中途不要进行任何操作再次点击还车，如三次尝试还是不行建议致电人工客服核实是否为头盔锁故障；如提示将车身摆正的动画请将车辆停在公共自行车泊位上车头朝向主路车身垂直主路路面，静等10秒钟再次点击还车。' },
      {id: '4、忘记还车', value: '忘记还车期间会正常计费，当车辆静止一定时间后，系统会自动给您注册账户下发短信提醒，如车辆还是静止超过一个半小时系统会结束订单。' },
      { id: '5、临时停车', value: '您有事需要短时间离开建议您将头盔插回同时点击小程序临时停车按钮，点击继续骑行车辆即可解锁；如长时间静止车辆会自动触发临时停车，临时停车期间会正常计费，静止超过一个半小时系统会自动结束订单，临停期间正常收费，您要长时间临停建议先归还车辆再借车，避免产生额外费用。' },
      { id: '6、车辆故障', value: '(1)开锁后，发现车辆故障影响正常使用，请立即操作还车，2分钟内不收取骑行费用，同时建议您更换附近正常的车辆继续骑行。(2)因车辆故障无法到还车点还车而产生其他费用时，请转人工客服为您核实处理。' },
      {id: '7、免押套餐和骑行套餐费用可以退还吗？',value: '关于免押套餐和骑行套餐，套餐在期限内有效，费用一旦支付，不能退还。骑行套餐若有其他有效性限制，详见购买须知。' }, 
      { id: '8、账户显示异常', value: '请您先退出登录，再重启网络，再次尝试登录。'},
      { id: '9、蓝牙操作失败怎么办？',value: '当蓝牙操作出现无响应、超时、搜索失败等情况时，请重启手机蓝牙，再次尝试。'},
      {id: '10、实名认证', value: '(1)为避免不必要的法律纠纷，请您提供真实姓名及身份证号进行认证，认证成功方可使用。(2)百姓快租承诺不会透露您的个人信息。'},
    ]
  },

  showContents: function(e) {
    let that = this
    let selected = e.currentTarget.dataset.selected
    // var animation = wx.createAnimation({
    //   duration: 1000,
    //   timingFunction: "ease",
    // })
    //this.animation = animation
    //animation.scale(2, 2).rotate(45).step();
    if (that.data.selected != selected)
      that.setData({
        selected: selected
        //animationData: animation.export()

      })
    else
      that.setData({
        selected: -1
        //animationData: animation.export()

      })
    /*setTimeout(function() {
      animation.translate(30).step();
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1000)*/
  },

  phoneCall (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
    })
  },

  contact() {
    let that = this;
      app.checkToken((token) => {
        if (token.length > 0) {
          let url = app.globalData.baseUrl + "account/getPhone.do";
          let param = {
            token: token,
          };
          util.request(url, param, (resp) => {
            if (resp.data.adPhone && resp.data.adPhone.length != 0) {
              that.phoneFormat(resp.data.adPhone);
            } else {
              that.phoneFormat(resp.data.phone);
            }
          });
        } else {
          that.phoneFormat(that.phone);
        }
      });
  },

  phoneFormat (phoneStr) {
    if (phoneStr && phoneStr != '') {
      let phoneRex = /((400|800)[-| ]?[0-9]{3}[-| ]?[0-9]{4})|(1(3|4|5|6|7|8|9)[0-9]{9})|((0[0-9]{2,3})?[-| ]?[0-9]{7,8})/;
      let timeRex = /[0-9]{1,2}[:|：]{1}[0-9]{1,2}[-]?[0-9]{1,2}[:|：]{1}[0-9]{1,2}/;
      let itemList = phoneStr.split(';');
      let phoneList = [];
      itemList.forEach((phone) => {
        let ph = phone.match(phoneRex);
        let time = phone.match(timeRex);
        let p = {
          phone: ph == null ? "" : ph[0],
          time: time == null ? "" : time[0]
        }
        phoneList.push(p);
      })
      console.log("*** PhoneList: ", phoneList)
      this.setData({
        phoneList: phoneList,
        phone:phoneList[0].phone
      })
    } else {
      // wx.showToast({
      //   title: '暂无设置客服电话',
      //   icon: 'none',
      // })
    }
  },

  onLoad: function (options) {
    app.globalData.userTrack.push(['/help','/常见问题']);
    this.contact();
  },

    /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.globalData.noRefresh = true
  },
})