// pages/final-index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  _onSwiperChange(e) {
    console.log(e, '...........');
    this.setData({
      current: e.detail.detail.current
    })
  }
})