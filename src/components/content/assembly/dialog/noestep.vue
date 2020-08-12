<template>
	<div class="noestep">
		<el-dialog title="零件装配" :visible.sync="noestepdialogVisible.dialog" width="600px" :close-on-click-modal="false" show-close @close="noestepDialogclose(0)">
			<div class="noestepwrap">
				<el-input v-model.trim="stepcode" :autofocus="autofocus" @input="stepcodeget" placeholder="零件码"></el-input>
				<el-form label-width="100px">
					<el-form-item label="零件名称">
						<div class="stepname">{{stepdetail.element_name}}</div>
					</el-form-item>
					<el-form-item label="零件类型">
						<div class="stepname">{{stepdetail.element_type == 1?'配件':'模块'}}</div>
					</el-form-item>
					<el-form-item label="零件数量">
						<div class="stepname">{{stepdetail.is_use}}/{{stepdetail.element_number}}</div>
					</el-form-item>
					<el-form-item label="类别码">
						<div class="stepname">{{stepdetail.category}}</div>
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
		name: 'noestep',
		props: ["noestepdialogVisible"],
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
				autofocus: true,
				stepcode: '',
				stepdetail: ''
			}
		},
		methods: {
			getstep(val) {
				this.autofocus = true;
				this.stepdetail = val;
			},
			// 扫码零件信息
			stepcodeget() {
				let that = this;
				if (that.stepcode.length == 8) {
					let params = {
						parts_number: that.stepcode
					};
					that.axios({
						method: 'GET',
						url: that.url+'/api/v1/assemble/obtain',
						params: params,
						headers: {
							"content-type": "application/json",
							"token": that.token
						}
					}).then( response => {
						if (response && response.data && response.data.code == 200) {
							let data = response.data.data;
							console.log(data)
							if (data.category == that.stepdetail.category) {
								if (that.stepdetail.is_use < that.stepdetail.element_number) {
									// that.stepdetail.is_use += 1;
									that.assembleparts();
								} else if (that.stepdetail.is_use >= that.stepdetail.element_number) {
									that.$message({
										type: 'success',
										message: '当前零件已完成',
										offset: 200
									})
									that.noestepDialogclose(false)
								}
							}
						}
					}).catch( error => {
						console.log(error)
						that.$message({
							type: 'warning',
							message: '该零件未出库',
							offset: 200
						})
					});
				}
				
				
				
			},
			// 零件装配
			assembleparts() {
				let that = this;
				let params = {
					assemble_id: that.stepdetail.assemble_id_,				// assemble_id			int	是	任务ID
					pipeline_id: that.stepdetail.pipeline_id,				// pipeline_id			int	是	流水线ID
					pipeline_step_id: that.stepdetail.pipeline_step_id,		// pipeline_step_id		int	是	步骤ID
					parts_number: that.stepcode,							// parts_number			int	是	组装零件条形码
					number: 1,												// number				int	是	数量
				};
				that.axios({
					method: 'POST',
					url: that.url+'/api/v1/assemble/parts',
					params: params,
					headers: {
						"content-type": "application/json",
						"token": that.token
					}
				}).then( response => {
					if (response && response.data && response.data.code == 200) {
						console.log(response)
						let cha = that.stepdetail.element_number-that.stepdetail.is_use;
						if (cha > 0) {
							that.$message({
								message: '已添加1个，当前零件还需'+cha+'个',
								offset: 200
							})
							that.stepdetail.is_use += 1;
						}
						
					}
				}).catch( error => {
					console.log(error)
				});
				
			},
			
			
			
			noestepDialogclose({status=false}) {
				this.stepcode = '';
				this.$emit("change", status);
			},
		}
	}
</script>

<style lang="less" scoped>
	.noestepwrap {
		.el-input {
			width: 400px;
			display: block;
			margin: 0 auto;
		}
		.el-form {
			width: 80%;
			margin: 0 auto;
			.stepname {
				padding-left: 20px;
			}
		}
	}
</style>
