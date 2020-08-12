<template>
	<div class="Deliverypage">
		<div class="pagewrap">
			<div class="title">快递名称：{{express_name || '自运'}}</div>
			<div class="title" v-if="express_number">快递编号：{{express_number}}</div>
			<div class="title" v-else>车牌号：{{vehicle_numbers}}</div>
		</div>
		<div class="delived">
			<el-timeline :reverse="false" v-if="activities.length">
				<el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.time" :color="activity.color">
					{{activity.context}}
				</el-timeline-item>
			</el-timeline>
			<div class="nulldelive" v-else>未跟踪到物流信息</div>
		</div>
	</div>
</template>

<script>
	import { mapState, mapGetters } from "vuex"
	export default {
		name: "Deliverypage",
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
				deliveid: '',
				delivedata: {},
				activities: [],
				express_number: '',
				vehicle_numbers: '',
				express_name: '',
			}
		},
		created() {
			this.deliveid = this.$route.query.id;
			this.express_number = this.$route.query.express_number;
			this.vehicle_numbers = this.$route.query.vehicle_numbers;
			this.express_name = this.$route.query.express_name;
			this.getdelivedetail();
		},
		methods: {
			getdelivedetail() {
				let that = this;
				that.axios({
					method: 'GET',
					url: that.url + '/api/v1/express/express-detail',
					params: {
						id: that.deliveid
					},
					headers: {
						"content-type": "application/json",
						'token': that.token
					}
				}).then( response => {
					if (response && response.data && response.data.code == 200) {
						var data = response.data.data;
						that.delivedata = data;
						if (data.data && data.data.length) {
							data.data[0].color = '#0bbd87';
							that.activities = data.data;
						}
					}
				}).catch( error => {
					console.log(error)
				});
			},
		}
	}
</script>

<style lang="less" scoped>
	.Deliverypage {
		padding: 20px;
		.pagewrap {
			line-height: 2;
		}
		.delived {
			margin-left: 30px;
			margin-top: 20px;
			.nulldelive {
				line-height: 30vw;
				text-align: center;
				font-size: x-large;
				color: darkgray;
			}
		}
	}
</style>
