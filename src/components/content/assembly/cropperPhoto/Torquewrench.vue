<template>

	<div>
		<el-dialog :visible.sync="wrenchDialogVisible.dialog" :show-close="false" :modal="false" :before-close="close" width="800px">
			<div class="Torquewrench">
				<el-table :data="tableData" :row-class-name="tableRowClassName" v-infinite-scroll="load" :infinite-scroll-disabled="disabled" style="width: 100%">
					
					<el-table-column prop="name" label="扳手编号#"></el-table-column>
					<el-table-column prop="ip" label="扳手IP"></el-table-column>
					<el-table-column label="操作" width="100" align="center">
						<template slot-scope="scope">
							<el-link type="primary" :underline="false" v-if="!scope.row.onopen" @click="handleClick(scope.row, scope.$index)"><i v-if="scope.row.iconloading" class="el-icon-loading"></i>连接扳手</el-link>
							<el-link type="warning" :underline="false" v-if="scope.row.onopen" @click="handleClick(scope.row, scope.$index)">断开连接</el-link>
						</template>
					</el-table-column>
					<el-table-column type="expand">
						<template slot-scope="scope">
							<el-table :data="scope.row.wrenchArr" :show-header="false" size="mini">
								<el-table-column prop="name"></el-table-column>
							</el-table>
						</template>
					</el-table-column>
				</el-table>
				<div class="loading">
					<p v-if="total > 10 && loading">加载中...</p>
					<p v-if="total > 10 && noMore">没有更多了</p>
				</div>
			</div>
		</el-dialog>
	</div>

</template>


<script>
	import { mapActions, mapState, mapGetters } from "vuex"
	export default {
		name: 'Torquewrench',
		computed: {
			...mapGetters({
				url: "geturl",
				token: "getToken"
			}),
			noMore () {
				return this.tableData.length >= this.total
			},
			disabled () {
				return this.loading || this.noMore
			}
		},
		data() {
			return {
				row: {},
				$index: 0,
				websock: null,
				tableData: [],
				page: 1,
				size: 10,
				total: 0,
				stompClient: '',
				timer: '',
				loading: false,
			}
		},
		props: {
			wrenchDialogVisible: {}
		},
		created() {
			this.getwrenchList();
		},
		methods: {
			load() {
				this.loading = true;
				this.page += 1;
				this.getwrenchList();
			},
			getwrenchList() {
				var that = this;
				var url = that.url;
				var token = that.token;
				// application/x-www-form-urlencoded
				that.axios({
					method: 'GET',
					url: url + '/api/v1/assemble/wrench-list',
					data: '',
					params: {
						page: that.page,
						size: that.size,
					},
					headers: {
						"content-type": "application/json",
						'token': token
					}
				}).then(function(response) {
					if (response && response.data && response.data.data && response.data.code == 200) {
						var data = response.data.data.list;
						that.total = response.data.data.count.total
						that.loading = false;
						data.forEach(item => {
							item.onopen = false;
							item.iconloading = false;
							item.wrenchArr = [];
							return item
						})
						if (that.tableData.length == 0) {
							that.tableData = [...data];
						} else {
							that.tableData = that.tableData.concat(data);
						}
						
						
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			tableRowClassName({ row, rowIndex }) {
				if (row.onopen) {
					return 'success-row';
				}
				return '';
			},
			close() {
				this.$emit("change", false)
			},
			handleClick(row, rowIndex) {
				if (!row.onopen) {
					console.log('连接')
					this.row = row;
					this.$index = rowIndex;
					this.tableData[rowIndex].iconloading = true;
					this.initWebSocket();
				}
				if (row.onopen) {
					console.log('断开')
					
					this.websock.close() //离开路由之后断开websocket连接
				}
			},
			
			initWebSocket() { //初始化weosocket
				const wsuri = 'ws://192.168.199.3:1000';
				this.websock = new WebSocket(wsuri);
				this.websock.onmessage = this.websocketonmessage;
				this.websock.onopen = this.websocketonopen;
				this.websock.onerror = this.websocketonerror;
				this.websock.onclose = this.websocketclose;
			},
			websocketonopen() { //连接建立之后执行send方法发送数据
				this.tableData[this.$index].iconloading = false;
				this.tableData[this.$index].onopen = true;
				this.websocketsend(this.row.ip);
				console.log('%cwebsocketonopen连接建立之后执行send方法发送数据','color: #2893ff;font-weight: bold;')
			},
			websocketonerror() { //连接建立失败重连
				this.initWebSocket();
				console.log('%cwebsocketonerror连接建立失败重连','color: #2893ff;font-weight: bold;')
			},
			websocketonmessage(e) { //数据接收
				console.log('%cwebsocketonmessage接受的数据','color: #2893ff;font-weight: bold;')
				var that = this;
				if (e && e.data) {
					const redata = JSON.parse(e.data);
					if (redata.code == 1) {
						console.log(redata)
						var wrenchData = {
							wrench_id: that.row.id,	//int	是	扳手编号
							type: that.wrenchDialogVisible.query.type,	//int	是	装配类型：1=产品，2=模型
							product_id: that.wrenchDialogVisible.barcodeObj.product_id,	//int	是	图样id
							product_type: that.wrenchDialogVisible.barcodeObj.product_type,	//int	是	类型：1=标准化，2=非标准化
							parts_id: that.wrenchDialogVisible.barcodeObj.id,	//int	是	零件id
							parts_number: '',	//array	是	零件编码
							data: redata.message,	//int	是	力矩数据
						}
						
						that.axios({
							method: 'POST',
							url: that.url + '/api/v1/assemble/send-wrench',
							data: '',
							params: wrenchData,
							headers: {
								/* application/json */
								"content-type": "application/x-www-form-urlencoded",
								'token': that.token
							}
						}).then(function(response) {
							if (response && response.data && response.data.data && response.data.code == 200) {
								console.log(response)
								that.tableData[that.$index].wrenchArr.push({
									name: redata.message
								});
								that.initWebSocket();
							}
						}).catch(function(error) {
							console.log(error);
						});
					} else {
						if (redata.message) {
							that.tableData[that.$index].onopen = false;
							that.tableData[that.$index].iconloading = false;
							
							that.$message({
								message: redata.message,
								type: 'warning',
								offset: 400
							})
						} else {
							that.initWebSocket();
						}
						
					}
				}
				
			},
			websocketsend(Data) { //数据发送
				this.websock.send(Data);
				console.log('%cwebsocketsend数据发送','color: #2893ff;font-weight: bold;')
			},
			websocketclose(e) { //关闭
				this.tableData[this.$index].iconloading = false;
				this.tableData[this.$index].onopen = false;
				console.log('%cwebsocketclose断开连接','color: #2893ff;font-weight: bold;');
			},
			
		},
		
		/* beforeDestroy() {
			// 页面离开时断开连接,清除定时器
			this.disconnect();
			clearInterval(this.timer);
		} */
	}
</script>

<style lang="less" scoped>
	/deep/ .el-dialog__header {
		padding: 0 !important;
	}
	/deep/ .el-dialog__body {
		padding: 30px 20px 10px;
	}

	.Torquewrench {

		/deep/ .el-table {
			height: 490px;
			overflow: auto;
			
			.el-table {
				height: auto;
			}
			
			.warning-row {
				background: oldlace;
			}

			.success-row {
				background: #f0f9eb;
			}
		}
		
		.loading {
			height: 20px;
			text-align: center;
			margin-top: 10px;
		}

	}
</style>
