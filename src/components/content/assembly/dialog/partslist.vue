<template>
	<div class="parstlist">
		<el-dialog title="零件列表" :visible.sync="parstlistdialogVisible.dialog" width="1100px" top="5vh" :close-on-click-modal="false" @close="parstlistDialogclose">
			<div class="parstlistwrap">
				<div class="search">
					<div class="demo-input-suffix">
						<el-input suffix-icon="el-icon-search" style="width: 300px;" v-model.trim="search_name"
							autofocus placeholder="零件名称搜索" @input="searchChange" @keyup.enter.native="searchChange">
							<el-button slot="append" type="primary" @click="searchChange">搜索</el-button>
						</el-input>
						<el-button type="info" plain @click="clearSearchChange">全部</el-button>
					</div>
				</div>
				<el-table :data="tableData.tableList" >
					<el-table-column label="名称">
						<template slot-scope="scope">
							<span>{{ scope.row.product_name || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="材料">
						<template slot-scope="scope">
							<span>{{ scope.row.product_material || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="代号">
						<template slot-scope="scope">
							<span>{{ scope.row.product_item || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="规格">
						<template slot-scope="scope">
							<span>{{ scope.row.product_specs || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="数量" width="65">
						<template slot-scope="scope">
							<span>{{ scope.row.out_number }}</span>
						</template>
					</el-table-column>
					<el-table-column label="零件条码" width="100">
						<template slot-scope="scope">
							<span>{{ scope.row.parts_number || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="零件类型" align="center" width="80">
						<template slot-scope="scope">
							<el-link :underline="false" type="primary" v-if="scope.row.product_type == 1">标准件</el-link>
							<el-link :underline="false" type="primary" v-if="scope.row.product_type == 2">加工件</el-link>
						</template>
					</el-table-column>
					<el-table-column label="零件状态" align="center" width="80">
						<template slot-scope="scope">
							<el-link :underline="false" type="primary" v-if="scope.row.nowstatus == 1">已出库</el-link>
							<el-link :underline="false" type="warning" v-if="scope.row.nowstatus == 2">装配中</el-link>
							<el-link :underline="false" type="primary" v-if="scope.row.nowstatus == 3">未装配</el-link>
						</template>
					</el-table-column>
					<el-table-column label="模块名称">
						<template slot-scope="scope">
							<span>{{ scope.row.assemble_name }}</span>
						</template>
					</el-table-column>
					<el-table-column label="模块条码" width="90">
						<template slot-scope="scope">
							<span>{{ scope.row.assemble_parts_number }}</span>
						</template>
					</el-table-column>
					<el-table-column label="装配步骤" width="80">
						<template slot-scope="scope">
							<span>{{ scope.row.pipeline_step }}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<el-pagination
				@current-change="handleCurrentChange" 
				layout="prev, pager, next, jumper"
			    :page-size="tableData.pageSize"
				:total="tableData.total">
			</el-pagination>
		</el-dialog>
	</div>
	
</template>

<script>
	import { mapState, mapGetters } from "vuex"
	export default {
		name: 'parstlist',
		props: ["parstlistdialogVisible"],
		computed: {
			...mapState({
				url: state => state.url,
			}),
			...mapGetters({
				token: "getToken"
			})
		},
		data() {
			return {
				search_name: '',
				tableData: {
					tableList: [],
					currentPage: 1,
					pageSize: 10,
					total: 0,
				},
			}
		},
		methods: {
			getparstlist() {
				let that = this;
				that.axios({
					method: 'GET',
					url: that.url+'/api/v1/assemble/index-list',
					params: {
						page: that.tableData.currentPage,
						size: that.tableData.pageSize,
						product_name: that.search_name
					},
					headers: {
						"content-type": "application/json",
						"token": that.token
					}
				}).then( response => {
					if (response && response.data && response.data.code == 200) {
						let data = response.data.data;
						that.tableData.total = data.count.total;
						that.tableData.tableList = data.list;
					}
				}).catch( error => {
					console.log(error)
				});
			},
			
			
			
			// 搜索
			searchChange() {
				this.tableData.currentPage = 1;
				if (!this.search_name) this.search_name = '';
				this.getparstlist();
			},
			// clear搜索value
			clearSearchChange() {
				this.tableData.currentPage = 1;
				this.search_name = '';
				this.getparstlist();
			},
			// 状态搜素
			filterTag(value, row) {
				return row.status === value;
			},
			// 分页
			handleCurrentChange(currentPage) {
				this.tableData.currentPage = currentPage;
				this.getparstlist();
			},
			
			parstlistDialogclose() {
				this.search_name = '';
				this.tableData = {
					tableList: [],
					currentPage: 1,
					pageSize: 10,
					total: 0
				};
				this.$emit("change", false);
			},
			
		}
	}
</script>

<style lang="less" scoped>
	.parstlist {
		/deep/.el-dialog {
			.el-dialog__body {
				padding: 0 20px 20px;
			}
			
		}
		.parstlistwrap {
			margin-bottom: 10px;
			.search {
				margin-bottom: 10px;
				> div {
					display: inline-block;
					margin-right: 10px;
					> .el-button {
						width: 80px;
						margin-left: 10px;
					}
				}
			}
			/deep/ .el-table {
				min-height: 604px;
				td, th {
					padding: 5px 0;
				}
			}
		}
	}
</style>
