<template>
	<div>
		<el-dialog :visible.sync="BatchDialogVisible.dialog" title="提交质检报告" :modal="false" :show-close="false" :before-close="close" width="700px">
			<div class="Batchdialog">
				<el-form label-width="110px" class="demo-ruleForm">
					<el-form-item label="名称：">
						<el-input v-model="BatchDialogVisible.obj.product_name" disabled></el-input>
					</el-form-item>
					<el-form-item label="工序：">
						<el-input v-model="BatchDialogVisible.obj.procedure_name" disabled></el-input>
					</el-form-item>
					<el-form-item label="数量：">
						<el-input v-model="BatchDialogVisible.obj.number" disabled></el-input>
					</el-form-item>
					<el-form-item label="生产编号：">
						<el-input v-model="BatchDialogVisible.obj.procedure_detail_number" disabled></el-input>
					</el-form-item>
					<el-form-item label="上传附件：" required>
						<el-upload
							drag
							action=""
							:show-file-list="true"
							:file-list="fileList"
							:before-upload="beforeUpload"
							:on-remove="handleRemove"
							style="line-height: 1;">
							<i class="el-icon-upload"></i>
							<div class="el-upload__text" style="line-height: 1;">将文件拖到此处，或<em>点击上传</em></div>
							<div class="el-upload__tip" slot="tip" style="line-height: 1;">只能上传jpg/png文件，且不超过500kb</div>
						</el-upload>
					</el-form-item>
					
					<el-form-item>
						<el-button type="primary" @click="postBatch">提交</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { mapActions, mapState, mapGetters } from "vuex"
	export default {
		name: 'Batchdialog',
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
			BatchDialogVisible: '',
		},
		data() {
			return {
				fileList: []
			}
		},
		created() {
			
		},
		methods: {
			/* 批量上传质检报告 */
			postBatch() {
				let that = this;
				if (that.fileList.length&&that.fileList[0]&&that.fileList[0].url) {
					var params = {
						type: 1,									// type	string	是	上传质检报告：1=统一上传，2=分个上传
						task_id: that.BatchDialogVisible.obj.id,	// task_id	string	是	计划ID
						parts_id: '',								// parts_id	string	是	具体零件ID
						presen_url: that.fileList[0].url,			// presen_url	string	是	工序地址
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
							that.close()
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
			
			close() {
				this.$emit("change", false);
				this.fileList = [];
			},
			
			
			/* 上传文件开始 */
			handleRemove(file, fileList) {
				this.fileList = [];
			},
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
						that.fileList = [];
						that.fileList.push({
							name: file.name,
							url: response.data.data.url
						})
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
	
	/deep/ .el-dialog__body {
		padding: 20px;
	}
	.Batchdialog {
		.demo-ruleForm {
			width: 500px;
			margin: 0 auto;
			.el-input, .el-select, .el-button {
				width: 360px;
			}
			
		}
	}
</style>
