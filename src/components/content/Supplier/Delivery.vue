<template>
	<!-- 物流管理 -->
	<el-container>
		<Left/>
		<el-container>
			<el-main style="padding: 10px;">
				<Head/>
				<div class="Delivery">
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
						<el-table-column label="名称" min-width="60">
							<template slot-scope="scope">
								<span>{{ scope.row.product_name || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="工序">
							<template slot-scope="scope">
								<span>{{ scope.row.procedure_detail_number || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="计划">
							<template slot-scope="scope">
								<span>{{ scope.row.item || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="生产日期">
							<template slot-scope="scope">
								<span>{{ scope.row.created_at | formatDate }}</span>
							</template>
						</el-table-column>
						<el-table-column label="数量" width="60px">
							<template slot-scope="scope">
								<span>{{ scope.row.number || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="物流类型">
							<template slot-scope="scope">
								<span>{{ scope.row.express_name || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="单号" width="140px">
							<template slot-scope="scope">
								<span>{{ scope.row.express_numbers || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="车牌号" align="center" width="110px">
							<template slot-scope="scope">
								<span>{{ scope.row.vehicle_numbers || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="目的地">
							<template slot-scope="scope">
								<span >{{ scope.row.accept_supplier_name || '-- --' }}</span>
							</template>
						</el-table-column>
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
	export default {
		name: "Delivery",
		components: {Left, Head},
		computed: {
			...mapState({
				url: state => state.url,
			}),
			...mapGetters({
				token: "getToken"
			})
		},
		filters: {
			formatDate: function(val) {
				return moment( val * 1000 ).format("YYYY/MM/DD");
			}
		},
		data() {
			return {
				search_name: '',
				tableData: {
					loading: true,
					tableList: [], //15
					currentPage: 1,
					pageSize: 10,
					total: 0,
				}
			}
		},
		created() {
			this.getDelivery();
		},
		methods: {
			getDelivery() {
				let that = this;
				that.axios({
					method: 'GET',
					url: that.url + '/api/v1/supplier/logistics',
					data: '',
					params: {
						page: that.tableData.currentPage,
						size: that.tableData.pageSize,
					},
					headers: {
						"content-type": "application/json",
						'token': that.token
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
			searchChange() {
				console.log(this.search_name);
			},

			handleCurrentChange(currentPage) {
				this.tableData.currentPage = currentPage;
				this.getDelivery();
			},
			clearSearchChange() {
				this.search_name = '';
				this.getDelivery();
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
	.Delivery {
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
