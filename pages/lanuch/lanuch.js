const api = require('../../api/api');
const util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		dialog:false,
		pageNum:1,
		records:[],
		hasdata:true
  },
  toDetail:function(e){
  	let showid = e.currentTarget.dataset.showid;
  	let status = e.currentTarget.dataset.status;
	let hasStart = e.currentTarget.dataset.hasstart;
	console.log("hasStart",hasStart)
  	if(status==10 && hasStart){
  		wx.navigateTo({
  		  url: '../detail/detail?showid='+showid
  		})
  	}else if(!hasStart && status==10){
		wx.showToast({
			icon:'none',
			duration:2000,
			title:"该活动未开始"
		})
	}else if(hasStart && status!==10){
  		wx.showToast({
  			icon:'none',
			duration:2000,
  			title:"该活动已结束"
  		})
  	}
  },
  dialogShow:function(){
		this.setData({
			dialog:!this.data.dialog
		})
  },
  getClipboardData:function(){
		wx.setClipboardData({
			data: 'https://5782426-Light-Themed-UI/',
			success(res) {
				
			}
		})
  },
  showActiveClose:function(e){
	  let showActiveId =  e.currentTarget.dataset.showid;
	  let that=this
	  wx.showModal({
		  title: '提示',
		  content: '是否关闭该活动',
		  success(res) {
			if (res.confirm) {
				wx.showLoading({
					title:"加载中"
				})
			  api.showActiveClose({showActiveId:showActiveId}).then(res=>{
				  wx.hideLoading();
				  that.showActivePage(1)
			  })
			} else if (res.cancel) {
			  
			}
		  }
		})
	  //api.showActiveClose()
  },
	showActivePage:function(pageNum){
		
		let that = this;
		let params = {
			pageNum:pageNum,
			pageSize:10
		}
		let hasdata = that.data.hasdata;
		if(hasdata || pageNum==1){
			wx.showLoading({
				title:"加载中"
			})
			
			api.showActivePage(params).then(res=>{
				if(res.data.success){
					let records = res.data.data.records;
					let _records = that.data.records;
					let list;
					if(params.pageNum==1){
						list = records
					}else{
						list = [..._records,...records]
					}
					let now = new Date().getTime();
					let _itemStartDate;
					let olddata ='2018-08-30 11:00:00';
 


				list.map(item=>{
						_itemStartDate = item.startDate.replace(/-/g, '/');
						_itemStartDate = new Date(_itemStartDate).getTime();
						
						_itemStartDate>now ? item.hasStart = false : item.hasStart = true;
						item.startDate2 = item.startDate.substring(0,10);
						item.startDate2 = item.startDate2.replace(/-/g,'.');

						item.endDate2 = item.endDate.substring(0,10);
						item.endDate2 = item.endDate2.replace(/-/g,'.')
					})
					let flag = true;
					let total = res.data.data.total;
					let _total = (parseInt(params.pageNum))*(parseInt(params.pageSize))
					if(total==_total || total<_total){
						flag = false;
					}
					console.log(list)
					that.setData({
						records:list,
						pageNum:pageNum,
						hasdata:flag
					})
					wx.hideLoading();
				}else{
					wx.showToast({
					  title:res.data.message,
					  icon:"none",
					  duration:2000,
					  success:function(res){
						  wx.clearStorageSync()
						  wx.switchTab({
							url: '../index/index'
						  })
					  }
					})
				}
				
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
	that.setData({
		hasData:true
	})
	that.showActivePage(1)
	util.login()
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
		let that = this;
		let pageNum = that.data.pageNum;
		pageNum = pageNum + 1;
		that.showActivePage(pageNum)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
	 console.log(e)
  	return {
  		title: '蜜健',
  		path: '/pages/detail/detail?showid='+e.target.dataset.showid
  	}
  }
})