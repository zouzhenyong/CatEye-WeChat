var IP = require('../../IP/IP.js')
var app = getApp()
Page({
    data: {
        navbar: ['热映', '待映'],
        currentTab: 0,
        wantFlag: false,
        IP: "",
        FileIP: "",
        hotFilm_data: {},
        comingFilm_data: {}
    },
    navbarTap: function (e) {
        this.setData({
            currentTab: e.currentTarget.dataset.idx
        })
    },
    onLoad: function () {
        console.log(IP.ServerIP,111111111111111111111)
        this.setData({
            IP: IP.ServerIP,
            FileIP: IP.FileIP
        })
        var that=this
        // 存用户信息
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        success: function (res) {
                            console.log(JSON.parse(res.rawData).nickName)
                            let nickName = JSON.parse(res.rawData).nickName;
                            wx.request({
                                url: that.data.IP+'/users/find',
                                data: { nickName},
                                success: ((res) => {
                                    if(res.data.length!=1){
                                        wx.request({
                                            url: that.data.IP+'/users/add',
                                            data: { nickName },
                                            success: ((res) => {
                                                wx.setStorage({
                                                    key: 'userId',
                                                    data: res.data,
                                                })
                                            })
                                        })
                                    }else{
                                        console.log(res.data[0]._id,1111)
                                        wx.setStorage({
                                            key: 'userId',
                                            data: res.data[0]._id,
                                        })
                                    }
                                })
                            })
                        }
                    })
                }
            }
        })
        // 请求热映
        wx.request({
            url: this.data.IP + '/hotFilm/find',
            data: { submitType: "findJoin", ref: ["film"] },
            success: ((res) => {
                for (let item of res.data) {
                    item.film[0].film_bill[0] = item.film[0].film_bill[0].replace(/\\/g, '/');
                }
                this.setData({
                    hotFilm_data: res.data
                })
                console.log(res.data)
            })
        })
        // 请求待映
        wx.request({
            url: this.data.IP + '/comingFilm/find',
            data: { submitType: "findJoin", ref: ["film"] },
            success: ((res) => {
                // 按时间排序
                for (let i = 0; i < res.data.length - 1; i++) {
                    for (let j = i + 1; j < res.data.length; j++) {
                        if (parseInt(res.data[i].film[0].film_time.replace(/-/g, '')) > parseInt(res.data[j].film[0].film_time.replace(/-/g, ''))) {
                            let temp = res.data[i];
                            res.data[i] = res.data[j];
                            res.data[j] = temp;
                        }
                    }
                }

                // 转换数据
                for (let item of res.data) {
                    // 保存原时间
                    item.film[0].film_old_date = item.film[0].film_time;
                    item.film[0].week = this.getMyDay(new Date(item.film[0].film_old_date))
                    item.film[0].film_bill[0] = item.film[0].film_bill[0].replace(/\\/g, '/');
                    item.film[0].film_time = parseInt(item.film[0].film_time.split("-")[1]) + "月" + parseInt(item.film[0].film_time.split("-")[2]) + "日"
                }

                // 获取当前时间
                let year = new Date().getFullYear();
                let month = new Date().getMonth() + 1;
                if(month<=9){
                    month='0'+month;
                }
                let date = new Date().getDate();
                if (date <= 9) {
                    date = '0' + date;
                }
                let nowTime = parseInt('' + year + month + date)

                // 去除小于当前时间的电影
                // res.data = res.data.filter(item =>{
                //    return parseInt(item.film[0].film_old_date.replace(/-/g, ''))>=nowTime
                // })

                this.setData({
                    comingFilm_data: res.data
                })

                for (let i = 0; i < res.data.length - 1; i++) {
                    for (let j = i + 1; j < res.data.length; j++) {
                        if (parseInt(res.data[i].film[0].film_want) < parseInt(res.data[j].film[0].film_want)) {
                            let temp = res.data[i];
                            res.data[i] = res.data[j];
                            res.data[j] = temp;
                        }
                    }
                }
                this.setData({
                    welcomeFilm_data: res.data
                })
            })
        })
    },
    // 想看
    clickWant(e){
        console.log(e.target.id)
            this.setData({
                wantFlag: !this.data.wantFlag
            })
            console.log(this.data.wantFlag)
    },
    // 搜索
    clickSearch(){
        wx.navigateTo({
            url: '../search/search?type=film',
        })
    },
    // 购买
    buy_ticket(e){
        wx.navigateTo({
            url: '../film_cinema/film_cinema?id=' + e.currentTarget.id
        })
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
})  