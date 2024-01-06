// pages/pdetail/pdetail.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:null,
    project:{},
    ptags:[],
    teams:[],
    members:[],
    statisUpdateTime:'',
    isAdmin:false,
    userCanObserve:false,
    userCanJoinProject:false
  },

  approveMember:function(e){
    let _this = this;
    let aptmid = e.currentTarget.dataset.aptmid;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=reviewmember&ptmid='+aptmid+'&reviewinfo=Yes',
      method:'GET',
      header:{},
      success:function(res){
        let data = res.data;
        if(data.status=='ok'){
          _this.getTeamMembers(_this.data.project.PID);
        }else{
          wx.showToast({
            title: '审核失败',
            icon:'none',
            duration: 2000
          });
        }
      }
    });
  },

  denyMember:function(e){
    let _this = this;
    let dptmid = e.currentTarget.dataset.dptmid;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=reviewmember&ptmid='+dptmid+'&reviewinfo=Deny',
      method:'GET',
      header:{},
      success:function(res){
        let data = res.data;
        if(data.status=='ok'){
          _this.getTeamMembers(_this.data.project.PID);
        }else{
          wx.showToast({
            title: '审核失败',
            icon:'none',
            duration: 2000
          });
        }
      }
    });
  },

  JoinProject:function() {
    let _this = this;
    let reqdata = {};
    reqdata.uid = app.globalData.neuserInfo.UID;
    reqdata.user = app.globalData.neuserInfo.UserName;
    reqdata.avatar = app.globalData.neuserInfo.UAvatar;
    reqdata.pid = _this.data.project.PID;
    reqdata.psn = _this.data.project.PSN;
    reqdata.ptitle = _this.data.project.PTitle;
    reqdata.tid = '';
    reqdata.tsn = '';
    reqdata.tname = '无';
    reqdata.ptmrole = '队员';
    reqdata.ptmapprove = _this.data.project.PReviewDefault;

    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=jointeam',
      method:'GET',
      header:{},
      data:reqdata,
      success:function(res){
        //成功则重新加载队员，失败则反馈信息
        if(res.data.status == 'ok'){
          _this.getTeamMembers(_this.data.project.PID);
          wx.showToast({
            title: '加入成功',
            icon:'success',
            duration:1000
          });
        }else{
          wx.showToast({
            title: '加入失败',
            icon:'none',
            duration:2000
          });
        }
      }
    });
    
    wx.showToast({
      title: '等待批准',
      icon:'success',
      duration: 1000
    })
  },

  navToMemberOList:function(e){
    let uid = e.currentTarget.dataset.uid;
    let tid = e.currentTarget.dataset.tid;
    wx.navigateTo({
      url: '/pages/olist/olist?pid='+this.data.project.PID+'&tid='+tid+'&uid='+uid,
    })
  },

  getTeamMembers:function(pid){
    let _this = this;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getmembers&pid='+pid,
      method:'GET',
      header:{},
      success:function(res){
        _this.setData({
          members:res.data
        });
        _this.getPTMData(_this.data.project.PID);
      }
    });
  },

  navToTObserve:function(){
    wx.navigateTo({
      url: '/pages/oform/oform?pid='+this.data.project.PID,
    })
  },

  judgeUserAuthority:function(){
    let _this = this;
    if(_this.data.project.PStatus=='已结束' || app.globalData.neuserInfo.USysRole == 'guest'){
      _this.setData({
        userCanObserve:false,
        isAdmin:false,
        userCanJoinProject:false
      });
      return false;
    }
    return true;
  },

  getPTMData:function(pid){
    let _this = this;
    if(!_this.judgeUserAuthority()){
      return;
    }
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getptmtoproject&pid='+pid+'&uid='+app.globalData.neuserInfo.UID,
      method:'GET',
      header:{},
      success:function(res){
        let data = res.data;
        let userCanObserve = false;
        let userCanJoinProject = false;
        for(var i=0; i<data.length; i++){
          let rec = data[i];
          if(rec.PTMIsApprove=='Yes'){
            userCanObserve = true;
            break;
          }
        }
        if(data.length == 0){
          userCanJoinProject = true;
        }
        _this.setData({
          userCanObserve:userCanObserve,
          userCanJoinProject:userCanJoinProject
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

  denyCreateTeam:function(e){
    let _this = this;
    let dtid = e.currentTarget.dataset.dtid;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=reviewteam&tid='+dtid+'&reviewinfo=Deny',
      method:'GET',
      header:{},
      success:function(res){
        let data = res.data;
        if(data.status=='ok'){
          _this.getTeams(_this.data.project.PID);
        }else{
          wx.showToast({
            title: '审核失败',
            icon:'none',
            duration: 2000
          });
        }
      }
    });
  },

  approveCreateTeam:function(e){
    let atid = e.currentTarget.dataset.atid;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=reviewteam&tid='+atid+'&reviewinfo=Yes',
      method:'GET',
      header:{},
      success:function(res){
        let data = res.data;
        if(data.status=='ok'){
          _this.getTeams(_this.data.project.PID);
        }else{
          wx.showToast({
            title: '审核失败',
            icon:'none',
            duration: 2000
          });
        }
      }
    });
  },

  navToTdetail:function(e){
    let tid = e.currentTarget.dataset.tid;
    wx.navigateTo({
      url: '/pages/tdetail/tdetail?tid='+tid,
    });
  },

  navToTForm:function(){
    wx.navigateTo({
      url: '/pages/tform/tform?pid='+this.data.project.PID+'&psn='+this.data.project.PSN+'&Ptitle='+this.data.project.PTitle+'&Preview='+this.data.project.PReviewDefault,
    })
  },

  navToRank:function(){
    wx.navigateTo({
      url: '/pages/rank/rank?pid='+this.data.project.PID+'&pcategory='+this.data.project.PCategory,
    })
  },

  navToOList:function(){
    wx.navigateTo({
      url: '/pages/olist/olist?pid='+this.data.project.PID,
    })
  },

  navToPhoto:function(){
    wx.navigateTo({
      url: '/pages/photo/photo?pid='+this.data.project.PID,
    })
  },

  getProjectData:function(pid){
    let _this = this;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getprojectdata&pid='+pid,
      method: 'GET',
      header: {},
      success:function(res){
        let ptaglist = res.data[0].PTag.split(/[ ,，;；|]/);
        let projectdata = res.data[0];
        projectdata.PIntro = projectdata.PIntro.replace(/\\r\\n/g,'\n').replace(/\r\\n/g,'\n').replace(/\\n/g,'\n');
        _this.setData({
          project:projectdata,
          ptags:ptaglist
        });
        if(projectdata.PCategory=='团队'){
          _this.getTeams(projectdata.PID);
        }
        if(projectdata.PCategory=='单人'){
          _this.getTeamMembers(projectdata.PID);
        }
      }
    })
  },

  getTeams:function(pid){
    let _this = this;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getproteams&pid='+pid,
      method:'GET',
      header:{},
      success:function(res){
        _this.setData({
          teams:res.data
        });
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      options:options,
      statisUpdateTime:app.globalData.odatetime
    });
    _this.getProjectData(options.pid);
    _this.setInitVal();
    _this.getPTMData(options.pid);
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
    if(this.data.project.PID){
      if(this.data.project.PCategory=='团队'){
        this.getTeams(this.data.project.PID);
      }
      if(this.data.project.PCategory=='单人'){
        this.getTeamMembers(this.data.project.PID);
      }
      this.getPTMData(this.data.project.PID);
    }
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