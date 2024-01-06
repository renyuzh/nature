// pages/pform/pform.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList:[],
    previewswith:true,
    joinTeamsStatus:false,
    ptindex:0,
    psindex:0,
    ptlist:['推荐','精选','普通'],
    pslist:['即将开始','正在招募中','活动进行中','已结束'],
    form:{
      PSN:"",
      PTitle:"",
      PCategory:"团队",
      PLocation:"",
      PStartTime:"2020-11-01",
      PEndTime:"2020-11-01",
      PIntro:"",
      PPoster:"",
      PType:"",
      PStatus:"",
      PTag:"",
      PIsApprove:"No",
      PReviewDefault:"No",
      JoinMoreTeamsStatus:"No",
      PTeamLimit:0
    }
  },

  PCateChange:function(e) {
    let _this = this;
    _this.setData({
      "form.PCategory":e.detail.value
    });
  },

  PTypeChange:function(e){
    let _this = this;
    let selectedi = e.detail.value;
    _this.setData({
      ptindex:selectedi,
      "form.PType":_this.data.ptlist[selectedi]
    });
  },

  PStatusChange:function(e){
    let _this = this;
    let selectedi = e.detail.value;
    _this.setData({
      psindex:selectedi,
      "form.PStatus":_this.data.pslist[selectedi]
    });
  },

  inputedit:function(e){
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value;
    this.data[dataset.obj][dataset.item] = value;
    this.setData({
      obj:this.data[dataset.obj]
    });
  },

  startDateChange(e){
    this.setData({
      "form.PStartTime":e.detail.value
    })
  },

  endDateChange(e){
    this.setData({
      "form.PEndTime":e.detail.value
    })
  },

  ChooseImage(){
    let _this = this;
    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          imgList:res.tempFilePaths
        });
        wx.showLoading({
          title: '正在上传...',
        });
        const tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          filePath: tempFilePaths[0],
          name: 'file',
          url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=upload',
          formData:{},
          success(res){
            wx.hideLoading();
            const data = JSON.parse(res.data);
            if(data.status == "error"){
              wx.showToast({
                title: data.message,
                icon:'none',
                duration: 2000
              });
              this.setData({
                imgList:[]
              });
            }else{
              _this.setData({
                "form.PPoster": "https://explore.iconserve.org.cn" + data.message
              });
            }
          }
        });
      }
    });
  },

  ViewImage(e){
    wx.previewImage({
      urls: this.data.imgList,
      current:e.currentTarget.dataset.url
    })
  },

  DelImg(e){
    this.data.imgList = [];
    this.setData({
      imgList:this.data.imgList
    });
  },

  save:function(){
    let _this = this;
    let reqdata = {};
    reqdata.uid = app.globalData.neuserInfo.UID;
    reqdata.user = app.globalData.neuserInfo.UserName;
    reqdata.avatar = app.globalData.neuserInfo.UAvatar;
    reqdata.psn = _this.data.form.PSN;
    reqdata.ptitle = _this.data.form.PTitle;
    reqdata.ploc = _this.data.form.PLocation;
    reqdata.pstart = _this.data.form.PStartTime;
    reqdata.pend = _this.data.form.PEndTime;
    reqdata.pintro = _this.data.form.PIntro;
    reqdata.poster = _this.data.form.PPoster;
    reqdata.ptype = _this.data.form.PType;
    reqdata.pstatus = _this.data.form.PStatus;
    reqdata.ptag = _this.data.form.PTag;
    reqdata.pteamlimit = _this.data.form.PTeamLimit;
    reqdata.pisapprove = _this.data.form.PIsApprove;
    reqdata.preview = _this.data.form.PReviewDefault;
    reqdata.jteamstatus = _this.data.form.JoinMoreTeamsStatus;
    reqdata.pcate = _this.data.form.PCategory;

    reqdata.a = "newproject";

    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx',
      method:'POST',
      header:{"Content-Type": "application/x-www-form-urlencoded"},
      data:reqdata,
      success:function(res){
        if(res.data.status == 'ok'){
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000
          });
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

  cancel:function(){
    wx.navigateBack();
  },

  PReviewChange:function(e){
    let _this = this;
    let sval = e.detail.value;
    let prval = "Yes";
    if(sval){
      prval = "No";
    }
    _this.setData({
      previewswith:sval,
      "form.PReviewDefault":prval
    });
  },

  joinTeamsStatusChange:function(e){
    let _this = this;
    let sval = e.detail.value;
    let prval = "No";
    if(sval){
      prval = "Yes";
    }
    _this.setData({
      joinTeamsStatus:e.detail.value,
      "form.JoinMoreTeamsStatus":prval
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