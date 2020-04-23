<template>
    <div>
        <el-dialog
            :visible.sync="SecondstepDialogVisible.dialog"
            :modal="false"
            top="10vh"
            :show-close="false"
            :before-close="close"
            width="700px"
        >
            <div class="Singledialog">
                <el-table
                    ref="SecondstepTableData"
                    :data="SecondstepTableData.tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                >
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column label="零件名称">
                        <template slot-scope="scope">{{ scope.row.product_name }}</template>
                    </el-table-column>
                    <el-table-column label="零件编号">
                        <template slot-scope="scope">{{ scope.row.parts_number }}</template>
                    </el-table-column>
                    <el-table-column label="工序">
                        <template slot-scope="scope">{{ scope.row.procedure_name }}</template>
                    </el-table-column>
                </el-table>
                <div class="btn" v-if="SecondstepTableData.total>0">
                    <el-button @click="toggleSelection">取消选择</el-button>
                    <el-button >确认选择</el-button>
                </div>
                <div class="block">
                    <el-pagination
                        v-if="SecondstepTableData.total>10"
                        @current-change="handleCurrentChange"
                        layout="prev, pager, next, jumper"
                        :total="SecondstepTableData.total"
                    ></el-pagination>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
    name: "Secondstepdialog",
    components: {},
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
                tableData: [
                    {
                        product_name: '谐波轴安装座',
                        parts_number: 'z2HZYOqf',
                        procedure_name: '测试工序',
                    }, {
                        product_name: '谐波轴安装座',
                        parts_number: 'z2HZYOqf',
                        procedure_name: '测试工序',
                    }, {
                        product_name: '谐波轴安装座',
                        parts_number: 'z2HZYOqf',
                        procedure_name: '测试工序',
                    },
                ],
                multipleSelection: [],
                currentPage: 1,
                pageSize: 10,
                total: 10
            }
        };
    },
    methods: {
        // getSecondstep(obj) {
        //     let that = this;
        //     that.axios({
        //         method: "POST",
        //         url: that.url + "/api/v1/supplier/task-detail",
        //         data: "",
        //         params: {
        //             page: that.SecondstepTableData.currentPage,
        //             size: that.SecondstepTableData.pageSize,
        //             task_id: that.obj.id //任务id，库存列表不传递
        //         },
        //         headers: {
        //             "content-type": "application/json",
        //             token: that.token
        //         }
        //     }).then(response => {
        //         if (
        //             response &&
        //             response.data &&
        //             response.data.data &&
        //             response.data.code == 200
        //         ) {
        //             var data = response.data.data.list;
        //             that.SecondstepTableData.total =
        //                 response.data.data.count.total;
        //             data.map((item, index) => {
        //                 if (item.fileList0) {
        //                     item.fileList0 = item.fileList0;
        //                 } else {
        //                     item.fileList0 = "";
        //                 }
        //                 item.index_ = index;
        //                 return item;
        //             });
        //             that.SecondstepTableData.tableData = data;
        //         }
        //     }) .catch(error => {
        //         console.log(error);
        //     });
        // },

        // /* 单个上传质检报告 */
        // postSingle(row) {
        //     let that = this;
        //     if (row.fileList0) {
        //         var params = {
        //             type: 2, // type	string	是	上传质检报告：1=统一上传，2=分个上传
        //             task_id: "", // task_id	string	是	计划ID
        //             parts_id: row.id, // parts_id	string	是	具体零件ID
        //             presen_url: row.fileList0 // presen_url	string	是	工序地址
        //         };
        //         that.axios({
        //             method: "POST",
        //             url: that.url + "/api/v1/supplier/task-update",
        //             data: "",
        //             params: params,
        //             headers: {
        //                 "content-type": "application/json",
        //                 token: that.token
        //             }
        //         }).then(response => {
        //             if (response && response.data.code == 200) {
        //                 that.$message({
        //                     message: "操作成功",
        //                     type: "success",
        //                     offset: 300
        //                 });
        //                 that.singleTableData.tableData[
        //                     that.row.index_
        //                 ].presen_url = row.fileList0;
        //                 // that.getSingle();
        //             }
        //         }).catch(error => {
        //             console.log(error);
        //         });
        //     } else {
        //         that.$message({
        //             message: "请上传附件",
        //             type: "warning",
        //             offset: 300
        //         });
        //     }
        // },
        // /* 分页 */
        // handleCurrentChange(currentPage) {
        //     this.SecondstepTableData.currentPage = currentPage;
        //     this.getSecondstep();
        // },
        toggleSelection() {
            this.$refs.SecondstepTableData.clearSelection();
        },
        close() {
            this.$emit("change", false);
        },
        // changeRowClick(row, column, event) {
        //     this.row = row;
        // },
        // /* 上传文件开始 */
        // beforeUpload(file) {
        //     //需要上传的文件
        //     this.update(file);
        // },
        // update(file) {
        //     //上传附件（此时执行的是上传到服务器）
        //     var that = this;
        //     let postData = new FormData(); //创建form对象
        //     postData.append("file", file); //通过append向form对象添加数据
        //     that.axios
        //         .post(that.url + "/api/v1/upload", postData, {
        //             headers: {
        //                 "content-type": "application/x-www-form-urlencoded",
        //                 token: that.token
        //             }
        //         })
        //         .then(function(response) {
        //             if (
        //                 response &&
        //                 response.data &&
        //                 response.data.data &&
        //                 response.data.code == 200
        //             ) {
        //                 that.singleTableData.tableData[
        //                     that.row.index_
        //                 ].fileList0 = response.data.data.url;
        //             }
        //         })
        //         .catch(function(error) {
        //             console.log(error);
        //         });
        // }
        // /* 上传文件结束 */
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
        text-align: right;
        .el-button {
            margin-top: 10px;
        }
    }
    .block {
        text-align: center;
        margin-top: 10px;
    }
}
</style>
