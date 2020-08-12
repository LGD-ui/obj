<template>
	<!-- 订单管理  订单列表详情 -->
	<div class="Order">
		<div class="search">
			<div class="demo-input-suffix">
				<div>
					<el-input suffix-icon="el-icon-search" style="width: 30.625rem;" v-model.trim="search_name"
						autofocus placeholder="搜索名称/规格/代号" @input="searchChange" @keyup.enter.native="searchChange">
						<el-button slot="append" type="primary" @click="searchChange">搜索</el-button>
					</el-input>
					<el-button type="info" plain style="width: 80px;margin-left: 10px;" @click="clearSearchChange">全部</el-button>
				</div>
				<!-- <div class="sorting">
					<el-button style="margin-right: 0px;" @click="downAll"><Icon type="md-cloud-download" /> 导出</el-button>
					
				</div> -->
			</div>
		</div>
	
		<el-table :data="tableData.tableList" :header-cell-style="tableheader" v-loading="tableData.loading " element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(0, 0, 0, 0.5)" >
			
			<el-table-column label="订单编号" min-width="60">
				<template slot-scope="scope">
					<span>{{ scope.row.order_id || '-- --' }}</span>
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
			<el-table-column label="代号">
				<template slot-scope="scope">
					<span>{{ scope.row.item || '-- --' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="型号规格">
				<template slot-scope="scope">
					<span>{{ scope.row.specs || '-- --' }}</span>
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
			<el-table-column label="进度">
				<template slot-scope="scope">
					<el-progress :percentage="scope.row.progressStatus" :text-inside="false" :show-text="false" status="success"></el-progress>
					<!-- <span>{{ scope.row.complete_number+'/'+scope.row.number || '' }}</span> -->
				</template>
			</el-table-column>
			<el-table-column label="生产/总数">
				<template slot-scope="scope">
					<span>{{ scope.row.task_number+'/'+scope.row.number || '-- --' }}</span>
				</template>
			</el-table-column>
			<!-- <el-table-column label="添加数量" width="150">
				<template slot-scope="scope">
					<el-input-number 
						v-model.trim="scope.row.num" 
						controls-position="right"
						size="small"
						:min="0" :max="scope.row.number-scope.row.complete_number" 
						:disabled="scope.row.complete_number==scope.row.number?true:false"
						style="width: 100%;">
					</el-input-number>
				</template>
			</el-table-column> -->
			<el-table-column label="生产计划" width="230">
				<template slot-scope="scope">
					<el-input-number
						v-model.trim="scope.row.num" 
						controls-position="right"
						size="small"
						:min="0" :max="scope.row.number-scope.row.task_number" 
						:disabled="scope.row.task_number>=scope.row.number?true:false"
						>
					</el-input-number>
					<el-button type="text" size="mini" :disabled="scope.row.task_number>=scope.row.number?true:false" @click="orderOkClick(scope.row)" style="height: 32px;margin-left: 10px;">生产</el-button>
					<!-- <el-button size="mini" :disabled="scope.row.task_number>=scope.row.number?true:false" style="height: 32px;margin-left: 5px;">生产</el-button> -->
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
	
	    <Secondstep ref="child" v-bind:SecondstepDialogVisible="SecondstepDialogVisible" @change="SecondstepClose" />
	
	</div>

</template>

<script>
	import { mapState, mapGetters } from "vuex"
    import Secondstep from '../../dialog/Secondstep.vue'
	export default {
		name: "Order",
		components: {Secondstep},
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
				name: '',
				batchs_: '',
				search_name: '',
				tableData: {
					loading: true,
					tableList: [], //15
					currentPage: 1,
					pageSize: 15,
					total: 0,
                },
                SecondstepDialogVisible: {
                    dialog: false,
                },
				showbtnbtn: false,
				
				batch: true,
				batchas: '',
				batchclass: 'el-icon-sort',
				item: true,
				itemas: '',
				itemclass: 'el-icon-sort',
				specs: true,
				specsas:'',
				specsclass: 'el-icon-sort',
			}
		},
		created() {
			this.batchs_ = this.$route.query.batch;
			this.getOrder();
			
		},
		methods: {
			getOrder() {
				let that = this;
				that.axios({
					method: 'GET',
					url: that.url + '/api/v1/supplier/list',
					data: '',
					params: {
						page: that.tableData.currentPage,
						size: that.tableData.pageSize,
						name: that.search_name,
						batch: that.batchs_
					},
					headers: {
						"content-type": "application/json",
						'token': that.token
					}
				}).then( response => {
					if (response && response.data && response.data.data && response.data.code == 200) {
						var data = response.data.data.list;
						that.tableData.total = response.data.data.count.total;
						data.map(item => {
							item.num = 0;
							item.progressStatus = parseInt((item.complete_number / item.number) * 100);
							return item;
						})
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
				if (!this.search_name) this.search_name = '';
				this.getOrder();
			},
			orderOkClick(row) {
				var that = this;
				that.showbtnbtn = true;
                if (row.procedure_detail_number != 1) {
                    that.SecondstepDialogVisible.dialog = true;
                    that.$refs.child.getSecondstep(row);
                } else {
                    that.msgboxDialog(row);
                }


			},
			suppliertaskadd (params) {
				var that = this;
				that.axios({
					method: 'POST',
					url: that.url + '/api/v1/supplier/task-add',
					data: '',
					params: params,
					headers: {
						"content-type": "application/json",
						"token": that.token
					}
				}).then(function(response) {
					if (response.data.code == 200) {
						that.$message({
						    showClose: true,
						    message: '操作成功',
						    type: 'success'
						})
						that.showbtnbtn = false;
						that.getOrder();
					}
				}).catch(function(error) {
					console.log(error)
					that.$message({
						type: "error",
						message: "前一个工序未完成或者完成数量不足",
						offset: 300
					})
				});
			},
			msgboxDialog(row) {
                let that = this;
                const h = this.$createElement;
                if (row.num > 0) {
                    that.$msgbox({
                        title: '提示',
                        message: h('p', null, [
                            h('span', null, '配件名称：'),
                            h('span', { style: 'color: teal' }, row.product_name),
                            h('span', null, '，数量：'),
                            h('span', { style: 'color: teal' }, row.num)
                        ]),
                        showClose: false,
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                                instance.confirmButtonLoading = true;
                                instance.confirmButtonText = '添加中...';
                                setTimeout(() => {
                                    done();
                                    setTimeout(() => {
                                        instance.confirmButtonLoading = false;
										
                                    }, 300);
                                }, 1000);
                            } else {
								that.showbtnbtn = false;
                                done();
                            }
                        }
                    }).then(action => {
                        console.log(row)
                        var params = {
                            order_detail_id: row.id,	    						// order_detail_id			string	是	订单详情ID
                            product_id: row.product_id,								// product_id				string	是	零件ID
                            procedure_id: row.procedure_id,							// procedure_id				string	是	工序ID
                            procedure_detail_number: row.procedure_detail_number,	// procedure_detail_number	string	是	工序序号
                            number: row.num,										// number					string	是	数量
                            type: 1,												// type						string	是	上传质检报告：1=统一上传，2=分个上传
                            product_type: row.product_type,							// product_type				string	是	类型：1=标准化，2=非标准化
                            batch: row.batch,                                       // batch	                string	是	批次
                            order_id: row.order_id,                                 // order_id	                string	是	订单ID
                            product_name: row.product_name,                         // product_name	            string	是	零件名称
                            parts: '',                                              // parts	                array	是	零件编码(第一工序可以传为空)
                            number_type: 1,                                         // number_type	            string	是	工序类型 1=第一道工序，2=非第一道工序
                        }
                        that.suppliertaskadd (params);
                    });
                } else {
                    that.$message({
                        message: '未添加计划数量',
                        offset: 200
                    })
                }
            },
			handleCurrentChange(currentPage) {
				this.tableData.currentPage = currentPage;
				this.getOrder()
			},
			clearSearchChange() {
				this.search_name = '';
				this.tableData.currentPage = 1;
				this.getOrder()
            },
			
			/* <i class="el-icon-sort"></i>
			<i class="el-icon-sort-up"></i>
			<i class="el-icon-sort-down"></i> 
			asc=正序，desc=倒序 */
			/* batchs() {
				if (this.batch) {
					this.batchas = 'asc';
					this.batchclass = 'el-icon-sort-down';
					this.batch = false;
					this.getOrder();
				} else {
					this.batchas = 'desc';
					this.batchclass = 'el-icon-sort-up';
					this.batch = true;
					this.getOrder();
				}
			},
			items() {
				if (this.item) {
					this.itemas = 'asc';
					this.itemclass = 'el-icon-sort-down';
					this.item = false;
					this.getOrder();
				} else {
					this.itemas = 'desc';
					this.itemclass = 'el-icon-sort-up';
					this.item = true;
					this.getOrder();
				}
			},
			specss() {
				if (this.specs) {
					this.specsas = 'asc';
					this.specsclass = 'el-icon-sort-down';
					this.specs = false;
					this.getOrder();
				} else {
					this.specsas = 'desc';
					this.specsclass = 'el-icon-sort-up';
					this.specs = true;
					this.getOrder();
				}
			}, */
			
			// 导出
			downAll() {
				let supplier_id = sessionStorage.getItem('Supplierid');
				if (supplier_id) {
					
					location.href = this.url + '/api/v1/supplier/export-order?supplier_id=' + supplier_id + '&batch=' + this.batchs_ + '&name=' + this.search_name;
					// console.log(this.url + '/api/v1/supplier/export-order?supplier_id=' + supplier_id + '&batch=' + this.batchs_ + '&name=' + this.search_name)
				} else {
					this.$message({
					    message: '未知供应商，请检查供应商信息',
					    offset: 200
					})
				}
			},
			
			
			
            SecondstepClose(params) {
                this.SecondstepDialogVisible.dialog = params;
				this.showbtnbtn = false;
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
	.Order {
		background: #FFFFFF;
		padding: 10px;
		.search {
			margin-bottom: 10px;
			> div {
				display: flex;
				justify-content: space-between;
			}
			.sorting {
				display: flex;
				line-height: 40px;
				overflow: hidden;
				font-size: 15px;
				font-weight: 600;
				margin-right: 15px;
				> div {
					margin: 0 10px;
					cursor: pointer;
				}
			}
		}
		.el-table {
			margin: 0 0 1rem;
			/deep/ .demo-table-expand {
				.el-form-item {
				    margin-bottom: 5px;
					.el-form-item__label {
					    color: #99a9bf;
						font-weight: bold;
					}
				}
				
			}
		}
		
	}
	/deep/ .v-modal {
		background: #0000;
	}
</style>