// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from '@/vuex/store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
import ECharts from 'vue-echarts'
import dataV from '@jiaminghi/data-view'
import VueLazyload from 'vue-lazyload'


Vue.component('v-chart', ECharts)

Vue.config.productionTip = false

Vue.use(Element)
Vue.use(ViewUI)
Vue.use(VueAxios, axios)
Vue.use(VideoPlayer)
// Vue.use(ECharts)
Vue.use(dataV)
Vue.use(VueLazyload)

Vue.prototype.ECharts = ECharts
/* eslint-disable no-new */

/* vue有两种形式的代码 compiler（模板）模式和runtime模式（运行时） */

/* // compiler
new Vue({
	el: '#app',
	router,
	store,
	components: {
		App
	},
	template: '<App/>'
}) */

//runtime
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
