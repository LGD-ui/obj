<template>
	<el-main class="Head">
		<el-row :gutter="0" class="headRow borderRadiou" >
			<!-- xs<768px   sm≥768px  md≥992px lg≥1200px  xl≥1920px -->
			<el-col style="width: 120px;" v-if="user == 'moudle'">
				<!-- <div class="title">人员信息</div> -->
				<router-link to="/createmodular">
					<el-button size="small" type="primary" @click="dialogFormVisible = true;">
						<i class="el-icon-d-arrow-left" v-if="ifThisPage" />
						<i class="el-icon-s-home" v-else />
						任务
					</el-button>
				</router-link>
			</el-col>
			
			<el-col style="width: 180px;">
				<div class="title"><i class="el-icon-user-solid"></i> 姓名：{{name}}</div>
			</el-col>
			<!-- <el-col style="width: 180px;">
				<div class="title">姓别：XXXX</div>
			</el-col> -->
			<!-- <el-col style="width: 180px;">
				<div class="title"><i class="el-icon-star-on"></i> 工号：{{user}}</div>
			</el-col> -->
			<!-- <el-col style="width: 180px;">
				<div class="title">
					<router-link to="/echartspage">数据可视化(测试)</router-link>
				</div>
			</el-col> -->
			<el-col class="el-col-time" v-if="user == 'moudle'" style="float: right;width: 70px;margin-right: 25px;">
				<el-button type="text" @click="outLogin">
					<Icon type="md-power" /> 退出登录</el-button>
			</el-col>
			<el-col class="el-col-time" style="width: auto;" v-if="showsearch" >
				<div class="SearchInput">
					<el-input placeholder="请输入您要搜索的内容" v-model.trim="input" style="width: auto;">
						<el-button slot="append" size="mini" icon="el-icon-search" @click="again">搜索</el-button>
					</el-input>
					<el-button type="info" plain class="clearBtn" style="margin-left: 10px;" @click="clearInput">清 空</el-button>
				</div>
			</el-col>

		</el-row>
	</el-main>
</template>

<script>
	import { mapGetters } from "vuex"
	export default {
		name: 'Head',
		data() {
			return {
				input: '',
				ifThisPage: false,
			}
		},
		computed: {
			...mapGetters({
				user: "getUser",
				name: "getName"
			})
		},
		props: {
			showsearch: false,
		},
		methods: {
			outLogin() {
				sessionStorage.clear();
				localStorage.clear();
				this.$router.go();
			},
			again() {
				this.$emit("onceAgain", this.input);
			},
			clearInput() {
				this.input = '';
				this.again();
			}
		}
	}
</script>

<style scoped>
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
		/* min-width: 1030px; */
	}

	.el-main .headRow {
		width: 100%;
		height: 100%;
		background-color: #FFF;
		padding: 0 10px;
		font-size: 14px;
	}

	.headRow div {
		height: 38px;
		line-height: 38px;
	}


	.el-main .bgurl {
		background-color: transparent;
		color: #FFFFFF;
	}
</style>
