<template>
	<div class="breakage">
		<div style="text-align: center;margin-bottom: 20px;font-size: 1.125rem;">配件报损</div>
		<el-form :inline="true" :rules="rules" :model="formInline" ref="formInline" class="demo-form-inline">
			<div style="border-bottom:1px solid #e5e5e5;">
				<el-form-item label="报损编号" required prop="code">
					<el-input v-model.trim="formInline.code" placeholder="报损编号"></el-input>
				</el-form-item>
				<el-form-item label="物品名称" required prop="name">
					<el-input v-model.trim="formInline.name" placeholder="物品名称"></el-input>
				</el-form-item>
			</div>
			<div style="border-bottom:1px solid #e5e5e5;margin-top:1.375rem;">
				<el-form-item label="经办人" required prop="username">
					<el-input v-model.trim="formInline.username" placeholder="经办人"></el-input>
				</el-form-item>
				<el-form-item label="报损部门" required prop="section">
					<el-select v-model.trim="formInline.section" placeholder="报损部门">
						<el-option label="生产部" value="生产部"></el-option>
						<el-option label="库管部" value="库管部"></el-option>
					</el-select>
				</el-form-item>
			</div>
			<div style="border-bottom:1px solid #e5e5e5;margin-top:1.375rem;">
				<el-form-item label="报损日期" required>
					<el-col :span="11">
						<el-form-item prop="date1">
							<el-date-picker type="date" placeholder="选择日期" v-model.trim="formInline.date1" style="width: 100%;"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="line" :span="2" style="text-align: center;">-</el-col>
					<el-col :span="11">
						<el-form-item prop="date2">
							<el-time-picker placeholder="选择时间" v-model.trim="formInline.date2" style="width: 100%;margin-left:10px;"></el-time-picker>
						</el-form-item>
					</el-col>
				</el-form-item>
			</div>
			<div style="border-bottom:1px solid #e5e5e5;margin-top:1.375rem;">
				<el-form-item label="报损原因" required prop="region">
					<el-select v-model.trim="formInline.region" placeholder="报损原因">
						<el-option label="锈蚀" value="锈蚀"></el-option>
						<el-option label="老化" value="老化"></el-option>
					</el-select>
				</el-form-item>
			</div>
			<div style="margin-top:1.375rem;">
				<el-form-item label="备注" required prop="desc">
					<el-input type="textarea" v-model.trim="formInline.desc" style="width: 30rem;"></el-input>
				</el-form-item>
			</div>
			<div style="margin:0 auto;width:12rem">
				<el-form-item>
					<el-button type="primary" @click="submitForm('formInline')">立即创建</el-button>
					<el-button @click="resetForm('formInline')">取消</el-button>
				</el-form-item>
			</div>

		</el-form>
	</div>

</template>

<script>
	import { mapActions, mapState, mapGetters } from "vuex"
	export default {
		name: 'breakage',
		computed: {
			...mapGetters({
				url: "geturl",
				token: "getToken"
			})
		},
		data() {
			return {
				formInline: {
					code: '',
					name: '',
					username: '',
					section: '',
					region: '',
					date1: '',
					date2: '',
					desc: ''
				},
				rules: {
					code: [{
							required: true,
							message: '请输入报损编号',
							trigger: 'blur'
						},
						{
							min: 1,
							message: '长度至少一位',
							trigger: 'blur'
						}
					],
					name: [{
						required: true,
						message: '请输入报损名称',
						trigger: 'blur'
					}],
					username: [{
						required: true,
						message: '请输入经办人',
						trigger: 'blur'
					}],
					section: [{
						required: true,
						message: '请选择',
						trigger: 'change'
					}],
					region: [{
						required: true,
						message: '请选择',
						trigger: 'change'
					}],
					date1: [{
						type: 'date',
						required: true,
						message: '请选择日期',
						trigger: 'change'
					}],
					date2: [{
						type: 'date',
						required: true,
						message: '请选择时间',
						trigger: 'change'
					}],
					desc: [{
						required: true,
						message: '请输入',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						console.log(this.formInline);
					} else {
						return false;
					}
				});
			},

			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		}
	}
</script>
<style scoped="">
	.breakage {
		max-width: 40rem;
		margin: 0 auto;
		border: 1px solid #e5e5e5;
		padding: 20px;
		margin-top: 1.25rem;
	}

	.el-form-item {
		/* margin-bottom: 12px;
      margin-top:12px; */
	}
</style>
