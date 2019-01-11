const api = require('../../api/api');
const util = require('../../utils/util');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
	happy:[
		"驱走霉运，商会帮你转好运",
		"猪年吉祥，商会同仁万事如意",
		"商会同仁共奋进，齐心协力创辉煌",
		"恭喜发财，商会送福，福到运来",
		"爆竹升天送狗岁，商会好礼缀猪年",
		"猪年到来喜迎门，商会欢乐送祝福",
		"猪年喜气多飘扬，商会共议放希望",
		"猪年诸事如意，同仁万事顺心",
		"送去狗年今年旺，商会过年事事新",
	],
	currentIndex:-1,
	showActiveId:"",
	userRemainNum:"",
	canclcik:true
  },
  check:function(e){
	  let index = e.currentTarget.dataset.index;
	  this.setData({
		  currentIndex:index
	  })
  },
  formInput:function(e){
	  let value = e.detail.value;
	  this.setData({
		  content:value,
		  currentIndex:-1
	  })
  },
  sendHappy:function(){
	  let that = this;
	  let canclcik = that.data.canclcik;
	  that.setData({
	  	 canclcik:false
	  })
	  setTimeout(()=>{
		  that.setData({
			 canclcik:true
		  })
	  },3000)
	  if(canclcik){
		  let content="";
		  let params = {};
		  let currentIndex = that.data.currentIndex;
		  if(currentIndex!==-1){
		  		  content = that.data.happy[currentIndex]
		  }else{
		  		  content = that.data.content
		  }
		  if(content){
		  		  params.content = content
		  }else{
		  		  wx.showToast({
		  			  title:"请输入或选择祝福语",
		  			  icon:"none",
		  			  duration:2000
		  		  })
		  		  return false;
		  }
		  params.showActiveId = that.data.showActiveId;
		  api.sendHappy(params).then(res=>{
		  		  let result = res.data;
		  		  if(result.success){
		  			  wx.navigateTo({
		  			    url: '../lanuch-success/lanuch-success'
		  			  })
		  		  }else{
		  			  wx.showToast({
		  				  title:result.message,
		  				  icon:"none",
		  				  duration:2000,
		  				  success:function(res){
		  					  wx.navigateTo({
		  					    url: '../index/index'
		  					  })
		  				  }
		  			  })
		  		  }
		  })
	  }else{
		  wx.showToast({
			  title:"点击过于频繁，请稍后再试",
			  icon:"none",
			  duration:3000
		  })
	  }
	  
  },
  
  
  login: function (code){
	let that = this;
	let showActiveId = that.data.showActiveId;
  	wx.getSetting({
  	  success: res => {
  	     if (res.authSetting['scope.userInfo']) {
  	      wx.getUserInfo({
  	        success: res => {
  			    let userInfo = res.userInfo
  	            app.globalData.userInfo = userInfo;
				let params = {
					appid:"wxa6b6512f943b34ef",
					code:code,
					headUrl:userInfo.avatarUrl,
					nickName:userInfo.nickName
				}
				
				let token = wx.getStorageSync('token');
				let expireDate = wx.getStorageSync('expireDate');
				if(expireDate){
					expireDate = new Date(expireDate).getTime();
				}
				let now = new Date().getTime();
				 
				if(!token || expireDate<now || !expireDate){
					api.login(params).then(res=>{
						let result = res.data;
						console.log("login",res)
						if(result.success){
							wx.setStorage({
								key: 'token',
								data: result.data.token
							})
							wx.setStorage({
								key: 'expireDate',
								data: result.data.expireDate
							})
							that.userShowActiveInfo();
						}
					})
				}else{
					that.userShowActiveInfo();
				}
  	         }
  	      })
  	     }else{
			 wx.navigateTo({
			   url: '../login/login?id='+showActiveId
			 })
		 }
  	  }
  	})
  },
  userShowActiveInfo:function(){
	  let that = this;
	  let showActiveId = that.data.showActiveId;
	  
	  api.userShowActiveInfo({showActiveId:showActiveId}).then(res=>{
		  console.log("result",res)
		  if(res.data.success){
			  that.setData({
			  	userRemainNum:res.data.data.userRemainNum
			  })
		  }else{
			  wx.showToast({
			    title:res.data.message+"，3S后自动登录",
			    icon:"none",
			    duration:2000,
			    success:function(res){
			  	  wx.clearStorageSync()
			  	  util.login()
				  setTimeout(()=>{
				  	 that.userShowActiveInfo()
				  },3000)
			    }
			  })
		  }
	  	
	  }).catch(err=>{
	  	console.log(err)
	  })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	let showActiveId = options.showid;
	this.setData({
		showActiveId:showActiveId
	})
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
	let that = this;
	wx.login({
	  success: res => {
		that.login(res.code)	
	  }
	})
	
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