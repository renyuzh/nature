// pages/myteam/myteam.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myteams:[]
  },

  navToTdetail:function(e) {
    let tid = e.currentTarget.dataset.tid;
    wx.navigateTo({
      url: '/pages/tdetail/tdetail?tid='+tid,
    })
  },

  getMyTeam:function(uid){
    let _this = this;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getmyteam&uid='+uid,
      method:'GET',
      header:{},
      success:function(res) {
        _this.setData({
          myteams:res.data
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.getMyTeam(options.uid);
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