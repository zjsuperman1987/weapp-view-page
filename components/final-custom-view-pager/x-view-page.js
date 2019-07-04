// components/final-custom-view-pager/x-view-page.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    headerItemWidth: {
      type: String,
      value: "",
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    titles: ['首页', '热点', '热门推荐', '我爱我家', '我的资产'],
    current: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onHeaderItemWidthChange(newVal, oldVal) {
      console.log("newVal: " + newVal, " oldVal: " + oldVal);
      this.setData({
        componentHeaderStyle: 'width: ' + newVal
      })
      console.log(this.data)
    },
    // 头部点击
    titleTap(e) {
      console.log(e)
      this.setData({
        current: e.target.dataset.index
      })
    },

    // 内容 swiper
    _onSwiperChange(e) {
      this.setData({
        current: e.detail.current
      })
    }
  },
  ready() {
    var that = this;
    _getDomProperties('.header-item', {
      'size': true
    }, this, function(res) {
      that.setData({
        titleWidth: res
      })
    });
    _getDomProperties('.header-font', {
      'size': true
    }, this, function(res) {
      that.setData({
        textWidth: res,
        bottomLineWidth: res[0].width
      })

    });
    // 计算 bottomline transform 位置 数组
    setTimeout(() => {
      this.setData({
        bottomLineTranslateX: (this.data.titleWidth[0].width - this.data.textWidth[0].width) / 2
      })
    }, 100)


  },
});

function _getDomProperties(className, sproperties, pageObj, fn) {
  let query = wx.createSelectorQuery().in(pageObj).selectAll(className).fields({
    ...sproperties
  }, res => {
    fn(res);
  }).exec();

}