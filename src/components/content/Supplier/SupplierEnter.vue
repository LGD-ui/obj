<template>
	<el-container>
		<Left/>
		<el-container>
			<el-main style="padding: 10px;">
				<Head/>
				<div class="container">
					<div class="search">
						<div class="demo-input-suffix" style="display: flex;">
							<el-input suffix-icon="el-icon-search" style="width: 30.625rem;" v-model.trim="search_name"
								autofocus placeholder="图样名称搜索" @keyup.enter.native="getData">
								<el-button slot="append" type="primary" @click="getData">搜索</el-button>
							</el-input>
							<el-button type="primary" style="width: 80px;margin-left: 10px;" @click="getallData">全部</el-button>
						</div>
					</div>
				
					<el-table :data="tableData" style="width: 100%;margin-top:1rem;margin-bottom:1rem;" highlight-current-row
					 :row-class-name="tableRowClassName" :header-cell-style="tableheader">
						<el-table-column label="序号" width="60">
							<template slot-scope="scope">
								<span v-if="scope.row.id">{{ scope.row.id }}</span>
							</template>
						</el-table-column>
						<el-table-column label="图样名称">
							<template slot-scope="scope">
								<span v-if="scope.row.name">{{ scope.row.name }}</span>
								<span v-else>-- --</span>
							</template>
						</el-table-column>
				
						<el-table-column label="图片" width="70">
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
						</el-table-column>
				
						<el-table-column label="图样代号">
							<template slot-scope="scope">
								<span>{{ scope.row.item || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="材料">
							<template slot-scope="scope">
								<span>{{ scope.row.material || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="型号规格">
							<template slot-scope="scope">
								<span>{{ scope.row.specs || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="类别码">
							<template slot-scope="scope">
								<span>{{ scope.row.category || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="备注" >
							<template slot-scope="scope">
								<span>{{ scope.row.note || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="总数量">
							<template slot-scope="scope">
								<span >{{ scope.row.stock || '-- --' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="添加数量" width="150">
							<template slot-scope="scope">
								<el-input-number v-model.trim="go_numArr[scope.$index].go_num" controls-position="right" @change="handleChange"
								 :min="0" style="width: 100%;"></el-input-number>
							</template>
						</el-table-column>
						<el-table-column label="添加" width="100">
							<template slot-scope="scope">
								<el-button @click="submit(scope.$index,scope.row)" type="primary" :disabled="go_numArr[scope.$index].go_num == 0">添加</el-button>
								<!-- <el-button @click="batch(scope.$index,scope.row)" type="danger" :disabled="go_numArr[scope.$index].go_num == 0">报损</el-button> -->
							</template>
						</el-table-column>
				
					</el-table>
					<div class="block">
						<el-pagination v-if="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next, jumper"
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
	import Qs from 'qs';
	export default {
		name: 'supplierEnter',
		components: {
			Left, Head
		},
		data() {
			return {
				tableData: [], //获取的数据
				go_numArr: [],
				
				search_name: '', //查询的数量
				pageSize: 10,
				currentPage: 1,
				total: 0,
			}
		},
		created() {
			this.getData();
		},
		computed: {
			...mapGetters({
				url: "geturl",
				token: "getToken"
			})
		},
		methods: {
			getData() {
				let that = this;
				that.axios({
					method: 'GET',
					url: that.url + '/api/v1/supplier/list',
					data: '',
					params: {
						page: that.currentPage,
						size: that.pageSize,
						name: that.search_name
					},
					headers: {
						"content-type": "application/json",
						'token': that.token
					}
				}).then(function(response) {
					if (response && response.data && response.data.data && response.data.code == 200) {
						var data = response.data.data.list;
						that.total = response.data.data.count.total;
						that.tableData = [...data];
						for (let i = 0; i < that.tableData.length; i++) {
							that.go_numArr.push({
								go_num: 0
							})
						}
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			getallData() {
				this.search_name = '';
				this.getData();
			},
			// table表格显示不同状态
			tableRowClassName({ row, rowIndex }) {
				if (rowIndex === 1) {
					return 'warning-row';
				} else if (rowIndex === 3) {
					return 'success-row';
				}
				return '';
			},
			tableheader({ row, column, rowIndex, columnIndex }) { //表头样式
				if (rowIndex === 0) {
					return 'height:70px;background:#e5e5e5'
				}
			},
			//数字输入框change事件
			handleChange(val) {},
			submit(index, row) { //对应下标，对应行内容
				let that = this;
				let number = this.go_numArr[index].go_num;
				let data = Qs.stringify({
					number: number,
					product_id: row.fix_id,
					product_name: row.name,
					type: row.type
				});
				this.axios.post(that.url + '/api/v1/supplier/manual', data, {
					headers: {
						token: that.token
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.$message({
							message: '添加成功',
							type: 'success'
						});
					}
				}).catch(err => {
					this.$message({
						showClose: true,
						message: '网络请求出错',
						type: 'error'
					});
				})
			},
			handleSizeChange(pagesize) {
				this.pageSize = pagesize;
			},
			handleCurrentChange(currentPage) {
				this.currentPage = currentPage;
				this.getData();
			}
		}
	}
</script>

<style>
	.container {
		border-radius: 10px;
		background: #FFFFFF;
		margin-top: 10px;
		padding: 10px;
	}

	.search {
		display: flex;
	}

	.btn {
		display: flex;
	}
</style>
