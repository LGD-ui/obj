<template>
	<el-main class="Head">
		<el-row :gutter="0" class="headRow borderRadiou" :class="bg ? '':'bgurl'">
			<!-- xs<768px   sm≥768px  md≥992px lg≥1200px  xl≥1920px -->
			<el-col style="width: 120px;" v-if="user == 'moudle'">
				<!-- <div class="title">人员信息</div> -->
				<router-link to="/createmodular">
					<el-button size="small" type="primary" @click="dialogFormVisible = true;bg = false">
						<i class="el-icon-d-arrow-left" v-if="ifThisPage" />
						<i class="el-icon-s-home" v-else />
						任务
					</el-button>
				</router-link>
			</el-col>
			<el-col style="width: 120px;" v-if="user == 'product'&&!bg">
				<!-- <div class="title">人员信息</div> -->
				<router-link to="/list">
					<el-button size="small" type="primary" @click="dialogFormVisible = true;bg = false">
						<i class="el-icon-d-arrow-left" />
						暂存区
					</el-button>
				</router-link>
			</el-col>
			<el-col style="width: 180px;">
				<div class="title"><i class="el-icon-user-solid"></i> 姓名：{{user}}</div>
			</el-col>
			<!-- <el-col style="width: 180px;">
				<div class="title">姓别：XXXX</div>
			</el-col> -->
			<el-col style="width: 180px;">
				<div class="title"><i class="el-icon-star-on"></i> 工号：{{user}}</div>
			</el-col>
			<!-- <el-col style="width: 180px;">
				<div class="title">
					<router-link to="/echartspage">数据统计(测试按钮)</router-link>
				</div>
			</el-col> -->
			<el-col class="el-col-time" v-if="user == 'moudle'" style="float: right;width: 70px;margin-right: 25px;">
				<el-button type="text" @click="outLogin">
					<Icon type="md-power" /> 退出登录</el-button>
			</el-col>
			<el-col class="el-col-time" style="float: right;width: 170px;">
				<!-- <div class="title" style="text-align: left;"><i class="el-icon-time"></i> {{time}}</div> -->
			</el-col>

		</el-row>
	</el-main>
</template>

<script>
	import { mapActions, mapState, mapGetters } from "vuex"
	export default {
		name: 'Head',
		data() {
			return {
				timer: '',
				time: '0000年00月00日 00:00:00',
				ifThisPage: false,
				bg: true,
			}
		},
		computed: {
			...mapGetters({
				user: "getUser"
			})
		},
		created() {
			let that = this;
			/* Date.prototype.toLocaleString = function() {
				return this.getFullYear() + "年" + ((this.getMonth() + 1) < 10 ? '0' + (this.getMonth() + 1) : (this.getMonth() + 1)) +
					"月" + (this.getDate() < 10 ? '0' + this.getDate() : this.getDate()) + "日 " + (this.getHours() < 10 ? '0' + (this.getHours()) :
						this.getHours()) + ":" + (this.getMinutes() < 10 ? ('0' + this.getMinutes()) : this.getMinutes()) + ":" + (this.getSeconds() <
						10 ? '0' + this.getSeconds() : this.getSeconds());
			};
			that.timer = setInterval(function() {
				let nowTime = new Date();
				that.time = nowTime.toLocaleString();
				that.$store.state.timeplet = nowTime * 1000;
			}, 1000) */
			if (that.$route.path == '/echartspage') {
				that.bg = false;
			}
			if (that.$route.path != '/echartspage') {
				that.bg = true;
			}
		},
		beforeDestroy() {
			if (this.timer) {
				clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
			}
		},
		updated() {
			var that = this;
			that.ifThisPage = that.$store.state.ifThisPage;
			if (that.$route.path == '/echartspage') {
				that.bg = false;
			}
			if (that.$route.path != '/echartspage') {
				that.bg = true;
			}
		},
		methods: {
			outLogin() {
				var that = this;
				sessionStorage.removeItem("token");
				sessionStorage.removeItem("user");
				sessionStorage.removeItem("IP");
				localStorage.removeItem("index");
				localStorage.removeItem("ruleFormStat");
				that.$message({
					message: '已退出'
				});
				that.$router.push("/login");
			}
		}
	}
</script>

<style scoped>
	/* .Head {
		position: fixed;
		top: 10px;
		z-index: 41;
	} */
	.el-main {
		height: 45px;
		padding: 0px;
	}

	.el-main .title {
		min-width: 170px;
	}

	.el-main>.el-main {
		padding-left: 0;
		padding-top: 0;
	}

	.el-main .headRow {
		width: 100%;
		height: 100%;
		background-color: #FFF;
		padding-left: 10px;
		font-size: 14px;
	}

	.headRow div {
		height: 38px;
		line-height: 45px;
	}

	.el-col-time {
		float: right;
		text-align: right;
		text-align: -moz-right;
		text-align: -webkit-right;
		padding-right: 10px;
	}

	.el-main .bgurl {
		background-color: transparent;
		color: #FFFFFF;
	}
</style>
