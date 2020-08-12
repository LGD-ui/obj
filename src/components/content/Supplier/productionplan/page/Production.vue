<template>
	<!-- 生产计划详情页 -->
	<div class="Production">
		<!-- <div class="search">
			<div class="demo-input-suffix">
				<div>
					<el-input suffix-icon="el-icon-search" style="width: 30.625rem;" v-model.trim="search_name"
						autofocus placeholder="搜索名称/规格/代号" @input="searchChange" @keyup.enter.native="searchChange">
						<el-button slot="append" type="primary" @click="searchChange">搜索</el-button>
					</el-input>
					<el-button style="margin-left: 10px;" type="info" plain @click="clearSearchChange">全部</el-button>
				</div>
				<div class="sorting">
					<el-button @click="downAll"><Icon type="md-cloud-download" /> 导出</el-button>
				</div>
			</div>
		</div> -->
		
		<el-table :data="tableData.tableList" :header-cell-style="tableheader" v-loading="tableData.loading " element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(0, 0, 0, 0.5)" @selection-change="handleSelectionChange" >
			<el-table-column type="selection"  width="55" align="center"></el-table-column>
			<el-table-column label="计划编号" min-width="60">
				<template slot-scope="scope">
					<span>{{ scope.row.id || '-- --' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="名称">
				<template slot-scope="scope">
					<!-- <span></span> -->
					<el-popover placement="right-start" width="400" trigger="click">
						<el-table :data="scope.row.parts_list" height="300" size="mini">
							<el-table-column label="名称" property="product_name"></el-table-column>
							<el-table-column label="条码" property="parts_number" width="90"></el-table-column>
							<el-table-column label="数量" property="number" width="70"></el-table-column>
						</el-table>
						<el-link :underline="false" slot="reference">{{ scope.row.product_name || '-- --' }}</el-link>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column label="代号">
				<template slot-scope="scope">
					<span>{{ scope.row.item || '-- --' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="型号规格">
				<template slot-scope="scope">
					<span>{{ scope.row.specs || '-- --' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="工序名称">
				<template slot-scope="scope">
					<span>{{ scope.row.procedure_name || '-- --' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="工序" width="80">
				<template slot-scope="scope">
					<span>{{ scope.row.procedure_detail_number || '-- --' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="批次" width="80">
				<template slot-scope="scope">
					<span>{{ scope.row.batch || '-- --' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="数量" width="80">
				<template slot-scope="scope">
					<span>{{ scope.row.number || '-- --' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="生产日期" width="130">
				<template slot-scope="scope">
					<span>{{ scope.row.created_at | formatDate }}</span>
				</template>
			</el-table-column>
			<el-table-column label="状态" align="center" width="80px">
				<template slot-scope="scope">
					<el-link :underline="false" type="danger" v-if="scope.row.status == 1">未开始</el-link>
					<el-link :underline="false" type="warning" v-if="scope.row.status == 2">生产中</el-link>
					<el-link :underline="false" type="" v-if="scope.row.status == 3">已完成</el-link>
					<el-link :underline="false" type="success" v-if="scope.row.status == 4">已配送</el-link>
				</template>
			</el-table-column>
			<el-table-column label="质检报告" width="200px" align="center">
				<template slot-scope="scope">
					<el-link :underline="false" type="primary" :disabled="scope.row.status >= 3 ? true : false" v-if="scope.row.status < 3" @click="Upfile(scope.row)">上传</el-link>
					<el-link :underline="false" type="primary" v-else @click="Upfile(scope.row)">查看</el-link>
				</template>
				<!-- <template slot-scope="scope">
					<el-link :underline="false" type="primary" :disabled="scope.row.status >= 3 ? true : false" v-if="scope.row.status < 3" @click="Upfile(scope.row)">报告</el-link>
					<el-popover v-if="scope.row.status == 3" placement="left" title="" trigger="click">
						<embed width="500" height="600" v-if="scope.row.tag&&scope.row.tag.slice(-3) == 'pdf'" :src="scope.row.tag"> </embed>
						<img src="" v-else style="height: 400px;">
						<el-link :underline="false" type="primary" slot="reference" @click="showfile(scope.row, scope)" >查看</el-link>
					</el-popover>
					<el-link :underline="false" type="info" v-if="scope.row.status == 3" @click="deletfile(scope.row)">
						<i class="el-icon-error" style="margin-left: 5px;"></i>
					</el-link>
				</template> -->
			</el-table-column>
			<el-table-column label="操作" width="130px">
				<template slot-scope="scope">
					<el-link :underline="false" type="primary" v-if="scope.row.product_type == 2"  @click="downCode(scope.row.id, 1)">图</el-link>
					<el-link :underline="false" type="primary" v-if="scope.row.product_type == 2" style="margin: 0 10px;" @click="downCode(scope.row.id, 2)">码</el-link>
					<el-link :underline="false" type="success" v-if="scope.row.status == 4">已发货</el-link>
					<el-link :underline="false" :type="scope.row.status == 3 ? '' : 'info'" v-else :disabled="scope.row.status == 3 ? false : true" @click="delivergoods(scope.row)">发货</el-link>
				</template>
			</el-table-column>
			<!--  -->
			<!--  -->
			
						
		</el-table>
		
		<div class="block">
			<el-pagination 
				v-if="tableData.total>15" 
				@current-change="handleCurrentChange" 
				layout="prev, pager, next, jumper"
	            :page-size="tableData.pageSize"
				:total="tableData.total">
			</el-pagination>
	        <div class="downodebtn" v-if="codeBtnshow">
	            <el-button type="primary" size="mini" @click="allDownCode(1)">批量下载图</el-button>
	            <el-button type="primary" size="mini" @click="allDownCode(2)">批量下载码</el-button>
	        </div>
		</div>
		
	    <!-- 批量 -->
		<Upfiledialog ref="upfile" v-bind:UpfileDialogVisible="UpfileDialogVisible" @change="UpfileClose"></Upfiledialog>
		<!-- 发货 -->
		<Deliverdialog ref="deliver" v-bind:DeliverdialogVisible="DeliverdialogVisible" @change="DeliverClose"></Deliverdialog>
		
	</div>
	
</template>

<script>
	import { mapState, mapGetters } from "vuex"
	import moment from 'moment'
    import Deliverdialog from '../dialog/Deliverdialog.vue'
    import Upfiledialog from '../dialog/Upfiledialog.vue'
	export default {
		name: "Production",
		components: {Upfiledialog, Deliverdialog},
		computed: {
			...mapState({
				url: state => state.url,
			}),
			...mapGetters({
				token: "getToken"
			})
		},
		filters: {
			formatDate(val) {
				return moment( val * 1000 ).format("YYYY/MM/DD");
			}
		},
		data() {
			return {
				product_id: '',
				search_name: '',
				tableData: {
					loading: true,
					tableList: [], //10
					currentPage: 1,
					pageSize: 15,
					total: 0,
                },
                UpfileDialogVisible: {
                    dialog: false,
					obj: {},
                },
				DeliverdialogVisible: {
					dialog: false,
					obj: {},
				},
                allCode: [],
                codeBtnshow: false,
				showbtnbtn: true,
			}
		},
		created() {
			this.product_id = this.$route.query.product_id;
			this.getProduction();
		},
		methods: {
			/* 列表 */
			getProduction() {
				let that = this;
				that.axios({
					method: 'GET',
					url: that.url + '/api/v1/supplier/task-list',
					data: '',
					params: {
						page: that.tableData.currentPage,
						size: that.tableData.pageSize,
						product_id: that.product_id
					},
					headers: {
						"content-type": "application/json",
						"token": that.token
					}
				}).then( response => {
					if (response && response.data && response.data.data && response.data.code == 200) {
						var data = response.data.data.list;
						that.tableData.total = response.data.data.count.total;
						data.map(item => {
							if (item.parts_list.length) {
								item.parts_list.map(ite => {
									ite.product_name = item.product_name;
									return ite;
								})
							}
							item.tag = '';
							return item;
						})
						that.tableData.tableList = data;
						that.tableData.loading = false;
					}
				}).catch( error => {
					console.log(error)
					that.tableData.loading = false;
				});
			},
			
			filterTag(value, row) {
				return row.status === value;
			},
			/* 搜索 */
			searchChange() {
				this.tableData.currentPage = 1;
				if (!this.search_name) this.search_name = '';
				this.getProduction();
			},
			/* 分页 */
			handleCurrentChange(currentPage) {
				this.tableData.currentPage = currentPage;
				this.getProduction();
			},
			/* clear搜索value */
			clearSearchChange() {
				this.search_name = '';
				this.tableData.currentPage = 1;
				this.getProduction();
			},
			// 上传附件
            Upfile(row) {
				row.t = 2;
				row.u = 2;
				this.UpfileDialogVisible.obj = row;
				this.$refs.upfile.getSingle(row.id);
                this.UpfileDialogVisible.dialog = true;
			},
			// 查看附件   废弃
			showfile(row, rows) {
				let that = this;
				that.axios({
					method: 'POST',
					url: that.url + '/api/v1/supplier/task-preview',
					data: {
						parts_id: []
					},
					params: {
						type: 2,
						task_id: row.id,
						handle_type: 1
					},
					headers: {
						"content-type": "application/json",
						"token": that.token
					}
				}).then( response => {
					if (response && response.data && response.data.code == 200) {
						console.log(response.data)
						// that.tableData.tableList[rows.$index].tag = 'http://zrui.e7vr.com/arm/4/2020/07/16/73ddde8efa2fb4e03bc9aa7d97094c57.pdf';
					}
				}).catch( error => {
					console.log(error)
				});
			},
			// 删除附件  废弃
			deletfile(row) {
				let that = this;
				const h = this.$createElement;
				that.$msgbox({
				    title: '提示-删除附件',
				    message: h('p', null, [
				        h('span', null, '确认要删除编号'),
						h('span', { style: 'color: teal' }, row.id),
						h('span', null, '名称'),
				        h('span', { style: 'color: teal' }, row.product_name),
						h('span', null, '的附件')
				    ]),
				    showClose: false,
				    showCancelButton: true,
				    confirmButtonText: '确定',
				    cancelButtonText: '取消',
				    beforeClose: (action, instance, done) => {
				        if (action === 'confirm') {
				            instance.confirmButtonLoading = true;
				            instance.confirmButtonText = '删除中...';
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
				    /* that.axios({
				    	method: 'POST',
				    	url: that.url + '/api/v1/supplier/task-previewy',
				    	params: {
				    		type: 2,
				    		task_id: row.id,
				    		parts_id: row.product_id,
				    		handle_type: 2
				    	},
				    	headers: {
				    		"content-type": "application/json",
				    		"token": that.token
				    	}
				    }).then( response => {
				    	if (response && response.data && response.data.code == 200) {
				    		that.$message({
				    		    showClose: true,
				    		    message: '操作成功',
				    		    type: 'success'
				    		})
							that.getProduction();
				    	}
				    }).catch( error => {
				    	console.log(error)
				    }); */
				    
				});
			},
			/* 下载条码 */
			downCode(task_id, type) {
                let url = this.url;
				if (task_id && type) {
					var codeArr = [];
					location.href = url + '/api/v1/supplier/export?type=' + type + '&task_id[0]=' + task_id;
				} else {
					this.$message({
						type: 'warning',
						message: '导出条码出错',
						offset: 300
					})
				}
				
            },
            // 下载条码开始
            handleSelectionChange(val) {
                if (val.length > 0) {
                    this.codeBtnshow = true;
                    let code = '';
                    val.map((item, index) => {
                        if (item.id) {
                            code += '&task_id['+index+']=' + item.id
                        }
                    })
                    this.allCode = code;
                } else {
                    this.codeBtnshow = false;
                    this.allCode = [];
                }
            },
            allDownCode(type) {
				let url = this.url;
                console.log(this.allCode, type)
				location.href = url + '/api/v1/supplier/export?type=' + type + this.allCode;
            },
			downAll() {
				let supplier_id = sessionStorage.getItem('Supplierid');
				if (supplier_id) {
					location.href = this.url + '/api/v1/supplier/export-task?supplier_id=' + supplier_id + '&name=' + this.search_name;
				} else {
					this.$message({
					    message: '未知供应商，请检查供应商信息',
					    offset: 200
					})
				}
			},
            // 下载条码结束

			/* 发货 */
			delivergoods(row) {
				if (this.showbtnbtn) {
					this.showbtnbtn = false;
					this.DeliverdialogVisible.obj = row;
					this.$refs.deliver.getexpress_type();
					this.$refs.deliver.getworklist();
					this.DeliverdialogVisible.dialog = true;
				}
				
			},
			/* 关闭发货弹窗 */
			DeliverClose(param) {
				this.DeliverdialogVisible.dialog = param;
				this.showbtnbtn = true;
				this.getProduction();
			},
            
            UpfileClose(param) {
                this.UpfileDialogVisible.dialog = param;
				this.getProduction();
            },
			/* 表头样式 */
			tableheader({ row, column, rowIndex, columnIndex }) {
				if (rowIndex === 0) {
					return 'height:50px;background:#e5e5e5'
				}
			},
		},
		
	}
</script>

<style lang="less" scoped>
	.Production {
		background: #FFFFFF;
		padding: 10px;
		.search {
			margin-bottom: 10px;
			> div {
				display: flex;
				justify-content: space-between;
			}
			.sorting {
				display: flex;
				line-height: 40px;
				overflow: hidden;
				font-size: 15px;
				font-weight: 600;
				> div {
					margin: 0 10px;
					cursor: pointer;
				}
			}
		}
		.block {
            .el-pagination, .downodebtn {
                display: inline-block;
                margin-right: 20px;
                vertical-align: middle;
            }
        }
		.el-table {
			margin: 0 0 1rem;
		}
	}
</style>