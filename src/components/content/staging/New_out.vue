<template>
	<el-container>
		<Left/>
		<el-container>
			<el-main style="padding: 10px;">
				<Head/>
				<div class="new_out">
					<div style="min-height: 720px;margin-bottom: 1.25rem;">
						<div style="margin-top:3rem">
							<el-input suffix-icon="el-icon-full-screen" placeholder="" style="width: auto" v-model.trim="Outcode_val" @input="Outcode_Data" />
							</el-input>
				
							<el-button type="primary" @click="clear">清除</el-button>
						</div>
				
						<div class="main_del">
							<div class="main_title">零件信息</div>
				
							<el-table :data="tableDatas" style="width: 100%">
								<!-- :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)" -->
								<el-table-column prop="name" label="图样名称" width="180">
								</el-table-column>
								<!--          <el-table-column label="图片" prop="image">
				        <template slot-scope="scope">
				          <el-popover placement="right" title="" trigger="click">
				             <img :src="scope.row.img" style="height: 500px;width: 500px">
				             <img slot="reference" :src="scope.row.img"  alt="" style="height: 50px;width: 50px">
				          </el-popover>
				        </template>
				      </el-table-column> -->
								<el-table-column prop="item" label="图样代号" width="180">
								</el-table-column>
								<el-table-column prop="specs" label="规格" width="180">
								</el-table-column>
								<el-table-column prop="material" label="材料" width="180">
								</el-table-column>
								<el-table-column prop="category" label="零件编码" width="180">
								</el-table-column>
								<el-table-column prop="count" label="数量" width="180">
								</el-table-column>
								<!--          <el-table-column prop="is_use" label="使用状态" width="180">
				        <template slot-scope="scope">
				          <span style="">{{ scope.row.is_use==1?'未使用':'已使用'}}</span>
				        </template>
				      </el-table-column>
				      <el-table-column prop="type" label="配件类型" width="180">
				        <template slot-scope="scope">
				          <span style="">{{scope.row.type==1?'标准件':'非标准件'}}</span>
				        </template>
				      </el-table-column> -->
				
							</el-table>
							<div style="text-align: right;">
								<el-button v-if="total" type="primary" @click="onOut">出库</el-button>
							</div>
							<div class="block">
								<el-pagination v-if="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pagesize" layout="prev, pager, next, jumper"
								 :total="total">
								</el-pagination>
							</div>
						</div>
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
	import Qs from 'qs'
	export default {
		name: 'tray_out',
		components: { Left, Head },
		data() {
			return {
				dd: '',
				barcode_val: '',
				Outcode_val: '',
				pagesize: 10,
				currpage: 1,
				total: 0,
				tableDatas: [],
				generate_: "",
				datas: '',
				val: ''
			}
		},
		computed: {
			...mapGetters({
				url: "geturl",
				token: "getToken"
			})
		},
		created() {
			var that = this;
			that.currpage = 1;
			// if(localStorage.getItem('Outcode_val') != undefined){
			//   that.Outcode_val=JSON.parse(localStorage.getItem('Outcode_val'));
			// }
			// if(localStorage.getItem('tableDatas') != undefined){
			//   that.tableDatas=JSON.parse(localStorage.getItem('tableDatas'));
			// }
			that.Outcode();
		},
		beforeDestroy() {

		},
		methods: {
			Outcode_Data() {
				let that = this;
				// let postData = Qs.stringify({
				//   parts_number: that.barcode_val
				// });
				that.axios.get(that.url + '/api/v1/out/obtain', {
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							"token": that.token
						},
						params: {
							category: that.Outcode_val
						},
					})
					.then(function(res) {
						var type = res.data.data.type;
						if (type == 2) {
							res.data.data.count = 1;
							that.tableDatas.push(res.data.data);
							for (var i = 0; i < that.tableDatas.length; i++) {
								for (var j = i + 1; j < that.tableDatas.length; j++) {
									if (that.tableDatas[i].parts_number == that.tableDatas[j].parts_number) {
										that.tableDatas.splice(j, 1);
										that.$message.error("条码重复使用");
										j--;
										break;
									}

								}
							}
						}
						if (type == 1) {
							res.data.data.count = 1;
							that.tableDatas.push(res.data.data);
							for (var i = 0; i < that.tableDatas.length; i++) {
								for (var j = i + 1; j < that.tableDatas.length; j++) {
									if (that.tableDatas[i].name == that.tableDatas[j].name) {
										that.tableDatas[i].count += 1;
										that.tableDatas.splice(j, 1);
										j--;
										break;
									}

								}
							}
						}


						that.Outcode_val = "";


					})
					.catch(function(error) {
						that.$message.error("该零件不存在");
						// that.Outcode_val="";
					});
			},
			Outcode(search) {
				// let that = this;
				// var ruleform = JSON.parse(localStorage.getItem("ruleForm"))
				// var token = that.$store.state.token == "" ? ruleform.token : that.$store.state.token;
				// var url = that.$store.state.url;
				// console.log(token);
				// // let postData = Qs.stringify({
				// //   parts_number: that.barcode_val
				// // });
				// that.axios.get(url + '/api/v1/out/list', {
				//     headers: {
				//       'content-type': 'application/x-www-form-urlencoded',
				//       "token": token
				//     },
				//     params: {
				//       page: search || that.currpage,
				//       size: that.pagesize,
				//       type: 2,
				//       name: ''
				//     },
				//   })
				//   .then(function(res) {
				//     console.log(res);
				//     that.tableDatas = res.data.data.list;
				//     that.total = res.data.data.count.total;
				//     console.log(that.total);

				//   })
				//   .catch(function(error) {
				//     console.log(error);
				//   });
			},
			onOut() {
				let that = this;
				var parts_arr = [];
				for (var i = 0; i < that.tableDatas.length; i++) {
					var product_id = that.tableDatas[i].product_id;
					var id = that.tableDatas[i].id;
					var product_name = that.tableDatas[i].name;
					var number = that.tableDatas[i].count;
					var type = that.tableDatas[i].type;
					var parts_id;
					if (type == 1) {
						parts_id = 0;
					} else {
						parts_id = id;
					}
					var product_ids;
					if (type == 1) {
						product_ids = id;
					} else {
						product_ids = product_id;
						// product_ids=id;
					}

					var parts_arr_ = [];
					parts_arr_.product_id = product_ids;
					parts_arr_.product_name = product_name;
					parts_arr_.number = number;
					parts_arr_.parts_id = parts_id;
					parts_arr_.type = type;

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
					})
					.then(function(res) {
						that.openFullScreen2();
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			handleSizeChange(psize) {
				this.pagesize = psize;
			},
			handleCurrentChange(cpage) {
				this.currpage = cpage;
				this.Outcode();
			},
			clear() {
				var that = this;
				that.Outcode_val = "";
				that.tableDatas = [];
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
				}, 2000);
			}
		}
	}
</script>

<style scoped="">
	.new_out {
		width: 88%;
		border: 1px dashed #ddd;
		margin: 1.875rem auto;
		height: auto;
		background: #FFFFFF;
		text-align: center;
		text-align: -moz-center;
		text-align: -webkit-center;
	}

	.main_del {
		width: 90%;
		margin-top: 1.8rem;
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
