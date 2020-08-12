<template>
	<div>
		<el-dialog :visible.sync="invendetailDV.dialog" top="10vh" class="invendetail_dialog" :close-on-click-modal="false" @close="close" width="1000px">
			<div class="invendetail">
                <!-- <div class="search">
                    <div class="demo-input-suffix">
                        <el-input suffix-icon="el-icon-full-screen" style="width: 30.625rem;" autofocus v-model.trim="search_name"
                            placeholder="入库条码" @input="searchChange" >
                            <el-button slot="append" type="primary" @click="searchChange">搜索</el-button>
                        </el-input>
                    </div>
                </div> -->
				<el-table ref="invendetailTableData" :data="invendetailTableData.tableData" height="635">
					<!-- <el-table-column label="图片">
						<template slot-scope="scope">
							<el-popover placement="right" title="" trigger="click">
								<img :src="scope.row.img" style="height: 500px;width: 500px">
								<img slot="reference" :src="scope.row.img" alt="" style="height: 50px;width: 50px">
							</el-popover>
						</template>
					</el-table-column> -->
					<el-table-column label="名称">
						<template slot-scope="scope">
							<span style="">{{ scope.row.name || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="代号">
						<template slot-scope="scope">
							<span style="">{{ scope.row.item || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="型号规格">
						<template slot-scope="scope">
							<span style="">{{ scope.row.specs || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="材料">
						<template slot-scope="scope">
							<span style="">{{ scope.row.material || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="条码" width="110">
						<template slot-scope="scope">
							<span style="">{{ scope.row.parts_number || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="批次" width="80">
						<template slot-scope="scope">
							<span v-if="scope.row.batch != '0'">{{ scope.row.batch }}</span>
							<span v-else>-- --</span>
						</template>
					</el-table-column>
					<el-table-column label="类型" width="80">
					    <template slot-scope="scope">
					        <el-link :underline="false" v-if="scope.row.type == 1">零件</el-link>
					        <el-link :underline="false" v-if="scope.row.type == 2">模型</el-link>
					    </template>
					</el-table-column>
				</el-table>
				<div class="block">
					<el-pagination
						@current-change="handleCurrentChange" 
						layout="prev, pager, next"
						:page-size="invendetailTableData.pageSize"
						:total="invendetailTableData.total">
					</el-pagination>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { mapState, mapGetters } from "vuex"
	export default {
		name: 'invendetail',
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
			invendetailDV: '',
		},
		data() {
			return {
                search_name: '',
				invendetailTableData: {
					tableData: [], //10
					currentPage: 1,
					pageSize: 15,
					total: 0,
				},
			}
		},
		methods: {
			getSingle() {
                let that = this;
				let obj = that.invendetailDV.obj;
				that.axios({
					method: 'GET',
					url: that.url + '/api/v1/pattern/product-detail',
					params: {
						page: that.invendetailTableData.currentPage,
						size: that.invendetailTableData.pageSize,
						product_id: obj.product_id,
						type: obj.type
					},
					headers: {
						"content-type": "application/json",
						'token': that.token
					}
				}).then( response => {
					if (response && response.data && response.data.data && response.data.code == 200) {
						var data = response.data.data;
						that.invendetailTableData.total = data.count.total;
						data.list.map(item => {
							item.name = obj.name;
							item.item = obj.item;
							item.specs = obj.specs;
							item.material = obj.material;
							return item;
						})
						that.invendetailTableData.tableData = data.list;
					}
				}).catch( error => {
					console.log(error)
				});
			},
            clearSearchChange() {
                this.search_name = "";
            },
			/* 分页 */
			handleCurrentChange(currentPage) {
				this.invendetailTableData.currentPage = currentPage;
				this.getSingle();
            },
			close() {
                this.search_name = "";
				this.invendetailTableData = {
					tableData: [], //10
					currentPage: 1,
					pageSize: 15,
					total: 0,
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
			z-index: 100;
        }
	}
	/deep/ .el-dialog__body {
		padding: 20px;
	}
	.invendetail {
        .search {
            .demo-input-suffix {
                text-align: center;
                .el-input {
                    width: 17.625rem !important;
                }
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
