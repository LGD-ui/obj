//更新vuex中的数据
const mutations = {
	updatetoken(state, data) {
		if (data && data.token && data.user && data.name) {
			state.token = data.token;
			sessionStorage.setItem('token', data.token);
			state.user = data.user;
			sessionStorage.setItem('user', data.user);
			state.name = data.name;
			sessionStorage.setItem('name', data.name);
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
	updataopeneds(state, data) {
		if (data) {
			state.openeds = data;
			sessionStorage.setItem('index', data);
		}
	},
};
export default mutations;