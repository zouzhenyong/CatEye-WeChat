var IP = require('../../IP/IP.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        x: 0,
        y: 0,
        IP: "",
        FileIP: "",
        selectedFlag: false,
        selectedSeat: [],
        userInfo: {},
        imgList: ['../../img/seat_01.png', '../../img/seat_02.png', '../../img/seat_03.png'],
        seatImgIndex: 0,
        matchData: [],
        date: '',
        time: '',
        seatId: '',
        price: 0,
        seat: [],
        ticketFlag: true,
        nickName: '',
        userId: wx.getStorageSync('userId'),
        ticketId:'',
        saleFlag:false
    },

    /**
     * 生命周期函数--监听页面加载
     */

    onLoad: function (options) {
        this.setData({
            IP: IP.ServerIP,
            FileIP: IP.FileIP
        })
        wx.request({
            url: this.data.IP + '/users/find',
            data: { _id: wx.getStorageSync('userId') },
            success: ((res) => {
                console.log(JSON.parse(options.seatData).cinema[0]._id)
                for (let item of res.data.cinema) {
                    if (item == JSON.parse(options.seatData).cinema[0]._id) {
                        this.setData({
                            saleFlag: true
                        })
                        console.log(this.data.saleFlag)
                    }
                }
            })
        })
        this.setData({
            matchData: JSON.parse(options.seatData),
            date: options.date,
            time: options.time,
            data: [],
            seat: JSON.parse(options.seatData).seat[0].seat,
            seatId: JSON.parse(options.seatData).seat[0]._id,
            price: JSON.parse(options.seatData).price
        })
        // 动态修改标题
        wx.setNavigationBarTitle({
            title: this.data.matchData.film[0].film_name //页面标题为路由参数
        })
    },
    clickSeat(e) {
        if (this.data.selectedSeat.length <= 4) {
            let nowSeat = e.currentTarget;
            let seatNum = nowSeat.dataset.seat;
            let col = seatNum[0];
            let row = seatNum[1];
            if (!nowSeat.dataset.flag && this.data.selectedSeat.length != 4) {
                this.data.seat[col][row] = '3';
                this.data.selectedSeat.push({
                    col,
                    row
                })
                this.setData({
                    ticketNum: this.data.ticketNum + 1
                })
            } else {
                this.data.seat[col][row] = '1';
                let data = this.data.selectedSeat;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].col == col && data[i].row == row) {
                        data.splice(i, 1)
                        i--
                    }
                }
                if (this.data.selectedSeat.length == 4) {
                    wx.showToast({
                        title: '一次性最多购买四张',
                        icon: 'none',
                        duration: 1500
                    })
                }
            }
            this.setData({
                seat: this.data.seat,
                selectedSeat: this.data.selectedSeat
            })
        }
    },
    // 取消购买
    delSeat(e) {
        let delArr = e.currentTarget.dataset.seat;
        for (let i = 0; i < this.data.selectedSeat.length; i++) {
            if (this.data.selectedSeat[i].col == delArr[0] && this.data.selectedSeat[i].row == delArr[1]) {
                this.data.selectedSeat.splice(i, 1);
                i--;
            }
        }
        this.data.seat[delArr[0]][delArr[1]] = 1;
        this.setData({
            selectedSeat: this.data.selectedSeat,
            seat: this.data.seat
        })
    },
    // 买票
    buyBtn() {
        var that = this;
        wx.showModal({
            title: `￥ ${this.data.saleFlag ? (this.data.price - 8) * this.data.selectedSeat.length : this.data.price * this.data.selectedSeat.length}`,
            content: '猫眼电影',
            confirmText: "确认支付",
            success: function (res) {
                if (res.confirm) {
                    let seat = that.data.seat;

                    for (let i = 0; i < seat.length; i++) {
                        for (let j = 0; j < seat[i].length; j++) {
                            if (seat[i][j] == '3') {
                                seat[i].splice(j, 1, '2')
                            }
                        }
                    }
                    let data = JSON.parse(that.options.seatData);
                    let myTickets = {
                        film_name: data.film[0].film_name,
                        cinema_name: data.cinema[0].cinema_name,
                        room_name: data.room[0].room_name,
                        date: that.options.date,
                        time: data.start_time,
                        seat: that.data.selectedSeat,
                        film_img: data.film[0].film_bill[0].replace(/\\/g, '/'),
                        price: that.data.saleFlag?(data.price-8):data.price,
                        cinemaId: data.cinema[0]._id
                    }
                    // 购买电影 

                    // 保存我的订单
                    wx.request({
                        url: that.data.IP + '/tickets/add',
                        data: myTickets,
                        success: ((res) => {
                            // 存订单id
                            wx.request({
                                url: that.data.IP + '/users/update',
                                data: {
                                    _id: that.data.userId,
                                    tickets: res.data,
                                    isPush: true
                                },
                                success: ((res) => {
                                })
                            })
                        })
                    })
                    wx.request({
                        url: that.data.IP + '/seat/update',
                        data: {
                            _id: that.data.seatId,
                            seat: that.data.seat
                        },
                        success: ((res) => {
                            that.setData({
                                seat,
                                selectedSeat: [],
                            })
                            wx.showToast({
                                title: '购票成功！',
                                duration: 3000
                            })
                            let id = wx.getStorageSync('userId');
                            let timer = setTimeout(function () {
                                wx.redirectTo({
                                    url: '../myTickets/myTickets?id='+id,
                                })
                            }, 1500)
                            
                        })
                    })
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