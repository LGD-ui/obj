<template>
  <el-aside width="180px" style="position: relative;">
    <el-header>
      <div>
          <img src="../assets/logo.png" alt="">
      </div>
      <div>XXX管理平台</div>
    </el-header>
    <el-main>
      <el-menu :default-openeds="[]"  v-if="moudle">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-menu"></i>入库</template>
          <el-menu-item-group>
            <router-link to="/scan_enter">
              <el-menu-item index="1-1">扫码入库</el-menu-item>
            </router-link>
            <router-link to="/submit">
              <el-menu-item index="1-2">手动入库</el-menu-item>
            </router-link>
            <router-link to="/batch">
              <el-menu-item index="1-3">批量入库</el-menu-item>
            </router-link>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-menu"></i>出库</template>
          <el-menu-item-group>
            <router-link to="">
              <el-menu-item index="2-1">扫码出库</el-menu-item>
            </router-link>
            <router-link to="/out">
              <el-menu-item index="2-2">手动出库</el-menu-item>
            </router-link>
         <!--   <router-link to="">
              <el-menu-item index="2-3">批量出库</el-menu-item>
            </router-link> -->
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title"><i class="el-icon-menu"></i>库存</template>
          <el-menu-item-group>
            <router-link to="/list">
              <el-menu-item index="3-1">库存列表</el-menu-item>
            </router-link>
          </el-menu-item-group>
        </el-submenu>
       <el-submenu index="4">
          <template slot="title"><i class="el-icon-menu"></i>报损</template>
          <el-menu-item-group>
           <router-link to="/breakList">
             <el-menu-item index="4-1">报损列表</el-menu-item>
           </router-link>
         <!--  <router-link to="">
             <el-menu-item index="4-2">损坏处理</el-menu-item>
           </router-link> -->
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
      <el-menu :default-openeds="['101']" v-if="flow">
        <el-submenu index="101">
          <template slot="title"><i class="el-icon-setting"></i>装配</template>
          <el-menu-item-group>
            <router-link to="/createmodular">
              <el-menu-item index="101-1">选择任务</el-menu-item>
            </router-link>
            <router-link to="/content">
              <el-menu-item index="101-2">工作台</el-menu-item>
            </router-link>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-main>
    <el-footer style="position: absolute;bottom: 0;left: 0;right: 0;">
      <el-button type="primary" @click="outLogin"><Icon type="md-power" />退出登录</el-button>
    </el-footer>
  </el-aside>
</template>

<script>
  export default {
    name: 'Left',
    data() {
      return {
        product:false,
        moudle:false,  //管理
        flow:false,  //员工
        storehouse:false
      }
    },
    props: ['parentmsg'],

    created() {
      let that = this;
      console.log('+++++++++++++++=',this.parentmsg)
      let parentPost = this.parentmsg.userpost;
      switch (parentPost){
        case '大管理员':
          that.product = true;
          that.moudle = true;
          that.flow = true;
          that.storehouse = true;
          break;
        case '管理员':
          that.moudle = true;
          break;
        case '员工':
          that.flow = true;
          break;
        default:
          break;
      }
    },
    methods: {
      outLogin() {
        console.log('退出');
        var that = this;
        localStorage.removeItem('ruleForm');
        this.$message('已退出');
        that.$router.push("/login");
        location.reload();
      }
    }
  }
</script>

<style scoped>
  .el-aside {
   /* background: url();
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center;
    background-size: cover;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover; */
  }
  .el-aside .el-main {
    position: absolute;
    top: 108px;
    bottom: 42px;
    left: 0;
    right: 0;
    background-color: #3e79ab;
    padding: 10px;
  }
  .el-aside .el-main .el-menu {
    border-radius: 10px;
    overflow: hidden;
  }
  .el-aside .el-header {
    height: 108px!important;
    background-color: #0A487C;
    text-align: center;
    padding: 20px;
  }
  .el-aside .el-main .el_aside_title {
    background-color: #1EA0CA;
    margin-bottom: 12px;
  }
  .el-aside .el-header>div {
    color: #FFFFFF;
  }
  .el-aside .el-footer {
    font-size: 14px;
    height: 42px!important;
    line-height: 42px;
    text-align: center;
    padding: 0;
  }
  .el-footer .el-button {
    width: 100%;
    height: 100%;
    border-radius: 0;
    -moz-border-radius: 0;
    -webkit-border-radius: 0;
  }
</style>
