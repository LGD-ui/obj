<template>
	<!-- 待入库详情列表 -->
	<div class="Stockpend_list">
	    <div class="search">
	    	<div class="demo-input-suffix">
	    		<el-input suffix-icon="el-icon-search" style="width: 30.625rem;" v-model.trim="search_name"
	    			autofocus  placeholder="搜索" @input="searchChange" @keyup.enter.native="searchChange">
	    			<el-button slot="append" type="primary" @click="searchChange">搜索</el-button>
	    		</el-input>
	    		<el-button type="info" plain @click="clearSearchChange">全部</el-button>
	    		<el-input suffix-icon="el-icon-full-screen" style="width: auto;margin-left: 10px;" autofocus v-model.trim="parts_number"
	    		    placeholder="入库条码" @input="patternsave" >
	    		</el-input>
	    	</div>
	    </div>
		<el-table ref="stockpendTableData" :data="stockpendTableData.tableData">
	        <el-table-column label="零件名称">
	            <template slot-scope="scope">
	                <span style>{{ scope.row.product_name }}</span>
	            </template>
	        </el-table-column>
			<el-table-column label="图片" prop="image">
				<template slot-scope="scope">
					<el-popover placement="right" title="" trigger="click">
						<img :src="scope.row.image" style="height: 400px;">
						<img slot="reference" :src="scope.row.image" style="height: 50px;width: 50px;min-height: 50px;min-width: 50px;">
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column label="代号">
			    <template slot-scope="scope">
			        <span style>{{ scope.row.item || '-- --' }}</span>
			    </template>
			</el-table-column>
			<el-table-column label="型号规格">
			    <template slot-scope="scope">
			        <span style>{{ scope.row.specs  || '-- --' }}</span>
			    </template>
			</el-table-column>
			<el-table-column label="编码">
			    <template slot-scope="scope">
			        <span style>{{ scope.row.category }}</span>
			    </template>
			</el-table-column>
	        <el-table-column label="数量">
	            <template slot-scope="scope">
	                <span style>{{ scope.row.number }}</span>
	            </template>
	        </el-table-column>
			<el-table-column label="操作" width="150">
			    <template slot-scope="scope">
			        <el-link :underline="false" type="primary" size="small" @click="clickstock(scope.row)" >详情</el-link>
			    </template>
			</el-table-column>
			<!-- <el-table-column label="入库状态">
			    <template slot-scope="scope">
			        <span style>{{ scope.row.is_use == 2 ? '已入库' : '未入库' }}</span>
			    </template>
			</el-table-column> -->
	        <!-- <el-table-column label="状态" width="90" align="center">
				<template slot-scope="scope">
					<i class="el-icon-success" v-if="scope.row.success"></i>
				</template>
	        </el-table-column> -->
		</el-table>
		<div class="block">
			<el-pagination 
				v-if="stockpendTableData.total>10" 
				@current-change="handleCurrentChange" 
				:page-size="stockpendTableData.pageSize"
				layout="prev, pager, next, jumper"
				:total="stockpendTableData.total">
			</el-pagination>
		</div>
		
		<Stockpend ref="child" v-bind:stockpendDialogVisible="stockpendDialogVisible" @change="stockpendClose"></Stockpend>
		
	</div>
</template>

<script>
	import { mapState, mapGetters } from "vuex"
	import Stockpend from "../dialog/StockpendDialog.vue"
	export default {
		name: 'Stockpend_list',
		components: {Stockpend},
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
                obj: {
					express_type: '',
					express_numbers: '',
					send_supplier_id: '',
					send_shop_id: '',
				},
                search_name: '',
				parts_number: '',
				stockpendTableData: {
					tableData: [], //10
					currentPage: 1,
					pageSize: 15,
					total: 0,
				},
				statusLeng: 0,
				row: {},
				nullImg: 'http://zrui.e7vr.com/image/arm/default.gif',
				stockpendDialogVisible: {
				    dialog: false,
				    obj: {},
				},
			}
		},
		created() {
			this.stockpendDialogVisible.obj = this.obj = {
				express_type: this.$route.query.express_type,
				express_numbers: this.$route.query.express_numbers,
				send_supplier_id: this.$route.query.send_supplier_id,
				send_shop_id: this.$route.query.send_shop_id,
				send_time: this.$route.query.send_time
			};
			this.getSingle();
		},
		methods: {
			getSingle() {
                let that = this;
                that.autofocus = true;
				that.axios({
					method: 'GET',
					url: that.url + '/api/v1/pattern/product-list',
					params: {
						page: that.stockpendTableData.currentPage,
						size: that.stockpendTableData.pageSize,
						name: that.search_name,
						express_type: that.obj.express_type, 			// express_type			string	是	快递类型
						express_numbers: that.obj.express_numbers, 		// express_numbers		string	是	快递单号
						send_supplier_id: that.obj.send_supplier_id, 	// send_supplier_id		string	是	快递名称
						send_shop_id: that.obj.send_shop_id, 			// send_shop_id			string	是	发送单位
						send_time: that.obj.send_time
					},
					headers: {
						"content-type": "application/json",
						'token': that.token
					}
				}).then( response => {
					if (response && response.data && response.data.data && response.data.code == 200) {
						var data = response.data.data;
						that.stockpendTableData.total = data.count.total;
						data.list.map(item => {
							if (item.is_use == 2) {
								item.success = true;
								that.statusLeng += 1;
								item.num_ = item.number;
							} else {
								item.success = false;
								item.num_ = 0;
							}
							return item;
                        })
						// console.log(data, that.statusLeng)
						that.stockpendTableData.tableData = data.list;
					}
				}).catch( error => {
					console.log(error)
				});
			},
			/* 搜索 */
			searchChange() {
				this.tableData.currentPage = 1;
				if (!this.search_name) this.search_name = '';
				this.getSingle();
			},
			patternsave() {
			    let that = this;
				if (that.parts_number.length == 8) {
					that.axios({
						method: 'GET',
						url: that.url + '/api/v1/pattern/product-save',
						params: {
							parts_number: that.parts_number
						},
						headers: {
							"content-type": "application/json",
							'token': that.token
						}
					}).then( response => {
						if (response && response.data && response.data.code == 200) {
							that.$message({
								type: 'success',
								message: '操作成功',
								offset: 200
							})
							that.parts_number = '';
							that.getSingle();
						}
					}).catch( error => {
						console.log(error)
						that.$message({
							message: that.errmessage(error.response.data),
							type: 'warning'
						});
					});
				}
				
			},
			
			clickstock(row) {
				this.stockpendDialogVisible.dialog = true;
				this.stockpendDialogVisible.obj.row = row;
				this.$refs.child.getSingle();
			},
			
			
			
            clearSearchChange() {
                this.search_name = "";
            },
			/* 分页 */
			handleCurrentChange(currentPage) {
				this.stockpendTableData.currentPage = currentPage;
				this.getSingle();
            },
			stockpendClose(param) {
			    this.stockpendDialogVisible.dialog = param;
			    this.getSingle();
			},
			
		},
	}
</script>

<style lang="less" scoped>
	.Stockpend_list {
        .search {
			margin-top: 10px;
            > div {
                display: flex;
                > .el-button {
                    width: 80px;
                    margin-left: 10px;
                }
            }
        }
		/deep/ .el-table {
			margin-top: 10px;
			.el-button {
				width: 80px;
            }
            .el-icon-success {
                font-size: 18px;
                color: rgb(0, 202, 27);
            }
		}
		// /deep/ .el-table td, .el-table th {
		// 	padding: 7px 0 0;
		// }
		.block {
			margin-top: 10px;
		}
	}
	
</style>
