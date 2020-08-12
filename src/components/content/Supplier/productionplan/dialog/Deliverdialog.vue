<template>
	<div>
		<el-dialog class="Productiondialog2" :visible.sync="DeliverdialogVisible.dialog" title="发货订单"
		 :close-on-click-modal="false" :before-close="close" width="900px">
			<div class="Deliverdialog">
				<!-- label-width="140px" -->
				<el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-position="top" class="demo-ruleForm">
					<el-row>
						<el-col :span="12">
							<el-form-item label="名称：">
								<el-input v-model="DeliverdialogVisible.obj.product_name" disabled></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="工序：">
								<el-input v-model="DeliverdialogVisible.obj.procedure_name" disabled></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>

						<el-col :span="12">
							<el-form-item label="数量：">
								<el-input v-model="DeliverdialogVisible.obj.number" disabled></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="发往车间：" prop="worklist">
								<el-select v-model="ruleForm.worklist" filterable placeholder="车间名称">
									<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="快递类型：" prop="express_type">
								<el-select v-model="ruleForm.express_type" filterable placeholder="快递类型">
									<el-option label="自运" :value="0"></el-option>
									<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="车牌号：" prop="vehicle_numbers" v-if="ruleForm.express_type == '0'">
								<el-input v-model.trim="ruleForm.vehicle_numbers" :maxlength="15" placeholder="车牌号(自提请输入车牌号)"></el-input>
							</el-form-item>
							<el-form-item label="快递单号：" prop="express_numbers" v-else>
								<el-input v-model.trim="ruleForm.express_numbers" :maxlength="15" placeholder="快递单号"></el-input>
							</el-form-item>
						</el-col>


					</el-row>
					<el-form-item>
						<el-button type="primary" :disabled="showbbb" @click="getBatch('ruleForm')">提交发货</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		mapActions,
		mapState,
		mapGetters
	} from "vuex"
	export default {
		name: 'Deliverdialog',
		components: {},
		computed: {
			...mapState({
				url: state => state.url,
			}),
			...mapGetters({
				token: "getToken"
			}),
		},
		props: {
			DeliverdialogVisible: '',
		},
		data() {
			return {
				ruleForm: {
					express_type: '',
					express_numbers: '',
					vehicle_numbers: '',
					worklist: '',
				},
				rules: {
					worklist: [{
						required: true,
						message: '请选择要发往车间',
						trigger: 'change'
					}],
					express_type: [{
						required: true,
						message: '请选择快递类型',
						trigger: 'change'
					}],
					express_numbers: [{
						required: true,
						message: '请填写快递单号',
						trigger: 'change'
					}],
				},
				loading: '',
				options: [],
				options1: [],
				showbbb: false,
			}
		},
		methods: {
			getBatch(formName) {
				let that = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						that.showbbb = true;
						var params = {
							task_id: that.DeliverdialogVisible.obj.id, // task_id				string	是	计划ID
							express_type: that.ruleForm.express_type, // express_type			string	是	快递类型
							express_numbers: that.ruleForm.express_numbers, // express_numbers		string	是	快递单号
							vehicle_numbers: that.ruleForm.vehicle_numbers, // vehicle_numbers		string	是	车牌号
							work_shop_id: that.ruleForm.worklist,
						}
						that.openFullScreen2();
						that.axios({
							method: 'POST',
							url: that.url + '/api/v1/supplier/send',
							data: '',
							params: params,
							headers: {
								"content-type": "application/json",
								"token": that.token
							}
						}).then(response => {
							if (response && response.data.code == 200) {
								that.expressadd([that.DeliverdialogVisible.obj.id], {
									express_type: that.ruleForm.express_type, // express_type			string	是	快递类型
									express_numbers: that.ruleForm.express_numbers, // express_numbers		string	是	快递单号
									vehicle_numbers: that.ruleForm.vehicle_numbers, // vehicle_numbers		string	是	车牌号
									work_shop_id: that.ruleForm.worklist,
								});
							}
						}).catch(error => {
							console.log(error)
							that.$refs[formName].resetFields();
							that.showbbb = false;
							that.$message({
								message: that.errmessage(error.response.data),
								type: 'warning'
							});
							
						});
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
				}).then(response => {
					if (response && response.data && response.data.data && response.data.code == 200) {
						var data = response.data.data;
						that.options = [];
						data.map(item => {
							that.options.push({
								value: item.id,
								label: item.name
							});
						})
					}
				}).catch(error => {
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
				}).then(response => {
					if (response && response.data && response.data.data && response.data.code == 200) {
						var data = response.data.data;
						that.options1 = [];
						data.map(item => {
							that.options1.push({
								value: item.id,
								label: item.name
							});
						})
					}
				}).catch(error => {
					console.log(error)
				});
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
			
			close() {
				this.ruleForm = {
					express_type: '',
					express_numbers: '',
					vehicle_numbers: '',
				};
				this.options = [];
				this.options1 = [];
				this.showbbb = false;
				this.$refs['ruleForm'].resetFields();
				this.$emit("change", false);
			},
		},
	}
</script>

<style lang="less" scoped>
	/deep/ .el-dialog__body {
		padding: 0px;
	}

	.Deliverdialog {
		/deep/.demo-ruleForm {
			width: 760px;
			margin: 0 auto;
			overflow: hidden;

			&.el-form--label-top .el-form-item__label {
				line-height: 25px;
				padding: 0;
			}

			.el-input,
			.el-select {
				width: 360px;
			}

			.el-button {
				width: 170px;
				float: right;
			}

		}
	}
</style>
