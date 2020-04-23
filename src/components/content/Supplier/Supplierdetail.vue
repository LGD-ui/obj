<template>
	<!-- 供应商信息 -->
	<el-container>
		<Left />
		<el-container>
			<el-main style="padding: 10px;">
				<Head />
				<div class="Supplierdetail">
					
					<div class="box">
						<div class="title">
							<el-divider>供应商</el-divider>
						</div>
						<el-form ref="form" :model="form" label-width="110px">
							<el-form-item label="名称：">
								<div>{{form.supplier_name}}</div>
							</el-form-item>
							<el-form-item label="负责人：">
								<div>{{form.supplier_person}}</div>
							</el-form-item>
							<el-form-item label="电话：">
								<div>{{form.supplier_telphone}}</div>
							</el-form-item>
							
							<el-form-item label="地址：">
								<div>{{form.supplier_address}}</div>
							</el-form-item>
							<el-form-item label="描述：">
								<div>{{form.describe}}</div>
							</el-form-item>
						</el-form>
					</div>
					
				</div>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import { mapActions, mapState, mapGetters } from "vuex"
	import Left from '@/components/Left.vue'
	import Head from '@/components/Head.vue'
	export default {
		name: "Supplierdetail",
		components: {Left, Head},
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
				form: {},
			}
		},
		created() {
			this.getSupplierdetail();
		},
		methods: {
			getSupplierdetail() {
				let that = this;
				that.axios({
					method: 'GET',
					url: that.url + '/api/v1/supplier/detail',
					headers: {
						"content-type": "application/json",
						"token": that.token
					}
				}).then(function(response) {
					if (response && response.data && response.data.data && response.data.code == 200) {
						that.form = response.data.data;
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
		},
	}
</script>

<style lang="less" scoped>
	@px: 30px;
	.Supplierdetail {
		margin-top: @px;
		padding: @px;
		.box {
			width: 80%;
			margin: 0 auto;
			.el-form {
				width: 80%;
				margin: 0 auto;
			}
			/deep/ .el-divider__text {
				background-color: #F9F9F9;
				font-size: x-large;
			}
		}
	}
</style>
