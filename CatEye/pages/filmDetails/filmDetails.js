var IP = require('../../IP/IP.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        IP: "",
        FileIP: "",
        filmDetails_info: {},
        hiddenFlag: true,
        imglist: [],
        wantFlag: false,
        filmType:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        this.setData({
            IP: IP.ServerIP,
            FileIP: IP.FileIP
        })
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            mask: true
        }) 
        // 请求电影 
        wx.request({
            url: this.data.IP + '/film/find',
            data: {
                _id: this.options.id, findType: 'exact', submitType: "findJoin", ref: ["film_comment"]
            },
            success: ((res) => {
                res.data.film_act_img = res.data.film_act_img.join('$').replace(/\\/g, '/').split('$');
                res.data.film_imgs = res.data.film_imgs.join('$').replace(/\\/g, '/').split('$');
                res.data.film_dir_img[0] = res.data.film_dir_img[0].replace(/\\/g, '/');
                res.data.film_bill[0] = res.data.film_bill[0].replace(/\\/g, '/');
                res.data.film_actor = res.data.film_actor.split(',');
                res.data.film_role = res.data.film_role.split(',');
                if (res.data.film_comment) {
                    for (let i = 0; i < res.data.film_comment.length; i++) {
                        res.data.film_comment[i].head_img = res.data.film_comment[i].head_img.replace(/\\/g, '/');
                    }
                }
                this.setData({
                    filmDetails_info: res.data,
                    imglist: res.data.film_imgs.map(item => this.data.FileIP + item),
                    filmType: this.options.type
                })
                wx.hideToast()
            })
            
        })
        // 是否为想看的电影
        wx.request({
            url: this.data.IP + '/users/find',
            data: {
                _id: wx.getStorageSync("userId")
            },
            success: ((res) => {
                if (res.data.film){
                    if (res.data.film.indexOf(this.options.id) > -1) {
                        this.setData({
                            wantFlag: true
                        })
                    }
                }
                
                
            })
        })
        // 
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
    onReady: function () {},
    display_text() {
        this.setData({
            hiddenFlag: !this.data.hiddenFlag
        })
    },
    previewImage: function (e) {
        var current = e.target.dataset.src;
        wx.previewImage({
            current: current, // 当前显示图片的http链接  
            urls: this.data.imglist // 需要预览的图片http链接列表  
        })
    },
    //   点击想看
    clickWant(e) {
        this.setData({
            wantFlag: !this.data.wantFlag
        })
        // wantFilms
        if (this.data.wantFlag) {
            wx.request({
                url: this.data.IP + '/users/update',
                data: {
                    _id: wx.getStorageSync("userId"),
                    film: e.currentTarget.id,
                    isPush:true
                },
                success: ((res) => {
                })
            })
            wx.showToast({
                title: '已标记想看',
                icon: 'success',
                duration: 1500
            })
        } else {
            wx.request({
                url: this.data.IP + '/users/find',
                data: {
                    _id: wx.getStorageSync("userId")},
                success: ((res) => {
                    wx.request({
                        url: this.data.IP + '/users/update',
                        data: {
                            _id: wx.getStorageSync("userId"),
                            film: res.data.film.filter(item => item != e.currentTarget.id)
                        },
                        success: ((res) => {
                        })
                    })
                })
            })
            wx.showToast({
                title: '已取消想看',
                icon: 'success',
                duration: 1500
            })
        } 
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