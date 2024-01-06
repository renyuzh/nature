// pages/mycomment/mycomment.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mycomments:[],
    options:null

  },

  navToOdetail:function(e){
    let oid = e.currentTarget.dataset.oid;
    wx.navigateTo({
      url: '/pages/odetail/odetail?oid='+oid,
    })
  },

  getMyComment:function() {
    let _this = this;
    let options = _this.data.options;
    let uid = options.uid;
    
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getmycomment&uid='+uid,
      method:'GET',
      header:{},
      success:function(res){
        _this.setData({
          mycomments:res.data
        });
      }
    })
  },

  IsRecordAuthor:function(uid){
    if('UID' in app.globalData.neuserInfo){
      if(app.globalData.neuserInfo.UID == uid){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }  
  },

  deleteComment:function(e){
    let _this = this;
    let uid = e.currentTarget.dataset.uid;
    let cid = e.currentTarget.dataset.cid;

    if(!_this.IsRecordAuthor(uid)){
      wx.showToast({
        title: '您无此评论记录删除权限',
        icon:'none',
        duration:2000
      });
      return;
    }
    
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=deletecomment&cid='+cid,
      method:'GET',
      header:{},
      success:function(res){
        if(res.data.status == 'ok'){
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1000
          });
          _this.getMyComment();
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      options:options
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
    this.getMyComment();
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