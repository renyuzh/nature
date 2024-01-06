// pages/uinfoset/uinfoset.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form:{
      PhoneNUM:'',
      password:'',
      confirmpwd:''
    },
    userdata:{},
    curInfo:'',
    options:null
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

  resetPhoneNUM:function(){
    let _this = this;
    if(_this.data.form.PhoneNUM.length < 11){
      wx.showToast({
        title: '手机号无效',
        icon:'none',
        duration:2000
      });
      return;
    }
    
    let reqdata = {};
    reqdata.a = "resetphone";
    reqdata.uid = _this.data.userdata.UID
    reqdata.pnum =  _this.data.form.PhoneNUM;

    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx',
      method:'GET',
      header:{},
      data:reqdata,
      success:function(res){ 
        wx.showToast({
          title: res.data.message,
          icon:'none',
          duration:2000
        });
      }
    });
  },

  resetUserPwd:function(){
    let _this = this;
    if(_this.data.form.password != _this.data.form.confirmpwd){
      wx.showToast({
        title: '密码不一致',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    let reqdata = {};
    reqdata.a = "resetmypwd";
    reqdata.uid = _this.data.userdata.UID;
    reqdata.pwd = _this.data.form.password;

    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx',
      method:'GET',
      header:{},
      data:reqdata,
      success:function(res){ 
        wx.showToast({
          title: res.data.message,
          icon:'none',
          duration:2000
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.data.options = options;
    _this.setData({
      curInfo:options.info
    });
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
    let _this = this;
    _this.setData({
      userdata:app.globalData.neuserInfo
    });
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