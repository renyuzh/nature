// pages/observe/observe.js
var app = getApp();

var QQMapWX = require('../../libs/qqmap/qqmap-wx-jssdk.js');

var qqmapsdk = new QQMapWX({
  key:'A2JBZ-PE4LX-57A4X-TTXNV-NF7TS-K5BGU'
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalName:null,
    tabitems: ['最新观测', '最新鉴定'],
    TabCur: 0,
    scrollLeft: 0,
    PageCur: 'resource',
    globalcusbarheight:app.globalData.CustomBar,
    maps:[],
    observes:{
      requestTag:true,
      page:1,
      pagesize:10,
      data:[]
    },
    idents:{
      requestTag:true,
      page:1,
      pagesize:10,
      data:[]
    },
     /*experts:{
      page:1,
      pagesize:10,
      data:[]
    },*/
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
    fromdate:"2020-04-01",
    /*mapContext:null,
    mapSetting:{
      longitude:114.465368,
      latitude:22.586811,
      markers:[],
      scale:18
    },
    regionData:{
      southwest:{
        longitude:0,
        latitude:0
      },
      northeast:{
        longitude:0,
        latitude:0
      }
    },
    customCalloutDatas:[],
    mObserveInfo:{}*/
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

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },

  showFilterPanel:function(e){
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  hideModal:function() {
    let _this = this;
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

  setInitVal:function() {
    let _this = this;
    let nowdate = _this.getNowDate();
    _this.getAllProjects();
    _this.setData({
      todate:nowdate
    });
    //_this.initMap();
    _this.getObserveLatest();
    _this.getIdentLatest();
    //_this.getIdentExpert();
  },

  navToOdetail:function(e){
    let oid = e.currentTarget.dataset.oid;
    wx.navigateTo({
      url: "/pages/odetail/odetail?oid="+oid,
    })
  },

  initMap:function(){
    let _this = this;
    _this.setData({
      mapContext:wx.createMapContext('markMap', _this)
    });
    _this.locateMyself();
  },

  getObserveMap:function(){
    let _this = this;
    let reqdata = {};
    reqdata.a = "getobservemap";
    reqdata.lat1 = _this.data.regionData.northeast.latitude;
    reqdata.lat2 = _this.data.regionData.southwest.latitude;
    reqdata.long1 = _this.data.regionData.northeast.longitude;
    reqdata.long2 = _this.data.regionData.southwest.longitude;
    reqdata.tid = _this.data.teamgroup;
    reqdata.pid = _this.data.projectgroup;
    reqdata.from = _this.data.fromdate;
    reqdata.to = _this.data.todate;
    reqdata.taxa = _this.data.taxagroup;

    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx',
      method:'GET',
      data:reqdata,
      header:{},
      success:function(res) {
        let observes = res.data;
        _this.data.customCalloutDatas = observes;

        let markers = [];     
        for(let i=0; i<observes.length; i++){
          let rec = observes[i];
          observes[i].OPoster = observes[i].OPoster.replace("Normal","Web");
          let marker = {
            id:i,
            latitude:rec.OLatitude,
            longitude:rec.OLongitude,
            iconPath:'',
            alpha:0.5,
            width:'0',
            height:'0',
            zIndex:(10000+i),
            customCallout: {
              anchorX:0,
              anchorY:10,
              display: 'ALWAYS',
            },
          };
          markers.push(marker);
        }
        _this.setData({
          mapSetting:{
            markers:markers
          },
          customCalloutDatas:observes
        });
      }
    });    
  },

  regionChange:function(e){
    let _this = this;
    if(e.type == "end"){
      _this.setData({
        regionData:{
          southwest:e.detail.region.southwest,
          northeast:e.detail.region.northeast
        }
      });
      _this.getObserveMap();
    }
  },

  locateMyself:function(){
    let _this = this;
    wx.getLocation({
      type:'gcj02',
      isHighAccuracy:true,
      success:function(res){
        const latitude = res.latitude
        const longitude = res.longitude
        _this.setData({
          mapSetting:{
            longitude:longitude,
            latitude:latitude
          }
        });
        _this.data.mapContext.getRegion({
          success:function(res){
            _this.setData({
              regionData:{
                southwest:res.southwest,
                northeast:res.northeast
              }
            });
            _this.getObserveMap();
          }
        });
      }
    });
  },

  showObserveDetail:function(e){
    let _this = this;
    let currentObserve = _this.data.customCalloutDatas[e.markerId];
    let reqdata = {};
    reqdata.a = "getobserveinfo";
    reqdata.oid = currentObserve.OID;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx',
      method:'GET',
      data:reqdata,
      header:{},
      success:function(res) {
        _this.setData({
          mObserveInfo:res.data[0],
          modalName:'MObserveModal'
        });
      }
    })
  },

  getObserveLatest:function() {
    let _this = this;
    if(!_this.data.observes.requestTag){
      return;
    }
    _this.data.observes.requestTag = false;
    let reqdata = {};
    reqdata.tid = _this.data.teamgroup;
    reqdata.pid = _this.data.projectgroup;
    reqdata.from = _this.data.fromdate;
    reqdata.to = _this.data.todate;
    reqdata.taxa = _this.data.taxagroup;
    reqdata.page = _this.data.observes.page;
    reqdata.pagesize = _this.data.observes.pagesize;
    reqdata.a = "getlatestobserve";
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx',
      method:'GET',
      header:{},
      data:reqdata,
      success:function(res) {
        _this.data.observes.requestTag = true;
        if(res.data.length >0){
          _this.data.observes.page = _this.data.observes.page + 1;
          _this.setData({
            "observes.data":_this.data.observes.data.concat(res.data)
          });
        }else{
          wx.showToast({
            title: '没有更多了~',
            icon:'none',
            duration:2000
          });
        }  
      }
    })
  },

  getIdentLatest:function() {
    let _this = this;
    if(!_this.data.idents.requestTag){
      return;
    }
    _this.data.idents.requestTag = false;
    let reqdata = {};
    reqdata.tid = _this.data.teamgroup;
    reqdata.pid = _this.data.projectgroup;
    reqdata.from = _this.data.fromdate;
    reqdata.to = _this.data.todate;
    reqdata.taxa = _this.data.taxagroup;
    reqdata.page = _this.data.observes.page;
    reqdata.pagesize = _this.data.observes.pagesize;
    reqdata.a = "getlatestident";
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx',
      method:'GET',
      header:{},
      data:reqdata,
      success:function(res) {
        if(res.data.length >0){
          _this.data.idents.page = _this.data.idents.page + 1;
          _this.setData({
            "idents.data":_this.data.idents.data.concat(res.data)
          });
        }else{
          wx.showToast({
            title: '没有更多了~',
            icon:'none',
            duration:2000
          });
        }
        _this.data.idents.requestTag = true;
      }
    })
  },

  getIdentExpert:function() {
    let _this = this;
    let reqdata = {};
    reqdata.tid = _this.data.teamgroup;
    reqdata.pid = _this.data.projectgroup;
    reqdata.from = _this.data.fromdate;
    reqdata.to = _this.data.todate;
    reqdata.taxa = _this.data.taxagroup;
    reqdata.page = _this.data.observes.page;
    reqdata.pagesize = _this.data.observes.pagesize;
    reqdata.a = "getexpertident";
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx',
      method:'GET',
      header:{},
      data:reqdata,
      success:function(res) {
        if(res.data.length >0){
          _this.data.experts.page = _this.data.experts.page + 1;
          _this.setData({
            "experts.data":_this.data.experts.data.concat(res.data)
          });
        }else{
          wx.showToast({
            title: '没有更多了~',
            icon:'none',
            duration:2000
          });
        }
      }
    })
  },

  filterObserve:function(e){
    let _this = this;
    _this.hideModal();
    switch(_this.data.TabCur){
      case 0:
        _this.getObserveMap();
        break;

      case 1:
        _this.setData({
          observes:{
            page:1,
            pagesize:10,
            data:[]
          }
        });
        _this.getObserveLatest();
        break;

      case 2:
        _this.setData({
          idents:{
            page:1,
            pagesize:10,
            data:[]
          }
        });
        _this.getIdentLatest();
        break;

      case 3:
        _this.setData({
          experts:{
            page:1,
            pagesize:10,
            data:[]
          }
        });
        _this.getIdentExpert();
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
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
    switch(_this.data.TabCur){
      case 0:
        _this.getObserveLatest();
        break;

      case 1:
        _this.getIdentLatest();
        break;

      //case 3:
       // _this.getIdentExpert();
        //break;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})