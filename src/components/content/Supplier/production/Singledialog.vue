<template>
	<div>
		<el-dialog :visible.sync="SingleDialogVisible.dialog" :modal="false" :show-close="false" :before-close="close" width="700px">
			<div class="Singledialog">
				<el-table :data="singleTableData.tableData" v-infinite-scroll="load" :infinite-scroll-disabled="disabled">
					<el-table-column label="序号" min-width="60">
						<template slot-scope="scope">
							<span>{{ scope.row.id || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button size="mini" icon="el-icon-plus"></el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="loading">
					<p v-if="singleTableData.total > 10 && loading">加载中...</p>
					<p v-if="singleTableData.total > 10 && noMore">没有更多了</p>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { mapActions, mapState, mapGetters } from "vuex"
	export default {
		name: 'Singledialog',
		components: {},
		computed: {
			...mapState({
				url: state => state.url,
			}),
			...mapGetters({
				token: "getToken"
			}),
			noMore () {
				return this.singleTableData.tableData.length >= this.singleTableData.total
			},
			disabled () {
				return this.loading || this.noMore
			}
		},
		props: {
			SingleDialogVisible: '',
		},
		data() {
			return {
				loading: false,
				singleTableData: {
					tableData: [{}], //10
					currentPage: 1,
					pageSize: 10,
					total: 0,
				}
			}
		},
		created() {
			
		},
		methods: {
			getSingle() {
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
						console.log(response);
						that.loading = false;
					}
				}).catch( error => {
					console.log(error)
				});
			},
			
			load() {
				this.loading = true;
				this.singleTableData.currentPage += 1;
				this.getSingle();
			},
			close() {
				var that = this;
				that.$emit("change", false)
			},
		},
	}
</script>

<style lang="less" scoped>
	/deep/ .el-dialog__header {
		padding: 0 !important;
	}
	/deep/ .el-dialog__body {
		padding: 20px;
	}
	.Singledialog {
		/deep/ .el-table {
			height: 578px;
			overflow: auto;
		}
		.loading {
			height: 20px;
			text-align: center;
			margin-top: 10px;
		}
	}
	
</style>
