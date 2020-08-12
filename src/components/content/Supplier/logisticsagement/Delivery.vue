<template>
	<!-- 物流管理 -->
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
			<el-table-column label="快递编号/车牌号">
				<template slot-scope="scope">
					<span>{{ scope.row.express_number || scope.row.vehicle_numbers }}</span>
				</template>
			</el-table-column>
			<el-table-column label="供应商名称" prop="send_supplier_name"></el-table-column>
			<el-table-column label="快递名称">
				<template slot-scope="scope">
					<span>{{ scope.row.express_name || '自运' }}</span>
				</template>
			</el-table-column>
	        <el-table-column label="收件人">
				<template slot-scope="scope">
					<span>{{ scope.row.work_shop_name || '-- --' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="详细地址">
				<template slot-scope="scope">
					<span>{{ scope.row.accept_address || '-- --' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="发货日期" width="165">
				<template slot-scope="scope">
					<span>{{ scope.row.created_at | formatDate }}</span>
				</template>
			</el-table-column>
			<el-table-column label="物流信息" width="150">
				<template slot-scope="scope">
					<el-link :underline="false" type="primary" @click="datadetail(scope.row)">详情</el-link>
					<el-link :underline="false" type="primary" @click="delivedetail(scope.row)" style="margin-left: 10px;">物流跟踪</el-link>
				</template>
			</el-table-column>
	
		</el-table>
	
		<div class="block">
			<el-pagination
				v-if="tableData.total>15"
				@current-change="handleCurrentChange"
				layout="prev, pager, next, jumper"
	            :page-size="tableData.pageSize"
				:total="tableData.total">
			</el-pagination>
		</div>
	
	</div>

</template>

<script>
	import { mapState, mapGetters } from "vuex"
	import moment from 'moment'
	export default {
		name: "Delivery",
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
				return moment( val * 1000 ).format("YYYY-MM-DD hh:mm:ss");
			}
		},
		data() {
			return {
				search_name: '',
				tableData: {
					loading: true,
					tableList: [], //15
					currentPage: 1,
					pageSize: 15,
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
					url: that.url + '/api/v1/express/express-list',
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
				this.tableData.currentPage = 1;
				console.log(this.search_name);
			},

			handleCurrentChange(currentPage) {
				this.tableData.currentPage = currentPage;
				this.getDelivery();
			},
			clearSearchChange() {
				this.tableData.currentPage = 1;
				this.search_name = '';
				this.getDelivery();
			},
			datadetail(row) {
				this.$router.push({
					path: '/deliveparstlist',
					query: {
						id: row.id
					}
				})
			},
			delivedetail(row) {
				this.$router.push({
					path: '/deliverypage',
					query: {
						id: row.id,
						express_number: row.express_number,
						vehicle_numbers: row.vehicle_numbers,
						express_name: row.express_name
					}
				})
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
			margin: 0 0 1rem;
		}
	}
</style>
