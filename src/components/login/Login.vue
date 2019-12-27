<template>
  <div class="Login">
    <div class="demonstration">登录</div>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
      <el-form-item label="账　　号" prop="loginNum">
        <el-input type="text" v-model="ruleForm.loginNum" autocomplete="off" style="width: 350px;"></el-input>
      </el-form-item>
      <el-form-item label="账号密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" maxlength="6" autocomplete="off" style="width: 350px;"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      var validateloginNum = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号'));
        } else {
          callback();
        }
      };
      var validatecheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (value.length < 6) {
            callback(new Error('请输入6位有效密码'));
          } else {
            callback();
          }
        }
      };
      return {
        ruleForm: {
          loginNum: '',
          checkPass: ''
        },
        rules: {
          loginNum: [{
            validator: validateloginNum,
            trigger: 'blur'
          }],
          checkPass: [{
            validator: validatecheckPass,
            trigger: 'blur'
          }]
        }
      };
    },
    methods: {
      submitForm(formName) {
        // 18792626731  //员工
        // 13022959494  //管理员
        var that = this;
        const url = that.$store.state.url;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let mobile = that.ruleForm.loginNum;
            let password = that.ruleForm.checkPass
            console.log(mobile,password)
            that.axios.get(url+'/admin/v1/login', {
              params: {
                mobile: mobile, password: password, type: 2
              },headers: {
               'content-type': 'application/x-www-form-urlencoded'
               // "token":'14a1347f412b39f'  //token换成从缓存获取
              }
            }).then(function (response) {
              console.log(response);
              const data = response.data.data;
              if (response.status === 200) {
                that.$store.state.token = data.token;
                that.ruleForm.token = data.token;
                console.log('vuex:',that.$store.state,'token:',that.$store.state.token)
                switch (data.user){
                        //产品、模型、流
                  case 'product,moudle,flow,storehouse':  //智能车间管理
                    that.ruleForm.userpost = '大管理员';
                    localStorage.setItem("ruleForm", JSON.stringify(that.ruleForm));
                    that.$router.push({path: '/list'});
                    that.$message({ message: '登录成功', type: 'success' });
                    that.$emit('child-event',that.ruleForm);
                    break;
                  case 'product':  //暂存区管理
                    that.ruleForm.userpost = '管理员';
                    localStorage.setItem("ruleForm", JSON.stringify(that.ruleForm));
                    that.$router.push({path: '/list'});
                    that.$message({ message: that.ruleForm.userpost+'登录成功', type: 'success' });
                    that.$emit('child-event',that.ruleForm);
                    break;
                  case 'moudle':   //装配区管理
                    that.ruleForm.userpost = '员工';
                    localStorage.setItem("ruleForm", JSON.stringify(that.ruleForm));
                    that.$router.push({path: '/createmodular'});
                    that.$message({ message: that.ruleForm.userpost+'登录成功', type: 'success' });
                    that.$emit('child-event',that.ruleForm);
                    break;
                  case 'storehouse':    //仓储区管理
                    // that.ruleForm.userpost = '员工';
                    // localStorage.setItem("ruleForm", JSON.stringify(that.ruleForm));
                    // that.$router.push({path: '/createmodular'});
                    // that.$message({ message: that.ruleForm.userpost+'登录成功', type: 'success' });
                    // that.$emit('child-event',that.ruleForm);
                    break;
                  default:
                    that.$message({ message: '权限不足，请联系管理员', type: 'warning' })
                    break;
                }
              }
            }).catch(function (error) {
              console.log(error);
              that.$message.error( '请输入有效的账号和密码' )
            });
          } else {
            console.log('error submit!!');
            that.$message({ message: '账号和密码不能为空', type: 'warning' })
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>
  .Login {
    /* background: url();
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center;
    background-size: cover;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    border-top: 1px solid transparent;
    height: 100vh; */
  }
  .Login .demonstration {
    width: 200px;
    color: #FFFFFF;
    color: #8a8989;
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    text-align: -moz-center;
    text-align: -webkit-center;
    margin: 180px auto;
    margin-bottom: 60px;
  }
  .Login .demo-ruleForm {
    width: 500px;
    display: block;
    margin: 0 auto;
    background-color: #EEEEEE;
    padding: 20px;
    border-radius: 10px;
    overflow: hidden;
  }
  .el-button {
    width: 200px;
    display: block;
    margin: 0 auto;
  }
</style>
