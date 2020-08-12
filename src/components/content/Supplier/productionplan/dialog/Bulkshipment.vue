<template>
	<!-- Bulkshipment批量发货 -->
	<div class="bulkship">
		<el-dialog title="发货列表" :visible.sync="BulkshipdialogVisible.dialog" width="1100px" top="5vh" :close-on-click-modal="false" @close="bulkshipDialogclose">
			<div class="bulkshipwrap">
				<div class="search">
					<div class="demo-input-suffix">
						<el-input suffix-icon="el-icon-search" style="width: 300px;" v-model.trim="search_name"
							autofocus placeholder="搜索" @keyup.enter.native="searchChange">
							<el-button slot="append" type="primary" @click="searchChange">搜索</el-button>
						</el-input>
						<el-button type="info" plain @click="clearSearchChange">全部</el-button>
					</div>
					<!-- <el-select v-model="task" :value-key="task" placeholder="全部任务" class="taskList" @change="changetask">
						<el-option label="未开始" value="1"></el-option>
						<el-option label="生产中" value="2"></el-option>
						<el-option label="已完成" value="3"></el-option>
						<el-option label="已配送" value="4"></el-option>
						<el-option label="全部任务" value="0"></el-option>
					</el-select> -->
				</div>
				
				
				<el-table :data="tableData.tableList" :header-cell-style="tableheader" v-loading="tableData.loading " element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.5)" @selection-change="handleSelectionChange">
					<el-table-column type="selection" :selectable='checkboxT' width="50" align="center"></el-table-column>
					<el-table-column label="编号" width="70">
						<template slot-scope="scope">
							<span>{{ scope.row.id || '-- --' }}</span>
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
					<el-table-column label="型号规格">
						<template slot-scope="scope">
							<span>{{ scope.row.specs || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="工序名称">
						<template slot-scope="scope">
							<span>{{ scope.row.procedure_name || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="工序" width="60">
						<template slot-scope="scope">
							<span>{{ scope.row.procedure_detail_number || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="批次" width="60">
						<template slot-scope="scope">
							<span>{{ scope.row.batch || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="数量" width="60">
						<template slot-scope="scope">
							<span>{{ scope.row.number || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="生产日期" width="100">
						<template slot-scope="scope">
							<span>{{ scope.row.created_at | formatDate }}</span>
						</template>
					</el-table-column>
					<el-table-column label="完成状态" align="center" width="80">
						<template slot-scope="scope">
							<el-link :underline="false" size="mini" type="danger" v-if="scope.row.status == 1">未开始</el-link>
							<el-link :underline="false" size="mini" type="warning" v-if="scope.row.status == 2">生产中</el-link>
							<el-link :underline="false" size="mini" type="" v-if="scope.row.status == 3">已完成</el-link>
							<el-link :underline="false" size="mini" type="success" v-if="scope.row.status == 4">已配送</el-link>
						</template>
					</el-table-column>
					<el-table-column label="发货状态" align="center" width="80">
						<template slot-scope="scope">
							<el-link :underline="false" type="success" v-if="scope.row.status == 4">已发货</el-link>
							<el-link :underline="false" type="" v-else>未发货</el-link>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<el-pagination
				 
				@current-change="handleCurrentChange" 
				layout="prev, pager, next, jumper"
			    :page-size="tableData.pageSize"
				:total="tableData.total">
			</el-pagination>
			<div slot="footer" class="dialog-footer">
				<div class="downodebtn">
					<el-form ref="ruleForm" :model="ruleForm" :rules="rules" :inline="true" class="demo-form-inline">
						<el-form-item label="发货单填写" prop="worklist" style="float: left;">
							<el-select v-model="ruleForm.worklist" filterable placeholder="车间名称" class="chejianmingcehng">
								<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item prop="express_type"  style="float: left;">
							<el-select v-model="ruleForm.express_type" filterable placeholder="快递类型" class="kuaidileixing">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item prop="vehicle_numbers" style="float: left;">
							<el-form-item prop="vehicle_numbers" v-if="ruleForm.express_type == '0'">
								<el-input v-model.trim="ruleForm.vehicle_numbers" :maxlength="15" placeholder="车牌号(自提请输入车牌号)"></el-input>
							</el-form-item>
							<el-form-item prop="express_numbers" v-else>
								<el-input v-model.trim="ruleForm.express_numbers" :maxlength="15" placeholder="快递单号"></el-input>
							</el-form-item>
							<!-- <el-input v-model.trim="ruleForm.vehicle_numbers" :maxlength="15" autofocus placeholder="快递单号/车牌号"></el-input> -->
						</el-form-item>
						<el-form-item>
							<el-button @click="dialogclose">取 消</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" :disabled="showbbb" @click="bulkshipdata('ruleForm')">发 货</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</el-dialog>
	</div>
	
</template>

<script>
	import { mapState, mapGetters } from "vuex"
	import moment from 'moment'
	export default {
		name: 'Bulkshipment',
		props: ["BulkshipdialogVisible"],
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
				task: '0',
				options: [],
				options1: [],
				loading: '',
				tableData: {
					tableList: [],
					currentPage: 1,
					pageSize: 10,
					total: 0,
					bulkshipArr: [],
				},
				showbbb: false,
				ruleForm: {
					express_type: '', // 快递类型
					express_numbers: '', // 单号
					vehicle_numbers: '', // 车牌号
					worklist: '', // 车间名称
				},
				rules: {
					worklist: [
						{ required: true, message: '请选择要发往车间', trigger: 'change' }
					],
					express_type: [
						{ required: true, message: '请选择快递类型', trigger: 'change' }
					],
					express_numbers: [{
						required: true,
						message: '请填写快递单号',
						trigger: 'change'
					}],
					
				},
			}
		},
		methods: {
			// 获取列表
			getbulkshiplist() {
				let that = this;
				that.axios({
					method: 'POST',
					url: that.url+'/api/v1/supplier/send-detail',
					params: {
						page: that.tableData.currentPage,
						size: that.tableData.pageSize,
						product_id: that.BulkshipdialogVisible.obj.product_id
					},
					headers: {
						"content-type": "application/json",
						"token": that.token
					}
				}).then( response => {
					if (response && response.data && response.data.code == 200) {
						let data = response.data.data;
						that.tableData.total = data.count.total;
						that.tableData.tableList = data.list;
						that.showbbb = false;
					}
				}).catch( error => {
					console.log(error)
				});
			},
			// 提交按钮
			bulkshipdata(formName) {
				let that = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (that.tableData.bulkshipArr.length) {
							that.showbbb = true;
							
							let assemble = that.tableData.bulkshipArr;
							var params = {
								express_type: that.ruleForm.express_type, // express_type			string	是	快递类型
								express_numbers: that.ruleForm.express_numbers, // express_numbers		string	是	快递单号
								vehicle_numbers: that.ruleForm.vehicle_numbers, // vehicle_numbers		string	是	车牌号
								work_shop_id: that.ruleForm.worklist,
							}
							that.openFullScreen2();
							that.axios({
								method: 'POST',
								url: that.url + '/api/v1/supplier/send-many',
								data: {
									task_id: assemble
								},
								params: params,
								headers: {
									"content-type": "application/json",
									"token": that.token
								}
							}).then( response => {
								if (response && response.data.code == 200) {
									that.expressadd(assemble,params);
								}
							}).catch( error => {
								console.log(error)
								that.loading.close();
								that.$message({
									message: that.errmessage(error.response.data),
									type: 'warning'
								});
								that.showbbb = false;
							});
						} else {
							that.$message({
								message: '请选择要发货的数据',
								type: 'warning'
							})
						}
					} else {
						return false;
					}
				});
			},
			expressadd(task_id, params) {
				let that = this;
				that.axios({
					method: 'POST',
					url: that.url + '/api/v1/express/express-add',
					data: {
						task_id
					},
					params: params,
					headers: {
						"content-type": "application/json",
						"token": that.token
					}
				}).then( response => {
					if (response && response.data.code == 200) {
						that.$message({
						    showClose: true,
						    message: '发货成功',
						    type: 'success'
						})
						that.loading.close();
						that.$refs['ruleForm'].resetFields();
						that.getbulkshiplist();
					}
				}).catch( error => {
					that.loading.close();
					that.showbbb = false;
					that.$message({
						message: that.errmessage(error.response.data),
						type: 'warning'
					});
				});
			},
			
			
			
			
			// 搜索
			searchChange() {
				console.log(this.search_name);
			},
			// clear搜索value
			clearSearchChange() {
				this.search_name = '';
				this.getbulkshiplist();
			},
			// 任务下拉菜单
			changetask(value) {
				this.search_name = '';
				if (value == '0') {
					this.task = '';
					this.getbulkshiplist();
				} else {
					this.task = value;
					this.getbulkshiplist();
				}
			},
			// 分页
			handleCurrentChange(currentPage) {
				this.tableData.currentPage = currentPage;
				this.getbulkshiplist();
			},
			// 选中项
			handleSelectionChange(val) {
			    if (val.length > 0) {
					this.tableData.bulkshipArr = val.map(item => {
						if (item.status == 3) {
							item = item.id;
							return item;
						}
					})
			    } else {
					this.tableData.bulkshipArr = [];
				}
			},
			//复选框
			checkboxT(row, rowIndex){
				if (row.status == 3) {
					return true;
				} else {
					return false;
				}
			},
			
			/* 获取快递类型 */
			getexpress_type() {
				let that = this;
				that.axios({
					method: 'GET',
					url: that.url + '/api/v1/express',
					headers: {
						"content-type": "application/json",
						"token": that.token
					}
				}).then( response => {
					if (response && response.data && response.data.data && response.data.code == 200) {
						var data = response.data.data;
						that.options.push({ value: 0, label: '自运' });
						data.map(item => {
							that.options.push({ value: item.id, label: item.name });
						})
					}
				}).catch( error => {
					console.log(error)
				});
			},
			// 获取车间列表
			getworklist() {
				let that = this;
				that.axios({
					method: 'GET',
					url: that.url + '/api/v1/supplier/work-list',
					headers: {
						"content-type": "application/json",
						"token": that.token
					}
				}).then( response => {
					if (response && response.data && response.data.data && response.data.code == 200) {
						var data = response.data.data;
						data.map(item => {
							that.options1.push({ value: item.id, label: item.name });
						})
					}
				}).catch( error => {
					console.log(error)
				});
			},
			
			// 表头样式
			tableheader({ row, column, rowIndex, columnIndex }) {
				if (rowIndex === 0) {
					return 'background: rgb(243, 243, 243);padding: 6px 0;'
				}
			},
			// 加载层
			openFullScreen2() {
				this.loading = this.$loading({
					lock: true,
					text: '发货中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
			},
			
			dialogclose() {this.$emit("change", false);},
			bulkshipDialogclose() {
				this.$refs['ruleForm'].resetFields();
				this.search_name = '';
				this.task = '0';
				this.options = [];
				this.options1 = [];
				this.tableData = {
					tableList: [],
					currentPage: 1,
					pageSize: 10,
					total: 0,
					bulkshipArr: [],
				};
				this.showbbb = false;
				
			},
			
		}
	}
</script>

<style lang="less" scoped>
	.bulkship {
		/deep/.el-dialog {
			.el-dialog__body {
				padding: 0 20px;
			}
			.el-dialog__footer {
				padding: 10px 20px 10px;
				.dialog-footer {
					.downodebtn {
					    vertical-align: middle;
					}
				}
			}
			
		}
		.bulkshipwrap {
			margin-bottom: 10px;
			.search {
				margin-bottom: 10px;
				> div {
					display: inline-block;
					margin-right: 10px;
					> .el-button {
						width: 80px;
						margin-left: 10px;
					}
				}
				/deep/.el-select {
					.el-input {
						width: 150px;
					}
				}
			}
			.el-table {
				height: 525px;
			}
		}
	}
</style>
