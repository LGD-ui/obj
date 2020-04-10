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
		url: 'https://armapi.e7vr.cn',
		// url: 'http://api.arm.cc',
		token: '',
		user: '',
		timeplet: 0,
		ifThisPage: false,
		headStatus: false,
		key: '',
	},
	getters,
	mutations,
	actions,
	modules,
});
export default store
