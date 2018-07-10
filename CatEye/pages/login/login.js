var IP = require('../../IP/IP.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        IP: "",
        FileIP: "",
    },
    canGetUserInfo() {
        var that =this;
        // 存用户信息
        let url = that.options.url;
        let filmId=that.options.filmId;
        wx.getSetting({
            success: function(res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        success: function(res) {
                            console.log(JSON.parse(res.rawData).nickName)
                            let nickName = JSON.parse(res.rawData).nickName;
                            wx.request({
                                url: that.data.IP+'/users/find',
                                data: {
                                    nickName
                                },
                                success: ((res) => {
                                    let id;
                                    if (res.data.length != 1) {
                                        wx.request({
                                            url: that.data.IP +'/users/add',
                                            data: {
                                                nickName
                                            },
                                            success: ((res) => {
                                                id = res.data;
                                            })
                                        })
                                    } else {
                                        console.log(res.data[0]._id, 1111)
                                        id = res.data[0]._id
                                    }
                                    wx.setStorage({
                                        key: 'userId',
                                        data: id,
                                    })
                                    
                                    wx.redirectTo({
                                        url: `../${url}/${url}?id=${id}`,
                                    })
                                })
                            })
                        }
                    })
                }else{
                    wx.navigateBack({ changed: true })
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            IP: IP.ServerIP,
            FileIP: IP.FileIP
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})