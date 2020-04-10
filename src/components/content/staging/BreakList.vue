<template>
	<el-container>
		<Left/>
		<el-container>
			<el-main style="padding: 10px;">
				<Head/>
				<div class="breakList">
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
									<el-input placeholder="搜索" prefix-icon="el-icon-search" v-model.trim="search_name" style="width: 89%;">
									</el-input>
								</div>
								<!--        <div class="demo-input-suffix">
				        类型：
				        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model.trim="search_type	">
				        </el-input>
				      </div> -->
								<!--        <div class="demo-input-suffix">
				        零件编码：
				        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="search_item">
				        </el-input>
				      </div> -->
								<!--        <div class="demo-input-suffix">
				        报损来源：
				        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model.trim="search_source	">
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
									<!--  <div class="img_div">
				          <img class="lab_img" :src="scope.row.image" v-if="scope.row.image!=null" alt="">
				          <img class="lab_img" src="http://zrui.e7vr.com/image/arm/default.gif" v-else alt="">
				        </div> -->
									<el-popover placement="right" title="" trigger="click">
										<img :src="scope.row.img" style="height: 500px;width: 500px">
										<img slot="reference" :src="scope.row.img" alt="" style="height: 50px;width: 50px">
									</el-popover>
				
								</template>
							</el-table-column>
				
							<el-table-column label="图样名称" prop="product_names">
								<template slot-scope="scope">
									<span style="">{{ scope.row.product_names }}</span>
								</template>
							</el-table-column>
							<el-table-column label="零件编码" prop="p_number">
								<template slot-scope="scope">
									<span style="">{{ scope.row.p_number }}</span>
								</template>
							</el-table-column>
				
							<el-table-column label="数量" prop="number">
								<template slot-scope="scope">
									<span style="p">{{ scope.row.number }}</span>
								</template>
							</el-table-column>
							<el-table-column label="类型" prop="type">
								<template slot-scope="scope">
									<span style="">{{ scope.row.type=== 2 ? '模型' : '零件' }}</span>
									<!--   <el-tag :type="scope.row.type=== 2 ? 'primary' : 'success'" disable-transitions>
				      {{scope.row.status=== 2 ? '出库' : '入库'}}
				    </el-tag> -->
								</template>
							</el-table-column>
							<el-table-column label="报损时间" prop="createTime">
								<template slot-scope="scope">
									<span style="">{{ scope.row.createTime }}</span>
								</template>
							</el-table-column>
							<el-table-column prop="status" label="报损来源" width="130" :filters="[{ text: '入库', value: 1 },{ text: '出库', value: 2 }, { text: '组装', value: 3 }]"
							 :filter-method="filterTag" filter-placement="bottom-end" align="center">
								<template slot-scope="scope">
									<!--         <el-tag :type="scope.row.status=== 2 ? 'primary' : 'success'" disable-transitions>
				          {{scope.row.status=== 2 ? '出库' : '入库'}}
				        </el-tag> -->
									<el-tag :type="scope.row.source === 2 ? 'primary' : scope.row.source === 3 ? 'success' : scope.row.source === 1 ? 'info' : ''"
									 close-transition>
										{{scope.row.source_}}
									</el-tag>
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
		name: 'breakList',
		components: {
			// Editor
			Left, Head
		},
		data() {
			return {
				search_name: '',
				search_type: '',
				search_source: '',
				go_num: '',
				pagesize: 10,
				currpage: 1,
				// currentPage3: 1,
				tableData: [],
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
			localStorage.removeItem('lossname_');
			localStorage.removeItem('losstype_');
			localStorage.removeItem('losssource_');
		},
		methods: {
			empty() {
				this.inputa = '',
					this.inputb = '',
					this.inputc = ''

			},
			// seacher_out(){//搜索
			//   let that = this;
			//   var ruleform=JSON.parse(localStorage.getItem("ruleForm"))
			//   var token=that.$store.state.token==""?ruleform.token:that.$store.state.token;
			//   var url=that.$store.state.url;
			//   console.log(token);
			//     that.axios.get(url+'/api/v1/loss/list',{
			//       headers: {
			//          'content-type': 'application/x-www-form-urlencoded',
			//          "token":token
			//         },
			//       params:{
			//        page: that.currpage,
			//          size: that.pagesize,
			//          name: that.search_name,
			//          type: that.search_type,
			//        source: that.search_source
			//       }
			//     })
			//     .then(function (res) {
			//       console.log(res);
			//       console.log(res.data.data.list);
			//       that.total=res.data.data.list.length;
			//       console.log(that.total);
			//       that.tableData=res.data.data.list;

			//     })
			//     .catch(function (error) {
			//       console.log(error);
			//     });
			// },
			handleDelete(index, row) {},
			tableheader({ row, column, rowIndex, columnIndex }) {
				if (rowIndex === 0) {
					return 'height:70px;background:#e5e5e5'
				}
			},
			filterTag(value, row) {
				return row.source === value;
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
				var lossname = that.search_name || localStorage.getItem('lossname_');
				// localStorage.setItem('lossname',that.search_name);
				var losstype = that.search_type || localStorage.getItem('losstype_');
				losstype = losstype == '零件' ? 1 : losstype == '模型' ? 2 : '';
				// localStorage.setItem('losstype',that.search_type);
				var losssource = that.search_source || localStorage.getItem('losssource_');
				losssource = losssource == '入库' ? 1 : losssource == '出库' ? 2 : losssource == '装配' ? 3 : '';
				// localStorage.setItem('losssource',that.search_source);
				that.axios.get(that.url + '/api/v1/loss/list', {
						params: {
							page: search || that.currpage,
							size: that.pagesize,
							name: lossname,
							type: losstype,
							source: losssource
						},
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							"token": that.token
						},
					})
					.then(function(res) {
						var lossname_ = localStorage.getItem('lossname');
						if (lossname_ == "" || lossname_ == undefined) {
							if (that.search_name != '') {
								localStorage.setItem('lossname_', that.search_name);
							}

						}
						var losstype_ = localStorage.getItem('losstype');
						if (losstype_ == "" || losstype_ == undefined) {
							if (that.search_name != '') {
								localStorage.setItem('losstype_', that.search_type);
							}

						}
						var losssource_ = localStorage.getItem('losssource');
						if (losssource_ == "" || losssource_ == undefined) {
							if (that.search_name != '') {
								localStorage.setItem('losssource_', that.search_source);
							}

						}
						that.total = res.data.data.count.total;
						// console.log(that.total);
						const data = res.data.data.list;
						for (var i = 0; i < data.length; i++) {
							data[i].source_ = data[i].source == 1 ? '入库' : data[i].source == 2 ? '出库' : '装配';
							data[i].createTime = new Date(data[i].created_at * 1000).toLocaleString().slice(0, -3);
							
							var img_ = data[i].image;
							if (img_ == null || img_ == undefined || img_ == "") {
								data[i].img = "http://zrui.e7vr.com/image/arm/default.gif";
							} else {
								data[i].img = data[i].image;
							}
							var p_numbers = data[i].parts_number;
							if (p_numbers == null || p_numbers == undefined || p_numbers == "") {
								data[i].p_number = "-- --";
							} else {
								data[i].p_number = data[i].parts_number;
							}

							var p_names = data[i].product_name;
							if (p_names == null || p_names == undefined || p_names == "") {
								data[i].product_names = "-- --";
							} else {
								data[i].product_names = data[i].product_name;
							}

						}
						that.tableData = res.data.data.list;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			jumpAll() {
				var that = this;
				localStorage.removeItem('lossname_');
				localStorage.removeItem('losstype_');
				localStorage.removeItem('losssource_');
				that.search_name = '';
				that.search_type = '';
				that.search_source = '';
				if (that.search_name == '' || that.search_type == '' || that.search_source == '') {
					that.jump();
				}
			}
		},
		
	}
</script>

<style scoped="">
	.breakList {
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

	/*
  .input_flex .el-button {
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
