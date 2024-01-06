// pages/odetail/odetail.js
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
    cardCur: 0,
    modalName: null,
    myMapMarkers:[],
    splistshow:false,
    CanIdent:false,
    CanComment:false,
    tgindex:0,
    tlindex:0,
    taxalevels:[{taxa:'Species',title:'种'},{taxa:'Genus',title:'属'},{taxa:'Family',title:'科'},
    {taxa:'Order',title:'目'},{taxa:'Class',title:'纲'},{taxa:'Phylum',title:'门'},{taxa:'Kingdom',title:'界'}],
    taxagroups:['植物','鸟类','两栖动物','爬行动物','无脊椎动物','无脊椎动物-水生','哺乳动物','鱼类','真菌','未知','其他'],
    observe:{},
    photos:[],
    photosOriUrls:[],
    speciesList:[],
    idents:[],
    comments:[],
    commentContent:'',
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

  TaxaGroupChange:function(e) {
    let _this = this;
    let tgselecti = e.detail.value;
    let tgcontent = _this.data.taxagroups[tgselecti];
    _this.setData({
      tgindex:tgselecti,
      "ident.ISTaxaGroupZh":tgcontent
    });
  },

  switchIdentTag:function(e){
    let _this = this;
    _this.setData({
      identModalBlock:e.currentTarget.dataset.itag
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

    for(var i=0; i<_this.data.taxagroups.length; i++){
      if(species.TaxaGroup == _this.data.taxagroups[i]){
        _this.setData({
          "ident.ISTaxaGroupZh":species.TaxaGroup,
          tgindex:i
        });
        break;
      }
    }
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

  submitComment:function(){
    let _this = this;
    if(_this.data.commentContent.trim() == ""){
      wx.showToast({
        title: '评论内容不能为空',
        icon:"none",
        duration:2000
      });
      return;
    }
    let reqdata = {};
    reqdata.uid = app.globalData.neuserInfo.UID;
    reqdata.user = app.globalData.neuserInfo.UserName;
    reqdata.avatar = app.globalData.neuserInfo.UAvatar;
    reqdata.content = _this.data.commentContent;
    reqdata.hostid = _this.data.observe.OID;

    reqdata.a = "savecomment";

    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx',
      method:'POST',
      header:{"Content-Type": "application/x-www-form-urlencoded"},
      data:reqdata,
      success:function(res){
        if(res.data.status == 'ok'){
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 1000
          });
          _this.getComment(_this.data.observe.OID);
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

  commentInput:function(e){
    let _this = this;
    _this.setData({
      commentContent:e.detail.value
    });
  },

  identRemarkInput:function(e){
    let _this = this;
    _this.setData({
      "ident.IRemark":e.detail.value
    });
  },

  showOrignPhoto:function(e){
    let _this = this;
    let currentPhotoUrl = e.currentTarget.dataset.currentPhoto;
    wx.previewImage({
      urls: _this.data.photosOriUrls,
      current:currentPhotoUrl
    })
  },

  showModal(e) {
    let _this = this;
    _this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  hideModal(e) {
    let _this = this;
    _this.setData({
      modalName: null
    })
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
    reqdata.uid = app.globalData.neuserInfo.UID;
    reqdata.user = app.globalData.neuserInfo.UserName;
    reqdata.avatar = app.globalData.neuserInfo.UAvatar;
    reqdata.sysrole = app.globalData.neuserInfo.USysRole;
    reqdata.hostid = _this.data.observe.OID;
    reqdata.poster = _this.data.observe.OPoster;
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
          _this.getIdent(_this.data.observe.OID);
          _this.getObserve(_this.data.observe.OID);
        }else{
          wx.showToast({
            title: '鉴定失败',
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
   
  },

  getObserve:function(oid){
    let _this = this;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getobserveinfo&oid='+oid,
      method:'GET',
      header:{},
      success:function(res) {
        let curObserve = res.data[0];
        const customCallout = {
          latitude: curObserve.OLatitude,
          longitude: curObserve.OLongitude,
          iconPath: '/images/location.png'
        }
        _this.setData({
          observe:res.data[0],
          myMapMarkers:[customCallout]
        });

      }
    });
  },

  getPhoto:function(oid){
    let _this = this;
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
          photos:res.data,
          photosOriUrls:photourls
        });
      }
    });
  },

  getIdent:function(oid){
    let _this = this;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getidents&hostid='+oid,
      method:'GET',
      header:{},
      success:function(res) {
        _this.setData({
          idents:res.data
        });
      }
    });
  },

  getComment:function(oid){
    let _this = this;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getcomments&hostid='+oid,
      method:'GET',
      header:{},
      success:function(res) {
        _this.setData({
          comments:res.data
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.towerSwiper('photos');
    _this.getObserve(options.oid);
    _this.getPhoto(options.oid);
    _this.getIdent(options.oid);
    _this.getComment(options.oid);
    _this.setVal();
  },

  setVal:function() {
    let _this = this;
    let canident = false;
    let cancomment = false;
    if('UID' in app.globalData.neuserInfo && app.globalData.neuserInfo.UID != ''){
      canident = true;
      cancomment = true;
    }
    _this.setData({
      CanIdent:canident,
      CanComment:cancomment,
    });
  },

  cardSwiper(e) {
    let _this = this;
    _this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let _this = this;
    let list = _this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    _this.setData({
      photos: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    let _this = this;
    _this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    let _this = this;
    _this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let _this = this;
    let direction = _this.data.direction;
    let list = _this.data.photos;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      _this.setData({
        photos: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      _this.setData({
        photos: list
      })
    }
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
    _this.setVal();
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