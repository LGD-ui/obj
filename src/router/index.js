import Vue from 'vue'
import Router from 'vue-router'

import Watermark  from '../components/common/watermark.js'

import assembly from './assembly.js'
import staging from './staging.js'
import supply from './supply.js'

Vue.use(Router)

const routes = [
	{
		path: '/',
		name: 'Login',
		component: () => import('@/components/login/Login')
	}, {
		path: '/login',
		name: 'Login',
		component: () => import('@/components/login/Login')
	}, {
		path: '/echartspage',
		name: 'EchartsPage',
		component: () => import('@/components/content/EchartsPage')
	},
	...assembly,
	...staging,
	...supply,
]

const router = new Router({
	mode: 'history',
	routes
})

router.beforeEach((to, from, next) => {
    let baseUrl = to.fullPath.startsWith("/login");
    let token = sessionStorage.getItem('token');
    let user = sessionStorage.getItem('user');
    // to.fullPath != '/login'
	if (baseUrl) {
		next();
	} else {
		if (token && user) {
            next();
		} else {
			sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            localStorage.removeItem("index");
			next("/login");
		}
	}
});
router.afterEach((to) => {
	/* 路由发生变化修改页面title */
	// if (to.meta.title) {
	// 	changTitle(to.meta.title);
	// }
	let user = sessionStorage.getItem('user');
	if (user) {
		Watermark.set(user);
	}

});

export default router
