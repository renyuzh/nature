// pages/rank/rank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topobserve:{
      img:'',
      title:'',
      count:''
    },
    topspecies:{
      img:'',
      title:'',
      count:''
    },
    observes:[],
    species:[]
  },

  convertAField:function(data,fields,type){
    let top = {};
    let items = [];
    if(data.length > 0){
      top.img = data[0][fields[0]];
      top.title = data[0][fields[1]];
      top.count = data[0][fields[2]];
    }
    for(var i=1; i<data.length; i++){
      let item = {};
      item.img = data[i][fields[0]];
      item.title = data[i][fields[1]];
      item.count = data[i][fields[2]];
      items.push(item);
    }
    if(type == 'Observes'){
      this.setData({
        topobserve:top,
        observes:items
      });
    }
    if(type == 'Species'){
      this.setData({
        topspecies:top,
        species:items
      });
    }
  },

  getObserveRank:function(options){
    let _this = this;
    let pid = "";
    let tid = "";
    let pcategory = "";
    if(options.pid){
      pid = options.pid;
    }
    if(options.tid){
      tid = options.tid;
    }
    if(options.pcategory){
      pcategory = options.pcategory;
    }
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getoberverank&pid='+pid+'&tid='+tid+'&pcategory='+pcategory,
      method:'GET',
      header:{},
      success:function(res){
        let data = res.data[0];
        if('UPID' in data){
          _this.convertAField(res.data,['UAvatar','UserName','UPObserveCount'],'Observes');
        }else if('PTMID' in data){
          _this.convertAField(res.data,['UAvatar','UserName','PTMObserveCount'],'Observes');
        }else{
          _this.convertAField(res.data,['TPoster','TName','TObserveCount'],'Observes');
        }
      }
    });
  },

  getSpeciesRank:function(options){
    let _this = this;
    let pid = "";
    let tid = "";
    let pcategory = "";
    if(options.pid){
      pid = options.pid;
    }
    if(options.tid){
      tid = options.tid;
    }
    if(options.pcategory){
      pcategory = options.pcategory;
    }
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getspeciesrank&pid='+pid+'&tid='+tid+'&pcategory='+pcategory,
      method:'GET',
      header:{},
      success:function(res){
        let data = res.data[0];
        if('UPID' in data){
          _this.convertAField(res.data,['UAvatar','UserName','UPSpeciesCount'],'Species');
        }else if('PTMID' in data){
          _this.convertAField(res.data,['UAvatar','UserName','PTMSpeciesCount'],'Species');
        }else{
          _this.convertAField(res.data,['TPoster','TName','TSpeciesCount'],'Species');
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getObserveRank(options);
    this.getSpeciesRank(options);
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