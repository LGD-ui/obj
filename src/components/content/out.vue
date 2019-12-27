<template>
  <div class="Out">
    <div style="width: 100%;">
      <el-form :model="barlist" :rules="rules" ref="barlist">
        <div class="input_flex">
          <el-form-item label="条形码" prop="bar_code" style="min-width: 28.125rem;">
            <el-input v-model="barlist.bar_code" placeholder="请输入条码" style="width: 180px;"></el-input>
            <el-button type="primary" @click="submitForm('barlist')">出库</el-button>
            <!-- <el-button @click="resetForm('barlist')">重置</el-button> -->
            <el-button @click="batch('barlist')" type="danger">报损</el-button>
          </el-form-item>
          <el-form-item>

          </el-form-item>
        </div>
        <div class="input_flex">
          <div class="fl">
            <!-- <el-input v-model="search" placeholder="请输入内容" prefix-icon="el-icon-search"></el-input> -->
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
            <!--  -->
          </div>
        </div>
      </el-form>
    </div>
    <!--    <el-table
          :data="tables.slice((currpage - 1) * pagesize, currpage * pagesize)" -->
    <el-table :data="tables"  style="width: 100%;margin:1rem 0;" :header-cell-style="tableheader">
      <!--          <el-table-column type="selection">
          </el-table-column> -->
      <el-table-column label="编号" width="100">
        <!--   <template slot-scope="scope">
              <span style="">{{ scope.$index+1 }}</span>
            </template> -->
        <template slot-scope="scope">
          <span style="">{{ scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" prop="img" width="100">
        <template slot-scope="scope">
          <div class="img_div">
            <img class="lab_img" :src="scope.row.image" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="条码" prop="parts_number">
        <template slot-scope="scope">
          <span style="">{{ scope.row.parts_number }}</span>
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
      <el-table-column prop="status" label="库存状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status=== 2 ? 'primary' : 'success'" close-transition>
            {{scope.row.status=== 2 ? '出库' : '入库'}}
          </el-tag>
        </template>
      </el-table-column>
      <!--          <el-table-column label="备注" prop="remark">
            <template slot-scope="scope">
              <span style="">{{ scope.row.remark }}</span>
            </template>
          </el-table-column> -->
      <el-table-column width="100">
        <template slot="header" slot-scope="scope">
          <!-- <el-input v-model="search" placeholder="请输入内容" prefix-icon="el-icon-search" size="small"></el-input> -->
        </template>
        <template slot-scope="scope">
          <!-- <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">备注</el-button> -->
          <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pagesize" layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import Qs from 'qs'
  export default {
    name: 'Out',
    components: {
      // Editor
    },
    data() {
      return {
        search: '',
        search_id:'',
        search_item:'',
        search_specs:'',
        bar_code: '', //条码
        pagesize: 10,
        currpage: 1,
        total: 0,
        barlist: {
          bar_code: '',
          // bar_user:''
        },
        newTable: {},
        tableData: [],
        rules: {
          bar_code: [{
              required: true,
              message: '请输入',
              trigger: 'blur'
            },
            {
              min: 1,
              message: '长度至少一个字符',
              trigger: 'blur'
            }
          ],
          // bar_user: [
          //   { required: true, message: '请输入', trigger: 'blur' },
          //   { min: 1, message: '长度至少一个字符', trigger: 'blur' }
          // ]
        }
      }
    },
    created() {
      let that = this;
      that.list(1);
    },
    methods: {
      empty() {
        this.inputa = '',
          this.inputb = '',
          this.inputc = ''
      },
      submitForm(formName) {
        var that = this;
        that.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(that.barlist.bar_code);
            var parts_number = that.barlist.bar_code;
            console.log(parts_number);
            var ruleform = JSON.parse(localStorage.getItem("ruleForm"))
            var token = that.$store.state.token == "" ? ruleform.token : that.$store.state.token;
            var url = that.$store.state.url;
            console.log(token);
            that.axios.get(url + '/api/v1/out/manual', {
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                  "token": token
                },
                params: {
                  parts_number: parts_number
                }
              })
              .then(function(res) {
                console.log(res);
                that.list();
              })
              .catch(function(error) {
                console.log(error);
              });
            this.$refs[formName].resetFields();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      batch(formName){
        var that = this;
        that.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(that.barlist.bar_code);
            var parts_number = that.barlist.bar_code;
            console.log(parts_number);
            var ruleform = JSON.parse(localStorage.getItem("ruleForm"))
            var token = that.$store.state.token == "" ? ruleform.token : that.$store.state.token;
            var url = that.$store.state.url;
            console.log(token);
            that.axios.get(url + '/api/v1/assemble/obtain', {
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                  "token": token
                },
                params: {
                  parts_number: parts_number,
                  type:2
                }
              })
              .then(function(res) {
                console.log(res);
                console.log(res.data.data.parts_number,res.data.data.product_id,res.data.data.product_name);
                var parts_number = res.data.data.parts_number;
                var product_id = res.data.data.product_id;
                var product_name = res.data.data.product_name;
                console.log(parts_number,product_id,product_name);

                let postData = Qs.stringify({
                    product_id:product_id,
                    product_name:product_name,
                    parts_number:parts_number,
                    type:1,
                    source:2,
                });
                console.log(token);
                  that.axios.post(url+'/api/v1/loss/save',postData,{
                    headers: {
                       'content-type': 'application/x-www-form-urlencoded',
                       "token":token
                      }
                  })
                  .then(function (res) {
                    console.log(res);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });


                // that.list();
              })
              .catch(function(error) {
                console.log(error);
              });
            this.$refs[formName].resetFields();
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      list(page) {
        let that = this;
        var ruleform = JSON.parse(localStorage.getItem("ruleForm"))
        var token = that.$store.state.token == "" ? ruleform.token : that.$store.state.token;
        var url = that.$store.state.url;
        console.log(token);
        that.axios.get(url + '/api/v1/out/list', {
            params: {
              page: that.currpage,
              size: that.pagesize,
              status: 2
            },
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
              "token": token
            },
          })
          .then(function(res) {
            console.log(res);
            that.total = res.data.data.count.total;
            console.log(that.total);
            console.log(res.data.data.list);
            that.tableData = res.data.data.list;
          })
          .catch(function(error) {
            console.log(error);
          });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
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
      handleDelete(index, row) {
        console.log(index, row);
        // this.tableData.splice(index, 1)
      },
      handleEdit() {
        console.log("备注");
      },
      handleChange(value) {
        console.log(value);
      },
      // 导入
      handleChanges(file, fileList) {
        this.fileTemp = file.raw
      },

      handleRemove(file, fileList) {
        this.fileTemp = null
      },
      // 分页
      handleSizeChange(psize) {
        console.log(`每页 ${psize} 条`);
        this.pagesize = psize;
      },
      handleCurrentChange(cpage) {
        console.log(`当前页: ${cpage}`);
        this.currpage = cpage;
        this.list(cpage);
      },
      handleExceed() {

      },
      fileListUpload() {

      },

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
  .Out{
    margin-top:10px;
    background: #FFFFFF;
    padding: 10px 10px 10px;
  }
  .input_flex {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    /* max-width: 45rem; */
  }
  .input_flexs {
    display: flex;
    justify-content: space-between;
    margin-top: 0.25rem;
    /* max-width: 45rem; */
  }
  .input_flexs .fl {
      display: flex;

    }
  .input_flex .fl {
    display: flex;

  }

  .el-input {
    /* width:54%; */
  }

  /* .input_flex .el-button {
    padding:0px 20px;
  } */
  .el-input-number {
    width: 100%;
  }

  .el-pagination {
    padding: 2px 0px;
  }

  .el-input--small .el-input__inner {
    height: 2.5rem !important;
    line-height: 2.5rem !important;
  }

  .el-input__inner {
    width: 9.375rem
  }

  .el-button--primary {
    margin-left: 1.25rem !important;
  }

  .el-form-item__content {
    width: 28.125rem !important;
  }

  .img_div {
    width: 50px;
    height: 50px;
    margin: 0 auto;
  }

  .img_div .lab_img {
    width: 100%;
    height: 100%;
  }

  .el-tag {
    background-color: #FFFFFF !important;
    border-style: none !important;
  }
  .el-input{
    width:54%;
  }
  .el-form-item{
    margin-bottom: 5px !important;
  }
</style>
