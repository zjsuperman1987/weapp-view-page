//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    titles: ['首页', '热点', '热门推荐'],
    current: 0
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
  },
  titleTap(e) {
    this.setData({
      current: e.target.dataset.index
    })
  },
  swiperChange(e) {
    this.setData({
      current: e.detail.current,
    })
  },
  swiperTransition(e) {
    let start = this.data.titleLineTranslate;
    let ratio = 125 / 375;
    let moveX = start + e.detail.dx * ratio;
    this.data.animation.translate3d(moveX, 0, 0).step();
    this.setData({
      titleAnimationData: this.data.animation.export()
    })
    console.log(e.detail.dx);
  },
  swiperTransitionFinish() {
    this._getPosition();

  }
})