<template>
  <div class="ListChild1">
    <div class="input_flex">
      <!-- <el-button type="primary" icon="el-icon-circle-plus">新增</el-button> -->
      <div class="fl">
        <!-- <p style="width: 4.5625rem;height: 2rem;line-height: 2rem;margin-left: 0.625rem;">图样名称</p> -->
        <!-- <el-input v-model="search" placeholder="请输入关键字" prefix-icon="el-icon-search"></el-input> -->
        <!--  -->

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
        <div class="demo-input-suffix">
          <el-button type="text" @click="scan_enter">扫码入库</el-button>
        </div>
        <el-dialog title="零件信息" :visible.sync="dialogFormVisible" width="30%">
          <el-form :model="form">
            <el-form-item label="" >
               <Input suffix="md-barcode" placeholder="" style="width: auto" v-model="barcode_val" @on-change="barcode_Data"/>
            </el-form-item>
            <el-form-item label="图样名称" >
              <div>{{form.name}}</div>
            </el-form-item>
            <el-form-item label="图样代号" >
              <div>{{form.name}}</div>
            </el-form-item>
            <el-form-item label="型号规格" >
              <div>{{form.name}}</div>
            </el-form-item>
            <el-form-item label="入库数量" >
              <div>{{form.name}}</div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div>
        </el-dialog>
      </div>
<!--     <router-link to="/breakage">
         <el-button type="primary" v-model="breakage">报损</el-button>
      </router-link> -->

     <!-- <div class="fl">
        <p style="width: 4.5625rem;height: 2rem;line-height: 2rem;">图样名称:</p>
         <el-input v-model="inputb" placeholder="请输入内容" size="small"></el-input>
      </div>
      <div class="fl">
        <p style="width: 4.5625rem;height: 2rem;line-height: 2rem;">图样名称:</p>
         <el-input v-model="inputc" placeholder="请输入内容" size="small"></el-input>
      </div> -->
       <!-- <el-button type="primary" v-model="search">搜索</el-button>
        <el-button type="danger" @click="empty">清空</el-button> -->
    </div>

  <!-- <el-table
      :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))" -->
   <el-table
      :data="tables"
      style="width: 100%;margin-top:1rem;margin-bottom:1rem;"
      highlight-current-row
      :cell-click="tableClick"
      :row-class-name="tableRowClassName"
      :header-cell-style="tableheader">
     <!-- <el-table-column type="selection">
      </el-table-column> -->
      <el-table-column label="序号" width="100">
       <!-- <template slot-scope="scope">
          <span style="">{{ scope.$index+1 }}</span>
        </template> -->
        <template slot-scope="scope">
          <span style="">{{ scope.row.id}}</span>
        </template>
      </el-table-column>


      <el-table-column label="图片" prop="image" width="120">
        <template slot-scope="scope">

          <div class="img_div">
            <img class="lab_img" :src="scope.row.image" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="总库存数量" prop="count" width="130">
        <template slot-scope="scope">
          <span style="">{{ scope.row.stock }}</span>
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
     <el-table-column label="备注" prop="note">
        <template slot-scope="scope">
          <span style="">{{ scope.row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库 / 报损数量" >
        <template slot-scope="scope">
         <el-input-number v-model="go_numArr[scope.$index].go_num" controls-position="right" @change="handleChange" :min="0" ></el-input-number>
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
     <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="submit(scope.$index,scope.row)" type="primary" v-if="go_numArr[scope.$index].go_num >0">入库</el-button>
          <el-button @click="submit(scope.$index,scope.row)" type="info" disabled v-else>入库</el-button>
          <el-button @click="batch(scope.$index,scope.row)" type="danger" v-if="go_numArr[scope.$index].go_num >0">报损</el-button>
          <el-button @click="batch(scope.$index,scope.row)" type="info" disabled v-else>报损</el-button>
        </template>
      </el-table-column>
<!--
      <el-table-column label="操作">
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
         <el-pagination
           @size-change="handleSizeChange"
           @current-change="handleCurrentChange"
           :page-size="pagesize"
           layout="prev, pager, next, jumper"
           :total="total">
         </el-pagination>
       </div>
  </div>
</template>

<script>
  import Qs from 'qs'
  export default {
    name: 'List',
    components:{
      // Editor
    },
    data () {
      return {
        barcode_val:'',
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        search: '',
        search_id:'',
        search_item:'',
        search_specs:'',
        inputb:'',
        inputc:'',
        breakage:'',
        pagesize: 10,
        currpage: 1,
        total:0,
        go_numArr:[],
        tableData: [],
        fullscreenLoading: false,
        dialogFormVisible: false,
      }
    },
    created(){
      let that = this;
      that.axiosData(1);

    },
    methods: {
      axiosData(page){
        let that = this;
        var ruleform=JSON.parse(localStorage.getItem("ruleForm"))
        var token=that.$store.state.token==""?ruleform.token:that.$store.state.token;
        var url=that.$store.state.url;
        console.log(token);
          that.axios.get(url+'/api/v1/pattern/list',{
            headers: {
               'content-type': 'application/x-www-form-urlencoded',
               "token":token
              },
            params:{
              page:that.currpage,
              size:that.pagesize
            }
          })
          .then(function (res) {
            console.log(res);
            console.log(res.data.data.list);
            that.total=res.data.data.count.total;
            console.log(that.total);
            that.tableData=res.data.data.list;
            for (var i = 0 ; i < that.tableData.length; i++) {
              that.go_numArr.push({
                go_num: 0
              })
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      empty(){
        this.inputa = '',
        this.inputb = '',
        this.inputc = ''
      },
      handleDelete(index, row){
        console.log(index, row);
        // this.tableData.splice(index, 1)
      },
      handleEdit(){
        console.log("编辑");
      },
       handleChange(value) {
        console.log(value);
        console.log(this.go_numArr);

      },
      tableClick(row, column, event){
      console.log(row, column, event);
      },
      submit(c,d){
        let that=this;
        console.log(c,d);
        console.log(that.go_numArr[c].go_num);

        var count_=that.go_numArr[c].go_num;
        var product_id=d.id;
        var product_name=d.name;
        console.log(count_,product_id,product_name);
        if(count_!=0){
          that.openFullScreen2();
          var ruleform=JSON.parse(localStorage.getItem("ruleForm"))
          var token=that.$store.state.token==""?ruleform.token:that.$store.state.token;
          var url=that.$store.state.url;
          console.log(token);
            that.axios.get(url+'/api/v1/pattern/manual',{
              headers: {
                 'content-type': 'application/x-www-form-urlencoded',
                 "token":token
                },
              params:{
                count:count_,
                product_id:product_id,
                product_name:product_name
              }
            })
            .then(function (res) {
              console.log(res);
              // console.log(res.data.data.list);
              // that.tableData=res.data.data.list;
               that.axiosData();
               that.go_numArr[c].go_num=0;
            })
            .catch(function (error) {
              console.log(error);
            });
        }else{
          this.$alert('请输入入库数量', '提示', { confirmButtonText: '确定' });
        }
      },
      batch(c,d){
        let that=this;
        console.log(c,d);
        console.log(that.go_numArr[c].go_num);
        var count_=that.go_numArr[c].go_num;
        var product_id=d.id;
        var product_name=d.name;
        console.log(count_,product_id,product_name);
        if(count_!=0){
          that.openFullScreen2();
          var ruleform=JSON.parse(localStorage.getItem("ruleForm"))
          var token=that.$store.state.token==""?ruleform.token:that.$store.state.token;
          var url=that.$store.state.url;
          let postData = Qs.stringify({
              number:count_,
              product_id:product_id,
              product_name:product_name,
              type:1,
              source:1,
          });
          console.log(token);
            that.axios.post(url+'/api/v1/loss/save',postData,{
              headers: {
                 'content-type': 'application/x-www-form-urlencoded',
                 "token":token
                },
              // params:{
              //   number:count_,
              //   product_id:product_id,
              //   product_name:product_name,
              //   type:1,
              //   source:1,
              // }
            })
            .then(function (res) {
              console.log(res);
               that.axiosData();
               that.go_numArr[c].go_num=0;
            })
            .catch(function (error) {
              console.log(error);
            });
        }else{
          this.$alert('请输入入库数量', '提示', { confirmButtonText: '确定' });
        }

      },
      scan_enter(){//扫码入库
        var that=this;
        that.dialogFormVisible=true;
      },
      handleSizeChange(psize) {
        console.log(`每页 ${psize} 条`);
         this.pagesize = psize;
      },
      handleCurrentChange(cpage) {
        console.log(`当前页: ${cpage}`);
          this.currpage = cpage;
          this.axiosData(cpage);
      },
      tableheader({row, column, rowIndex, columnIndex}){
        if (rowIndex === 0) {
          return 'height:70px;background:#e5e5e5'
        }
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
     openFullScreen2() {
        const loading = this.$loading({
          lock: true,
          text: '入库中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        setTimeout(() => {
          loading.close();
        }, 2000);
      },
      barcode_Data(){//扫码
        let that = this;
        const url = that.$store.state.url;
        var ruleform=JSON.parse(localStorage.getItem("ruleForm"))
        var token=that.$store.state.token==""?ruleform.token:that.$store.state.token;
        that.axios.get(url+'/api/v1/assemble/obtain',{
          params: {
          type:2,
          parts_number:that.barcode_val
          },
          headers: {
           'content-type': 'application/x-www-form-urlencoded',
           'token':token
          }
        }).then(function (res) {
          console.log(res);
        }).catch(function (error) {
          console.log(error);
        });
      }
    },

    computed:{
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
  .input_flex{
   display: flex;
   justify-content: space-between;
   margin-top:10px;

    /* max-width: 28rem; */
  }
  .input_flex .fl{
    display: flex;

  }
  .el-input{
    width:54%;
  }
 /* .input_flex .el-button {
    padding:8px 20px;
  } */
  .el-input-number {
    width: 100%;
  }
  .el-pagination {
    padding:2px 0px;
  }
  .el-table .warning-row {
      background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  .lab_img{
    width: 70%;
    height: 70%;
  }
  .img_div{
    width: 50px;
    height: 50px;

  }
  .img_div .lab_img {
    width: 100%;
    height: 100%;
  }
  .el-button+.el-button {
    margin-right: 0rem;
  }
</style>
