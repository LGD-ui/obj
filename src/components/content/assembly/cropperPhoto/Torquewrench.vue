<template>

	<div class="torquewrench">
		<el-dialog :visible.sync="wrenchDialogVisible.dialog" :close-on-click-modal="false" :modal="false" :before-close="close" width="800px">
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
				<el-table :data="wrenchArr" :header-cell-style="tableheader" size="mini" class="el-table2" height="400">
					<el-table-column label="扳手编号#" prop="wrench_id"></el-table-column>
					<el-table-column label="模式">
						<template slot-scope="scope">
							<span v-if="scope.row.pattern < 1">跟踪模式</span>
							<span v-if="scope.row.pattern == 1">峰值模式</span>
						</template>
					</el-table-column>
					<el-table-column label="扭矩" prop="value"></el-table-column>
					<el-table-column label="单位">
						<template slot-scope="scope">
							<span v-if="scope.row.unit == 0">N.m</span>
							<span v-if="scope.row.unit == 1">lbf.ft</span>
							<span v-if="scope.row.unit == 2">lbf.in</span>
							<span v-if="scope.row.unit == 3">kgf.cm</span>
							<span v-if="scope.row.unit == 4">kgf.m</span>
						</template>
					</el-table-column>
					
					<el-table-column label="角度" prop="angle"></el-table-column>
					<!-- <el-table-column label="是否合格">
						<template slot-scope="scope">
							<el-link :underline="false" type="success" v-if="scope.row.qualified < 1">合格</el-link>
							<el-link :underline="false" type="danger" v-if="scope.row.qualified == 1">不合格</el-link>
						</template>
					</el-table-column> -->
				</el-table>
				<el-pagination 
					@current-change="handleCurrentChange" 
					:page-size="pagesize"
					:total="totals">
				</el-pagination>
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
				
				nowwrench: [],
				oooo: {},
				page: 1,
				size: 10,
				total: 0,
				
				wrenchArr: [],
				pagesize: 10,
				currPage: 1,
				totals: 0,
				
				
				
				stompClient: '',
				timer: '',
				status: 0,
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
			getwrenchList(val) {
				var that = this;
				if (val) {
					that.oooo = val;
				}
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
							item.onopen = item.status == 1 ? true : false;
							item.iconloading = false;
							if (item.ip == that.wrenchname) {
								that.nowwrench = [item];
								that.row = item;
							}
							return item
						})
						that.tableData = [...data];
						that.currPage = 1;
						that.getshujuList();
						// that.webSocketstatus(that.row.id, 1);
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			getshujuList() {
				var that = this;
				var url = that.url;
				var token = that.token;
				that.axios({
					method: 'GET',
					url: url + '/api/v1/assemble/wrench-data',
					params: {
						page: that.currPage,
						size: that.pagesize,
						assemble_id: that.oooo.assemble_id,//	int	是	任务ID
						pipeline_id: that.oooo.pipeline_id,	//int	是	流水线ID
						pipeline_step_id: that.oooo.pipeline_step_id,	//int	是	流水线步骤ID
					},
					headers: {
						"content-type": "application/json",
						'token': token
					}
				}).then(function(response) {
					if (response && response.data && response.data.data && response.data.code == 200) {
						var data = response.data.data.list;
						that.totals = response.data.data.count.total;
						that.wrenchArr = [...data]
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			handleCurrentChange(currPage) {
				this.currPage = currPage;
				this.getshujuList();
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
				// if(this.websock) {
				// 	this.webSocketstatus(this.row.id, 2);
				// }
				this.wrenchArr = [];
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
			getStr(string, str){ 
			    var str_before = string.split(str)[0]; 
			    var str_after = string.split(str)[1];
				return str_after;
			},
			
			/* WebSocket开始 */
			initWebSocket() { //初始化weosocket
				let wsuri = '';
				if(this.url.split(':')[2]){
					wsuri = 'ws:'+this.url.split(':')[1] + ':1000'
				} else {
					wsuri = 'wss:'+this.url.split(':')[1] +'/wss/'
				}
				console.log(wsuri)
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
							assemble_id: that.oooo.assemble_id,// assemble_id	int	是	任务ID
							pipeline_id: that.oooo.pipeline_id,// pipeline_id	int	是	流水线ID
							pipeline_step_id: that.oooo.pipeline_step_id,// pipeline_step_id	int	是	流水线步骤ID
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
								that.wrenchArr.push({
									name: redata.message
								});
								that.getshujuList();
								// let redatadata = redata.message.split(',');
								// console.log(redatadata)
								that.websocketsend(that.row.ip);
								
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
					params: { id, status},
					headers: {
						"content-type": "application/json",
						"token": that.token
					}
				}).then( response => {
					if (response && response.data.code == 200) {
						if (status == 1) {
							that.initWebSocket();
							// console.log(status)
						}
						if (status == 2) {
							console.log('------------------------')
							that.tableData.map(item => {
								if (id == item.id) {
									item.onopen = false;
								}
								return item;
							})
							if (that.websock) {
								that.websock.close() //离开路由之后断开websocket连接
							}
							
						}
					}
				}).catch( error => {
					console.log('++++++++++++++++++++++')
					
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
