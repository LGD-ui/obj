<template>
	<div>
		<el-dialog :visible.sync="DeliverdialogVisible.dialog" :modal="false" title="发货订单" :show-close="false" :before-close="close" width="700px">
			<div class="Deliverdialog">
				<el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
					<el-form-item label="名称：">
						<el-input v-model="DeliverdialogVisible.obj.product_name" disabled></el-input>
					</el-form-item>
					<el-form-item label="工序：">
						<el-input v-model="DeliverdialogVisible.obj.procedure_name" disabled></el-input>
					</el-form-item>
					<el-form-item label="数量：">
						<el-input v-model="DeliverdialogVisible.obj.number" disabled></el-input>
					</el-form-item>
					<el-form-item label="生产编号：">
						<el-input v-model="DeliverdialogVisible.obj.procedure_detail_number" disabled></el-input>
					</el-form-item>
					<el-form-item label="快递类型：" prop="express_type">
						<el-select v-model="ruleForm.express_type" filterable placeholder="快递类型">
							<el-option label="自运" :value="0"></el-option>
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="快递单号/车牌号：" prop="vehicle_numbers" v-if="ruleForm.express_type == 0">
						<el-input v-model.trim="ruleForm.vehicle_numbers" :maxlength="15" placeholder="快递单号/车牌号(自提请输入车牌号)"></el-input>
					</el-form-item>
					<el-form-item label="快递单号/车牌号：" prop="express_numbers" v-else>
						<el-input v-model.trim="ruleForm.express_numbers" :maxlength="15" placeholder="快递单号/车牌号(自提请输入车牌号)"></el-input>
					</el-form-item>
					
					<!-- <el-form-item label="车牌号：">
						<el-input v-model.trim="ruleForm.vehicle_numbers" :maxlength="8" placeholder="车牌号"></el-input>
					</el-form-item> -->
					
					<el-form-item>
						<el-button type="primary" @click="getBatch('ruleForm')">提交发货</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { mapActions, mapState, mapGetters } from "vuex"
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
				},
				rules: {
					express_type: [
						{ required: true, message: '请选择快递类型', trigger: 'change' }
					],
					express_numbers: [
						{ required: true, message: '请输入快递单号/车牌号', trigger: 'blur' }
					],
					
				},
				options: [],
			}
		},
		created() {},
		mounted() {
			this.getexpress_type();
		},
		methods: {
			getBatch(formName) {
				let that = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						var express_numbers = that.ruleForm.express_type != 0 ? that.ruleForm.express_numbers : '';
						var vehicle_numbers = that.ruleForm.express_type == 0 ? that.ruleForm.vehicle_numbers : '';
						var params = {
							task_id: that.DeliverdialogVisible.obj.id,			// task_id				string	是	计划ID
							express_type: that.ruleForm.express_type,			// express_type			string	是	快递类型
							express_numbers: express_numbers,					// express_numbers		string	是	快递单号
							vehicle_numbers: vehicle_numbers,					// vehicle_numbers		string	是	车牌号
						}
						that.axios({
							method: 'POST',
							url: that.url + '/api/v1/supplier/send',
							data: '',
							params: params,
							headers: {
								"content-type": "application/json",
								"token": that.token
							}
						}).then( response => {
							if (response && response.data.code == 200) {
								that.$message({
								    showClose: true,
								    message: '操作成功',
								    type: 'success'
								})
								that.close();
							}
						}).catch( error => {
							console.log(error)
							that.ruleForm = {
								express_type: '',
								express_numbers: '',
								vehicle_numbers: '',
							};
							that.$refs['ruleForm'].resetFields();
						});
					} else {
						return false;
					}
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
						data.map(item => {
							that.options.push({ value: item.id, label: item.name });
						})
					}
				}).catch( error => {
					console.log(error)
				});
			},
			
			close() {
				this.ruleForm = {
					express_type: '',
					express_numbers: '',
					vehicle_numbers: '',
				};
				this.$refs['ruleForm'].resetFields();
				this.$emit("change", false);
			},
		},
	}
</script>

<style lang="less" scoped>
	
	/deep/ .el-dialog__body {
		padding: 20px;
	}
	.Deliverdialog {
		.demo-ruleForm {
			width: 500px;
			margin: 0 auto;
			.el-input, .el-select, .el-button {
				width: 360px;
			}
			
		}
	}
		
	
</style>
