/**
 * 腾讯地图webapi，扩展工具类
 */
var qMap = require('./qqmap-wx-jssdk1.2/qqmap-wx-jssdk.min.js')
var util = require('./util.js')
let app = getApp();
var qqmapsdk = new qMap({
  key: 'K3BBZ-7BX3F-5GBJI-NJHW7-LGA4K-CGB5Y' // 必填
});
const getQQWalkingRoute = (marker,cb) => {
  wx.getLocation({
    // wx.onLocationChange({
    type: 'gcj02',
    success: (resp) => {                                                                                //调用距离计算接口
      console.log(resp);
      let mode = ''
      if(marker.accountId != null && marker.accoundId != undefined) {                                 // 有品牌id的话就是有车 就是骑车路线 否则即使步行路线
        mode = 'bicycling'
      } else {
        mode = 'walking'
      }
        qqmapsdk.direction({  // 骑车找还车点 
          mode: mode,                                                                                   //'driving驾车walking步行bicycling骑行，不填默认driving可不填from参数不填默认当前地址
          to: { longitude: marker.longitude, latitude: marker.latitude },
          success: (res) => {
            let ret = res;
            if (ret.result.routes[0].distance <= 50000) {
              let coors = ret.result.routes[0].polyline, pl = [];
              let kr = 1000000;                                                                         //坐标解压（返回的点串坐标，通过前向差分进行压缩）
              for (let i = 2; i < coors.length; i++) {
                coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
              }
              for (let i = 0; i < coors.length; i += 2) {                                               //将解压后的坐标放入点串数组pl中
                pl.push({ latitude: coors[i], longitude: coors[i + 1] })
              }                                                                                         //console.log(pl) //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
              let startDistance = util.getDistance(resp.longitude, resp.latitude, pl[0].longitude, pl[0].latitude) * 1000;
              let fixLine = [];
              if (startDistance > 5) {
                fixLine.push({
                  points: [{
                    longitude: resp.longitude,
                    latitude: resp.latitude
                  }, {
                    longitude: pl[0].longitude,
                    latitude: pl[0].latitude
                  }],
                  color: '#a0a0a0DD',
                  width: 6,
                  dottedLine: true,
                })
              }
              let endDistance = util.getDistance(pl[pl.length - 1].longitude, pl[pl.length - 1].latitude, marker.longitude, marker.latitude) * 1000;
              if (endDistance > 5) {
                fixLine.push({
                  points: [{
                    longitude: marker.longitude,
                    latitude: marker.latitude
                  }, {
                    longitude: pl[pl.length - 1].longitude,
                    latitude: pl[pl.length - 1].latitude
                  }],
                  color: '#a0a0a0DD',                            // 灰色 
                  width: 6,
                  dottedLine: true,
                })
              }
              cb && cb([{
                distance: ret.result.routes[0].distance,
                points: pl,
                color: '#3629CCDD',                              // 深蓝色（路线）
                width: 6,  
                arrowLine: true,                                 // 附箭头的线
              }].concat(fixLine))
            } else {
              wx.showToast({
                title: '路线规划失败！',
                icon: 'none'
              })
            }
          },
          fail: function (error) {
            console.error(error);
            console.log('error');
            if (error.status == 373) {
              wx.showToast({
                title: '路线规划失败！',
                icon: 'none'
              })
            }
          },
          complete: function (res) {}
        });
    },
    fail: (err) => {
      console.log(err);
      // wx.startLocationUpdateBackground({                      新接口
      // success(res) {
      //   console.log('开启后台定位', res)
      // },
      // fail(res) {
      //   console.log('开启后台定位失败', res)
      // }
      // })
      // wx.onLocationChange(function(res) {
      //   console.log('location change', res)
      // })
      // wx.showToast({
      //   title: '重新规划导航路径中,请您稍等片刻！',
      //   icon: 'none'
      // })
    }
  })
}

//触发关键词输入提示事件
const getSuggest = (keyword,cb,limit) => {                                                                                // 调用关键词提示接口
  qqmapsdk.getSuggestion({                                                                                                // 获取输入框值并设置keyword参数
    keyword: keyword,                                                                                                     // 用户输入的关键词，可设置固定值,如keyword:'KFC'
    region: limit ? limit : "杭州市",                                                                                      // 设置城市名，限制关键词所示的地域范围，非必填参数
    success: function (res) {                                                                                             // 搜索成功后的回调 //console.log(res)
      var sug = [];
      for (var i = 0; i < res.data.length; i++) {
        sug.push({                                                                                                          // 获取返回结果，放到sug数组中
          title: res.data[i].title,
          id: res.data[i].id,
          addr: res.data[i].address,
          city: res.data[i].city,
          district: res.data[i].district,
          latitude: res.data[i].location.lat,
          longitude: res.data[i].location.lng
        });
      }
      cb && cb(sug)
    },
    fail: function (error) {
      console.error(error);
    },
    complete: function (res) {
      console.log(res);
    }
  });
}

const getCity = (location,cb) =>{
  qqmapsdk.reverseGeocoder({
    //位置坐标，默认获取当前位置，非必须参数
    /**
     * 
     //Object格式
      location: {
        latitude: 39.984060,
        longitude: 116.307520
      },
    */
    /**
     *
     //String格式
      location: '39.984060,116.307520',
    */
    location: location || '', //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
    //get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
    success: function (res) {//成功后的回调
      console.log(res);
      var res = res.result;
      var mks = [];
      /**
       *  当get_poi为1时，检索当前位置或者location周边poi数据并在地图显示，可根据需求是否使用
       *
          for (var i = 0; i < result.pois.length; i++) {
          mks.push({ // 获取返回结果，放到mks数组中
              title: result.pois[i].title,
              id: result.pois[i].id,
              latitude: result.pois[i].location.lat,
              longitude: result.pois[i].location.lng,
              iconPath: './resources/placeholder.png', //图标路径
              width: 20,
              height: 20
          })
          }
      *
      **/
      //当get_poi为0时或者为不填默认值时，检索目标位置，按需使用
      // mks.push({ // 获取返回结果，放到mks数组中
      //   title: res.address,
      //   id: 0,
      //   latitude: res.location.lat,
      //   longitude: res.location.lng,
      //   iconPath: './resources/placeholder.png',//图标路径
      //   width: 20,
      //   height: 20,
      //   callout: { //在markers上展示地址名称，根据需求是否需要
      //     content: res.address,
      //     color: '#000',
      //     display: 'ALWAYS'
      //   }
      // });
      cb && cb(res)
    },
    fail: function (error) {
      console.error(error);
    },
    complete: function (res) {
      console.log(res);
    }
  })
}

module.exports = {
  getQQWalkingRoute: getQQWalkingRoute,
  getSuggest: getSuggest,
  getCity: getCity
}