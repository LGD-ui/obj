<template>
	<!-- 托盘列表 -->
	<div class="List">
		<div class="input_flex">
			<div class="fl"></div>
			<div class="demo-input-suffix">
				<el-button type="primary" size="mini" @click="scan_out">导出</el-button>
			</div>
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
			<el-table-column label="托盘条码" prop="parts_number">
				<template slot-scope="scope">
					<span style="">{{ scope.row.parts_number }}</span>
				</template>
			</el-table-column>
			<el-table-column label="托盘状态" prop="is_use">
				<template slot-scope="scope">
					<el-link :underline="false" :type="scope.row.is_use === 2 ? 'success' : scope.row.is_use === 3 ? 'info' : scope.row.is_use === 4 ?'danger':'info'"
					 close-transition>
						{{scope.row.is_use_}}
					</el-link>
				</template>
			</el-table-column>
			<el-table-column label="操作" prop="parts_number">
				<template slot-scope="scope">
					<el-button type="text"  v-if="scope.row.is_use==1" @click="getTotray(scope.row.parts_number)">装盘</el-button>
					<el-button type="text"  v-if="scope.row.is_use>=2" @click="showtraylist(scope.row)" >查看</el-button>
					<el-button type="text"  v-if="scope.row.is_use>=2" @click="exportcode(scope.row)">导出</el-button>
					<el-button type="text"  v-if="scope.row.is_use==4" @click="handleEdit(scope.$index, scope.row)">清空</el-button>
				</template>
			</el-table-column>
			<!-- <el-table-column label="导出条码" prop="parts_number">
				<template slot-scope="scope">
					
				</template>
			</el-table-column> -->
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pagesize" layout="prev, pager, next, jumper"
			 :total="total">
			</el-pagination>
		</div>
		
		<Traylist ref="child" v-bind:traylistDV="traylistDV" @change="traylistClose" ></Traylist>
		
		
	</div>

</template>

<script>
	import { mapGetters } from "vuex"
	import Traylist from './dialog/traylist.vue'
	export default {
		name: 'List',
		components: {
			Traylist
		},
		data() {
			return {
				search: '',
				search_id: '',
				search_item: '',
				search_specs: '',
				go_num: '',
				pagesize: 15,
				currpage: 1,
				list: [],
				tableData: [],
				total: 0,
				id_: '',
				status_: '',
				traylistDV: {
				    dialog: false,
				    obj: '',
				},
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
		methods: {
			jump() {
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
				}).then(function(res) {
					var data = res.data.data.list;
					for (var i = 0; i < data.length; i++) {
						data[i].is_use_ = data[i].is_use == 1 ? '空盘' : data[i].is_use == 2 ? '装盘中' : data[i].is_use == 3 ?
							'满盘' : '装配中';
					}
					that.total = res.data.data.count.total;
					that.tableData = res.data.data.list;
				}).catch(function(error) {
					console.log(error)
					that.$message({
						message: that.errmessage(error.response.data),
						type: 'warning'
					});
				});
			},

			
			// 查看当前盘零件信息
			showtraylist(row) {
				this.traylistDV.dialog = true;
				this.traylistDV.obj = row;
				this.$refs.child.getSingle();
			},
			// 清空  改变当前盘状态
			handleEdit(value, row) {
				var that = this;
				that.$alert('确认修改状态', '修改状态', {
					confirmButtonText: '确定',
					callback: action => {
						that.reference(row.id, 1);
					}
				});
			},
			// 修改状态
			reference(id, status) {
				let that = this;
				var listname = that.search_name || localStorage.getItem('lossname_');
				that.axios.get(that.url + '/api/v1/tray/status', {
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						"token": that.token
					},
					params: {
						id, status
					}
				}).then(function(res) {
					if (data.status == 200) {
						that.jump();
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			
			
			// 导出全部盘条码
			scan_out() {
				location.href = this.url + "/api/v1/tray/export";
			},
			// 装盘
			getTotray(parts_number) {
				localStorage.setItem("index", "2-1");
				this.$router.push({
					path: '/tray_enter',
					query: {
						parts_number: parts_number
					}
				})
			},
			// 导出条码
			exportcode(row) {
				location.href = this.url + "/api/v1/tray/full-export?id=" + row.id + '&status=' + row.is_use;
			},
			
			
			
			// 关闭弹窗
			traylistClose(param) {
				this.traylistDV.dialog = param;
			},
			// 表头样式
			tableheader({ row, column, rowIndex, columnIndex }) {
				if (rowIndex === 0) {
					return 'height:48px;background:#e5e5e5'
				}
			},
			handleSizeChange(psize) {
				this.pagesize = psize;
			},
			handleCurrentChange(cpage) {
				this.currpage = cpage;
				this.jump(cpage);
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
