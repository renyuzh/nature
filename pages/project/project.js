// pages/project/project.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Projects: [],
    isAdmin:false,
    PageCur: 'project',
    swiperList: [{
        url: 'https://explore.iconserve.org.cn/Data/poster.png'
    }, {
        url: 'https://explore.iconserve.org.cn/Data/poster2.jpg',
    }, {
        url: 'https://explore.iconserve.org.cn/Data/poster1.jpg'
    }],
  },

  navToPdetail:function(e){
    let pid = e.currentTarget.dataset.pid;
    wx.navigateTo({
      url: '/pages/pdetail/pdetail?pid='+pid,
    })
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

  getProjects: function () {
    let _this = this;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getprojects',
      method: 'GET',
      header: {
        // 'Content-Type': 'application/json'
      },
      success: function (res) {
        _this.setData({
          Projects: res.data
        });
      }
    })
  },

  setInitVal:function(){
    let isadmin = false;
    if(app.globalData.neuserInfo.USysRole == 'Admin'){
      isadmin = true;
    }else{
      isadmin = false;
    }
    this.setData({
      isAdmin:isadmin
    });
  },

  navToPform:function(){
    wx.navigateTo({
      url: '/pages/pform/pform',
    })
  },

  getSwiperPosters:function(){
    let _this = this;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getprojectswipers',
      method:'GET',
      header:{},
      success:function(res){
        _this.setData({
          swiperList:res.data
        });
      }
    })
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
    this.getProjects();
    this.getSwiperPosters();
    this.setInitVal();
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