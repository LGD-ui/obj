<template>
	<!-- 生产计划 -->
	<el-container>
		<Left/>
		<el-container>
			<el-main style="padding: 10px;">
				<Head/>
				<div class="Production">
					<!-- <div class="search">
						<div class="demo-input-suffix">
							<el-input suffix-icon="el-icon-search" style="width: 30.625rem;" v-model.trim="search_name"
								autofocus placeholder="搜索" @keyup.enter.native="searchChange">
								<el-button slot="append" type="primary" @click="searchChange">搜索</el-button>
							</el-input>
							<el-button type="primary" @click="clearSearchChange">全部</el-button>
						</div>
					</div> -->
					
					<el-table :data="tableData.tableList" :header-cell-style="tableheader" v-loading="tableData.loading " element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
						element-loading-background="rgba(0, 0, 0, 0.5)" >
						
						<el-table-column label="计划编号" min-width="60">
							<template slot-scope="scope">
								<span>{{ scope.row.id || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="名称">
							<template slot-scope="scope">
								<span>{{ scope.row.product_name || '-- --' }}</span>
							</template>
						</el-table-column>	
						<el-table-column label="工序名称">
							<template slot-scope="scope">
								<span>{{ scope.row.procedure_name || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="工序">
							<template slot-scope="scope">
								<span>{{ scope.row.procedure_detail_number || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="批次">
							<template slot-scope="scope">
								<span>{{ scope.row.batch || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="数量">
							<template slot-scope="scope">
								<span>{{ scope.row.number || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="生产日期">
							<template slot-scope="scope">
								<span>{{ scope.row.created_at | formatDate }}</span>
							</template>
						</el-table-column>
						<el-table-column label="状态" align="center" width="80px"
							:filters="[
								{ text: '未开始', value: 1 }, { text: '进行中', value: 2 },
								{ text: '已完成', value: 3 }, { text: '已配送', value: 4 }
							]" :filter-method="filterTag">
							<template slot-scope="scope">
								<el-tag size="mini" type="danger" v-if="scope.row.status == 1">未开始</el-tag>
								<el-tag size="mini" type="warning" v-if="scope.row.status == 2">进行中</el-tag>
								<el-tag size="mini" type="" v-if="scope.row.status == 3">已完成</el-tag>
								<el-tag size="mini" type="success" v-if="scope.row.status == 4">已配送</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="质检报告" width="150px" align="center">
							<template slot-scope="scope">
								<el-button size="mini" icon="el-icon-plus" :disabled="scope.row.status >= 3 ? true : false" @click="operation(scope.row, 1)"></el-button>
								<el-button size="mini" icon="el-icon-plus" :disabled="scope.row.status >= 3 ? true : false" @click="operation(scope.row, 2)">批量</el-button>
							</template>
						</el-table-column>
						<el-table-column label="操作" align="center" width="80px">
							<template slot-scope="scope">
								<el-button type="success" size="mini" :disabled="scope.row.status == 3 ? false : true" @click="delivergoods(scope.row)">发货</el-button>
							</template>
						</el-table-column>
						<!--  -->
						<!--  -->
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
					<Singledialog ref="child" v-bind:SingleDialogVisible="SingleDialogVisible" @change="SingleClose"></Singledialog>
					<!-- 批量 -->
					<Batchdialog v-bind:BatchDialogVisible="BatchDialogVisible" @change="BatchClose"></Batchdialog>
					<!-- 发货 -->
					<Deliverdialog v-bind:DeliverdialogVisible="DeliverdialogVisible" @change="DeliverClose"></Deliverdialog>
					
				</div>
			</el-main>
		</el-container>
	</el-container>
	
</template>

<script>
	import { mapActions, mapState, mapGetters } from "vuex"
	import Left from '@/components/Left.vue'
	import Head from '@/components/Head.vue'
	import moment from 'moment'
	import Singledialog from '@/components/content/Supplier/production/Singledialog.vue'
	import Batchdialog from '@/components/content/Supplier/production/Batchdialog.vue'
	import Deliverdialog from '@/components/content/Supplier/production/Deliverdialog.vue'
	export default {
		name: "Production",
		components: {Left, Head, Singledialog, Batchdialog, Deliverdialog},
		computed: {
			...mapState({
				url: state => state.url,
			}),
			...mapGetters({
				token: "getToken"
			})
		},
		filters: {
			formatDate(val) {
				return moment( val * 1000 ).format("YYYY/MM/DD");
			}
		},
		data() {
			return {
				search_name: '',
				tableData: {
					loading: true,
					tableList: [{}], //15
					currentPage: 1,
					pageSize: 10,
					total: 0,
				},
				DeliverdialogVisible: {
					dialog: false,
					obj: {},
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
			this.getProduction();
		},
		methods: {
			/* 列表 */
			getProduction() {
				let that = this;
				that.axios({
					method: 'GET',
					url: that.url + '/api/v1/supplier/task-list',
					data: '',
					params: {
						page: that.tableData.currentPage,
						size: that.tableData.pageSize,
					},
					headers: {
						"content-type": "application/json",
						"token": that.token
					}
				}).then( response => {
					if (response && response.data && response.data.data && response.data.code == 200) {
						var data = response.data.data.list;
						that.tableData.total = response.data.data.count.total;
						that.tableData.tableList = data;
						that.tableData.loading = false;
					}
				}).catch( error => {
					console.log(error)
					that.tableData.loading = false;
				});
			},
			
			filterTag(value, row) {
				return row.status === value;
			},
			/* 搜索 */
			searchChange() {
				console.log(this.search_name);
			},
			/* 分页 */
			handleCurrentChange(currentPage) {
				this.tableData.currentPage = currentPage;
				this.getProduction();
			},
			/* clear搜索value */
			clearSearchChange() {
				this.search_name = '';
				this.getProduction();
			},
			/* 质检报告弹窗 */
			operation(row, type) {
				if (type == 1) {	//1  单个
					this.SingleDialogVisible.dialog = true;
					this.SingleDialogVisible.obj = row;
					this.$refs.child.getSingle(row);
				} else {	//2 批量
					this.BatchDialogVisible.dialog = true;
					this.BatchDialogVisible.obj = row;
				}
			},
			
			/* 发货 */
			delivergoods(row) {
				this.DeliverdialogVisible.obj = row;
				this.DeliverdialogVisible.dialog = true;
			},
			/* 关闭发货弹窗 */
			DeliverClose(param) {
				this.DeliverdialogVisible.dialog = param;
				this.getProduction();
			},
			/* 关闭单个弹窗 */
			SingleClose(param) {
				this.SingleDialogVisible.dialog = param;
				this.getProduction();
			},
			/* 关闭批量弹窗 */
			BatchClose(param) {
				this.BatchDialogVisible.dialog = param;
				this.getProduction();
			},
			/* 表头样式 */
			tableheader({ row, column, rowIndex, columnIndex }) {
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
			margin: 0 0 1rem;
		}
	}
</style>