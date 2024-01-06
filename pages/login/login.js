// pages/login/login.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form:{
      username:"",
      password:""
    }
  },

  inputedit:function(e){
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value;
    this.data[dataset.obj][dataset.item] = value;
    this.setData({
      obj:this.data[dataset.obj]
    });
  },


  navToRegister:function(){
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },

  login:function(){
    let _this = this;
    let reqdata = {};
    reqdata.username = _this.data.form.username;
    reqdata.password = _this.data.form.password;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=userlogin',
      method:'GET',
      header:{},
      data:reqdata,
      success:function(res){
        if(res.data.length > 0){
          wx.setStorageSync('neftoken', res.data[0].LogonToken);
          app.globalData.neuserInfo = res.data[0];
          wx.navigateBack();
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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