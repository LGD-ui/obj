<template>
	<div class="Index">
		<el-container>
			<Left/>
			<el-container>
				<el-main style="padding: 10px;">
					<Head v-if="user!='supplier'" />
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	import { mapGetters } from "vuex"
	import Left from '@/components/Left.vue'
	import Head from '@/components/Head.vue'
	export default {
		name: 'Index',
		components: {Left, Head},
		data() {
			return {}
		},
		computed: {
			...mapGetters({
				user: "getUser"
			})
		},

	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.Index {
		background-color: #f9f9f9;
	}

	.el-container {
		height: 100vh;
	}
</style>
