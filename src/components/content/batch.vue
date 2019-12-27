<template>
  <div class="batch">


   <!-- <el-link target="_blank" :href=" 'https://armapi.e7vr.cn/api/v1/pattern/export' " :underline="false" style="margin-left:15px"> -->
           <!-- <el-button size="mini" type="warning">软件下载</el-button> -->
      <el-button  type="primary"  @click="download">点击下载模板</el-button>
   <!-- </el-link> -->
<!--   <el-upload
      class="upload-demo"
      drag
      action="https://armapi.e7vr.cn//api/v1/pattern/batch"
      :data={myfile:file_name}
      :headers={token}
      :on-success="handleSuccess"
      :on-progress="handleProgress"
      :on-error="handleError"
      :http-request="uploading"
      :show-file-list="false">
       <i class="el-icon-upload"></i>
       <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload> -->
    <el-upload
       class="upload-demo"
       drag
       action="doUpload"
      :before-upload="beforeUpload"
       :http-request="update"
       :file-list="fileList">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
     </el-upload>
  </div>
</template>

<script>
  export default {
    name: 'batch',
    components:{},
    data () {
      return {
        fileList: [],
        // token:"",
        myfile:'',
        files:'',
        fileName:''
      }
    },
    // created(){
    // let that = this;
    // var ruleform=JSON.parse(localStorage.getItem("ruleForm"))
    //  that.token=that.$store.state.token==""?ruleform.token:that.$store.state.token;
    // },
    methods: {
      download(){
        location.href="https://armapi.e7vr.cn/api/v1/pattern/export";
      },
       beforeUpload(file){
          console.log(file,'文件');
          this.files = file;
          const extension = file.name.split('.')[1] === 'xls'
          const extension2 = file.name.split('.')[1] === 'xlsx'
          if (!extension && !extension2) {
              this.$message.warning('上传模板只能是 xls、xlsx格式!')
              return
          }
          this.fileName = file.name;
          setTimeout(() => {
              this.update();
          },500);
          return false; // 返回false不会自动上传
      },
      update(){
        let that = this;
        var ruleform=JSON.parse(localStorage.getItem("ruleForm"))
         that.token=that.$store.state.token==""?ruleform.token:that.$store.state.token;
              let file = that.files;
              let param = new FormData(); //创建form对象
              param.append('myfile',file);//通过append向form对象添加数据
              // console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
              let config = {
                headers:{
                  'Content-Type':'multipart/form-data',
                  'token': that.token,
                  }
              }; //添加请求头
              that.$http.post('https://armapi.e7vr.cn/api/v1/pattern/batch',param,config)
                .then(response=>{
                  console.log(response.data);
                })
            },
      // uploading(){
      //   console.log(this.files);
      //   var up_files=this.files;
      //   console.log(up_files);
      //   let that = this;
      //   console.log('上传'+that.files.name)
      //   var ruleform=JSON.parse(localStorage.getItem("ruleForm"))
      //   var token=that.$store.state.token==""?ruleform.token:that.$store.state.token;
      //   var url=that.$store.state.url;
      //     that.axios.post(url+'/api/v1/pattern/batch',{
      //         headers: {
      //            'content-type': 'application/x-xls',
      //            "token":token
      //           },

      //           myfile:up_files,

      //     }
      //     )
      //     .then(function (res) {
      //       console.log(res);

      //     })
      //     .catch(function (error) {
      //       console.log(error);
      //     });
      // },
      handleSuccess(response, file, fileList) {
          this.myfile=file;
        console.log(response, file, fileList);
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.fileList = fileList;
        console.log(this.fileList)
        if (this.fileList != '') {
          loading.close();
          this.$message({
            message: '数据导入成功',
            type: 'success'
          });
        }


      },
      handleProgress(event, file, fileList) {
          console.log("上传中");
          console.log(file);
           this.myfile=file;
          // console.log(file);
      },
      handleError(err, file, fileList) {
        console.log(file);

         this.$message.error('数据导入失败');
      }
    }
  }
</script>

<style scoped>
.batch{
  width: 80%;
  border:1px dashed #ddd;
  margin:1.875rem auto;
  height: 80%;
  background: #FFFFFF;
  text-align: center;
  text-align: -moz-center;
  text-align: -webkit-center;
}
.el-button{
  width:120px;
  margin:0 auto;
  margin-top: 200px;

}
.upload-demo {
 text-align: center;
 text-align: -moz-center;
  text-align: -webkit-center;
  margin-top: 100px;

}
</style>
