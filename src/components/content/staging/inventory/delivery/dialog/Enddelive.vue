<template>
	<div class="Enddelive Enddelive">
		<el-dialog title="发货列表" :visible.sync="EnddelivedialogVisible.dialog" width="1000px" top="5vh" :close-on-click-modal="false" @close="close">
			<div class="Enddelivewrap">
				<el-table :data="EnddelivedialogVisible.arr" height="400" size="small">
					<el-table-column label="ID" property="product_id"></el-table-column>
					<el-table-column label="名称" property="product_name"></el-table-column>
					<el-table-column label="条码" property="parts_number"></el-table-column>
					<el-table-column label="编码" property="category"></el-table-column>
					<el-table-column label="批次" property="batch"></el-table-column>
					<el-table-column label="数量" property="count"></el-table-column>
				</el-table>
				<el-form ref="ruleForm" :model="ruleForm" :rules="rules" :inline="true" class="demo-form-inline">
					<el-form-item label="订单填写" prop="worklist" style="float: left;">
						<el-select v-model="ruleForm.worklist" filterable placeholder="车间名称" class="chejianmingcehng">
							<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="express_type"  style="float: left;">
						<el-select v-model="ruleForm.express_type" filterable placeholder="快递类型" class="kuaidileixing">
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<!-- <el-form-item prop="vehicle_numbers"  style="float: left;">
						<el-input v-model.trim="ruleForm.vehicle_numbers" :maxlength="15" autofocus placeholder="快递单号/车牌号"></el-input>
					</el-form-item> -->
					<el-form-item prop="vehicle_numbers" style="float: left;" v-if="ruleForm.express_type == '0'">
						<el-input v-model.trim="ruleForm.vehicle_numbers" :maxlength="15" placeholder="车牌号(自提请输入车牌号)"></el-input>
					</el-form-item>
					<el-form-item prop="express_numbers" style="float: left;" v-else>
						<el-input v-model.trim="ruleForm.express_numbers" :maxlength="15" placeholder="快递单号"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="close">取 消</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" :disabled="showbbb" @click="Enddelivedata('ruleForm')">发 货</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
	</div>
	
</template>

<script>
	import { mapState, mapGetters } from "vuex"
	import moment from 'moment'
	export default {
		name: 'Enddelive',
		props: ["EnddelivedialogVisible"],
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
				options: [],
				options1: [],
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
					vehicle_numbers: [
						{ required: false, message: '请输入快递单号/车牌号', trigger: 'blur' }
					],
					
				},
				loading: '',
				showbbb: false,
			}
		},
		methods: {
			
			// 提交按钮
			Enddelivedata(formName) {
				let that = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						var dataarr = that.EnddelivedialogVisible.arr;
						if (dataarr.length) {
							that.showbbb = true;
							var params = {
								express_type: that.ruleForm.express_type,		// express_type			string	是	快递类型
								express_numbers: that.ruleForm.express_numbers,							// express_numbers		string	是	快递单号
								vehicle_numbers: that.ruleForm.vehicle_numbers,	// vehicle_numbers		string	是	车牌号
								work_shop_id: that.ruleForm.worklist,
							}
							var assemble = [];
							
							dataarr.map(item => {
								assemble.push({
									product_id: item.product_id,
									parts_number: item.parts_number,
									product_name: item.product_name,
									category: item.category,
									number: item.count,
									batch: item.batch
								})
							})
							// console.log(params, assemble)
							that.openFullScreen2();
							that.axios({
								method: 'POST',
								url: that.url + '/api/v1/assemble-send/send',
								data: {
									assemble
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
									that.close();
									that.loading.close();
									that.$refs['ruleForm'].resetFields();
								}
							}).catch( error => {
								console.log(error)
								that.$message({
									message: that.errmessage(error.response.data),
									type: 'warning'
								});
								that.loading.close();
								that.$refs[formName].resetFields();
								that.showbbb = false;
							});
						} else {
							that.$message({
								message: '发货数据不能为空',
								type: 'warning'
							});
						}
						
					}
				})
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
						that.close();
						that.loading.close();
						that.$refs['ruleForm'].resetFields();
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
			
			openFullScreen2() {
				this.loading = this.$loading({
					lock: true,
					text: '发货中',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
			},
			
			close() {
				this.$emit("change", false);
				this.dialogclose('ruleForm');
			},
			dialogclose(formName) {
				this.$refs[formName].resetFields();
				this.options = [];
				this.options1 = [];
				this.$emit("change", false);
			},
			
		}
	}
</script>

<style lang="less" scoped>
	.Enddelive {
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
		.Enddelivewrap {
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
				margin-bottom: 10px;
			}
		}
	}
</style>
