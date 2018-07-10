var IP = require('../../IP/IP.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchType: '',
        IP: "",
        FileIP: "",
        filmData: [],
        cinemaData: [],
        dataFlag:true
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            searchType: options.type,
            IP: IP.ServerIP,
                FileIP: IP.FileIP
        })
    },
    // 返回
    clickBack() {
        wx.navigateBack({
            changed: true
        })
    },
    // 开始搜索
    search(e) {
        let content = e.detail.value;
        if (content) {
            // 影视
            if (this.options.type == "film") {
                wx.request({
                    url: this.data.IP + '/film/find',
                    data: {
                        film_name: content
                    },
                    success: ((res) => {
                        console.log(res.data)
                        for(let item of res.data){
                            item.film_bill[0]=item.film_bill[0].replace(/\\/g,'/')
                        }
                        // 转图片
                        this.setData({
                            filmData: res.data
                        })
                        if (res.data.length==0) {
                            this.setData({
                                dataFlag: false
                            })
                        }
                    })
                })
            }
            // 影院
            if (this.options.type == "film" || this.options.type == "cinema") {
                wx.request({
                    url: this.data.IP + '/cinema/find',
                    data: {
                        cinema_name: content
                    },
                    success: ((res) => {
                        console.log(res.data)
                        this.setData({
                            cinemaData: res.data
                        })
                        if(res.data.length==0){
                            console.log('进来了')
                            this.setData({
                                dataFlag: false
                            })
                        }
                    })
                })
            }
        }
        if(content==""){
            this.setData({
                filmData: [],
                cinemaData: [],
                dataFlag: true
            })
        }
        
    },
    // 购买
    buy_ticket(e) {
        wx.navigateTo({
            url: '../film_cinema/film_cinema?id=' + e.currentTarget.id
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