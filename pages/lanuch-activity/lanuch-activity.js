let api = require('../../api/api');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		startDate:"开始日期",
		endDate:"结束日期",
		nowDate:"",
		showActiveTitle:"",
		maxUserNum:1,
		userPerPlayNum:1,
		showId:"",
		startTime:"开始时间",
		endTime:"结束时间",
  },
  bindDateChange:function(e){
    this.setData({
      startDate: e.detail.value
    })
  },
	bindDateChange2:function(e) {
	  this.setData({
	    endDate: e.detail.value
	  })
	},
	maxUserNumChange:function(e){
		this.setData({
		  maxUserNum: e.detail.value
		})
	},
	userPerPlayNumChange:function(e){
		this.setData({
		  userPerPlayNum: e.detail.value
		})
	},
	showActiveTitleChange:function(e){
		this.setData({
		  showActiveTitle: e.detail.value
		})
	},
	bindTimeChange:function(e){
		this.setData({
		  startTime: e.detail.value+":00"
		})
	},
	bindTimeChange2:function(e){
		this.setData({
		  endTime: e.detail.value+":00"
		})
	},
	publish:function(){
		let that = this;
		let params = {};
		let _endDate = that.data.endDate;
		let _startDate = that.data.startDate;
		let _endTime = that.data.endTime;
		let _startTime = that.data.startTime;
		let _maxUserNum = that.data.maxUserNum;
		let _userPerPlayNum = that.data.userPerPlayNum;
		let _showId = that.data.showId;
		let _showActiveTitle = that.data.showActiveTitle;
		let endDate = "";
		let mustEndDate = that.data.mustEndDate;
		mustEndDate = mustEndDate.replace(/-/g, '/');
		mustEndDate = new Date(mustEndDate).getTime();
		
		if(_endDate && _endDate!=="结束日期" && _endTime && _endTime!=="结束时间"){
			endDate = _endDate+" "+_endTime;
			params.endDate = endDate;
			endDate = endDate.replace(/-/g, '/');
			endDate = new Date(endDate).getTime();
			if(endDate>mustEndDate){
				wx.showToast({
					title:"设置的结束时间超出规定时间",
					icon:'none',
					duration:2000
				})
				return false;
			}
		}else{
			wx.showToast({
				title:"请选择结束日期和时间",
				icon:'none',
				duration:2000
			})
			return false;
		}
		let startDate = "";
		if(_startDate && _startDate!=="开始日期" && _startTime && _startTime!=="开始时间"){
			startDate = _startDate+" "+_startTime
			params.startDate = startDate;
		}else{
			wx.showToast({
				title:"请选择开始日期和时间",
				icon:'none',
				duration:2000
			})
			return false;
		}
		
		if(_maxUserNum){
			params.maxUserNum = _maxUserNum;
		}else{
			wx.showToast({
				title:"请选择输入标题最大人数",
				icon:'none',
				duration:2000
			})
			return false;
		}
		
		if(_userPerPlayNum){
			params.userPerPlayNum = _userPerPlayNum;
		}else{
			wx.showToast({
				title:"请输入每次参与次数",
				icon:'none',
				duration:2000
			})
			return false;
		}
		
		if(_showActiveTitle){
			params.showActiveTitle = _showActiveTitle;
		}else{
			wx.showToast({
				title:"请选择输入标题",
				icon:'none',
				duration:2000
			})
			return false;
		}
		
		params.showId =  _showId;
// 		let params = {
// 			"endDate": endDate,
// 			"maxUserNum": parseInt(_maxUserNum),
// 			"showActiveTitle": that.data.showActiveTitle,
// 			"showId": parseInt(_showId),
// 			"startDate":startDate,
// 			"userPerPlayNum": parseInt(_userPerPlayNum) 
// 		}
		api.publish(params).then(res=>{
				let result = res.data
				if(result.success){
					wx.showToast({
						title:"发起成功",
						duration:2000,
						success:function(){
							wx.switchTab({
								url:'../lanuch/lanuch'
							})
						}
					})
				}else{
					wx.showToast({
						title:result.message,
						icon:'none',
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
	},
  /**
   * 生命周期函数--监听页面加载
	 * 
   */
  onLoad: function (options) {
		let that = this;
		let showId = options.showid;
		let title = options.title;
		let enddate = options.enddate;
		wx.setNavigationBarTitle({
		  title: title
		})
		
		let nowDate = new Date();
		let newDate = this.getDate(nowDate)
		let newTime = this.getTime(nowDate)
		nowDate = newDate+" "+newTime;
		let endDate = enddate.substring(0,10);
		let endTime = enddate.substring(11)
		that.setData({
			nowDate:newDate,
			nowTime:newTime,
			startDate:newDate,
			startTime:newTime,
			showId:showId,
			endDate:endDate,
			endTime:endTime,
			mustEndDate:enddate
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
	
  },
  getTime:function(date){
	  let hour = date.getHours();
	  let minute = date.getMinutes();
	  if (hour >= 1 && hour <= 9) {
	  		  hour = "0" + hour;
	  }
	  if (minute >= 0 && minute <= 9) {
	  		  minute = "0" + minute;
	  }
	  let newTime = hour+":"+minute+":00"
	  return newTime
  },
  getDate:function(date){
	  let year = date.getFullYear();
	  let month = date.getMonth() + 1;
	  let strDate = date.getDate();
	  if (month >= 1 && month <= 9) {
		  month = "0" + month;
	  }
	  if (strDate >= 0 && strDate <= 9) {
		  strDate = "0" + strDate;
	  }
	  let newDate = year+"-"+month+"-"+strDate;
	  return newDate
	  
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