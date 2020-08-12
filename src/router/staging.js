/* 暂存端 */

export default [
	{
		path: '/stockpend',
		name: 'Stockpend',
		component: () => import('@/components/content/staging/inventory/beputin/Stockpend')
	},  {
		path: '/stockpendlist',
		name: 'Stockpend_list',
		component: () => import('@/components/content/staging/inventory/beputin/page/Stockpend_list')
	},  {
		path: '/submit',
		name: 'Submit',
		component: () => import('@/components/content/staging/inventory/inventory/Submit')
	}, {
		path: '/new_out',
		name: 'New_out',
		component: () => import('@/components/content/staging/inventory/outbound/New_out')
	}, {
		path: '/new_outList',
		name: 'New_outList',
		component: () => import('@/components/content/staging/inventory/record/New_outList')
	}, {
		path: '/recorddetail',
		name: 'Recorddetail',
		component: () => import('@/components/content/staging/inventory/record/page/Recorddetail')
	}, {
		path: '/enddelivery',
		name: 'Deliverys',
		component: () => import('@/components/content/staging/inventory/delivery/Delivery')
	}, {
		path: '/tray_enter',
		name: 'Tray_enter',
		component: () => import('@/components/content/staging/tray/onplate/Tray_enter')
	}, {
		path: '/tray_out',
		name: 'Tray_out',
		component: () => import('@/components/content/staging/tray/outbound/Tray_out'),
	}, {
		path: '/tray_list',
		name: 'Tray_list',
		component: () => import('@/components/content/staging/tray/list/Tray_list')
	}
]