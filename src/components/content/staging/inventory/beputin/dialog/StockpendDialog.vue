<template>
	<!-- 待入库详情当前修改版本 -->
	<div>
		<el-dialog :visible.sync="stockpendDialogVisible.dialog" top="10vh" class="stockpend_dialog" :close-on-click-modal="false" @close="close" width="1000px">
			<div class="stockpenddialog">
                <div class="search">
                    <div class="demo-input-suffix">
                        <el-input suffix-icon="el-icon-full-screen" style="width: 30.625rem;" @change="getfocus" :autofocus="autofocus" v-model.trim="search_name"
                            placeholder="入库条码" @input="searchChange" >
                        </el-input>
                    </div>
                </div>
				<el-table ref="stockpendTableData" :data="stockpendTableData.tableData" height="528">
					<el-table-column label="序号" width="70" >
                        <template slot-scope="scope">
                            <span style>{{ scope.row.id}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="零件名称">
                        <template slot-scope="scope">
                            <span style>{{ scope.row.product_name }}</span>
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
                    <el-table-column label="零件条码" width="100">
                        <template slot-scope="scope">
                            <span style>{{ scope.row.parts_number }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="批次" width="60">
                        <template slot-scope="scope">
                            <span style>{{ scope.row.batch }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="数量" width="70">
                        <template slot-scope="scope">
                            <span style>{{ scope.row.number }}</span>
                        </template>
                    </el-table-column>
					<el-table-column label="入库状态" width="90">
					    <template slot-scope="scope">
					        <span style>{{ scope.row.is_use == 2 ? '已入库' : '未入库' }}</span>
					    </template>
					</el-table-column>
				</el-table>
				<!-- <div class="block">
					<el-pagination 
						v-if="stockpendTableData.total>10" 
						@current-change="handleCurrentChange" 
						:page-size="stockpendTableData.pageSize" 
						layout="prev, pager, next, jumper"
						:total="stockpendTableData.total">
					</el-pagination>
				</div> -->
				
				
				
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { mapState, mapGetters } from "vuex"
	
	export default {
		name: 'Singledialog',
		components: {},
		computed: {
			...mapState({
				url: state => state.url,
			}),
			...mapGetters({
				token: "getToken"
			})
		},
		props: {
			stockpendDialogVisible: '',
		},
		data() {
			return {
                obj: '',
                search_name: '',
                autofocus: true,
				stockpendTableData: {
					tableData: [], //10
					currentPage: 1,
					pageSize: 10,
					total: 0,
				},
				statusLeng: 0,
				row: {},
				nullImg: 'http://zrui.e7vr.com/image/arm/default.gif',
			}
		},
		methods: {
			getSingle() {
                let that = this;
                that.autofocus = true;
				let obj = that.stockpendDialogVisible.obj;
				that.axios({
					method: 'GET',
					url: that.url + '/api/v1/pattern/product-list-detail',
					params: {
						product_id: obj.row.product_id,
						express_type: obj.express_type, 			// express_type			string	是	快递类型
						express_numbers: obj.express_numbers, 		// express_numbers		string	是	快递单号
						send_supplier_id: obj.send_supplier_id, 	// send_supplier_id		string	是	快递名称
						send_shop_id: obj.send_shop_id, 			// send_shop_id			string	是	发送单位
						send_time: obj.send_time
					},
					headers: {
						"content-type": "application/json",
						'token': that.token
					}
				}).then( response => {
					if (response && response.data && response.data.data && response.data.code == 200) {
						var data = response.data.data;
						// that.stockpendTableData.total = data.count.total;
						data.map(item => {
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
						that.stockpendTableData.tableData = data;
					}
				}).catch( error => {
					console.log(error)
				});
			},
			searchChange() {
				let that = this;
				if (that.search_name.length == 8) {
					that.axios({
						method: 'GET',
						url: that.url + '/api/v1/pattern/generate',
						data: '',
						params: {
							category: that.search_name,	//任务id，库存列表不传递
						},
						headers: {
							"content-type": "application/json",
							'token': that.token
						}
					}).then( response => {
						if (response && response.data && response.data.data && response.data.code == 200) {
							var data = response.data.data;
							var list = that.stockpendTableData.tableData;
							var status = 0;
							list.map(item => {
                                //
								if (item.is_use == 1 ) {
									if (item.product_type == 1 && data.category == that.search_name && data.id == Number(item.product_id)) {
										item.num_ = item.number;
										status += 1;
										if (list.length == status) that.patternsave(that.search_name);
									}
									if (item.product_type == 2 && item.num_ < item.number && item.parts_number == that.search_name) {
										item.num_ += 1;
                                        that.patternsave(that.search_name)
										return false;
									}
								}
                            })
						}
					}).catch( error => {
						console.log(error)
					});
				}
				
            },
			patternsave(parts_number) {
                let that = this;
				that.axios({
					method: 'GET',
					url: that.url + '/api/v1/pattern/product-save',
					params: {
						parts_number
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
						that.search_name = '';
						that.getSingle();
					}
				}).catch( error => {
					console.log(error)
					that.$message({
						message: that.errmessage(error.response.data),
						type: 'warning'
					});
				});
			},
            clearSearchChange() {
                this.search_name = "";
            },
			/* 分页 */
			handleCurrentChange(currentPage) {
				this.stockpendTableData.currentPage = currentPage;
				this.getSingle();
            },
            getfocus() {
                this.autofocus = true;
            },
			
			close() {
				this.statusLeng = 0;
                this.search_name = "";
				this.autofocus = true,
				this.stockpendTableData = {
					tableData: [], //10
					currentPage: 1,
					pageSize: 10,
					total: 0,
				},
                this.$emit("change", false);
			},
			
		},
	}
</script>

<style lang="less" scoped>
	/deep/ .el-dialog__header {
        padding: 0 !important;
        .el-dialog__headerbtn {
            top: 10px;
            right: 10px;
            font-size: 25px;
        }
	}
	/deep/ .el-dialog__body {
		padding: 20px;
	}
	.stockpenddialog {
        .search {
            .demo-input-suffix {
                text-align: center;
                .el-input {
                    width: 17.625rem !important;
                }
            }
        }
		/deep/ .el-table {
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
			text-align: center;
			margin-top: 10px;
		}
	}
	
</style>
