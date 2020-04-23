<template>
	<el-container>
		<Left/>
		<el-container>
			<el-main style="padding: 10px;">
				<Head/>
				<div class="container">
					  <div class="search">
					  	<div class="demo-input-suffix" style="display: flex;">
					  		<el-input suffix-icon="el-icon-search" style="width: 30.625rem;" v-model.trim="search_name"
					  			autofocus placeholder="图样名称搜索" @keyup.enter.native="getData">
					  			<el-button slot="append" type="primary" @click="getData">搜索</el-button>
					  		</el-input>
					  		<el-button type="primary" style="width: 80px;margin-left: 10px;" @click="getallData">全部</el-button>
					  	</div>
					  </div>
				
				      <el-table :data="tableData" style="width: 100%;margin-top:1rem;margin-bottom:1rem;" :header-cell-style="tableheader">
				          <el-table-column label="序号" width="60">
				              <template slot-scope="scope">
				                  <span style="">{{ scope.row.id }}</span>
				              </template>
				          </el-table-column>
				          <el-table-column label="图片" width="70">
				              <template slot-scope="scope">
				                  <el-popover v-if="scope.row.image" placement="right" title="" trigger="hover">
				                      <img :src="scope.row.image" style="height: 500px;width: 500px">
				                      <img slot="reference" :src="scope.row.image"  alt="" style="height: 50px;width: 50px">
				                  </el-popover>
				                  <el-popover v-else  placement="right" title="" trugger="click">
				                      <img src="http://zrui.e7vr.com/image/arm/default.gif" alt="defaultPic" style="height: 500px;width: 500px">
				                      <img slot="reference" src="http://zrui.e7vr.com/image/arm/default.gif"  alt="" style="height: 50px;width: 50px">
				                  </el-popover>
				              </template>
				          </el-table-column>
				           <el-table-column label="图样代号" prop="name_">
				              <template slot-scope="scope">
				                  <span>{{ scope.row.item || '-- --' }}</span>
				              </template>
				          </el-table-column>
				          <el-table-column label="图样名称" prop="name_">
				              <template slot-scope="scope">
				                  <span>{{ scope.row.name || '-- --' }}</span>
				              </template>
				          </el-table-column>
				          <el-table-column label="材料" prop="material_">
				              <template slot-scope="scope">
				                  <span >{{ scope.row.material || '-- --' }}</span>
				              </template>
				          </el-table-column>
				           <el-table-column label="型号规格" prop="name_">
				              <template slot-scope="scope">
				                  <span>{{ scope.row.specs || '-- --' }}</span>
				              </template>
				          </el-table-column>
				          <el-table-column label="数量" prop="number">
				              <template slot-scope="scope">
				                  <span>{{ scope.row.stock || '-- --' }}</span>
				              </template>
				          </el-table-column>
				           <el-table-column label="创建时间" prop="createTime" min-width="130">
				              <template slot-scope="scope">
				                  <span>{{ scope.row.created_at | formatDate}}</span>
				              </template>
				          </el-table-column>
				           <el-table-column label="备注" prop="name_">
				              <template slot-scope="scope">
				                  <span>{{ scope.row.note || '-- --' }}</span>
				              </template>
				          </el-table-column>
				          <el-table-column label="操作" width="180" align="center">
				              <template slot-scope="scope">
				                  <div v-if="scope.row.type == 2">
				                      <el-button type="primary" @click="output(scope.row.product_id)">导出</el-button>
				                      <el-button type="primary" @click="details(scope.row.name, scope.row.id)">详情</el-button>
				                  </div>
				              </template>
				          </el-table-column>
				      </el-table>
				      <div class="block">
				          <el-pagination @size-change="handleSizeChange" 
				              @current-change="handleCurrentChange" 
				              :page-size="pageSize" 
				              layout="prev, pager, next, jumper"
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
import moment from 'moment'
export default {
    name: 'SupplierList',
	components: {
		Left, Head
	},
    data() {
        return {
            tableData: [],
            count: {},
            search_name: '',
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
            return moment(val*1000).format("YYYY/MM/DD")
        }
    },
	computed: {
        ...mapGetters({
        	url: "geturl",
        	token: "getToken"
        })
    },
    methods: {
        getData() {
            let that = this;
            let url = `${this.url}/api/v1/supplier/log-list`;
            this.axios.get(url, {
                params: {
                    page: that.currentPage,
                    size: that.pageSize,
                    name: that.search_name
                },
                headers: {
                    token: that.token
                }
            }).then( res => {
				if (res && res.data && res.data.data && res.data.code == 200) {
					var data = res.data.data.list;
					that.total = res.data.data.count.total;
					that.tableData = [...data];
				}
            }).catch( err => {
                this.$message({
                    showClose: true,
                    message: '网络请求出错',
                    type: 'error'
                })
            })
        },
		getallData() {
			this.search_name = '';
			this.getData()
		},
        tableheader({row, column, rowIndex, columnIndex}) {
            if (rowIndex === 0) {
                return 'height: 70px;background: #e5e5e5';
            }
        },
        // pagination
        handleSizeChange(e) {},
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage
            this.getData();
        },
        output(id) {
            // 导出详情
            let that = this;
			that.axios({
				method: 'GET',
				url: that.url + '/api/v1/supplier/export',
				data: '',
				params: {
					log_id: id
				},
				headers: {
					"content-type": "application/json",
					'token': that.token
				}
			}).then(function(response) {
				if (response.data.code == 200) {
					that.$message({
					    showClose: true,
					    message: '成功导出',
					    type: 'success'
					})
				}
			}).catch(function(error) {
				that.$message({
				    showClose: true,
				    message: '导出出错',
				    type: 'error'
				})
			});
        },
        details(name, id) {
            this.$router.push({name: 'SupplierDetails', query: {name: name, id: id}})
        }
    },
   
}
</script>

<style scope>
    .container{
        background: #FFFFFF;
        margin-top: 10px;
        padding: 10px;
        border-radius: 10px;
    }
   
    .search{
        display: flex;
    }
</style>