let app = getApp()
let util = require('../../utils/util')
Page({
  data: {
    studentAuthImg: '../../images/studentAuth/image.png',
    picture: []
  },
  onLoad: function () {
    app.globalData.userTrack.push(['/studentAuth','/学生认证']);
  },
  upImg: function (e) {
    let that = this;

    wx.chooseImage({
      count: 1, //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        console.log(res.tempFilePaths);

        that.setData({
          studentAuthImg: res.tempFilePaths,
          picture: res.tempFilePaths
        });

      }
    });

  },

  toAgreement: function(){
    wx.navigateTo({
      url: '../agreement/agreement',
    })
  },

  formSubmit: function (e) {
    let that = this;
    let name = e.detail.value.name;
    let studentNO = e.detail.value.studentNO;
    let reason = e.detail.value.reason;
    let picture = that.data.picture;

    if (e.detail.value.agreement.length == 0){
      wx.showToast({
        icon: 'none',
        title: '请仔细阅读协议并勾选！',
      })
      return;
    }

    if (name.length == 0 || studentNO.length == 0 ) {
      wx.showToast({
        icon: 'none',
        title: '您还有必选项没有输入！',
      })
    } else if (picture.length == 0){
      wx.showToast({
        icon: 'none',
        title: '请选择上传图片！',
      })
    }else {
      util.showLoadingTrue('请稍候')
      app.checkToken(function (token) {
        if (token.length > 0) {

          wx.uploadFile({
            url: app.globalData.baseUrl + 'studentAuth/apply.do',
            filePath: picture[0],
            name: 'imageFiles',
            header: {
              "Content-Type": "multipart/form-data"
            },
            formData: {
              name: name,
              studentNO: studentNO,
              reason: reason,
              token: token,
              machineNO: app.globalData.machineNO
            },
            success: function (resp) {
              let res = JSON.parse(resp.data);
              console.log(res);
              if (res.ret) {

                wx.hideLoading();

                util.showModal('已提交审核，在此期间无法用车，还请耐心等待!',
                  function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                )

              } else {
                wx.hideLoading();
                that.setData({
                  studentAuthImg: '../../images/studentAuth/image.png',
                  picture: []
                });
                util.showModal(res.msg);
              }

            },
            fail: function (res) {
              wx.hideLoading();
              util.showModal(JSON.stringify(res));
              console.log('错误信息：' + res);
            },
            complete: function () {

            }
          });
        }
      });


    }


  }
});