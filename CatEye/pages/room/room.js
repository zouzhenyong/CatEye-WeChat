var IP = require('../../IP/IP.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navbar: [],
        IP: "",
        FileIP: "",
        currentTab: 0,
        eatData: [],
        filmData: [],
        clickFlag: [],
        filmIndex: 0,
        filmImgs: [],
        nowTickets: [],
        now_film_id: '',
        weeks: [],
        film_ids: [],
        current: 0
    },
    navbarTap: function (e) {
        this.setData({
            currentTab: e.currentTarget.dataset.idx
        })

        let nowTickets = [];
        for (let item of this.data.filmData) {
            if (item.film[0]._id == this.data.now_film_id) {
                if (this.data.navbar[e.currentTarget.dataset.idx] == parseInt(item.date.split('-')[1]) + '月' + parseInt(item.date.split('-')[2]) + '日') {
                    nowTickets.push(item)
                }
            }
        }
        // 排序
        this.sortTime(nowTickets, 'start_time', ":");
        // let weeks = this.changeTime(now_film_date);
        this.setData({
            nowTickets,
            // clickFlag: newData,
            // filmIndex: e.currentTarget.dataset.idx,
            // // navbar: now_film_date,
            // // weeks,
            // now_film_id: this.data.film_ids[e.currentTarget.id],
            // saleFlag: false
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            IP: IP.ServerIP,
            FileIP: IP.FileIP
        })
        // this.options.id
        // 请求影院电影
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            mask: true
        })
        this.buyCard();
        wx.request({
            url: this.data.IP + '/match/find',
            data: { cinema: this.options.id, submitType: "findJoin", ref: ["film", 'cinema', 'room', 'seat'] },
            success: ((res) => {

                // // 动态修改标题
                // wx.setNavigationBarTitle({
                //     title: res.data[0].cinema[0].cinema_name//页面标题为路由参数
                // })

                let clickFlag = [];
                let filmImgs = [];
                let film_ids = [];
                let now_film_date = []
                let nowTickets = []
                for (let item of res.data) {
                    item.film[0].film_bill[0] = item.film[0].film_bill[0].replace(/\\/g, '/');
                    clickFlag.push(false);
                    item.film[0].film_type = item.film[0].film_type.split(',').splice(0, 1).join(',')
                    item.film[0].film_actor = item.film[0].film_actor.split(',').splice(0, 3).join(',');
                    if (item.film[0].film_actor.indexOf('·') >= 0) {
                        item.film[0].film_actor = item.film[0].film_actor.split(',').splice(0, 1)
                    }
                    if (item.film[0].film_area.indexOf('中国') >= 0) {
                        item.film[0].film_nd = '国语' + item.film[0].film_nd;
                    } else {
                        item.film[0].film_nd = '英语' + item.film[0].film_nd;
                    }
                    if (filmImgs.indexOf(item.film[0].film_bill[0]) == -1) {
                        filmImgs.push(item.film[0].film_bill[0])
                    }
                    if (film_ids.indexOf(item.film[0]._id) == -1) {
                        film_ids.push(item.film[0]._id)
                    }
                    // 日期
                    if (item.film[0]._id == film_ids[0]) {
                        now_film_date.push(parseInt(item.date.split('-')[1]) + '月' + parseInt(item.date.split('-')[2]) + '日');
                    }
                    now_film_date = [...new Set(now_film_date)] // 去重
                    this.sortDate(now_film_date); //排序
                }
                for (let item of res.data) {
                    // 票
                    if (item.film[0]._id == film_ids[0]) {
                        if (now_film_date[0] == parseInt(item.date.split('-')[1]) + '月' + parseInt(item.date.split('-')[2]) + '日') {
                            nowTickets.push(item)
                        }
                    }
                }
                // 排序
                this.sortTime(nowTickets, 'start_time', ":")
                clickFlag.splice(0, 1, true)
                let weeks = this.changeTime(now_film_date);
                this.setData({
                    filmData: res.data,
                    clickFlag,
                    filmImgs,
                    film_ids,
                    weeks,
                    navbar: now_film_date,
                    nowTickets,
                    now_film_id: film_ids[0]
                })
                wx.hideToast()
            })
        })

        // 请求小吃
        wx.request({
            url: this.data.IP + '/eatMean/find',
            data: {},
            success: ((res) => {
                for (let item of res.data) {
                    item.img = item.img.replace(/\\/g, '/');
                }
                this.setData({
                    eatData: res.data
                })
            })
        })
    },
    // 点击图片
    clickFimImg(e) {
        this.turnFilm(e.currentTarget.id)
        this.setData({
            current: e.currentTarget.id,
            currentTab: 0
        })
    },
    // 滑动图片
    changeImg(e) {
        this.turnFilm(e.detail.current)
    },
    // 点击选座
    selectSeat(e) {
        wx.navigateTo({
            url: '../seat/seat?seatData=' + JSON.stringify(this.data.nowTickets[e.currentTarget.id]) + "&&time=" + this.data.weeks[this.data.currentTab] + "&&date=" + this.data.navbar[this.data.currentTab],
        })
    },
    // 按时间排序
    sortTime(data, item, param) {
        for (let i = 0; i < data.length - 1; i++) {
            for (let j = i + 1; j < data.length; j++) {
                if (parseInt(data[j][item].replace(/param/g, '')) < parseInt(data[i][item].replace(/param/g, ''))) {
                    let temp = data[j];
                    data[j] = data[i];
                    data[i] = temp;
                }
            }
        }
    },
    sortDate(data) {
        for (let i = 0; i < data.length - 1; i++) {
            for (let j = i + 1; j < data.length; j++) {
                if (parseInt(data[i].replace(/月/, '').replace(/日/, '')) > parseInt(data[j].replace(/月/, '').replace(/日/, ''))) {
                    let temp = data[i];
                    data[i] = data[j];
                    data[j] = temp;
                }
            }
        }
    },
    // 获取星期几
    getMyDay(date) {
        var week;
        if (date.getDay() == 0) week = "周日"
        if (date.getDay() == 1) week = "周一"
        if (date.getDay() == 2) week = "周二"
        if (date.getDay() == 3) week = "周三"
        if (date.getDay() == 4) week = "周四"
        if (date.getDay() == 5) week = "周五"
        if (date.getDay() == 6) week = "周六"
        return week;
    },
    // 改变时间显示
    changeTime(data) {
        let weeks = [];
        // 获取当前时间
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let date = new Date().getDate();
        let nowTime = parseInt('' + year + month + date)
        for (let i = 0; i < data.length; i++) {
            let changeWeek = parseInt(2018 + data[i].replace(/月/, '').replace(/日/, ''));
            if (changeWeek == nowTime) {
                weeks.push('今天');
            }
            // 隐藏已过期的电影
            // } else if (changeWeek < nowTime) {
            //     data.splice(i,1)
            //     i--
            // }else{
            else {
                let weekArr = ('2018' + '-' + data[i].replace(/月/, '-').replace(/日/, '')).split('-');
                if (weekArr[1] <= 9) {
                    weekArr.splice(1, 1, 0 + weekArr[1])
                }
                weeks.push(this.getMyDay(new Date(weekArr.join('-'))))
            }

        }
        return weeks;
    },
    turnFilm(id) {
        let newData = [];
        for (let i = 0; i < this.data.clickFlag.length; i++) {
            this.data.clickFlag[i] = false;
            if (i == id) {
                this.data.clickFlag[i] = true;
            }
            newData.push(this.data.clickFlag[i]);
        }
        let now_film = [];
        let now_film_date = [];
        for (let item of this.data.filmData) {
            if (item.film[0]._id == this.data.film_ids[id]) {
                now_film_date.push(parseInt(item.date.split('-')[1]) + '月' + parseInt(item.date.split('-')[2]) + '日');
            }
        }
        now_film_date = [...new Set(now_film_date)] // 去重
        this.sortDate(now_film_date);// 排序

        let nowTickets = [];
        for (let item of this.data.filmData) {
            if (item.film[0]._id == this.data.film_ids[id]) {
                if (now_film_date[0] == parseInt(item.date.split('-')[1]) + '月' + parseInt(item.date.split('-')[2]) + '日') {
                    nowTickets.push(item)
                }
            }
        }
        // 排序
        this.sortTime(nowTickets, 'start_time', ":");
        let weeks = this.changeTime(now_film_date);
        this.setData({
            nowTickets,
            clickFlag: newData,
            filmIndex: id,
            navbar: now_film_date,
            weeks,
            now_film_id: this.data.film_ids[id]
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
        this.buyCard();
    },
    buyCard() {
        wx.request({
            url: this.data.IP + '/users/find',
            data: { _id: wx.getStorageSync('userId') },
            success: ((res) => {
                for (let item of res.data.cinema) {
                    if (item == this.options.id) {
                        this.setData({
                            saleFlag: true
                        })
                    }
                }
            })
        })
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