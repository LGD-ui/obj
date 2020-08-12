<template>
	<el-container>
		<el-container>
			<el-main style="padding: 10px;">
				<Head/>
				<div class="CreateModular">
					<!--  -->
					<p style="padding:0 0 5px;">
						<el-form :inline="true" class="demo-form-inline">
							<el-form-item style="padding-left: 10px;">
								<div class="detailwrap">
									<el-input suffix-icon="el-icon-full-screen" v-model.trim="assemble_list_barcode_val"
									 autofocus placeholder="搜索" @input="assemble_list_barcode">
										<el-button slot="append" type="primary" @click="filterReset">清除</el-button>
									</el-input>
								</div>
							</el-form-item>
							<!-- <el-form-item><el-button type="primary" @click="filterReset">清除</el-button></el-form-item> -->
							<el-form-item style="float: right;">
								<el-button class="modular_btn modular_btn1" type="primary" @click="addtaskclick">
									<Icon type="md-add" />新建任务</el-button>
							</el-form-item>
							<el-form-item style="float: right;">
								<el-button class="modular_btn modular_btn1" type="primary" @click="downloadbarcode">
									<Icon type="md-cloud-download" />下载条码</el-button>
							</el-form-item>
							<!-- <el-form-item style="float: right;">
								<el-button class="modular_btn modular_btn1" type="info" @click="axiosAssembleData();assemble_list_barcode_val=''">全部任务</el-button>
							</el-form-item> -->
							<!-- <el-form-item style="float: right;">
								<el-button class="modular_btn modular_btn2" size="mini" type="info" plain @click="axiosAssembleData('',1,'');assemble_list_barcode_val=''">手 臂</el-button>
							</el-form-item>
							<el-form-item style="float: right;">
								<el-button class="modular_btn modular_btn2" size="mini" type="info" plain @click="axiosAssembleData('',2,'');assemble_list_barcode_val=''">关 节</el-button>
							</el-form-item> -->
							<!-- <el-form-item style="float: right;">
								<el-link class="modular_btn3" :underline="false" @click="axiosAssembleData('','',3);assemble_list_barcode_val=''">已完成</el-link>
							</el-form-item>
							<el-form-item style="float: right;">
								<el-link class="modular_btn3" :underline="false" @click="axiosAssembleData('','',2);assemble_list_barcode_val=''">进行中</el-link>
							</el-form-item>
							<el-form-item style="float: right;">
								<el-link class="modular_btn3" :underline="false" @click="axiosAssembleData('','',1);assemble_list_barcode_val=''">未装配</el-link>
							</el-form-item> -->
							<el-form-item style="float: right;">
								<el-select v-model="task" :value-key="task" placeholder="全部任务" class="taskList" @change="changetask">
									<el-option label="未装配" value="1"></el-option>
									<el-option label="进行中" value="2"></el-option>
									<el-option label="已完成" value="3"></el-option>
									<el-option label="全部任务" value="0"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item style="float: right;">
								<el-select v-model="wrenchname" :value-key="wrenchname" filterable placeholder="扳手列表" class="wrenchs" @change="selectChange">
									<el-option v-for="item in wrenchArr" :key="item.id" :label="item.name" :value="item.ip"></el-option>
								</el-select>
							</el-form-item>
						</el-form>
					</p>
					<el-row v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
					 element-loading-background="rgba(0, 0, 0, 0.5)">
						<!-- <el-row v-if="filterArr.length==0"> -->
						<el-col class="modular_box" style="" v-for="(tab, index) in tableData" :key="index">
				
							<div class="divcard" :style="{ padding: '0px','line-height': '2' }" :class="tab.status == 1 ? 'info_row' : tab.status == 2 ? 'primary_row' : tab.status == 3 ? 'success_row' : ''"
							 @click="handleCurrentChange(tab)">
								<!-- <el-progress :show-text="false" :percentage="tab.progressStatus" style="z-index: 10;margin: 0 0.25rem;" :color="customColorMethod"></el-progress> -->
								<!-- <el-tag>{{tab.progressStatusLength}}/{{tab.progressStatusdataLength}}</el-tag> -->
								<div style="padding: 10px;">
									<div class="bottom clearfix">
										<span class="form-item__label">人员：</span>
										<span>{{tab.user_name}}</span>
									</div>
									<div class="bottom clearfix">
										<span class="form-item__label">名称：</span>
										<span>{{tab.name}}</span>
									</div>
									<div class="bottom clearfix">
										<span class="form-item__label">条码：</span>
										<span>{{tab.parts_number}}</span>
									</div>
									<!-- <div class="bottom clearfix">
										<span class="form-item__label">类型：</span>
										<span>{{tab.typeStr}}</span>
									</div> -->
									<div class="bottom clearfix">
										<span class="form-item__label">时间：</span>
										<time class="time">{{tab.createTime}}</time>
									</div>
									<div class="bottom clearfix" style="border-top: 0.0625rem solid #E8E8E8;margin: 3px 0;height: 20px;">
										<el-progress :percentage="tab.progressStatus" :color="customColorMethod"></el-progress>
									</div>
								</div>
							</div>
						</el-col>
						<el-col class="nullTableData" v-if="tableData.length==0">暂无任务</el-col>
					</el-row>
					<div class="block">
						<el-pagination 
							v-if="total>0" 
							background 
							@size-change="handleSizeChange" 
							@current-change="handleCurrentChange_" 
							:current-page="currentPage"
							:page-sizes="pagesizeArr" 
							:page-size="pagesize" 
							layout="total, sizes, prev, pager, next, jumper" 
							:total="total">
						</el-pagination>
						<el-button type="primary" size="small" @click="changeparstlist">零件列表</el-button>
						<el-button v-if="total>0" type="primary" size="small" @click="changedelivery">入 库</el-button>
					</div>
					
					<!-- 添加任务 -->
					<addtask ref="taskchild" v-bind:addtaskdialogVisible="addtaskdialogVisible" @change="addtaskClose" />
					<!-- 下载条码 -->
					<downcode ref="downchild" v-bind:downcodedialogVisible="downcodedialogVisible" @change="downloadClose" />
					<!-- 发货 -->
					<delivery ref="deliverychild" v-bind:deliverydialogVisible="deliverydialogVisible" @change="deliveryClose" />
					<!-- 零件列表 -->
					<parstlist ref="parstlistchild" v-bind:parstlistdialogVisible="parstlistdialogVisible" @change="parstlistClose" />
					
					
				</div>
			</el-main>
		</el-container>
	</el-container>
	
</template>

<script>
	import { mapActions, mapState, mapGetters } from "vuex"
	import Head from '@/components/Head.vue'
	import Qs from 'qs'
	import addtask from "./dialog/addtask.vue"
	import downcode from "./dialog/downloadcode.vue"
	import delivery from "./dialog/delivery.vue"
	import parstlist from "./dialog/partslist.vue"
	export default {
		name: 'CreateModular',
		components: { Head, addtask, downcode, delivery, parstlist },
		data() {
			return {
				wrenchArr: [],
				wrenchname: '',
				task: '0',
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
				pagesize: 40,
				pagesizeArr: [40, 80, 120],
				dialogFormVisible: false,
				dialogFormVisible__: false,
				axiosDataArr: [],
				radioType: 1,
				radioObj: {},
				
				/*  */
				// 添加任务
				addtaskdialogVisible: {
					dialog: false,
					obj: {}
				},
				// 下载条码
				downcodedialogVisible: {
					dialog: false,
					obj: {}
				},
				// 发货
				deliverydialogVisible: {
					dialog: false,
					obj: {}
				},
				// 零件列表
				parstlistdialogVisible: {
					dialog: false,
				},

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
		created() {
			this.$store.state.ifThisPage = false;
			if (sessionStorage.getItem("IP")) {
				this.wrenchname = sessionStorage.getItem("IP");
			}
			this.axiosAssembleData(); //任务列表
			this.getwrenchList();//扳手列表
			/* if (this.$route.path == '/createmodular') {
				window.setInterval(that.axiosAssembleData, 60000);  //每隔60秒重新获取一次新数据
			} */
			
			
		},
		methods: {
			/*  */
			//打开任务添加
			addtaskclick() {
				this.addtaskdialogVisible.dialog = true;
				this.assemble_list_barcode_val='';
				this.$refs.taskchild.getassemblechoice();
			},
			//添加任务关闭
			addtaskClose(params) {
				this.addtaskdialogVisible.dialog = params;
				this.axiosAssembleData();
			},
			// 打开条码
			downloadbarcode() {
				this.downcodedialogVisible.dialog = true;
				this.assemble_list_barcode_val='';
				this.$refs.downchild.getassemblechoice();
			},
			// 关闭条码
			downloadClose(params) {
				this.downcodedialogVisible.dialog = params;
			},
			// 打开发货
			changedelivery() {
				this.$refs.deliverychild.getdeliverylist();
				this.deliverydialogVisible.dialog = true;
			},
			// 关闭发货
			deliveryClose(params) {
				this.deliverydialogVisible.dialog = params;
			},
			// 打开零件列表
			changeparstlist() {
				this.$refs.parstlistchild.getparstlist();
				this.parstlistdialogVisible.dialog = true;
			},
			// 关闭零件列表
			parstlistClose(params) {
				this.parstlistdialogVisible.dialog = params;
			},
			//请求模块列表
			axiosAssembleData(module_id, type, status) { 
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
						module_id: module_id,
						type: type,
						status: status
					}
				}).then(function(response) {
					// console.log(response);
					if (response && response.data && response.data.code == 200) {
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
					}
				}).catch(function(error) {
					var auth_timetimer = setTimeout(() => {
						that.loading = false;
						clearTimeout(auth_timetimer);
					}, 1000);
					
					that.$message({
						message: that.errmessage(error.response.data),
						type: 'warning'
					});
				});
			},
			handleSizeChange(val) {
				// console.log(`每页 ${val} 条`);
				this.currentPage = 1;
				this.pagesize = val;
				this.axiosAssembleData()
			},
			handleCurrentChange_(val) {
				// console.log(`当前页: ${val}`);
				this.currentPage = val;
				this.loading = true;
				this.axiosAssembleData()
			},
			axiosProgressData(parts_number, thisData) {
				let that = this;
				that.axios.get(that.url + '/api/v1/assemble/detail', {
					params: { parts_number },
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': that.token
					}
				}).then(function(response) {
					if (response && response.data && response.data.code == 200) {
						let data = response.data.data;
						let okTrueArr = [];
						data.map(item => {
							// item.status == 2 || item.status == 3
							if (item.status == 3) {
								okTrueArr.push(item);
							}
						})
						thisData.progressStatus = parseInt((okTrueArr.length / data.length) * 100);
						thisData.progressStatusLength = okTrueArr.length;
						thisData.progressStatusdataLength = data.length;
						thisData.createTime = thisData.createTime + ' ';
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			/*  */
			
			// 任务下拉菜单
			changetask(value) {
				this.currentPage = 1;
				if (value == '0') this.axiosAssembleData();
				if (value == '1') this.axiosAssembleData('','',1);
				if (value == '2') this.axiosAssembleData('','',2);
				if (value == '3') this.axiosAssembleData('','',3);
				this.assemble_list_barcode_val='';
			},
			//保存扳手
			selectChange(value) {
				sessionStorage.setItem("IP", this.wrenchname)
			},
			// 获取扳手列表
			getwrenchList() {
				var that = this;
				var url = that.url;
				var token = that.token;
				that.axios({
					method: 'GET',
					url: url + '/api/v1/assemble/wrench-list',
					headers: {
						"content-type": "application/json",
						'token': token
					}
				}).then(function(response) {
					if (response && response.data && response.data.data && response.data.code == 200) {
						var data = response.data.data.list;
						that.wrenchArr = data;
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			// 任务点击
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
							type: val.type,
							status: val.status
						}
					})
				}

			},
			// 任务进度条
			customColorMethod(percentage) {
				if (percentage < 100) {
					return '#ff7d02';
				} else {
					return '#16a23c';
				}
			},
			
			// 清除搜索框内容
			filterReset() {
				if (this.assemble_list_barcode_val != '') {
					this.assemble_list_barcode_val = '';
					this.axiosAssembleData()
				}
			},
			// 选择下载零件条码
			changeChildRadio(label) {
				// console.log(label);
				this.assembleExportProduct_id = label.id;
				this.radioObj = label;
			},
			
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
			
		},
		

	}
</script>

<style lang="less" scoped>
	.CreateModular {
		padding-bottom: 60px;
		.modular_box {
			width: calc(100% / 8);
			min-width: 200px;
		}
	}
	.el-pagination {
		padding: 15px;
		text-align: right;
	}

	.divcard {
		margin: 5px;
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
		top: 7px;
	}
	.divcard /deep/.el-progress .el-progress__text {
		margin-left: 15px;
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
	.detailwrap .el-input-group {
		width: 30rem;
	}
	.block {
		text-align: right;
		padding-right: 10px;
		background: #fff;
		position: fixed;
		left: 10px;
		right: 10px;
		bottom: 0px;
		z-index: 999;
	    .el-pagination {
	        display: inline-block;
	        margin-right: 20px;
	        vertical-align: middle;
	    }
		> .el-button {
			padding: 9px 30px;
		}
	}
	
	/*  */
	
</style>
