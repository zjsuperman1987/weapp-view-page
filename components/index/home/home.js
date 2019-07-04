// components/index/home/home.js
// js文件
var sy;//记录手指的y坐标
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    swiperStart: {
      type: Boolean,
      value: false
    },
    swiperTest: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    data: ['习近平接受俄罗斯主流媒体联合采访', '中国两天连发三条预警后，美国有人坐不住了', '陨落的中国山寨之王：四年倒闭6000家店，它当年靠仿苹果风靡一时', '华为鸿蒙系统页面首次亮相！用户：美到可放弃安卓了', '毕业后不回校看老师，基本都是这4类人，班主任：看在眼里', '教育部统计：严重饱和三大专业，头铁还在挤，毕业就失业', '破谣言！华为高管亲测5G网速，下载速率超过1Gb/s', '以史为鉴：日本芯片产业由盛转衰中国应该怎么发展？', '外媒：联邦快递错运华为包裹是因应对美国政府新规所致'],
    desc: '下拉刷新',//刷新提示语
    hei: 0,//刷新view高度阈值
    scrolltop: 0,//scorll-view滑动离顶部的距离
    isindrag: false//是否在下拉状态（必须要滑动到顶部才能触发）
  },

  /**
   * 组件的方法列表
   */
  methods: {
    start(e) {
      // console.log(this.properties.swiperStart, this.data.swiperStart);
      //记录手指触摸是的y坐标
      sy = e.touches[0].clientY
      this.data.startX = e.touches[0].clientX;
      // console.log('开始触摸 sy : ' + sy + ' scrolltop : ' + this.data.scrolltop)
    },
    move(e) {
      //计算手指滑动的距离
      var delta = e.touches[0].clientY - sy
      var deltaX = e.touches[0].clientX - this.data.startX;
      // console.log('delta : ' + delta)
      if (Math.abs(deltaX) > 10 || this.properties.swiperStart) {
        return;
      }
      //scorll-view滑动到顶部且继续向上滑动时，走scorll-view滑动流程
      if (this.data.hei <= 0 && delta <= 0) {
        return
      }
      //scorll-view已经滑动到顶部，继续下拉进入下拉状态
      if (this.data.scrolltop <= 0) {
        if (this.data.isindrag == false) {
          this.setData({
            isindrag: true
          })
        }
        var tempdelta = 0
        // console.log('hei : ' + this.data.hei)
        if (delta > 0) {//手指向下滑动
          if (this.data.hei > 50) {//触发阈值，更改状态
            this.setData({
              desc: '松开刷新'
            })
            tempdelta = this.data.hei + delta / (this.data.hei - 50)//增大下拉阻尼感
          } else {
            this.setData({
              desc: '下拉刷新'
            })
            //手指移动未到阈值，按正常滑动增加高度
            tempdelta = this.data.hei + delta
          }
        } else {//手指向上滑动
          tempdelta = this.data.hei + delta
          //刷新状态view最小为0
          if (tempdelta <= 0) {
            tempdelta = 0
          }
          this.setData({
            desc: '下拉刷新'
          })
        }
        //滑动完成设置刷新view高度
        this.setData({
          hei: tempdelta
        })
      }
      //每次滑动事件后记录y坐标
      sy = e.touches[0].clientY
    },
    end(e) {
      var that = this;
      // console.log('手指离开')
      //手指离开时，如果阈值大于等于50，则触发刷新
      if (this.data.hei >= 50) {
        this.setData({
          desc: '正在刷新...'
        })
        this.setData({
          hei: 50
        })
        //模拟耗时操作，2秒后恢复正常状态
        setTimeout(function () {
          sy = 0
          that.setData({
            desc: '下拉刷新',
            hei: 0,
            isindrag: false,
            scrolltop: 0
          })
        }, 2000)
      } else {//未下拉到阈值，松开时则收起刷新view
        sy = 0
        that.setData({
          desc: '下拉刷新',
          hei: 0,
          isindrag: false,
          scrolltop: 0
        })
      }
    },
    scorll(e) {
      //未进入下拉状态时，记录scorll-view滑动距离顶部的距离
      var st = e.detail.scrollTop
      // console.log('滚动 st : ' + st)
      if (this.data.isindrag == false) {
        this.setData({
          scrolltop: st
        })
      }
    }
  }
})