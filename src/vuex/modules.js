/* 相当于一个小store,局部不影响上边的state*/
const modules = {
	account: {
		namespaced: true,
		state: {},
		actions: {
			shop(store, config = {}) {
				const { commit, dispatch, state, rootState } = store
				console.log(rootState) // 打印根 state
				//console.log(rootState.ccc) // 打印其他模块的 state
				// try {
				// 	const { data: { code, data } } = await api.post('shop/getShopBaseInfo', config)
				// 	if (code === 1001) commit('receive', data)
				// } catch (error) {
				// 	console.log(error)
				// }
			}
		},
	},
}
export default modules;
