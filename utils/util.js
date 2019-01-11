const api = require('../api/api')

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const login = ()=>{
	
	return new Promise((resolve,reject)=>{
		wx.login({
		  success: res => {
			let code = res.code
			wx.getSetting({
			  success: res => {
			     if (res.authSetting['scope.userInfo']) {
			      wx.getUserInfo({
			        success: res => {
						let userInfo = res.userInfo
						//app.globalData.userInfo = userInfo;
						let params = {
							appid:"wxa6b6512f943b34ef",
							code:code,
							headUrl:userInfo.avatarUrl,
							nickName:userInfo.nickName
						}
						
						let token = wx.getStorageSync('token');
						let expireDate = wx.getStorageSync('expireDate');
						expireDate = new Date(expireDate).getTime();
						let now = new Date().getTime();
						
						 if(!token || expireDate<now || !expireDate){
							 
							wx.request({
							 	url: "https://game.51tjs.cn/mem-user/login", 
							 	method: "get",
							 	data:params,
							 	success: function(res){
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
										resolve()
										
									}
								}
							})
						}else{
							resolve()
						}
			         }
			      })
			     }else{
					 wx.navigateTo({
					   url: '../login/login'
					 })
				 }
			  }
			})
		  }
		})
	})
	
}
const fetch = (url, params, method) =>{
	return new Promise(function (resolve, reject) {
		let token = wx.getStorageSync("token")
		let header = {};
		if(token){
			header = {
				"X-AUTH":token
			}
		}
		let param = params;
    
		wx.request({
			url: "https://game.51tjs.cn"+url, 
			//url: "http://mjtest.51tjs.cn"+url, 
			method: method,
			data:param,
			header:header,
			success: resolve,
			fail: reject
		})
	});
}
module.exports = {
  formatTime: formatTime,
	fetch:fetch,
	login:login
}
