<template>
	<el-container>
		<el-container>
			<el-main style="padding: 10px;">
				<Head/>
				<div class="CreateModular">
					<!--  -->
					<p style="padding: 5px 0;">
						<el-form :inline="true" class="demo-form-inline">
				
							<!-- <el-form-item style="padding-left: 10px;">
				     <el-cascader
				        :options="options"
				        v-model="cascaderVal"
				        style="width: 250px;"
				        @change="handleChange"
				      ></el-cascader>
				    </el-form-item> -->
							<el-form-item style="padding-left: 10px;">
								<div class="detailwrap">
									<el-input suffix-icon="el-icon-full-screen" style="width: 30.625rem;" v-model.trim="assemble_list_barcode_val"
									 autofocus placeholder="搜索" @input="assemble_list_barcode">
										<el-button slot="append" type="primary" @click="filterReset">清除</el-button>
									</el-input>
								</div>
							</el-form-item>
							<!-- <el-form-item><el-button type="primary" @click="filterReset">清除</el-button></el-form-item> -->
							<el-form-item style="float: right;">
								<el-button type="primary" @click="dialogFormVisible = true;assemble_list_barcode_val=''">
									<Icon type="md-add" />新建任务</el-button>
							</el-form-item>
							<el-form-item style="float: right;">
								<el-button type="primary" @click="dialogFormVisible__ = true;assemble_list_barcode_val=''">
									<Icon type="md-cloud-download" />下载条码</el-button>
							</el-form-item>
							<el-form-item style="float: right;">
								<el-button type="info" @click="axiosAssembleData();assemble_list_barcode_val=''">全部任务</el-button>
							</el-form-item>
							<el-form-item style="float: right;">
								<el-button size="mini" type="info" plain @click="axiosAssembleData('',1,'');assemble_list_barcode_val=''">手 臂</el-button>
							</el-form-item>
							<el-form-item style="float: right;">
								<el-button size="mini" type="info" plain @click="axiosAssembleData('',2,'');assemble_list_barcode_val=''">关 节</el-button>
							</el-form-item>
							<el-form-item style="float: right;">
								<el-link :underline="false" @click="axiosAssembleData('','',3);assemble_list_barcode_val=''">已完成</el-link>
							</el-form-item>
							<el-form-item style="float: right;">
								<el-link :underline="false" @click="axiosAssembleData('','',2);assemble_list_barcode_val=''">进行中</el-link>
							</el-form-item>
							<el-form-item style="float: right;">
								<el-link :underline="false" @click="axiosAssembleData('','',1);assemble_list_barcode_val=''">未装配</el-link>
							</el-form-item>
						</el-form>
					</p>
					<el-dialog title="添加任务" :visible.sync="dialogFormVisible" width="40%" :show-close="false">
						<div>
							<el-radio v-model="radio7" label="1" border @change="changeRadio">手 臂</el-radio>
							<el-radio v-model="radio7" label="2" border @change="changeRadio">关 节</el-radio>
						</div>
						<div v-if="axiosDataArr.length>0">
							<el-row :gutter="20" style="margin: 30px;">
								<el-col :span="8" v-for="(tab,index) in axiosDataArr" :key="index" style="margin-bottom: 10px;">
									<div class="grid-content bg-purple">
										<el-radio v-model="radio8" :label="tab" @change="changeChildRadio">{{tab.name}}</el-radio>
									</div>
								</el-col>
							</el-row>
						</div>
						<div slot="footer" class="dialog-footer">
							<el-button @click="dialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="dialogFormVisible_">确 定</el-button>
						</div>
					</el-dialog>
					<el-dialog title="选择下载条码" :visible.sync="dialogFormVisible__" width="40%" :show-close="false">
						<div>
							<el-radio v-model="radio7" :label="1" border @change="changeRadio">手 臂</el-radio>
							<el-radio v-model="radio7" :label="2" border @change="changeRadio">关 节</el-radio>
						</div>
						<div v-if="axiosDataArr.length>0">
							<el-row :gutter="20" style="margin: 30px;">
								<el-col :span="8" v-for="(tab,index) in axiosDataArr" :key="index" style="margin-bottom: 10px;">
									<div class="grid-content bg-purple">
										<el-radio v-model="radio8" :label="tab" @change="changeChildRadio">{{tab.name}}</el-radio>
									</div>
								</el-col>
							</el-row>
						</div>
						<div style="text-align: right;">
							<el-radio-group v-model="radio9" @change="changeRadio_b" style="padding-top: 30px;">
								<el-radio-button :label="1">未装配</el-radio-button>
								<el-radio-button :label="2">进行中</el-radio-button>
								<el-radio-button :label="3">已完成</el-radio-button>
							</el-radio-group>
						</div>
						<div slot="footer" class="dialog-footer">
							<el-button @click="dialogFormVisible__ = false">取 消</el-button>
							<el-button type="primary" @click="dialogFormVisible___">确认下载</el-button>
						</div>
					</el-dialog>
					<!--  -->
					<el-row v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
					 element-loading-background="rgba(0, 0, 0, 0.5)">
						<!-- <el-row v-if="filterArr.length==0"> -->
						<el-col style="width: 230px;" v-for="(tab, index) in tableData" :key="index">
				
							<div class="divcard" :style="{ padding: '0px','line-height': '2.2' }" :class="tab.status == 1 ? 'info_row' : tab.status == 2 ? 'primary_row' : tab.status == 3 ? 'success_row' : ''"
							 @click="handleCurrentChange(tab)">
								<!-- <el-progress :show-text="false" :percentage="tab.progressStatus" style="z-index: 10;margin: 0 0.25rem;" :color="customColorMethod"></el-progress> -->
								<el-tag>{{tab.progressStatusLength}}/{{tab.progressStatusdataLength}}</el-tag>
								<div style="padding: 13px;">
									<div class="bottom clearfix">
										<span class="form-item__label">人员：</span>
										<span></span>
									</div>
									<div class="bottom clearfix">
										<span class="form-item__label">名称：</span>
										<span>{{tab.name}}</span>
									</div>
									<div class="bottom clearfix">
										<span class="form-item__label">编号：</span>
										<span>{{tab.parts_number}}</span>
									</div>
									<div class="bottom clearfix">
										<span class="form-item__label">类型：</span>
										<span>{{tab.typeStr}}</span>
									</div>
									<div class="bottom clearfix">
										<span class="form-item__label">时间：</span>
										<time class="time">{{tab.createTime}}</time>
									</div>
									<div class="bottom clearfix" style="border-top: 0.0625rem solid #E8E8E8;margin: 3px 0;height: 20px;">
										<el-progress :percentage="tab.progressStatus" :color="customColorMethod"></el-progress>
										<!-- :show-text="false" -->
									</div>
								</div>
							</div>
						</el-col>
						<el-col class="nullTableData" v-if="tableData.length==0">暂无任务</el-col>
					</el-row>
					<!-- <el-row v-else>
				  <el-col style="width: 240px;" v-for="(tab, index) in filterArr.slice((currentPage - 1) * pagesize, currentPage * pagesize)" :key="index" >
				    <div
				      class="divcard"
				      :style="{ padding: '0px','line-height': '2.2' }"
				      :class="tab.status == 1 ? 'info_row' : tab.status == 2 ? 'primary_row' : tab.status == 3 ? 'success_row' : ''"
				       @click="handleCurrentChange(tab)">
				      <div style="padding: 15px;">
				        <div class="bottom clearfix">
				          <span class="form-item__label">零件ID：</span>
				          <span>{{tab.id}}</span>
				        </div>
				        <div class="bottom clearfix">
				          <span class="form-item__label">任务编号：</span>
				          <span>{{tab.parts_number}}</span>
				        </div>
				        <div class="bottom clearfix">
				          <span class="form-item__label">任务类型：</span>
				          <span>{{tab.typeStr}}</span>
				        </div>
				        <div class="bottom clearfix">
				          <span class="form-item__label">任务名称：</span>
				          <span>{{tab.name}}</span>
				        </div>
				        <div class="bottom clearfix">
				          <span class="form-item__label">创建时间：</span>
				          <time class="time">{{tab.createTime}}</time>
				        </div>
				      </div>
				    </div>
				  </el-col>
				</el-row> -->
					<!--  -->
					<!--  -->
					<!-- <el-table class="borderRadiou" highlight-current-row :row-class-name="tableRowClassName"
				    @current-change="handleCurrentChange"
				    :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
				    :header-cell-style="tableHeaderColor">
				    <el-table-column prop="id" label="零件ID" width="80"align="center"></el-table-column>
				    <el-table-column prop="parts_number" label="任务编号" width="155"></el-table-column>
				    <el-table-column prop="createTime" label="创建日期" sortable></el-table-column>
				    <el-table-column prop="typeStr" label="任务名称" :filters="typeName" :filter-method="filterName" filter-placement="bottom-end">
				      <template slot-scope="scope"> {{scope.row.typeStr}} </template>
				    </el-table-column>
				    <el-table-column prop="name" label="名称"></el-table-column>
				    <el-table-column  prop="statusStr" label="模块状态" width="100" :filters="statusName" :filter-method="filterTag" filter-placement="bottom-end" align="center">
				      <template slot-scope="scope">
				        <el-tag :type="scope.row.status === 2 ? 'primary' : scope.row.status === 3 ? 'success' : scope.row.status === 1 ? 'info' : ''" close-transition>
				          {{scope.row.statusStr}}
				        </el-tag>
				      </template>
				    </el-table-column>
				  </el-table> -->
					<!--  -->
					<div class="block">
						<el-pagination v-if="total>0" background @size-change="handleSizeChange" @current-change="handleCurrentChange_" :current-page="currentPage"
						 :page-sizes="pagesizeArr" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
							<!-- :total="filterArr.length!=0 ? filterArr.length : total" -->
						</el-pagination>
					</div>
					
				</div>
			</el-main>
		</el-container>
	</el-container>
	
</template>

<script>
	import { mapActions, mapState, mapGetters } from "vuex"
	import Head from '@/components/Head.vue'
	import Qs from 'qs'
	export default {
		name: 'CreateModular',
		components: { Head },
		data() {
			return {
				cropperPhoto: {
					dialog: false
				},
				loading: true,
				tableData: [],
				total: 0,
				select: 1,
				assemble_list_barcode_val: '',
				options: [{
					value: '任务名称',
					label: '任务名称',
					children: [{
						value: 2,
						label: '机械臂'
					}, {
						value: 13,
						label: '测试'
					}]
				}],
				typeName: [{
					text: '产品',
					value: 1
				}, {
					text: '模型',
					value: 2
				}],
				// filterArr: [],
				cascaderVal: '',
				statusName: [{
					text: '进行中',
					value: 2
				}, {
					text: '已完成',
					value: 3
				}, {
					text: '未装配',
					value: 1
				}],
				radio7: '',
				radio8: '',
				radio9: '',
				assembleExportProduct_id: '',
				assembleExportType: '',
				assembleExportStatus: '',
				currentPage: 1,
				pagesize: 18,
				pagesizeArr: [6, 12, 18],
				dialogFormVisible: false,
				dialogFormVisible__: false,
				axiosDataArr: [],
				radioType: 1,
				radioObj: {},

			}
		},
		computed: {
			...mapState({
				url: state => state.url,
			}),
			...mapGetters({
				token: "getToken"
			})
		},
		methods: {
			
			handleCurrentChange(val) {
				if (val.status === 1) {
					this.$router.push({
						path: '/content',
						query: {
							id: val.id,
							parts_number: val.parts_number,
							type: val.type
						}
					})
				} else if (val.status === 2) {
					// const h = this.$createElement;
					// this.$msgbox({
					//   title: '提示',
					//   message: h('p', null, [
					//     h('span', null, '继续装配编号为：'),
					//     h('span', { style: 'color: teal' }, val.parts_number),
					//     h('span', null, '  的任务'),
					//   ]),
					//   showCancelButton: true,
					//   confirmButtonText: '确定',
					//   cancelButtonText: '取消',
					//   beforeClose: (action, instance, done) => {
					//     if (action === 'confirm') {
					//       instance.confirmButtonLoading = true;
					//       instance.confirmButtonText = '执行中...';
					//       setTimeout(() => {
					//         done();
					//         setTimeout(() => {
					//           instance.confirmButtonLoading = false;
					//         }, 300);
					//       }, 3000);
					//     } else {
					//       done();
					//     }
					//   }
					// }).then(action => {
					//   this.$router.push({path: '/content', query: {id: val.id,parts_number: val.parts_number,type: val.type}})
					// });
					this.$router.push({
						path: '/content',
						query: {
							id: val.id,
							parts_number: val.parts_number,
							type: val.type
						}
					})
				} else if (val.status === 3) {
					this.$message({
						message: '当前模块已装配完成',
						type: 'success'
					});
					this.$router.push({
						path: '/content',
						query: {
							id: val.id,
							parts_number: val.parts_number,
							type: val.type
						}
					})
				}

			},
			customColorMethod(percentage) {
				if (percentage < 100) {
					return '#ff7d02';
				} else {
					return '#16a23c';
				}
			},
			filterTag(value, row) {
				return row.status === value;
			},
			filterName(value, row) {
				return row.type === value;
			},
			tableHeaderColor({ row, column, rowIndex, columnIndex }) {
				if (rowIndex === 0) {
					return 'background-color: #dcdcdc;color: #757272;font-weight: 700;'
				}
			},
			handleSizeChange(val) {
				// console.log(`每页 ${val} 条`);
				this.pagesize = val;
				this.axiosAssembleData()
			},
			handleCurrentChange_(val) {
				// console.log(`当前页: ${val}`);
				this.currentPage = val;
				this.loading = true;
				this.axiosAssembleData()
			},

			filterReset() {
				if (this.assemble_list_barcode_val != '') {
					this.assemble_list_barcode_val = '';
					this.axiosAssembleData()
				}
			},
			tableRowClassName({ row, rowIndex }) {
				if (row.tag == '已完成') {
					return 'success_row';
				}
				return '';
			},
			changeRadio(label) {
				// console.log(label)
				this.radioType = label;
				this.assembleExportType = label;
				this.axiosData(label);
			},
			changeRadio_t(val) {
				// console.log(val);
				this.assembleExportType = val;
			},
			changeRadio_b(val) {
				// console.log(val);
				this.assembleExportStatus = val;
			},
			changeChildRadio(label) {
				// console.log(label);
				this.assembleExportProduct_id = label.id;
				this.radioObj = label;
			},
			dialogFormVisible_() {
				let that = this;
				const url = that.url;
				var token = that.token;
				that.dialogFormVisible = false;
				// console.log(that.radioType, that.radioObj);
				let type = that.radioType;
				let name = that.radioObj.name;
				let product_id = that.radioObj.id;
				let postData = Qs.stringify({
					name: name,
					product_id: product_id,
					type: type,
				});
				// console.log('参数：：：：：',name,product_id,type)
				if (name != undefined && product_id != undefined && type != undefined) {
					that.axios.post(url + '/api/v1/assemble/save', postData, {
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							'token': token
						}
					}).then(function(response) {
						// console.log(response);
						if (response.status === 200) {
							const loading = that.$loading({
								lock: true,
								text: 'Loading',
								spinner: 'el-icon-loading',
								background: 'rgba(0, 0, 0, 0.5)'
							});

							that.axiosAssembleData();
							setTimeout(() => {
								loading.close();
								that.$notify({
									title: '成功',
									message: '模块创建成功',
									type: 'success'
								});
							}, 1000);
						}
					}).catch(function(error) {
						console.log(error);
					});
				} else {
					that.$message({
						message: '未选择参数，创建失败',
						type: 'warning'
					});
				}

				that.radio7 = '';
				that.axiosDataArr = [];
			},
			dialogFormVisible___() {
				let that = this;
				const url = that.url;
				var token = that.token;
				that.dialogFormVisible = false;
				// console.log(that.assembleExportType, that.assembleExportStatus);
				let product_id = that.assembleExportProduct_id;
				let type = that.assembleExportType;
				let status = that.assembleExportStatus;
				// console.log(product_id,type,status);
				if (product_id != '' && type != '' && status != '') {
					location.href = url + '/api/v1/assemble/export?product_id=' + product_id + '&type=' + type + '&status=' + status;
					that.assembleExportProduct_id = '';
					that.assembleExportType = '';
					that.assembleExportStatus = '';
				} else {
					that.$message({
						message: '选择参数进行下载',
						type: 'warning'
					});
				}
				that.dialogFormVisible__ = false;
			},
			// handleChange(val) {
			//   console.log(val)
			//   var that = this;
			//   that.select = val;
			// },
			assemble_list_barcode() { //扫码触发
				let that = this;
				const url = that.url;
				var token = that.token;
				// var type = that.type;
				var parts_number = that.assemble_list_barcode_val;
				// console.log(parts_number);

				// if (parts_number.length == 8) {
				// console.log(parts_number);
				for (let i in that.tableData) {
					if (that.tableData[i].parts_number == parts_number) {
						// console.log(that.tableData[i],parts_number);
						that.$router.push({
							path: '/content',
							query: {
								id: that.tableData[i].id,
								parts_number: that.tableData[i].parts_number,
								type: that.tableData[i].type,
							},
						})
					}


				}
				// if ( that.select == '') {
				//   that.$message({ message: '选择任务类型进行搜索', type: 'warning'});
				// } else {
				// var select = that.select;
				if (that.assemble_list_barcode_val != '') {
					that.axiosData(1);
				}
				/* if(select == 1) {
				  console.log('select == 1')
				  that.axiosData(1);
				  console.log(that.axiosDataArr)
				  for (var j = 0; j <that.axiosDataArr.length; j++ ) {
				    console.log('select == 1',that.axiosDataArr[j].name)
				    if (that.axiosDataArr[j].name == parts_number ) {
				      console.log(that.axiosDataArr[j].name, parts_number)
				      that.axiosAssembleData(that.axiosDataArr[j].id,'','');
				      break;
				    } else {
				      select = 2;
				      console.log('select == 2')
				      that.axiosData(2);
				      console.log(that.axiosDataArr)
				      for (var j = 0; j <that.axiosDataArr.length; j++ ) {
				        console.log('select == 2',that.axiosDataArr[j].name)
				        if (that.axiosDataArr[j].name == parts_number ) {
				          console.log(that.axiosDataArr[j].name, parts_number)
				          that.axiosAssembleData(that.axiosDataArr[j].id,'','');
				          break;
				        } else {
				          break
				        }
				      }
				      break;
				    }
				  }
				}
				if(select == 2) {
				  console.log('select == 2')
				  that.axiosData(2);
				  for (var j = 0; j <that.axiosDataArr.length; j++ ) {
				    console.log('select == 2')
				    if (that.axiosDataArr[j].name == parts_number ) {
				      console.log(that.axiosDataArr[j].name, parts_number)
				      that.axiosAssembleData(that.axiosDataArr[j].id,'','');
				      break;
				    } else {
				      select = 1;
				      break
				    }
				  }
				}

				} */

			},
			axiosData(type) {
				let that = this;
				const url = that.url;
				var token = that.token;
				that.axios.get(url + '/api/v1/assemble/choice', {
					params: {
						type: type
					},
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': token
					}
				}).then(function(response) {
					// console.log(response);
					const data = response.data.data;
					that.axiosDataArr = data;
					// console.log(that.axiosDataArr);
					if (that.assemble_list_barcode_val != '') {
						var aaaaaa = [];
						for (var j = 0; j < that.axiosDataArr.length; j++) {
							// console.log('select == 1',that.axiosDataArr[j].name, aaaaaa, aaaaaa.length)
							if (that.axiosDataArr[j].name == that.assemble_list_barcode_val) {
								// console.log(that.axiosDataArr[j].name, that.assemble_list_barcode_val)
								aaaaaa.push(that.axiosDataArr[j]);
								that.axiosAssembleData(that.axiosDataArr[j].id, '', '');
								break;
							}
						}
						if (aaaaaa.length == 0) {
							that.axiosData(2);
						}
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			axiosAssembleData(product_id, type, status) { //请求模块列表
				let that = this;
				Date.prototype.toLocaleString = function() {
					return this.getFullYear() + "/" + ((this.getMonth() + 1) < 10 ? '0' + (this.getMonth() + 1) : (this.getMonth() +
							1)) + "/" + (this.getDate() < 10 ? '0' + this.getDate() : this.getDate()) + " " + (this.getHours() < 10 ? '0' +
							(this.getHours()) : this.getHours()) + ":" + (this.getMinutes() < 10 ? ('0' + this.getMinutes()) : this.getMinutes()) +
						":" + (this.getSeconds() < 10 ? '0' + this.getSeconds() : this.getSeconds());
				};
				let time = new Date().toLocaleString();
				that.axios.get(that.url + '/api/v1/assemble/list', {
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': that.token
					},
					params: {
						page: that.currentPage,
						size: that.pagesize,
						product_id: product_id,
						type: type,
						status: status
					}
				}).then(function(response) {
					// console.log(response);
					const data = response.data.data.list;
					that.total = response.data.data.count.total;
					// console.log(data,that.total)
					for (var i = 0; i < data.length; i++) {
						that.axiosProgressData(data[i].parts_number, data[i]);
						data[i].statusStr = data[i].status == 1 ? '未装配' : data[i].status == 2 ? '进行中' : '已完成';
						data[i].createTime = new Date(data[i].created_at * 1000).toLocaleString().slice(0, -3);
						data[i].typeStr = data[i].type == 1 ? '手臂' : '关节';
					}
					that.tableData = data;
					that.loading = false;
					if (that.cascaderVal != '') {
						that.cascaderVal = '';
					}

				}).catch(function(error) {
					var auth_timetimer = setTimeout(() => {
						that.loading = false;
						clearTimeout(auth_timetimer);
					}, 1000);
				});
			},
			axiosProgressData(id, thisData) {
				let that = this;
				that.axios.get(that.url + '/api/v1/assemble/detail', {
					params: {
						parts_number: id
					},
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': that.token
					}
				}).then(function(response) {
					// console.log(response);
					const data = response.data.data.arm_steps;
					var okTrueArr = [];
					for (var j = 0; j < data.length; j++) {
						if (data[j].number == data[j].user_count) {
							okTrueArr.push(data[j]);
						}
					}
					// console.log(okTrueArr);
					thisData.progressStatus = parseInt((okTrueArr.length / data.length) * 100);
					thisData.progressStatusLength = okTrueArr.length;
					thisData.progressStatusdataLength = data.length;
					thisData.createTime = thisData.createTime + ' ';
					// console.log(that.tableData)
				}).catch(function(error) {
					console.log(error);
				});
			},
		},
		created() {
			let that = this;
			
			that.$store.state.ifThisPage = false;

			that.axiosAssembleData();
			// window.setInterval(that.axiosAssembleData, 20000);  //每隔20秒重新获取一次新数据
		},

	}
</script>

<style scoped>
	.el-pagination {
		padding: 15px;
		text-align: right;
	}

	.divcard {
		margin: 10px;
		-webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
		/* border: 1px solid rgb(235, 238, 245); */
		background-color: #FFF;
		color: rgb(48, 49, 51);
		-webkit-transition: .3s;
		transition: .3s;
		border-radius: 10px;
		-moz-border-radius: 10px;
		-webkit-border-radius: 10px;
		overflow: hidden;
	}

	.divcard .clearfix {
		height: 25px;
	}

	.divcard .el-progress {
		z-index: 10;
		margin: 0 0.25rem;
		top: 7px;
	}

	.success_row {
		background-color: #67C23A6e !important;
		box-shadow: 0 2px 12px 0 rgba(103, 194, 58, 0.23);
	}

	.primary_row {
		/* background-color: #409EFF6e!important; */
		background-color: rgba(24, 144, 255, 0.30196078431372547) !important;
		box-shadow: 0 2px 12px 0 rgba(64, 158, 255, 0.23);
	}

	.info_row {
		/* background-color: #9093996e!important; */
		background-color: #FFF6e0 !important;
	}

	.el-dialog__body {
		padding: 10px 20px;
	}

	.el-tag {
		position: relative;
		right: 5px;
		top: 5px;
		/* width: 70px; */
		float: right;
		z-index: 9;
		/* transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -webkit-transform: rotate(45deg); */
		text-align: center;
		background-color: transparent;
		border: none;
		font-size: 15px;
	}

	.demo-table-expand {
		font-size: 0;
	}

	.demo-table-expand label {
		width: 90px;
		color: #99a9bf;
	}

	.demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 220px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.el-form-item {
		margin-bottom: 0;
		margin-top: 6px;
	}

	.nullTableData {
		width: 100%;
		height: 197px;
		text-align: center;
		line-height: 200px;
		font-size: 23px;
		color: #bdbdbd;
	}

	/*  */
	
</style>
