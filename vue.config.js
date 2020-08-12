module.exports = {
	lintOnSave: false,
	productionSourceMap:false,
	devServer: {
		https: false, // https:{type:Boolean}
		open: false, //配置自动启动浏览器  http://172.11.11.22:8888/rest/XX/
		hotOnly: true, // 热更新
		// proxy: 'http://localhost:8000'   // 配置跨域处理,只有一个代理
		// proxy: { //配置自动启动浏览器
		// 	"/XX/*": {
		// 		// target: "http://172.11.11.11:7071",
		// 		changeOrigin: true,
		// 		ws: true,//websocket支持
		// 		secure: false
		// 	}
		// }
	},
	publicPath: process.env.NODE_ENV === 'production' ? './' : '/'
}
