<template>
	<!-- 库存 -->
	<div class="Submit" id="printTest">
		<div class="ListChild1">
			<div class="input_flex">
				<div class="search">
					<div class="demo-input-suffix">
						<el-button type="info" v-if="type == 2" plain @click="searchtype(1)" style="margin-left: 0;margin-right: 10px;">零件</el-button>
						<el-button type="info" v-if="type == 1" plain @click="searchtype(2)" style="margin-left: 0;margin-right: 10px;">成品</el-button>
						<el-input suffix-icon="el-icon-search" style="width: 30.625rem;" v-model.trim="search_name"
							autofocus  placeholder="搜索" @input="searchChange" @keyup.enter.native="searchChange">
							<el-button slot="append" type="success" @click="searchChange">搜索</el-button>
						</el-input>
						<el-button type="info" plain @click="all_out">全部</el-button>
						
					</div>
				</div>
				
			</div>
			<el-table :data="tableData" style="width: 100%;margin-top:1rem;margin-bottom:1rem;" highlight-current-row :cell-click="tableClick"
			 :row-class-name="tableRowClassName" :header-cell-style="tableheader">
				<el-table-column label="序号" width="70">
					<template slot-scope="scope">
						<span style="">{{ scope.row.id}}</span>
					</template>
				</el-table-column>
		        <el-table-column label="图片">
					<template slot-scope="scope">
						<el-popover placement="right" title="" trigger="click">
							<img :src="scope.row.img" style="height: 400px;">
							<img slot="reference" :src="scope.row.img" style="height: 50px;width: 50px;min-height: 50px;min-width: 50px;">
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column label="名称">
					<template slot-scope="scope">
						<span style="">{{ scope.row.name_ }}</span>
					</template>
				</el-table-column>
				<el-table-column label="代号">
					<template slot-scope="scope">
						<span style="">{{ scope.row.items }}</span>
					</template>
				</el-table-column>
		        <el-table-column label="型号规格">
					<template slot-scope="scope">
						<span style="">{{ scope.row.specs_ }}</span>
					</template>
				</el-table-column>
				<el-table-column label="材料">
					<template slot-scope="scope">
						<span style="">{{ scope.row.material_ }}</span>
					</template>
				</el-table-column>
				<el-table-column label="类别码">
					<template slot-scope="scope">
						<span style="">{{ scope.row.category_ }}</span>
					</template>
				</el-table-column>
				<el-table-column label="类型">
				    <template slot-scope="scope">
				        <el-link :underline="false" v-if="scope.row.type == 1">零件</el-link>
				        <el-link :underline="false" v-if="scope.row.type == 2">成品</el-link>
				    </template>
				</el-table-column>
				<el-table-column label="总数" >
					<template slot-scope="scope">
						<span style="">{{ scope.row.stock }}</span>
					</template>
				</el-table-column>
				<el-table-column label="装盘数量">
					<template slot-scope="scope">
						<span v-if="scope.row.type == 1">{{ scope.row.tray_number }}</span>
					</template>
				</el-table-column>
				<!-- <el-table-column label="已出库" >
					<template slot-scope="scope">
						<span style="">{{ scope.row.number - scope.row.stock }}</span>
					</template>
				</el-table-column>
				<el-table-column label="未出库" >
					<template slot-scope="scope">
						<span style="">{{ scope.row.stock }}</span>
					</template>
				</el-table-column> -->
				<el-table-column label="操作" width="100">
					<template slot-scope="scope">
						<el-button type="text" v-if="scope.row.product_type=='2'" @click="invendetail(scope.row)" >详情</el-button>
						<el-button type="text" v-if="scope.row.product_type=='2'" @click="exportcode(scope.row)" >导出</el-button>
						
						<!-- <el-button type="text" v-print="'#printTest'">打印</el-button> -->
					</template>
				</el-table-column>
				
				
			</el-table>
			<div class="block">
				<el-pagination 
					@current-change="handleCurrentChange" 
					:page-size="pagesize" 
					layout="prev, pager, next, jumper"
					:total="total">
				</el-pagination>
			</div>
			
			
			<!--  -->
			<Inven ref="child" v-bind:invendetailDV="invendetailDV" @change="invenClose" ></Inven>
		</div>
	</div>
	
</template>

<script>
	import { mapGetters } from "vuex"
	import Qs from 'qs'
	import Inven from './dialog/inventorydetail.vue'
	export default {
		name: 'Submit',
		components: {
			Inven
		},
		data() {
			return {
				barcode_val: '',
				search_name: '',
				type: 1,
				search_material: '',
				search_item: '',
				search_specs: '',
				inputb: '',
				inputc: '',
				breakage: '',
				pagesize: 15,
				currpage: 1,
				total: 0,
				go_numArr: [],
				tableData: [],
				img: '',
				invendetailDV: {
				    dialog: false,
				    obj: '',
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
			this.axiosData();
		},
		methods: {
			axiosData() {
				let that = this;
				that.axios.get(that.url + '/api/v1/pattern/list', {
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							"token": that.token
						},
						params: {
							page: that.currpage,
							size: that.pagesize,
							type: that.type,
							name: that.search_name
						}
					})
					.then(function(res) {
						that.total = res.data.data.count.total;
						that.tableData = res.data.data.list;
						for (var i = 0; i < that.tableData.length; i++) {
							that.go_numArr.push({
								go_num: 0
							})
							var img_ = that.tableData[i].image;
							if (img_ == "" || img_ == undefined) {
								that.tableData[i].img = "http://zrui.e7vr.com/image/arm/default.gif";
							} else {
								that.tableData[i].img = that.tableData[i].image;
							}

							var item_ = that.tableData[i].item;
							if (item_ == "" || item_ == undefined || item_ == null) {
								that.tableData[i].items = "-- --";
							} else {
								that.tableData[i].items = that.tableData[i].item;
							}

							var notes = that.tableData[i].note;
							if (notes == "" || notes == undefined || notes == null) {
								that.tableData[i].note_ = "-- --";
							} else {
								that.tableData[i].note_ = that.tableData[i].note;
							}

							var spec = that.tableData[i].specs;
							if (spec == null || spec == undefined || spec == "") {
								that.tableData[i].specs_ = "-- --";
							} else {
								that.tableData[i].specs_ = that.tableData[i].specs;
							}

							var materials = that.tableData[i].material;
							if (materials == null || materials == undefined || materials == "") {
								that.tableData[i].material_ = "-- --";
							} else {
								that.tableData[i].material_ = that.tableData[i].material;
							}

							var categorys = that.tableData[i].category;
							if (categorys == null || categorys == undefined || categorys == "") {
								that.tableData[i].category_ = "-- --";
							} else {
								that.tableData[i].category_ = that.tableData[i].category;
							}

							var names = that.tableData[i].name;
							if (names == null || names == undefined || names == "") {
								that.tableData[i].name_ = "-- --";
							} else {
								that.tableData[i].name_ = that.tableData[i].name;
							}

						}
						// that.export_out();
					})

					.catch(function(error) {
						console.log(error);
					});
			},
			
			searchtype(e) {
				this.type = e;
				this.axiosData();
			},
			
			/* 搜索 */
			searchChange() {
				this.currpage = 1;
				if (!this.search_name) this.search_name = '';
				this.axiosData();
			},
			
			// 打开零件详情
			invendetail(item) {
				this.invendetailDV.obj = item;
				this.invendetailDV.dialog = true;
				this.$refs.child.getSingle();
			},
			/* 关闭单个弹窗 */
			invenClose(param) {
			    this.invendetailDV.dialog = param;
			},
			// 导出条码
			exportcode(row) {
				location.href = this.url + "/api/v1/pattern/product-detail-export?product_id=" + row.product_id + '&type=' + row.type;
			},
			
			all_out() {
				this.search_name = "";
				this.currpage = 1;
				this.axiosData();
			},
			
			
			handleEdit() {},
			handleChange(value) {},
			tableClick(row, column, event) {},
			
			batch(c, d) {
				let that = this;
				var count_ = that.go_numArr[c].go_num;
				var product_id = d.id;
				var product_name = d.name;
				if (count_ != 0) {
					that.openFullScreen2();
					let postData = Qs.stringify({
						number: count_,
						product_id: product_id,
						product_name: product_name,
						type: 1,
						source: 1,
					});
					that.axios.post(that.url + '/api/v1/loss/save', postData, {
							headers: {
								'content-type': 'application/x-www-form-urlencoded',
								"token": that.token
							},
							// params:{
							//   number:count_,
							//   product_id:product_id,
							//   product_name:product_name,
							//   type:1,
							//   source:1,
							// }
						})
						.then(function(res) {
							that.axiosData();
							that.go_numArr[c].go_num = 0;
						})
						.catch(function(error) {
							console.log(error);
						});
				} else {
					this.$alert('请输入入库数量', '提示', {
						confirmButtonText: '确定'
					});
				}

			},
			scan_enter() { //扫码入库
				var that = this;
				that.dialogFormVisible = true;
			},
			handleCurrentChange(cpage) {
				this.currpage = cpage;
				this.axiosData();
			},
			tableheader({ row, column, rowIndex, columnIndex }) {
				if (rowIndex === 0) {
					return 'height:40px;background:#e5e5e5'
				}
			},
			tableRowClassName({ row, rowIndex }) {
				if (rowIndex === 1) {
					return 'warning-row';
				} else if (rowIndex === 3) {
					return 'success-row';
				}
				return '';
			},
			openFullScreen2() {
				const loading = this.$loading({
					lock: true,
					text: '加载中',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				setTimeout(() => {
					loading.close();
				}, 2000);
			},

			barcode_Data() { //扫码
				let that = this;
				that.axios.get(that.url + '/api/v1/assemble/obtain', { //零件信息
					params: {
						type: 2,
						parts_number: that.barcode_val
					},
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': that.token
					}
				}).then(function(res) {
					that.barcode_val = "";
				}).catch(function(error) {
					console.log(error);
				});
			}
		},

		//   computed:{
		//      tables(){
		//         if(this.search) {
		//           return this.tableData.filter(item =>{
		//             console.log(item);
		//             return Object.keys(item.name).some(key => {
		//             console.log(key);
		//               return String(item.name).toLowerCase().indexOf(this.search) > -1

		//             })
		//           })
		//         }
		//         if(this.search_id) {
		//           return this.tableData.filter(item =>{
		//             console.log(item);
		//             return Object.keys(item.material).some(key => {
		//             console.log(key);
		//               return String(item.material).toLowerCase().indexOf(this.search_id) > -1

		//             })
		//           })
		//         }
		//         if(this.search_id) {
		//           return this.tableData.filter(item =>{
		//             console.log(item);
		//             return Object.keys(item.material).some(key => {
		//             console.log(key);
		//               return String(item.material).toLowerCase().indexOf(this.search_id) > -1

		//             })
		//           })
		//         }
		//         if(this.search_item) {
		//           return this.tableData.filter(item =>{
		//             console.log(item);
		//             return Object.keys(item.item).some(key => {
		//             console.log(key);
		//               return String(item.item).toLowerCase().indexOf(this.search_item) > -1

		//             })
		//           })
		//         }
		//         if(this.search_specs){
		//           return this.tableData.filter(item =>{
		//             console.log(item);
		//             return Object.keys(item.specs).some(key => {
		//               console.log(key);
		//               return String(item.specs).toLowerCase().indexOf(this.search_specs) >-1
		//             })
		//           })
		//         }
		//         else return this.tableData
		//      },

		// },
	}
</script>

<style lang="less" scoped>
	.Submit {
		background: #FFFFFF;
		padding: 0.625rem;
		margin-top: 0.625rem;
		.search {
		    > div {
		        display: flex;
		        > .el-button {
		            width: 80px;
		            margin-left: 10px;
		        }
		    }
		}
		.title {
			font-size: 0.9375rem;
		}
		
		.input_flex {
			display: flex;
		}
		.el-input-number {
			width: 100%;
		}
		
		.el-pagination {
			padding: 2px 0px;
		}
		
		.el-table .warning-row {
			background: oldlace;
		}
		
		.el-table .success-row {
			background: #f0f9eb;
		}
		
		.lab_img {
			width: 70%;
			height: 70%;
		}
		
		.img_div {
			width: 50px;
			height: 50px;
		
		}
		
		.img_div .lab_img {
			width: 100%;
			height: 100%;
		}
		
		.el-button+.el-button {
			margin-right: 0rem;
		}
	}
	
</style>
