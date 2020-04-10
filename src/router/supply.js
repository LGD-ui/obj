/* 供应端 */

export default [
	{
		path: '/supplierEnter',
		name: 'SupplierEnter',
		component: () => import('@/components/content/Supplier/SupplierEnter.vue')
	}, {
		path: '/supplierLog',
		name: 'SupplierLog',
		component: () => import('@/components/content/Supplier/SupplierLog.vue')
	}, {
		path: '/supplierDetails',
		name: 'SupplierDetails',
		component: () => import('@/components/content/Supplier/SupplierDetails.vue')
	},
	// {
	//   path: '/supplierList',
	//   name: 'SupplierList',
	//   component: () => import('@/components/content/Supplier/SupplierList.vue')
	// },
	{
		path: '/delivery',
		name: 'Delivery',
		component: () => import('@/components/content/Supplier/Delivery.vue')
	}, {
		path: '/order',
		name: 'Order',
		component: () => import('@/components/content/Supplier/Order.vue')
	}, {
		path: '/production',
		name: 'Production',
		component: () => import('@/components/content/Supplier/Production.vue')
	}, {
		path: '/inventory',
		name: 'Inventory',
		component: () => import('@/components/content/Supplier/Inventory.vue')
	}, {
		path: '/personnel',
		name: 'Personnel',
		component: () => import('@/components/content/Supplier/Personnel.vue')
	}
]