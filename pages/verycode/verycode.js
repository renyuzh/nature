// pages/verycode/verycode.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form:{
      PhoneNUM:'',
      VeryCode:''
    },
    notSend:true
  },

  inputedit:function(e){
    let _this = this;
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value;
    _this.data[dataset.obj][dataset.item] = value;
    _this.setData({
      obj:_this.data[dataset.obj]
    });
  },

  sendVeryCode:function(){
    let _this = this;
    if(_this.data.form.PhoneNUM.length < 11){
      wx.showToast({
        title: '手机号无效',
        icon:'none',
        duration:2000
      });
      return;
    }
    _this.setData({
      notSend:false
    });
    let reqdata = {};
    reqdata.a = "getverycode";
    reqdata.pnum = _this.data.form.PhoneNUM;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx',
      method:'GET',
      header:{},
      data:reqdata,
      success:function(res){ 
        wx.setStorageSync('NEuvcode', res.data.message);
        wx.showToast({
          title: '发送成功',
          icon:'success',
          duration:1000
        });
      }
    });
  },

  login:function(){
    let _this = this;

    let nevcode = wx.getStorageSync('NEuvcode');
    if(nevcode != _this.data.form.VeryCode){
      wx.showToast({
        title: '验证码错误',
        icon:'none',
        duration:2000
      });
      return;
    }

    let reqdata = {};
    reqdata.pnum = _this.data.form.PhoneNUM;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getuserinfobyphone',
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
            title: '登录失败',
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