<template>
	<div class="delivery">
		<el-dialog title="入库列表" :visible.sync="deliverydialogVisible.dialog" width="1000px" top="5vh" :close-on-click-modal="false" @close="deliveryDialogclose">
			<div class="deliverywrap">
				<div class="search">
					<div class="demo-input-suffix">
						<el-input suffix-icon="el-icon-search" style="width: 300px;" v-model.trim="search_name"
							autofocus placeholder="搜索" @input="searchChange" @keyup.enter.native="searchChange">
							<el-button slot="append" type="primary" @click="searchChange">搜索</el-button>
						</el-input>
						<el-button type="info" plain @click="clearSearchChange">全部</el-button>
					</div>
					<el-select v-model="task" :value-key="task" placeholder="全部任务" class="taskList" @change="changetask">
						<el-option label="未装配" value="1"></el-option>
						<el-option label="进行中" value="2"></el-option>
						<el-option label="已完成" value="3"></el-option>
						<el-option label="全部任务" value="0"></el-option>
					</el-select>
				</div>
				
				
				<el-table :data="tableData.tableList" :header-cell-style="tableheader" v-loading="tableData.loading " element-loading-text="加载中" element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.5)" @selection-change="handleSelectionChange">
					<el-table-column type="selection" :selectable='checkboxT' width="55" align="center"></el-table-column>
					<el-table-column label="条码" min-width="100">
						<template slot-scope="scope">
							<span>{{ scope.row.parts_number || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="名称">
						<template slot-scope="scope">
							<span>{{ scope.row.name || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="生产日期">
						<template slot-scope="scope">
							<span>{{ scope.row.created_at | formatDate }}</span>
						</template>
					</el-table-column>
					<el-table-column label="完成状态" align="center">
						<template slot-scope="scope">
							<el-link :underline="false" type="" v-if="scope.row.status == 1">未装配</el-link>
							<el-link :underline="false" type="warning" v-if="scope.row.status == 2">进行中</el-link>
							<el-link :underline="false" type="success" v-if="scope.row.status == 3">已完成</el-link>
						</template>
					</el-table-column>
					<el-table-column label="入库状态" align="center">
						<template slot-scope="scope">
							<el-link :underline="false" type="" v-if="scope.row.is_send == 1">未入库</el-link>
							<el-link :underline="false" type="success" v-if="scope.row.is_send == 2">已入库</el-link>
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
					<el-form :inline="true" class="demo-form-inline">
						<el-form-item>
							<el-button @click="dialogclose">取 消</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" :disabled="showbbb" @click="deliverydata">入 库</el-button>
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
		name: 'delivery',
		props: ["deliverydialogVisible"],
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
				task: '0',
				tableData: {
					tableList: [],
					currentPage: 1,
					pageSize: 10,
					total: 0,
					deliveryArr: [],
				},
				showbbb: false,
			}
		},
		methods: {
			// 获取列表
			getdeliverylist() {
				let that = this;
				that.axios({
					method: 'GET',
					url: that.url+'/api/v1/assemble/list',
					params: {
						page: that.tableData.currentPage,
						size: that.tableData.pageSize,
						type: '', // 装配类型：1=产品，2=模型
						status: that.task, // 状态：1=未装配，2=进行中，3=已完成
						module_id: '', // 目标id
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
			deliverydata() {
				let that = this;
				if (that.tableData.deliveryArr.length) {
					that.showbbb = true;
					let assemble = that.tableData.deliveryArr;
					that.axios({
						method: 'POST',
						url: that.url + '/api/v1/assemble/after-send',
						data: {
							assembleids: assemble
						},
						headers: {
							"content-type": "application/json",
							"token": that.token
						}
					}).then( response => {
						if (response && response.data.code == 200) {
							that.$message({
							    showClose: true,
							    message: '入库成功',
							    type: 'success'
							})
							that.getdeliverylist();
						}
					}).catch( error => {
						console.log(error)
						that.$message({
							message: that.errmessage(error.response.data),
							type: 'warning'
						});
						that.showbbb = false;
					});
				} else {
					that.$message({
						message: '请选择要入库的数据',
						type: 'warning'
					})
				}
			},
			
			
			
			
			
			// 搜索
			searchChange() {
				this.tableData.currentPage = 1;
				if (!this.search_name) this.search_name = '';
				this.getdeliverylist();
			},
			// clear搜索value
			clearSearchChange() {
				this.tableData.currentPage = 1;
				this.search_name = '';
				this.getdeliverylist();
			},
			// 任务下拉菜单
			changetask(value) {
				this.search_name = '';
				if (value == '0') {
					this.task = '';
					this.getdeliverylist();
				} else {
					this.task = value;
					this.getdeliverylist();
				}
			},
			// 分页
			handleCurrentChange(currentPage) {
				this.tableData.currentPage = currentPage;
				this.getdeliverylist();
			},
			// 选中项
			handleSelectionChange(val) {
			    if (val.length > 0) {
					this.tableData.deliveryArr = val.map(item => {
						if (item.status == 3) {
							item = item.id;
							return item;
						}
					})
			    } else {
					this.tableData.deliveryArr = [];
				}
			},
			//复选框
			checkboxT(row, rowIndex){
				if (row.status == 1 || row.status == 2 && row.is_send == 2) {
					return false;
				}
				if (row.status == 3 && row.is_send == 1) {
					return true;
				}
			},
			// 表头样式
			tableheader({ row, column, rowIndex, columnIndex }) {
				if (rowIndex === 0) {
					return 'background: rgb(243, 243, 243);padding: 6px 0;'
				}
			},
			
			
			
			dialogclose() {this.$emit("change", false);},
			deliveryDialogclose() {
				this.search_name = '';
				this.task = '0';
				this.tableData = {
					tableList: [],
					currentPage: 1,
					pageSize: 10,
					total: 0,
					deliveryArr: [],
				};
				this.showbbb = false;
				
			},
			
		}
	}
</script>

<style lang="less" scoped>
	.delivery {
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
		.deliverywrap {
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
