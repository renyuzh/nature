// pages/mine/mine.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PageCur: 'mine',
    statisUpdateTime:'',
    userdata:{
      UserName:""
    },
    userprofile:{
      "UPObserveCount": 0,
      "UPSpeciesCount": 0,
      "UPIdentCount": 0,
      "UPImageCount": 0,
      "UPProjectCount": 0
    },
    isExpert:false,
    UPPPModal:false
  },

  NavChange(e) {
    let tabitem = e.currentTarget.dataset.cur;
    let pageurl ="";
    switch(tabitem){
      case "project":
        pageurl = "/pages/project/project";
        wx.reLaunch({
          url: pageurl,
        });
        break;

      case "resource":
        pageurl = "/pages/observe/observe";
        wx.reLaunch({
          url: pageurl,
        });
        break;

      case "observe":
        pageurl = "/pages/oform/oform";
        wx.navigateTo({
          url: pageurl,
        })
        break;

      case "search":
        pageurl = "/pages/search/search";
        wx.reLaunch({
          url: pageurl,
        });
        break;

      case "mine":
        pageurl = "/pages/mine/mine";
        wx.reLaunch({
          url: pageurl,
        });
        break;
      
    }
  },

  navToPhoneLogin:function(){
    wx.navigateTo({
      url: '/pages/verycode/verycode',
    });
  },

  navToMyProject:function(){
    if('UID' in app.globalData.neuserInfo){
      wx.navigateTo({
        url: "/pages/myproject/myproject?uid="+app.globalData.neuserInfo.UID,
      });
    }else{
      wx.showToast({
        title: '未登录用户无法查看',
        icon:'none',
        duration:2000
      });
    }  
  },

  navToMyTeam:function(){
    if('UID' in app.globalData.neuserInfo){
      wx.navigateTo({
        url: "/pages/myteam/myteam?uid="+app.globalData.neuserInfo.UID,
      });
    }else{
      wx.showToast({
        title: '未登录用户无法查看',
        icon:'none',
        duration:2000
      });
    }
  },

  navToMyIdent:function(){
    if('UID' in app.globalData.neuserInfo){
      wx.navigateTo({
        url: "/pages/myident/myident?uid="+app.globalData.neuserInfo.UID,
      });
    }else{
      wx.showToast({
        title: '未登录用户无法查看',
        icon:'none',
        duration:2000
      });
    }
  },

  navToMyComment:function(){
    if('UID' in app.globalData.neuserInfo){
      wx.navigateTo({
        url: "/pages/mycomment/mycomment?uid="+app.globalData.neuserInfo.UID,
      });
    }else{
      wx.showToast({
        title: '未登录用户无法查看',
        icon:'none',
        duration:2000
      });
    }
  },

  navToObserveList:function(){
    if('UID' in app.globalData.neuserInfo){
      wx.navigateTo({
        url: "/pages/olist/olist?uid="+app.globalData.neuserInfo.UID,
      });
    }else{
      wx.showToast({
        title: '未登录用户无法查看',
        icon:'none',
        duration:2000
      });
    }
  },

  navToPhotos:function(){
    if('UID' in app.globalData.neuserInfo){
      wx.navigateTo({
        url: "/pages/photo/photo?uid="+app.globalData.neuserInfo.UID,
      });
    }else{
      wx.showToast({
        title: '未登录用户无法查看',
        icon:'none',
        duration:2000
      });
    }
  },

  login:function(){
    wx.navigateTo({
      url: "/pages/login/login",
    })
  },

  register:function(){
    this.setData({
      UPPPModal:true
    });
  },

  denyUPPP:function(){
    this.setData({
      UPPPModal:false
    });
  },

  agreeUPPP:function(){
    this.setData({
      UPPPModal:false
    });
    wx.navigateTo({
      url: "/pages/register/register",
    });
  },

  logout:function(){
    let _this = this;
    wx.removeStorageSync('neftoken');
    app.globalData.neuserInfo = null;
    _this.setData({
      userdata:null,
      userprofile:{
        "UPObserveCount": 0,
        "UPSpeciesCount": 0,
        "UPIdentCount": 0,
        "UPImageCount": 0,
        "UPProjectCount": 0
      }
    });
  },

  getNEUserInfo:function(){
    let _this = this;
    _this.setData({
      userdata:app.globalData.neuserInfo
    });
    if(app.globalData.neuserInfo.USysRole == "Expert" || app.globalData.neuserInfo.USysRole == "Admin"){
      _this.setData({
        isExpert:true
      });
    }else{
      _this.setData({
        isExpert:false
      });
    }
  },

  getUserProfile:function() {
    let _this = this;
    if('UID' in app.globalData.neuserInfo && app.globalData.neuserInfo.UID != ''){
      wx.request({
        url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getuserprofile&uid='+app.globalData.neuserInfo.UID,
        method:'GET',
        header:{},
        success:function(res){
          _this.setData({
            userprofile:res.data[0]
          });
        }
      });
    }
  },

  navToUserAgreement:function(){
    wx.navigateTo({
      url: '/pages/webviewpage/webviewpage?url=https://explore.iconserve.org.cn/agreement.html',
    })
  },

  navToPrivacyPolicy:function(){
    wx.navigateTo({
      url: '/pages/webviewpage/webviewpage?url=https://explore.iconserve.org.cn/privacy.html',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      statisUpdateTime:app.globalData.odatetime
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
    _this.getNEUserInfo();
    _this.getUserProfile();
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

  },

})