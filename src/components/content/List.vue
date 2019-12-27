<template>
  <div class="List">
    <!-- <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
   <el-tab-pane label="产品列表" name="first">
      <ListChild1></ListChild1>
    </el-tab-pane>
    <el-tab-pane label="添加产品" name="second">
      <ListChild2></ListChild2>
    </el-tab-pane>
  </el-tabs> -->
    <div class="input_flex">
      <!-- <el-button type="primary" icon="el-icon-circle-plus">新增</el-button> -->
      <div class="fl">
        <!-- <el-input v-model="search" placeholder="请输入搜索内容" size="small" prefix-icon="el-icon-search"></el-input> -->
        <div class="demo-input-suffix">
                     图样名称：
                     <el-input
                       placeholder="请输入内容"
                       prefix-icon="el-icon-search"
                       v-model="search">
                     </el-input>
                   </div>
                   <div class="demo-input-suffix">
                     序号方式：
                     <el-input
                       placeholder="请输入内容"
                       prefix-icon="el-icon-search"
                       v-model="search_id">
                     </el-input>
                   </div>
                   <div class="demo-input-suffix">
                     图样代号：
                     <el-input
                       placeholder="请输入内容"
                       prefix-icon="el-icon-search"
                       v-model="search_item">
                     </el-input>
                   </div>
                   <div class="demo-input-suffix">
                     型号规格：
                     <el-input
                       placeholder="请输入内容"
                       prefix-icon="el-icon-search"
                       v-model="search_specs">
                     </el-input>
                   </div>
      </div>

      <!-- <el-button type="primary" v-model="search">搜索</el-button> -->
      <!-- <el-button type="danger" @click="empty">清空</el-button> -->
    </div>
    <el-table :data="tables" style="width: 100%;margin-top:1rem;margin-bottom:1rem;" :header-cell-style="tableheader">
      <!--      <el-table-column type="selection">
      </el-table-column> -->
      <el-table-column label="序号" width="100">
        <!-- <template slot-scope="scope">
          <span style="">{{ scope.$index+1 }}</span>
        </template> -->
        <template slot-scope="scope">
          <span style="">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" prop="image" width="120">
        <template slot-scope="scope">
          <div class="img_div">
            <img class="lab_img" :src="scope.row.image" alt="">
          </div>

        </template>
      </el-table-column>
      <el-table-column label="图样代号" prop="item">
        <template slot-scope="scope">
          <span style="">{{ scope.row.item }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图样名称" prop="name">
        <template slot-scope="scope">
          <span style="">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="零件编码" prop="parts_number">
        <template slot-scope="scope">
          <span style="">{{ scope.row.parts_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材料" prop="material">
        <template slot-scope="scope">
          <span style="">{{ scope.row.material }}</span>
        </template>
      </el-table-column>
      <el-table-column label="型号规格" prop="specs">
        <template slot-scope="scope">
          <span style="">{{ scope.row.specs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark">
        <template slot-scope="scope">
          <span style="">{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="库存状态" width="130" :filters="[{ text: '出库', value: 2 }, { text: '入库', value: 1 }]"
        :filter-method="filterTag" filter-placement="bottom-end" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status=== 2 ? 'primary' : 'success'" disable-transitions>
          <!-- <el-tag :type="scope.row.status=== 2 ? 'primary' : 'success'" close-transition> -->
            {{scope.row.status=== 2 ? '出库' : '入库'}}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column align="right">
        <template slot="header" slot-scope="scope">
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pagesize" layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  // import Editor from '@tinymce/tinymce-vue'
  export default {
    name: 'List',
    components: {
      // Editor
    },
    data() {
      return {
       search: '',
       search_id:'',
       search_item:'',
       search_specs:'',
        go_num: '',
        pagesize: 10,
        currpage: 1,
        // currentPage3: 1,
        tableData: [],
        total: 0
      }
    },
    created() {
      this.jump(1);
    },
    methods: {
      empty() {
        this.inputa = '',
          this.inputb = '',
          this.inputc = ''

      },

      handleDelete(index, row) {
        console.log(index, row);
        // this.tableData.splice(index, 1)
      },
      tableheader({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        if (rowIndex === 0) {
          return 'height:70px;background:#e5e5e5'
        }
      },
      filterTag(value, row) {
        return row.status === value;
      },
      handleEdit() {
        console.log("编辑");
      },
      handleChange(value) {
        console.log(value);
      },
      handleSizeChange(psize) {
        console.log(`每页 ${psize} 条`);
        this.pagesize = psize;
      },
      handleCurrentChange(cpage) {
        console.log(`当前页: ${cpage}`);
        this.currpage = cpage;
        this.jump(cpage);
      },
      jump(page) {
        console.log(page);
        let that = this;
        var ruleform = JSON.parse(localStorage.getItem("ruleForm"))
        var token = that.$store.state.token == "" ? ruleform.token : that.$store.state.token;
        var url = that.$store.state.url;
        console.log(token);
        that.axios.get(url + '/api/v1/out/list', {
            params: {
              page: that.currpage,
              size: that.pagesize,
              status: 0
            },
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
              "token": token
            },
          })
          .then(function(res) {
            console.log(res);
            console.log(res.data.data.list);
            console.log(res.data.data.count.total);
            that.total = res.data.data.count.total;
            console.log(that.total);
            that.tableData = res.data.data.list;
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    computed: {
      tables(){
         if(this.search) {
           return this.tableData.filter(item =>{
             console.log(item);
             return Object.keys(item.name).some(key => {
             console.log(key);
               return String(item.name).toLowerCase().indexOf(this.search) > -1

             })
           })
         }
         if(this.search_id) {
           return this.tableData.filter(item =>{
             console.log(item);
             return Object.keys(item.material).some(key => {
             console.log(key);
               return String(item.material).toLowerCase().indexOf(this.search_id) > -1

             })
           })
         }
         if(this.search_id) {
           return this.tableData.filter(item =>{
             console.log(item);
             return Object.keys(item.material).some(key => {
             console.log(key);
               return String(item.material).toLowerCase().indexOf(this.search_id) > -1

             })
           })
         }
         if(this.search_item) {
           return this.tableData.filter(item =>{
             console.log(item);
             return Object.keys(item.item).some(key => {
             console.log(key);
               return String(item.item).toLowerCase().indexOf(this.search_item) > -1

             })
           })
         }
         if(this.search_specs){
           return this.tableData.filter(item =>{
             console.log(item);
             return Object.keys(item.specs).some(key => {
               console.log(key);
               return String(item.specs).toLowerCase().indexOf(this.search_specs) >-1
             })
           })
         }
         else return this.tableData
      },
    },
  }
</script>

<style scoped="">
  .List{
    margin-top:10px;
    background: #FFFFFF;
    padding: 20px 10px 10px;
  }
  .input_flex {
    display: flex;
    justify-content: space-between;
    /* max-width: 28rem; */
  }

  .input_flex .fl {
    display: flex;

  }
  .el-input{
    width:54%;
  }
  .input_flex .el-button {
    padding: 0px 20px;
  }

  .el-input-number {
    width: 100%;
  }

  .el-pagination {
    padding: 2px 0px;
  }
  .img_div{
    width: 50px;
    height: 50px;
  }
  .img_div .lab_img {
    width: 100%;
    height: 100%;
  }
  .el-tag{
    background-color: #FFFFFF !important;
    border-style: none !important;
  }
</style>
