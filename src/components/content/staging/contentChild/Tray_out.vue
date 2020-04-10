<template>
	<el-container>
		<Left/>
		<el-container>
			<el-main style="padding: 10px;">
				<Head/>
				<div class="tray_out">
					<div style="min-height: 720px;margin-bottom: 1.25rem;">
						<div style="margin-top:3rem">
							<el-input suffix-icon="el-icon-full-screen" placeholder="" style="width: auto" v-model.trim="Outcode_val" @input="Outcode_Data" />
							</el-input>
				
							<el-button type="primary" @click="clear">清除</el-button>
						</div>
				
						<div class="main_del">
							<div class="main_title">配件列表</div>
				
							<el-table :data="tableDatas.slice((currpage - 1) * pagesize, currpage * pagesize)" style="width: 100%">
								<!-- :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)" -->
								<el-table-column prop="name" label="图样名称" width="180">
								</el-table-column>
								<el-table-column prop="items" label="图样代号" width="180">
								</el-table-column>
								<el-table-column prop="specs_" label="规格" width="180">
								</el-table-column>
								<el-table-column prop="material" label="材料" width="180">
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
								<el-button type="primary" v-if="tableDatas.length" @click="onEnter">出库</el-button>
							</div>
							<div class="block">
								<el-pagination v-if="tableDatas.length" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pagesize" layout="prev, pager, next, jumper"
								 :total="tableDatas.length">
								</el-pagination>
							</div>
				
							<!--       <div class="block">
				        <el-pagination
				          @size-change="handleSizeChange"
				          @current-change="handleCurrentChange"
				          :page-size="pagesize"
				          layout="prev, pager, next, jumper"
				          :total="total">
				        </el-pagination>
				      </div> -->
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
			this.currpage = 1;
			if (localStorage.getItem('Outcode_val') != undefined) {
				this.Outcode_val = JSON.parse(localStorage.getItem('Outcode_val'));
			}
			if (localStorage.getItem('tableDatas') != undefined) {
				this.tableDatas = JSON.parse(localStorage.getItem('tableDatas'));
			}
		},
		beforeDestroy() {
			var that = this;
			that.Outcode_val = "";
			localStorage.removeItem("Outcode_val");
			localStorage.removeItem("tableDatas");
		},
		methods: {
			//  barcode_Data() {
			//    let that = this;
			//    var ruleform = JSON.parse(localStorage.getItem("ruleForm"))
			//    var token = that.$store.state.token == "" ? ruleform.token : that.$store.state.token;
			//    var url = that.$store.state.url;
			//    console.log(token);
			//      // let postData = Qs.stringify({
			//      //   parts_number: that.barcode_val
			//      // });
			//      that.axios.get(url + '/api/v1/tray/out', {
			//          headers: {
			//            'content-type': 'application/x-www-form-urlencoded',
			//            "token": token
			//          },
			//          params: {
			//            parts_number: that.barcode_val
			//          },
			//        })
			//        .then(function(res) {
			//          console.log(res);

			//        })
			//        .catch(function(error) {
			//          console.log(error);
			//        });


			//  },
			Outcode_Data() {
				let that = this;
				that.Outcode_val = this.Outcode_val.replace(/[^\a-\z\A-\Z0-9]/g, '');
				// let postData = Qs.stringify({
				//   parts_number: that.barcode_val
				// });
				that.axios.get(that.url + '/api/v1/tray/out-list', {
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							"token": that.token
						},
						params: {
							parts_number: that.Outcode_val
						},
					})
					.then(function(res) {
						var list = res.data.data;
						for (var i = 0; i < list.length; i++) {

							var item_ = list[i].item;
							if (item_ == null || item_ == undefined || item_ == "") {
								list[i].items = "-- --";
							} else {
								list[i].items = list[i].item;
							}

							var specs_s = list[i].specs;
							if (specs_s == null || specs_s == undefined || specs_s == "") {
								list[i].specs_ = "-- --";
							} else {
								list[i].specs_ = list[i].specs;
							}
						}
						that.tableDatas = res.data.data;
						localStorage.setItem('tableDatas', JSON.stringify(that.tableDatas));
						localStorage.setItem('Outcode_val', JSON.stringify(that.Outcode_val));

					})
					.catch(function(error) {
						console.log(error);
						// that.Outcode_val="";
					});
			},
			clear() {
				var that = this;
				that.Outcode_val = "";
				that.tableDatas = "";
				localStorage.removeItem('tableDatas');
			},
			onEnter() {
				let that = this;
				that.axios.get(that.url + '/api/v1/tray/out', {
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							"token": that.token
						},
						params: {
							parts_number: that.Outcode_val
						},
					})
					.then(function(res) {
						that.Outcode_val = "";
						that.openFullScreen2();

						localStorage.removeItem('tableDatas');
						localStorage.removeItem('Outcode_val');
					})
					.catch(function(error) {
						console.log(error);
						// that.Outcode_val="";
					});
			},
			handleSizeChange(psize) {
				this.pagesize = psize;
			},
			handleCurrentChange(cpage) {
				this.currpage = cpage;
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
	.tray_out {
		width: 80%;
		border: 1px dashed #ddd;
		margin: 1.875rem auto;
		height: auto;
		background: #FFFFFF;
		text-align: center;
		text-align: -moz-center;
		text-align: -webkit-center;
	}

	.main_del {
		width: 80%;
		/* height: 60%; */
		margin-top: 1.8rem;
		padding: 7px 30px;
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
