<template>
  <el-main>
    <el-row :gutter="0" class="headRow borderRadiou">
         <!-- xs<768px   sm≥768px  md≥992px lg≥1200px  xl≥1920px -->
      <el-col :xs="4" :sm="3" :md="3" :lg="2" :xl="2">
        <div class="title">人员信息</div>
      </el-col>
      <el-col :xs="5" :sm="4" :md="4" :lg="3" :xl="3">
        <div class="title">姓名：{{parentmsg.loginNum}}</div>
      </el-col>
      <el-col :xs="5" :sm="4" :md="4" :lg="3" :xl="3">
        <div class="title">姓别：XXXX</div>
      </el-col>
      <el-col :xs="5" :sm="4" :md="4" :lg="3" :xl="3">
        <div class="title">职位：{{parentmsg.userpost}}</div>
      </el-col>
      <el-col  :xs="8" :sm="7" :md="6" :lg="4" :xl="4" class="el-col-time" style="float: right;">
        <div class="title"><i class="el-icon-time"></i>　{{time}}</div>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
  export default {
    name: 'Head',
    data () {
      return {
        timer: '',
        time: '0000年00月00日 00:00:00'
      }
    },
    props: ['parentmsg'],
    created() {
      let that = this;
      Date.prototype.toLocaleString = function() {
      	  return this.getFullYear() + "年" + ((this.getMonth() + 1)<10?'0'+(this.getMonth() + 1):(this.getMonth() + 1)) + "月" + (this.getDate()<10?'0'+this.getDate():this.getDate()) + "日 " + (this.getHours()<10?'0'+(this.getHours()):this.getHours()) + ":" + (this.getMinutes()<10?('0'+this.getMinutes()):this.getMinutes()) + ":" + (this.getSeconds()<10?'0'+this.getSeconds():this.getSeconds()) ;
      };
      that.timer = setInterval(function () {
        let nowTime = new Date();
        that.time = nowTime.toLocaleString();
        that.$store.state.timeplet = nowTime*1000;
      }, 1000)
    },
    beforeDestroy() {
      if (this.timer) {
            clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
          }
    },
    methods: {}
  }
</script>

<style scoped>
.el-main {
    padding: 10px;
    background: #ffffff;
  }
  .el-main .title {
    min-width: 100px;
  }
  .el-main>.el-main {
    padding-left: 0;
    padding-top: 0;
  }
  .el-main .headRow {
    width: 100%;
    background-color: #FFF;
    padding-left: 10px;
    font-size: 14px;
  }
  .headRow div {
    height: 38px;
    line-height: 45px;
  }
  .el-col-time {
    float: right;
    text-align: right;
    text-align: -moz-right;
    text-align: -webkit-right;
    padding-right: 10px;
  }
</style>
