// pages/photo/photo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photos:[],
    page:1,
    pagesize:10,
    urlparam:{}
  },

  navToOdetail:function(e) {
    let oid = e.currentTarget.dataset.curphotohostid;
    wx.navigateTo({
      url: '/pages/odetail/odetail?oid='+oid,
    })
  },

  showOriginPhoto:function(e){
    let currentPhoto = e.currentTarget.dataset.currentphoto;
    let photourls = [];
    for(var i=0; i<this.data.photos.length; i++){
      photourls.push(this.data.photos[i].NPOriginPath);
    }
    wx.previewImage({
      current:currentPhoto,
      urls: photourls,
    })
  },

  getPhotoFlow:function(){
    let _this = this;
    let pid = "";
    let tid = "";
    let uid = "";
    let options = _this.data.urlparam;
    if(options.pid){
      pid = options.pid;
    }
    if(options.tid){
      tid = options.tid;
    }
    if(options.uid){
      uid = options.uid;
    }
    let reqdata = {};
    reqdata.pid = pid;
    reqdata.tid = tid;
    reqdata.uid = uid;
    reqdata.page = _this.data.page;
    reqdata.pagesize = _this.data.pagesize;
    _this.data.page = _this.data.page + 1;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getphotoflow',
      method:'GET',
      header:{},
      data:reqdata,
      success:function(res){
        if(res.data.length > 0){
          _this.setData({
            photos:_this.data.photos.concat(res.data)
          });
        }else{
          wx.showToast({
            title: '没有更多了~',
            icon:'none',
            duration:2000
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      urlparam:options
    });
    _this.getPhotoFlow();
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
    this.getPhotoFlow();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})