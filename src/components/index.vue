<template>
	<div class="Index" :class="bg ? '':'bgurl'">
		<router-view></router-view>
		<!-- <el-container>
			<Left/>
			<el-container>
				<el-main style="padding: 10px;">
					<Head/>
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container> -->
	</div>
</template>

<script>
	import { mapActions, mapState, mapGetters } from "vuex"
	export default {
		name: 'Index',
		data() {
			return {
				bg: true
			}
		},
		computed: {
			...mapGetters({
				user: "getUser"
			})
		},
		methods: {},
		created() {
			var that = this;
			if (that.$route.path == '/echartspage') {
				that.bg = false;
			}
			if (that.$route.path != '/echartspage') {
				that.bg = true;
			}
		},
		updated() {
			var that = this;
			if (that.$route.path == '/echartspage') {
				that.bg = false;
			}
			if (that.$route.path != '/echartspage') {
				that.bg = true;
			}
		},

	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.Index {
		background-color: #f9f9f9;
	}

	.bgurl {
		background: url(../assets/110420cf.png) center / cover no-repeat;
	}

	.el-container {
		height: 100vh;
	}

	.Head,
	.Content,
	.CreateModular {
		min-width: 80.5rem;
	}
</style>
