var app = getApp();
var util = require('../../utils/util.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ruleShow: Boolean, // 简化的定义方式
    studyLead: Boolean,
    isNotAreaPhoto1: Boolean,
    isNotAreaPhoto: Boolean,
  },

  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.getGeoByMachine()
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached: function() {
    // 在组件实例进入页面节点树时执行
  },
  detached: function() {
    // 在组件实例被从页面节点树移除时执行
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
            console.log(res);
            if (res.ret) {
              if (res.geo) {
                if(res.adAccountFee) {
                that.getRule(res.adAccountFee);
              }
            }
            }
          })
        } else {
        }
      })
    },
    
    getRule (adAccountFee) {
      if (adAccountFee.rechargeBase) {
        this.rechargeBase = (Number(adAccountFee.rechargeBase) / 100).toFixed(2);
      }
      let baseTime = adAccountFee.baseTime; //起步时间
      let baseTimeFee = (Number(adAccountFee.baseTimeFee) / 100).toFixed(2); /*起步金额*/
      let overTime = adAccountFee.overTime; //超时时间
      let overTimeFee = (Number(adAccountFee.overTimeFee) / 100).toFixed(2); /*超时时间费用*/
      let freeTime = adAccountFee.freeTime; //免费时间
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
        // if(dispatchConfig.parkPointFee) {
        dispatchConfig = {
          parkPointFee: (Number(adAccountFee.parkPointMoney) / 100).toFixed(2),
          areaFee: (Number(adAccountFee.areaMoney) / 100).toFixed(2),
        }
      // }
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
      if(dispatchConfig){
      if(dispatchConfig.parkPointFee != 'null') {
      if((parseInt(dispatchConfig.parkPointFee) - (dispatchConfig.parkPointFee)) === 0) {
        dispatchConfig.parkPointFee = parseInt(dispatchConfig.parkPointFee)
      } 
    } else {
      console.log('dispatchConfig.parkPointFee 不存在');
    }
    if(dispatchConfig.areaFee) {
      if((parseInt(dispatchConfig.areaFee) - (dispatchConfig.areaFee)) === 0) {
        dispatchConfig.areaFee = parseInt(dispatchConfig.areaFee)
      } 
    } else {
      console.log('dispatchConfig.areaFee 不存在');
    }
    }
      // console.log(baseTimeFee,dispatchConfig.parkPointFeeimeFee,dispatchConfig.areaFee,overTime,baseTimeFee);
      this.setData({
        baseTime_A,
        baseTime_C,
        dispatchConfig,
        overTimeFee,
        overTime,
        baseTimeFee
      })
    },

    closeRule() {
      this.setData({
        ruleShow: false
        })
    },
  }
})
