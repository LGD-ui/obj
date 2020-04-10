<template>
	<el-container>
		<Left/>
		<el-container>
			<el-main style="padding: 10px;">
				<Head/>
				<div class="Submit">
					<ListChild1></ListChild1>
				</div>
			</el-main>
		</el-container>
	</el-container>
	
</template>

<script>
	import ListChild1 from '@/components/content/staging/contentChild/ListChild1'
	import Left from '@/components/Left.vue'
	import Head from '@/components/Head.vue'
	export default {
		name: 'Submit',
		components: {
			ListChild1, Left, Head
		},
		data() {
			return {

			}
		},
		methods: {}
	}
</script>

<style scoped>
	.Submit {
		background: #FFFFFF;
		padding: 0.625rem;
		margin-top: 0.625rem;
	}
</style>
