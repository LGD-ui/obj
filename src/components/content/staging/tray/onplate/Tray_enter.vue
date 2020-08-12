<template>
	<!-- 托盘装盘 -->
	<div class="tray_enter">
		<div style="min-height: 45rem;margin-bottom: 20px;">
			<div class="enter_wrap" style="">
				<el-button class="preBtn" type="text" icon="el-icon-d-arrow-left" v-if="tableData.length" @click="clear1" >返回</el-button>
				<!-- <Input suffix="md-barcode" placeholder="" style="width: auto" v-model.trim="barcode_val" @on-change="barcode_Data" /> -->
				<el-input suffix-icon="el-icon-full-screen" placeholder="请扫描托盘码" style="width: auto" v-model.trim="barcode_val"
				 @input="barcode_Data" v-if="!tableData.length">
					<el-button slot="append" type="primary" @click="clear1">清除托盘码</el-button>
				</el-input>
				<el-input suffix-icon="el-icon-full-screen" v-model.trim="barcode_vals_" autofocus style="width: auto"
				 placeholder="请扫描零件码" @input="tray_generate()" v-if="tableData.length">
					<el-button slot="append" type="primary" @click="clear2">清除零件码</el-button>
				</el-input>
			</div>
	
			<div class="main_del" v-if="tableData.length">
				<!--  托盘配件 -->
				<div class="main_title">
					<div class="title_left">托盘名称：{{tray_name}}</div>
					<div class="title_right">托盘条码：{{barcode_val__}}</div>
				</div>
				<!-- .slice((currpage - 1) * pagesize, currpage * pagesize) -->
				<el-table :data="tableData" style="width: 100%" height="70vh">
	
					<el-table-column prop="product_name" label="零件名称"></el-table-column>
					<el-table-column prop="category" label="编码"></el-table-column>
					<el-table-column label="图样名称" prop="items">
						<template slot-scope="scope">
							<span style="">{{ scope.row.items }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="specs_" label="规格"></el-table-column>
					<el-table-column prop="material" label="材料"></el-table-column>
					<el-table-column prop="img" label="图片" width="100" align="center">
						<template slot-scope="scope">
							<el-popover placement="right" title="" trigger="click">
								<img :src="scope.row.img" style="height: 500px;">
								<img slot="reference" :src="scope.row.img" alt="" style="height: 50px;width: 50px;min-height: 50px;min-width: 50px">
							</el-popover>
						</template>
					</el-table-column>
	
					<el-table-column prop="number" label="数量" width="80" align="center">
						<template slot-scope="scope">
							<span style="">{{ scope.row.number }}</span>
						</template>
					</el-table-column>
	
					<el-table-column prop="use_number" label="已装数量" width="80" align="center">
						<template slot-scope="scope">
							<span style="">{{ scope.row.use_number }}</span>
						</template>
					</el-table-column>
	
					<el-table-column prop="is_use" label="完成状态" width="80" align="center">
						<template slot-scope="scope">
							<i class="el-icon-success" style="color:#00A000;font-size:1.5rem;" v-if="scope.row.active_img"></i>
						</template>
					</el-table-column>
	
				</el-table>
	
	
				<!-- <div class="block" style="margin-top: 10px;">
					<el-pagination v-if="tableData.length" @size-change="handleSizeChange" @current-change="handleCurrentChange"
					 :page-size="pagesize" layout="prev, pager, next, jumper" :total="tableData.length">
					</el-pagination>
				</div> -->
			</div>
		</div>
	
		<!-- Picture editing popover -->
		<cropperPhoto ref="openCamera" v-bind:centerDialogVisible="cropperPhoto" @change="changeClose"></cropperPhoto>
	
	</div>

</template>

<script>
	import { mapGetters } from "vuex"
	import Qs from 'qs'
	import cropperPhoto from './dialog/CropperPhoto.vue'
	export default {
		name: 'tray_enter',
		components: {
			cropperPhoto
		},
		data() {
			return {
				barcode_val: '',
				tray_name: '',
				barcode_val__: '',
				barcode_vals_: '',
				pagesize: 15,
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
					record_id: '',
					id: '',
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
			/* if (localStorage.getItem('tableData') != undefined) {
				this.tableData = JSON.parse(localStorage.getItem('tableData'));
			} */
			if (this.barcode_val__ && this.tray_name && this.id_) {
				console.log(this.barcode_val__, this.id_)
			} else {
				this.tableData = [];
			}
		},
		/* beforeDestroy() {
			localStorage.removeItem('tableData');
			localStorage.removeItem('datas_');
		}, */
		watch: {
			true_Arr() {
				console.log(this.true_Arr.length,this.tableData.length)
				if(this.true_Arr.length==this.tableData.length){
					this.cropperPhone()
				}
				
			}
		},
		methods: {
			// 拍照
			changeClose(param) {
				this.cropperPhoto.dialog = param;
				this.tableData = [];
			},
			// 获取托盘零件列表
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
							if (res && res.data && res.data.code == 200) {
								var datas_ = res.data.data;
								that.tray_name = datas_.name;
								that.barcode_val__ = datas_.parts_number;
								that.barcode_val = '';
								
								that.id_ = datas_.id;
								that.cropperPhoto.id = datas_.id;
								that.cropperPhoto.record_id = datas_.record_id;
								var list = datas_.detail;
								that.true_Arr = [];
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
								that.tableData = list;
								
								
								
								// that.modificationStatus();
								/* localStorage.setItem('tableData', JSON.stringify(list));
								localStorage.setItem('datas_', JSON.stringify(datas_)); */
							}
							


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
			// 零件详情
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
							if (that.tableData[i].product_id == generate.product_id) {
								if (that.tableData[i].use_number != that.tableData[i].number) {
									// that.tableData[i].use_number += 1;
									
									if (generate.product_type == 1) {
										that.tableData[i].use_number = that.tableData[i].number;
									} else {
										that.tableData[i].use_number += 1;
									}
									
									that.thisObject = i;
									if (that.tableData[i].use_number == that.tableData[i].number) {
										that.tableData[i].active_img = true;
										that.true_Arr.push(that.tableData[i].active_img);
									}
									that.onEnter(that.tableData[i].index_, generate, i);
									return false;
								} 
								if (that.tableData[i].use_number == that.tableData[i].number) {
									that.$message({
										message: "配件"+ that.tableData[i].product_name +"已经装满",
										offset: 200
									})
									return false;
								}
							}
						}
						// localStorage.setItem('tableData', JSON.stringify(that.tableData));
					})
					.catch(function(error) {
						that.$message({
							message: that.errmessage(error.response.data),
							type: 'warning'
						});
						
					});
				}

			},
			
			onEnter(index_, generate, i) {
				let that = this;
				var parts_arr = [];
				var parts__arr = [];
				var index__data = that.tableData[index_];
				var product_id = generate.id;
				var product_name = generate.product_name;
				var type = generate.product_type;
				var parts_id;
				if (type == 1) {
					parts_id = 0;
					parts__arr.number = index__data.number;
				} else {
					parts_id = product_id;
					parts__arr.number = 1;
				}
				parts__arr.product_id = generate.product_id;
				parts__arr.product_name = product_name;
				
				parts__arr.category = generate.category;
				parts__arr.parts_id = parts_id;
				parts__arr.type = type;
				parts_arr.push(parts__arr);

				var ids_ = that.id_;
				let postData = Qs.stringify({
					tray_id: ids_,
					parts: parts_arr
				});
				console.log(postData)
				that.axios.post(that.url + '/api/v1/tray/save', postData, {
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						"token": that.token
					}
				})
				.then(function(res) {
					that.barcode_vals_ = '';
					/* localStorage.removeItem('tableData');
					localStorage.removeItem('datas_'); */
				})
				.catch(function(error) {
					that.$message({
						message: that.errmessage(error.response.data),
						type: 'warning'
					});
					that.tableData[that.thisObject].use_number -= 1;
					that.true_Arr = that.true_Arr.slice(0, -1);
					that.tableData[that.thisObject].active_img = false;
					// localStorage.setItem('tableData', JSON.stringify(that.tableData));

				});

			},
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
					}
				}
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
			clear1() {
				this.barcode_val = '';
				this.tableData = [];
				this.barcode_vals_ = '';
				// localStorage.removeItem('tableData');
			},
			clear2() {
				this.barcode_vals_ = '';
			},
		}
	}
</script>

<style scoped="">
	.tray_enter {
		width: 100%;
		border: 1px dashed #ddd;
		margin: 10px auto 0;
		min-height: calc(100vh - 75px);
		background: #FFFFFF;
		text-align: center;
		text-align: -moz-center;
		text-align: -webkit-center;
	}
	.tray_enter .enter_wrap {
		margin-top: 20px;
		display: flex;
		justify-content: space-around;
		position: relative;
	}
	.tray_enter .enter_wrap .preBtn {
		position: absolute;
		left: 30px;
	}

	.main_del {
		width: 95%;
		/* height: 60%; */
		margin-top: 1.8rem;
		padding: 10px 30px 30px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}

	.el-table td,
	.el-table th.is-leaf {
		border-bottom: none !important;
	}

	.main_title {
		font-size: 16px;
		font-weight: bold;
		/* letter-spacing: 4px; */ /* 文字分散 */
		padding: 5px;
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
	}
	.main_title .title_left, .main_title .title_right {
		margin: 0 30px;
	}

	/* .el-table__body-wrapper {
    margin-bottom: 0.625rem;
  } */

	.el-table::before {
		width: 0;
		height: 0;
	}
	/deep/.el-table .el-table__row td {
		padding: 5px 0 0;
	}

	/deep/ .el-input-group__append,
	.el-input-group__prepend {
		background-color: #66b1ff !important;
		color: #FFFFFF;
	}
</style>
