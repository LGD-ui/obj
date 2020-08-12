<template>
	<!-- 生产计划首页 -->
	<div class="Prodpage">
		<div class="search">
			<div class="demo-input-suffix">
				<div>
					<el-input suffix-icon="el-icon-search" style="width: 30.625rem;" v-model.trim="search_name"
						autofocus placeholder="搜索名称" @input="searchChange" @keyup.enter.native="searchChange">
						<el-button slot="append" type="primary" @click="searchChange">搜索</el-button>
					</el-input>
					<el-button style="margin-left: 10px;" type="info" plain @click="clearSearchChange">全部</el-button>
				</div>
				<!-- <div class="sorting">
					<el-button @click="downAll"><Icon type="md-cloud-download" /> 导出</el-button>
				</div> -->
			</div>
		</div>
		
		<el-table :data="tableData.tableList" :header-cell-style="tableheader" v-loading="tableData.loading " element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(0, 0, 0, 0.5)" >
			<el-table-column label="编号" min-width="60">
				<template slot-scope="scope">
					<span>{{ scope.row.product_id || '-- --' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="名称">
				<template slot-scope="scope">
					<span>{{ scope.row.name || '-- --' }}</span>
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
			<!-- <el-table-column label="工序名称">
				<template slot-scope="scope">
					<span>{{ scope.row.procedure_name || '' }}</span>
				</template>
			</el-table-column> -->
			<!-- <el-table-column label="工序">
				<template slot-scope="scope">
					<span>{{ scope.row.procedure_detail_number || '' }}</span>
				</template>
			</el-table-column> -->
			<!-- <el-table-column label="批次">
				<template slot-scope="scope">
					<span>{{ scope.row.batch || '' }}</span>
				</template>
			</el-table-column> -->
			<el-table-column label="数量">
				<template slot-scope="scope">
					<span>{{ scope.row.number || '' }}</span>
				</template>
			</el-table-column>
			<!-- <el-table-column label="条码下载" align="center">
				<template slot-scope="scope">
					<el-link :underline="false" type="primary" v-if="scope.row.product_type == 2" @click="downCode(scope.row.id, 1)">图</el-link>
					<el-link :underline="false" type="primary" v-if="scope.row.product_type == 2" style="margin-left: 10px;" @click="downCode(scope.row.id, 2)">码</el-link>
	                <span  v-if="scope.row.product_type == 1" ></span>
				</template>
			</el-table-column> -->
			<!-- <el-table-column label="生产日期">
				<template slot-scope="scope">
					<span>{{ scope.row.created_at | formatDate }}</span>
				</template>
			</el-table-column> -->
			<!-- <el-table-column label="状态" align="center" width="80px"
				:filters="[
					{ text: '未开始', value: 1 }, { text: '生产中', value: 2 },
					{ text: '已完成', value: 3 }, { text: '已配送', value: 4 }
				]" :filter-method="filterTag">
				<template slot-scope="scope">
					<el-link :underline="false" size="mini" type="danger" v-if="scope.row.status == 1">未开始</el-link>
					<el-link :underline="false" size="mini" type="warning" v-if="scope.row.status == 2">生产中</el-link>
					<el-link :underline="false" size="mini" type="" v-if="scope.row.status == 3">已完成</el-link>
					<el-link :underline="false" size="mini" type="success" v-if="scope.row.status == 4">已配送</el-link>
				</template>
			</el-table-column> -->
			
			<el-table-column label="操作">
				<template slot-scope="scope">
					<!-- <el-link :underline="false" type="success" size="mini" style="width: 80px;" v-if="scope.row.status == 4">已发货</el-link> -->
					<!-- <el-link :underline="false" :type="scope.row.status == 3 ? '' : 'info'" size="mini" style="width: 80px;" v-else :disabled="scope.row.status == 3 ? false : true" @click="delivergoods(scope.row)">发货</el-link> -->
					<el-link :underline="false" type="primary" @click="prodclickdetail(scope.row)" >详情</el-link>
					<el-link :underline="false" type="primary" :disabled="scope.row.is_upload != 1" @click="Upfile(scope.row)" style="margin-left: 10px;">报告</el-link>
					<el-link :underline="false" type="primary" :disabled="scope.row.is_send == 2" @click="bulkshipment(scope.row)" style="margin-left: 10px;" >发货</el-link>
				</template>
			</el-table-column>
			<!--  -->
			<!--  -->
			
						
		</el-table>
		
		<div class="block">
			<el-pagination
				@current-change="handleCurrentChange" 
				layout="prev, pager, next, jumper"
	            :page-size="tableData.pageSize"
				:total="tableData.total">
			</el-pagination>
	        <!-- <div class="downodebtn" v-if="codeBtnshow">
	            <el-button type="primary" size="mini" @click="allDownCode(1)">批量下载图</el-button>
	            <el-button type="primary" size="mini" @click="allDownCode(2)">批量下载码</el-button>
	        </div> -->
		</div>
		
	    <!-- 批量上传附件 -->
		<Upfiledialog v-bind:UpfileDialogVisible="UpfileDialogVisible" @change="UpfileClose"></Upfiledialog>
		<!-- 批量发货 -->
		<Bulkship ref="bulkship" v-bind:BulkshipdialogVisible="BulkshipDialogVisible" @change="BulkshipClose"></Bulkship>
		
	</div>
	
</template>

<script>
	import { mapState, mapGetters } from "vuex"
	import moment from 'moment'
    import Upfiledialog from './dialog/Upfiledialog.vue'
	import Bulkship from './dialog/Bulkshipment.vue'
	export default {
		name: "Prodpage",
		components: {Upfiledialog, Bulkship},
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
				BulkshipDialogVisible: {
					dialog: false,
					obj: {},
				},
                allCode: [],
                codeBtnshow: false,
				showbtnbtn: true,
			}
		},
		created() {
			this.getProdpage();
		},
		methods: {
			/* 列表 */
			getProdpage() {
				let that = this;
				that.axios({
					method: 'GET',
					url: that.url + '/api/v1/supplier/task-product',
					data: '',
					params: {
						page: that.tableData.currentPage,
						size: that.tableData.pageSize,
						name: that.search_name
					},
					headers: {
						"content-type": "application/json",
						"token": that.token
					}
				}).then( response => {
					if (response && response.data && response.data.data && response.data.code == 200) {
						var data = response.data.data.list;
						that.tableData.total = response.data.data.count.total;
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
				this.getProdpage();
			},
			/* 分页 */
			handleCurrentChange(currentPage) {
				this.tableData.currentPage = currentPage;
				this.getProdpage();
			},
			/* clear搜索value */
			clearSearchChange() {
				this.search_name = '';
				this.tableData.currentPage = 1;
				this.getProdpage();
			},
            Upfile(row) {
				row.t = 1;
				row.u = 1;
				row.product_name = row.name;
                this.UpfileDialogVisible.dialog = true;
                this.UpfileDialogVisible.obj = row;
            },
			/* 涂文下载条码 */
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
			
			
			// 查看计划详情
			prodclickdetail(row) {
				if (row.product_id) {
					this.$router.push({
						path: '/production',
						query: {
							product_id: row.product_id
						}
					})
				}
			},
			// 批量发货
			bulkshipment(row) {
				this.BulkshipDialogVisible.obj = row;
				this.$refs.bulkship.getbulkshiplist();
				this.$refs.bulkship.getexpress_type();
				this.$refs.bulkship.getworklist();
				this.BulkshipDialogVisible.dialog = true;
			},
			// 关闭批量发货
			BulkshipClose(param) {
				this.BulkshipDialogVisible.dialog = param;
				this.getProdpage();
			},
			
			
            UpfileClose(param) {
                this.UpfileDialogVisible.dialog = param;
				this.getProdpage();
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
	.Prodpage {
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