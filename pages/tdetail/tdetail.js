// pages/tdetail/tdetail.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    team:{},
    ttags:[],
    members:[],
    statisUpdateTime:'',
    isAdmin:false,
    canJoinTeam:false,
    canCreateObserve:false,
    isLeader:false
  },

  judgeUserAuthority:function(){
    let _this = this;
    if(_this.data.team.TIsApprove != 'Yes' || _this.data.team.TStatus == '结束' || app.globalData.neuserInfo.USysRole == 'guest'){
      _this.setData({
        isAdmin:false,
        canJoinTeam:false,
        canCreateObserve:false,
        isLeader:false
      });
      return false;
    }
    return true;
  },

  judgeUserJoinChance:function(pid,tid){
    let _this = this;
    if(!_this.judgeUserAuthority()){
      return;
    }
    _this.getProjectJoinTeamSetting(pid,tid);
  },

  getProjectJoinTeamSetting:function(pid,tid){
    let _this = this;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getprojectdata&pid='+pid,
      method:'GET',
      header:{},
      success:function(res){
        let data = res.data[0];
        if(data.JoinMoreTeamsStatus == "Yes"){
          _this.getPTMData(pid,tid);
        }else{
          _this.getIsProjectMemberData(pid,tid);
        }
      }
    })
  },

  getIsProjectMemberData:function(pid,tid){
    let _this = this;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getptmbypu&pid='+pid+'&uid='+app.globalData.neuserInfo.UID,
      method:'GET',
      header:{},
      success:function(res){
        let data = res.data;
        let canjointeam = false;
        let cancreateobserve = false;
        let teamleader = false;

        if(data.length == 0){
          canjointeam = true;
        }

        let pmark = 0;
        for(var i=0; i<data.length; i++){
          let rec = data[i];
          if(rec.PTMIsApprove=='Yes'){
            cancreateobserve = true;
            if(rec.PTMRole=='队长'){
              teamleader = true;
            }
          }
          if(rec.PTMIsApprove == 'Deny' && rec.TID != tid){
            pmark = pmark + 1;
          }
        }
        if(pmark == data.length){
          canjointeam = true;
        }
        _this.setData({
          canJoinTeam:canjointeam,
          canCreateObserve:cancreateobserve,
          isLeader:teamleader
        });
      }
    })
  },

  getPTMData:function(pid,tid){
    let _this = this;
    
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getptmtoproject&pid='+pid+'&tid='+tid+'&uid='+app.globalData.neuserInfo.UID,
      method:'GET',
      header:{},
      success:function(res){
        let data = res.data;
        let canjointeam = false;
        let cancreateobserve = false;
        let teamleader = false;
        if(data.length == 0){
          canjointeam = true;
        }
        for(var i=0; i<data.length; i++){
          let rec = data[i];
          if(rec.PTMIsApprove=='Yes'){
            cancreateobserve = true;
            if(rec.PTMRole=='队长'){
              teamleader = true;
            }
            break;
          }
        }
        _this.setData({
          canJoinTeam:canjointeam,
          canCreateObserve:cancreateobserve,
          isLeader:teamleader
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

  navToTObserve:function(){
    wx.navigateTo({
      url: '/pages/oform/oform?pid='+this.data.team.PID+'&tid='+this.data.team.TID,
    })
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
          _this.getTeamMembers(_this.data.team.TID);
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
          _this.getTeamMembers(_this.data.team.TID);
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

  getTeamMembers:function(tid){
    let _this = this;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getmembers&tid='+tid,
      method:'GET',
      header:{},
      success:function(res){
        _this.setData({
          members:res.data
        });
        _this.judgeUserJoinChance(_this.data.team.PID,_this.data.team.TID);
      }
    });
  },

  getTeamInfo:function(tid){
    let _this = this;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getteaminfo&tid='+tid,
      method:'GET',
      header:{},
      success:function(res){
        let taglist = res.data[0].TTag.split(/[,，;；|]/);
        _this.setData({
          team:res.data[0],
          ttags:taglist
        });
      }
    })
  },

  joinTeam:function(){
    let _this = this;
    let reqdata = {};
    reqdata.uid = app.globalData.neuserInfo.UID;
    reqdata.user = app.globalData.neuserInfo.UserName;
    reqdata.avatar = app.globalData.neuserInfo.UAvatar;
    reqdata.pid = _this.data.team.PID;
    reqdata.psn = _this.data.team.PSN;
    reqdata.ptitle = _this.data.team.PTitle;
    reqdata.tid = _this.data.team.TID;
    reqdata.tsn = _this.data.team.TSN;
    reqdata.tname = _this.data.team.TName;
    reqdata.ptmrole = '队员';
    reqdata.ptmapprove = _this.data.team.TReviewDefault;

    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=jointeam',
      method:'GET',
      header:{},
      data:reqdata,
      success:function(res){
        //成功则重新加载队员，失败则反馈信息
        if(res.data.status == 'ok'){
          _this.getTeamMembers(_this.data.team.TID);
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

  navToRank:function(){
    wx.navigateTo({
      url: '/pages/rank/rank?pid='+this.data.team.PID+'&tid='+this.data.team.TID,
    })
  },
  navToOList:function(e){
    wx.navigateTo({
      url: '/pages/olist/olist?pid='+this.data.team.PID+'&tid='+this.data.team.TID,
    })
  },
  navToPhoto:function(){
    wx.navigateTo({
      url: '/pages/photo/photo?pid='+this.data.team.PID+'&tid='+this.data.team.TID,
    })
  },

  navToMemberOList:function(e){
    let uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '/pages/olist/olist?pid='+this.data.team.PID+'&tid='+this.data.team.TID+'&uid='+uid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      statisUpdateTime:app.globalData.odatetime
    });
    _this.getTeamInfo(options.tid);
    _this.getTeamMembers(options.tid);
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