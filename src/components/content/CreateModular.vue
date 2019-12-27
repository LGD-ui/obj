<template>
  <div class="CreateModular">
    <!--  -->
    <p style="padding: 5px 0;">
      <el-form :inline="true"  class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" @click="dialogFormVisible = true">
            <Icon type="md-add" />
            新建任务
          </el-button>
        </el-form-item>
        <el-form-item label="任务查询">
          <el-cascader
            :options="options"
            v-model="cascaderVal"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item><el-button type="primary" @click="filterReset">重置</el-button></el-form-item>
        <el-form-item style="float: right;"><el-tag type="success">已完成</el-tag></el-form-item>
        <el-form-item style="float: right;"><el-tag>进行中</el-tag></el-form-item>
        <el-form-item style="float: right;"><el-tag type="info">未装配</el-tag></el-form-item>
      </el-form>
    </p>
    <el-dialog title="添加任务" :visible.sync="dialogFormVisible" width="40%" :show-close="false">
      <div>
        <el-radio v-model="radio7" label="1" border @change="changeRadio">产品</el-radio>
        <el-radio v-model="radio7" label="2" border @change="changeRadio">模型</el-radio>
      </div>
      <div v-if="axiosDataArr.length>0">
        <el-row :gutter="20" style="margin: 30px;">
          <el-col :span="8" v-for="(tab,index) in axiosDataArr" :key="index" style="margin-bottom: 10px;">
            <div class="grid-content bg-purple"><el-radio v-model="radio8" :label="tab" @change="changeChildRadio">{{tab.name}}</el-radio></div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible_">确 定</el-button>
      </div>
    </el-dialog>
    <!--  -->
    <el-row v-if="filterArr.length==0">
      <el-col style="width: 240px;" v-for="(tab, index) in tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)" :key="index" >
        <div
          class="divcard"
          :style="{ padding: '0px','line-height': '2.2' }"
          :class="tab.status == 1 ? 'info_row' : tab.status == 2 ? 'primary_row' : tab.status == 3 ? 'success_row' : ''"
           @click="handleCurrentChange(tab)">
          <div style="padding: 15px;">
            <div class="bottom clearfix">
              <span class="form-item__label">零件ID：</span>
              <span>{{tab.id}}</span>
            </div>
            <div class="bottom clearfix">
              <span class="form-item__label">任务编号：</span>
              <span>{{tab.parts_number}}</span>
            </div>
            <div class="bottom clearfix">
              <span class="form-item__label">任务类型：</span>
              <span>{{tab.typeStr}}</span>
            </div>
            <div class="bottom clearfix">
              <span class="form-item__label">任务名称：</span>
              <span>{{tab.name}}</span>
            </div>
            <div class="bottom clearfix">
              <span class="form-item__label">创建时间：</span>
              <time class="time">{{tab.createTime}}</time>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row v-else>
      <el-col style="width: 240px;" v-for="(tab, index) in filterArr.slice((currentPage - 1) * pagesize, currentPage * pagesize)" :key="index" >
        <div
          class="divcard"
          :style="{ padding: '0px','line-height': '2.2' }"
          :class="tab.status == 1 ? 'info_row' : tab.status == 2 ? 'primary_row' : tab.status == 3 ? 'success_row' : ''"
           @click="handleCurrentChange(tab)">
          <div style="padding: 15px;">
            <div class="bottom clearfix">
              <span class="form-item__label">零件ID：</span>
              <span>{{tab.id}}</span>
            </div>
            <div class="bottom clearfix">
              <span class="form-item__label">任务编号：</span>
              <span>{{tab.parts_number}}</span>
            </div>
            <div class="bottom clearfix">
              <span class="form-item__label">任务类型：</span>
              <span>{{tab.typeStr}}</span>
            </div>
            <div class="bottom clearfix">
              <span class="form-item__label">任务名称：</span>
              <span>{{tab.name}}</span>
            </div>
            <div class="bottom clearfix">
              <span class="form-item__label">创建时间：</span>
              <time class="time">{{tab.createTime}}</time>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--  -->
    <!--  -->
    <!-- <el-table class="borderRadiou" highlight-current-row :row-class-name="tableRowClassName"
        @current-change="handleCurrentChange"
        :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
        :header-cell-style="tableHeaderColor">
        <el-table-column prop="id" label="零件ID" width="80"align="center"></el-table-column>
        <el-table-column prop="parts_number" label="任务编号" width="155"></el-table-column>
        <el-table-column prop="createTime" label="创建日期" sortable></el-table-column>
        <el-table-column prop="typeStr" label="任务名称" :filters="typeName" :filter-method="filterName" filter-placement="bottom-end">
          <template slot-scope="scope"> {{scope.row.typeStr}} </template>
        </el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column  prop="statusStr" label="模块状态" width="100" :filters="statusName" :filter-method="filterTag" filter-placement="bottom-end" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 2 ? 'primary' : scope.row.status === 3 ? 'success' : scope.row.status === 1 ? 'info' : ''" close-transition>
              {{scope.row.statusStr}}
            </el-tag>
          </template>
        </el-table-column>
      </el-table> -->
      <!--  -->
      <div class="block">
          <el-pagination background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange_"
            :current-page="currentPage"
            :page-sizes="[6, 12, 18]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.length">
          </el-pagination>
      </div>
  </div>
</template>

<script>
  import Qs from 'qs'
  export default {
    name: 'CreateModular',
    components: {},
    data() {
      return {
        tableData: [],
        options: [{
                  value: '任务类型',
                  label: '任务类型',
                  children: [{
                    value: '产品',
                    label: '产品'
                  }, {
                    value: '模型',
                    label: '模型'
                  }]
                }, {
                  value: '任务名称',
                  label: '任务名称',
                  children: [{
                    value: '机械臂',
                    label: '机械臂'
                  }, {
                    value: '组装零件',
                    label: '组装零件'
                  }, {
                    value: '组装模型',
                    label: '组装模型'
                  }, {
                    value: '基座模块',
                    label: '基座模块'
                  }, {
                    value: '上臂涡轮',
                    label: '上臂涡轮'
                  }, {
                    value: '组装模型',
                    label: '组装模型'
                  }, {
                    value: '组装模型',
                    label: '组装模型'
                  }]
                }, {
                  value: '任务进度',
                  label: '任务进度',
                  children: [{
                    value: '未装配',
                    label: '未装配'
                  }, {
                    value: '进行中',
                    label: '进行中'
                  }, {
                    value: '已完成',
                    label: '已完成'
                  }]
                }],
        typeName: [{ text: '产品', value: 1 }, { text: '模型', value: 2 }],
        filterArr: [],
        cascaderVal: '',
        statusName: [{ text: '进行中', value: 2 }, { text: '已完成', value: 3 }, { text: '未装配', value: 1 }],
        radio7: '',
        radio8: '',
        currentPage: 1,
        pagesize: 18,
        dialogFormVisible: false,
        axiosDataArr: [],
        radioType: 0,
        radioObj: {},

      }
    },
    methods: {
      handleCurrentChange(val) {
        console.log(val)
        if(val.status === 1) {
          this.$router.push({path: '/content', query: {id: val.id,parts_number: val.parts_number,type: val.type}})
        } else if (val.status === 2) {
          const h = this.$createElement;
          this.$msgbox({
            title: '提示',
            message: h('p', null, [
              h('span', null, '继续装配编号为：'),
              h('span', { style: 'color: teal' }, val.parts_number),
              h('span', null, '  的任务'),
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = '执行中...';
                setTimeout(() => {
                  done();
                  setTimeout(() => {
                    instance.confirmButtonLoading = false;
                  }, 300);
                }, 3000);
              } else {
                done();
              }
            }
          }).then(action => {
            this.$router.push({path: '/content', query: {id: val.id,parts_number: val.parts_number,type: val.type}})
          });
        } else if (val.status === 3) {
          this.$message({
            message: '当前模块已装配完成',
            type: 'success'
          });
        }

      },
      filterTag(value, row) {
        return row.status === value;
      },
      filterName(value, row) {
        return row.type === value;
      },
      tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
         if (rowIndex === 0) {
            return 'background-color: #dcdcdc;color: #757272;font-weight: 700;'
         }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pagesize = val;
      },
      handleCurrentChange_(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
      },
      handleChange(val) {
        console.log(val[val.length-1], this.cascaderVal)
        var that = this;
        that.filterArr = [];
        for (var i = 0; i < that.tableData.length; i++) {
          switch (val[val.length-1]){
            case that.tableData[i].typeStr:
            console.log(that.tableData[i])
              that.filterArr.push(that.tableData[i]);
              break;
            case that.tableData[i].name:
            console.log(that.tableData[i])
              that.filterArr.push(that.tableData[i]);
              break;
            case that.tableData[i].statusStr:
            console.log(that.tableData[i])
              that.filterArr.push(that.tableData[i]);
              break;
            default:
              break;
          }
        }
      },
      filterReset() {
        if (this.cascaderVal!='') {
          this.cascaderVal = '';
          this.filterArr = '';
        }
      },
      tableRowClassName({row, rowIndex}) {
        if (row.tag == '已完成') {
          return 'success_row';
        }
        return '';
      },
      changeRadio(label) {
        console.log(label)
        this.radioType = label;
        this.axiosData(label);
      },
      changeChildRadio(label) {
        console.log(label)
        this.radioObj = label;
      },
      dialogFormVisible_() {
        let that = this;
        const url = that.$store.state.url;
        var ruleform=JSON.parse(localStorage.getItem("ruleForm"));
        var token=that.$store.state.token==""?ruleform.token:that.$store.state.token;
        that.dialogFormVisible = false;
        console.log(that.radioType, that.radioObj);
        let type = that.radioType;
        let name = that.radioObj.name;
        let target_id = that.radioObj.id;
        let postData = Qs.stringify({
          name: name,
          target_id: target_id,
          type: type,
        });
        that.axios.post(url+'/api/v1/assemble/save',postData,{
          headers: {
           'content-type': 'application/x-www-form-urlencoded',
           'token':token
          }
        }).then(function (response) {
          console.log(response);
          if (response.status === 200) {
			const loading = that.$loading({
			  lock: true,
			  text: 'Loading',
			  spinner: 'el-icon-loading',
			  background: 'rgba(0, 0, 0, 0.5)'
			});

			that.axiosAssembleData();
			setTimeout(() => {
			  loading.close();
				that.$notify({
				  title: '成功',
				  message: '模块创建成功',
				  type: 'success'
				});
			}, 1000);
          }
        }).catch(function (error) {
          console.log(error);
        });

        that.radio7 = '';
        that.axiosDataArr = [];
      },
      axiosData(type) {
        let that = this;
        const url = that.$store.state.url;
        var ruleform=JSON.parse(localStorage.getItem("ruleForm"))
        var token=that.$store.state.token==""?ruleform.token:that.$store.state.token;
        that.axios.get(url+'/api/v1/assemble/choice',{
          params: {
            type: type
          },
          headers: {
           'content-type': 'application/x-www-form-urlencoded',
           'token':token
          }
        }).then(function (response) {
          console.log(response);
          const data = response.data.data;
          that.axiosDataArr = data;
          console.log(that.axiosDataArr);
        }).catch(function (error) {
          console.log(error);
        });
      },
      axiosAssembleData() {  //请求模块列表
        let that = this;
        const url = that.$store.state.url;
        var ruleform=JSON.parse(localStorage.getItem("ruleForm"))
        var token=that.$store.state.token==""?ruleform.token:that.$store.state.token;
        Date.prototype.toLocaleString = function() {
        	  return this.getFullYear() + "/" + ((this.getMonth() + 1)<10?'0'+(this.getMonth() + 1):(this.getMonth() + 1)) + "/" + (this.getDate()<10?'0'+this.getDate():this.getDate()) + " " + (this.getHours()<10?'0'+(this.getHours()):this.getHours()) + ":" + (this.getMinutes()<10?('0'+this.getMinutes()):this.getMinutes()) + ":" + (this.getSeconds()<10?'0'+this.getSeconds():this.getSeconds()) ;
        };
        let time = new Date().toLocaleString();
        that.axios.get(url+'/api/v1/assemble/list',{
          headers: {
           'content-type': 'application/x-www-form-urlencoded',
           'token':token
          },
          params: {
            page: 1,
            size: 1000000
          }
        }).then(function (response) {
          console.log(response);
          const data = response.data.data.list;
          console.log(data)
          for (var i = 0; i < data.length; i++) {
            data[i].statusStr = data[i].status == 1 ? '未装配' : data[i].status == 2 ? '进行中' : '已完成';
            data[i].createTime = new Date( data[i].created_at * 1000 ).toLocaleString().slice(0, -3);
            data[i].typeStr = data[i].type == 1 ? '产品' : '模型';
          }
          that.tableData = data;
        }).catch(function (error) {
          console.log(error);
        });
      }
    },
    created() {
      let that = this;
      const loading = that.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      });

      that.axiosAssembleData();
      // location.reload();
      setTimeout(() => {
        loading.close();
      }, 1000);
    },
    updated() {
      var that = this;
      console.log('数据跟那个心')
      that.axiosAssembleData();
    }

  }
</script>

<style scoped>
  .el-pagination {
    padding: 15px;
    text-align: right;
  }
  .success_row {
    background-color: #f0f9eb!important;
  }
  .primary_row {
    background-color: #ecf5ff!important;
  }
  .info_row {
    background-color: #f4f4f5!important;
  }
  .divcard {
    margin: 10px;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border: 1px solid #EBEEF5;
    background-color: #FFF;
    color: #303133;
    -webkit-transition: .3s;
    transition: .3s;
    border-radius: 4px;
    overflow: hidden;
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 220px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
