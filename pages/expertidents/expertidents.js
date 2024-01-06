var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    spIdentInfo:{
      SPMarkNameZh:"",
      SPMarkNameLa:"",
    },
    identModalBlock:"speciesTag",
    options:null,
    modalName:null,
    splistshow:false,
    tlindex:0,
    currentObserve:{
      group:"",
      gindex:0
    },
    taxalevels:[{taxa:'Species',title:'种'},{taxa:'Genus',title:'属'},{taxa:'Family',title:'科'},
    {taxa:'Order',title:'目'},{taxa:'Class',title:'纲'},{taxa:'Phylum',title:'门'},{taxa:'Kingdom',title:'界'}],
    photosOriUrls:[],
    speciesList:[],
    teamgroups:[{PTitle:'全部',PID:''}],
    teamgroup:'',
    teamindex:0,
    projectgroups:[{PTitle:'全部',PID:''}],
    projectgroup:'',
    proindex:0,
    taxagroups:['全部','植物','鸟类','两栖动物','爬行动物','无脊椎动物','无脊椎动物-水生','哺乳动物','鱼类','真菌','未知','其他'],
    identtaxagroups:['植物','鸟类','两栖动物','爬行动物','无脊椎动物','无脊椎动物-水生','哺乳动物','鱼类','真菌','未知','其他'],
    tgindex:0,
    identtgindex:0,
    taxagroup:"全部",
    todate:"2020-04-01",
    fromdate:"2020-04-01",
    tabitems:["未鉴定","已鉴定"],
    TabCur:0,
    unidents:{
      page:1,
      pagesize:30,
      data:[]
    },
    idents:{
      page:1,
      pagesize:30,
      data:[]
    },
    ident:{
      ISNameLa:'',
      ISNameZh:'',
      ISKingdomLa:'',
      ISKingdomZh:'',
      ISPhylumLa:'',
      ISPhylumZh:'',
      ISClassLa:'',
      ISClassZh:'',
      ISOrderLa:'',
      ISOrderZh:'',
      ISFamilyLa:'',
      ISFamilyZh:'',
      ISGenusLa:'',
      ISGenusZh:'',
      ISTaxaGroupLa:'',
      ISTaxaGroupZh:'植物',
      IRemark:'',
      ITaxaLevel:'Species'
    }
  },

  tabSelect:function(e){
    this.setData({
      TabCur: e.currentTarget.dataset.id
    })
  },

  showModal:function(e){
    let _this = this;
    let target = e.currentTarget.dataset.target;
    if(target == "filterModal"){
      _this.setData({
        modalName: target
      });
    }else{
      let group = e.currentTarget.dataset.group;
      let gindex = e.currentTarget.dataset.gindex;
      _this.setData({
        modalName: target,
        currentObserve:{
          group:group,
          gindex:gindex
        }
      });
    }
    
  },

  hideModal(e) {
    this.setData({
      modalName: null,
    });
  },

  filterObserve(){
    let _this = this;
    _this.setData({
      modalName: null,
      unidents:{
        page:1,
        pagesize:30,
        data:[]
      },
      idents:{
        page:1,
        pagesize:30,
        data:[]
      }
    });
    _this.getUnidentObserve();
    _this.getIdentedObserve();
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
    reqdata.a = "getprojects";

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
    let projects = _this.getAllProjects();
    _this.setData({
      todate:nowdate,
      projectgroups:projects
    });
  },

  getUnidentObserve:function(){
    let _this = this;
    let reqdata = {};
    reqdata.a = "getunidentobserve";
    reqdata.page = _this.data.unidents.page;
    reqdata.pagesize = _this.data.unidents.pagesize;
    reqdata.from = _this.data.fromdate;
    reqdata.to = _this.data.todate;
    reqdata.taxa = _this.data.taxagroup;
    reqdata.pid = _this.data.projectgroup;
    reqdata.tid = _this.data.teamgroup;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx',
      method:'GET',
      header:{},
      data:reqdata,
      success:function(res) {
        if(res.data.length >0){
          _this.data.unidents.page = _this.data.unidents.page + 1;
          _this.setData({
            "unidents.data":_this.data.unidents.data.concat(res.data)
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

  getIdentedObserve:function(){
    let _this = this;
    let reqdata = {};
    reqdata.a = "getidentedobserve";
    reqdata.page = _this.data.idents.page;
    reqdata.pagesize = _this.data.idents.pagesize;
    reqdata.from = _this.data.fromdate;
    reqdata.to = _this.data.todate;
    reqdata.taxa = _this.data.taxagroup;
    reqdata.pid = _this.data.projectgroup;
    reqdata.tid = _this.data.teamgroup;
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
        
      }
    });
  },

  identSure:function(){
    
    let _this = this;
    let reqdata = {};
    if(_this.data.ident.ISKingdomLa.trim() == "" && _this.data.spIdentInfo.SPMarkNameZh.trim() == "" && _this.data.spIdentInfo.SPMarkNameLa.trim() == ""){
      wx.showToast({
        title: '鉴定内容不能为空',
        icon:'none',
        duration:2000
      });
      return;
    }
    _this.setData({
      modalName: null,
      splistshow:false
    });
    if(_this.data.identModalBlock == 'handTag'){
      _this.saveHandIdent();
    }
    let observe = _this.data[_this.data.currentObserve.group].data[_this.data.currentObserve.gindex];
    reqdata.uid = app.globalData.neuserInfo.UID;
    reqdata.user = app.globalData.neuserInfo.UserName;
    reqdata.avatar = app.globalData.neuserInfo.UAvatar;
    reqdata.sysrole = app.globalData.neuserInfo.USysRole;
    reqdata.hostid = observe.OID;
    reqdata.poster = observe.OPoster;
    reqdata.namela = _this.data.ident.ISNameLa;
    reqdata.namezh = _this.data.ident.ISNameZh;
    reqdata.kingdomla = _this.data.ident.ISKingdomLa;
    reqdata.kingdomzh = _this.data.ident.ISKingdomZh;
    reqdata.familyla = _this.data.ident.ISFamilyLa;
    reqdata.familyzh = _this.data.ident.ISFamilyZh;
    reqdata.genusla = _this.data.ident.ISGenusLa;
    reqdata.genuszh = _this.data.ident.ISGenusZh;
    reqdata.taxagroupla = _this.data.ident.ISTaxaGroupLa;
    reqdata.taxagroupzh = _this.data.ident.ISTaxaGroupZh;
    reqdata.remark = _this.data.ident.IRemark;
    if(_this.data.ident.ISKingdomLa != "" || _this.data.spIdentInfo.SPMarkNameZh!= "" || _this.data.spIdentInfo.SPMarkNameLa!= ""){
      reqdata.taxalevel = _this.data.ident.ITaxaLevel;
    }else{
      reqdata.taxalevel = "";
    }
    reqdata.phylumla = _this.data.ident.ISPhylumLa;
    reqdata.phylumzh = _this.data.ident.ISPhylumZh;
    reqdata.classla = _this.data.ident.ISClassLa;
    reqdata.classzh = _this.data.ident.ISClassZh;
    reqdata.orderla = _this.data.ident.ISOrderLa;
    reqdata.orderzh = _this.data.ident.ISOrderZh;

    reqdata.a = "saveident";
    
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx',
      method:'POST',
      header:{"Content-Type": "application/x-www-form-urlencoded"},
      data:reqdata,
      success:function(res){

        if(res.data.status == 'ok'){
          wx.showToast({
            title: '鉴定成功',
            icon: 'success',
            duration: 1000
          });
          let group = _this.data.currentObserve.group;
          let gindex = _this.data.currentObserve.gindex;
          if(group == "unidents"){
            _this.data.unidents.data.splice(gindex,1);
            _this.setData({
              unidents:{
                data:_this.data.unidents.data
              }
            });
          }else{
            _this.data.idents.data.splice(gindex,1);
            _this.setData({
              idents:{
                data:_this.data.idents.data
              }
            });
          }
        }else{
          wx.showToast({
            title: '鉴定失败',
            icon: 'none',
            duration: 2000
          });
        }

        _this.setData({
          ident:{
            ISNameLa:'',
            ISNameZh:'',
            ISKingdomLa:'',
            ISKingdomZh:'',
            ISPhylumLa:'',
            ISPhylumZh:'',
            ISClassLa:'',
            ISClassZh:'',
            ISOrderLa:'',
            ISOrderZh:'',
            ISFamilyLa:'',
            ISFamilyZh:'',
            ISGenusLa:'',
            ISGenusZh:'',
            ISTaxaGroupLa:'',
            ISTaxaGroupZh:'',
            IRemark:'',
            ITaxaLevel:'Species'
          }
        });
      }
    })
   
  },

  editinput:function(e){
    let _this = this;
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value;

    _this.data[dataset.obj][dataset.item] = value;
    _this.setData({
      obj: _this.data[dataset.obj]
    });
  },

  IdentTaxaGroupChange:function(e) {
    let _this = this;
    let tgselecti = e.detail.value;
    let tgcontent = _this.data.identtaxagroups[tgselecti];
    _this.setData({
      identtgindex:tgselecti,
      "ident.ISTaxaGroupZh":tgcontent
    });
  },

  switchIdentTag:function(e){
    let _this = this;
    _this.setData({
      identModalBlock:e.currentTarget.dataset.itag
    }); 
  },

  identRemarkInput:function(e){
    let _this = this;
    _this.setData({
      "ident.IRemark":e.detail.value
    });
  },

  TaxaLevelChange:function(e){
    let _this = this;
    let tli = e.detail.value;
    let taxa = _this.data.taxalevels[tli].taxa;
    _this.setData({
      tlindex:tli,
      "ident.ITaxaLevel":taxa
    });
  },

  searchSpecies:function(e){
    let _this = this;
    let sname = e.detail.value;
    let taxa = _this.data.ident.ITaxaLevel;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=searchsp&sname='+sname+'&taxa='+taxa,
      method:'GET',
      header:{},
      success:function(res){
        _this.setData({
          speciesList:res.data,
          splistshow:true
        });
      }
    })
  },

  selectSp:function(e){
    let _this = this;
    let spindex = e.currentTarget.dataset.spi;
    let species = _this.data.speciesList[spindex];
    let namela = '';
    let namezh = '';
    let genusla = '';
    let genuszh = '';
    let familyla = '';
    let familyzh = '';
    let orderla = '';
    let orderzh = '';
    let classla = '';
    let classzh = '';
    let phylumla = '';
    let phylumzh = '';
    switch(_this.data.ident.ITaxaLevel){
      case "Species":
        namela = species.canonical_name;
        namezh = species.species_c;
      case "Genus":
        genusla = species.genus;
        genuszh = species.genus_c;
      case "Family":
        familyla = species.family;
        familyzh = species.family_c;
      case "Order":
        orderla = species.order;
        orderzh = species.order_c;
      case "Class":
        classla = species.class;
        classzh = species.class_c;
      case "Phylum":
        phylumla = species.phylum;
        phylumzh = species.phylum_c;
    }
    _this.setData({
      "ident.ISNameLa":namela,
      "ident.ISNameZh":namezh,
      "ident.ISKingdomLa":species.kingdom,
      "ident.ISKingdomZh":species.kingdom_c,
      "ident.ISPhylumLa":phylumla,
      "ident.ISPhylumZh":phylumzh,
      "ident.ISClassLa":classla,
      "ident.ISClassZh":classzh,
      "ident.ISOrderLa":orderla,
      "ident.ISOrderZh":orderzh,
      "ident.ISFamilyLa":familyla,
      "ident.ISFamilyZh":familyzh,
      "ident.ISGenusLa":genusla,
      "ident.ISGenusZh":genuszh,
      "ident.ISTaxaGroupZh":species.TaxaGroup,
      splistshow:false,
      speciesList:[]
    });
  },

  saveHandIdent:function(){
    let _this = this;
    let namela = '';
    let namezh = '';
    let genusla = '';
    let genuszh = '';
    let familyla = '';
    let familyzh = '';
    let orderla = '';
    let orderzh = '';
    let classla = '';
    let classzh = '';
    let phylumla = '';
    let phylumzh = '';
    let kingdomla = '';
    let kingdomzh = '';

    switch(_this.data.ident.ITaxaLevel){
     case "Species":
        namela = _this.data.spIdentInfo.SPMarkNameLa;
        namezh = _this.data.spIdentInfo.SPMarkNameZh;
        break;
      case "Genus":
        genusla = _this.data.spIdentInfo.SPMarkNameLa;
        genuszh = _this.data.spIdentInfo.SPMarkNameZh;
        break;
      case "Family":
        familyla = _this.data.spIdentInfo.SPMarkNameLa;
        familyzh = _this.data.spIdentInfo.SPMarkNameZh;
        break;
      case "Order":
        orderla = _this.data.spIdentInfo.SPMarkNameLa;
        orderzh = _this.data.spIdentInfo.SPMarkNameZh;
        break;
      case "Class":
        classla = _this.data.spIdentInfo.SPMarkNameLa;
        classzh = _this.data.spIdentInfo.SPMarkNameZh;
        break;
      case "Phylum":
        phylumla = _this.data.spIdentInfo.SPMarkNameLa;
        phylumzh = _this.data.spIdentInfo.SPMarkNameZh;
        break;
      case "Kingdom":
          kingdomla = _this.data.spIdentInfo.SPMarkNameLa;
          kingdomzh = _this.data.spIdentInfo.SPMarkNameZh;
          break;
    }
    _this.setData({
      "ident.ISNameLa":namela,
      "ident.ISNameZh":namezh,
      "ident.ISKingdomLa":kingdomla,
      "ident.ISKingdomZh":kingdomzh,
      "ident.ISPhylumLa":phylumla,
      "ident.ISPhylumZh":phylumzh,
      "ident.ISClassLa":classla,
      "ident.ISClassZh":classzh,
      "ident.ISOrderLa":orderla,
      "ident.ISOrderZh":orderzh,
      "ident.ISFamilyLa":familyla,
      "ident.ISFamilyZh":familyzh,
      "ident.ISGenusLa":genusla,
      "ident.ISGenusZh":genuszh
    });
  },

  showOrignPhoto:function(){
    let _this = this;
    let currentPhotoUrl = _this.data.photosOriUrls[0];
    wx.previewImage({
      urls: _this.data.photosOriUrls,
      current:currentPhotoUrl
    })
  },

  getPhoto:function(e){
    let _this = this;
    let oid = e.currentTarget.dataset.oid;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getphotoinfo&oid='+oid,
      method:'GET',
      header:{},
      success:function(res) {
        let data = res.data;
        let photourls = [];
        for(var i=0; i<data.length; i++){
          photourls.push(data[i].NPOriginPath);
        }
        _this.setData({
          photosOriUrls:photourls
        });
        _this.showOrignPhoto();
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setInitVal();
    _this.getUnidentObserve();
    _this.getIdentedObserve();
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
        _this.getUnidentObserve();
        break;

      case 1:
        _this.getIdentedObserve();
        break;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})