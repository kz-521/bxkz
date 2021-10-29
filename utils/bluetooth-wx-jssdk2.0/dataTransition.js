const CRC16Data = [
  0X0000, 0X1189, 0X2312, 0X329B, 0X4624, 0X57AD, 0X6536, 0X74BF, 0X8C48, 0X9DC1, 0XAF5A, 0XBED3, 0XCA6C,
  0XDBE5, 0XE97E, 0XF8F7, 0X1081, 0X0108, 0X3393, 0X221A, 0X56A5, 0X472C, 0X75B7, 0X643E, 0X9CC9, 0X8D40,
  0XBFDB, 0XAE52, 0XDAED, 0XCB64, 0XF9FF, 0XE876, 0X2102, 0X308B, 0X0210, 0X1399, 0X6726, 0X76AF, 0X4434,
  0X55BD, 0XAD4A, 0XBCC3, 0X8E58, 0X9FD1, 0XEB6E, 0XFAE7, 0XC87C, 0XD9F5, 0X3183, 0X200A, 0X1291, 0X0318,
  0X77A7, 0X662E, 0X54B5, 0X453C, 0XBDCB, 0XAC42, 0X9ED9, 0X8F50, 0XFBEF, 0XEA66, 0XD8FD, 0XC974, 0X4204,
  0X538D, 0X6116, 0X709F, 0X0420, 0X15A9, 0X2732, 0X36BB, 0XCE4C, 0XDFC5, 0XED5E, 0XFCD7, 0X8868, 0X99E1,
  0XAB7A, 0XBAF3, 0X5285, 0X430C, 0X7197, 0X601E, 0X14A1, 0X0528, 0X37B3, 0X263A, 0XDECD, 0XCF44, 0XFDDF,
  0XEC56, 0X98E9, 0X8960, 0XBBFB, 0XAA72, 0X6306, 0X728F, 0X4014, 0X519D, 0X2522, 0X34AB, 0X0630, 0X17B9,
  0XEF4E, 0XFEC7, 0XCC5C, 0XDDD5, 0XA96A, 0XB8E3, 0X8A78, 0X9BF1, 0X7387, 0X620E, 0X5095, 0X411C, 0X35A3,
  0X242A, 0X16B1, 0X0738, 0XFFCF, 0XEE46, 0XDCDD, 0XCD54, 0XB9EB, 0XA862, 0X9AF9, 0X8B70, 0X8408, 0X9581,
  0XA71A, 0XB693, 0XC22C, 0XD3A5, 0XE13E, 0XF0B7, 0X0840, 0X19C9, 0X2B52, 0X3ADB, 0X4E64, 0X5FED, 0X6D76,
  0X7CFF, 0X9489, 0X8500, 0XB79B, 0XA612, 0XD2AD, 0XC324, 0XF1BF, 0XE036, 0X18C1, 0X0948, 0X3BD3, 0X2A5A,
  0X5EE5, 0X4F6C, 0X7DF7, 0X6C7E, 0XA50A, 0XB483, 0X8618, 0X9791, 0XE32E, 0XF2A7, 0XC03C, 0XD1B5, 0X2942,
  0X38CB, 0X0A50, 0X1BD9, 0X6F66, 0X7EEF, 0X4C74, 0X5DFD, 0XB58B, 0XA402, 0X9699, 0X8710, 0XF3AF, 0XE226,
  0XD0BD, 0XC134, 0X39C3, 0X284A, 0X1AD1, 0X0B58, 0X7FE7, 0X6E6E, 0X5CF5, 0X4D7C, 0XC60C, 0XD785, 0XE51E,
  0XF497, 0X8028, 0X91A1, 0XA33A, 0XB2B3, 0X4A44, 0X5BCD, 0X6956, 0X78DF, 0X0C60, 0X1DE9, 0X2F72, 0X3EFB,
  0XD68D, 0XC704, 0XF59F, 0XE416, 0X90A9, 0X8120, 0XB3BB, 0XA232, 0X5AC5, 0X4B4C, 0X79D7, 0X685E, 0X1CE1,
  0X0D68, 0X3FF3, 0X2E7A, 0XE70E, 0XF687, 0XC41C, 0XD595, 0XA12A, 0XB0A3, 0X8238, 0X93B1, 0X6B46, 0X7ACF,
  0X4854, 0X59DD, 0X2D62, 0X3CEB, 0X0E70, 0X1FF9, 0XF78F, 0XE606, 0XD49D, 0XC514, 0XB1AB, 0XA022, 0X92B9,
  0X8330, 0X7BC7, 0X6A4E, 0X58D5, 0X495C, 0X3DE3, 0X2C6A, 0X1EF1, 0X0F78

]

//获取流水号
function getSequenceId(sequenceId) {
  if (sequenceId > 255) sequenceId = 0;
  let n = sequenceId.toString(16);
  let s = `00${n}`;
  return s.substr(n.length, s.length); // 截取最后2位字符
}


//获取数据的字节长度
function getPayLoadLength(content) {


  let c = (content.length / 2).toString(16);
  let s = `0000${c}`;
  return s.substr(c.length, s.length);
}

//获取秘钥长度
function getSecretKeyLength(content) {


  let c = (content.length / 2).toString(16);
  let s = `00${c}`;
  return s.substr(c.length, s.length);
}


function getCRC16(content) {

  let mCrc = 0xffff;
  //[0x03, 0x00, 0x82, 0x01, 0x00]
  content.forEach(function(value, index, array) {

    mCrc = (mCrc >>> 8) ^ CRC16Data[(mCrc ^ value) & 0xff];
  })

  let value = ((~mCrc) & 0xffff).toString(16);
  let s = `0000${value}`;


  return s.substr(value.length, s.length);

}


//数据包请求头,ack
function header(sendData, ack, systemState, sequenceId) {


  let payLoadLength = this.getPayLoadLength(sendData.toString().replace(/\s+/g, ""));

  let contentArr = Array.prototype.map.call(sendData.split(' '), function(value) {
    return `0x${value}`;
  })

  let CRC16 = this.getCRC16(contentArr).toLowerCase();

  /*
 ack 0 ,1,反馈为1，发送为0
 systemState,反馈为带过来的值，发送为00
 sequenceId,为流水号，自增
 payLoadLength,数据包的长度
 CRC16,数据包经过CRC算法得到的结果
  */

  let header = `aa${ack}2${systemState}${sequenceId}${payLoadLength}${CRC16}`;
  return header;
}


//数据包
function content(secretKey, sendValue) {
  if (secretKey.length == 0) return sendValue;
  else return `${secretKey}${sendValue}`
}

//TID号加密解密算法描述
//466fe489d=>70537421
const szKey3 = [0x35, 0x41, 0x32, 0x42, 0x33, 0x43, 0x36, 0x44, 0x39, 0x45,
  0x38, 0x46, 0x37, 0x34, 0x31, 0x30
];
//解密 ，参数16进制
const encrypt = (number) => {
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

// ArrayBuffer转16进度字符串示例
const ab2hex = (buffer) => {
  let hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

//字符串平均切割成数组
const strAverage2Arr = (str, no) => {
  let arr = [];
  for (let i = 0; i < str.length; i += no) {
    arr.push(str.slice(i, i + 2));
  }
  return arr;

}

//数组的每个元素加前缀
const addFlagBeforeArr = (arr) => {
  return Array.prototype.map.call(arr, function (value) {
    return `0x${value}`;
  })
}

//字符转ArrayBuffer
const hexStringToArrayBuffer = (str) => {
  // 将16进制转化为ArrayBuffer
  return new Uint8Array(str.match(/[\da-f]{2}/gi).map(function (h) {
    return parseInt(h, 16)
  })).buffer
}

module.exports = {
  header: header,
  content: content,
  getCRC16: getCRC16,
  getSequenceId: getSequenceId,
  getSecretKeyLength: getSecretKeyLength,
  getPayLoadLength: getPayLoadLength, 
  encrypt: encrypt,
  ab2hex: ab2hex,
  strAverage2Arr: strAverage2Arr,
  addFlagBeforeArr: addFlagBeforeArr,
  hexStringToArrayBuffer: hexStringToArrayBuffer
}