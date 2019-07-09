// components/test-slot/test-slot.js
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

    /**
   * 组件的初始数据
   */
  data: {
    titles: ['首页', '喜欢', '推荐', '我爱我家']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 触摸开始
    _onSwiperTouchStart(e) {
      this.setData({
        previewSwiperIndex: e.currentTarget.dataset.index
      })
    },
    // 过度
    _onTransition(e) {
      let targetIndex
      if (e.detail.dx > 0) {
        targetIndex = this.data.previewSwiperIndex + 1;
        targetIndex = targetIndex === this.data.titles.length ? targetIndex - 1 : targetIndex;
      }else {
        targetIndex = this.data.previewSwiperIndex - 1;
        targetIndex = targetIndex === -1 ? 0 : targetIndex;
      }

      
    },
    // 过度结束 
    _onSwiperFinish(e) {
      let className;
      if (e.detail.current > this.data.previewSwiperIndex) {
        className = 'bottom-line-right'  
      }else {
        className = 'bottom-line-left'  
      }
      this.setData({
        blposition: className,
        blwidth: this.data.textArr[e.detail.current]
      })
    }
  },
  ready() {
    console.log('我进来了swiper的ready')

    // 计算头部 各项宽度
    let query = wx.createSelectorQuery().in(this);
    let tempTitleArr, tempTextArr;

    query.selectAll('.header-item').fields({
      size: true
    }, res => {
       tempTitleArr = res.map((item) => {
        return item.width;
      })
    }).exec((res) => {
      query.selectAll('.header-text').fields({
        size: true
      }, res => {
        tempTextArr = res.map((item) => {
          return item.width;
        })
        this.setData({
          titleArr: tempTitleArr,
          textArr: tempTextArr,
          blwWidth: tempTitleArr[0] + tempTextArr[1],
          blwTranslate: (tempTitleArr[0] - tempTextArr[0]) / 2,
          blwidth: tempTextArr[0],
        })
      }).exec();  
    });
    


  }
})
