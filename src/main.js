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

import '@/components/common/ipadstyle.css'
import Print from 'vue-print-nb'

Vue.use(Print);


Vue.component('v-chart', ECharts)

Vue.config.productionTip = false;

Vue.use(Element)
Vue.use(ViewUI)
Vue.use(VueAxios, axios)
Vue.use(VideoPlayer)
// Vue.use(ECharts)
Vue.use(dataV)
Vue.use(VueLazyload)

Vue.prototype.ECharts = ECharts
Vue.prototype.errmessage = function(text) {
	var message = text.match('<h1 class="break-long-words exception-message">.*</h1>')[0];
	message = message.replace('<h1 class="break-long-words exception-message">', "").replace('</h1>', "");
	return message;
}
/* eslint-disable no-new */

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app")
