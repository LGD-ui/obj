<template>
	<!-- 生产管理 -->
	<el-container>
		<Left/>
		<el-container>
			<el-main style="padding: 10px;">
				<Head/>
				<div class="Production">
					<div class="search">
						<div class="demo-input-suffix">
							<el-input suffix-icon="el-icon-search" style="width: 30.625rem;" v-model.trim="search_name"
								autofocus placeholder="搜索" @keyup.enter.native="searchChange">
								<el-button slot="append" type="primary" @click="searchChange">搜索</el-button>
							</el-input>
							<el-button type="primary" @click="clearSearchChange">全部</el-button>
						</div>
					</div>
					
					<el-table :data="tableData.tableList" :header-cell-style="tableheader" v-loading="tableData.loading " element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
						element-loading-background="rgba(0, 0, 0, 0.5)" >
						<el-table-column label="生产编号" min-width="60">
							<template slot-scope="scope">
								<span>{{ scope.row.id || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="名称">
							<template slot-scope="scope">
								<span>{{ scope.row.name || '-- --' }}</span>
							</template>
						</el-table-column>	
						<el-table-column label="工序">
							<template slot-scope="scope">
								<span>{{ scope.row.item || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="数量">
							<template slot-scope="scope">
								<span>{{ scope.row.material || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="生产日期">
							<template slot-scope="scope">
								<span>{{ scope.row.material || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="质检报告">
							<template slot-scope="scope">
								<el-button size="mini" icon="el-icon-plus" @click="operation(scope.row, 1)"></el-button>
								<el-button size="mini" icon="el-icon-plus" @click="operation(scope.row, 2)">批量</el-button>
							</template>
						</el-table-column>
						<!-- <el-table-column label="计划" prop="category_">
							<template slot-scope="scope">
								<span>{{ scope.row.category || '-- --' }}</span>
							</template>
						</el-table-column> -->
						<!-- <el-table-column label="备注" prop="note_">
							<template slot-scope="scope">
								<span>{{ scope.row.note || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="总数量" prop="count">
							<template slot-scope="scope">
								<span >{{ scope.row.stock || '-- --' }}</span>
							</template>
						</el-table-column> -->
						<!-- <el-table-column label="图片" prop="image">
							<template slot-scope="scope">
								<el-popover v-if="scope.row.image" placement="right" title="" trigger="hover">
									<img :src="scope.row.image" style="height: 500px;width: 500px">
									<img slot="reference" :src="scope.row.image" alt="" style="height: 50px;width: 50px">
								</el-popover>
								<el-popover v-else placement="right" title="" trugger="click">
									<img src="http://zrui.e7vr.com/image/arm/default.gif" alt="defaultPic" style="height: 500px;width: 500px">
									<img slot="reference" src="http://zrui.e7vr.com/image/arm/default.gif" alt="" style="height: 50px;width: 50px">
								</el-popover>
							</template>
						</el-table-column> -->
						<!-- <el-table-column label="添加数量" width="150">
							<template slot-scope="scope">
								<el-input-number v-model.trim="go_numArr[scope.$index].go_num" controls-position="right" @change="handleChange"
								 :min="0" style="width: 100%;"></el-input-number>
							</template>
						</el-table-column>
						<el-table-column label="添加" min-width="100">
							<template slot-scope="scope">
								<el-button @click="submit(scope.$index,scope.row)" type="primary" :disabled="go_numArr[scope.$index].go_num == 0">添加</el-button>
							</template>
						</el-table-column> -->
									
					</el-table>
					
					<div class="block">
						<el-pagination 
							v-if="tableData.total>10" 
							@current-change="handleCurrentChange" 
							layout="prev, pager, next, jumper"
							:total="tableData.total">
						</el-pagination>
					</div>
					
					<!-- 单个 -->
					<Singledialog v-bind:SingleDialogVisible="SingleDialogVisible" @change="SingleClose"></Singledialog>
					<!-- 批量 -->
					<Batchdialog v-bind:BatchDialogVisible="BatchDialogVisible" @change="BatchClose"></Batchdialog>
					
				</div>
			</el-main>
		</el-container>
	</el-container>
	
</template>

<script>
	import { mapActions, mapState, mapGetters } from "vuex"
	import Left from '@/components/Left.vue'
	import Head from '@/components/Head.vue'
	import Singledialog from '@/components/content/Supplier/production/Singledialog.vue'
	import Batchdialog from '@/components/content/Supplier/production/Batchdialog.vue'
	export default {
		name: "Production",
		components: {Left, Head, Singledialog, Batchdialog},
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
					loading: true,
					tableList: [{}], //15
					currentPage: 1,
					pageSize: 15,
					total: 0,
				},
				SingleDialogVisible: {
					dialog: false,
					obj: {},
				},
				BatchDialogVisible: {
					dialog: false,
					obj: {},
				},
			}
		},
		created() {
			setTimeout(() => {
				this.tableData.loading = false
			}, 1000)
		},
		methods: {
			getProduction() {
				let that = this;
				that.axios({
					method: 'GET',
					url: that.url + '',
					data: '',
					params: {},
					headers: {
						"content-type": "application/json",
						'token': that.token
					}
				}).then( response => {
					if (response && response.data && response.data.data && response.data.code == 200) {
						console.log(response)
					}
				}).catch( error => {
					console.log(error)
				});
			},
			searchChange() {
				console.log(this.search_name);
			},
			
			handleCurrentChange(currentPage) {
				this.tableData.currentPage = currentPage;
			},
			clearSearchChange() {
				this.search_name = '';
			},
			
			operation(row, type) {
				console.log(row)
				if (type == 1) {
					this.SingleDialogVisible.dialog = true;
					this.SingleDialogVisible.obj = row;
				} else {
					this.BatchDialogVisible.dialog = true;
					this.BatchDialogVisible.obj = row;
				}
			},
			SingleClose(param) {
				this.SingleDialogVisible.dialog = param;
			},
			BatchClose(param) {
				this.BatchDialogVisible.dialog = param;
			},
			
			
			tableheader({ row, column, rowIndex, columnIndex }) { //表头样式
				if (rowIndex === 0) {
					return 'height:50px;background:#e5e5e5'
				}
			},
		},
		
	}
</script>

<style lang="less" scoped>
	.Production {
		background: #FFFFFF;
		margin-top: 10px;
		padding: 10px;
		.search {
			> div {
				display: flex;
				> .el-button {
					width: 80px;
					margin-left: 10px;
				}
			}
		}
		.el-table {
			height: 845px;
			margin: 1rem 0;
		}
	}
</style>