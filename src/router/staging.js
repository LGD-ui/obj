/* 暂存端 */

export default [
	{
		path: '/submit',
		name: 'Submit',
		component: () => import('@/components/content/staging/Submit')
	}, {
		path: '/list',
		name: 'List',
		component: () => import('@/components/content/staging/List')
	},  {
		path: '/batch',
		name: 'Batch',
		component: () => import('@/components/content/staging/Batch')
	}, {
		path: '/out',
		name: 'Out',
		component: () => import('@/components/content/staging/Out')
	}, {
		path: '/breakage',
		name: 'Breakage',
		component: () => import('@/components/content/staging/Breakage')
	}, {
		path: '/breakList',
		name: 'BreakList',
		component: () => import('@/components/content/staging/BreakList')
	}, {
		path: '/scan_enter',
		name: 'Scan_enter',
		component: () => import('@/components/content/staging/Scan_enter')
	}, {
		path: '/log',
		name: 'Log',
		component: () => import('@/components/content/staging/Log')
	}, {
		path: '/tray_enter',
		name: 'Tray_enter',
		component: () => import('@/components/content/staging/contentChild/Tray_enter')
	}, {
		path: '/tray_list',
		name: 'Tray_list',
		component: () => import('@/components/content/staging/contentChild/Tray_list')
	}, {
		path: '/tray_out',
		name: 'Tray_out',
		component: () => import('@/components/content/staging/contentChild/Tray_out'),
	}, {
		path: '/new_out',
		name: 'New_out',
		component: () => import('@/components/content/staging/New_out')
	}, {
		path: '/new_outList',
		name: 'New_outList',
		component: () => import('@/components/content/staging/New_outList')
	}, {
		path: '/recorddetail',
		name: 'Recorddetail',
		component: () => import('@/components/content/staging/Recorddetail')
	}, {
		path: '/data',
		name: 'Data',
		component: () => import('@/components/content/staging/Data')
	},
]