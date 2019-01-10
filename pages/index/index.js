const api = require('../../api/api');
const util = require('../../utils/util');
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
		pageNum:1,
		records:[]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
	
	toDetail:function(e){
		let showid = e.currentTarget.dataset.showid;
		let status = e.currentTarget.dataset.status;
		let title = e.currentTarget.dataset.title;
		if(status==10){
			wx.navigateTo({
			  url: '../detail/detail?showid='+showid
			})
		}else{
			wx.showToast({
				icon:'none',
				duration:2000,
				title:"该活动已结束"
			})
		}
		
	},
	toLanuch:function(e){
		let showid = e.currentTarget.dataset.showid;
		let title = e.currentTarget.dataset.title;
		wx.navigateTo({
		  url: '../lanuch-activity/lanuch-activity?showid='+showid+'&title='+title
		})
	},
	showPage:function(pageNum){
		wx.showLoading({
			title:"加载中"
		})
		let that = this;
		let params = {
			pageNum:pageNum,
			pageSize:10
		}
		api.showPage(params).then(res=>{
			let records = res.data.data.records;
			if(records){
				
			}
			let _records = that.data.records;
			let list;
			if(params.pageNum==1){
				list = records
			}else{
				list = [..._records,...records]
			}
			
			
			if(list){
				list.map(item=>{
						item.startDate = item.startDate.substring(0,10);
						item.startDate = item.startDate.replace(/-/g,'.');
						item.endDate = item.endDate.substring(0,10);
						item.endDate = item.endDate.replace(/-/g,'.')
				})
			}
			
			that.setData({
				records:list,
				pageNum:pageNum
			})
			wx.hideLoading();
		})
	},
	
	onReachBottom: function () {
		let that = this;
		let pageNum = that.data.pageNum;
		pageNum = pageNum+1;
		that.showPage(pageNum)
	},
	onShow:function(){
		let that = this;
		that.showPage(1)
		util.login()
		
	},

  onLoad: function (options) {
	  let url = options.url;
	  if(url){
		  console.log(url)
	  }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
