/* 供应端 */

export default [
	{
		path: '/supplierdetail',
		name: 'Supplierdetail',
		component: () => import('@/components/content/Supplier/Supplierdetail.vue')
	}, {
		path: '/orderpage',
		name: 'Orderpage',
		component: () => import('@/components/content/Supplier/orderagement/orderlist/Orderpage.vue')
	}, {
		path: '/order',
		name: 'Order',
		component: () => import('@/components/content/Supplier/orderagement/orderlist/page/Order.vue')
	}, {
		path: '/parstpage',
		name: 'Parstpage',
		component: () => import('@/components/content/Supplier/orderagement/parstslist/Parstpage.vue')
	}, {
		path: '/parstlist',
		name: 'Parstlist',
		component: () => import('@/components/content/Supplier/orderagement/parstslist/page/Parstlist.vue')
	}, {
		path: '/prodpage',
		name: 'Prodpage',
		component: () => import('@/components/content/Supplier/productionplan/Prodpage.vue')
	}, {
		path: '/production',
		name: 'Production',
		component: () => import('@/components/content/Supplier/productionplan/page/Production.vue')
	}, {
		path: '/delivery',
		name: 'Delivery',
		component: () => import('@/components/content/Supplier/logisticsagement/Delivery.vue')
	}, {
		path: '/deliveparstlist',
		name: 'Deliveparstlist',
		component: () => import('@/components/content/Supplier/logisticsagement/page/Deliveparstlist')
	},{
		path: '/deliverypage',
		name: 'Deliverypage',
		component: () => import('@/components/content/Supplier/logisticsagement/page/Deliverypage')
	} 
]