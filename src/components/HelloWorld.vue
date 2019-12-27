<template>
  <div class="HelloWorld">
      <el-container>
        <Left :parentmsg="parentmsg"/>
        <el-container>
          <el-main>
            <Head :parentmsg="parentmsg"/>
            <router-view></router-view>
          </el-main>

        </el-container>
      </el-container>
  </div>
</template>

<script>
  import Left from '@/components/Left.vue'
  import Head from '@/components/Head.vue'
  export default {
    name: 'HelloWorld',
    data() {
      return {
      }
    },
    props: ['parentmsg'],
    components: {
      Left,Head
    },
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .HelloWorld {
    background-color: #f9f9f9;
  }
  .el-container {
    height: 100vh;
  }

</style>
