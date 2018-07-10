var IP = require('../../IP/IP.js')
Page({
    data: {
        navbar: [],
        currentTab: 0,
        IP: "",
        FileIP: "",
        cinema_data: [],
        all_cinema_data:[],
        newDate:[]
    },
    onLaunch: function () {
        wx.login({
            success: function (res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: 'https://test.com/onLogin',
                        data: {
                            code: res.code
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
    },
    onLoad: function (options) {
        this.setData({
            IP: IP.ServerIP,
            FileIP: IP.FileIP
        })
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            mask: true
        }) 
        wx.request({
            url: this.data.IP + '/match/find',
            data: { film: options.id,submitType: "findJoin", ref: ["film",'cinema']},
            success: ((res) => {
                // 动态修改标题
                wx.setNavigationBarTitle({
                    title: res.data[0].film[0].film_name//页面标题为路由参数
                })

                console.log(res.data)
                let cinema_data=[];
                let film_date=[];
                for(let item of res.data){
                    cinema_data.push({ date: item.date, cinema: item.cinema[0]})
                    if(film_date.indexOf(item.date)==-1){
                        film_date.push(item.date)
                    }
                }
                console.log(film_date)
                // 时间排序
                for(let i=0;i<film_date.length-1;i++){
                    for(let j=i+1;j<film_date.length;j++){
                        if (parseInt(film_date[i].replace(/-/g, '')) > parseInt(film_date[j].replace(/-/g, ''))){
                            let temp = film_date[i];
                            film_date[i] = film_date[j];
                            film_date[j]=temp;
                        }
                    }
                }
                // 去除小于当前时间的信息
                // let nowTime = this.getNowTime();
                // for (let i=0;i<film_date.length;i++){
                //     if (parseInt(film_date[i].replace(/-/g, '')) < parseInt(nowTime.replace(/-/g, ''))){
                //         film_date.splice(i,1);
                //         i--;
                //     }
                // }
                console.log(film_date)
                console.log(cinema_data)
                // 同一日期、同一影院剔重
                for(let i=0;i<cinema_data.length-1;i++){
                    for(let j=i+1;j<cinema_data.length;j++){
                        console.log(111)
                        if(cinema_data[i].date==cinema_data[j].date){
                            if (cinema_data[i].cinema._id == cinema_data[j].cinema._id){
                                console.log(cinema_data[i].cinema._id, 9999999)
                                cinema_data.splice(j,1);
                            }
                        }
                    }
                }
                this.setData({
                    all_cinema_data: cinema_data
                })

                
                for (let i=0;i<cinema_data.length;i++){
                    if (film_date[0] != cinema_data[i].date){
                        cinema_data.splice(i,1)
                        i--
                    }
                }

                console.log(cinema_data)
                this.setData({
                    navbar:film_date,
                    cinema_data
                })
                this.changeTime();
                wx.hideToast()
            })
        })
    },
    navbarTap: function (e) {
        this.setData({
            currentTab: e.currentTarget.dataset.idx
        })
        let cinema_data=[];
        console.log(this.data.navbar[e.currentTarget.dataset.idx],'这里')
        for (let item of this.data.all_cinema_data) {
            if (this.data.navbar[e.currentTarget.dataset.idx] == item.date) {
                cinema_data.push(item)
            }
        }
        console.log(cinema_data,'1111111111')
        this.setData({
            cinema_data
        })
    },
    changeTime(){
        // 获取当前时间
        let nowTime=this.getNowTime();
        console.log(nowTime,11111111)
        let changeDate=[]
        for(let item of this.data.navbar){
            if (item == nowTime){
                changeDate.push({
                    week: '今天',
                    date: item.split('-')[1] + '月' + item.split('-')[2]+'日'
                })
            }else{
                changeDate.push({
                    week: this.getMyDay(new Date(item)),
                    date: item.split('-')[1] + '月' + item.split('-')[2] + '日'
                })
            }
        }
        console.log(changeDate)
        this.setData({
            newDate: changeDate
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
    //获取当前时间
    getNowTime(){
        let nowTime;
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        if (parseInt(month) <= 9) {
            month = '0' + month;
        }
        let date = new Date().getDate();
        if (parseInt(date) <= 9) {
            date = '0' + date;
        }
        return nowTime = year + "-" + month + "-" + date;
    }
})