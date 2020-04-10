<template>
	<div id="app">
		<div class="main">
			<Index></Index>
		</div>
	</div>
</template>

<script>
	import { mapActions, mapState, mapGetters } from "vuex"
	import Index from '@/components/index.vue'
	export default {
		name: 'App',
		components: {
			Index,
		},
		data() {
			return {
				lastTime: new Date().getTime(),
				currentTime: new Date().getTime(),
				timeOut: 60 * 60 * 24 * 1000, // 一天的时间戳
			}
		},
		computed: {
			...mapGetters({
				user: "getUser"
			}),
			
		},
		created() {
			// window.setInterval(this.checkTimeout, 5000);
		},
		methods: {
			checkTimeout() {
				let that = this;
				that.currentTime = new Date().getTime(); //更新当前时间
				that.lastTime = localStorage.getItem("lastTime");
				if (that.currentTime - that.lastTime > that.timeOut) { //判断是否超时
					console.log("超时");
					that.$notify({
						title: '警告',
						message: '长时间未操作，已自动退出登录',
						type: 'warning'
					});
					sessionStorage.removeItem("token");
					sessionStorage.removeItem("user");
					that.$router.push("/login");
					location.reload();
				}
			},

		},
		mounted() {
			var that = this;
			that.$nextTick(function() {
				document.addEventListener('click', function() {
					localStorage.setItem("lastTime", new Date().getTime());
				})
			})
		},
	}
</script>

<style>
	* {
		margin: 0;
		padding: 0;
	}

	a {
		text-decoration: none;
	}

	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		/* text-align: center; */
		color: #2c3e50;
		/* margin-top: 60px; */
	}

	.borderRadiou {
		border-radius: 5px;
		-moz-border-radius: 5px;
		-webkit-border-radius: 5px;
		overflow: hidden;
	}
</style>
