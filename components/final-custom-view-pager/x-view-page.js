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
    colors: {
      initStatusColor: '#202020',
      firstStatusColor: '#FF4500',
      secondStatusColor: '#FF7F50',
      thirdStatusColor: '#FF6A6A',
      endStatusColor: '#FF0000'
    },
    // firstStatusColor: '#F08080',
    // secondStatusColor: '#FF6347',
    // thirdStatusColor: '#FF4500',
    // endStatusColor: '#FF0000'
    current: 0,
    initLocked: false,
    middleLocked: false,
    middlePosition: false, // 记录是否划过中间位置
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onHeaderItemWidthChange(newVal, oldVal) {
      // console.log("newVal: " + newVal, " oldVal: " + oldVal);
      this.setData({
        componentHeaderStyle: 'width: ' + newVal
      })
      console.log(this.data)
    },
    // 头部点击
    titleTap(e) {
      let current = e.currentTarget.dataset.index;
      this.setData({
        current: current,
        titleTouch: true
      })
    },

    // 过度中
    _onTransition(e) {
      if (!this.data.titleTouch) {
        let dx = e.detail.dx;
        // 设置颜色
        this._setTitleColor(dx);
        // 设置 底边线 bottomLine
        this._setBottomLine(e, dx);
      }
    },
    // 结束
    _onAnimationFinish(e) {
      let bottomLineTranslateX = this.data.translateArr[e.detail.current],
        bottomLineWidth = this.data.textWidth[e.detail.current].width,
        titleColor = 'titleColor[' + e.detail.current + '].color';
      // 释放锁
      this.data.initLocked = false;
      this.data.middleLocked = false;
      this.data.middlePosition = false;
      
      this.data.animation.right(0).step();
      this.setData({
        animationData: this.data.animation.export()
      })
      this.data.animation.width(32).step({
        duration: 300
      });

      setTimeout(() => {
        this.setData({
          animationData: this.data.animation.export(),
          current: e.detail.current,
          titleTouch: false,
        })
      }, 2000)
      // 取消全命中
      for (let i = 0; i < this.data.titles.length; i++) {
        let color = 'titleColor[' + i + '].color';
        this.setData({
          [color]: this.data.colors.initStatusColor
        })
      }
      this.setData({
        [titleColor]: this.data.colors.endStatusColor,
      })
      setTimeout(() => {
        this.setData({
          moveId: 'header' + this.data.current
        })
      }, 300);
      // 调用上层方法
      // this.triggerEvent('swiperchange', e);
    },
    // 设置颜色
    _setTitleColor(delta) {
      let currentIndex, targetIndex;

      currentIndex = this.data.current;

      if (delta > 0) {
        targetIndex = currentIndex === this.data.titles.length ? currentIndex : currentIndex + 1;
      } else {
        targetIndex = currentIndex === 0 ? 0 : currentIndex - 1;
      }
      // 开始位移
      let currentColor = 'titleColor[' + currentIndex + '].color'
      let targetColor = 'titleColor[' + targetIndex + '].color'

      if (currentIndex !== targetIndex && !this.data.initLocked) {
        this.setData({
          [currentColor]: this.data.colors.firstStatusColor,
          [targetColor]: this.data.colors.secondStatusColor
        })
        this.data.initLocked = true;
      }
      // 位移到中间
      if (Math.abs(delta) > 375 / 2 && !this.data.middleLocked) {
        this.setData({
          [currentColor]: this.data.colors.thirdStatusColor,
          [targetColor]: this.data.colors.thirdStatusColor,
          middlePosition: true
        })
        this.data.middleLocked = true;
      } else {
        // 划过· 回退回来
        if (this.data.middlePosition && Math.abs(delta) < 375 / 2) {
          this.data.middleLocked = false;
          this.setData({
            [currentColor]: this.data.colors.firstStatusColor,
            [targetColor]: this.data.colors.secondStatusColor,
          })
        }
      }
    },
    // 设置底边线
    _setBottomLine(_e, delta) {
      let currentIndex, targetIndex;
      currentIndex = this.data.current;

      if (delta > 0) {
        targetIndex = currentIndex === this.data.titles.length ? currentIndex : currentIndex + 1;
      } else {
        targetIndex = currentIndex === 0 ? 0 : currentIndex - 1;
      }

      // 需要移动距离
      if (currentIndex !== targetIndex) {
        let translateArr = this.data.translateArr;
        let titlesWidth = this.data.titleWidth;
        let textsWidth = this.data.textWidth;
        let distanceX = Math.abs(translateArr[targetIndex] - translateArr[currentIndex]);
        // debugger;
        let wrapperWidth = titlesWidth[currentIndex].width + textsWidth[targetIndex].width;
        let wrapperTranslateIndex = Math.min(currentIndex,targetIndex);
        
console.log('过程...............')
        let move_width_ratio = .1;
        distanceX = distanceX * move_width_ratio;
        let titleX = (distanceX / 375) * delta;
        titleX = translateArr[currentIndex] + titleX;

        this.data.animation.width(80).step({
          duration: 300
        });
        this.data.animation.translate3d(titleX, 0, 0).step();
        this.setData({
          animationData: this.data.animation.export(),
          bottomLineWidth: wrapperWidth,
          bottomWrapperTranslate: translateArr[wrapperTranslateIndex],
          bottomLinePosition: currentIndex < targetIndex ? 'left' : 'right'
        })
      }
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
    }).exec(function() {
      query.selectAll('.header-font').fields({
        size: true
      }, res => {
        that.setData({
          textWidth: res,
        })
      }).exec(function() {
        // 计算位移位置
        let translateArr = [];
        let titleWidth = that.data.titleWidth;
        let textWidth = that.data.textWidth;
        for (let i = 0; i < titleWidth.length; i++) {
          if (i === 0) {
            let translateX = (titleWidth[0].width - textWidth[0].width) / 2;
            translateArr.push(translateX);
          } else {
            // 第二个开始等于第一个 位移 加上 1， 2 单边距离
            let translateX = translateArr[i - 1] + ((titleWidth[i - 1].width - textWidth[i - 1].width) / 2) + (titleWidth[i].width - textWidth[i].width) / 2 + textWidth[i - 1].width;
            translateArr.push(translateX);
          }
        }
        let animation = wx.createAnimation({
          duration: 0,
          timingFunction: 'linear'
        })

        animation.width(that.data.textWidth[0].width).step();
        that.setData({
          animation: animation,
          translateArr: translateArr,
          bottomLineWidth: titleWidth[0].width + textWidth[1].width,
          bottomWrapperTranslate: (titleWidth[0].width - textWidth[0].width) / 2,
          animationData: animation.export(),
          'titleColor[0].color': that.data.colors.endStatusColor
        })
      });
    });
  }
})