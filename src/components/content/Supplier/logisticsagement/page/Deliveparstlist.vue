<template>
	<!-- 物流管理 -->
	<div class="Deliveparstlist">
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
			<el-table-column label="任务编号" width="90">
				<template slot-scope="scope">
					<span>{{ scope.row.task_id || '-- --' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="名称">
				<template slot-scope="scope">
					<span>{{ scope.row.product_name || '-- --' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="代号">
				<template slot-scope="scope">
					<span>{{ scope.row.item || '-- --' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="规格">
				<template slot-scope="scope">
					<span>{{ scope.row.specs || '-- --' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="工序名称">
				<template slot-scope="scope">
					<span>{{ scope.row.procedure_name || '-- --' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="工序" width="80">
				<template slot-scope="scope">
					<span>{{ scope.row.procedure_detail_number || '-- --' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="数量" width="65">
				<template slot-scope="scope">
					<span>{{ scope.row.number }}</span>
				</template>
			</el-table-column>
			<el-table-column label="零件类型" align="center" width="80">
				<template slot-scope="scope">
					<el-link :underline="false" type="primary" v-if="scope.row.product_type == 1">标准件</el-link>
					<el-link :underline="false" type="primary" v-if="scope.row.product_type == 2">加工件</el-link>
				</template>
			</el-table-column>
			<el-table-column label="批次" width="65">
				<template slot-scope="scope">
					<span>{{ scope.row.batch }}</span>
				</template>
			</el-table-column>
	
		</el-table>
	
		<div class="block">
			<el-pagination
				v-if="tableData.total > 15"
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
		name: "Deliveparstlist",
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
				ids: '',
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
			this.ids = this.$route.query.id;
			this.getDeliveparstlist();
		},
		methods: {
			getDeliveparstlist() {
				let that = this;
				that.axios({
					method: 'GET',
					url: that.url + '/api/v1/express/product-list',
					params: {
						page: that.tableData.currentPage,
						size: that.tableData.pageSize,
						express_delivery_id: that.ids
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
				this.getDeliveparstlist();
			},
			clearSearchChange() {
				this.tableData.currentPage = 1;
				this.search_name = '';
				this.getDeliveparstlist();
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
	.Deliveparstlist {
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
