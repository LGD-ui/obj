<template>
	<!-- 库存出库 -->
	<div class="new_out">
		<div style="min-height: 720px;">
			<div class="out_wrap" style="margin-top:20px">
				<el-input suffix-icon="el-icon-full-screen" style="width: auto;" v-model.trim="Outcode_val"
					autofocus  placeholder="" @input="Outcode_Data" @keyup.enter.native="Outcode_Data">
					<el-button slot="append" type="success" @click="clear">清除</el-button>
				</el-input>
			</div>
	
			<div class="main_del">
				<div class="main_title">零件信息</div>
	
				<el-table :data="tableDatas" style="width: 100%" height="65vh" >
					<el-table-column prop="product_name" label="图样名称"></el-table-column>
					<el-table-column prop="item" label="图样代号"></el-table-column>
					<el-table-column prop="specs" label="规格"></el-table-column>
					<el-table-column prop="material" label="材料"></el-table-column>
					<el-table-column prop="parts_number" label="条码"></el-table-column>
					<el-table-column prop="category" label="零件编码"></el-table-column>
					<el-table-column prop="count" label="数量"></el-table-column>
					<el-table-column label="" width="80">
						<template slot-scope="scope">
							<el-link :underline="false" type="warning" @click="changeDetale(scope.$index)">删除</el-link>
						</template>
					</el-table-column>
				</el-table>
				<div style="text-align: right;padding: 15px 0;height: 70px;">
					<el-button v-if="btn" type="primary" :disabled="ifBtn" @click="onOut">出库</el-button>
				</div>
				<!-- <div class="block">
					<el-pagination
						v-if="total"
						@current-change="handleCurrentChange" 
						:page-size="pagesize" 
						layout="prev, pager, next, jumper"
						:total="total">
					</el-pagination>
				</div> -->
			</div>
		</div>
	</div>
	
</template>

<script>
	import {  mapGetters } from "vuex"
	import Qs from 'qs'
	export default {
		name: 'tray_out',
		data() {
			return {
				btn: false,
				Outcode_val: '',
				pagesize: 15,
				currpage: 1,
				total: 0,
				tableDatas: [],
				ifBtn: false,
			}
		},
		computed: {
			...mapGetters({
				url: "geturl",
				token: "getToken"
			})
		},
		created() {
			
		},
		methods: {
			Outcode_Data() {
				let that = this;
				// let postData = Qs.stringify({
				//   parts_number: that.barcode_val
				// });
				if (that.Outcode_val.length == 8) {
					that.axios.get(that.url + '/api/v1/out/obtain', {
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							"token": that.token
						},
						params: {
							category: that.Outcode_val
						},
					}).then(function(res) {
						if (res && res.data && res.data.code == 200) {
							var data = res.data.data;
							var type = data.type;
							data.count = 1;
							that.tableDatas.push(data);
							that.Outcode_val = "";
							that.btn = true;
							for (var i = 0; i < that.tableDatas.length; i++) {
								for (var j = i + 1; j < that.tableDatas.length; j++) {
									if (that.tableDatas[i].type == 1 && that.tableDatas[i].product_type == 1) {
										if (that.tableDatas[i].product_id == that.tableDatas[j].product_id && that.tableDatas[i].parts_number == that.tableDatas[j].parts_number) {
											that.tableDatas[i].count += 1;
											that.tableDatas.splice(j, 1);
											j--;
										}
									}
									if (that.tableDatas[i].type == 2 || that.tableDatas[i].type == 1 && that.tableDatas[i].product_type == 2) {
										if (that.tableDatas[i].product_id == that.tableDatas[j].product_id && that.tableDatas[i].parts_number == that.tableDatas[j].parts_number) {
											that.tableDatas.splice(j, 1);
											that.$message.error( data.product_name +"条码"+ data.parts_number +"重复使用");
											j--;
										}
									}
									
								}
							}
						}
					}).catch(function(error) {
						that.$message({
							message: that.errmessage(error.response.data),
							type: 'warning'
						});
					});
				}
				
			},
			
			onOut() {
				let that = this;
				that.ifBtn = true;
				var parts_arr = [];
				for (var i = 0; i < that.tableDatas.length; i++) {

					var parts_arr_ = [];
					parts_arr_.product_id = that.tableDatas[i].product_id;
					parts_arr_.category = that.tableDatas[i].category;
					parts_arr_.product_name = that.tableDatas[i].product_name;
					parts_arr_.number = that.tableDatas[i].count;
					parts_arr_.parts_number = that.tableDatas[i].parts_number;
					parts_arr_.parts_id = that.tableDatas[i].parts_id;
					parts_arr_.type = that.tableDatas[i].type;

					parts_arr.push(parts_arr_);
				}
				let postData = Qs.stringify({
					parts: parts_arr
				});
				that.axios.post(that.url + '/api/v1/out/manual', postData, {
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						"token": that.token
					}
				}).then(function(res) {
					
					that.openFullScreen2();
				}).catch(function(error) {
					that.ifBtn = false;
					console.log(error);
				});
			},
			
			changeDetale(index) {
				this.tableDatas.splice(index, 1);
				if (this.tableDatas.length == 0) this.btn = false;
			},
			
			
			// handleCurrentChange(cpage) {
			// 	this.currpage = cpage;
			// 	this.Outcode();
			// },
			clear() {
				this.Outcode_val = "";
				this.tableDatas = [];
			},
			openFullScreen2() {
				const loading = this.$loading({
					lock: true,
					text: '出库中',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				setTimeout(() => {
					loading.close();
					this.tableDatas = [];
					this.ifBtn = false;
				}, 2000);
			}
		}
	}
</script>

<style scoped="">
	.new_out {
		width: 100%;
		border: 1px dashed #ddd;
		margin: 10px auto 0;
		min-height: calc(100vh - 75px);
		background: #FFFFFF;
		text-align: center;
		text-align: -moz-center;
		text-align: -webkit-center;
	}

	.main_del {
		width: 95%;
		margin-top: 20px;
		padding: 5px 30px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}

	.el-table td,
	.el-table th.is-leaf {
		border-bottom: none !important;
	}

	.main_title {
		font-size: 16px;
		font-weight: bold;
		letter-spacing: 4px;
		padding: 5px;
	}

	.el-table__body-wrapper {
		/* margin-bottom: 0.625rem; */
	}

	.el-table::before {
		width: 0;
		height: 0;
	}
</style>
