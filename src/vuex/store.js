import Vue from 'vue';
import Vuex from 'vuex'; //引入vuex

import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import modules from './modules'

Vue.use(Vuex);

//创建一个store，可以将store理解为一个全局的数据的仓库
const store = new Vuex.Store({
	//state对象
	state: {
		// url: 'https://armapi.e7vr.cn',
		// url: 'http://api.arm.cc',
        // url: 'api.smartfactory.cc',
		
		
        // url: 'https://sfapi.ueware.com', // 主控正式
		// url: 'https://tsfapi.ueware.com', // 主控测试
		
		// url: 'https://sfmapi.ueware.com', // 被控正式
		// url: 'http://tsfapi.iesroad.com', // 被控测试
		
		// url: 'http://192.168.3.11:99', // 北京ipad正式(打包地址)
		// url: 'http://192.168.3.2:88', // 北京ipad(本地测试)
		// url: 'https://sfapi.ueware.cc', // 北京ipad...
		
		/* 临时地址 */
		url: 'http://192.168.3.2:100/', // 主控
		// url: 'http://192.168.3.2:88', // 被控
		
		token: '',
		user: '',
		name: '',
		timeplet: 0,
		ifThisPage: false,
		headStatus: false,
		key: '',
		openeds: '',
		
		radio8: '',
	},
	getters,
	mutations,
	actions,
	modules,
});
export default store
