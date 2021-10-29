let dataTransition = require('./dataTransition.js');
let util = require('../util.js');

/**
 * v2.1.2
 * 胡宇健
 * 注：电池锁等获取设备状态的功能暂只兼容了WA-206的设备
 */

function BluetoothOperate(){
  let _machineNO = null; //当前类保留的设备编号
  let _operateType = null; //操作
  let _discoveryDevicesTimer = null;
  let _deviceId = null;
  let _serviceId = 'FEF6'; //UUID 
  let _characteristicId_notify = null; //读特征值
  let _characteristicId_write = null; //写特征值
  let _sequenceId = 10; //流水号
  let _sendData = ''; //发送的包数据
  let _dataLen = 0; //数据长度
  let _systemState = '';
  let _sequenceId_16 = ''; //流水号16进制
  let _CRC16 = '';
  let _dataContent = '';
  let _connected = false;
  let _hasReceive = false;
  let _callBack = null;  //回调函数
  let _key = ''; //蓝牙密钥

  let _sendCommandTime = 0;
  let _sendCommandTimer = null; //是否重新发送消息的定时器
  let _listenerTime = 0;
  let _listenerTimer = null;

  let _reConnect = 1; //重新连接次数
  let _logList = []; //日志包
  let _machineState = []; //设备状态二进制数组
  let _machineVerson = ''; //设备版本号
  let _machinevoltage = ''; //设备电压

  this.start = (operateType, machineNO, key, cb) => {
    _initVariable();  //初始化变量
    //变量赋值
    _operateType = operateType;
    _key = key;
    _callBack = cb;

    this.log(machineNO, _machineNO, 'operate:', _operateType); //对比两个设备编号
    _initBluetooth(()=>{ //初始化
      //若存在该设备编号表面与前面的操作一致，直接使用deviceId进行连接
      if (machineNO == _machineNO && _deviceId && _operateType) { 
        _startConnectDevices(); //进入直接连接步骤
      } else {
        _machineNO = machineNO;
        _deviceId = null;
        _operate();  //进入搜索步骤
      }
    })
  }

  this.end = (cb) => {
    wx.hideLoading();
    wx.hideToast();
    if (_sendCommandTimer) {
      clearTimeout(_sendCommandTimer);
    }
    if (_listenerTimer) {
      clearTimeout(_listenerTimer);
    }
    wx.closeBLEConnection({
      deviceId: _deviceId,
      complete: () => {
        _closeBluetoothAdapter();
        _stopBluetoothDevicesDiscovery();
        this.log('结束蓝牙操作！');
        cb && cb();
        _initVariable();
      }
    })
  }

  this.getMachineNO = () => {
    return _machineNO;
  }

  this.getKey = () => {
    return _key;
  }

  this.getLog = () => {
    return _logList;
  }

  //获取电池锁状态
  this.getBatteryLockState = () => {
    return _machineState[0];
  }

  //判断电池锁是否开启
  this.isOpenBatteryLock = () => {
    if (_machineState[0] == 0)
      return true;
    else
      return false;
  }

  //获取设备运动状态
  this.getMotionState = () => {
    return _machineState[6];
  }

  //判断设备是否运动中
  this.isMotion = () => {
    if (_machineState[6] == 1)
      return true;
    else
      return false;
  }

  //获取设备借还车状态
  this.getBorrowState = () => {
    return _machineState[7];
  }

  //判断设备是否已借车
  this.isBorrowed = () => {
    if (_machineState[7] == 0)
      return true;
    else
      return false;
  }

  this.getMachinevoltage = () =>{
    return _machinevoltage / 1000;
  }

  const _initVariable = () => {
    _operateType = null;
    _discoveryDevicesTimer = null;
    _serviceId = 'FEF6';
    _characteristicId_notify = null;
    _characteristicId_write = null;
    _sequenceId = 10;
    _sendData = '';
    _dataLen = 0;
    _systemState = '';
    _sequenceId_16 = '';
    _CRC16 = '';
    _dataContent = '';
    _connected = false;
    _hasReceive = false;
    _callBack = null;
    _sendCommandTime = 0;
    _sendCommandTimer = null;
    _listenerTime = 0;
    _listenerTimer = null;
    _logList = [];
    _reConnect = 1;
  }

  const _operate = () => {
    //进入常规搜索流程
    _deviceId = null; //一旦进入常规搜索流程初始化id，确保中断操作时下一次操作不会误使用该id
    _startBluetoothDevicesDiscovery();
  }

  //开启蓝牙搜索，下一步打开监听事件
  const _startBluetoothDevicesDiscovery = () =>{
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: false,
      services: ['FEF6', 'FEF5'],
      success: (res) => {
        this.log('蓝牙搜索启用成功！');
        this.log(res.errMsg);
        if (res.isDiscovering){
          _onBluetoothDeviceFound();
        }else{
          this.log('没有开启定位服务','isDiscovering = false');
        }
      },
      fail: (err) => {
        if (err.errMsg.indexOf('not init') > -1){
          _initBluetooth(() => {
            _startBluetoothDevicesDiscovery();
          });
        } else {
          this.end(()=>{
            _callBack && _callBack(false);
          });
          this.log('startBluetoothDevicesDiscovery error:', err.errMsg);
        }
      }
    })
  }
  
  //蓝牙搜索监听事件
  const _onBluetoothDeviceFound = () => {
    _repeatDiscoveryMachine();
    wx.onBluetoothDeviceFound((res) => {
      let device = res.devices[0];
      console.log(device);
      if (device && device.advertisData && device.advertisData.byteLength != 0 ){
        let machineNO = dataTransition.encrypt(dataTransition.ab2hex(device.advertisData).slice(4, 13));
        this.log('搜索到的设备编号：' + machineNO + "，目标：" + _machineNO);
        if(machineNO == _machineNO){
          _stopBluetoothDevicesDiscovery();
          clearInterval(_discoveryDevicesTimer);
          _discoveryDevicesTimer = null;

          _deviceId = device.deviceId;
          this.log('deviceId:', _deviceId);
          if (_operateType == 'open' || _operateType == 'close')
            _startConnectDevices();
          else
            _callBack && _callBack(true);
        }
      }
    })
  }

  //定时器
  const _repeatDiscoveryMachine = () => {
    let discoveryDevicesTime = 0;
    if (_discoveryDevicesTimer){
      clearInterval(_discoveryDevicesTimer);
      _discoveryDevicesTimer = null;
    }
    _discoveryDevicesTimer = setInterval(() => {
      if (discoveryDevicesTime > 14){
        clearInterval(_discoveryDevicesTimer);
        _discoveryDevicesTimer = null;
        discoveryDevicesTime = 0;
        wx.hideToast();
        wx.hideLoading();

        _stopBluetoothDevicesDiscovery();
        wx.showModal({
          title: '温馨提示',
          content: '搜索设备失败,请尝试重新打开定位与蓝牙，是否重新搜索？',
          success: (res) => {
            if (res.cancel) {
              this.end(() => {
                _callBack && _callBack(false);
              });
            } else { //蒙层和confirm
              wx.showToast({
                title: '请稍候',
                icon: 'loading',
                mask: true,
                duration: 150000
              })
              _startBluetoothDevicesDiscovery();
            }
          }
        })
      }else{
        discoveryDevicesTime++;
        console.log('搜索时间：', discoveryDevicesTime)
      }
    },1000)
  }

  //通过deviceId连接蓝牙设备
  const _startConnectDevices = () => {
    if (_deviceId.length > 0) {
      wx.createBLEConnection({
        deviceId: _deviceId,
        timeout: 15000,
        success: (res) => {
          this.log('createBLEConnection success:', res.errMsg);
          if (res.errCode == 0) {
            _getService();
          }
        },
        fail: (err) => {
          this.log('createBLEConnection error:', err.errMsg);
          if (err.errCode != -1 && err.errCode != 10000) {
            if (err.errCode == 10006 || err.errCode == 10003 || err.errCode == 10012) {
              wx.showModal({
                title: '温馨提示',
                content: '连接失败，请尝试： (1)重新打开手机定位 (2)点击重试',
                confirmText: '重试',
                success: (res) => {
                  if (res.cancel) {
                    this.end(() => {
                      _callBack && _callBack(false);
                    });
                  } else {
                    this.log('正在重连...');
                    //这里加一个
                    wx.closeBLEConnection({
                      deviceId: _deviceId,
                      complete: () => {
                        wx.closeBluetoothAdapter({
                          success: () => {
                            wx.openBluetoothAdapter({
                              success: () => {
                                this.log('重连之前，重启蓝牙适配器成功!')
                                if(_reConnect >= 2){
                                  _startBluetoothDevicesDiscovery();
                                } else {
                                  _reConnect++;
                                  _startConnectDevices();
                                }
                              }
                            })
                          }
                        });
                      },
                    })
                  }
                }
              })
            }
          } else if (err.errMsg.indexOf('not init') > -1) { //入口之一，判断无初始化直接执行
            _initBluetooth(() => {
              _startConnectDevices();
            });
          } else {
            this.end(() => {
              _callBack && _callBack(false);
            });
          }
        },
        complete: () => {

        }
      });
    }
  }

  //获取所有服务
  const _getService = () => {
    _reConnect = 1;
    // 获取蓝牙设备service值
    wx.getBLEDeviceServices({
      deviceId: _deviceId,
      success: (res) => {
        this.log('获取的所有服务值', res.errMsg);
        _getCharacter(res.services);
      },
      fail: (err) => {
        this.log('getBLEDeviceServices error', err.errMsg);
        wx.showToast({
          title: 'service获取失败',
          icon: 'none',
        })
        this.end(() => {
          _callBack && _callBack(false);
        });
      }
    })
  }

  //获取特征值
  const _getCharacter = (services) => {
    services.forEach((service, index) => {
      if (service.uuid.indexOf(_serviceId) > -1) {
        _serviceId = service.uuid;
        this.log("serviced", _serviceId)

        wx.getBLEDeviceCharacteristics({
          deviceId: _deviceId,
          serviceId: _serviceId,
          success: (res) => {
            this.log('特征值：', res.errMsg);
            res.characteristics.forEach((item) => {
              if(item.properties.write)
                _characteristicId_write = item.uuid;
              if(!item.properties.write && item.properties.notify)
                _characteristicId_notify = item.uuid;
              
            })
            this.log('特征值读:', _characteristicId_notify, '特征值写:', _characteristicId_write);

            _notifyBLECharacteristicValueChange(() => {
              _connectCtrl();
            });
          },
          fail: (err) => {
            this.log('读取特征值失败：' + err.errMsg);
            this.end(() => {
              _callBack && _callBack(false);
            });
            util.showModal_nocancel('读取特征值失败，请重试。')
          }
        })
        return;
      }
    });
  }

  //秘钥连接指令
  const _connectCtrl = () => {
    let secretKey = _key.toString().trim().toLowerCase();
    //拼接数据头
    let sequenceId_16 = dataTransition.getSequenceId(_sequenceId);
    _sequenceId++;
    let c = secretKey.toString().replace(/\s+/g, "");
    let cLength = dataTransition.getSecretKeyLength(c);
    //发送内容
    let sendValue = `02 00 01 ${cLength}`; //02 连接命令  01连接请求 cLength秘钥长度。
    let allData = `${sendValue} ${secretKey}`;
    let header = dataTransition.header(allData, 0, '00', sequenceId_16);
    let data = header + allData.replace(/\s+/g, "");
    this.log('发送的连接数据：', data);
    _sendCtrl(data);
  }

  this.translateCtrl = (secretKey) => {
    let key = secretKey.toString().trim().toLowerCase();
    //拼接数据头
    let sequenceId_16 = dataTransition.getSequenceId(_sequenceId);
    _sequenceId++;
    let c = key.toString().replace(/\s+/g, "");
    let cLength = dataTransition.getSecretKeyLength(c);
    //发送内容
    let sendValue = `02 00 01 ${cLength}`; //02 连接命令  01连接请求 cLength秘钥长度。
    let allData = `${sendValue} ${key}`;
    let header = dataTransition.header(allData, 0, '00', sequenceId_16);
    let data = header + allData.replace(/\s+/g, "");
    this.log('数据：', data);
  }

  //发送指令。判断是否分包发送数据
  const _sendCtrl = (data) => {
    //保存一下发送的数据
    _sendData = data;
    //如果大于20个字节则分包发送,两个字符一个字节
    let dataLen = Math.ceil(data.length / 40);
    if (dataLen > 1) { //3
      for (let i = 0; i < data.length; i += 40) {
        let value = dataTransition.hexStringToArrayBuffer(data.slice(i, i + 40));
        this.log("分包发送的数据", data.slice(i, i + 40))
        _writeBLECharacteristicValue(value);
      }
    } else {
      let value = dataTransition.hexStringToArrayBuffer(data);
      _writeBLECharacteristicValue(value);
    }
  }

  //发送信息
  const _writeBLECharacteristicValue = (value,cb) => {
    setTimeout(() => {
      wx.writeBLECharacteristicValue({
        deviceId: _deviceId,
        serviceId: _serviceId,
        characteristicId: _characteristicId_write,
        // 这里的value是ArrayBuffer类型
        value: value,
        success: (res) => {
          this.log('发送信息成功', res.errMsg);
          cb && cb();
        },
        fail: (err) => {
          this.log('writeBLECharacteristicValue error ', err.errMsg);
          let code = err.errCode;
          if (code == 10006 || code == 10000) { //连接断开
            _startConnectDevices();
          } else if (code == 10008) {
            this.log('重发数据', dataTransition.ab2hex(value));
            _writeBLECharacteristicValue(value);
          } else {
            util.showModal_nocancel('数据发送失败，请重试。');
            this.end(() => {
              _callBack && _callBack(false);
            });
          }
        }
      })
    }, 200);
  }

  //监听事件开启
  const _notifyBLECharacteristicValueChange = (cb) => {
    wx.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: _deviceId,
      serviceId: _serviceId,
      characteristicId: _characteristicId_notify,
      success: () => {
        if (_listenerTime != -1){ //超时安全判断
          _listenerTimer = setTimeout(() => {
            if (_listenerTime == 0) {
              this.log('未接收到回复信息！自动重发一次！');
              _listenerTime++;
              _connectCtrl();
            } else {
              wx.hideToast();
              wx.hideLoading();
              wx.showModal({
                content: '未接收到回复信息！',
                confirmText: '重试',
                success: (res) => {
                  if (res.confirm) {
                    wx.showToast({
                      title: '请稍后',
                      icon: 'loading',
                      mask: true,
                      duration: 15000
                    })
                    _connectCtrl();
                  } else {
                    this.end(() => {
                      _callBack && _callBack(false);
                    });
                  }
                }
              })
            }
          }, 5000)
        }

        wx.onBLECharacteristicValueChange((res) => {
          clearTimeout(_listenerTimer);
          _listenerTime = -1;
          let data = dataTransition.ab2hex(res.value)
          this.log('********notify收到的数据：', data);
          // if(data.slice(0,4) == 'aa10'){
          if(data.slice(0,4) == 'aa10' || data.slice(0,4) == 'aa12'){
            this.log('指令发送成功：');
          } else if (data.slice(0, 4) == 'aa30') {
            this.log('CRC校验失败');
            util.showModal_nocancel('CRC校验失败,请重试。');
            this.end(() => {
              _callBack && _callBack(false);
            });
            //end
          } else if (data.slice(0, 3) == 'aa0' && _dataLen == 0){
            //设备版本号
            _machineVerson = data.slice(2,4); 
            //16进制流水号
            _sequenceId_16 = data.slice(6, 8); //0a
            //计算数据包长度
            _dataLen = parseInt(data.slice(8, 12), 16); //003e,16=62
            //计算systemState
            _systemState = data.slice(4, 6); //4c
            _analysisSystem(_systemState);
            //crc
            _CRC16 = data.slice(12, 16); //290e
            this.log("需要接收的字节长度", _dataLen);
            if (data.length > 16) {
              _connectData(data.slice(16))
            }
          } else {
            if (_dataLen > 0) {
              _connectData(data)
            }
          }
        })

        cb && cb();
      },
      fail: (err) => {
        this.log('notifyBLECharacteristicValueChange', err.errMsg);
        util.showModal_nocancel('特征值监听开启失败，请重试。')
        this.end(() => {
          _callBack && _callBack(false);
        });
      }
    })
  }

  //解析存储车辆状态
  const _analysisSystem = (systemState) => {
    //16进制转换为10进制
    let decimalState = parseInt(systemState,16);
    //10进制转换为2进制
    let binaryState = parseInt(decimalState).toString(2);

    if (binaryState.length < 8){
      let supplyNum = 8 - binaryState.length;
      while(supplyNum > 0){
        binaryState = '0' + binaryState;
        supplyNum--;
      }
    }
    
    //字符串拆分成为数组
    let stateArray = Array.prototype.slice.call(binaryState);

    _machineState = stateArray;
    console.log(stateArray);
  }

  //拼接数据，判断数据并发送
  const _connectData = (data) => {
    this.log('拼接内容：',data);
    _dataContent += data;
    this.log('内容长度', _dataContent.length,'接收到的数据长度', _dataLen,'*2');
    if (_dataContent.length == _dataLen * 2) { //接收完该长度的字节和校验CRC成功之后再发送ACK
      let dc = _dataContent;
      let dcArr = [];
      this.log('接收的数据长度字节：', dc.length / 2);
      let contentArr = dataTransition.addFlagBeforeArr(dataTransition.strAverage2Arr(dc, 2));

      if (parseInt(dataTransition.getCRC16(contentArr), 16) == parseInt(_CRC16, 16)) {
        this.log('CRC16校验成功');
        let value = dataTransition.hexStringToArrayBuffer(`aa12${_systemState}${_sequenceId_16}00000000`);
        this.log(`返回的确认数据${dataTransition.ab2hex(value)}`);
        //分析数据返回的内容 
        _analysisBLEContent(dc,value);
      } else {
        this.log('CRC16校验失败', dataTransition.getCRC16(contentArr) + "_应为：" + _CRC16);
        util.showModal_nocancel('CRC16校验失败,请重试。');
        this.end(() => {
          _callBack && _callBack(false);
        });
        //end
      }

      _dataLen = 0;
      _systemState = '';
      _dataContent = '';
      _sequenceId_16 = '';
      _CRC16 = '';
    }
  }

  //解析蓝牙发送内容
  const _analysisBLEContent = (content, reply) => {
    
    this.log('解析数据数据***************', content);
    if (content.indexOf('020101') > -1) {
      if (!_connected) {
        _connected = true;
        this.log('连接成功');
        _writeBLECharacteristicValue(reply, () => {
          _ctrl(_operateType);
        });
        _analysisVoltage(content);
      }
    } else if (content.indexOf('0300820100') > -1) {
      if (_sendCommandTimer) { //每次都将清除等待任务
        clearTimeout(_sendCommandTimer);
        _sendCommandTimer = null;
      }
      if (!_hasReceive) {
        _hasReceive = true;
        _writeBLECharacteristicValue(reply, () => {
          this.log('开锁成功，开始回调ctrl_cb');
          this.end(() => {
            _callBack && _callBack(true);
          });
        });
      }
    } else if (content.indexOf('0300810100') > -1) {
      if (_sendCommandTimer) { //每次都将清除等待任务
        clearTimeout(_sendCommandTimer);
        _sendCommandTimer = null;
      }
      if (!_hasReceive) {
        _hasReceive = true;
        _writeBLECharacteristicValue(reply, () => {
          this.log('上锁成功，开始回调ctrl_cb');
          this.end(()=>{
            _callBack && _callBack(true);
          });
        });
      }
    } else if (content.indexOf('04008524') > -1) {
      _writeBLECharacteristicValue(reply, () => {
        this.log('心跳包');
      });
    } else if (content.indexOf('020100') > -1) {
      if (_sendCommandTimer) { //每次都将清除等待任务
        clearTimeout(_sendCommandTimer);
        _sendCommandTimer = null;
      }
      this.log('鉴权失败：', _sendData);
      util.showModal_nocancel('鉴权失败！')
      this.end(()=>{
        _callBack && _callBack(false);
      });
      //end
    } else {
      if (_sendCommandTimer) { //每次都将清除等待任务
        clearTimeout(_sendCommandTimer);
        _sendCommandTimer = null;
      }
      this.end(() => {
        let text = content === '0300810102' ? '运动中不能上锁!' : '蓝牙操作失败，请重试!';
        this.log(text)
        wx.showToast({
          title: text,
          mask: true,
          icon: 'none',
          duration: 5000
        })
        _callBack && _callBack(false);
      })
    }
  }

  const _analysisVoltage = (content) => {
    //判断81 ：终端电池电压
    if (content.indexOf('02010181') > -1){
      //这之后两位表示电池电压：81，两位表示长度：02，加上020101共十位
      let startN = content.indexOf('020101') + 10; 
      //后四位表示电压值：16进制
      let voltageData = content.slice(startN, startN + 4);

      let voltage = parseInt(voltageData,16);
      if(_machineVerson == '02')
        _machinevoltage = voltage * 10;
      else
        _machinevoltage = voltage;
    }
  }

  //指令
  const _ctrl = (type) => {
    let sequenceId_16 = dataTransition.getSequenceId(_sequenceId);
    _sequenceId++;
    let sendData = '';
    if (type === 'open') //<aa02000b 00057edb 03000201 00 >
      // commandId:03，间隔符:固定00，key:02，value长度:01，value:00
      sendData = '03 00 02 01 00';
    if (type === 'close') //<aa02000c 00058036 03000101 01 >
      sendData = '03 00 01 01 01';
    if(type == 'temp')   //临时停车
      sendData = '03 00 01 01 30';  
    let header = dataTransition.header(sendData, 0, '00', sequenceId_16);
    let data = header + sendData.replace(/\s+/g, "");

    this.log(`发送${type}指令`, data,header);
    _sendCtrl(data);

    _sendCommandTimer = setTimeout(()=>{ //可能出现发送消息后没有收到应答，将再次发送
      if (_sendCommandTime == 0) {
        this.log('设备未响应，自动重发')
        _sendCommandTime++;
        _ctrl(_operateType);
      }else{
        this.log('设备未响应')
        wx.hideLoading();
        util.showModal('设备未响应，是否重新发送指令？', () => {
          this.log('手动重发ctrl')
          wx.showLoading({
            title: '开锁中',
          })
          _ctrl(_operateType);
        },() => {
          this.end(()=>{
            _callBack && _callBack(false);
          });
        })
      }
    },5000)
  }

  const _stopBluetoothDevicesDiscovery = () => {
    wx.stopBluetoothDevicesDiscovery({
      success: (res) => {
        this.log('停止搜寻附近的蓝牙外围设备');
      },
      fail: (err) => {
        this.log(err.errMsg);
      }
    })
  }

  const _closeBluetoothAdapter = () => {
    wx.closeBluetoothAdapter({
      success: (res) => {
        this.log('关闭蓝牙适配器')
      },
      fail: (err) => {
        this.log(err.errMsg);
      }
    })
  }

  const _initBluetooth = (cb) => {
    wx.openBluetoothAdapter({
      success: (res) => {
      },
      fail: (err) => {
        this.log('initBluetooth:', err.errMsg);
        wx.showToast({
          title: '蓝牙初始化失败',
          icon: 'none',
        })
      },
      complete: () => {
        cb && cb();
      }
    })
  }

  this.log = (...str) => {
    let now = new Date();
    now = util.formatTime(now)
    console.log(now , ...str);
    _logList.push(str.join(','))
  }
}

module.exports = BluetoothOperate