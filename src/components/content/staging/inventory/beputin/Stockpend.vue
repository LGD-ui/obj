<template>
	<!-- 待入库 当前修改版本-->
    <div class="stockpend">
        <!-- <div class="search">
    		<div class="demo-input-suffix">
    			<el-input suffix-icon="el-icon-search" style="width: 30.625rem;" v-model.trim="search_name"
    				autofocus  placeholder="搜索" @input="searchChange" @keyup.enter.native="searchChange">
    				<el-button slot="append" type="primary" @click="searchChange">搜索</el-button>
    			</el-input>
    			<el-button type="info" plain @click="clearSearchChange">全部</el-button>
    		</div>
        </div> -->
    
        <el-table
            :data="tableData.tableList"
            :header-cell-style="tableheader"
            v-loading="tableData.loading "
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.5)">
			<el-table-column label="订单编号">
			    <template slot-scope="scope">
					<span>{{ scope.row.send_time | formatDate }}</span>
			    </template>
			</el-table-column>
			<el-table-column label="快递单号">
			    <template slot-scope="scope">
					<el-link :underline="false" type="primary" size="small" @click="clickstockdata(scope.row)" v-if="scope.row.express_type">{{scope.row.express_numbers}}</el-link>
			    </template>
			</el-table-column>
            
            <el-table-column label="快递名称">
                <template slot-scope="scope">
                    <span style>{{ scope.row.express_type_name || '-- --' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发送单位">
                <template slot-scope="scope">
                    <span style>{{ scope.row.send_name || '-- --' }}</span>
                </template>
            </el-table-column>
			<el-table-column label="发货时间">
			    <template slot-scope="scope">
			        <span style>{{ scope.row.send_time }}</span>
			    </template>
			</el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-link :underline="false" type="primary" size="small" @click="clickstock(scope.row)" >详情</el-link>
                </template>
            </el-table-column>
        </el-table>
    
        <div class="block">
            <el-pagination
                @current-change="handleCurrentChange"
                layout="prev, pager, next, jumper"
                :page-size="tableData.pageSize"
                :total="tableData.total"
            ></el-pagination>
        </div>
		
		<DeData ref="childData" v-bind:DeliveryDataDialogVisible="DeliveryDataDialogVisible" @change="DeDataClose" />
		
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import moment from 'moment'
import DeData from "./dialog/DeliveryData.vue"
export default {
    name: "stockpend",
    components: {
        DeData
    },
    computed: {
        ...mapState({
            url: state => state.url
        }),
        ...mapGetters({
            token: "getToken"
        })
    },
	filters: {
		formatDate: function(val) {
			return moment(val).valueOf() / 1000;
		}
	},
    data() {
        return {
            search_name: "",
			parts_number: '',
            tableData: {
                loading: true,
                tableList: [],//15
                currentPage: 1,
                pageSize: 15,
                total: 0
            },
			DeliveryDataDialogVisible: {
			    dialog: false,
			    obj: '',
			},
        };
    },
    created() {
        this.getstockpend();
    },
    methods: {
        getstockpend() {
            let that = this;
            that.axios({
                method: "GET",
                url: that.url + "/api/v1/pattern/order/list",
                params: {
                    page: that.tableData.currentPage,
                    size: that.tableData.pageSize,
					name: that.search_name,
                },
                headers: {
                    "content-type": "application/json",
                    "token": that.token
                }
            }).then(response => {
                if ( response && response.data && response.data.data && response.data.code == 200 ) {
                    var data = response.data.data.list;
                    that.tableData.total = response.data.data.count.total;
                    that.tableData.tableList = data;
                    that.tableData.loading = false;
                }
            }).catch(error => {
                console.log(error);
                that.tableData.loading = false;
            });
        },
		// 详情
        clickstock(row) {
            this.$router.push({
            	path: '/stockpendlist',
            	query: {
            		express_type: row.express_type,
            		express_numbers: row.express_numbers,
            		send_supplier_id: row.send_supplier_id,
            		send_shop_id: row.send_shop_id,
					send_time: row.send_time
            	}
            })
        },
		// 物流详情
		clickstockdata(row) {
			this.DeliveryDataDialogVisible.dialog = true;
			this.DeliveryDataDialogVisible.obj = row;
			this.$refs.childData.getDedata();
		},
		/* 搜索 */
        searchChange() {
			this.tableData.currentPage = 1;
			if (!this.search_name) this.search_name = '';
			this.getstockpend();
        },
		/* 分页 */
        handleCurrentChange(currentPage) {
            this.tableData.currentPage = currentPage;
            this.getstockpend();
        },
		/* 清除搜索 */
        clearSearchChange() {
            this.search_name = "";
			this.tableData.currentPage = 1;
            this.getstockpend();
        },
        tableheader({ row, column, rowIndex, columnIndex }) {
            //表头样式
            if (rowIndex === 0) {
                return "height:50px;background:#e5e5e5";
            }
        },
		DeDataClose(param) {
			this.DeliveryDataDialogVisible.dialog = param;
		},
    }
};
</script>

<style lang="less" scoped>
.stockpend {
    background: #ffffff;
    .search {
        > div {
            display: flex;
            > .el-button {
                width: 80px;
                margin-left: 10px;
            }
        }
    }
    .el-table {
        margin: 1rem 0 1rem;
    }
}
</style>