const util = require('../utils/util.js');
const api = {
	login:function(params){
		return util.fetch("/mem-user/login",params,"get")
	},
	showPage:function(params){
		return util.fetch("/show/page",params,"get")
	},
	showActivePage:function(params){
		return util.fetch("/show-active/page",params,"get")
	},
	publish:function(params){
		return util.fetch("/show-active/publish",params,"post")
	},
	showActiveClose:function(params){
		return util.fetch("/show-active/close",params,"get")
	},
	sendHappy:function(params){
		return util.fetch("/show-active-user/sendHappy",params,"post")
	},
	pageUserJoin:function(params){
		return util.fetch("/show-active-user/pageUserJoin",params,"get")
	},
	
	userShowActiveInfo:function(params){
		return util.fetch("/show-active-user/userShowActiveInfo",params,"get")
	},

	
}
module.exports = api