var IP = require('../../IP/IP.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      IP: "",
      FileIP: "",
      filmArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.showToast({
          title: '加载中',
          icon: 'loading',
          mask: true
      })
      this.setData({
          IP: IP.ServerIP,
          FileIP: IP.FileIP
      })
    wx.request({
        url: this.data.IP + '/users/find',
        data: {
            _id: wx.getStorageSync('userId'),
            submitType: "findJoin",
            ref: ["film"]
        },
        success: ((res) => {
            for(let item of res.data.film){
                item.film_bill[0] = item.film_bill[0].replace(/\\/g,'/')
            }
            this.setData({
                filmArr:res.data.film
            })
            console.log(this.data.filmArr)
            wx.hideToast()
        })
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
      this.onLoad();
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