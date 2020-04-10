<template>
	<div class="ListChild1">
		<div class="input_flex">
			<!-- <el-button type="primary" icon="el-icon-circle-plus">新增</el-button> -->
			<!-- <div class="fl"> -->
			<!-- <p style="width: 4.5625rem;height: 2rem;line-height: 2rem;margin-left: 0.625rem;">图样名称</p> -->
			<!-- <el-input v-model="search" placeholder="请输入关键字" prefix-icon="el-icon-search"></el-input> -->
			<!--  -->

			<div class="demo-input-suffix" style="width: 35rem;">

				<el-input placeholder="搜索" prefix-icon="el-icon-search" v-model.trim="search_name" style="width: 89%;">
				</el-input>
			</div>
			<!-- <div class="demo-input-suffix">
          图样代号：
          <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model.trim="search_item">
          </el-input>
        </div>
        <div class="demo-input-suffix">
          型号规格：
          <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model.trim="search_specs">
          </el-input>
        </div>
        <div class="demo-input-suffix">
          材料：
          <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model.trim="search_material">
          </el-input>
        </div> -->
			<div class="demo-input-suffix" style="">
				<el-button type="primary" @click="axiosData(1)">搜索</el-button>
			</div>
			<div class="demo-input-suffix" style="">
				<el-button type="primary" @click="all_out" style="margin-left:1rem">全部</el-button>
			</div>
			<!--  -->

			<!--        <router-link to="/log">
          <div class="demo-input-suffix" style="margin-left:24rem">
            <el-button type="text" @click="system_log">消息日志</el-button>
          </div>
        </router-link> -->


			<el-dialog title="零件信息" :visible.sync="dialogFormVisible" width="30%" style="border-radius: 0.625rem;">
				<el-form :model="form">
					<el-form-item label="">
						<Input suffix="md-barcode" placeholder="" style="width: auto" v-model.trim="barcode_val" @on-change="barcode_Data" />
					</el-form-item>
					<el-form-item label="图样名称">
						<div>{{form.name}}</div>
					</el-form-item>
					<el-form-item label="图样代号">
						<div>{{form.name}}</div>
					</el-form-item>
					<el-form-item label="型号规格">
						<div>{{form.name}}</div>
					</el-form-item>
					<el-form-item label="入库数量">
						<div>{{form.name}}</div>
					</el-form-item>
				</el-form>
				<!--          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div> -->
			</el-dialog>
			<!-- </div> -->
			<!--     <router-link to="/breakage">
         <el-button type="primary" v-model="breakage">报损</el-button>
      </router-link> -->

			<!-- <div class="fl">
        <p style="width: 4.5625rem;height: 2rem;line-height: 2rem;">图样名称:</p>
         <el-input v-model="inputb" placeholder="请输入内容" size="small"></el-input>
      </div>
      <div class="fl">
        <p style="width: 4.5625rem;height: 2rem;line-height: 2rem;">图样名称:</p>
         <el-input v-model="inputc" placeholder="请输入内容" size="small"></el-input>
      </div> -->
			<!-- <el-button type="primary" v-model="search">搜索</el-button>
        <el-button type="danger" @click="empty">清空</el-button> -->
		</div>
		<!--  <div class="demo-input-suffix" style="margin-left:20rem;float: right;margin-top: -2.5rem;">
      <el-button type="primary" @click="scan_enter" style="margin-left:-20rem">扫码入库</el-button>
    </div> -->
		<!--     <div class="demo-input-suffix" style="margin-left:20rem;float: right;margin-top: -2.5rem;">
          <el-button type="primary" @click="hrefbatch" style="margin-left:-12rem">批量入库</el-button>
       </div>
    <div class="demo-input-suffix" style="margin-left:10rem;float: right;margin-top: -2.5rem;">
      <el-button type="primary" @click="met_out">导出</el-button>
    </div> -->
		<!-- <el-table
      :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))" -->
		<el-table :data="tableData" style="width: 100%;margin-top:1rem;margin-bottom:1rem;" highlight-current-row :cell-click="tableClick"
		 :row-class-name="tableRowClassName" :header-cell-style="tableheader">
			<!-- <el-table-column type="selection">
      </el-table-column> -->
			<el-table-column label="序号" width="100">
				<!-- <template slot-scope="scope">
          <span style="">{{ scope.$index+1 }}</span>
        </template> -->
				<template slot-scope="scope">
					<span style="">{{ scope.row.id}}</span>
				</template>
			</el-table-column>
			<el-table-column label="图样名称" prop="name_">
				<template slot-scope="scope">
					<span style="">{{ scope.row.name_ }}</span>
				</template>
			</el-table-column>
			<el-table-column label="图片" prop="image">
				<template slot-scope="scope">
					<!-- <div class="img_div">
            <img class="lab_img" :src="scope.row.image" v-if="scope.row.image!=''" alt="">
            <img class="lab_img" src="http://zrui.e7vr.com/image/arm/default.gif" v-else alt="">
          </div> -->
					<el-popover placement="right" title="" trigger="click">
						<img :src="scope.row.img" style="height: 500px;width: 500px">
						<img slot="reference" :src="scope.row.img" alt="" style="height: 50px;width: 50px">
					</el-popover>
				</template>
			</el-table-column>

			<el-table-column label="图样代号" prop="items">
				<template slot-scope="scope">
					<span style="">{{ scope.row.items }}</span>
				</template>
			</el-table-column>
			<el-table-column label="材料" prop="material_">
				<template slot-scope="scope">
					<span style="">{{ scope.row.material_ }}</span>
				</template>
			</el-table-column>
			<el-table-column label="型号规格" prop="specs_">
				<template slot-scope="scope">
					<span style="">{{ scope.row.specs_ }}</span>
				</template>
			</el-table-column>
			<el-table-column label="类别码" prop="category_">
				<template slot-scope="scope">
					<span style="">{{ scope.row.category_ }}</span>
				</template>
			</el-table-column>
			<el-table-column label="备注" prop="note_">
				<template slot-scope="scope">
					<span style="">{{ scope.row.note_ }}</span>
				</template>
			</el-table-column>
			<el-table-column label="总数量" prop="count">
				<template slot-scope="scope">
					<span style="">{{ scope.row.stock }}</span>
				</template>
			</el-table-column>
			<el-table-column label="入库 / 报损数量" width="170">
				<template slot-scope="scope">
					<el-input-number v-model.trim="go_numArr[scope.$index].go_num" controls-position="right" @change="handleChange"
					 :min="0"></el-input-number>
				</template>
			</el-table-column>

			<!-- <el-table-column align="right">
        <template slot="header" slot-scope="scope">
        </template>
       <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
			<el-table-column label="操作" width="200">
				<template slot-scope="scope">
					<el-button @click="submit(scope.$index,scope.row)" type="primary" v-if="go_numArr[scope.$index].go_num >0">入库</el-button>
					<el-button  type="info" disabled v-else>入库</el-button>
					<el-button @click="batch(scope.$index,scope.row)" type="danger" v-if="go_numArr[scope.$index].go_num >0">报损</el-button>
					<el-button  type="info" disabled v-else>报损</el-button>
				</template>
			</el-table-column>
			<!--
      <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column> -->
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pagesize" layout="prev, pager, next, jumper"
			 :total="total">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import { mapActions, mapState, mapGetters } from "vuex"
	import Qs from 'qs'
	export default {
		name: 'List',
		components: {
			// Editor
		},
		data() {
			return {
				barcode_val: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				search_name: '',
				search_material: '',
				search_item: '',
				search_specs: '',
				inputb: '',
				inputc: '',
				breakage: '',
				pagesize: 10,
				currpage: 1,
				total: 0,
				go_numArr: [],
				tableData: [],
				fullscreenLoading: false,
				dialogFormVisible: false,
				img: ''
			}
		},
		computed: {
			...mapGetters({
				url: "geturl",
				token: "getToken"
			})
		},
		created() {
			let that = this;
			that.axiosData();

		},
		beforeDestroy() {
			localStorage.removeItem("search_name");
			localStorage.removeItem("search_item");
			localStorage.removeItem("search_material");
			localStorage.removeItem("search_specs");
		},
		methods: {
			axiosData(search) {
				let that = this;
				var name = that.search_name || localStorage.getItem('search_name');
				var item = that.search_item || localStorage.getItem('search_item');
				var specs = that.search_specs || localStorage.getItem('search_specs');
				var material = that.search_material || localStorage.getItem('search_name');
				that.axios.get(that.url + '/api/v1/pattern/list', {
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							"token": that.token
						},
						params: {
							page: search || that.currpage,
							size: that.pagesize,
							name: name,
							item: item,
							specs: specs,
							material: material
						}
					})
					.then(function(res) {
						var search_name = localStorage.getItem('search_name');
						if (search_name == "" || search_name == undefined) {
							if (that.search_name != "") {
								localStorage.setItem('search_name', that.search_name);
							}
						}
						// var search_item=localStorage.getItem('search_item');
						// if(search_item=="" || search_item==undefined){
						//  if(that.search_item!=""){
						//     localStorage.setItem('search_item',that.search_item);
						//  }
						// }
						// var search_specs=localStorage.getItem('search_specs');
						// if(search_specs=="" || search_specs==undefined){
						//  if(that.search_specs!=""){
						//     localStorage.setItem('search_specs',that.search_specs);
						//  }
						// }
						// var search_material=localStorage.getItem('search_material');
						// if(search_material=="" || search_material==undefined){
						//  if(that.search_material!=""){
						//     localStorage.setItem('search_material',that.search_material);
						//  }
						// }
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
			system_log() { //系统日志
				// console.log("system_log");
			},
			hrefbatch() { //跳转批量入库
				this.$router.push({
					path: '/batch'
				})
			},
			seacher_out() { //搜索
				let that = this;
				var name = that.search_name || localStorage.getItem('search_name');
				var item = that.search_item || localStorage.getItem('search_item');
				var specs = that.search_specs || localStorage.getItem('search_specs');
				var material = that.search_material || localStorage.getItem('search_name');
				that.axios.get(that.url + '/api/v1/pattern/list', {
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							"token": that.token
						},
						params: {
							page: that.currpage,
							size: that.pagesize,
							name: name,
							item: item,
							specs: specs,
							material: material,
						}
					})
					.then(function(res) {
						var search_name = localStorage.getItem('search_name');

						if (search_name == "" || search_name == undefined) {
							if (that.search_name != "") {
								localStorage.setItem('search_name', that.search_name);
							}
						}
						var search_item = localStorage.getItem('search_item');

						if (search_item == "" || search_item == undefined) {
							if (that.search_item != "") {
								localStorage.setItem('search_item', that.search_item);
							}
						}
						var search_specs = localStorage.getItem('search_specs');

						if (search_specs == "" || search_specs == undefined) {
							if (that.search_specs != "") {
								localStorage.setItem('search_specs', that.search_specs);
							}
						}
						var search_material = localStorage.getItem('search_material');
						if (search_material == "" || search_material == undefined) {
							if (that.search_material != "") {
								localStorage.setItem('search_material', that.search_material);
							}
						}
						that.total = res.data.data.count.total;
						that.tableData = res.data.data.list;

					})
					.catch(function(error) {
						console.log(error);
					});
			},
			all_out() {
				var that = this;
				that.search_name = "";
				that.search_item = "";
				that.search_material = "";
				that.search_specs = "";
				localStorage.removeItem("search_name");
				localStorage.removeItem("search_item");
				localStorage.removeItem("search_material");
				localStorage.removeItem("search_specs");



				if (that.search_name == "" || that.search_item == "" || that.search_material == "" || that.search_specs == "") {

					that.axiosData();
				}
			},
			met_out() { //导出
				let that = this;
				var name = that.search_name || localStorage.getItem('search_name');
				var item = that.search_item || localStorage.getItem('search_item');
				var specs = that.search_specs || localStorage.getItem('search_specs');
				var material = that.search_material || localStorage.getItem('search_material');
				name = name || "";
				item = item || "";
				specs = specs || "";
				material = material || "";
				location.href = that.url+"/api/v1/pattern/export-list?name=" + name + "&item=" + item + "&specs=" +
					specs + "&material=" + material;
				
			},
			empty() {
				this.inputa = '',
					this.inputb = '',
					this.inputc = ''
			},
			handleDelete(index, row) {
				// this.tableData.splice(index, 1)
			},
			handleEdit() {},
			handleChange(value) {},
			tableClick(row, column, event) {},
			submit(c, d) {
				let that = this;
				var count_ = that.go_numArr[c].go_num;
				var product_id = d.id;
				var product_name = d.name;
				var type = d.type;
				if (count_ != 0) {
					const h = this.$createElement;
					that.$msgbox({
						title: '提示',
						message: h('p', null, [
							h('span', null, '名称：'),
							h('span', { style: 'color: teal' }, product_name),
							h('span', null, '，入库数量：'),
							h('span', { style: 'color: teal' }, count_)
						]),
						showCancelButton: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						beforeClose: (action, instance, done) => {
							if (action === 'confirm') {
								instance.confirmButtonLoading = true;
								instance.confirmButtonText = '添加中...';
								setTimeout(() => {
									done();
									setTimeout(() => {
										instance.confirmButtonLoading = false;
									}, 300);
								}, 1000);
							} else {
								done();
							}
						}
					}).then(action => {
						that.axios.get(that.url + '/api/v1/pattern/manual', {
							headers: {
								'content-type': 'application/x-www-form-urlencoded',
								"token": that.token
							},
							params: {
								count: count_,
								product_id: product_id,
								product_name: product_name,
								type: type
							}
						}).then(function(res) {
							if (res && res.data && res.data.data && res.data.code == 200) {
								that.axiosData();
								that.go_numArr[c].go_num = 0;
							}
						}).catch(function(error) {
							that.$message({
								type: 'warning',
								message: '操作失败'
							})
						});
					});
					
					
					
				} else {
					this.$alert('请输入入库数量', '提示', {
						confirmButtonText: '确定'
					});
				}
			},
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
			handleSizeChange(psize) {
				this.pagesize = psize;
			},
			handleCurrentChange(cpage) {
				this.currpage = cpage;

				this.axiosData();
				// var search_name=localStorage.getItem('search_name');
				// var search_item=localStorage.getItem('search_item');
				// var search_specs=localStorage.getItem('search_specs');
				// var search_material=localStorage.getItem('search_material');
				//  if(search_name==""){
				//     this.axiosData();
				//  }else{
				//     this.seacher_out();
				//  }
				//  if(search_item==""){
				//     this.axiosData();
				//  }else{
				//     this.seacher_out();
				//  }
				//  if(search_specs==""){
				//     this.axiosData();
				//  }else{
				//     this.seacher_out();
				//  }
				//  if(search_material==""){
				//     this.axiosData();
				//  }else{
				//     this.seacher_out();
				//  }
			},
			tableheader({ row, column, rowIndex, columnIndex }) {
				if (rowIndex === 0) {
					return 'height:70px;background:#e5e5e5'
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

<style scoped="">
	.title {
		font-size: 0.9375rem;
	}

	.input_flex {
		display: flex;
		/* justify-content: space-between; */
		margin-top: 10px;

		/* max-width: 28rem; */
	}

	.input_flex .fl {
		/* display: flex; */

	}

	/* .el-input{
    width:54%;
  } */
	/* .input_flex .el-button {
    padding:8px 20px;
  } */
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
</style>
