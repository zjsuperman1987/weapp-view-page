  // components/custom-scroll-view/x-scroll-view.js
  Component({
    options: {
      multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的属性列表
     */
    properties: {
      pullText: {
        type: String,
        value: '下拉可以刷新',
      },
      releaseText: {
        type: String,
        value: '松开立即刷新',
      },
      loadingText: {
        type: String,
        value: '正在刷新数据中',
      },
      finishText: {
        type: String,
        value: '刷新完成',
      },
      loadmoreText: {
        type: String,
        value: '正在加载更多数据',
      },
      nomoreText: {
        type: String,
        value: '已经全部加载完毕',
      },
      pullDownHeight: {
        type: Number,
        value: 60,
      },
      refreshing: {
        type: Boolean,
        value: false,
        observer: '_onRefreshFinished',
      },
      nomore: {
        type: Boolean,
        value: false,
      },
      switchPullDownRefresh: {
        type: Boolean,
        value: true
      }
    },

    /**
     * 组件的初始数据
     */
    data: {
      pullDownStatus: 0,
      lastScrollEnd: 0,
      // type: 'android'
    },

    /**
     * 组件的方法列表
     */
    methods: {
      _onScroll: function(e) {
        this.triggerEvent('scroll', e.detail);
        if (!this.data.switchPullDownRefresh) return;

        const status = this.data.pullDownStatus;
        if (status === 3 || status == 4) return;
        const height = this.properties.pullDownHeight;
        const scrollTop = e.detail.scrollTop;
        let targetStatus;
        if (scrollTop < -1 * height) {
          targetStatus = 2;
        } else if (scrollTop < 0) {
          targetStatus = 1;
        } else {
          targetStatus = 0;
        }
        if (status != targetStatus) {
          this.setData({
            pullDownStatus: targetStatus,
          })
        }
      },

      _onTouchEnd: function(e) {
        const status = this.data.pullDownStatus;
        if (status === 2) {
          this.setData({
            pullDownStatus: 3,
          })
          this.properties.refreshing = true;
          setTimeout(() => {
            this.triggerEvent('pulldownrefresh');
          }, 500);
        }
      },

      _onRefreshFinished(newVal, oldVal) {
        if (oldVal === true && newVal === false) {
          this.properties.nomore = false;
          this.setData({
            nomore: false,
          })
          if (this.data.type === 'ios') {
            this.setData({
              pullDownStatus: 4,
              lastScerollEnd: 0,
            })
            setTimeout(() => {
              this.setData({
                pullDownStatus: 0,
              })
            }, 500);
          } else {
            this.data.animation.translate3d(0, 0, 0).step({
              duration: 300
            })
            this.setData({
              pullDownStatus: 4,
              className: 'icon-complete',
              animationData: this.data.animation.export()
            });
            setTimeout(() => {
              this.setData({
                pullDownStatus: 0,
                className: 'icon-pull-down',
                animationData: this.data.animation.export()
              })
            }, 300)
          }
        }
      },

      _onLoadmore() {
        if (!this.properties.nomore) {
          let query = wx.createSelectorQuery().in(this);
          query.select('.scroll-wrapper').fields({
            size: true,
            scrollOffset: true,
          }, res => {
            if (res.height !== this.data.lastScrollEnd) {
              this.setData({
                lastScrollEnd: res.height,
              })
              this.triggerEvent('loadmore');
            }
          }).exec();
        }
      },

      /**
       * android
       */
      _onTouchStartAndroid(e) {
        this.setData({
          touchY: e.touches[0].pageY
        })
      },
      _onTouchMoveAndroid(e) {
        let moveY = e.touches[0].pageY - this.data.touchY;
        let deltaY = moveY ** .85 > 100 ? 100 : moveY ** .85;
        let status = this.data.pullDownStatus;
        let height = this.data.pullDownHeight;
        let targetStatus;
        let obj;
        if (status === 3 || status === 4) return;
        if (!this.data.switchPullDownRefresh) return;

        this.data.animation.translate3d(0, deltaY, 0).step();
        this.setData({
          animationData: this.data.animation.export()
        })
        targetStatus = deltaY > height ? 2 : 1;
        if (targetStatus !== status) {
          status = targetStatus;
        }

        this.setData({
          pullDownStatus: status,
          className: targetStatus === 2 ? 'icon-release-up' : 'icon-pull-down'
        })
      },
      _onTouchEndAndroid() {
        let status = this.data.pullDownStatus;
        let obj;
        if (status === 3 || status === 4) return;
        if (status === 2) {
          status = 3;
          this.data.animation.translate3d(0, 0, 0).step({
            duration: 300
          })
          this.setData({
            pullDownStatus: status,
            className: 'icon-loading loading',
            animationData: this.data.animation.export(),
          })
          this.properties.refreshing = true;
          this.triggerEvent('pulldownrefresh');
        } else {
          status = 1;
          this.data.animation.translate3d(0, 0, 0).step();
          this.setData({
            pullDownStatus: status,
            className: 'icon-pull-down',
            animationData: this.data.animation.export()
          })

          setTimeout(() => {
            this.setData({
              pullDownStatus: 0
            })
          })
        }
      }
    },
    ready() {
      console.log('我进 x-scroll-view 了')
      let systemInfo = wx.getSystemInfoSync(),
        regObj = new RegExp("ios", "gi"),
        systemType;

      systemType = regObj.test(systemInfo.system) ? "ios" : "android";

      if (systemType === 'android') {
        let animation = wx.createAnimation({
          duration: 0,
          timingFunction: 'linear'
        })
        console.log(this.data.type, '我是打印.........')
        this.setData({
          animation: animation,
          animationData: animation.export(),
          type: systemType
        })
        return;
      }
      this.setData({
        type: systemType
      })
      
    }
  })