var IP=require('../../IP/IP.js')
Page({
    data: {
        IP: "",
        FileIP: "",
        cinema_data: {}
    },
    onLoad: function () {
        this.setData({
            IP: IP.ServerIP,
            FileIP:IP.FileIP
        })
        // 请求影院
        wx.request({
            url: IP.ServerIP + '/cinema/find',
            data: {},
            success: ((res) => {
                this.setData({
                    cinema_data: res.data
                })
            })
        })
    },
    search(){
        wx.navigateTo({
            url: '../search/search?type=cinema',
        })
    }
})