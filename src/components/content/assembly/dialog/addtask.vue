<template>
	<div class="addtask">
		<el-dialog title="添加任务" :visible.sync="addtaskdialogVisible.dialog" width="600px" :close-on-click-modal="false" :show-close="false" @close="addtaskDialogclose">
			<div class="taskwrap">
				<el-radio v-model="radio7" :label="index" border @change="changeRadio" v-for="(item, index) in assemblechoice" :key="index" >{{item.name}}</el-radio>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addtaskDialogclose">取 消</el-button>
				<el-button :disabled="btndes" type="primary" @click="addtaskdata">确 定</el-button>
			</div>
		</el-dialog>
	</div>
	
</template>

<script>
	import { mapState, mapGetters } from "vuex"
	export default {
		name: 'addtask',
		props: ["addtaskdialogVisible"],
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
				btndes: false,
				radio7: '',
				assemblechoice: [],
				addthis: {},
			}
		},
		methods: {
			getassemblechoice() {
				let that = this;
				that.axios({
					method: 'GET',
					url: that.url+'/api/v1/assemble/choice',
					headers: {
						"content-type": "application/json",
						"token": that.token
					}
				}).then( response => {
					if (response && response.data && response.data.code == 200) {
						let data = response.data.data;
						that.assemblechoice = data;
						that.btndes = false;
					}
					
				}).catch( error => {
					console.log(error)
				});
			},
			changeRadio(label) {
				this.addthis = this.assemblechoice[label];
			},
			addtaskdata() {
				let that = this;
				that.btndes = true;
				let params = {
					name: that.addthis.name,				// name	int	是	名称
					id: that.addthis.id,					// id	int	是	id
					module_id: that.addthis.module_id,		// module_id	int	是	模块ID
				};
				that.axios({
					method: 'POST',
					url: that.url+'/api/v1/assemble/save',
					params: params,
					headers: {
						"content-type": "application/json",
						"token": that.token
					}
				}).then( response => {
					if (response && response.data && response.data.code == 200) {
						that.$notify({
							title: '成功',
							message: '模块创建成功',
							type: 'success'
						});
						that.addtaskDialogclose();
					}
					
				}).catch( error => {
					that.btndes = false;
					that.$message({
						message: that.errmessage(error.response.data),
						type: 'warning'
					});
					console.log(error)
				});
			},
			addtaskDialogclose() {
				this.radio7 = '';
				this.$emit("change", false);
			},
		}
	}
</script>

<style lang="less" scoped>
	.addtask {
		.taskwrap {
			.el-radio {
				min-width: 140px;
				margin-left: 10px;
				margin-bottom: 10px;
			}
		}
	}
</style>
