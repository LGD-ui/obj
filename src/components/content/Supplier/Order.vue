<template>
	<!-- 订单信息 -->
	<el-container>
		<Left/>
		<el-container>
			<el-main style="padding: 10px;">
				<Head/>
				<div class="Order">
					<div class="search">
						<div class="demo-input-suffix">
							<el-input suffix-icon="el-icon-search" style="width: 30.625rem;" v-model.trim="search_name"
								autofocus placeholder="搜索" @keyup.enter.native="searchChange">
								<el-button slot="append" type="primary" @click="searchChange">搜索</el-button>
							</el-input>
							<el-button type="primary" @click="clearSearchChange">全部</el-button>
						</div>
					</div>
					
					<el-table :data="tableData.tableList" :header-cell-style="tableheader" v-loading="tableData.loading " element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
						element-loading-background="rgba(0, 0, 0, 0.5)" >
						<el-table-column label="订单编号" min-width="60">
							<template slot-scope="scope">
								<span>{{ scope.row.id || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="名称" prop="name_">
							<template slot-scope="scope">
								<span>{{ scope.row.name || '-- --' }}</span>
							</template>
						</el-table-column>	
						<el-table-column label="工序" prop="items">
							<template slot-scope="scope">
								<span>{{ scope.row.item || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="数量(未生产/总数)" prop="material_">
							<template slot-scope="scope">
								<span>{{ scope.row.material || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="条码" prop="specs_">
							<template slot-scope="scope">
								<span>{{ scope.row.specs || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="生产计划" prop="category_">
							<template slot-scope="scope">
								<el-button size="mini" icon="el-icon-plus" @click="orderOkClick"></el-button>
							</template>
						</el-table-column>
						<!-- <el-table-column label="备注" prop="note_">
							<template slot-scope="scope">
								<span>{{ scope.row.note || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="总数量" prop="count">
							<template slot-scope="scope">
								<span >{{ scope.row.stock || '-- --' }}</span>
							</template>
						</el-table-column> -->
						<!-- <el-table-column label="图片" prop="image">
							<template slot-scope="scope">
								<el-popover v-if="scope.row.image" placement="right" title="" trigger="hover">
									<img :src="scope.row.image" style="height: 500px;width: 500px">
									<img slot="reference" :src="scope.row.image" alt="" style="height: 50px;width: 50px">
								</el-popover>
								<el-popover v-else placement="right" title="" trugger="click">
									<img src="http://zrui.e7vr.com/image/arm/default.gif" alt="defaultPic" style="height: 500px;width: 500px">
									<img slot="reference" src="http://zrui.e7vr.com/image/arm/default.gif" alt="" style="height: 50px;width: 50px">
								</el-popover>
							</template>
						</el-table-column> -->
						<!-- <el-table-column label="添加数量" width="150">
							<template slot-scope="scope">
								<el-input-number v-model.trim="go_numArr[scope.$index].go_num" controls-position="right" @change="handleChange"
								 :min="0" style="width: 100%;"></el-input-number>
							</template>
						</el-table-column>
						<el-table-column label="添加" min-width="100">
							<template slot-scope="scope">
								<el-button @click="submit(scope.$index,scope.row)" type="primary" :disabled="go_numArr[scope.$index].go_num == 0">添加</el-button>
							</template>
						</el-table-column> -->
									
					</el-table>
					
					<div class="block">
						<el-pagination 
							v-if="tableData.total>10" 
							@current-change="handleCurrentChange" 
							layout="prev, pager, next, jumper"
							:total="tableData.total">
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
	export default {
		name: "Order",
		components: {Left, Head},
		computed: {
			...mapState({
				url: state => state.url,
			}),
			...mapGetters({
				token: "getToken"
			})
		},
		data() {
			return {
				search_name: '',
				tableData: {
					loading: true,
					tableList: [{}], //15
					currentPage: 1,
					pageSize: 15,
					total: 0,
				}
			}
		},
		created() {
			setTimeout(() => {
				this.tableData.loading = false
			}, 1000)
		},
		methods: {
			getOrder() {
				let that = this;
				that.axios({
					method: 'GET',
					url: that.url + '',
					data: '',
					params: {},
					headers: {
						"content-type": "application/json",
						'token': that.token
					}
				}).then( response => {
					if (response && response.data && response.data.data && response.data.code == 200) {
						console.log(response)
					}
				}).catch( error => {
					console.log(error)
				});
			},
			searchChange() {
				console.log(this.search_name);
			},
			orderOkClick() {
				var that = this;
				const h = this.$createElement;
				that.$msgbox({
					title: '提示',
					message: h('p', null, [
						h('span', null, '配件名称：'),
						h('span', { style: 'color: teal' }, 'product_name'),
						h('span', null, '，数量：'),
						h('span', { style: 'color: teal' }, 'count_')
					]),
					showClose: false,
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					beforeClose: (action, instance, done) => {
						if (action === 'confirm') {
							instance.confirmButtonLoading = true;
							instance.confirmButtonText = '添加中...';
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
					// that.axios({
					// 	method: 'GET',
					// 	url: that.url + '/api/v1/supplier/export',
					// 	data: '',
					// 	params: {
					// 		log_id: id
					// 	},
					// 	headers: {
					// 		"content-type": "application/json",
					// 		'token': that.token
					// 	}
					// }).then(function(response) {
					// 	if (response.data.code == 200) {
							that.$message({
							    showClose: true,
							    message: '成功导出',
							    type: 'success'
							})
					// 	}
					// }).catch(function(error) {
					// 	console.log(error)
					// });
				});
			},
			
			handleCurrentChange(currentPage) {
				this.tableData.currentPage = currentPage;
			},
			clearSearchChange() {
				this.search_name = '';
			},
			tableheader({ row, column, rowIndex, columnIndex }) { //表头样式
				if (rowIndex === 0) {
					return 'height:50px;background:#e5e5e5'
				}
			},
		},
		
	}
</script>

<style lang="less" scoped>
	.Order {
		background: #FFFFFF;
		margin-top: 10px;
		padding: 10px;
		.search {
			> div {
				display: flex;
				> .el-button {
					width: 80px;
					margin-left: 10px;
				}
			}
		}
		.el-table {
			height: 845px;
			margin: 1rem 0;
		}
		
	}
	/deep/ .v-modal {
		background: #0000;
	}
</style>