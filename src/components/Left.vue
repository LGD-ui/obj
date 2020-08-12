<template>
	<el-aside width="180px" style="position: relative;">
		<el-header>
			<div v-if="user=='supplier'">
				<router-link to="/supplierdetail">
					<div class="logo">
						<img src="../assets/logo.png" alt="">
					</div>
					<div>智能车间供应商</div>
				</router-link>
			</div>
			<div v-else>
				<div class="logo">
					<img src="../assets/logo.png" alt="">
				</div>
				<div>智能车间</div>
			</div>
		</el-header>
		<el-main>
			<el-menu :default-openeds="['1']" v-if="user=='product'" :default-active="openeds" :unique-opened="true">
				<el-submenu index="1">
					<template slot="title"><i class="el-icon-s-operation"></i>库存</template>
					<router-link to="/stockpend"><el-menu-item index="1-4" @click="activeIndex('1-4')">待入库</el-menu-item></router-link>
					<router-link to="/submit"><el-menu-item index="1-1" @click="activeIndex('1-1')">库存</el-menu-item></router-link>
					<router-link to="/new_out"><el-menu-item index="1-2" @click="activeIndex('1-2')">出库</el-menu-item></router-link>
					<router-link to="/enddelivery"><el-menu-item index="1-5" @click="activeIndex('1-5')">发货</el-menu-item></router-link>
					<router-link to="/new_outList"><el-menu-item index="1-3" @click="activeIndex('1-3')">记录</el-menu-item></router-link>
				</el-submenu>
				<el-submenu index="2">
					<template slot="title"><i class="el-icon-s-operation"></i>托盘</template>
					<router-link to="/tray_enter"><el-menu-item index="2-1" @click="activeIndex('2-1')">装盘</el-menu-item></router-link>
					<router-link to="/tray_out"><el-menu-item index="2-2" @click="activeIndex('2-2')">出库</el-menu-item></router-link>
					<router-link to="/tray_list"><el-menu-item index="2-3" @click="activeIndex('2-3')">列表</el-menu-item></router-link>
				</el-submenu>
			</el-menu>
			<!-- 供应商 列表 -->
			<el-menu :default-openeds="[]" :default-active="openeds" v-if="user=='supplier'">
				<el-submenu index="3">
					<template slot="title">订单管理</template>
					<router-link to="/orderpage"><el-menu-item index="3-1" @click="activeIndex('3-1')">订单列表</el-menu-item></router-link>
					<router-link to="/parstpage"><el-menu-item index="3-2" @click="activeIndex('3-2')">零件列表</el-menu-item></router-link>
				</el-submenu>
				<router-link to="/prodpage"><el-menu-item index="4" @click="activeIndex('4')">生产计划</el-menu-item></router-link>
				<router-link to="/delivery"><el-menu-item index="5" @click="activeIndex('5')">物流管理</el-menu-item></router-link>
			</el-menu>
		</el-main>
		<el-footer style="position: absolute;bottom: 0;left: 0;right: 0;">
			<el-button type="primary" @click="outLogin">
				<Icon type="md-power" /> 退出登录</el-button>
		</el-footer>
	</el-aside>
</template>

<script>
	import { mapActions, mapState, mapGetters } from "vuex"
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

		methods: {
			outLogin() {
				sessionStorage.clear();
				localStorage.clear();
				this.$router.go();
			},
			activeIndex(index) {
				localStorage.setItem("index", index);
			}
		},
	}
</script>

<style scoped>

	.el-aside .el-main {
		position: absolute;
		top: 108px;
		bottom: 42px;
		left: 0;
		right: 0;
		background-color: #3e79ab;
		padding: 10px;
	}
	.logo {
		width: 60px;
		height: 60px;
		overflow: hidden;
		text-align: center;
		margin: 0 auto;
	}
	.logo > img {
		width: 100%;
		height: 100%;
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

	.el-aside .el-header div {
		color: #FFFFFF;
		cursor: pointer;
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
