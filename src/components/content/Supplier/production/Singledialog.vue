<template>
	<div>
		<el-dialog :visible.sync="SingleDialogVisible.dialog" :modal="false" top="10vh" :show-close="false" :before-close="close" width="700px">
			<div class="Singledialog">
				<el-table ref="singleTableData" :data="singleTableData.tableData" @row-click="changeRowClick">
					<el-table-column label="序号" width="60">
						<template slot-scope="scope">
							<span>{{ scope.row.task_id || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="零件名称">
						<template slot-scope="scope">
							<span>{{ scope.row.product_name || '-- --' }}</span>
						</template>
					</el-table-column>
                    <el-table-column label="零件编码" width="100px">
						<template slot-scope="scope">
							<span>{{ scope.row.parts_number || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="数量">
						<template slot-scope="scope">
							<span>{{ scope.row.number || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="批次">
						<template slot-scope="scope">
							<span>{{ scope.row.batch || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="图片" align="center" width="90">
						<template slot-scope="scope">
									
							<el-popover placement="right" title="" trigger="hover">
								<img :src="scope.row.presen_url || nullImg" style="height: 500px;width: 500px">
								<img slot="reference" :src="scope.row.presen_url || nullImg"  alt="" style="height: 50px;width: 50px">
							</el-popover>
									
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="100px">
						<template slot-scope="scope">
							<!-- <el-button size="mini" icon="el-icon-plus"></el-button> -->
							
							<span v-if="scope.row.presen_url">
								<el-button type="success" size="mini">已提交</el-button>
							</span>
							<span v-else>
								<el-upload
									v-if="!scope.row.fileList0"
									class="upload-demo"
									action=""
									:show-file-list="false"
									:before-upload="beforeUpload">
									<el-button size="mini" type="primary">上传附件</el-button>
								</el-upload>
								<el-button type="primary" size="mini" v-if="scope.row.fileList0" @click="postSingle(scope.row)">提交</el-button>
							</span>
							
						</template>
					</el-table-column>
				</el-table>
				<div class="block">
					<el-pagination 
						v-if="singleTableData.total>10" 
						@current-change="handleCurrentChange" 
						layout="prev, pager, next, jumper"
						:total="singleTableData.total">
					</el-pagination>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { mapActions, mapState, mapGetters } from "vuex"
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
			SingleDialogVisible: '',
		},
		data() {
			return {
				obj: {},
				singleTableData: {
					tableData: [], //10
					currentPage: 1,
					pageSize: 10,
					total: 0,
				},
				row: {},
				nullImg: 'http://zrui.e7vr.com/image/arm/default.gif',
			}
		},
		methods: {
			getSingle(obj) {
				let that = this;
				if (obj) {
					that.obj = obj;
					that.singleTableData = {
						tableData: [], //10
						currentPage: 1,
						pageSize: 10,
						total: 0,
					};
				}
				that.axios({
					method: 'POST',
					url: that.url + '/api/v1/supplier/task-detail',
					data: '',
					params: {
						page: that.singleTableData.currentPage,
						size: that.singleTableData.pageSize,
						task_id: that.obj.id,	//任务id，库存列表不传递
					},
					headers: {
						"content-type": "application/json",
						'token': that.token
					}
				}).then( response => {
					if (response && response.data && response.data.data && response.data.code == 200) {
						var data = response.data.data.list;
						that.singleTableData.total = response.data.data.count.total;
						data.map((item, index) => {
							if (item.fileList0) {
								item.fileList0 = item.fileList0;
							} else {
								item.fileList0 = '';
							}
							item.index_ = index;
							return item;
						})
						that.singleTableData.tableData = data;
					}
				}).catch( error => {
					console.log(error)
				});
			},
			
			/* 单个上传质检报告 */
			postSingle(row) {
				let that = this;
				if (row.fileList0) {
					var params = {
						type: 2,									// type	string	是	上传质检报告：1=统一上传，2=分个上传
						task_id: '',								// task_id	string	是	计划ID
						parts_id: row.id,					// parts_id	string	是	具体零件ID
						presen_url: row.fileList0,			// presen_url	string	是	工序地址
					}
					that.axios({
						method: 'POST',
						url: that.url + '/api/v1/supplier/task-update',
						data: '',
						params: params,
						headers: {
							"content-type": "application/json",
							"token": that.token
						}
					}).then( response => {
						if (response && response.data.code == 200) {
							that.$message({
								message: '操作成功',
								type: 'success',
								offset: 300
							})
							that.singleTableData.tableData[that.row.index_].presen_url = row.fileList0;
							// that.getSingle();
						}
					}).catch( error => {
						console.log(error)
					});
				} else {
					that.$message({
						message: '请上传附件',
						type: 'warning',
						offset: 300
					})
				}
				
			},
			/* 分页 */
			handleCurrentChange(currentPage) {
				this.singleTableData.currentPage = currentPage;
				this.getSingle();
			},
			close() {
				this.$emit("change", false)
			},
			changeRowClick(row, column, event) {
				this.row = row;
			},
			/* 上传文件开始 */
			beforeUpload(file) { //需要上传的文件
				this.update(file);
			},
			update(file) { //上传附件（此时执行的是上传到服务器）
				var that = this;
				let postData = new FormData(); //创建form对象
				postData.append('file', file); //通过append向form对象添加数据
				that.axios.post(that.url + '/api/v1/upload', postData, {
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': that.token
					}
				}).then(function(response) {
					if (response && response.data && response.data.data && response.data.code == 200) {
						that.singleTableData.tableData[that.row.index_].fileList0 = response.data.data.url;
						
					}
					
				}).catch(function(error) {
					console.log(error);
				});
			},
			/* 上传文件结束 */
			
		},
	}
</script>

<style lang="less" scoped>
	/deep/ .el-dialog__header {
		padding: 0 !important;
	}
	/deep/ .el-dialog__body {
		padding: 20px;
	}
	.Singledialog {
		/deep/ .el-table {
			height: 698px;
			overflow: auto;
			.el-button {
				width: 80px;
			}
		}
		/deep/ .el-table td, .el-table th {
			padding: 7px 0 0;
		}
		.block {
			text-align: center;
			margin-top: 10px;
		}
	}
	
</style>
