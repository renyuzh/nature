//app.js
App({
  onLaunch: function () {
    let _this = this;
    _this.getWxSystemInfo();
    _this.getNEUserInfo();
    _this.globalData.odatetime = _this.formatTime().substring(0, 14) + '00:00';
  },
  getNEUserInfo: function () {
    let _this = this;
    try {
      var neftoken = wx.getStorageSync('neftoken');
      if (neftoken) {
        wx.request({
          url: 'https://explore.iconserve.org.cn/API/NEwx.ashx?a=getuserinfo&logontoken=' + neftoken,
          method: 'GET',
          header: {},
          success: function (res) {
            if (res.data.length > 0) {
              _this.globalData.neuserInfo = res.data[0];
            }
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  },
  getWxSystemInfo: function () {
    wx.getSystemInfo({
      success: e => {
        this.globalData.wxSysteminfo = e;
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
  },
  formatNumber: function (n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  },

  formatTime: function () {
    let date = new Date(Date.now());
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute, second].map(this.formatNumber).join(':');
  },
  globalData: {
    neuserInfo: {
      USysRole: 'guest',
      UID: ''
    },
    statisUpdateTime: '',
    controlTags: {},
    ColorList: [{
        title: '嫣红',
        name: 'red',
        color: '#e54d42'
      },
      {
        title: '桔橙',
        name: 'orange',
        color: '#f37b1d'
      },
      {
        title: '明黄',
        name: 'yellow',
        color: '#fbbd08'
      },
      {
        title: '橄榄',
        name: 'olive',
        color: '#8dc63f'
      },
      {
        title: '森绿',
        name: 'green',
        color: '#39b54a'
      },
      {
        title: '天青',
        name: 'cyan',
        color: '#1cbbb4'
      },
      {
        title: '海蓝',
        name: 'blue',
        color: '#0081ff'
      },
      {
        title: '姹紫',
        name: 'purple',
        color: '#6739b6'
      },
      {
        title: '木槿',
        name: 'mauve',
        color: '#9c26b0'
      },
      {
        title: '桃粉',
        name: 'pink',
        color: '#e03997'
      },
      {
        title: '棕褐',
        name: 'brown',
        color: '#a5673f'
      },
      {
        title: '玄灰',
        name: 'grey',
        color: '#8799a3'
      },
      {
        title: '草灰',
        name: 'gray',
        color: '#aaaaaa'
      },
      {
        title: '墨黑',
        name: 'black',
        color: '#333333'
      },
      {
        title: '雅白',
        name: 'white',
        color: '#ffffff'
      },
    ]
  }
})