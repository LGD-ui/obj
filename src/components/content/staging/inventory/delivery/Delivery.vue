<template>
	<!-- 库存发货 -->
	<div class="Delivery">
		<div style="min-height: 720px;">
			<div class="out_wrap" style="margin-top:20px">
				<el-input suffix-icon="el-icon-full-screen" style="width: auto;" v-model.trim="delivecode_val"
					autofocus  placeholder="" @input="delivecode_Data" @keyup.enter.native="delivecode_Data">
					<el-button slot="append" type="success" @click="clear">清除</el-button>
				</el-input>
			</div>
	
			<div class="main_del">
				<div class="main_title">零件信息</div>
	
				<el-table :data="tableDatas" style="width: 100%" height="65vh">
					<el-table-column prop="product_name" label="图样名称"></el-table-column>
					<el-table-column prop="item" label="图样代号"></el-table-column>
					<el-table-column prop="specs" label="规格"></el-table-column>
					<el-table-column prop="material" label="材料"></el-table-column>
					<el-table-column prop="parts_number" label="条码" width="90"></el-table-column>
					<el-table-column prop="category" label="零件编码" width="90"></el-table-column>
					<el-table-column label="批次" property="batch"></el-table-column>
					<el-table-column prop="number" label="库存数量"></el-table-column>
					<el-table-column label="数量" width="160" >
						<template slot-scope="scope">
							<el-input-number
								v-if="scope.row.type == 1 && scope.row.product_type == 1"
								v-model.trim="scope.row.count" 
								controls-position="right"
								size="small"
								:min="0"
								:max="scope.row.number" 
								:disabled="false"
								>
							</el-input-number>
							<span v-else>{{ scope.row.count }}</span>
						</template>
					</el-table-column>
					<el-table-column label="" width="80">
						<template slot-scope="scope">
							<el-link :underline="false" type="warning" @click="changeDetale(scope.$index)">删除</el-link>
						</template>
					</el-table-column>
				</el-table>
				<div style="text-align: right;padding: 15px 0;height: 70px;">
					<el-button v-if="btn" type="primary" :disabled="ifBtn" @click="ondelive">发 货</el-button>
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
		
		<!-- fahuo -->
		<Enddev ref="child" v-bind:EnddelivedialogVisible="Enddelivedialog" @change="enddevClose" />
		
	</div>
	
</template>

<script>
	import { mapGetters } from "vuex"
	import Enddev from "./dialog/Enddelive.vue"
	export default {
		name: 'Delivery',
		components: {Enddev},
		data() {
			return {
				btn: false,
				delivecode_val: '',
				pagesize: 15,
				currpage: 1,
				total: 0,
				tableDatas: [],
				ifBtn: false,
				Enddelivedialog: {
					dialog: false,
					arr: []
				},
			}
		},
		computed: {
			...mapGetters({
				url: "geturl",
				token: "getToken"
			})
		},
		methods: {
			delivecode_Data() {
				let that = this;
				if (that.delivecode_val.length == 8) {
					that.axios.get(that.url + '/api/v1/assemble-send/obtain', {
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							"token": that.token
						},
						params: {
							parts_number: that.delivecode_val
						},
					}).then(function(res) {
						if (res && res.data && res.data.code == 200) {
							var data = res.data.data;
							var type = data.type;
							data.count = 1;
							that.tableDatas.push(data);
							that.delivecode_val = "";
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
			
			changeDetale(index) {
				this.tableDatas.splice(index, 1);
				if (this.tableDatas.length == 0) this.btn = false;
			},
			
			
			ondelive() {
				
				if (this.tableDatas.length) {
					this.Enddelivedialog.arr = this.tableDatas;
					this.$refs.child.getexpress_type();
					this.$refs.child.getworklist();
					this.Enddelivedialog.dialog = true;
					this.btn = false;
				}
				
			},
			
			
			/* 关闭弹窗 */
			enddevClose(param) {
			    this.Enddelivedialog.dialog = param;
				this.clear();
			},
			
			clear() {
				this.delivecode_val = "";
				this.tableDatas = [];
				this.btn = false;
			},
			
			
			
		}
	}
</script>

<style scoped="">
	.Delivery {
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
