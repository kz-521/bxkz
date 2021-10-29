
// 防抖
function debounce(fn, interval) {
  var timer;
  var gapTime = interval || 500
  return function() { 
    clearTimeout(timer)
    var that = this;
    timer = setTimeout(function (){
      fn.call(that);
    }, gapTime);
  }
}

// 节流
function throttle(fn, interval) {
  var timer = 0;
  var gapTime = interval || 500
  return function() {
    if(timer == 0) {
      timer++
      fn.call(this);
      setTimeout(function() {
        timer = 0
      }, gapTime)
    }
  }
}

function formatTime(date) {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  let milliseconds = date.getMilliseconds();
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':') ;
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//克隆数组
Array.prototype.clone = function() {
  return this.slice(0);
}

//计算时间差
function timeDifference(date1, date2) {
  let _date1 = new Date(date1.replace(/-/g, "/")).getTime();
  let _date2 = new Date(date2.replace(/-/g, "/")).getTime();
  let diff = 0;
  if (_date2 >= _date1) {
    // console.log(_date2,_date1,(_date2 - _date1) / 60000);
    diff = Math.ceil((_date2 - _date1) / 60000); /*分钟*/
    if (diff > 60) {
      diff = diff.toFixed(0) + "分钟";
      // diff = parseFloat(diff / 60).toFixed(1) + "h";
    } else {
      diff = diff.toFixed(0) + "分钟";
    }
  } else diff = '0分钟';
  return diff;
}

//格式化时间
function formatTime_curret(diff) {
  let using = "";
  if (diff < 1) using = diff * 60 + "秒";
  else if (diff <= 60) using = diff.toFixed(0) + "分钟"; //分钟
  else if (diff > 60 && diff < 1440) { //小时
    using = Math.floor(diff / 60) + "小时" + (diff % 60).toFixed(0) + "分钟";
  }
  return using;
}

function dateTimeFormate(date){
  if(!date){
    return
  }else{
    var d = new Date(date);
    var year = d.getFullYear();
    var month = ('0' + (d.getMonth() + 1)).slice(-2);
    var day = ('0' + (d.getDate())).slice(-2);
    var hour = ('0' + (d.getHours())).slice(-2);
    var minutes = ('0' + (d.getMinutes())).slice(-2);
    var seconds = ('0' + (d.getSeconds())).slice(-2);
    return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
  }
}

//判断时间是否有undefined
function isTimeUndefined(time) {
  if (typeof time == 'undefined')
    return '';
  else return time;
}

//计算坐标之间的距离
function getDistance(lng1, lat1, lng2, lat2) {
  let alpha = lat1 * Math.PI / 180.0;
  return Math.sqrt(Math.pow((lat1 - lat2) * 111.12, 2) + Math.pow((lng1 - lng2) * Math.cos(alpha) * 111.12, 2));
}

//显示消息提示框
function showToast() {
  wx.showToast({
    title: '加载中...',
    icon: 'loading',
    mask: true,
    duration: 1500
  })
}

//确认提示modal框，有取消按钮
function showModal(content, cb ,error) {
  wx.showModal({
    title: '温馨提示',
    content: content,
    showCancel: true,
    success: function(res) {
      if (res.confirm) {
        cb && cb();
      }else{
        error && error();
      }
    }
  })
}
//确认提示modal框，无取消按钮
function showModal_nocancel(content, cb) {
  wx.showModal({
    title: '温馨提示',
    content: content,
    showCancel: false,
    success: function(res) {
      if (res.confirm) {
        cb && cb();
      }
    }
  })
}

//提示框
function tip(content) {
  wx.showModal({
    title: '温馨提示',
    content: content,
    showCancel: false,
    success: function(res) {
      if (res.confirm) {
        return;
      }
    }
  })
}

function showLoadingTrue(content) {
  wx.showLoading({
    title: content,
    mask: true
  })
}
function hideLoading() {
  wx.hideLoading();
  console.log('隐藏Loading');
}

function request(url, data, cb ,error) {
  // 调用request, 正确的返回(ret),（code)错误的执行
  // console.log("------->请求url:" + url);
  // console.log("参数:",data);
  wx.request({
    url: url,
    data: data,
    header: {
      "orderSource" : "3"
    },
    success: res => {
      // console.log(res,'------------------------------------->');
      if (res.statusCode == '200') {
        if (res.data.ret)
          cb && cb(res.data,res);
        else if (res.data.code == '-3004' || res.data.code == '-3008' || res.data.code == "-10001" || res.data.code == '-160005' || res.data.code == "-30007") {
          cb && cb(res.data);
        } else {
          wx.hideToast();
          if (res.data.msg == "请先登录") {
            wx.setStorageSync('token', '')
            wx.redirectTo({
              url: '../../pages/map/map'
            })
          } else if (res.data.code == "-3006"){
            console.log('不存在借出记录')
            cb && cb(res.data);
          } else if (res.data.code == "-3040") {
            showModal('为了给您提供更好的服务，请先进行学生认证',
              function() {
                wx.navigateTo({
                  url: '../../pages/studentAuth/studentAuth'
                })
              })

          } else if (res.data.code == "-3044") {
            showModal('学生认证审核失败，请重新审核!',
              function() {
                wx.navigateTo({
                  url: '../../pages/studentAuth/studentAuth'
                })
              })
          } else if (res.data.code == "-3024") {
            showModal('根据最新法规，请先实名认证',
              function() {
                wx.navigateTo({
                  url: '../../pages/authentication/authentication'
                })
              })

          } else if (res.data.code == '-3002') {
            showModal('诚信用车，请先提交押金',
              function() {
                wx.navigateTo({
                  url: '../../pages/deposit/deposit?money=' + res.data.data + '&machineNO=' + data.machineNO
                })
              })
          } else if (res.data.code == '-3048') {
            showModal('请先购买免押套餐',
              function () {
                wx.navigateTo({
                  url: '../../pages/ridePackage/ridePackage?type=1'
                });
              })
          } else if (res.data.code == '-3049') {
            let needMoney = (Number(res.data.data) / 100).toFixed(2)
            wx.showModal({
              title: '温馨提示',
              content: '请先充值' + needMoney + '元再骑行',
              confirmText: '前往',
              cancelText: '拒绝',
              success: (resp) => {
                if (resp.confirm) {
                  wx.navigateTo({
                    url: '../recharge/recharge?money=' + needMoney
                  });
                }
              }
            })
          } else if (res.data.code == '-3055') {
            let needMoney = (Number(res.data.data) / 100).toFixed(2)
            wx.showModal({
              title: '温馨提示',
              content: '骑行需确保账户内存在一定金额，请充值满' + needMoney + '元后骑行',
              confirmText: '前往',
              cancelText: '拒绝',
              success: (resp) => {
                if (resp.confirm) {
                  wx.navigateTo({
                    url: '../recharge/recharge'
                  });
                }
              }
            })
          } else if (res.data.code == '-30005') {
            showModal_nocancel('车辆不存在,请扫描其他车辆',
              function() {
                wx.navigateBack({
                  delta: 1
                })
                // wx.navigateTo({                   // 预约寻车 时候会报错 返回不了上一个页面栈所以直接跳转
                //   url: '../map/map',
                // })
              })
          } else if (res.data.code == '-3028') {
            showModal_nocancel('故障车，请扫描其它车辆',
              function() {
                wx.navigateBack({
                  delta: 1
                })
              })
          } else if (res.data.code == '-3001') {
            showModal_nocancel('该车正在被骑行',
              function() {
                wx.navigateBack({
                  delta: 1
                })
              })

          } else if (res.data.code == '-3014') {
            showModal('提交的押金不足借此车，请补足押金再借',
              function() {
                wx.navigateTo({
                  url: '../../pages/deposit/deposit?money=' + res.data.data + '&machineNO=' + data.machineNO
                })
              })
          } else if (res.data.code == '-3039') {
            let fitMoney = (Number(res.data.data) / 100).toFixed(2)
            showModal(`请先支付上次骑行费用：${fitMoney}元`,
              function() {
                wx.navigateTo({
                  url: `../recharge/recharge?debt=${fitMoney}`
                })
              })
          } else if (res.data.msg == '运营区域外禁止借车'){
            showModal(res.data.msg,()=>{
              try{
                wx.navigateBack({
                  delta:1
                })
              }catch(e){
                console.log(e);
              }
            })
          } else if (res.data.code == '-3050') {
            wx.hideToast();
            wx.showModal({
              content: res.data.msg,
              confirmColor: '#65ae56',
              showCancel: false,
            })
          } else if (res.data.code == "-1001" && url.indexOf("prohibitArea/getByArea.do") > -1) {
            // 未登录情况下点击首页面上方的“禁停区”字样，拦截此错误，提示“请先登录”，不然会提示后端返回的“登录已失效，请重新登录”
            wx.hideToast();
            this.showModal_nocancel("请先登录");
          } else if (res.data.code == "-3046") {
            wx.showModal({
              content: "运营区域外禁止临时停车",
              showCancel: false,
            })
          } else if (res.data.code == "-160004"){
            this.showModal_nocancel(res.data.msg,function() {    // 被预约车辆 点击之后返回 
              wx.navigateBack({
                delta: 1
              })
            })
          } 
          else {
            console.log(res.data.msg,'222222222');
            this.showModal_nocancel(res.data.msg)
          }
        }
      } else if (res.statusCode == "500" || res.statusCode == "504"){
        wx.hideToast();
        this.showModal_nocancel("服务器错误，请联系客服！")
      } else if (res.statusCode == "404") {
        wx.hideToast();
        this.showModal_nocancel("未找到该请求连接！")
      } else if (res.statusCode == "400") {
        wx.hideToast();
        wx.showToast({
          title: '请求参数错误，请联系客服！',
          icon: 'none'
        })
      }
    },
    fail: res => {
      console.log(url + "_:失败:" + res.errMsg);
      error && error();
    },
    complete: res => {
    }
  })
}

//判断微信版本和系统版本
function judgeVersion(cb) {
  let sysinfo = wx.getSystemInfoSync();
  if (sysinfo['platform'] == 'android' && versionCompare('6.5.7', sysinfo['version'])) {
    tip('当前微信版本过低，请更新至最新版本');
  } else if (sysinfo['platform'] == 'ios' && versionCompare('6.5.6', sysinfo['version'])) {
    tip('当前微信版本过低，请更新至最新版本');
  } else
    cb && cb();
}

function versionCompare(ver1, ver2) { //版本比较
  let version1pre = parseFloat(ver1)
  let version2pre = parseFloat(ver2)
  let version1next = parseInt(ver1.replace(version1pre + ".", ""))
  let version2next = parseInt(ver2.replace(version2pre + ".", ""))
  if (version1pre > version2pre)
    return true
  else if (version1pre < version2pre)
    return false
  else {
    if (version1next > version2next)
      return true
    else
      return false
  }
}

//解密 ，参数16进制
function encrypt(number) {
  number = number.toUpperCase()
  let out_number = '';
  if (!number) return;
  let len = number.length;

  if (len > 16) return;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < 16; j++) {
      if (number.charAt(i).charCodeAt() == szKey3[j]) //字符转ascii码
        out_number += String.fromCharCode(0x2A + j);
      else
        continue;
    }

  }
  return out_number

}


//TID号加密解密算法描述
//466fe489d=>70537421
const szKey3 = [0x35, 0x41, 0x32, 0x42, 0x33, 0x43, 0x36, 0x44, 0x39, 0x45,
  0x38, 0x46, 0x37, 0x34, 0x31, 0x30
];

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  let hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function(bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}


//字符转ArrayBuffer
function hexStringToArrayBuffer(str) {
  // 将16进制转化为ArrayBuffer
  return new Uint8Array(str.match(/[\da-f]{2}/gi).map(function(h) {
    return parseInt(h, 16)
  })).buffer
}

//字符串平均切割成数组
function strAverage2Arr(str, no) {
  let arr = [];
  for (let i = 0; i < str.length; i += no) {
    arr.push(str.slice(i, i + 2));
  }
  return arr;

}

//数组的每个元素加前缀
function addFlagBeforeArr(arr) {
  return Array.prototype.map.call(arr, function(value) {
    return `0x${value}`;
  })
}

/**
 * machineNo  
 * brand 品牌
 * os    机型
 * fail   是否失败
 * errCode  原因
 * errDesc  原因
 * way  操作方式
 * cb 
 **/
function log(machineNO, mobileBrand, mobileOS, remark, cb) {
  let url = 'https://client.uqbike.cn/appOperaLog/add.do';
  let param = {
    machineNO,
    mobileBrand,
    mobileOS,
    remark
  };
  if (wx.getStorageSync('token'))
    param.token = wx.getStorageSync('token');
  wx.request({
    url: url,
    data: param,
    success: function(res) {
      if (res.statusCode == '200') {
        if (res.data.ret) {
          console.log('log一下', remark);
          cb && cb();
        } else {
          console.log(res.data.msg);
        }
      }
    },
    fail: function(res) {
      wx.showModal(res)
    },
    complete: function(res) {},
  })

}
function isEmojiCharacter(substring) {
      for ( var i = 0; i < substring.length; i++) {
          var hs = substring.charCodeAt(i);
          if (0xd800 <= hs && hs <= 0xdbff) {
              if (substring.length > 1) {
                  var ls = substring.charCodeAt(i + 1);
                  var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                  if (0x1d000 <= uc && uc <= 0x1f77f) {
                      return true;
                  }
              }
          } else if (substring.length > 1) {
              var ls = substring.charCodeAt(i + 1);
              if (ls == 0x20e3) {
                  return true;
              }
          } else {
              if (0x2100 <= hs && hs <= 0x27ff) {
                  return true;
              } else if (0x2B05 <= hs && hs <= 0x2b07) {
                  return true;
              } else if (0x2934 <= hs && hs <= 0x2935) {
                  return true;
              } else if (0x3297 <= hs && hs <= 0x3299) {
                  return true;
              } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                      || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                      || hs == 0x2b50) {
                  return true;
              }
          }
      }
  }

  // 判断图片大小是否满足要求

function imageSizeIsLessLimitSize(imagePath, limitSize, lessCallBack, moreCallBack) {
  wx.getFileInfo({
      filePath: imagePath,
      success(res) {
          console.log("压缩前图片大小:", res.size / 1024, 'kb');
          if (res.size > 1024 * limitSize) {
              moreCallBack();
          } else {
              lessCallBack();
          }
      }
  })
}; 

// 利用cavas进行压缩  每次压缩都需要ctx.draw()  wx.canvasToTempFilePath()连用
function getCanvasImage(canvasId, imagePath, imageW, imageH, getImgsuccess) {
  const ctx = wx.createCanvasContext(canvasId);
  ctx.drawImage(imagePath, 0, 0, imageW, imageH);
  ctx.draw(false, setTimeout(function() { // 一定要加定时器，因为ctx.draw()应用到canvas是有个时间的
      wx.canvasToTempFilePath({
          canvasId: canvasId,
          x: 0,
          y: 0,
          width: imageW,
          height: imageH,
          quality: 1,
          success: function(res) {
              getImgsuccess(res.tempFilePath);
          },
      });
  }, 200));
};
/**
 * 获取小于限制大小的Image, limitSize默认为100KB，递归调用。
 */
function getLessLimitSizeImage(canvasId, imagePath, limitSize = 100, drawWidth, callBack) {
  imageSizeIsLessLimitSize(imagePath, limitSize,
      (lessRes) => {
          callBack(imagePath);
      },
      (moreRes) => {
          wx.getImageInfo({
              src: imagePath,
              success: function(imageInfo) {
                  var maxSide = Math.max(imageInfo.width, imageInfo.height);
                  //画板的宽高默认是windowWidth
                  var windowW = drawWidth;
                  var scale = 1;
                  if (maxSide > windowW) {
                      scale = windowW / maxSide;
                  }
                  var imageW = Math.trunc(imageInfo.width * scale);
                  var imageH = Math.trunc(imageInfo.height * scale);
                  console.log('调用压缩', imageW, imageH);
                  getCanvasImage(canvasId, imagePath, imageW, imageH,
                      (pressImgPath) => {
                          getLessLimitSizeImage(canvasId, pressImgPath, limitSize, drawWidth * 0.7, callBack);
                      }
                  );
              }
          })
      }
  )
};
function returnCheckRequest(url,data,cb,error){
  wx.request({
    url: url,
    data: data,
    header: {
      "orderSource" : "3"
    },
    success: res => {
      if (res.statusCode == '200') {
       // console.log(res)
          cb && cb(res.data);
      } else if (res.statusCode == "500" || res.statusCode == "504"){
        wx.hideToast();
        this.showModal_nocancel("服务器错误，请联系客服！")
      } else if (res.statusCode == "404") {
        wx.hideToast();
        this.showModal_nocancel("未找到该请求连接！")
      } else if (res.statusCode == "400") {
        wx.hideToast();
        wx.showToast({
          title: '请求参数错误，请联系客服！',
          icon: 'none'
        })
      }

    },
    fail: res => {
      console.log(url + "_:失败:" + res.errMsg);
      error && error();
    },

  })
}

module.exports = {
  getDistance: getDistance,
  showToast: showToast,
  formatTime: formatTime,
  formatTime_curret: formatTime_curret,
  timeDifference: timeDifference,
  request: request,
  tip: tip,
  showModal_nocancel: showModal_nocancel,
  showModal: showModal,
  showLoadingTrue: showLoadingTrue,
  isTimeUndefined: isTimeUndefined,
  hexStringToArrayBuffer: hexStringToArrayBuffer,
  encrypt: encrypt,
  ab2hex: ab2hex,
  judgeVersion: judgeVersion,
  strAverage2Arr: strAverage2Arr,
  addFlagBeforeArr: addFlagBeforeArr,
  hideLoading: hideLoading,
  log: log,
  isEmojiCharacter:isEmojiCharacter,
  getLessLimitSizeImage:getLessLimitSizeImage,
  returnCheckRequest:returnCheckRequest,
  debounce,
  throttle,
  dateTimeFormate
}