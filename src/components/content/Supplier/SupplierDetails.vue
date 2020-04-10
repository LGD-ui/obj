<template>
	<el-container>
		<Left/>
		<el-container>
			<el-main style="padding: 10px;">
				<Head/>
				<div class="container">
					<!-- <div class="search">
						<div class="demo-input-suffix" style="display: flex;">
							<el-input suffix-icon="el-icon-search" style="width: 30.625rem;" v-model.trim="search_name"
								autofocus placeholder="图样名称搜索" @keyup.enter.native="getData">
								<el-button slot="append" type="primary" @click="getData">搜索</el-button>
							</el-input>
							<el-button type="primary" style="width: 80px;margin-left: 10px;" @click="getallData">全部</el-button>
						</div>
					</div> -->
				
					<el-table :data="tableData" style="width: 100%;margin-top:1rem;margin-bottom:1rem;" :header-cell-style="tableheader">
						<el-table-column label="序号" width="100">
							<template slot-scope="scope">
								<span style="">{{ scope.row.id }}</span>
							</template>
						</el-table-column>
						<el-table-column label="图片" prop="image" width="120">
							<template slot-scope="scope">
								<el-popover v-if="scope.row.image" placement="right" title="" trigger="hover">
									<img :src="scope.row.image" style="height: 500px;width: 500px">
									<img slot="reference" :src="scope.row.image" alt="" style="height: 50px;width: 50px">
								</el-popover>
								<el-popover v-else placement="right" title="" trigger="hover">
									<img src="http://zrui.e7vr.com/image/arm/default.gif" style="height: 500px;width: 500px">
									<img slot="reference" src="http://zrui.e7vr.com/image/arm/default.gif" alt="" style="height: 50px;width: 50px">
								</el-popover>
							</template>
						</el-table-column>
						<el-table-column label="图样代号" prop="name_">
							<template slot-scope="scope">
								<span v-if="scope.row.item" style="">{{ scope.row.item }}</span>
								<span v-else>-- --</span>
							</template>
						</el-table-column>
						<el-table-column label="图样名称" prop="name_">
							<template slot-scope="scope">
								<span v-if="scope.row.name" style="">{{ scope.row.name }}</span>
								<span v-else>-- --</span>
							</template>
						</el-table-column>
						<el-table-column label="材料" prop="material_">
							<template slot-scope="scope">
								<span v-if="scope.row.material" style="">{{ scope.row.material }}</span>
								<span v-else>-- --</span>
							</template>
						</el-table-column>
						<el-table-column label="型号规格" prop="number">
							<template slot-scope="scope">
								<span v-if="scope.row.specs" style="">{{ scope.row.specs }}</span>
								<span v-else>-- --</span>
							</template>
						</el-table-column>
						<el-table-column label="创建时间" prop="createTime">
							<template slot-scope="scope">
								<span style="">{{ scope.row.created_at | formatDate}}</span>
							</template>
						</el-table-column>
						<el-table-column label="备注" prop="createTime">
							<template slot-scope="scope">
								<span v-if="scope.row.note" style="">{{ scope.row.note }}</span>
								<span v-else>-- --</span>
							</template>
						</el-table-column>
						<el-table-column label="选取文件" prop="createTime">
							<template>
								<el-upload class="upload-demo" action="" :show-file-list="false" :auto-upload="false" :limit="1" :on-change="afterRead"
								 :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
									<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
									<!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="upload">上传到服务器</el-button> -->
									<!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
								</el-upload>
							</template>
						</el-table-column>
						<!-- <el-table-column label="上传" min-width="100">
							<template slot-scope="scope">
								<el-button style="margin-left: 10px;" size="small" type="success" @click="submit(scope.row)">上传到服务器</el-button>
							</template>
						</el-table-column> -->
					</el-table>
					<div class="block">
						<el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next, jumper"
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
	import Qs from 'qs'
	export default {
		name: 'SupplierList',
		components: { Left, Head },
		data() {
			return {
				tableData: [],
				pageSize: 10,
				currentPage: 1,
				total: 0,
			}
		},
		created() {
			this.getData();
		},
		filters: {
			formatDate: function(val) {
				let newDate = new Date(val * 1000).toLocaleString();
				return newDate;
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
			getData() {
				let that = this;
				let url = that.url+`/api/v1/supplier/parts`;
				that.axios.get(url, {
					params: {
						page: that.currentPage,
						size: that.pageSize,
						name: that.$route.query.name,
						log_id: that.$route.query.id
					},
					headers: {
						token: that.token
					}
				}).then(res => {
					if (res && res.data && res.data.data && res.data.code == 200) {
						that.tableData = res.data.data.list;
						that.total = res.data.data.count.total;
					}
					
				}).catch(err => {
					that.$message({
						type: 'error',
						message: '网络请求错误,获取数据失败',
						offset: 400
					})
				})
			},
			
			updataSupplier(presen_url) {
				let that = this;
				that.axios({
					method: 'POST',
					url: that.url + '/api/v1/supplier/update',
					data: '',
					params: {
						parts_id: that.$route.query.id,
						presen_url: presen_url
					},
					headers: {
						"content-type": "application/json",
						'token': that.token
					}
				}).then(function(response) {
					if (response.data.code == 200) {
						that.$message({
						    showClose: true,
						    message: '上传成功',
						    type: 'success'
						})
						that.getData();
					}
				}).catch(function(error) {
					that.$message({
					    showClose: true,
					    message: '上传失败',
					    type: 'error'
					})
				});
			},
			
			// 图片上传
			afterRead(e) { //照片选取后触发
				var file = e.raw;
				this.submit(file)
			},
			handleAvatarSuccess(e) {},
			beforeAvatarUpload(e) {},
			tableheader({ row, column, rowIndex, columnIndex }) {
				if (rowIndex === 0) {
					return 'height: 70px;background: #e5e5e5';
				}
			},
			handleCurrentChange(currentPage) {
				this.currentPage = currentPage;
				this.getData();
			},
			submit(file) {
				let that = this;
				let url = that.url+`/api/v1/upload`;
				let postData = new FormData(); //创建form对象
				postData.append('file', file); //通过append向form对象添加数据
				that.axios.post(url, postData, {
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						token: that.token
					}
				}).then(res => {
					if (res.data.code == 200) {
						that.updataSupplier(res.data.data.url)
					}
					
				}).catch(err => {})
			}
		},

	}
</script>

<style scope>
	.container {
		background: #FFFFFF;
		margin-top: 10px;
		padding: 10px;
		border-radius: 10px;
	}

	.title {
		padding: 10px;
	}
</style>
