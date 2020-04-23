<template>
	<el-container>
		<Left />
		<el-container>
			<el-main style="padding: 10px;">
				<Head />
				<div class="tray_enter">
					<div style="min-height: 45rem;margin-bottom: 20px;">
						<div style="margin-top:3rem;width: 65%;display: flex;justify-content: space-around;">
							<!-- <Input suffix="md-barcode" placeholder="" style="width: auto" v-model.trim="barcode_val" @on-change="barcode_Data" /> -->
							<el-input suffix-icon="el-icon-full-screen" placeholder="请扫描托盘码" style="width: auto" v-model.trim="barcode_val"
							 @input="barcode_Data">
								<el-button slot="append" type="primary" @click="clear">清除</el-button>
							</el-input>
							<el-input suffix-icon="el-icon-full-screen" v-model.trim="barcode_vals_" autofocus style="width: auto"
							 placeholder="请扫描零件码" @input="tray_generate()" v-if="tableData.length !=0">
								<el-button slot="append" type="primary" @click="clear">清除</el-button>
							</el-input>
						</div>

						<div class="main_del">
							<div class="main_title">{{barcode_val__}} 托盘配件</div>

							<el-table :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)" style="width: 100%">

								<el-table-column prop="product_name" label="图样名称">
								</el-table-column>
								<!-- <el-table-column prop="items" label="图样代号">
				      </el-table-column> -->
								<el-table-column label="图样名称" prop="items">
									<template slot-scope="scope">
										<span style="">{{ scope.row.items }}</span>
									</template>
								</el-table-column>
								<el-table-column prop="specs_" label="规格">
								</el-table-column>
								<el-table-column prop="material" label="材料">
								</el-table-column>
								<el-table-column prop="img" label="图片" width="100" align="center">
									<template slot-scope="scope">
										<!--    <div class="img_div">
				            <img class="lab_img" :src="scope.row.image" v-if="scope.row.image!=''" alt="">
				            <img class="lab_img" src="http://zrui.e7vr.com/image/arm/default.gif" v-else alt="">
				          </div> -->
										<el-popover placement="right" title="" trigger="click">
											<img :src="scope.row.img" style="height: 500px;width: 500px">
											<img slot="reference" :src="scope.row.img" alt="" style="height: 50px;width: 50px">
										</el-popover>
									</template>
								</el-table-column>

								<el-table-column prop="number" label="数量" width="80" align="center">
									<template slot-scope="scope">
										<!-- <span style="">{{scope.row.count}}/{{ scope.row.number }}</span> -->
										<span style="">{{ scope.row.number }}</span>
									</template>
								</el-table-column>

								<el-table-column prop="use_number" label="已装数量" width="80" align="center">
									<template slot-scope="scope">
										<!-- <span style="">{{scope.row.count}}/{{ scope.row.number }}</span> -->
										<span style="">{{ scope.row.use_number }}</span>
									</template>
								</el-table-column>

								<!--         <el-table-column prop="count" label="已装数量">
				        <template slot-scope="scope">
				
				          <span style="">{{ scope.row.count }}</span>
				        </template>
				      </el-table-column> -->


								<!--          <el-table-column prop="type" label="配件类型" width="180">
				        <template slot-scope="scope">
				          <span style="">{{scope.row.type==1?'标准件':'非标准件'}}</span>
				        </template>
				      </el-table-column> -->

								<el-table-column prop="is_use" label="完成状态" width="80" align="center">
									<template slot-scope="scope">
										<!-- <span style="margin-left: 17px;" v-if="scope.row.ifblock">{{scope.row.count}}</span> -->
										<!-- <i class="el-icon-success" style="color:#00A000;font-size:1.5rem;margin-left: 17px;"></i> -->
										<i class="el-icon-success" style="color:#00A000;font-size:1.5rem;" v-if="scope.row.active_img"></i>
									</template>
								</el-table-column>



							</el-table>


							<!--       <div style="text-align: right;">
				      <el-button type="primary" @click="enter">入库</el-button>
				    </div> -->


							<div class="block" style="margin-top: 10px;">
								<el-pagination v-if="tableData.length" @size-change="handleSizeChange" @current-change="handleCurrentChange"
								 :page-size="pagesize" layout="prev, pager, next, jumper" :total="tableData.length">
								</el-pagination>
							</div>
						</div>
					</div>

					<!-- Picture editing popover -->
					<cropperPhoto ref="openCamera" v-bind:centerDialogVisible="cropperPhoto" @change="changeClose"></cropperPhoto>

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
	import cropperPhoto from './cropperPhoto/CropperPhoto.vue'
	export default {
		name: 'tray_enter',
		components: {
			Left,
			Head,
			cropperPhoto
		},
		data() {
			return {
				barcode_val: '',
				barcode_val__: '',
				barcode_vals_: '',
				pagesize: 10,
				currpage: 1,
				tableData: [],
				generate_: "",
				datas: '',
				true_Arr: [],
				id_: '',
				tray_status: false,
				is_block: false,
				thisObject: '',
				// ifblock:true,
				cropperPhoto: {
					dialog: false,
					record_id: ''
				},
			}
		},
		computed: {
			...mapGetters({
				url: "geturl",
				token: "getToken"
			})
		},
		created() {
			if (this.$route.query && this.$route.query.parts_number) {
				this.barcode_val = this.$route.query.parts_number;
				this.barcode_Data();
			}
			this.currpage = 1;
			if (localStorage.getItem('tableData') != undefined) {
				this.tableData = JSON.parse(localStorage.getItem('tableData'));
			}
		},
		beforeDestroy() {
			localStorage.removeItem('tableData');
			localStorage.removeItem('datas_');
		},
		watch: {
			true_Arr() {
				this.cropperPhone()
			}
		},
		methods: {
			changeClose(param) {
				this.cropperPhoto.dialog = param;
			},
			barcode_Data() {
				let that = this;
				if (that.barcode_val.length == 8) {
					let postData = Qs.stringify({
						parts_number: that.barcode_val
					});
					that.axios.post(that.url + '/api/v1/tray/detail', postData, {
							headers: {
								'content-type': 'application/x-www-form-urlencoded',
								"token": that.token
							},
						})
						.then(function(res) {
							that.barcode_val__ = that.barcode_val;
							that.barcode_val = '';
							var datas_ = res.data.data;
							that.id_ = datas_.id;
							that.cropperPhoto.record_id = datas_.record_id;
							var list = res.data.data.detail;

							for (var i = 0; i < list.length; i++) {
								list[i].index_ = i;
								if (list[i].use_number == list[i].number) {
									list[i].active_img = true;
									that.true_Arr.push(list[i].active_img);
								}
								var type = list[i].type;
								// if(type == 1){//判断标准件/非标准 数量
								//    list[i].count=list[i].number;
								//    list[i].ifblock=false;
								//    list[i].active_img=true;
								// }else{
								//    list[i].count=0;
								//    list[i].ifblock=true;
								// }

								var imgs = list[i].image;
								// console.log(imgs);
								if (imgs == null || imgs == undefined || imgs == "") {
									list[i].img = "http://zrui.e7vr.com/image/arm/default.gif";
								} else {
									list[i].img = list[i].image;
								}

								var item_ = list[i].item;
								// console.log(item_);
								if (item_ == null || item_ == undefined || item_ == "") {
									list[i].items = "-- --";
								} else {
									list[i].items = list[i].item;
								}

								var specs_s = list[i].specs;
								// console.log(specs_s);
								if (specs_s == null || specs_s == undefined || specs_s == "") {
									list[i].specs_ = "-- --";
								} else {
									list[i].specs_ = list[i].specs;
								}
							}
							if (that.tableData.length == 0) {
								that.tableData = list;
							} else {
								that.$confirm('上个托盘装盘未完成, 是否替换托盘?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
								}).then(() => {
									that.tableData = list;
								}).catch(() => {});
							}


							// that.modificationStatus();
							localStorage.setItem('tableData', JSON.stringify(list));
							localStorage.setItem('datas_', JSON.stringify(datas_));


						})
						.catch(function(error) {

							that.$message.error('该托盘已被使用或不存在');
							console.log(error);

						});
				}
				// else
				// if(that.barcode_val.length==8){
				//       let postData = Qs.stringify({
				//         category: that.barcode_vals_
				//       });
				//       that.tray_generate(postData);

				// }

			},
			tray_generate() {
				let that = this;
				if (that.tableData.length != 0 && that.barcode_vals_.length == 8) {
					let postData = Qs.stringify({
						category: that.barcode_vals_
					});
					that.axios.post(that.url + '/api/v1/tray/generate', postData, {
							headers: {
								'content-type': 'application/x-www-form-urlencoded',
								"token": that.token
							},
						})
						.then(function(res) {
							var generate = res.data.data;
							that.generate_ = res.data.data;
							for (var i = 0; i < that.tableData.length; i++) {
								if (that.tableData[i].product_name == generate.name && that.tableData[i].specs == generate.specs && that.tableData[
										i].active_img == undefined) {
									if (that.tableData[i].use_number != that.tableData[i].number) {

										that.tableData[i].use_number += 1;
										that.barcode_vals_ = '';
										that.thisObject = i;

										if (that.tableData[i].use_number == that.tableData[i].number) {
											that.tableData[i].use_number == that.tableData[i].number;
											that.tableData[i].active_img = true;
											that.true_Arr.push(that.tableData[i].active_img);
											// that.enter(that.tableData[i].index_);
											// if(that.true_Arr.length==that.tableData.length){
											that.onEnter(that.tableData[i].index_);
											// }
										}
										break;
									}
								}


							}
							localStorage.setItem('tableData', JSON.stringify(that.tableData));
						})
						.catch(function(error) {
							that.$message.error('该零件编码错误');
							// if(that.barcode_val__ != that.barcode_val){
							//   that.$confirm('上个托盘装盘未完成, 是否替换托盘?', '提示', {
							//     confirmButtonText: '确定',
							//     cancelButtonText: '取消',
							//     type: 'warning'
							//   }).then(() => {
							//     let postData = Qs.stringify({
							//       category: that.barcode_val
							//     });
							//     that.barcode_Data();
							//     that.$message({
							//       type: 'success',
							//       message: '删除成功!'
							//     });
							//   }).catch(() => {
							//     that.$message({
							//       type: 'info',
							//       message: '已取消删除'
							//     });
							//   });
							// }else{
							//   that.$message.error('该托盘已被使用或不存在');
							//   that.barcode_val="";
							//   console.log(error);
							// }


							console.log(error);
						});
				}

			},
			/* modificationStatus(){//修改状态
			  let that = this;
			  var ruleform=JSON.parse(localStorage.getItem("ruleForm"))
			  var token=that.$store.state.token==""?ruleform.token:that.$store.state.token;
			  var url=that.$store.state.url;
			  console.log(token);
			    that.axios.get(url+'/api/v1/tray/status',{
			      headers: {
			         'content-type': 'application/x-www-form-urlencoded',
			         "token":token
			        },
			      params:{
			       id : that.id_,
			       status: 2
			      }
			    })
			    .then(function (res) {
			      console.log(res);
			    })
			    .catch(function (error) {
			      console.log(error);
			    });
			}, */
			handleSizeChange(psize) {
				this.pagesize = psize;
			},
			handleCurrentChange(cpage) {
				var that = this;
				this.currpage = cpage;
				// that.barcode_Data();

			},
			enter(index_) {
				var that = this;
				var active_imgs = [];
				for (var i = 0; i < that.tableData.length; i++) {
					if (that.tableData[i].active_img == true && that.tableData[i].active_img != undefined) {
						active_imgs.push(that.tableData[i].active_img);
						// that.onEnter(that.tableData[i].index_);
					}
					// else if(that.tableData[i].active_img ==undefined){
					//   that.$message.error(that.tableData[i].product_name+"规格为"+that.tableData[i].item+"需要扫码"+that.tableData[i].number+"个零件");
					//   break;
					// }
				}
				// console.log(active_imgs);
				// if(active_imgs.length==that.tableData.length){

				// }
			},
			onEnter(index_) {
				let that = this;
				var parts_arr = [];
				var parts__arr = [];
				var index__data = that.tableData[index_];
				var product_id = index__data.product_id;
				var product_name = index__data.product_name;
				var number = index__data.use_number;
				var type = index__data.type;
				var parts_id;
				if (type == 1) {
					parts_id = 0;
				} else {
					parts_id = product_id;
				}
				parts__arr.product_id = product_id;
				parts__arr.product_name = product_name;
				parts__arr.number = number;
				parts__arr.parts_id = parts_id;
				parts__arr.type = type;
				parts_arr.push(parts__arr);
				/* for(var i=0;i<that.tableData.length;i++){
				 var product_id=that.tableData[i].product_id;
				 var product_name=that.tableData[i].product_name;
				 var number=that.tableData[i].use_number;
				 var type=that.tableData[i].type;
				 console.log(that.generate_);
				 var parts_id;
				 if(type==1){
				   parts_id=0;
				 }else{
				   parts_id=product_id;
				 }
				 console.log(type);
				 var parts_arr_=[];
				 parts_arr_.product_id=product_id;
				 parts_arr_.product_name=product_name;
				 parts_arr_.number=number;
				 parts_arr_.parts_id=parts_id;
				 parts_arr_.type=type;

				  console.log(parts_arr_);
				  parts_arr.push(parts_arr_);
				}
				console.log(parts_arr)
				console.log(parts_arr,parts_arr_); */

				var ids_ = that.id_;
				let postData = Qs.stringify({
					tray_id: ids_,
					parts: parts_arr

				});
				that.axios.post(that.url + '/api/v1/tray/save', postData, {
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							"token": that.token
						}
					})
					.then(function(res) {
						localStorage.removeItem('tableData');
						localStorage.removeItem('datas_');
					})
					.catch(function(error) {
						that.$message.error(that.tableData[that.thisObject].product_name + "零件数量不足或不存在");
						that.tableData[that.thisObject].use_number -= 1;
						that.tableData[that.thisObject].active_img = false;
						localStorage.setItem('tableData', JSON.stringify(that.tableData));
						// localStorage.removeItem('tableData');
						// localStorage.removeItem('datas_');
						// if(that.tableData[that.thisObject].active_img == undefined){

						// }

						console.log(error);
					});

			},
			cropperPhone() {
				var that = this;
				if (that.tableData.length == that.true_Arr.length) {
					console.log('tableData', that.tableData)
					console.log('true_Arr', that.true_Arr)
					that.$alert('*装盘完成需进行对托盘拍照', '提示', {
						confirmButtonText: '拍照',
						showClose: false,
						callback: action => {
							that.cropperPhoto.dialog = true;
							setTimeout(() => {
								that.$refs.openCamera.openCameraBtn();
							}, 100)

						}
					});
				}

			},

			openFullScreen2() {
				const loading = this.$loading({
					lock: true,
					text: '入库中',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				setTimeout(() => {
					loading.close();
				}, 2000);
			},
			clear() {
				var that = this;
				that.barcode_val = "";
				that.tableData = [];
				localStorage.removeItem('tableData');
			}
		}
	}
</script>

<style scoped="">
	.tray_enter {
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
		width: 88%;
		/* height: 60%; */
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

	/* .el-table__body-wrapper {
    margin-bottom: 0.625rem;
  } */

	.el-table::before {
		width: 0;
		height: 0;
	}

	/deep/ .el-input-group__append,
	.el-input-group__prepend {
		background-color: #66b1ff !important;
		color: #FFFFFF;
	}
</style>
