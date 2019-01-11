const api = require('../../api/api');
const util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
	pageNum:1,
	pageSize:10,
	records:[],
	hasdata:true
  },
  pageUserJoin:function(pageNum){
	  let params = {
		  pageNum:pageNum,
		  pageSize:10
	  }
	  let that = this;
	  let hasdata = that.data.hasdata;
	  if(hasdata || pageNum==1){
	  	wx.showLoading({
	  		title:"加载中"
	  	})
	  	api.pageUserJoin(params).then(res=>{
			if(res.data.success){
				let records = res.data.data.records;
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
				
				let flag = true;
				let total = res.data.data.total;
				let _total = (parseInt(params.pageNum))*(parseInt(params.pageSize))
				if(total==_total || total<_total){
					flag = false;
				}
				that.setData({
					records:list,
					pageNum:pageNum,
					hasdata:flag
				})
				wx.hideLoading();
			}else{
				wx.showToast({
				  title:res.data.message+"，3S后自动登录",
				  icon:"none",
				  duration:3000,
				  success:function(res){
					  wx.clearStorageSync()
					  util.login()
					  setTimeout(()=>{
						  that.pageUserJoin(pageNum)
					  },3000)
				  }
				})
			}
	  		
	  	})
	  }
  },
   toDetail:function(e){
  	let showid = e.currentTarget.dataset.showid;
  	let status = e.currentTarget.dataset.status;
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	
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
	let pageNum = that.data.pageNum;
	
	
	util.login().then(()=>{
		that.pageUserJoin(pageNum)
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
  onShareAppMessage: function (e) {
	return {
		title: '蜜健',
		path: '/pages/detail/detail?showid='+e.target.dataset.showid
	}
  }
})