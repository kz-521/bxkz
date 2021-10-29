

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    flag: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 遮罩层显示
    show: function () {
      this.setData({
        flag: false
      })
    },
    // 遮罩层隐藏
    cancel: function () {
      this.setData({
        flag: true
      })

    },
  }
})

