<template>
	<div>
		<el-dialog :visible.sync="traylistDV.dialog" top="10vh" class="traylist_dialog" :close-on-click-modal="false" @close="close" width="1000px">
			<div class="traylist">
                <!-- <div class="search">
                    <div class="demo-input-suffix">
                        <el-input suffix-icon="el-icon-full-screen" style="width: 30.625rem;" autofocus v-model.trim="search_name"
                            placeholder="入库条码" @input="searchChange" >
                            <el-button slot="append" type="primary" @click="searchChange">搜索</el-button>
                        </el-input>
                    </div>
                </div> -->
				<div class="tratlist_title">
					<div class="title">
						托盘名称：{{traylistDV.obj.name}}
					</div>
					<div class="title">
						装盘状态：{{traylistDV.obj.is_use_}}
					</div>
				</div>
				<el-table 
					ref="traylistTableData" 
					:data="traylistTableData.tableData" 
					height="635" 
					v-loading="traylistTableData.loading"
					element-loading-text="加载中"
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.5)">
					<el-table-column label="零件名称">
						<template slot-scope="scope">
							<span style="">{{ scope.row.product_name || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="图样名称">
						<template slot-scope="scope">
							<span style="">{{ scope.row.product_item || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="型号规格">
						<template slot-scope="scope">
							<span style="">{{ scope.row.product_specs || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="材料">
						<template slot-scope="scope">
							<span style="">{{ scope.row.product_material || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="条码" width="100">
						<template slot-scope="scope">
							<span style="">{{ scope.row.product_parts_number || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="数量" width="60">
						<template slot-scope="scope">
							<span style="">{{ scope.row.number || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="类型" width="80">
					    <template slot-scope="scope">
					        <el-link :underline="false" v-if="scope.row.type == 1">标准件</el-link>
					        <el-link :underline="false" v-if="scope.row.type == 2">加工件</el-link>
					    </template>
					</el-table-column>
					<el-table-column label="状态" width="80">
					    <template slot-scope="scope">
					        <el-link :underline="false" type="primary" v-if="scope.row.status == 0">装盘中</el-link>
					        <el-link :underline="false" type="success" v-if="scope.row.status == 1">已出库</el-link>
							<el-link :underline="false" type="success" v-if="scope.row.status == 2">装配中</el-link>
							<el-link :underline="false" type="success" v-if="scope.row.status == 3">-- --</el-link>
					    </template>
					</el-table-column>
				</el-table>
				<!-- <div class="block">
					<el-pagination
						@current-change="handleCurrentChange" 
						layout="prev, pager, next"
						:page-size="traylistTableData.pageSize"
						:total="traylistTableData.total">
					</el-pagination>
				</div> -->
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { mapState, mapGetters } from "vuex"
	export default {
		name: 'traylist',
		components: {},
		computed: {
			...mapState({
				url: state => state.url,
			}),
			...mapGetters({
				token: "getToken"
			})
		},
		props: {
			traylistDV: '',
		},
		data() {
			return {
                search_name: '',
				lengths: 0,
				traylistTableData: {
					tableData: [], //15
					currentPage: 1,
					pageSize: 15,
					total: 16,
					loading: true
				},
				statusLeng: 0,
				row: {},
				nullImg: 'http://zrui.e7vr.com/image/arm/default.gif',
			}
		},
		methods: {
			getSingle() {
                let that = this;
				let obj = that.traylistDV.obj;
				console.log(obj)
				that.axios({
					method: 'GET',
					url: that.url + '/api/v1/tray/product-detail',
					params: {
						id: obj.id,
						status: obj.is_use
					},
					headers: {
						"content-type": "application/json",
						'token': that.token
					}
				}).then( response => {
					if (response && response.data && response.data.data && response.data.code == 200) {
						var data = response.data.data;
						that.traylistTableData.tableData = data;
						that.traylistTableData.loading = false;
					}
				}).catch( error => {
					console.log(error)
					that.traylistTableData.loading = false;
				});
			},
            clearSearchChange() {
                this.search_name = "";
            },
			/* 分页 */
			handleCurrentChange(currentPage) {
				this.traylistTableData.currentPage = currentPage;
				this.getSingle();
            },
			close() {
				this.statusLeng = 0;
                this.search_name = "";
				this.traylistTableData = {
					tableData: [], //10
					currentPage: 1,
					pageSize: 15,
					total: 0,
					loading: true
				};
                this.$emit("change", false);
			},
			
		},
	}
</script>

<style lang="less" scoped>
	/deep/ .el-dialog__header {
        padding: 0 !important;
        .el-dialog__headerbtn {
            top: 10px;
            right: 10px;
            font-size: 25px;
        }
	}
	/deep/ .el-dialog__body {
		padding: 20px;
	}
	.traylist {
        .search {
            .demo-input-suffix {
                text-align: center;
                .el-input {
                    width: 17.625rem !important;
                }
            }
        }
		
		.tratlist_title {
			display: flex;
			flex-wrap: nowrap;
			.title {
				margin-right: 50px;
			}
		}
		
		/deep/ .el-table {
			min-height: 625px;
			.el-button {
				width: 80px;
            }
            .el-icon-success {
                font-size: 18px;
                color: rgb(0, 202, 27);
            }
		}
		// /deep/ .el-table td, .el-table th {
		// 	padding: 7px 0 0;
		// }
		.block {
			text-align: center;
			margin-top: 10px;
		}
	}
	
</style>
