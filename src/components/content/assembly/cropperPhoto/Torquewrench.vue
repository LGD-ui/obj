<template>

	<div>
		<el-dialog :visible.sync="wrenchDialogVisible.dialog" :show-close="false" :modal="false" :before-close="close" width="800px">
			<div class="Torquewrench">
				<el-select v-model="wrenchname" :value-key="wrenchname" filterable placeholder="选择扳手"  @change="selectChange">
					<el-option v-for="item in tableData" :key="item.id" :label="item.name" :value="item.ip"></el-option>
				</el-select>
				<el-table :data="nowwrench" :row-class-name="tableRowClassName" :header-cell-style="tableheader" style="width: 100%">
					<el-table-column prop="name" label="扳手编号#"></el-table-column>
					<el-table-column prop="ip" label="扳手IP"></el-table-column>
					<el-table-column label="连接状态">
						<template slot-scope="scope">
							<span>{{scope.row.onopen ? '已连接':'未连接'}}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="100" align="center">
						<template slot-scope="scope">
							<el-link type="primary" :underline="false" v-if="!scope.row.onopen" @click="handleClick(scope.row)"><i v-if="scope.row.iconloading" class="el-icon-loading"></i>连接</el-link>
							<el-link type="warning" :underline="false" v-if="scope.row.onopen" @click="handleClick(scope.row)">断开</el-link>
						</template>
					</el-table-column>
				</el-table>
				<el-table :data="wrenchArr" :header-cell-style="tableheader" size="mini">
					<el-table-column label="数据" prop="name"></el-table-column>
					<el-table-column label="力矩" prop="name"></el-table-column>
				</el-table>
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
			})
		},
		data() {
			return {
				wrenchname: '',
				row: {},
				$index: 0,
				websock: null,
				tableData: [],
				wrenchArr: [],
				nowwrench: [],
				page: 1,
				size: 10,
				total: 0,
				stompClient: '',
				timer: '',
			}
		},
		props: {
			wrenchDialogVisible: {}
		},
		created() {
			if (sessionStorage.getItem("IP")) {
				this.wrenchname = sessionStorage.getItem("IP");
			}
		},
		methods: {
			/* 获取扳手列表 */
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
						that.total = response.data.data.count.total;
						data.forEach(item => {
							item.onopen = false;
							item.iconloading = false;
							if (item.ip == that.wrenchname) {
								that.nowwrench = [item];
								that.row = item;
							}
							return item
						})
						that.tableData = [...data];
						// that.webSocketstatus(that.row.id, 1);
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			/* 获取扳手列表结束 */
			/* 选择扳手 */
			selectChange() {
				sessionStorage.setItem("IP", this.wrenchname);
				if(this.websock) {
					this.webSocketstatus(this.row.id, 2);
				}
				this.tableData.forEach(item => {
					if (item.ip == this.wrenchname) {
						this.nowwrench = [item];
						this.row = item;
					}
				})
			},
			/* 选择扳手结束 */
			/* table样式 */
			tableRowClassName({ row, rowIndex }) {	//当前行样式
				if (row.onopen) {
					return 'success-row';
				}
				return '';
			},
			tableheader({ row, column, rowIndex, columnIndex }) { //表头样式
				if (rowIndex === 0) {
					return 'height:40px;background:#e5e5e5'
				}
			},
			/* table样式结束 */
			/* 关闭dialog */
			close() {
				if(this.websock) {
					this.webSocketstatus(this.row.id, 2);
				}
				
				this.$emit("change", false)
			},
			/* 关闭dialog结束 */
			/* 连接或断开 */
			handleClick(row) {
				if (!row.onopen) {
					console.log('连接')
					this.row = row;
					this.nowwrench[0].iconloading = true;
					this.webSocketstatus(this.row.id, 1);
				}
				if (row.onopen) {
					console.log('断开')
					this.webSocketstatus(this.row.id, 2);
					
				}
			},
			/* 连接或断开结束 */
			
			
			/* WebSocket开始 */
			initWebSocket() { //初始化weosocket
				const wsuri = 'ws://192.168.10.10:1000';
				this.websock = new WebSocket(wsuri);
				this.websock.onmessage = this.websocketonmessage;
				this.websock.onopen = this.websocketonopen;
				this.websock.onerror = this.websocketonerror;
				this.websock.onclose = this.websocketclose;
			},
			websocketonopen() { //连接建立之后执行send方法发送数据
				this.nowwrench[0].iconloading = false;
				this.nowwrench[0].onopen = true;
				this.websocketsend(this.row.ip);
				console.log('%cwebsocketonopen连接建立之后执行send方法发送数据','color: #03be00;font-weight: bold;')
			},
			websocketonerror() { //连接建立失败重连
				this.webSocketstatus(this.row.id, 1);
				console.log('%cwebsocketonerror连接建立失败重连','color: #ff5500;font-weight: bold;')
			},
			websocketonmessage(e) { //数据接收
				console.log('%cwebsocketonmessage接受的数据','color: #aaff7f;font-weight: bold;')
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
								that.wrenchArr.push({
									name: redata.message
								});
								that.webSocketstatus(that.row.id, 1);
							}
						}).catch(function(error) {
							console.log(error);
						});
					} else {
						if (redata.message) {
							that.nowwrench[0].onopen = false;
							that.nowwrench[0].iconloading = false;
							
							that.$message({
								message: redata.message,
								type: 'warning',
								offset: 400
							})
						} else {
							that.webSocketstatus(that.row.id, 1);
						}
						
					}
				}
				
			},
			websocketsend(Data) { //数据发送
				this.websock.send(Data);
				console.log('%cwebsocketsend数据发送','color: #2893ff;font-weight: bold;')
			},
			websocketclose(e) { //关闭
				this.nowwrench[0].iconloading = false;
				this.nowwrench[0].onopen = false;
				console.log('%cwebsocketclose断开连接','color: #adadad;font-weight: bold;');
			},
			/* WebSocket结束 */
			
			webSocketstatus(id, status) {	//每次连接或断开扳手调用
				let that = this;
				that.axios({
					method: 'GET',
					url: that.url + '/api/v1/assemble/update-wrench',
					params: { id, status },
					headers: {
						"content-type": "application/json",
						"token": that.token
					}
				}).then( response => {
					if (response && response.data.code == 200) {
						
						if (status == 1) {
							that.initWebSocket();
						}
						if (status == 2) {
							that.websock.close() //离开路由之后断开websocket连接
						}
					}
				}).catch( error => {
					console.log(error)
					that.$message({
						message: "设备正在使用中",
						type: "error",
						offset: 300
					})
				});
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
		padding: 30px 20px;
	}

	.Torquewrench {
		/deep/ .el-select .el-input {
			width: 200px;
		}
		/deep/ .el-table {
			margin-top: 10px;
			.warning-row {
				background: oldlace;
			}

			.success-row {
				background: #f0f9eb;
			}
		}
		

	}
</style>
