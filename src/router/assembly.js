/* 装配端 */

export default [
	{
		path: '/content',
		name: 'Content',
		component: () => import('@/components/content/assembly/Content')
	}, {
		path: '/createmodular',
		name: 'CreateModular',
		component: () => import('@/components/content/assembly/CreateModular')
	},
]