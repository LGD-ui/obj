import Vue from 'vue'
import Router from 'vue-router'

import Watermark  from '../components/common/watermark.js'

import assembly from './assembly.js'
import staging from './staging.js'
import supply from './supply.js'

Vue.use(Router)

const routes = [
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/components/login/Login')
	}, {
		path: '/page',
		name: 'Index',
		component: () => import('@/components/Index'),
		children: [
			...staging,
			...supply,
		]
	},
	...assembly
]

const router = new Router({
	mode: 'history',
	routes
})

router.beforeEach((to, from, next) => {
    let baseUrl = to.fullPath.startsWith("/login");
    let token = sessionStorage.getItem('token');
    let name = sessionStorage.getItem('name');
    // to.fullPath != '/login'
	if (baseUrl) {
		next();
	} else {
		if (token && name) {
            next();
		} else {
			sessionStorage.clear();
            localStorage.clear();
			next("/login");
		}
	}
});
router.afterEach((to) => {
	let name = sessionStorage.getItem('name');
	if (name && to.fullPath != '/echartspage') {
		Watermark.set(name);
	} else {
		Watermark.set('');
	}

});

export default router
