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
      let current = e.detail.source === 'touch' ? e.detail.current : this.data.current
      this.setData({
        current: current
      })
    }
  },
  ready() {
    let that = this,
        query = wx.createSelectorQuery().in(this);

    query.selectAll('.header-item').fields({
      size: true
    }, res => {
      that.setData({
        titleWidth: res
      })
    }).exec(function () {
      query.selectAll('.header-font').fields({
        size: true
      }, res => {
        that.setData({
          textWidth: res,
          bottomLineWidth: res[0].width
        })
      }).exec(function () {
        let bltranslateX = (that.data.titleWidth[0].width - that.data.textWidth[0].width) / 2;

        that.setData({
          bottomLineTranslateX: bltranslateX
        })
      });
    });
  }
})