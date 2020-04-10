<template>
	<el-aside width="180px" style="position: relative;">
		<el-header>
			<div>
				<img src="../assets/logo.png" alt="">
			</div>
			<div>智能车间</div>
		</el-header>
		<el-main>
			<el-menu :default-openeds="[]" v-if="user=='product'" :default-active="openeds" :unique-opened="true">

				<!-- <el-submenu index="1">
					<template slot="title"><i class="el-icon-menu"></i>入库</template>
					<el-menu-item-group>
						<router-link to="">
							<el-menu-item index="1-1">扫码入库</el-menu-item>
						</router-link>
						<router-link to="/submit">
							<el-menu-item index="1-2">手动入库</el-menu-item>
						</router-link>
						<router-link to="/batch">
							<el-menu-item index="1-3">批量入库</el-menu-item>
						</router-link>
					</el-menu-item-group>
				</el-submenu> -->
				<el-submenu index="1">
					<template slot="title"><i class="el-icon-menu"></i>库存</template>
					<router-link to="/submit">
						<el-menu-item index="1-1" @click="activeIndex('1-1')">入库</el-menu-item>
					</router-link>
					<router-link to="/new_out">
						<el-menu-item index="1-2" @click="activeIndex('1-2')">出库</el-menu-item>
					</router-link>
					<router-link to="/new_outList">
						<el-menu-item index="1-3" @click="activeIndex('1-3')">记录</el-menu-item>
					</router-link>
				</el-submenu>
				<el-submenu index="2">
					<template slot="title"><i class="el-icon-menu"></i>托盘</template>
					<router-link to="/tray_enter">
						<el-menu-item index="2-1" @click="activeIndex('2-1')">装盘</el-menu-item>
					</router-link>
					<router-link to="/tray_out">
						<el-menu-item index="2-2" @click="activeIndex('2-2')">出库</el-menu-item>
					</router-link>
					<router-link to="/tray_list">
						<el-menu-item index="2-3" @click="activeIndex('2-3')">列表</el-menu-item>
					</router-link>
				</el-submenu>
				<!-- <el-submenu index="3">
					<template slot="title"><i class="el-icon-menu"></i>出库</template>
					<el-menu-item-group>
						<router-link to="">
							<el-menu-item index="2-1">扫码出库</el-menu-item>
						</router-link>
						<router-link to="/out">
							<el-menu-item index="2-2">手动出库</el-menu-item>
						</router-link>
						<router-link to="/new_out">
							<el-menu-item index="2-3">手动出库</el-menu-item>
						</router-link>
						<router-link to="/new_outList">
							<el-menu-item index="2-4">出库列表</el-menu-item>
						</router-link>
						<router-link to="">
							<el-menu-item index="2-5">批量出库</el-menu-item>
						</router-link>
					</el-menu-item-group>
				</el-submenu> -->

				<!-- <el-submenu index="4">
					<template slot="title"><i class="el-icon-menu"></i>库存</template>
					<el-menu-item-group>
						<router-link to="/list">
							<el-menu-item index="4-1">库存列表</el-menu-item>
						</router-link>
					</el-menu-item-group>
				</el-submenu>
				<router-link to="/list">
					<el-menu-item index="4"><i class="el-icon-menu"></i>库存</el-menu-item>
				</router-link> -->

				<router-link to="/breakList">
					<el-menu-item index="3" @click="activeIndex('3')"><i class="el-icon-menu"></i>报损</el-menu-item>
				</router-link>
				<!-- <router-link to="/data">
					<el-menu-item index="4" @click="activeIndex('4')"><i class="el-icon-menu"></i>数据</el-menu-item>
				</router-link>
				<el-submenu index="5">
					<template slot="title"><i class="el-icon-menu"></i>报损</template>
					<el-menu-item-group>
						<router-link to="/breakList">
							<el-menu-item index="5-1">报损列表</el-menu-item>
						</router-link>
						<router-link to="">
							<el-menu-item index="4-2">损坏处理</el-menu-item>
						</router-link>
					</el-menu-item-group>
				</el-submenu> -->

			</el-menu>
			<!-- <el-menu :default-openeds="['101']" v-if="flow">
				<el-submenu index="101">
					<template slot="title"><i class="el-icon-setting"></i>装配</template>
					<el-menu-item-group>
						<router-link to="/createmodular">
							<el-menu-item index="101-1">装配任务</el-menu-item>
						</router-link>
						<router-link to="/content">
							<el-menu-item index="101-2">工作台</el-menu-item>
						</router-link>
					</el-menu-item-group>
				</el-submenu>
			</el-menu> -->
			<!-- 供应商 列表 -->
			<el-menu :default-openeds="['201']" :default-active="openeds" v-if="user=='supplier'">
				<el-submenu index="201">
					<template slot="title"><i class="el-icon-setting"></i>菜单</template>
					<el-menu-item-group>
						<router-link to="/supplierEnter">
							<el-menu-item index="201-2" @click="activeIndex('201-2')">添加</el-menu-item>
						</router-link>
						
						
						<router-link to="/order">
							<el-menu-item index="201-5" @click="activeIndex('201-5')">订单管理</el-menu-item>
						</router-link>
						<router-link to="/production">
							<el-menu-item index="201-6" @click="activeIndex('201-6')">生产计划</el-menu-item>
						</router-link>
						<router-link to="/inventory">
							<el-menu-item index="201-7" @click="activeIndex('201-7')">库存管理</el-menu-item>
						</router-link>
						<router-link to="/delivery">
							<el-menu-item index="201-4" @click="activeIndex('201-4')">物流管理</el-menu-item>
						</router-link>
						<router-link to="/personnel">
							<el-menu-item index="201-8" @click="activeIndex('201-8')">人员管理</el-menu-item>
						</router-link>
						<router-link to="/supplierLog">
							<el-menu-item index="201-3" @click="activeIndex('201-3')">日志信息</el-menu-item>
						</router-link>
					</el-menu-item-group>
				</el-submenu>
			</el-menu>
		</el-main>
		<el-footer style="position: absolute;bottom: 0;left: 0;right: 0;">
			<el-button type="primary" @click="outLogin">
				<Icon type="md-power" />退出登录</el-button>
		</el-footer>
	</el-aside>
</template>

<script>
	import {
		mapActions,
		mapState,
		mapGetters
	} from "vuex"
	export default {
		name: 'Left',
		data() {
			return {
				openeds: "",
			}
		},
		computed: {
			...mapGetters({
				user: "getUser"
			})
		},
		created() {
			let that = this;
			if (localStorage.getItem('index') != undefined || localStorage.getItem('index') != "") {
				that.openeds = localStorage.getItem('index');
			}

		},

		methods: {
			outLogin() {
				var that = this;
				sessionStorage.removeItem("token");
				sessionStorage.removeItem("user");
				localStorage.removeItem("lastTime");
				localStorage.removeItem("ruleFormStat");
				that.$message({
					message: '已退出',
					offset: 300
				});
				that.$router.push("/login");
				// location.reload();

			},
			activeIndex(index) {
				localStorage.setItem("index", index);
			}
		},
	}
</script>

<style scoped>
	.el-aside {
		/* background: url();
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center;
    background-size: cover;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover; */
	}

	.el-aside .el-main {
		position: absolute;
		top: 108px;
		bottom: 42px;
		left: 0;
		right: 0;
		background-color: #3e79ab;
		padding: 10px;
	}

	.el-aside .el-main .el-menu {
		border-radius: 10px;
		overflow: hidden;
	}

	.el-aside .el-header {
		height: 108px !important;
		background-color: #0A487C;
		text-align: center;
		padding: 20px;
	}

	.el-aside .el-main .el_aside_title {
		background-color: #1EA0CA;
		margin-bottom: 12px;
	}

	.el-aside .el-header>div {
		color: #FFFFFF;
	}

	.el-aside .el-footer {
		font-size: 14px;
		height: 42px !important;
		line-height: 42px;
		text-align: center;
		padding: 0;
	}

	.el-footer .el-button {
		width: 100%;
		height: 100%;
		border-radius: 0;
		-moz-border-radius: 0;
		-webkit-border-radius: 0;
	}
</style>
