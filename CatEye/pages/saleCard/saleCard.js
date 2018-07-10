var IP = require('../../IP/IP.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:true,
    IP: "",
    FileIP: "",
    cinemaData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          IP: IP.ServerIP,
          FileIP: IP.FileIP
      })
    console.log(options.cinemaId)
    wx.request({
        url: this.data.IP + '/cinema/find',
        data: { _id: options.cinemaId},
        success: ((res) => {
            console.log(res.data)
            this.setData({
                cinemaData: res.data
            })
        })
    })
  },
    clickCheck(e){
        this.setData({
            checked:!this.data.checked
        })
    },
    buyBtn(){
        var that=this;
        wx.showModal({
            title: '￥ 38.00',
            content: '猫眼电影',
            confirmText:"确认支付",
            success: function (res) {
                if (res.confirm) {
                    console.log(wx.getStorageSync('userId'), '用户')
                    wx.request({
                        url: that.data.IP+'/users/update',
                        data: { _id: wx.getStorageSync('userId'), cinema: that.data.cinemaData._id, isPush: true },
                        success: ((res) => {
                            console.log(res.data)
                            that.setData({
                                cinemaData: res.data
                            })
                        })
                    })
                    wx.showToast({
                        title: '购卡成功',
                        icon: 'success',
                        duration: 2000
                    })
                    let timer = setTimeout(function () {
                        wx.navigateBack({ changed: true })
                        clearTimeout(timer)
                    }, 1500)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})