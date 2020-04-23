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
				/* 判断登录超时的数据 */
				setIntervalKey: '',	//计时器key
				lastTime: new Date().getTime(),	//当前操作的记录时间
				currentTime: new Date().getTime(),	//当前时间
				timeOut: 60 * 60 * 24 * 1000, // 一天的时间戳
				/* 判断登录超时的数据结束 */
			}
		},
		computed: {
			...mapGetters({
				user: "getUser",
				token: "getToken"
			}),
			
		},
		created() {
			if (this.user && this.token) {
				console.log('执行')
				this.setIntervalKey = window.setInterval(this.checkTimeout, 5000);	//间隔规定时间判断是否超时
				
			}
		},
		methods: {
			/* 超时执行 */
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
					localStorage.removeItem("ruleFormStat");
					clearInterval(that.setIntervalKey);	//清除间隔判断超时
					that.$router.push("/login");
				}
			},

		},
		mounted() {
			var that = this;
			/* 当前操作记录时间		须使用$nextTick(fn) */
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
