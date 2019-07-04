// pages/test/test.js

//获取应用实例
const app = getApp()

Page({
  data: {
    titles: ['首页', '热点', '热门推荐'],
    current: 0,
    titleColor: [{
      color: 'rgba(255, 0, 0)'
    }, {
      color: 'gray'
    }, {
      color: 'gray'
    }],
  },
  _getPosition() {
    wx.createSelectorQuery().select('.title-line').fields({
      rect: true
    }, res => {
      this.setData({
        titleLineTranslate: res.left
      })
    }).exec();
  },
  onLoad() {
    this.setData({
      animation: wx.createAnimation({
        duration: 0,
        timingFunction: 'linear'
      })
    });
    this._getPosition();
    wx.createSelectorQuery().select('.swiper').fields({
      size: true,
    }, res => {
      this.setData({
        swiperWidth: res.width
      })
    }).exec();
  },
  titleTap(e) {
    this.setData({
      current: e.currentTarget.dataset.index
    })
    console.log(this.data.current, e);
  },
  swiperChange(e) {
    this.setData({
      current: e.detail.current,
    })
  },
  swiperTransition(e) {
    this.setData({
      swiperStart: true,
    })
    let start = this.data.titleLineTranslate;
    let ratio = 125 / 375;
    let moveX = start + e.detail.dx * ratio;
    this.data.animation.translate3d(moveX, 0, 0).step();
    this.setData({
      titleAnimationData: this.data.animation.export()
    })
    console.log(e.detail.dx);
    // 滑动调整颜色
    var callColor = this._setTitleColor(e.detail.dx);
    callColor();
  },
  swiperTransitionFinish() {
    this.data.isLocked = false
    this.setData({
      swiperStart: false,
    })
    this._getPosition();
    // 调整颜色
    for (var i = 0; i < this.data.titles.length; i++) {
      let position = 'titleColor[' + i + '].color'
      this.setData({
        [position]: 'gray'
      })
    }
    var current = 'titleColor[' + this.data.current + '].color'
    this.setData({
      [current]: 'rgba(255, 0, 0)',
      firstStep: false,
      middleStep: false
    })

  },
  _setTitleColor(deltaX) {
    let currentTitleIndex,
      nextTitleIndex,
      that = this;

    return function() {
      if (!that.data.isLocked) {
        that.data.isLocked = true;
        currentTitleIndex = that.data.current;
        nextTitleIndex = currentTitleIndex + 1;

        that.data.nextTitleIndex =
          'titleColor[' + (currentTitleIndex + 1) + '].color'
        that.data.currentTitleIndex =
          'titleColor[' + currentTitleIndex + '].color'
      }
      console.log(deltaX, '是垃圾地方了手机发了手机发了是');
      if (deltaX > 0) { //右移
        let currentIndex = that.data.currentTitleIndex;
        let nextIndex = that.data.nextTitleIndex;
        if (!that.data.firstStep) {
          that.setData({
            [currentIndex]: 'rgba(255, 0, 0, .7)',
            [nextIndex]: 'rgba(255, 0, 0, .3)',
            firstStep: true
          })
        }


        if (deltaX > that.data.swiperWidth / 2) {
          if (!that.data.middleStep) {
            that.setData({
              [currentIndex]: 'rgba(255, 0, 0, .5)',
              [nextIndex]: 'rgba(255, 0, 0, .5)',
              middleStep: true
            })
          }
        } else {
          if (deltaX < that.data.swiperWidth / 2) {
            // debugger;
            if (that.data.middleStep && returnStep) {
              that.setData({
                [currentIndex]: 'rgba(255, 0, 0, .7)',
                [nextIndex]: 'rgba(255, 0, 0, .3)',
                middleStep: true,
                returnStep: true
              })
            }
          }
        }
      } else { //左移

      }
    }
  }

})