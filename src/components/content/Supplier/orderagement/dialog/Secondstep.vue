<template>
    <div>
        <el-dialog
			class="Orderdialog"
            :visible.sync="SecondstepDialogVisible.dialog"
            top="10vh"
            :close-on-click-modal="false"
            :before-close="close"
            width="700px">
            <div class="Singledialog">
                <el-table
                    ref="SecondstepTableData"
                    :data="SecondstepTableData.tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="selectionChange"
                >
                    <el-table-column type="selection" :selectable="selectable" width="55" align="center"></el-table-column>
                    <el-table-column label="零件名称">
                        <template slot-scope="scope">{{ scope.row.product_name }}</template>
                    </el-table-column>
                    <el-table-column label="零件编号">
                        <template slot-scope="scope">{{ scope.row.parts_number }}</template>
                    </el-table-column>
                    <el-table-column label="批次">
                        <template slot-scope="scope">{{ scope.row.batch }}</template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">{{ scope.row.is_user == 0 ? '未使用' : '已使用' }}</template>
                    </el-table-column>
                </el-table>
                <div class="btn" v-if="SecondstepTableData.total>0">
					<div class="block">
						<el-pagination
							@current-change="handleCurrentChange"
							layout="prev, pager, next, jumper"
							:total="SecondstepTableData.total"
						></el-pagination>
					</div>
                    <!-- <el-button @click="toggleSelection">取消选择</el-button> -->
                    <el-button :disabled="ifBtn" @click="taskadd">确认选择</el-button>
                </div>
                
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
    name: "Secondstepdialog",
    computed: {
        ...mapState({
            url: state => state.url
        }),
        ...mapGetters({
            token: "getToken"
        })
    },
    props: {
        SecondstepDialogVisible: ""
    },
    data() {
        return {
            SecondstepTableData: {
                tableData: [],
                multipleSelection: [],
                currentPage: 1,
                pageSize: 10,
                total: 10
            },
            obj: {},
			ifBtn: false,
        };
    },
    methods: {
        getSecondstep(obj) {
            let that = this;
            that.obj = obj;
            that.axios({
                method: "POST",
                url: that.url + "/api/v1/supplier/next",
                data: "",
                params: {
                    order_id: obj.order_id, //order_id	                string	是	订单ID
                    product_id: obj.product_id, //product_id	            string	是	零件ID
                    procedure_detail_number: obj.procedure_detail_number, //procedure_detail_number	string	是	工序
                    batch: obj.batch //batch	                    string	是	批次
                },
                headers: {
                    "content-type": "application/json",
                    "token": that.token
                }
            }).then(response => {
                if ( response && response.data && response.data.data && response.data.code == 200 ) {
                    var data = response.data.data.list;
                    that.SecondstepTableData.tableData = data;
                }
            }).catch(error => {
                console.log(error);
            });
        },
        selectionChange(selection) {
            this.SecondstepTableData.multipleSelection = selection;
        },
        selectable (row, index) {
            return row.is_user === 0 // isHidden 0-否 1-是 返回false不可选
        },
        taskadd() {
			
            let selection = this.SecondstepTableData.multipleSelection;
            if (selection.length) {
				this.ifBtn = true;
                let parts_arr = [];
                selection.forEach(element => {
                    parts_arr.push(element.parts_number)
                });
                this.suppliertaskadd(this.obj, parts_arr)
            } else {
				this.ifBtn = false;
                this.$message({
                    type: "error",
                    message: "请选择工序零件",
                    offset: 300
                });
            }
        },

        suppliertaskadd(row, parts) {
            var that = this;
            var params = {
                order_detail_id: row.id,	    						// order_detail_id			string	是	订单详情ID
                product_id: row.product_id,								// product_id				string	是	零件ID
                procedure_id: row.procedure_id,							// procedure_id				string	是	工序ID
                procedure_detail_number: row.procedure_detail_number,	// procedure_detail_number	string	是	工序序号
                number: parts.length,										// number					string	是	数量
                type: 1,												// type						string	是	上传质检报告：1=统一上传，2=分个上传
                product_type: row.product_type,							// product_type				string	是	类型：1=标准化，2=非标准化
                batch: row.batch,                                       // batch	                string	是	批次
                order_id: row.order_id,                                 // order_id	                string	是	订单ID
                product_name: row.product_name,                         // product_name	            string	是	零件名称
                //parts: parts,                                           // parts	                array	是	零件编码(第一工序可以传为空)
                number_type: 2,                                         // number_type	            string	是	工序类型 1=第一道工序，2=非第一道工序
            }
			that.ifBtn = true;
            that.axios({
                method: "POST",
                url: that.url + "/api/v1/supplier/task-add",
                data: {
                    parts: parts        // parts	                array	是	零件编码(第一工序可以传为空)
                },
                params: params,
                headers: {
                    "content-type": "application/json",
                    "token": that.token
                }
            }).then(function(response) {
                if (response.data.code == 200) {
                    that.$message({
                        showClose: true,
                        message: "操作成功",
                        type: "success"
                    });
					that.ifBtn = false;
                    that.close();
                }
            }).catch(function(error) {
                console.log(error);
				that.ifBtn = false;
                that.$message({
                    type: "error",
                    message: "前一个工序未完成或者完成数量不足",
                    offset: 300
                });
            });
        },
        /* 分页 */
        handleCurrentChange(currentPage) {
            this.SecondstepTableData.currentPage = currentPage;
            this.getSecondstep(this.obj);
        },
        toggleSelection() {
            this.$refs.SecondstepTableData.clearSelection();
        },
        close() {
            this.$emit("change", false);
        }
    }
};
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
        height: 528px;
        overflow: auto;
    }
    .btn {
        display: flex;
		justify-content: space-between;
		
        .el-button {
            margin-top: 10px;
        }
    }
    .block {
		height: 30px;
		margin-top: 15px;
    }
}
</style>
