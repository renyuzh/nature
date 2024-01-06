// pages/tform/tform.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tpreviewswith:true,
    imgList:[],
    form:{
      PID:"",
      PSN:"",
      PTitle:"",
      TID:"",
      TSN:"",
      TName:"",
      TStartTime:"2021-04-01",
      TEndTime:"2021-04-01",
      TIntro:"",
      TPoster:"",
      TTag:"",
      TMemberLimit:0,
      TIsApprove:"No"
    }
  },

  TReviewChange:function(e){
    let _this = this;
    let sval = e.detail.value;
    let prval = "Yes";
    if(sval){
      prval = "No";
    }
    _this.setData({
      tpreviewswith:sval,
      "form.TIsApprove":prval
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
      "form.TStartTime":e.detail.value
    })
  },

  endDateChange(e){
    this.setData({
      "form.TEndTime":e.detail.value
    })
  },

  ChooseImage(){
    let _this = this;
    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        _this.setData({
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
              _this.setData({
                imgList:[]
              });
            }else{
              _this.setData({
                "form.TPoster": "https://explore.iconserve.org.cn" + data.message
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
    reqdata.tid = _this.data.form.TID;
    reqdata.uid = app.globalData.neuserInfo.UID;
    reqdata.username = app.globalData.neuserInfo.UserName;
    reqdata.avatar = app.globalData.neuserInfo.UAvatar;
    reqdata.pid = _this.data.form.PID;
    reqdata.psn = _this.data.form.PSN;
    reqdata.ptitle = _this.data.form.PTitle;
    reqdata.tsn = _this.data.form.TSN;
    reqdata.tname = _this.data.form.TName;
    reqdata.tstart = _this.data.form.TStartTime;
    reqdata.tend = _this.data.form.TEndTime;
    reqdata.tintro = _this.data.form.TIntro;
    reqdata.tposter = _this.data.form.TPoster;
    reqdata.ttag = _this.data.form.TTag;
    reqdata.tmemberlimit = _this.data.form.TMemberLimit;
    reqdata.tapprove = _this.data.form.TIsApprove;

    reqdata.a = "editteaminfo";

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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let tprewith = true;
    if(options.Preview == 'Yes'){
      tprewith = false;
    }
    _this.setData({
      "form.PID":options.pid,
      "form.PSN":options.psn,
      "form.PTitle":options.Ptitle,
      tpreviewswith:tprewith,
      "form.TIsApprove":options.Preview
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