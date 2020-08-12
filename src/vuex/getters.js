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
	getName(state) {
		let name = state.name || sessionStorage.getItem('name')
		return name
	},
	geturl(state) {
		return state.url
	},
	getKey(state) {
		return state.key
	},
	getopeneds(state) {
		let openeds = state.openeds || sessionStorage.getItem('index')
		return openeds
	},
};
export default getters;