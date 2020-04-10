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
									<el-input placeholder="搜索" prefix-icon="el-icon-search" v-model.trim="search_name" v-focus style="width: 89%;">
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
						<!--    <div class="demo-input-suffix" style="margin-left: 10px;float: right;margin-top: -2.5rem;">
				    <el-button type="primary" @click="jump(1)" style="margin-left:-16rem">入库</el-button>
				  </div>
				  <div class="demo-input-suffix" style="margin-left: 10px;float: right;margin-top: -2.5rem;">
				    <el-button type="primary" @click="jump(3)" style="margin-left:-10.20rem">出库</el-button>
				  </div>
				  <div class="demo-input-suffix" style="margin-left: 10px;float: right;margin-top: -2.5rem;">
				    <el-button type="primary" @click="jump(2)">托盘</el-button>
				  </div> -->
						<el-table :data="tableDatas" style="width: 100%;margin-top:1rem;margin-bottom:1rem;" :header-cell-style="tableheader">
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
									<!--   <div class="img_div">
				          <img class="lab_img" :src="scope.row.image" v-if="scope.row.image!=null" alt="">
				          <img class="lab_img" src="http://zrui.e7vr.com/image/arm/default.gif" v-else alt="">
				        </div> -->
									<el-popover placement="right" title="" trigger="click">
										<img :src="scope.row.img" style="height: 500px;width: 500px">
										<img slot="reference" :src="scope.row.img" alt="" style="height: 50px;width: 50px">
									</el-popover>
								</template>
							</el-table-column>
							<el-table-column label="图样代号" prop="item_">
								<template slot-scope="scope">
									<span style="">{{ scope.row.item_ }}</span>
								</template>
							</el-table-column>
							<el-table-column label="图样名称" prop="name">
								<template slot-scope="scope">
									<span style="">{{ scope.row.name }}</span>
								</template>
							</el-table-column>
							<!--      <el-table-column label="零件编码" prop="parts_number">
				      <template slot-scope="scope">
				        <span style="">{{ scope.row.parts_number }}</span>
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
							<el-table-column label="备注" prop="remark">
								<template slot-scope="scope">
									<span style="">{{ scope.row.remark }}</span>
								</template>
							</el-table-column>
							<el-table-column prop="type" label="记录来源" width="130" :filters="[{ text: '入库', value: 1 },{ text: '托盘出库', value: 2 }, { text: '出库', value: 3 }]"
							 :filter-method="filterTag" filter-placement="bottom-end" align="center">
								<template slot-scope="scope">
									<el-tag :type="scope.row.type === 2 ? 'primary' : scope.row.type === 3 ? 'success' : scope.row.type === 1 ? 'info' : ''"
									 close-transition>
										{{scope.row.type_}}
									</el-tag>
								</template>
							</el-table-column>
							<el-table-column label="详情" width="100" align="center">
								<template slot-scope="scope" v-if="scope.row.product_type==2 && scope.row.type==1">
									<el-button @click="submitdetail(scope.row)" type="primary">查看</el-button>
								</template>
							</el-table-column>
							<el-table-column label="操作" width="100" align="center">
								<template slot-scope="scope" v-if="scope.row.product_type==2 && scope.row.type==1">
									<el-button @click="submit(scope.$index,scope.row)" type="primary">导出</el-button>
								</template>
							</el-table-column>
						</el-table>
						<div class="block">
							<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pagesize" layout="prev, pager, next, jumper"
							 :total="total">
							</el-pagination>
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
				tableDatas: [],
				total: 0
			}
		},
		computed: {
			...mapGetters({
				url: "geturl",
				token: "getToken"
			})
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
				var that = this;
				return row.type === value;
				// that.jump(value);

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
			jump(search) {
				let that = this;
				Date.prototype.toLocaleString = function() {
					return this.getFullYear() + "/" + ((this.getMonth() + 1) < 10 ? '0' + (this.getMonth() + 1) : (this.getMonth() +
						1)) + "/" + (this.getDate() < 10 ? '0' + this.getDate() : this.getDate()) + " " + (this.getHours() < 10 ?
						'0' + (this.getHours()) : this.getHours()) + ":" + (this.getMinutes() < 10 ? ('0' + this.getMinutes()) :
						this.getMinutes()) + ":" + (this.getSeconds() < 10 ? '0' + this.getSeconds() : this.getSeconds())
				};
				var listname = that.search_name || localStorage.getItem('lossname_');

				// let postData = Qs.stringify({
				//   parts_number: that.barcode_val
				// });
				that.axios.get(that.url + '/api/v1/out/list', {
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							"token": that.token
						},
						params: {
							page: that.currpage,
							size: that.pagesize,
							type: 0,
							name: that.search_name
						},
					})
					.then(function(res) {
						var data = res.data.data.list;
						that.tableDatas = res.data.data.list;
						that.total = res.data.data.count.total;
						for (var i = 0; i < data.length; i++) {
							data[i].type_ = data[i].type == 1 ? '入库' : data[i].type == 2 ? '托盘出库' : '出库';
							data[i].createTime = new Date(data[i].created_at * 1000).toLocaleString().slice(0, -3);
							// data[i].type_=data[i].type;

							var img_ = data[i].image;
							if (img_ == "" || img_ == undefined) {
								data[i].img = "http://zrui.e7vr.com/image/arm/default.gif";
							} else {
								data[i].img = data[i].image;
							}

							var specs_s = data[i].specs;
							if (specs_s == "" || specs_s == undefined || specs_s == null) {
								data[i].specs_ = "-- --";
							} else {
								data[i].specs_ = data[i].specs;
							}


							var material_s = data[i].material;
							if (material_s == "" || material_s == undefined || material_s == null) {
								data[i].material_ = "-- --";
							} else {
								data[i].material_ = data[i].material;
							}

							var item_s = data[i].item;
							if (item_s == "" || item_s == undefined || item_s == null) {
								data[i].item_ = "-- --";
							} else {
								data[i].item_ = data[i].item;
							}
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			outAll() { //导出
				let that = this;
				var name = that.search_name || localStorage.getItem('search_name');
				name = name || "";
				location.href = that.url+"/api/v1/out/export?name=" + name;
			},
			jumpAll() {
				var that = this;
				localStorage.removeItem('listname');
				that.search_name = '';
				if (that.search_name == '') {
					that.jump();
				}
			},
			submit(c, d) { //单个导出
				var id = d.id;
				let that = this;
				location.href = that.url + "/api/v1/out/export?id=" + id;
			},
			submitdetail(row) {
				this.$router.push({
					path: '/recorddetail',
					query: {
						id: row.id,
					}
				})
			},

			export_out() { //导出

			},
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
</style>
