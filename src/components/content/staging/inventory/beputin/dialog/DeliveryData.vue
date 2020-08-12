<template>
	<!-- 待入库物流详情 -->
	<el-dialog :visible.sync="DeliveryDataDialogVisible.dialog" top="10vh" class="DeliveryData_dialog" :close-on-click-modal="false" @close="close" width="700px">
		<div class="delived">
			<el-timeline :reverse="false" v-if="activities.length">
				<el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.time" :color="activity.color">
					{{activity.context}}
				</el-timeline-item>
			</el-timeline>
			<div class="nulldelive" v-else>{{message}}</div>
		</div>
	</el-dialog>
</template>

<script>
	import { mapState, mapGetters } from "vuex"
	export default {
		name: "DeliveryData",
		computed: {
			...mapState({
				url: state => state.url,
			}),
			...mapGetters({
				token: "getToken"
			})
		},
		props: {
			DeliveryDataDialogVisible: '',
		},
		data() {
			return {
				activities: [],
				message: '',
			}
		},
		methods: {
			getDedata() {
				let that = this;
				let obj = that.DeliveryDataDialogVisible.obj;
				that.axios({
					method: 'GET',
					url: that.url + '/api/v1/pattern/order/logistics',
					params: {
						express_type: obj.express_type,			// express_type		string	是	快递类型
						express_numbers: obj.express_numbers,	// express_numbers	string	是	快递单号
					},
					headers: {
						"content-type": "application/json",
						'token': that.token
					}
				}).then( response => {
					if (response && response.data && response.data.code == 200) {
						var data = response.data.data;
						if (data.data && data.data.length) {
							data.data[0].color = '#0bbd87';
							that.activities = data.data;
						} else {
							that.message = data.message;
						}
					}
				}).catch( error => {
					console.log(error)
				});
			},
			
			
			close() {
				this.activities = [];
				this.message = '';
			    this.$emit("change", false);
			},
		}
	}
</script>

<style lang="less" scoped>
	.delived {
		height: 50vh;
		overflow: auto;
	}
</style>
