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
								<!--        <div class="demo-input-suffix">
				                   图样名称：
				                   <el-input
				                     placeholder="请输入内容"
				                     prefix-icon="el-icon-search"
				                     v-model="search">
				                   </el-input>
				                 </div>
				                 <div class="demo-input-suffix">
				                   材料：
				                   <el-input
				                     placeholder="请输入内容"
				                     prefix-icon="el-icon-search"
				                     v-model="search_id">
				                   </el-input>
				                 </div>
				                 <div class="demo-input-suffix">
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
				                 </div> -->
							</div>
							<div class="demo-input-suffix">
								<el-button type="primary" @click="scan_out">导出</el-button>
							</div>
							<!-- <el-button type="primary" v-model="search">搜索</el-button> -->
							<!-- <el-button type="danger" @click="empty">清空</el-button> -->
						</div>
						<el-table :data="tableData" style="width: 100%;margin-top:1rem;margin-bottom:1rem;" :header-cell-style="tableheader">
							<el-table-column label="序号" width="150">
								<template slot-scope="scope">
									<span style="">{{ scope.row.id }}</span>
								</template>
							</el-table-column>
				
							<el-table-column label="托盘名称" prop="name">
								<template slot-scope="scope">
									<span style="">{{ scope.row.name }}</span>
								</template>
							</el-table-column>
							<el-table-column label="托盘编码" prop="parts_number">
								<template slot-scope="scope">
									<span style="">{{ scope.row.parts_number }}</span>
								</template>
							</el-table-column>
							<el-table-column label="装盘状态" prop="is_use">
								<template slot-scope="scope">
									<!--   <el-tag :type="scope.row.is_use=== 1 ? 'primary' : 'success'" disable-transitions>
				
				         {{scope.row.is_use=== 1 ? '未使用' : '已使用'}}
				       </el-tag> -->
				
									<el-tag :type="scope.row.is_use === 1 ? 'primary' : scope.row.is_use === 2 ? 'success' : scope.row.is_use === 3 ? 'info' : scope.row.is_use === 4 ?'danger':''"
									 close-transition>
										{{scope.row.is_use_}}
									</el-tag>
								</template>
							</el-table-column>
							<el-table-column label="操作" prop="parts_number">
								<template slot-scope="scope">
									<!-- <span style="">{{ scope.row.parts_number }}</span> -->
									<el-button  size="mini" v-if="scope.row.is_use==1" @click="getTotray(scope.row.parts_number)">装盘</el-button>
								</template>
							</el-table-column>
							<el-table-column align="right">
								<template slot="header" slot-scope="scope">
								</template>
								<template slot-scope="scope" v-if="scope.row.is_use==4">
				
									<!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">查看</el-button> -->
				
									<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
									</el-popconfirm>
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
				search: '',
				search_id: '',
				search_item: '',
				search_specs: '',
				go_num: '',
				pagesize: 10,
				currpage: 1,
				list: [],
				tableData: [],
				total: 0,
				id_: '',
				status_: ''
			}
		},
		computed: {
			...mapGetters({
				url: "geturl",
				token: "getToken"
			})
		},
		created() {
			this.jump(1);
		},
		beforeDestroy() {

		},
		methods: {
			jump(page) {
				let that = this;
				that.axios.get(that.url + '/api/v1/tray/list', {
						params: {
							page: that.currpage,
							size: that.pagesize,
							// status: 0
						},
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							"token": that.token
						},
					})
					.then(function(res) {
						var data = res.data.data.list;
						for (var i = 0; i < data.length; i++) {

							data[i].is_use_ = data[i].is_use == 1 ? '未使用' : data[i].is_use == 2 ? '装盘中' : data[i].is_use == 3 ?
								'待装配' : '装配中';
						}
						that.total = res.data.data.count.total;
						that.tableData = res.data.data.list;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
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
			handleEdit(value, row) {
				var that = this;
				that.id_ = row.id;
				that.status_ = row.is_use;
				that.$alert('确认修改状态', '修改状态', {
					confirmButtonText: '确定',
					callback: action => {
						that.reference();
					}
				});
			},
			reference() {
				let that = this;
				var listname = that.search_name || localStorage.getItem('lossname_');
				that.axios.get(that.url + '/api/v1/tray/status', {
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							"token": that.token
						},
						params: {
							id: that.id_,
							status: that.status_
						}
					})
					.then(function(res) {
						if (data.status == 200) {
							that.jump();
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			handleChange(value) {},
			handleSizeChange(psize) {
				this.pagesize = psize;
			},
			handleCurrentChange(cpage) {
				this.currpage = cpage;
				this.jump(cpage);
			},
			scan_out() {
				location.href = this.url+"/api/v1/tray/export";
			},
			getTotray(parts_number) {
				localStorage.setItem("index", "2-1");
				this.$router.push({
					path: '/tray_enter',
					query: {
						parts_number: parts_number
					}
				})
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
</style>
