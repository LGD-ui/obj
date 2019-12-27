<template>
  <div id="app" @contextmenu.prevent="">
    <Login v-if="ruleForm == ''" @child-event="parentEvent"></Login>
    <HelloWorld v-else :parentmsg="ruleForm"></HelloWorld>
  </div>
</template>

<script>
  import Login from '@/components/login/Login.vue'
  import HelloWorld from '@/components/HelloWorld.vue'
  export default {
    name: 'App',
    components: {
      Login, HelloWorld
    },
    data() {
      return {
        ruleForm: '',
        lastTime: new Date().getTime(),
        currentTime: new Date().getTime(),
        timeOut: 30 * 60 * 1000   //设置超时时间： 30分
      }
    },
    created() {
      this.ruleForm = JSON.parse(localStorage.getItem('ruleForm')) == null ? '' : JSON.parse(localStorage.getItem('ruleForm'));
      console.log(this.ruleForm);
      if (this.ruleForm != '') {
        if (this.ruleForm.userpost == '员工') {
           this.$router.push({path: '/createmodular'});
        } else if (this.ruleForm.userpost == '管理员') {
          this.$router.push({path: '/list'});
        } else if (this.ruleForm.userpost == '大管理员') {
          this.$router.push({path: '/list'});
        }
      }
      
      localStorage.removeItem('lastTime');
      /* 定时器 间隔30秒检测是否长时间未操作页面 */
      if (this.ruleForm!='') {
        // window.setInterval(this.checkTimeout, 30000);
      }
    },
    updated() {
      this.$nextTick(function () {
        document.addEventListener('click', function(){
          localStorage.setItem("lastTime",new Date().getTime());
        })
      })
    },
    methods: {
      parentEvent(data) {
        this.ruleForm = data;
        console.log(this.ruleForm)
      },
      checkTimeout() {
        let that = this;
          that.currentTime = new Date().getTime(); //更新当前时间
          that.lastTime = localStorage.getItem("lastTime");
          localStorage.setItem('testtime----1', that.currentTime - that.lastTime);
          localStorage.setItem('testtime----2', that.timeOut);
          if (that.currentTime - that.lastTime > that.timeOut) { //判断是否超时
              console.log("超时");
              that.$notify({
                title: '警告',
                message: '长时间未操作，已自动退出登录',
                type: 'warning'
              });
              localStorage.removeItem('ruleForm');
              location.reload();
          }
      }
    },
    destroyed() {
      localStorage.removeItem('ruleForm');
    },
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }
  a {
    text-decoration: none;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
}
 .borderRadiou {
    border-radius: 5px;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    overflow: hidden;
  }
</style>
