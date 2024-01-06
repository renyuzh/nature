// pages/oform/oform.js
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
    spIdentInfo:{
      SPMarkNameZh:"",
      SPMarkNameLa:"",
    },
    identModalBlock:"speciesTag",
    pageshow:false,
    options:{},
    imgList: [],
    photosList:[],
    tempImagePaths:[],
    speciesList:[],
    multiIndex:[0,0],
    multiProTeams:[],
    projects:[],
    teams:[],
    slindex:0,
    iwindex:0,
    tgindex:0,
    tlindex:0,
    WildSelections:['未知','非野生','野生'],
    sharelevels:['完全公开','项目内公开','私密'],
    taxagroups:['未知','植物','鸟类','两栖动物','爬行动物','无脊椎动物','无脊椎动物-水生','哺乳动物','鱼类','真菌','其他'],
    taxalevels:[{taxa:'Species',title:'种'},{taxa:'Genus',title:'属'},{taxa:'Family',title:'科'},
    {taxa:'Order',title:'目'},{taxa:'Class',title:'纲'},{taxa:'Phylum',title:'门'},{taxa:'Kingdom',title:'界'}],
    speciesModal:false,
    form:{
      OID:"",
      OSN:"",
      PID:"",
      PSN:"",
      PTitle:"",
      TID:"",
      TSN:"",
      TName:"",
      OTitle:"",
      ObserveDatetime:"",
      OShareLevel:"完全公开",
      ORemark:"",
      OPoster:"",
      OTag:"",
      OCountry:"",
      OProvince:"",
      OCity:"",
      OPlace:"",
      OLocation:"",
      OLongitude:"",
      OLatitude:"",
      OAltitude:"",
      OCoordinateSys:"",
      OSNameLa:"",
      OSNameZh:"",
      OSKingdomLa:"",
      OSKingdomZh:"",
      OSPhylumLa:"",
      OSPhylumZh:"",
      OSClassLa:"",
      OSClassZh:"",
      OSOrderLa:"",
      OSOrderZh:"",
      OSFamilyLa:"",
      OSFamilyZh:"",
      OSGenusLa:"",
      OSGenusZh:"",
      OSTaxaGroupLa:"",
      OSTaxaGroupZh:"未知",    
      OBiologyCount:"",
      OImageCount:"",
      OIsWild:"未知" ,
      OSTaxaLevel:'Species',
      OSRemark:'',
      OType:"现场实录",
      OIUID:app.globalData.neuserInfo.UID,
      OIUserName:app.globalData.neuserInfo.UserName,
      OIAvatar:app.globalData.neuserInfo.UAvatar,
      OISysRole:app.globalData.neuserInfo.USysRole,
      OITime:"",
    }
  },

  switchIdentTag:function(e){
    let _this = this;
    _this.setData({
      identModalBlock:e.currentTarget.dataset.itag
    }); 
  },

  OTypeChange:function(e) {
    let _this = this;
    _this.setData({
      "form.OType":e.detail.value
    });
  },

  MultiColumnChange:function(e) {
    let _this = this;
    var data = {
      multiIndex:_this.data.multiIndex,
      multiProTeams:_this.data.multiProTeams
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    if(e.detail.column == 0){
      data.multiProTeams[1] = _this.data.teams[e.detail.value];
      data.multiIndex[1] = 0;
    }
    this.setData(data);
  },

  MultiChange:function(e) {
    let _this = this;
    _this.data.multiIndex = e.detail.value;
    let rec = _this.data.multiProTeams[1][_this.data.multiIndex[1]];
    _this.setData({
      multiIndex:e.detail.value,
      "form.PID":rec.PID,
      "form.PSN":rec.PSN,
      "form.PTitle":rec.PTitle,
      "form.TID":rec.TID,
      "form.TSN":rec.TSN,
      "form.TName":rec.TName
    });
  },

  saveO:function(){
    let _this = this;
    let reqdata = {};

    reqdata.sysrole = app.globalData.neuserInfo.USysRole;
    reqdata.uid = app.globalData.neuserInfo.UID;
    reqdata.user = app.globalData.neuserInfo.UserName;
    reqdata.avatar = app.globalData.neuserInfo.UAvatar;
    reqdata.oid = _this.data.form.OID;
    reqdata.osn = _this.data.form.OSN;
    reqdata.pid = _this.data.form.PID;
    reqdata.psn = _this.data.form.PSN;
    reqdata.ptitle = _this.data.form.PTitle;
    reqdata.tid = _this.data.form.TID;
    reqdata.tsn = _this.data.form.TSN;
    reqdata.tname = _this.data.form.TName;
    reqdata.otitle = _this.data.form.OTitle;
    reqdata.odate = _this.data.form.ObserveDatetime;
    reqdata.oremark = _this.data.form.ORemark;
    reqdata.otag = _this.data.form.OTag;
    reqdata.ocountry = _this.data.form.OCountry;
    reqdata.oprovince = _this.data.form.OProvince;
    reqdata.ocity = _this.data.form.OCity;
    reqdata.oplace = _this.data.form.OPlace;
    reqdata.olocation = _this.data.form.OLocation;
    reqdata.olon = _this.data.form.OLongitude;
    reqdata.olat = _this.data.form.OLatitude;
    reqdata.oalt = _this.data.form.OAltitude;
    reqdata.coordinatesys = _this.data.form.OCoordinateSys;
    reqdata.osname = _this.data.form.OSNameLa;
    reqdata.osnamezh = _this.data.form.OSNameZh;
    reqdata.oskingdom = _this.data.form.OSKingdomLa;
    reqdata.oskingdomzh = _this.data.form.OSKingdomZh;
    reqdata.osfamily = _this.data.form.OSFamilyLa;
    reqdata.osfamilyzh = _this.data.form.OSFamilyZh;
    reqdata.osgenus = _this.data.form.OSGenusLa;
    reqdata.osgenuszh = _this.data.form.OSGenusZh;
    reqdata.ostaxa = _this.data.form.OSTaxaGroupLa;
    reqdata.ostaxazh = _this.data.form.OSTaxaGroupZh;
    reqdata.obiocount = _this.data.form.OBiologyCount;
    reqdata.oimagecount = _this.data.photosList.length;
    reqdata.osharelevel = _this.data.form.OShareLevel;
    reqdata.oiswild = _this.data.form.OIsWild;
    if(_this.data.form.OSKingdomLa != "" || _this.data.spIdentInfo.SPMarkNameZh!= "" || _this.data.spIdentInfo.SPMarkNameLa!= ""){
      reqdata.taxa = _this.data.form.OSTaxaLevel;
    }else{
      reqdata.taxa = "";
    }
    reqdata.osremark = _this.data.form.OSRemark;
    reqdata.osphylum = _this.data.form.OSPhylumLa;
    reqdata.osphylumzh = _this.data.form.OSPhylumZh;
    reqdata.osclass = _this.data.form.OSClassLa;
    reqdata.osclasszh = _this.data.form.OSClassZh;
    reqdata.osorder = _this.data.form.OSOrderLa;
    reqdata.osorderzh = _this.data.form.OSOrderZh;
    reqdata.otype = _this.data.form.OType;

    if('item' in _this.data.options){
      reqdata.a = 'updateobserve';
      reqdata.oiuid = _this.data.form.OIUID;
      reqdata.oiuser = _this.data.form.OIUserName;
      reqdata.oiavatar = _this.data.form.OIAvatar;
      reqdata.oisysrole = _this.data.form.OISysRole;
      reqdata.oitime = _this.data.form.OITime;
    }else{
      reqdata.a = 'insertobserve';
      reqdata.oiuid = app.globalData.neuserInfo.UID;
      reqdata.oiuser = app.globalData.neuserInfo.UserName;
      reqdata.oiavatar = app.globalData.neuserInfo.UAvatar;
      reqdata.oisysrole = app.globalData.neuserInfo.USysRole;
      reqdata.oitime = _this.data.form.OITime;
    }

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

    wx.setStorageSync('pid', _this.data.form.PID);
    wx.setStorageSync('tid', _this.data.form.TID);
    wx.setStorageSync('OShareLevelIndex', _this.data.slindex);
    wx.setStorageSync('OIsWildIndex', _this.data.iwindex);
    wx.setStorageSync('OSTaxaGroupZhIndex', _this.data.tgindex);
  },

  cancelO:function(){
    wx.navigateBack();
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

  TaxaLevelChange:function(e){
    let _this = this;
    let tli = e.detail.value;
    let taxa = _this.data.taxalevels[tli].taxa;
    _this.setData({
      tlindex:tli,
      "form.OSTaxaLevel":taxa
    });
  },

  TaxaGroupChange:function(e) {
    let _this = this;
    let tgselecti = e.detail.value;
    let tgcontent = _this.data.taxagroups[tgselecti];
    _this.setData({
      tgindex:tgselecti,
      "form.OSTaxaGroupZh":tgcontent
    });
  },

  IsWildChange:function(e){
    let _this = this;
    let iwselecti = e.detail.value;
    let iwconent = _this.data.WildSelections[iwselecti];
    _this.setData({
      iwindex:iwselecti,
      "form.OIsWild":iwconent
    });
  },

  ShareLevelChange:function(e){
    let _this = this;
    let sli = e.detail.value;
    let slcontent = _this.data.sharelevels[sli];
    _this.setData({
      slindex:sli,
      "form.OShareLevel":slcontent
    });
  },

  showSpeciesModal:function(){
    this.setData({
      speciesModal:true
    });
  },

  hideSpeciesModal:function(){
    this.setData({
      speciesModal:false
    });
  },

  searchSpecies:function(e){
    let _this = this;
    let sname = e.detail.value;
    let taxa = _this.data.form.OSTaxaLevel;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=searchsp&sname='+sname+'&taxa='+taxa,
      method:'GET',
      header:{},
      success:function(res){
        _this.setData({
          speciesList:res.data
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

    let spmnamela = "";
    let spmnamezh = "";
    let spmark = 0;

    switch(_this.data.form.OSTaxaLevel){
      case "Species":
        namela = species.canonical_name;
        namezh = species.species_c;
        if(spmark < 1){
          spmark = spmark + 1;
          spmnamela = namela;
          spmnamezh = namezh;
        }
      case "Genus":
        genusla = species.genus;
        genuszh = species.genus_c;
        if(spmark < 1){
          spmark = spmark + 1;
          spmnamela = namela;
          spmnamezh = namezh;
        }
      case "Family":
        familyla = species.family;
        familyzh = species.family_c;
        if(spmark < 1){
          spmark = spmark + 1;
          spmnamela = namela;
          spmnamezh = namezh;
        }
      case "Order":
        orderla = species.order;
        orderzh = species.order_c;
        if(spmark < 1){
          spmark = spmark + 1;
          spmnamela = namela;
          spmnamezh = namezh;
        }
      case "Class":
        classla = species.class;
        classzh = species.class_c;
        if(spmark < 1){
          spmark = spmark + 1;
          spmnamela = namela;
          spmnamezh = namezh;
        }
      case "Phylum":
        phylumla = species.phylum;
        phylumzh = species.phylum_c;
        if(spmark < 1){
          spmark = spmark + 1;
          spmnamela = namela;
          spmnamezh = namezh;
        }
    }

    if(spmark < 1){
      spmnamela = species.kingdom;
      spmnamezh = species.kingdom_c;
    }
  
    _this.setData({
      "spIdentInfo.SPMarkNameLa":spmnamela,
      "spIdentInfo.SPMarkNameZh":spmnamezh,
      "form.OSNameLa":namela,
      "form.OSNameZh":namezh,
      "form.OSKingdomLa":species.kingdom,
      "form.OSKingdomZh":species.kingdom_c,
      "form.OSPhylumLa":phylumla,
      "form.OSPhylumZh":phylumzh,
      "form.OSClassLa":classla,
      "form.OSClassZh":classzh,
      "form.OSOrderLa":orderla,
      "form.OSOrderZh":orderzh,
      "form.OSFamilyLa":familyla,
      "form.OSFamilyZh":familyzh,
      "form.OSGenusLa":genusla,
      "form.OSGenusZh":genuszh,
      "form.OSTaxaGroupZh":species.TaxaGroup,
      speciesModal:false
    });
    for(var i=0; i<_this.data.taxagroups.length; i++){
      if(species.TaxaGroup == _this.data.taxagroups[i]){
        _this.setData({
          "form.OSTaxaGroupZh":species.TaxaGroup,
          tgindex:i
        });
        break;
      }
    }
  },

  reLocate:function(){
    let _this = this;
    wx.chooseLocation({
      complete: (res) => {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success:function(resdata){
            var resdata = resdata.result;
            _this.setData({
              "form.OLongitude":resdata.location.lng,
              "form.OLatitude":resdata.location.lat,
              "form.OLocation":resdata.address,
              "form.OCoordinateSys":"gcj02",
              "form.OCountry":resdata.address_component.nation,
              "form.OProvince":resdata.address_component.province,
              "form.OCity":resdata.address_component.city,
              "form.OPlace":resdata.address_component.district
            });
          }      
        });
      },
    });
  },

  ChooseImage() {
    let _this = this;
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        _this.data.tempImagePaths = tempFilePaths;
        _this.data.imgList = _this.data.imgList.concat(tempFilePaths);
        console.log(_this.data.imgList)
        _this.setData({
          imgList: _this.data.imgList
        });
        wx.showLoading({
          title: '正在上传...',
        });
        _this.uploadSingleImage(0);
      }
    });
  },

  uploadSingleImage:function(filePathIndex){
    let _this = this;
    wx.uploadFile({
      filePath: _this.data.tempImagePaths[filePathIndex],
      name: 'file',
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=uploadobserveimg&oid=' + _this.data.form.OID,
      formData:{},
      success(res){
        const data = JSON.parse(res.data);
        if(data.status == "error"){
          _this.data.imgList.splice(_this.data.imgList.length-_this.data.tempImagePaths.length+filePathIndex,1);
          _this.setData({
            imgList: _this.data.imgList
          });
          _this.data.tempImagePaths.splice(filePathIndex,1);
          if(filePathIndex<_this.data.tempImagePaths.length){
            _this.uploadSingleImage(filePathIndex);
          }else{
            wx.hideLoading();
          }
          
        }else{
          _this.data.photosList.push(data.message);
          _this.setData({
            photosList: _this.data.photosList
          });
          if((filePathIndex+1)<_this.data.tempImagePaths.length){
            _this.uploadSingleImage(filePathIndex+1);
          }else{
            wx.hideLoading();
          }
          if(_this.data.form.OType == "事后补录"){
            _this.getPhotoExif(data.message);
          }
        }
      }
    });
  },

  getPhotoExif:function(npid){
    let _this = this;
    let reqdata = {};
    reqdata.a = "getexif";
    reqdata.npid = npid;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx',
      method:'GET',
      header:{},
      data:reqdata,
      success:function(res){
        if(res.NPTakeTime != "0001-01-01  00:00:00"){
          _this.setData({
            "form.ObserveDatetime":res.NPTakeTime
          });
        }
        if(res.NPLongitude != "0" && res.NPLatitude != "0"){
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.NPLatitude,
              longitude: res.NPLongitude
            },
            success:function(resdata){
              var resdata = resdata.result;
              _this.setData({
                "form.OLongitude":resdata.location.lng,
                "form.OLatitude":resdata.location.lat,
                "form.OLocation":resdata.address,
                "form.OCoordinateSys":"gcj02",
                "form.OCountry":resdata.address_component.nation,
                "form.OProvince":resdata.address_component.province,
                "form.OCity":resdata.address_component.city,
                "form.OPlace":resdata.address_component.district
              });
            }      
          });
        }        
      }
    })
  },

  ViewImage(e) {
    let _this = this;
    wx.previewImage({
      urls: _this.data.imgList,
      current: e.currentTarget.dataset.url
    })
  },

  DelImg(e) {
    let _this = this;
    wx.showModal({
      title:"观测图像",
      content:"确定要删除这张观测图像吗？",
      cancelText:"取消",
      confirmText:"确定",
      success:function(res){
        if(res.confirm){
          let pid = _this.data.photosList[e.currentTarget.dataset.index];
          _this.data.photosList.splice(e.currentTarget.dataset.index,1);
          _this.data.imgList.splice(e.currentTarget.dataset.index,1);
          _this.setData({
            imgList:_this.data.imgList
          });
          if(_this.data.imgList.length == 0){
            wx.hideLoading();
          }
          wx.request({
            url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=deleteobserveimg&photoid='+pid,
            method:'GET',
            header:{},
            success:function(res){}
          })
        }
      }
    });
  },

  getLocationInfo:function(){
    let _this = this;
    qqmapsdk.reverseGeocoder({
      success:function(res){
        var res = res.result;
        _this.setData({
          "form.OLongitude":res.location.lng,
          "form.OLatitude":res.location.lat,
          "form.OLocation":res.address,
          "form.OCoordinateSys":"gcj02",
          "form.OCountry":res.address_component.nation,
          "form.OProvince":res.address_component.province,
          "form.OCity":res.address_component.city,
          "form.OPlace":res.address_component.district
        });
      }      
    });
  },

  getOID:function(){
    let _this = this;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=newobserve',
      method:'GET',
      header:{},
      success:function(res){
        const data = res.data;
        _this.setData({
          "form.OID":data.message
        });
      }
    })
  },

  formatNumber:function(n){
    n = n.toString();
    return n[1] ? n : '0' + n;
  },

  formatTime:function(){
    let date = new Date(Date.now());
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute, second].map(this.formatNumber).join(':');
  },

  setInitVal:function(){
    let _this = this;
    let odatetime = _this.formatTime();
    _this.data.form.OITime = odatetime;

    let Sto_slindex = 0;
    let Sto_iwindex = 0;
    let Sto_tgindex = 0;
    if(wx.getStorageSync('OShareLevelIndex')){
      Sto_slindex = wx.getStorageSync('OShareLevelIndex');
    }
    if(wx.getStorageSync('OIsWildIndex')){
      Sto_iwindex = wx.getStorageSync('OIsWildIndex');
    }
    if(wx.getStorageSync('OSTaxaGroupZhIndex')){
      Sto_tgindex = wx.getStorageSync('OSTaxaGroupZhIndex');
    }

    _this.setData({
      "form.ObserveDatetime":odatetime,
      slindex:Sto_slindex,
      iwindex:Sto_iwindex,
      tgindex:Sto_tgindex
    });
  },

  getProjectsTeams:function(){
    let _this = this;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getproteamlist&uid=' + app.globalData.neuserInfo.UID,
      method:'GET',
      header:{},
      success:function(res){
        let projectdata = [{PID:'',PSN:'',PTitle:'无',TID:'',TSN:'',TName:'无'}];
        projectdata = projectdata.concat(res.data);
        let curPro = '';
        let prosArray = [{PID:'',PSN:'',PTitle:'无',TID:'',TSN:'',TName:'无',title:'无'}];
        let teamArray = [{PID:'',PSN:'',PTitle:'无',TID:'',TSN:'',TName:'无',title:'无'}];
        let teamsArray = [];
       for(var i=1; i<projectdata.length; i++){
         let rec = projectdata[i];
         let rect = {};
         rect.PID = rec.PID;
         rect.PSN = rec.PSN;
         rect.PTitle = rec.PTitle;
         rect.TID = rec.TID;
         rect.TSN = rec.TSN;
         rect.TName = rec.TName;
         rect.title = rec.PTitle;
         if(curPro!=rec.PID){
          prosArray.push(rect);
          teamsArray.push(teamArray);
          teamArray=[];
          curPro = rec.PID;
         }
         rec.title = rec.TName;
         teamArray.push(rec);
       }
       teamsArray.push(teamArray);
       let pid = '';
       let tid = '';
       if('pid' in _this.data.options){
        pid = _this.data.options.pid;
       }else{
         try{
           let upid = wx.getStorageSync('pid');
           if(upid){
            pid = upid;
           }else{
            pid = '';
           }
         }catch(e){
           console.log(e);
         }  
       }
       if('tid' in _this.data.options){
        tid = _this.data.options.tid;
       }else{
         try{
           let utid = wx.getStorageSync('tid');
           if(utid){
            tid = utid;
           }else{
            tid = '';
           }
         }catch(e){
           console.log(e);
         }  
       }
       let pindex = 0;
       let tindex = 0;
       if(pid != ''){
         for(var j=0; j<prosArray.length; j++){
           if(prosArray[j].PID == pid){
            pindex = j;
            break;
           }
         }
       }
       if(tid != ''){
         for(var k=0; k<teamsArray[pindex].length; k++){
           if(teamsArray[pindex][k].TID == tid){
            tindex = k;
            break;
           }
         }
       }
       let rec = teamsArray[pindex][tindex];
       _this.setData({
        multiIndex:[pindex,tindex],
        multiProTeams:[prosArray,teamsArray[pindex]],
        projects:prosArray,
        teams:teamsArray,
        "form.PID":rec.PID,
        "form.PSN":rec.PSN,
        "form.PTitle":rec.PTitle,
        "form.TID":rec.TID,
        "form.TSN":rec.TSN,
        "form.TName":rec.TName
       }); 
      }
    })
  },

  setPicker:function(){
    let _this = this;
    let _tlindex = 0;
    for(var i=0; i<_this.data.taxalevels.length; i++){
      if(_this.data.taxalevels[i].taxa == _this.data.form.OSTaxaLevel){
        _tlindex = i;
        break;
      }
    }
    let _tgindex = 0;
    for(var j=0; j<_this.data.taxagroups.length; j++){
      if(_this.data.taxagroups[j] == _this.data.form.OSTaxaGroupZh){
        _tgindex = j;
        break;
      }
    }
    let _iwindex = 0;
    for(var k=0; k<_this.data.WildSelections.length; k++){
      if(_this.data.WildSelections[k] == _this.data.form.OIsWild){
        _iwindex = k;
        break;
      }
    }
    let _slindex = 0;
    for(var l=0; l<_this.data.sharelevels.length; l++){
      if(_this.data.sharelevels[l] == _this.data.form.OShareLevel){
        _slindex = l;
        break;
      }
    }
    _this.setData({
      tlindex:_tlindex,
      tgindex:_tgindex,
      iwindex:_iwindex,
      slindex:_slindex,
    });
  },

  getObservePhotos:function(){
    let _this = this;
    wx.request({
      url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getphotoinfo&oid='+_this.data.form.OID,
      method:'GET',
      header:{},
      success:function(res){
        let urls = [];
        let guids = [];
        for(var i=0; i<res.data.length; i++){
          let rec = res.data[i];
          urls.push(rec.NPNormalPath);
          guids.push(rec.NPID);
        }
        _this.setData({
          imgList:urls,
          photosList:guids
        });
      }
    })
  },

  saveHandIdent:function(e){
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

    switch(_this.data.form.OSTaxaLevel){
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
      "spIdentInfo.SPMarkNameLa":_this.data.spIdentInfo.SPMarkNameLa,
      "spIdentInfo.SPMarkNameZh":_this.data.spIdentInfo.SPMarkNameZh,
      "form.OSNameLa":namela,
      "form.OSNameZh":namezh,
      "form.OSKingdomLa":kingdomla,
      "form.OSKingdomZh":kingdomzh,
      "form.OSPhylumLa":phylumla,
      "form.OSPhylumZh":phylumzh,
      "form.OSClassLa":classla,
      "form.OSClassZh":classzh,
      "form.OSOrderLa":orderla,
      "form.OSOrderZh":orderzh,
      "form.OSFamilyLa":familyla,
      "form.OSFamilyZh":familyzh,
      "form.OSGenusLa":genusla,
      "form.OSGenusZh":genuszh,
      speciesModal:false
    });
  },

  setSPMarkName:function(){
    let _this = this;
    switch(_this.data.form.OSTaxaLevel){
      case "Species":
        _this.data.spIdentInfo.SPMarkNameLa = _this.data.form.OSNameLa;
        _this.data.spIdentInfo.SPMarkNameZh = _this.data.form.OSNameZh;
        break;
      case "Genus":
        _this.data.spIdentInfo.SPMarkNameLa = _this.data.form.OSGenusLa;
        _this.data.spIdentInfo.SPMarkNameZh = _this.data.form.OSGenusZh;
        break;
      case "Family":
        _this.data.spIdentInfo.SPMarkNameLa = _this.data.form.OSFamilyLa;
        _this.data.spIdentInfo.SPMarkNameZh = _this.data.form.OSFamilyZh;
        break;
      case "Order":
        _this.data.spIdentInfo.SPMarkNameLa = _this.data.form.OSOrderLa;
        _this.data.spIdentInfo.SPMarkNameZh = _this.data.form.OSOrderZh;
        break;
      case "Class":
        _this.data.spIdentInfo.SPMarkNameLa = _this.data.form.OSClassLa;
        _this.data.spIdentInfo.SPMarkNameZh = _this.data.form.OSClassZh;
        break;
      case "Phylum":
        _this.data.spIdentInfo.SPMarkNameLa = _this.data.form.OSPhylumLa;
        _this.data.spIdentInfo.SPMarkNameZh = _this.data.form.OSPhylumZh;
        break;
      case "Kingdom":
        _this.data.spIdentInfo.SPMarkNameLa = _this.data.form.OSKingdomLa;
        _this.data.spIdentInfo.SPMarkNameZh = _this.data.form.OSKingdomZh;
          break;
    }
    _this.setData({
      "spIdentInfo.SPMarkNameLa":_this.data.spIdentInfo.SPMarkNameLa,
      "spIdentInfo.SPMarkNameZh":_this.data.spIdentInfo.SPMarkNameZh
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    if(app.globalData.neuserInfo.UID == ''){
      _this.setData({
        pageshow:false
      });
      wx.showToast({
        title: '未登录用户无法观测',
        icon:'none',
        duration:2000
      });
    }else{
      _this.setData({
        options:options,
        pageshow:true
      });
      if('item' in options){
        _this.data.form = JSON.parse(options.item);
        _this.setData({
          form:JSON.parse(options.item)
        });
        wx.setStorageSync('pid', _this.data.form.PID);
        wx.setStorageSync('tid', _this.data.form.TID);
        _this.getProjectsTeams();
        _this.setPicker();
        _this.getObservePhotos();
        _this.setSPMarkName();
      }else{
        _this.setInitVal();
        _this.getOID();
        _this.getLocationInfo();
        _this.getProjectsTeams();
      }
      if(_this.data.form.OSTaxaLevel.trim() == ""){
        _this.setData({
          "form.OSTaxaLevel":'Species'
        });
      }
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