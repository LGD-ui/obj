<template>
	<el-container>
		<Left/>
		<el-container>
			<el-main style="padding: 10px;">
				<Head/>
				<div class="List">
						<!-- <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				 <el-tab-pane label="产品列表" name="first">
				    <ListChild1></ListChild1>
				  </el-tab-pane>
				  <el-tab-pane label="添加产品" name="second">
				    <ListChild2></ListChild2>
				  </el-tab-pane>
				</el-tabs> -->
						<div class="input_flex">
							<!-- <el-button type="primary" icon="el-icon-circle-plus">新增</el-button> -->
							<div class="fl">
								<!-- <el-input v-model="search" placeholder="请输入搜索内容" size="small" prefix-icon="el-icon-search"></el-input> -->
								<div class="demo-input-suffix" style="width: 35rem;">
									图样名称：
									<el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model.trim="search_name" v-focus style="width: 78%">
									</el-input>
								</div>
								<!--        <div class="demo-input-suffix">
				        图样代号：
				        <el-input
				          placeholder="请输入内容"
				          prefix-icon="el-icon-search"
				          v-model="search_item">
				        </el-input>
				      </div>
				      <div class="demo-input-suffix">
				        型号规格：
				        <el-input
				          placeholder="请输入内容"
				          prefix-icon="el-icon-search"
				          v-model="search_specs">
				        </el-input>
				      </div>
				      <div class="demo-input-suffix">
				        材料：
				        <el-input
				          placeholder="请输入内容"
				          prefix-icon="el-icon-search"
				          v-model="search_material">
				        </el-input>
				      </div> -->
								<div class="demo-input-suffix" style="">
									<el-button type="primary" @click="jump(1)">搜索</el-button>
								</div>
								<div class="demo-input-suffix" style="margin-left: 10px;">
									<el-button type="primary" @click="jumpAll">全部</el-button>
								</div>
							</div>
				
							<!-- <el-button type="primary" v-model="search">搜索</el-button> -->
							<!-- <el-button type="danger" @click="empty">清空</el-button> -->
						</div>
						<el-table :data="tableData" style="width: 100%;margin-top:1rem;margin-bottom:1rem;" :header-cell-style="tableheader">
							<!--      <el-table-column type="selection">
				    </el-table-column> -->
							<el-table-column label="序号" width="100">
								<!-- <template slot-scope="scope">
				        <span style="">{{ scope.$index+1 }}</span>
				      </template> -->
								<template slot-scope="scope">
									<span style="">{{ scope.row.id }}</span>
								</template>
							</el-table-column>
							<el-table-column label="图片" prop="image" width="120">
								<template slot-scope="scope">
				
									<el-popover placement="right" title="" trigger="hover">
										<img :src="scope.row.img" style="height: 500px;width: 500px">
										<img slot="reference" :src="scope.row.img" alt="" style="height: 50px;width: 50px">
									</el-popover>
									<!-- <div class="img_div" @click="big_img">
				          <img class="lab_img" :src="scope.row.image"  alt="">
				           <img class="lab_img" src="http://zrui.e7vr.com/image/arm/default.gif" v-else alt="">
				        </div> -->
				
								</template>
							</el-table-column>
							<el-table-column label="图样代号" prop="items">
								<template slot-scope="scope">
									<span style="">{{ scope.row.items }}</span>
								</template>
							</el-table-column>
							<el-table-column label="图样名称" prop="name_">
								<template slot-scope="scope">
									<span style="">{{ scope.row.name_ }}</span>
								</template>
							</el-table-column>
							<!--     <el-table-column label="零件编码" prop="parts_number_">
				      <template slot-scope="scope">
				        <span style="">{{ scope.row.parts_number_ }}</span>
				      </template>
				    </el-table-column> -->
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
							<el-table-column label="数量" prop="number">
								<template slot-scope="scope">
									<span style="">{{ scope.row.number }}</span>
								</template>
							</el-table-column>
							<el-table-column label="创建时间" prop="createTime">
								<template slot-scope="scope">
									<span style="">{{ scope.row.createTime}}</span>
								</template>
							</el-table-column>
							<!--      <el-table-column label="备注" prop="remark">
				      <template slot-scope="scope">
				        <span style="">{{ scope.row.remark }}</span>
				      </template>
				    </el-table-column> -->
				
							<!--      <el-table-column prop="status" label="库存状态" width="130" :filters="[{ text: '出库', value: 2 }, { text: '入库', value: 1 }]"
				      :filter-method="filterTag" filter-placement="bottom-end" align="center">
				      <template slot-scope="scope">
				        <el-tag :type="scope.row.status=== 2 ? 'primary' : 'success'" disable-transitions>
				          {{scope.row.status=== 2 ? '出库' : '入库'}}
				        </el-tag>
				      </template>
				    </el-table-column> -->
							<!--    <el-table-column align="right">
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
						</el-table>
						<div class="block">
							<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pagesize" layout="prev, pager, next, jumper"
							 :total="total">
							</el-pagination>
						</div>
						<div class="drag" v-if="bigBoxImg!=''">
							<div class="drag_box">
								<div :style="{background: 'url('+bigBoxImg+') center / contain no-repeat'}">
									<i class="el-icon-error" @click="bgDrage"></i>
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
	// import Editor from '@tinymce/tinymce-vue'
	export default {
		name: 'List',
		components: {
			// Editor
			Left, Head
		},
		data() {
			return {
				search_name: '',
				search_material: '',
				search_item: '',
				search_specs: '',
				go_num: '',
				pagesize: 10,
				currpage: 1,
				// currentPage3: 1,
				tableData: [],
				total: 0,
				bigBoxImg: '',
			}
		},
		created() {
			this.jump();
		},
		beforeDestroy() {
			localStorage.removeItem('listname');
		},
		directives: { //input获取焦点
			focus: {
				inserted: function(el) {
					el.querySelector('input').focus()
				}
			}
		},
		methods: {
			empty() {
				this.inputa = '',
				this.inputb = '',
				this.inputc = ''

			},

			handleDelete(index, row) {},
			tableheader({ row, column, rowIndex, columnIndex }) {
				if (rowIndex === 0) {
					return 'height:70px;background:#e5e5e5'
				}
			},
			filterTag(value, row) {
				return row.status === value;
			},
			handleEdit() {},
			handleChange(value) {},
			handleSizeChange(psize) {
				this.pagesize = psize;
			},
			handleCurrentChange(cpage) {
				this.currpage = cpage;
				this.jump();
			},
			jump(seach) {
				let that = this;
				var token = that.token;
				var url = that.url;
				Date.prototype.toLocaleString = function() {
					return this.getFullYear() + "/" + ((this.getMonth() + 1) < 10 ? '0' + (this.getMonth() + 1) : (this.getMonth() +
						1)) + "/" + (this.getDate() < 10 ? '0' + this.getDate() : this.getDate()) + " " + (this.getHours() < 10 ?
						'0' + (this.getHours()) : this.getHours()) + ":" + (this.getMinutes() < 10 ? ('0' + this.getMinutes()) :
						this.getMinutes()) + ":" + (this.getSeconds() < 10 ? '0' + this.getSeconds() : this.getSeconds())
				};
				var listname = that.search_name || localStorage.getItem('lossname_');
				that.axios.get(url + '/api/v1/out/list', {
						params: {
							page: seach || that.currpage,
							size: that.pagesize,
							name: listname,
							type: 0

						},
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							"token": token
						},
					})
					.then(function(res) {
						var listname_ = localStorage.getItem('listname');
						if (listname_ == "" || listname_ == undefined) {
							if (that.search_name != '') {
								localStorage.setItem('listname', that.search_name);
							}

						}
						var data = res.data.data.list;
						that.total = res.data.data.count.total;
						that.tableData = res.data.data.list;
						for (var i = 0; i < data.length; i++) {
							data[i].createTime = new Date(data[i].created_at * 1000).toLocaleString().slice(0, -3);
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

							var pa_number = that.tableData[i].parts_number;
							if (pa_number == null || pa_number == undefined || pa_number == "") {
								that.tableData[i].parts_number_ = "-- --";
							} else {
								that.tableData[i].parts_number_ = that.tableData[i].parts_number;
							}

							var spec = that.tableData[i].specs;
							if (spec == null || spec == undefined || spec == "") {
								that.tableData[i].specs_ = "-- --";
							} else {
								that.tableData[i].specs_ = that.tableData[i].specs;
							}

							var names = that.tableData[i].name;
							if (names == null || names == undefined || names == "") {
								that.tableData[i].name_ = "-- --";
							} else {
								that.tableData[i].name_ = that.tableData[i].name;
							}

							var materials = that.tableData[i].material;
							if (materials == null || materials == undefined || materials == "") {
								that.tableData[i].material_ = "-- --";
							} else {
								that.tableData[i].material_ = that.tableData[i].material;
							}

						}
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			jumpAll() {
				var that = this;
				localStorage.removeItem('listname');
				that.search_name = '';
				if (that.search_name == '') {
					that.jump();
				}
			},
			big_img() {
				console.log("点击放大图片");
			},
			// seacher_out(seach){//搜索
			//   let that = this;
			//   var ruleform=JSON.parse(localStorage.getItem("ruleForm"))
			//   var token=that.$store.state.token==""?ruleform.token:that.$store.state.token;
			//   var url=that.$store.state.url;
			//   console.log(token);
			//   var listname = that.search_name || localStorage.getItem('lossname_');
			//     that.axios.get(url+'/api/v1/out/list',{
			//       headers: {
			//          'content-type': 'application/x-www-form-urlencoded',
			//          "token":token
			//         },
			//       params:{
			//        page: seach||that.currpage,
			//        size: that.pagesize,
			//        name:listname,
			//        // item:that.search_item,
			//        // specs:that.search_specs,
			//        // material:that.search_material,
			//        status:0
			//       }
			//     })
			//     .then(function (res) {
			//       console.log(res);
			//       var listname_ = localStorage.getItem('listname');
			//       if(listname_=="" || listname_==undefined){
			//         if (that.search_name != '') {
			//           localStorage.setItem('listname_',that.search_name);
			//         }

			//       }
			//       console.log(res.data.data.list);
			//       that.total = res.data.data.count.total;
			//       console.log(that.total);
			//       that.tableData=res.data.data.list;
			//     })
			//     .catch(function (error) {
			//       console.log(error);
			//     });
			// },
			export_out() { //导出

			},
			getListImg(imgUrl) {
				this.bigBoxImg = imgUrl;
			},
			bgDrage() {
				this.bigBoxImg = '';
			},
		},
		computed: {
			...mapGetters({
				url: "geturl",
				token: "getToken"
			}),
			// tables(){
			//    if(this.search) {
			//      return this.tableData.filter(item =>{
			//        console.log(item);
			//        return Object.keys(item.name).some(key => {
			//        console.log(key);
			//          return String(item.name).toLowerCase().indexOf(this.search) > -1

			//        })
			//      })
			//    }
			//    if(this.search_id) {
			//      return this.tableData.filter(item =>{
			//        console.log(item);
			//        return Object.keys(item.material).some(key => {
			//        console.log(key);
			//          return String(item.material).toLowerCase().indexOf(this.search_id) > -1

			//        })
			//      })
			//    }
			//    if(this.search_id) {
			//      return this.tableData.filter(item =>{
			//        console.log(item);
			//        return Object.keys(item.material).some(key => {
			//        console.log(key);
			//          return String(item.material).toLowerCase().indexOf(this.search_id) > -1

			//        })
			//      })
			//    }
			//    if(this.search_item) {
			//      return this.tableData.filter(item =>{
			//        console.log(item);
			//        return Object.keys(item.item).some(key => {
			//        console.log(key);
			//          return String(item.item).toLowerCase().indexOf(this.search_item) > -1

			//        })
			//      })
			//    }
			//    if(this.search_specs){
			//      return this.tableData.filter(item =>{
			//        console.log(item);
			//        return Object.keys(item.specs).some(key => {
			//          console.log(key);
			//          return String(item.specs).toLowerCase().indexOf(this.search_specs) >-1
			//        })
			//      })
			//    }
			//    else return this.tableData
			// },
		},
	}
</script>

<style scoped="">
	.List {
		margin-top: 10px;
		background: #FFFFFF;
		padding: 10px 10px 10px;
	}

	.title {
		font-size: 0.9375rem;
		margin-bottom: 0.3125rem;
	}

	.input_flex {
		display: flex;
		justify-content: space-between;
		/* max-width: 28rem; */
	}

	.input_flex .fl {
		display: flex;

	}

	.el-input {
		width: 54%;
	}

	/*  .input_flex .el-button {
    padding: 0px 20px;
  } */

	.el-input-number {
		width: 100%;
	}

	.el-pagination {
		padding: 2px 0px;
	}

	.img_div {
		width: 50px;
		height: 50px;
	}

	.img_div .lab_img {
		width: 100%;
		height: 100%;
	}

	.el-tag {
		background-color: #FFFFFF !important;
		border-style: none !important;
	}

	.drag {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: rgba(0, 0, 0, .3);
	}

	.drag .el-icon-error {
		font-size: 40px;
		float: right;
		color: azure;
	}

	.drag_box {
		width: 620px;
		height: 500px;
		border: 1px solid #666;
		background-color: #060606;
		/* 使用定位，脱离文档流 */
		position: relative;
		top: calc((100vh - 500px)/2);
		top: -moz-calc((100vh - 500px)/2);
		top: -webkit-calc((100vh - 500px)/2);
		left: calc((100vw - 620px)/2);
		left: -moz-calc((100vw - 620px)/2);
		left: -webkit-calc((100vw - 620px)/2);
		/* 鼠标移入变成拖拽手势 */
		cursor: move;
		z-index: 3000;
	}

	.drag_box div {
		width: 100%;
		height: 100%;
	}
</style>
