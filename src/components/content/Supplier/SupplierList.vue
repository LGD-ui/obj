<template>
	<el-container>
		<Left/>
		<el-container>
			<el-main style="padding: 10px;">
				<Head/>
				<div class="container">
				      <div class="search">
				          <div class="demo-input-suffix" style="width: 35rem;">
				          图样名称：
				              <el-input
				                  placeholder="请输入内容"
				                  prefix-icon="el-icon-search"
				                  v-model.trim="search_name" style="width: 78%">
				              </el-input>
				          </div>
				          <div class="demo-input-suffix" style="">
				              <el-button type="primary" @click="getData('search')">搜索</el-button>
				          </div>
				          <div class="demo-input-suffix" @click="getData('initData')" style="margin-left: 10px;">
				              <el-button type="primary">全部</el-button>
				          </div>
				      </div>
				
				      <el-table :data="tableData" style="width: 100%;margin-top:1rem;margin-bottom:1rem;" :header-cell-style="tableheader">
				          <el-table-column label="序号" width="100">
				              <template slot-scope="scope">
				                  <span style="">{{ scope.row.id }}</span>
				              </template>
				          </el-table-column>
				          <el-table-column label="图片" prop="image" width="120">
				              <template slot-scope="scope">
				                  <el-popover v-if="scope.row.fix_image" placement="right" title="" trigger="hover">
				                      <img :src="scope.row.fix_image" style="height: 500px;width: 500px">
				                      <img slot="reference" :src="scope.row.fix_image" alt="" style="height: 50px;width: 50px">
				                  </el-popover>
				                  <el-popover v-else placement="right" title="" trigger="hover">
				                      <img src="http://zrui.e7vr.com/image/arm/default.gif" style="height: 500px;width: 500px">
				                      <img slot="reference" src="http://zrui.e7vr.com/image/arm/default.gif" alt="" style="height: 50px;width: 50px">
				                  </el-popover>
				              </template>
				          </el-table-column>
				          <el-table-column label="图样名称" prop="name_">
				              <template slot-scope="scope">
				                  <span v-if="scope.row.fix_name" style="">{{ scope.row.fix_name }}</span>
				                  <span v-else>-- --</span>
				              </template>
				          </el-table-column>
				          <el-table-column label="图样代号" prop="name_">
				              <template slot-scope="scope">
				                  <span v-if="scope.row.item" style="">{{ scope.row.item }}</span>
				                  <span v-else>-- --</span>
				              </template>
				          </el-table-column>
				          <el-table-column label="型号规格" prop="number">
				              <template slot-scope="scope">
				                  <span v-if="scope.row.specs" style="">{{ scope.row.specs }}</span>
				                  <span v-else>-- --</span>
				              </template>
				          </el-table-column>
				          <el-table-column label="类别码" prop="createTime">
				              <template slot-scope="scope">
				                  <span v-if="scope.row.category" style="">{{ scope.row.category }}</span>
				                  <span v-else>-- --</span>
				              </template>
				          </el-table-column>
				          <el-table-column label="材料" prop="material_">
				              <template slot-scope="scope">
				                  <span v-if="scope.row.material" style="">{{ scope.row.material }}</span>
				                  <span v-else>-- --</span>
				              </template>
				          </el-table-column>
				          <el-table-column label="总数量" prop="createTime">
				              <template slot-scope="scope">
				                  <span v-if="scope.row.stock" style="">{{ scope.row.stock }}</span>
				                  <span v-else>-- --</span>
				              </template>
				          </el-table-column>
				          <el-table-column label="备注" prop="createTime">
				              <template slot-scope="scope">
				                  <span v-if="scope.row.note" style="">{{ scope.row.note }}</span>
				                  <span v-else>-- --</span>
				              </template>
				          </el-table-column>
				          <el-table-column label="创建时间" prop="createTime">
				              <template slot-scope="scope">
				                  <span style="">{{ scope.row.created_at | formatDate}}</span>
				              </template>
				          </el-table-column>
				      </el-table>
				      <div class="block">
				          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next, jumper"
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
    name: 'SupplierList',
	components: { Left, Head },
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
        this.getData('initData');
    },
    filters: {
        formatDate: function(val) {
            let newDate = new Date(val * 1000).toLocaleString();
            return newDate;
        }
    },
     computed: {
        ...mapGetters({
        	url: "geturl",
        	token: "getToken"
        })
    },
    methods: {
        getData(type) {
            let that = this;
            let url = `${this.url}/api/v1/supplier/list`;
            let name = type == 'initData' ? '' : this.search_name;
            this.axios.get(url, {
                params: {
                    page: that.currentPage,
                    size: that.pageSize,
                    name: name
                },
                headers: {
                    token: that.token
                }
            }).then( res => {
				if (res && res.data && res.data.data && res.data.code == 200) {
					that.tableData = res.data.data.list;
					that.pageSize = Number(res.data.data.count.size);
					that.total = res.data.data.count.total;
				}
            })
        },
        tableheader({row, column, rowIndex, columnIndex}) {
            if (rowIndex === 0) {
                return 'height: 70px;background: #e5e5e5';
            }
        },
        handleSizeChange(e) {},
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
            this.getData('search');
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
    .title{
        padding: 10px;
    }
    .search{
        display: flex;
    }
</style>