<template>
    <div>
        <el-dialog class="Productiondialog1" :visible.sync="UpfileDialogVisible.dialog" title="上传质检报告" top="10vh" :close-on-click-modal="false" @close="close" width="900px">
            <!-- <div class="head_tab">
				<div class="tab" @click="clickTab(1)">批量上传</div>
				<div class="tab" @click="clickTab(2)">逐个上传</div>
			</div> -->
			<div class="Batchdialog" v-if="UpfileDialogVisible.obj.t == 1">
				<el-form label-width="110px" class="demo-ruleForm">
					<el-form-item label="名称：">
						<el-input v-model="UpfileDialogVisible.obj.product_name" disabled></el-input>
					</el-form-item>
					<el-form-item label="工序：">
						<el-input v-model="UpfileDialogVisible.obj.procedure_name" disabled></el-input>
					</el-form-item>
					<el-form-item label="数量：">
						<el-input v-model="UpfileDialogVisible.obj.number" disabled></el-input>
					</el-form-item>
					<el-form-item label="生产编号：">
						<el-input v-model="UpfileDialogVisible.obj.procedure_detail_number" disabled></el-input>
					</el-form-item>
					<el-form-item label="上传附件：" required>
						<el-upload
							drag
							action=""
							:show-file-list="true"
							:file-list="fileList"
							:before-upload="beforeUpload"
							:on-remove="handleRemove"
							style="line-height: 1;">
							<i class="el-icon-upload"></i>
							<div class="el-upload__text" style="line-height: 1;">将文件拖到此处，或<em>点击上传</em></div>
							<div class="el-upload__tip" slot="tip" style="line-height: 1;">
								只能上传jpg/png文件，且不超过500kb
								<el-button type="text" style="width: 70px !important;" v-if="photoimglist.length == 0 && fileList.length == 0" @click="cropperPhoto.dialog=true">拍照</el-button>
								<div class="photolist">
									<div class="list" :style="'width: calc(55px *'+ photoimglist.length +');'">
										<div class="imglist" v-for="(tag, i) in photoimglist" :key="i">
											<i class="el-icon-error" @click="handleClose(tag)"></i>
											<el-popover v-if="tag.slice(-3) == 'pdf'" placement="left" title="" trigger="hover">
												<iframe width="500" height="750" :src="tag"> </iframe>
												<iframe slot="reference" width="50" height="50" :src="tag" style="height: 50px;width: 50px;min-height: 50px;min-width: 50px"></iframe>
											</el-popover>
											<el-popover v-else placement="left" title="" trigger="hover">
												<img :src="tag" style="height: 500px;">
												<img slot="reference" :src="tag"  alt="" style="height: 50px;width: 50px;min-height: 50px;min-width: 50px">
											</el-popover>
										</div>
									</div>
									
								</div>
							</div>
						</el-upload>
					</el-form-item>
					
					<el-form-item>
						<el-button type="primary" :disabled="uBtn" @click="postBatch">提交</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="Singledialog" v-if="UpfileDialogVisible.obj.t == 2">
				<el-table ref="singleTableData" :data="singleTableData.tableData" @row-click="changeRowClick">
					<el-table-column label="序号" width="60">
						<template slot-scope="scope">
							<span>{{ scope.row.task_id || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="零件名称">
						<template slot-scope="scope">
							<span>{{ scope.row.product_name || '-- --' }}</span>
						</template>
					</el-table-column>
			        <el-table-column label="零件编码" width="100px">
						<template slot-scope="scope">
							<span>{{ scope.row.parts_number || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="数量">
						<template slot-scope="scope">
							<span>{{ scope.row.number || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="批次">
						<template slot-scope="scope">
							<span>{{ scope.row.batch || '-- --' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="附件" align="center" width="110">
						<template slot-scope="scope">
							<span v-if="scope.row.presen_url">
								<el-popover v-if="scope.row.pdf" placement="left" title="" trigger="click">
									<iframe width="500" height="750" :src="scope.row.presen_url"></iframe>
									<el-link :underline="false" type="primary" slot="reference">查看</el-link>
									<!-- <iframe slot="reference" width="50" height="50" :src="scope.row.presen_url" style="height: 50px;width: 50px;min-height: 50px;min-width: 50px"></iframe> -->
								</el-popover>
								<el-popover v-else placement="left" title="" trigger="click">
									<img :src="scope.row.presen_url || nullImg" style="height: 500px;">
									<el-link :underline="false" type="primary" slot="reference">查看</el-link>
									<!-- <img slot="reference" :src="scope.row.presen_url || nullImg"  alt="" style="height: 50px;width: 50px;min-height: 50px;min-width: 50px"> -->
								</el-popover>
								<el-link :underline="false" type="danger"  @click="deletfile(scope.row)">
									<i class="el-icon-error" style="margin-left: 5px;"></i>
								</el-link>
							</span>
							<span v-else>
								<el-upload
									class="upload-demo"
									action=""
									:show-file-list="false"
									:before-upload="beforeUpload">
									<el-button size="mini" type="text">上传附件</el-button>
								</el-upload>
							</span>
						</template>
					</el-table-column>
					<!-- <el-table-column label="操作" align="center" width="150px">
						<template slot-scope="scope">
							<span v-if="scope.row.presen_url">
								<el-link :underline="false" type="danger" @click="deletfile(scope.row)">删除</el-link>
							</span>
							<span v-else>
								<el-upload
									class="upload-demo"
									action=""
									:show-file-list="false"
									:before-upload="beforeUpload">
									<el-button size="mini" type="text">上传附件</el-button>
								</el-upload>
							</span>
							
						</template>
					</el-table-column> -->
				</el-table>
				<div class="block">
					<el-pagination 
						v-if="singleTableData.total>10" 
						@current-change="handleCurrentChange" 
						layout="prev, pager, next, jumper"
						:total="singleTableData.total">
					</el-pagination>
				</div>
			</div>
			 
			
        </el-dialog>
		<!-- Picture editing popover -->
		<cropperPhoto v-bind:centerDialogVisible="cropperPhoto.dialog" @change="changeClose"></cropperPhoto>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import cropperPhoto from './CropperPhoto.vue'
export default {
    name: 'Upfiledialog',
	components: { cropperPhoto },
    computed: {
        ...mapState({
            url: state => state.url,
        }),
        ...mapGetters({
            token: "getToken"
        })
    },
    props: {
        UpfileDialogVisible: '',
    },
    data() {
        return {
			tab: 1,
            fileList: [],
			photoimglist: [],
            obj: {},
			ids: '',
            singleTableData: {
                tableData: [], //10
                currentPage: 1,
                pageSize: 10,
                total: 0,
            },
            row: {},
            nullImg: 'http://zrui.e7vr.com/image/arm/default.gif',
			cropperPhoto: {
				dialog: false
			},
			uBtn: false,
        }
    },
    methods: {
		clickTab(tab) {
			this.tab = tab;
			if (tab == 2) {
				this.getSingle(this.UpfileDialogVisible.obj.id);
			}
		},
		//  单个列表
		getSingle(id) {
		    let that = this;
		    that.axios({
		        method: 'POST',
		        url: that.url + '/api/v1/supplier/task-detail',
		        data: '',
		        params: {
		            page: that.singleTableData.currentPage,
		            size: that.singleTableData.pageSize,
		            task_id: id || that.UpfileDialogVisible.obj.id,	//任务id，库存列表不传递
		        },
		        headers: {
		            "content-type": "application/json",
		            'token': that.token
		        }
		    }).then( response => {
		        if (response && response.data && response.data.data && response.data.code == 200) {
		            var data = response.data.data.list;
		            that.singleTableData.total = response.data.data.count.total;
		            data.map((item, index) => {
		                if (item.fileList0) {
		                    item.fileList0 = item.fileList0;
		                } else {
		                    item.fileList0 = '';
		                }
						item.pdf = false;
						if (item.presen_url) {
							if (item.presen_url.slice(-3) == 'pdf') item.pdf = true;
							if (item.presen_url.slice(0, 5) == 'http:') {
								item.presen_url = item.presen_url.slice(0, 4) + 's' + item.presen_url.slice(4);
							}
							
						}
		                item.index_ = index;
		                return item;
		            })
		            that.singleTableData.tableData = data;
		        }
		    }).catch( error => {
		        console.log(error)
		    });
		},
		/* 分页 */
		handleCurrentChange(currentPage) {
		    this.singleTableData.currentPage = currentPage;
		    this.getSingle();
		},
		changeRowClick(row, column, event) {
		    this.row = row;
		},
		
		
		beforeUpload(file) { //需要上传的文件
			if (this.UpfileDialogVisible.obj.t == 1) {
				this.update(file);
			} else if (this.UpfileDialogVisible.obj.t == 2) {
				this.update1(file);
			}
		},
		/* *************  批量上传  ***************** */
        // 统一
        /* 批量上传质检报告 */
        postBatch() {
            let that = this;
            if (that.fileList[0] || that.photoimglist[0]) {
				var params = {};
				that.uBtn = true;
				if (that.UpfileDialogVisible.obj.u == 1) {
					params = {
					    product_id: that.UpfileDialogVisible.obj.product_id,	// task_id	string	是	计划ID
					    presen_url: that.photoimglist[0] || that.fileList[0].url,			// presen_url	string	是	工序地址
					}
					// console.log(params)
					that.axios({
					    method: 'GET',
					    url: that.url + '/api/v1/supplier/upload-many',
					    data: '',
					    params: params,
					    headers: {
					        "content-type": "application/json",
					        "token": that.token
					    }
					}).then( response => {
					    if (response && response.data.code == 200) {
					        that.$message({
					            message: '操作成功',
					            type: 'success',
					            offset: 300
					        })
					        that.close()
					    }
					}).catch( error => {
					    console.log(error)
						that.uBtn = false;
					});
					
				} else {
					// 单个
					params = {
					    type: 1,									// type	string	是	上传质检报告：1=统一上传，2=分个上传
					    task_id: that.UpfileDialogVisible.obj.id,	// task_id	string	是	计划ID
					    parts_id: '',								// parts_id	string	是	具体零件ID
					    presen_url: that.photoimglist[0] || that.fileList[0].url,			// presen_url	string	是	工序地址
					}
					// console.log(params)
					that.axios({
					    method: 'POST',
					    url: that.url + '/api/v1/supplier/task-update',
					    data: '',
					    params: params,
					    headers: {
					        "content-type": "application/json",
					        "token": that.token
					    }
					}).then( response => {
					    if (response && response.data.code == 200) {
					        that.$message({
					            message: '操作成功',
					            type: 'success',
					            offset: 300
					        })
					        that.close()
					    }
					}).catch( error => {
					    console.log(error)
						that.uBtn = false;
					});
				}
                
				
				
            } else {
                that.$message({
                    message: '请上传附件',
                    type: 'warning',
                    offset: 300
                })
            }
            
        },
        
        /* 上传文件开始 */
        handleRemove(file, fileList) {
            this.fileList = [];
        },
        
		// 批量上传
        update(file) { //上传附件（此时执行的是上传到服务器）
            var that = this;
            let postData = new FormData(); //创建form对象
            postData.append('file', file); //通过append向form对象添加数据
            that.axios.post(that.url + '/api/v1/upload', postData, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'token': that.token
                }
            }).then(function(response) {
                if (response && response.data && response.data.data && response.data.code == 200) {
                    that.fileList = [];
					let url = response.data.data.url;
					if (url.slice(0, 5) == 'http:') url = url.slice(0, 4) + 's' + url.slice(4);
                    that.fileList.push({
                        name: file.name,
                        url: url
                    })
                }
                
            }).catch(function(error) {
                console.log(error);
            });
        },
        /* 上传文件结束 */
        

        
        /* *************  单个上传  ***************** */
        /* 单个上传质检报告 */
		postSingle() {
            let that = this;
            if (that.row.fileList0) {
                var params = {
                    type: 2,									// type	string	是	上传质检报告：1=统一上传，2=分个上传
                    task_id: that.row.task_id,								// task_id	string	是	计划ID
                    parts_id: that.row.id,					// parts_id	string	是	具体零件ID
                    presen_url: that.row.fileList0,			// presen_url	string	是	工序地址
                }
                that.axios({
                    method: 'POST',
                    url: that.url + '/api/v1/supplier/task-update',
                    data: '',
                    params: params,
                    headers: {
                        "content-type": "application/json",
                        "token": that.token
                    }
                }).then( response => {
                    if (response && response.data.code == 200) {
                        that.$message({
                            message: '操作成功',
                            type: 'success',
                            offset: 300
						})
						that.getSingle();
                    }
                }).catch( error => {
                    console.log(error)
                });
            } else {
                that.$message({
                    message: '请上传附件',
                    type: 'warning',
                    offset: 300
                })
            }
            
        },
        
        // 单个上传附件
        update1(file) { //上传附件（此时执行的是上传到服务器）
            var that = this;
            let postData = new FormData(); //创建form对象
            postData.append('file', file); //通过append向form对象添加数据
            that.axios.post(that.url + '/api/v1/upload', postData, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'token': that.token
				}
            }).then(function(response) {
                if (response && response.data && response.data.data && response.data.code == 200) {
					let url = response.data.data.url;
					if (url.slice(0, 5) == 'http:') url = url.slice(0, 4) + 's' + url.slice(4);
					that.singleTableData.tableData[that.row.index_].presen_url = url;
					that.singleTableData.tableData[that.row.index_].fileList0 = url;
					that.postSingle();
                }
                
            }).catch(function(error) {
                console.log(error);
            });
        },
        
		// 删除
		deletfile(row) {
			let that = this;
			const h = this.$createElement;
			that.$msgbox({
			    title: '提示-删除附件',
			    message: h('p', null, [
			        h('span', null, '确认要删除编号'),
					h('span', { style: 'color: teal' }, row.task_id),
					h('span', null, '编码'),
					h('span', { style: 'color: teal' }, row.parts_number),
					h('span', null, '名称'),
			        h('span', { style: 'color: teal' }, row.product_name),
					h('span', null, '的附件')
			    ]),
			    showClose: false,
			    showCancelButton: true,
			    confirmButtonText: '确定',
			    cancelButtonText: '取消',
			    beforeClose: (action, instance, done) => {
			        if (action === 'confirm') {
			            instance.confirmButtonLoading = true;
			            instance.confirmButtonText = '删除中...';
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
			    that.axios({
			    	method: 'POST',
			    	url: that.url + '/api/v1/supplier/task-preview',
			    	params: {
			    		type: 2,
			    		task_id: row.task_id,
			    		parts_id: row.id,
			    		handle_type: 2
			    	},
			    	headers: {
			    		"content-type": "application/json",
			    		"token": that.token
			    	}
			    }).then( response => {
			    	if (response && response.data && response.data.code == 200) {
			    		that.$message({
			    		    showClose: true,
			    		    message: '操作成功',
			    		    type: 'success'
			    		})
						that.getSingle();
			    	}
			    }).catch( error => {
			    	console.log(error)
			    });
			});
		},
		
		
		
		/* 上传文件结束 */
        
		// 删除当前拍照的图片
		handleClose(tag) {
			this.photoimglist.splice(this.photoimglist.indexOf(tag), 1);
		},


		// 拍照弹窗
		changeClose(param) {
			if (param.fileimgurl.url) {
				let url = param.fileimgurl.url;
				if (url.slice(0, 5) == 'http:') url = url.slice(0, 4) + 's' + url.slice(4);
				this.photoimglist.push(url);
			}
			this.cropperPhoto.dialog = param.start;
		},
        close() {
			this.singleTableData.tableData = [];
            this.fileList = [];
			this.photoimglist = [];
			this.tab = 1;
			this.uBtn = false;
            this.$emit("change", false);
        },
        
        
    },
}
</script>

<style lang="less" scoped>
	
	/deep/ .el-dialog__body {
		padding: 0 20px 20px;
	}
	.head_tab {
		margin-bottom: 20px;
		.tab {
			display: inline-block;
			padding: 2px 10px;
			margin-right: 10px;
			cursor: pointer;
			border-bottom: 2px solid transparent;
			&:hover {
				border-bottom-color: #606266;
			}
		}
	}
	.Batchdialog {
		// height: 445px;
		// overflow: auto;
		.demo-ruleForm {
			width: 500px;
			margin: 0 auto;
			.el-input, .el-select, .el-button {
				width: 360px;
			}
			.el-form-item {
				width: 470px;
			}
			
			.photolist {
				overflow: auto;
				overflow-y: hidden;
				.list {
					
					padding-top: 10px;
					.imglist {
						float: left;
						width: 50px;
						height: 50px;
						margin-right: 5px;
						position: relative;
						.el-icon-error {
							position: absolute;
							top: -5px;
							right: -5px;
							font-size: 20px;
							cursor: pointer;
							&:hover {
								color: #f78383;
							}
						}
					}
				}
				
			}
			
		}
	}
	.Singledialog {
		/deep/ .el-table {
			height: 698px;
			overflow: auto;
			.el-button {
				width: 80px;
			}
		}
		// /deep/ .el-table td, .el-table th {
		// 	padding: 5px 0 0;
		// }
		.block {
			text-align: center;
			margin-top: 10px;
		}
	}
</style>