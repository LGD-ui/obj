<template>
	<div class="Out">
		<div class="title">出库</div>
		<div style="width: 100%;">
			<el-form :model="barlist" :rules="rules" ref="barlist">
				<div class="input_flex">
					<el-form-item label="条形码" prop="bar_code" style="min-width: 28.125rem;">
						<el-input v-model.trim="barlist.bar_code" placeholder="请输入条码" style="width: 180px;"></el-input>
						<el-button type="primary" @click="submitForm('barlist')">出库</el-button>
						<!-- <el-button @click="resetForm('barlist')">重置</el-button> -->
						<el-button @click="batch('barlist')" type="danger">报损</el-button>
					</el-form-item>
					<el-form-item>
						<div class="demo-input-suffix">
							图样名称：
							<el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model.trim="search_name">
							</el-input>
							<el-button type="primary" @click="seacher_out(1)">搜索</el-button>

						</div>

					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="seacher_alllist">全部</el-button>
					</el-form-item>
				</div>
				<div class="input_flex">
					<!--   <div class="fl">

            <div class="demo-input-suffix">
              图样名称：
              <el-input
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                v-model="search_name">
              </el-input>
            </div> -->
					<!--  <div class="demo-input-suffix">
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
					<!--   <div class="demo-input-suffix" style="">
              <el-button type="primary" @click="seacher_out">搜索</el-button>
            </div>

          </div> -->
				</div>
			</el-form>
		</div>
		<!--    <el-table
          :data="tables.slice((currpage - 1) * pagesize, currpage * pagesize)" -->
		<el-table :data="tableData" style="width: 100%;margin:1rem 0;" :header-cell-style="tableheader">
			<!--          <el-table-column type="selection">
          </el-table-column> -->
			<el-table-column label="编号" width="100">
				<!--   <template slot-scope="scope">
              <span style="">{{ scope.$index+1 }}</span>
            </template> -->
				<template slot-scope="scope">
					<span style="">{{ scope.row.id}}</span>
				</template>
			</el-table-column>
			<el-table-column label="图片" prop="img" width="100">
				<template slot-scope="scope">
					<!-- <div class="img_div">
            <img class="lab_img" :src="scope.row.image" v-if="scope.row.image!=''" alt="">
            <img class="lab_img" src="http://zrui.e7vr.com/image/arm/default.gif" v-else alt="">
          </div> -->
					<el-popover placement="right" title="" trigger="hover">
						<img :src="scope.row.img" style="height: 500px;width: 500px">
						<img slot="reference" :src="scope.row.img" alt="" style="height: 50px;width: 50px">

					</el-popover>
				</template>
			</el-table-column>
			<el-table-column label="图样代号" prop="item">
				<template slot-scope="scope">
					<span style="">{{ scope.row.item }}</span>
				</template>
			</el-table-column>
			<el-table-column label="图样名称" prop="name">
				<template slot-scope="scope">
					<span style="">{{ scope.row.name }}</span>
				</template>
			</el-table-column>
			<el-table-column label="材料" prop="material">
				<template slot-scope="scope">
					<span style="">{{ scope.row.material }}</span>
				</template>
			</el-table-column>
			<el-table-column label="型号规格" prop="specs">
				<template slot-scope="scope">
					<span style="">{{ scope.row.specs }}</span>
				</template>
			</el-table-column>
			<el-table-column label="零件编码" prop="parts_number">
				<template slot-scope="scope">
					<span style="">{{ scope.row.parts_number }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="库存状态" align="center">
				<template slot-scope="scope">
					<el-tag :type="scope.row.status=== 2 ? 'primary' : 'success'" close-transition>
						{{scope.row.status=== 2 ? '出库' : '入库'}}
					</el-tag>
				</template>
			</el-table-column>
			<!--          <el-table-column label="备注" prop="remark">
            <template slot-scope="scope">
              <span style="">{{ scope.row.remark }}</span>
            </template>
          </el-table-column> -->
			<!-- <el-table-column width="100">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" placeholder="请输入内容" prefix-icon="el-icon-search" size="small"></el-input>
        </template>
        <template slot-scope="scope">
          <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">备注</el-button>
          <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
		name: 'Out',
		components: {
			// Editor
		},
		data() {
			return {
				search_name: '',
				// search_material:'',
				// search_item:'',
				// search_specs:'',
				bar_code: '', //条码
				pagesize: 10,
				currpage: 1,
				total: 0,
				ifalllistbtn: true,
				barlist: {
					bar_code: '',
					// bar_user:''
				},
				newTable: {},
				tableData: [],
				rules: {
					bar_code: [{
							required: true,
							message: '请输入',
							trigger: 'blur'
						},
						{
							min: 1,
							message: '长度至少一个字符',
							trigger: 'blur'
						}
					],
					// bar_user: [
					//   { required: true, message: '请输入', trigger: 'blur' },
					//   { min: 1, message: '长度至少一个字符', trigger: 'blur' }
					// ]
				}
			}
		},
		created() {
			this.list();
		},
		methods: {
			empty() {
				this.inputa = '',
				this.inputb = '',
				this.inputc = ''
			},
			submitForm(formName) {
				var that = this;
				that.$refs[formName].validate((valid) => {
					if (valid) {
						var parts_number = that.barlist.bar_code;
						var token = that.token;
						var url = that.url;
						that.axios.get(url + '/api/v1/out/manual', {
								headers: {
									'content-type': 'application/x-www-form-urlencoded',
									"token": token
								},
								params: {
									parts_number: parts_number
								}
							})
							.then(function(res) {
								that.list();
							})
							.catch(function(error) {
								console.log(error);
							});
						this.$refs[formName].resetFields();
					} else {
						return false;
					}
				});
			},
			batch(formName) {
				var that = this;
				that.$refs[formName].validate((valid) => {
					if (valid) {
						var parts_number = that.barlist.bar_code;
						var token = that.token;
						var url = that.url;
						that.axios.get(url + '/api/v1/assemble/obtain', {
								headers: {
									'content-type': 'application/x-www-form-urlencoded',
									"token": token
								},
								params: {
									parts_number: parts_number,
									type: 2
								}
							})
							.then(function(res) {
								var parts_number = res.data.data.parts_number;
								var product_id = res.data.data.product_id;
								var product_name = res.data.data.product_name;

								let postData = Qs.stringify({
									product_id: product_id,
									product_name: product_name,
									parts_number: parts_number,
									type: 1,
									source: 2,
								});
								that.axios.post(url + '/api/v1/loss/save', postData, {
										headers: {
											'content-type': 'application/x-www-form-urlencoded',
											"token": token
										}
									})
									.then(function(res) {
										console.log(res);
									})
									.catch(function(error) {
										console.log(error);
									});


								// that.list();
							})
							.catch(function(error) {
								console.log(error);
							});
						this.$refs[formName].resetFields();
					} else {
						return false;
					}
				});

			},
			list(page) {
				let that = this;
				var token = that.token;
				var url = that.url;
				that.axios.get(url + '/api/v1/out/list', {
						params: {
							page: that.currpage,
							size: that.pagesize,
							status: 2
						},
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							"token": token
						},
					})
					.then(function(res) {
						that.total = res.data.data.count.total;
						that.tableData = res.data.data.list;
						for (var i = 0; i < that.tableData.length; i++) {
							var img_ = that.tableData[i].image;
							if (img_ == "" || img_ == undefined) {
								that.tableData[i].img = "http://zrui.e7vr.com/image/arm/default.gif";
							} else {
								that.tableData[i].img = that.tableData[i].image;
							}
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			seacher_out(page) { //搜索
				let that = this;
				var token = that.token;
				var url = that.url;
				var name = that.search_name == "" ? localStorage.getItem('search_name') : that.search_name;

				that.axios.get(url + '/api/v1/out/list', {
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							"token": token
						},
						params: {
							page: that.currpage,
							size: that.pagesize,
							name: name,
							// item:that.search_item,
							// specs:that.search_specs,
							// material:that.search_material,
							status: 2
						}
					})
					.then(function(res) {
						var search_name = localStorage.getItem('search_name');
						if (search_name == "" || search_name == undefined) {
							localStorage.setItem('search_name', that.search_name);
							if (localStorage.getItem('search_name') != "" || localStorage.getItem('search_name') != undefined) {
								that.ifalllistbtn = false;

							}
						}
						// if(search_name=="" || search_name==undefined){
						//  if(that.search_name!=""){
						//     localStorage.setItem('search_name',that.search_item);
						//  }
						// }
						that.total = res.data.data.count.total;
						that.tableData = res.data.data.list;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			seacher_alllist() {
				var that = this;
				that.search_name = "";
				localStorage.removeItem("search_name");

				if (localStorage.getItem('search_name') == "" || localStorage.getItem('search_name') == undefined) {
					that.ifalllistbtn = true;
					that.list();
				}

			},
			export_out() { //导出

			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			tableheader({ row, column, rowIndex, columnIndex }) {
				if (rowIndex === 0) {
					return 'height:70px;background:#e5e5e5'
				}
			},
			handleDelete(index, row) {},
			handleEdit() {},
			handleChange(value) {},
			// 导入
			handleChanges(file, fileList) {
				this.fileTemp = file.raw
			},

			handleRemove(file, fileList) {
				this.fileTemp = null
			},
			// 分页
			handleSizeChange(psize) {
				this.pagesize = psize;
			},
			handleCurrentChange(cpage) {
				this.currpage = cpage;
				var search_name = localStorage.getItem('search_name');
				if (search_name == "") {
					this.list();
				} else {
					this.seacher_out();
				}


			},
			handleExceed() {},
			fileListUpload() {},

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
	.title {
		font-size: 0.9375rem;
	}

	.Out {
		margin-top: 10px;
		background: #FFFFFF;
		padding: 10px 10px 10px;
	}

	.input_flex {
		display: flex;
		/* justify-content: space-between; */
		margin-top: 1rem;
		/* max-width: 45rem; */
	}

	.input_flexs {
		display: flex;
		justify-content: space-between;
		margin-top: 0.25rem;
		/* max-width: 45rem; */
	}

	.input_flexs .fl {
		display: flex;

	}

	.input_flex .fl {
		display: flex;

	}

	.el-input {
		/* width:54%; */
	}

	/* .input_flex .el-button {
    padding:0px 20px;
  } */
	.el-input-number {
		width: 100%;
	}

	.el-pagination {
		padding: 2px 0px;
	}

	.el-input--small .el-input__inner {
		height: 2.5rem !important;
		line-height: 2.5rem !important;
	}

	.el-input__inner {
		width: 9.375rem
	}

	.el-button--primary {
		margin-left: 1.25rem !important;
	}

	.el-form-item__content {
		width: 28.125rem !important;
	}

	.img_div {
		width: 50px;
		height: 50px;
		/* margin: 0 auto; */
	}

	.img_div .lab_img {
		width: 100%;
		height: 100%;
	}

	.el-tag {
		background-color: #FFFFFF !important;
		border-style: none !important;
	}

	.el-input {
		width: 54%;
	}

	.el-form-item {
		margin-bottom: 5px !important;
	}
</style>
