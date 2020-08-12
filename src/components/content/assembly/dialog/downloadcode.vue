<template>
	<div class="downloadcode">
		<el-dialog title="选择下载条码" :visible.sync="downcodedialogVisible.dialog" width="600px" :close-on-click-modal="false" :show-close="false" @close="downcodeDialogclose">
			<div>
				<el-radio v-model="radio7" :label="index" border @change="changeRadio" v-for="(item, index) in assemblechoice" :key="index" >{{item.name}}</el-radio>
			</div>
			<!-- <div style="text-align: right;">
				<el-radio-group v-model="radio8" style="padding-top: 30px;">
					<el-radio-button :label="1">产品</el-radio-button>
					<el-radio-button :label="2">模型</el-radio-button>
				</el-radio-group>
			</div> -->
			<div style="text-align: right;">
				<el-radio-group v-model="radio9" style="padding-top: 30px;">
					<el-radio-button :label="1">未装配</el-radio-button>
					<el-radio-button :label="2">进行中</el-radio-button>
					<el-radio-button :label="3">已完成</el-radio-button>
				</el-radio-group>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="downcodeDialogclose" >取 消</el-button>
				<el-button type="primary" @click="dialogFormVisible___">确认下载</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { mapState, mapGetters } from "vuex"
	export default {
		name: 'downloadcode',
		props: ["downcodedialogVisible"],
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
				assemblechoice: [],
				radio7: '',
				radio8: 2,
				radio9: '',
				obj: {},
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
					}
					
				}).catch( error => {
					console.log(error)
				});
			},
			changeRadio(label) {
				this.obj = this.assemblechoice[label];
			},
			dialogFormVisible___() {
				let that = this;
				const url = that.url;
				var token = that.token;
				let module_id = that.obj.module_id;
				let type = that.radio8;
				let status = that.radio9;
				if (module_id != '' && type != '' && status != '') {
					location.href = url + '/api/v1/assemble/export?module_id=' + module_id + '&type=' + type + '&status=' + status;
				} else {
					that.$message({
						message: '选择参数进行下载',
						type: 'warning',
						offset: 200
					});
				}
			},
			downcodeDialogclose() {
				this.radio7 = '';
				this.radio8 = '';
				this.radio9 = '';
				this.obj = {};
				this.$emit("change", false);
			},
		}
	}
</script>

<style lang="less" scoped>
	.downloadcode {
		.el-radio {
			min-width: 140px;
			margin-left: 10px;
			margin-bottom: 10px;
		}
	}
</style>
