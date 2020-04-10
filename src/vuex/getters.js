//获取vuex中的数据
const getters = {
	getToken(state) {
		let token = state.token || sessionStorage.getItem('token')
		return token
	},
	getUser(state) {
		let user = state.user || sessionStorage.getItem('user')
		return user
	},
	geturl(state) {
		return state.url
	},
	getKey(state) {
		return state.key
	},
};
export default getters;