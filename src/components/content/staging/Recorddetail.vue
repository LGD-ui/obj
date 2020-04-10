<template>
	<el-container>
		<Left/>
		<el-container>
			<el-main style="padding: 10px;">
				<Head/>
				<div class="Recorddetail">
					<!-- <div class="input_flex">
						<div class="fl">
							<div class="demo-input-suffix" style="width: 30rem;">
								<el-input placeholder="搜索" prefix-icon="el-icon-search" v-model.trim="search_name" v-focus></el-input>
							</div>
							<div class="demo-input-suffix" style="margin-left: 10px;">
								<el-button type="primary">搜索</el-button>
							</div>
							<div class="demo-input-suffix" style="margin-left: 10px;">
								<el-button type="primary" >全部</el-button>
							</div>
				
						</div>
					</div> -->
					<el-table :data="tableDatas" style="width: 100%;margin-bottom:1rem;" :header-cell-style="tableheader">
						<el-table-column label="序号" width="100">
							<template slot-scope="scope">
								<el-link :underline="false" style="width: 100px;" v-if="scope.row.disabled1" @click="serial_numberfocus(scope.$index)">{{ scope.row.serial_number || '--' }}</el-link>
								<el-input v-focus v-model="scope.row.serial_number_" v-if="!scope.row.disabled1" autofocus @blur="handleblurserial_number(scope.row.serial_number_, scope.$index)" size="mini"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="批次" width="100">
							<template slot-scope="scope">
								<el-link :underline="false" v-if="scope.row.disabled2" @click="batchfocus(scope.$index)" style="width: 100px;">{{ scope.row.batch || '--' }}</el-link>
								<el-input v-focus v-model="scope.row.batch_" v-if="!scope.row.disabled2" autofocus :disabled="scope.row.disabled2" @blur="handleblurbatch(scope.row.batch_, scope.$index)" size="mini" ></el-input>
							</template>
						</el-table-column>
						<el-table-column label="图片" prop="image" width="120">
							<template slot-scope="scope">
								<el-popover placement="right" title="" trigger="click">
									<img :src="scope.row.img" style="height: 500px;width: 500px">
									<img slot="reference" :src="scope.row.img" alt="" style="height: 50px;width: 50px">
								</el-popover>
							</template>
						</el-table-column>
						<el-table-column label="图样代号" prop="item_">
							<template slot-scope="scope">
								<span style="">{{ scope.row.item_ || '--' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="图样名称" prop="name">
							<template slot-scope="scope">
								<span style="">{{ scope.row.product_name || '--' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="材料" prop="material_">
							<template slot-scope="scope">
								<span style="">{{ scope.row.material_ || '--' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="型号规格" prop="specs_">
							<template slot-scope="scope">
								<span style="">{{ scope.row.specs_ || '--' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="数量" prop="number">
							<template slot-scope="scope">
								<span style="">{{ scope.row.number || '--' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="创建时间" prop="createTime">
							<template slot-scope="scope">
								<span style="">{{ scope.row.createTime}}</span>
							</template>
						</el-table-column>
						<el-table-column label="备注" prop="remark">
							<template slot-scope="scope">
								<span style="">{{ scope.row.remark || '--' }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="type" label="记录来源" width="130" :filters="[{ text: '入库', value: 1 },{ text: '托盘出库', value: 2 }, { text: '出库', value: 3 }]"
							:filter-method="filterTag" filter-placement="bottom-end" align="center">
							<template slot-scope="scope">
								<el-link :type="scope.row.type === 2 ? 'primary' : scope.row.type === 3 ? 'success' : scope.row.type === 1 ? 'info' : ''"
									:underline="false">
									{{scope.row.type_}}
								</el-link>
							</template>
						</el-table-column>
						<!-- <el-table-column label="操作" width="100">
							<template slot-scope="scope" v-if="scope.row.product_type==2 && scope.row.type==1">
								<el-button @click="submit(scope.$index,scope.row)" type="primary">导出</el-button>
							</template>
						</el-table-column> -->
					</el-table>
					<div class="block">
						<el-pagination @current-change="handleCurrentChange" :page-size="pagesize" layout="prev, pager, next, jumper"
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
	export default {
		name: 'Recorddetail',
		components: { Left, Head },
		computed: {
			...mapGetters({
				url: "geturl",
				token: "getToken"
			}),
		},
		data() {
			return {
				search_name: '',
				search_material: '',
				search_item: '',
				search_specs: '',
				go_num: '',
				pagesize: 10,
				currpage: 1,
				tableDatas: [],
				total: 0
			}
		},
		created() {
			this.getRecordList();
		},
		methods: {
			tableheader({ row, column, rowIndex, columnIndex }) {
				if (rowIndex === 0) {
					return 'height:70px;background:#e5e5e5'
				}
			},
			filterTag(value, row) {
				return row.type === value;
			},
			serial_numberfocus(index) {
				this.tableDatas[index].disabled1 = false;
			},
			handleblurserial_number(serial_number_, index) {
				var that = this;
				if (serial_number_ == that.tableDatas[index].serial_number) {
					// that.$message({ message: '未修改' });
					that.tableDatas[index].disabled1 = true;
				} else {
					// that.$message({ message: '修改前'+that.tableDatas[index].serial_number+',修改后'+serial_number_ });
					that.tableDatas[index].disabled1 = true;
					var data = {
						parts_id: that.tableDatas[index].id,
						batch: that.tableDatas[index].batch,
						serial_number: serial_number_,
					}
					that.recordupdate(data);
				}
			},
			batchfocus(index) {
				this.tableDatas[index].disabled2 = false;
			},
			handleblurbatch(batch_, index) {
				var that = this;
				if (batch_ == that.tableDatas[index].batch) {
					// that.$message({ message: '未修改' });
					that.tableDatas[index].disabled2 = true;
				} else {
					// that.$message({ message: '修改前'+that.tableDatas[index].batch+',修改后'+batch_ });
					that.tableDatas[index].disabled2 = true;
					var data = {
						parts_id: that.tableDatas[index].id,
						batch: batch_,
						serial_number: that.tableDatas[index].serial_number,
					}
					that.recordupdate(data);
				}
			},
			getRecordList() {
				var that = this;
				Date.prototype.toLocaleString = function() {
					return this.getFullYear() + "/" + ((this.getMonth() + 1) < 10 ? '0' + (this.getMonth() + 1) : (this.getMonth() +
						1)) + "/" + (this.getDate() < 10 ? '0' + this.getDate() : this.getDate()) + " " + (this.getHours() < 10 ?
						'0' + (this.getHours()) : this.getHours()) + ":" + (this.getMinutes() < 10 ? ('0' + this.getMinutes()) :
						this.getMinutes()) + ":" + (this.getSeconds() < 10 ? '0' + this.getSeconds() : this.getSeconds())
				};
				that.axios({
					method: 'GET',
					url: that.url + '/api/v1/record/detail',
					data: '',
					params: {
						page: that.currpage,
						size: that.pagesize,
						operation_id: that.$route.query.id
					},
					headers: {
						/* application/json */
						"content-type": "application/x-www-form-urlencoded",
						'token': that.token
					}
				}).then(function(response) {
					if (response && response.data && response.data.data && response.data.code == 200) {
						var data = response.data.data.list;
						that.total = response.data.data.count.total;
						for (var i = 0; i < data.length; i++) {
							data[i].disabled1 = true;
							data[i].disabled2 = true;
							data[i].serial_number_ = data[i].serial_number;
							data[i].batch_ = data[i].batch;
							data[i].type_ = data[i].type == 1 ? '入库' : data[i].type == 2 ? '托盘出库' : '出库';
							data[i].createTime = new Date(data[i].created_at * 1000).toLocaleString().slice(0, -3);
							// data[i].type_=data[i].type;
						
							var img_ = data[i].image;
							if (img_ == "" || img_ == undefined) {
								data[i].img = "http://zrui.e7vr.com/image/arm/default.gif";
							} else {
								data[i].img = data[i].image;
							}
						
							var specs_s = data[i].specs;
							if (specs_s == "" || specs_s == undefined || specs_s == null) {
								data[i].specs_ = "-- --";
							} else {
								data[i].specs_ = data[i].specs;
							}
						
						
							var material_s = data[i].material;
							if (material_s == "" || material_s == undefined || material_s == null) {
								data[i].material_ = "-- --";
							} else {
								data[i].material_ = data[i].material;
							}
						
							var item_s = data[i].item;
							if (item_s == "" || item_s == undefined || item_s == null) {
								data[i].item_ = "-- --";
							} else {
								data[i].item_ = data[i].item;
							}
						}
						that.tableDatas = data;
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			recordupdate(data) {
				var that = this;
				that.axios({
					method: 'POST',
					url: that.url + '/api/v1/record/update',
					data: '',
					params: data,
					headers: {
						/* application/json */
						"content-type": "application/x-www-form-urlencoded",
						'token': that.token
					}
				}).then(function(response) {
					if (response && response.data && response.data.data && response.data.code == 200) {
						that.$message({
							type: 'success',
							message: '修改成功',
							offset: 300
						});
						that.getRecordList();
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			handleCurrentChange(currpage) {
				this.currpage = currpage;
				this.getRecordList();
			},
		},
		directives: { //input获取焦点
			focus: {
				inserted: function(el) {
					el.querySelector('input').focus()
				}
			}
		},
	}
</script>

<style lang="less" scoped>
	.Recorddetail {
		margin-top: 10px;
		background: #FFFFFF;
		padding: 10px 10px 10px;
			
		.input_flex {
			
			.fl {
				display: -webkit-box;
				display: -ms-flexbox;
				display: flex;
			}
			
		}
		
		/deep/ .el-input-number--mini {
			width: 90px;
		}
	}
</style>
