// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PageCur: 'search',
    searchVal:'',
    projects:[],
    teams:[],
    users:[],
    observes:[],
    photos:[]
  },

  search:function(){
    let _this = this;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=search&key='+_this.data.searchVal,
      method:'GET',
      header:{},
      success:function(res) {
        let data = res.data;
        _this.setData({
          projects:data.projects,
          teams:data.teams,
          users:data.users,
          observes:data.observes,
          photos:data.photos
        });
      }
    })
  },

  editInput:function(e){
    this.setData({
      searchVal:e.detail.value
    });
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

  navToOdetail:function(e){
    let OID = e.currentTarget.dataset.oid;
    wx.navigateTo({
      url: "/pages/odetail/odetail?oid="+OID,
    })
  },

  showBigPhoto:function(e){
    let pindex = e.currentTarget.dataset.pidx;
    let curPhotoOri = this.data.photos[pindex].NPOriginPath;
    let photourls = [];
    for(var i=0; i<this.data.photos.length; i++){
      photourls.push(this.data.photos[i].NPOriginPath);
    }
    wx.previewImage({
      urls: photourls,
      current:curPhotoOri
    })
  },

  navToOList:function(e){
    let uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '/pages/olist/olist?uid='+uid,
    })
  },

  navToPdetail:function(e){
    let pid = e.currentTarget.dataset.pid;
    wx.navigateTo({
      url: "/pages/pdetail/pdetail?pid="+pid,
    })
  },

  navToTdetail:function(e){
    let tid = e.currentTarget.dataset.tid;
    wx.navigateTo({
      url: "/pages/tdetail/tdetail?tid="+tid,
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