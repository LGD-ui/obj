//更新vuex中的数据
const mutations = {
	updatetoken(state, data) {
		if (data && data.token && data.user) {
			state.token = data.token;
			sessionStorage.setItem('token', data.token);
			state.user = data.user;
			sessionStorage.setItem('user', data.user);
		}
	},
	updataKey(state, data) {
		if (data) {
			state.key = data
		}
	},
	updataaccount(state, data) {
		if (data) {
			state.account.url = data
		}
	},
};
export default mutations;