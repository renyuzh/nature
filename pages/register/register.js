// pages/register/register.js

var app = getApp();

var base64 = require('../../libs/base64.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasSendRequest:false,
    form:{
      username:"",
      telephone:"",
      email:"",
      password:"",
      confirmpwd:""
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

  saveUserinfo:function(res){
    let _this = this;
    if(_this.data.hasSendRequest){
      wx.showToast({
        title: '正在注册，请耐心等待……',
        icon:'none',
        duration:2000
      });
      return;
    }
    _this.data.hasSendRequest = true;
    let userInfo = res.userInfo;
    if(_this.data.form.password != _this.data.form.confirmpwd){
      wx.showToast({
        title: '密码不一致',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if(_this.data.form.username == "" || _this.data.form.telephone == "" 
    || _this.data.form.email == "" || _this.data.form.password == "" ){
      wx.showToast({
        title: '信息未填写完毕',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    let reqdata = {};
    reqdata.username = _this.data.form.username;
    reqdata.telephone = _this.data.form.telephone;
    reqdata.email = _this.data.form.email;
    reqdata.password = _this.data.form.password;
    reqdata.avatar = userInfo.avatarUrl;
    reqdata.country = userInfo.country;
    reqdata.province = userInfo.province;
    reqdata.nickName = base64.encode(userInfo.nickName);
    reqdata.city = userInfo.city;
    switch(userInfo.gender){
      case 0:
        reqdata.gender = "未知";
        break;

      case 1:
        reqdata.gender = "男";
        break;

      case 2:
        reqdata.gender = "女";
        break;
    }
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=userregister',
      method:'GET',
      header:{},
      data:reqdata,
      success:function(res){
        _this.data.hasSendRequest = false;
        if(res.data.status == 'ok'){
          wx.setStorageSync('neftoken', res.data.message);
          _this.getNEUserInfo();
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

  GetWXUserinfo:function(e){
    let _this = this;
    wx.getUserProfile({
      desc: '获取微信头像', 
      success: (res) => {
        _this.saveUserinfo(res);
      },
      fail:(res) => {
        wx.showToast({
          title: '请授权',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  getNEUserInfo:function(){
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getuserinfo&logontoken='+wx.getStorageSync('neftoken'),
      method:'GET',
      header:{},
      success:function(res){
        app.globalData.neuserInfo = res.data[0];
        wx.navigateBack();
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