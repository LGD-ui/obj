<template>
	<!-- 订单管理 -->
	<el-container>
		<Left/>
		<el-container>
			<el-main style="padding: 10px;">
				<Head/>
				<div class="Order">
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
                        <el-table-column label="工序">
							<template slot-scope="scope">
								<span>{{ scope.row.procedure_detail_number || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="数量(未生产/总数)">
							<template slot-scope="scope">
								<span>{{ scope.row.complete_number+'/'+scope.row.number || '-- --' }}</span>
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
									:min="0" :max="scope.row.number-scope.row.complete_number" 
									:disabled="scope.row.complete_number==scope.row.number?true:false"
									>
								</el-input-number>
								<el-button size="mini" icon="el-icon-plus" :disabled="scope.row.complete_number==scope.row.number?true:false" @click="orderOkClick(scope.row)" style="height: 32px;margin-left: 5px;"></el-button>
							</template>
						</el-table-column>
						<!-- <el-table-column label="备注">
							<template slot-scope="scope">
								<span>{{ scope.row.note || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="总数量">
							<template slot-scope="scope">
								<span >{{ scope.row.stock || '-- --' }}</span>
							</template>
						</el-table-column> -->
						<!-- <el-table-column label="图片">
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
						<!-- 
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

                    <Secondstep ref="child" v-bind:SecondstepDialogVisible="SecondstepDialogVisible" @change="SecondstepClose" />

				</div>
			</el-main>
		</el-container>
	</el-container>

</template>

<script>
	import { mapActions, mapState, mapGetters } from "vuex"
	import Left from '@/components/Left.vue'
    import Head from '@/components/Head.vue'
    import Secondstep from './production/Secondstep'
	export default {
		name: "Order",
		components: {Left, Head, Secondstep},
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
					tableList: [], //15
					currentPage: 1,
					pageSize: 10,
					total: 0,
                },
                SecondstepDialogVisible: {
                    dialog: false,
                },
			}
		},
		created() {
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
						page: that.currentPage,
						size: that.pageSize,
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
				console.log(this.search_name);
			},
			orderOkClick(row) {
				var that = this;
                if (row.id == 7 || row.id == 5) {
                    console.log('row.id == 7 || row.id == 5', row.id)
                    that.SecondstepDialogVisible.dialog = true;
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
                                done();
                            }
                        }
                    }).then(action => {
                        var params = {
                            order_detail_id: row.order_id,							// order_detail_id			string	是	订单详情ID
                            product_id: row.product_id,								// product_id				string	是	零件ID
                            procedure_id: row.procedure_id,							// procedure_id				string	是	工序ID
                            procedure_detail_number: row.procedure_detail_number,	// procedure_detail_number	string	是	工序序号
                            number: row.num,										// number					string	是	数量
                            type: 1,												// type						string	是	上传质检报告：1=统一上传，2=分个上传
                            product_type: row.product_type,										// product_type				string	是	类型：1=标准化，2=非标准化
                        }
                        that.suppliertaskadd (params);
                    });
                } else {
                    that.$message({
                        message: '未添加计划数量',
                        offset: 300
                    })
                }
            },
			handleCurrentChange(currentPage) {
				this.tableData.currentPage = currentPage;
				this.getOrder()
			},
			clearSearchChange() {
				this.search_name = '';
				this.getOrder()
            },
            SecondstepClose(params) {
                this.SecondstepDialogVisible.dialog = params;
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
	/deep/ .v-modal {
		background: #0000;
	}
</style>