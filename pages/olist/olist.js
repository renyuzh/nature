// pages/olist/olist.js
var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    hassendObserveDataHttp:false,
    page:1,
    pagesize:10,
    ObserveCount:0,
    observes:[],
    options:null,
    modalName:null,
    teamgroups:[{PTitle:'全部',PID:''}],
    teamgroup:'',
    teamindex:0,
    projectgroups:[{PTitle:'全部',PID:''}],
    projectgroup:'',
    proindex:0,
    taxagroups:['全部','植物','鸟类','两栖动物','爬行动物','无脊椎动物','无脊椎动物-水生','哺乳动物','鱼类','真菌','未知','其他'],
    tgindex:0,
    taxagroup:"全部",
    todate:"2020-04-01",
    fromdate:"2020-04-01"
  },

  navToOdetail:function(e){
    let oid = e.currentTarget.dataset.oid;
    wx.navigateTo({
      url: '/pages/odetail/odetail?oid='+oid,
    })
  },

  getMyObserveStatis:function() {
    let _this = this;
    _this.data.hassendObserveDataHttp = false;
    let options = _this.data.options;
    let pid = "";
    let tid = "";
    let uid = "";
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
    reqdata.a = "getobservestatis";
    reqdata.uid = uid;
    reqdata.tid = tid;
    reqdata.pid = pid;
    reqdata.from = _this.data.fromdate;
    reqdata.to = _this.data.todate;
    reqdata.taxa = _this.data.taxagroup;

    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx',
      method:'GET',
      header:{},
      data:reqdata,
      success:function(res){
        console.log(res);
        _this.setData({
          ObserveCount:res.data[0].OCount,
          page:1,
          pagesize:10,
          observes:[]
        });
        _this.getMyObserve();
      }
    })
  },

  getMyObserve:function() {
    let _this = this;
    if(_this.data.hassendObserveDataHttp){
      return;
    }
    _this.data.hassendObserveDataHttp = true;
    let options = _this.data.options;
    let pid = "";
    let tid = "";
    let uid = "";
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
    reqdata.a = "getobserves";
    reqdata.uid = uid;
    reqdata.tid = tid;
    reqdata.pid = pid;
    reqdata.from = _this.data.fromdate;
    reqdata.to = _this.data.todate;
    reqdata.taxa = _this.data.taxagroup;
    reqdata.page = _this.data.page;
    reqdata.pagesize = _this.data.pagesize;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx',
      method:'GET',
      header:{},
      data:reqdata,
      success:function(res){
        _this.data.hassendObserveDataHttp = false;
        if(res.data.length >0){
          _this.data.page = _this.data.page + 1;
          _this.setData({
            observes:_this.data.observes.concat(res.data)
          });
        }else{
          _this.data.hassendObserveDataHttp = true;
          wx.showToast({
            title: '没有更多了~',
            icon:'none',
            duration:2000
          });
        }
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

  deleteObserve:function(e){
    let _this = this;
    let item = e.currentTarget.dataset.item;

    if(!_this.IsRecordAuthor(item.UID)){
      wx.showToast({
        title: '您无此观测记录删除权限',
        icon:'none',
        duration:2000
      });
      return;
    }
    
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=deleteobserve&oid='+item.OID,
      method:'GET',
      header:{},
      success:function(res){
        if(res.data.status == 'ok'){
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1000
          });
          _this.getMyObserve();
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

  editObserve:function(e){
    let _this = this;
    let item = e.currentTarget.dataset.item;
    if(!_this.IsRecordAuthor(item.UID)){
      wx.showToast({
        title: '您无此观测记录编辑权限',
        icon:'none',
        duration:2000
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/oform/oform?item='+JSON.stringify(item),
    })
  },

  showModal:function(e){
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    });
  },

  filterObserve(){
    let _this = this;
    _this.data.options.pid = _this.data.projectgroup;
    _this.data.options.tid = _this.data.teamgroup;
    _this.getMyObserveStatis();
    _this.setData({
      modalName: null
    });
  },

  getTeamsToPro:function(){
    let _this = this;
    let reqdata = {};
    reqdata.a = "getproteams";
    reqdata.pid = _this.data.projectgroup;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx',
      method:'GET',
      header:{},
      data:reqdata,
      success:function(res){
        let teams = [{TName:'全部',TID:''}];
        teams = teams.concat(res.data);
        _this.setData({
          teamgroups:teams,
          teamgroup:'',
          teamindex:0
        });
      }
    })
  },

  getAllProjects:function(){
    let _this = this;
    let reqdata = {};
    reqdata.a = "getprojectslist";

    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx',
      method:'GET',
      header:{},
      data:reqdata,
      success:function(res){
        let projects = [{PTitle:'全部',PID:''}];
        projects = projects.concat(res.data);
        _this.setData({
          projectgroups:projects,
          projectgroup:'',
          proindex:0
        });
      }
    })
  },

  TeamGroupChange:function(e){
    let _this = this;
    let ti = e.detail.value;
    let tcontent = _this.data.teamgroups[ti]['TID'];
    _this.setData({
      teamindex:ti,
      teamgroup:tcontent
    });
  },

  ProjectGroupChange:function(e){
    let _this = this;
    let proi = e.detail.value;
    let procontent = _this.data.projectgroups[proi]['PID'];
    _this.setData({
      proindex:proi,
      projectgroup:procontent
    });
    _this.getTeamsToPro();
  },

  TaxaGroupChange:function(e) {
    let _this = this;
    let tgselecti = e.detail.value;
    let tgcontent = _this.data.taxagroups[tgselecti];
    _this.setData({
      tgindex:tgselecti,
      taxagroup:tgcontent
    });
  },

  FromDateChange(e){
    let _this = this;
    let fdate = e.detail.value;
    _this.setData({
      fromdate:fdate
    });
  },

  ToDateChange(e){
    let _this = this;
    let tdate = e.detail.value;
    _this.setData({
      todate:tdate
    });
  },

  formatNumber:function(n){
    n = n.toString();
    return n[1] ? n : '0' + n;
  },

  getNowDate:function(){
    let date = new Date(Date.now());
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return [year, month, day].map(this.formatNumber).join('-');
  },

  setInitVal:function() {
    let _this = this;
    let nowdate = _this.getNowDate();
    _this.getAllProjects();
    _this.setData({
      todate:nowdate
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      options:options
    });
    _this.setInitVal();
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
    _this.getMyObserveStatis();
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
    let _this = this;
    _this.getMyObserve();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})