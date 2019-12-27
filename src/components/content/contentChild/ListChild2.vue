<template>
  <div class="ListChild2" style="width: 80%;margin:0 auto;">
          <el-main>
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                  <el-form-item label="图样代号" prop="code">
                    <el-input v-model="form.code"></el-input>
                  </el-form-item>
                  <el-form-item label="图样名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                  </el-form-item>
                  <el-form-item label="型号规格" prop="specification">
                    <el-input v-model="form.specification"></el-input>
                  </el-form-item>
                  <el-form-item label="材料" prop="materials">
                    <el-input v-model="form.materials"></el-input>
                  </el-form-item>
                  <el-form-item label="数量" prop="count">
                    <el-input-number v-model="form.count"  :min="1" label="描述文字"></el-input-number>
                  </el-form-item>
                  <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="form.remark"></el-input>
                  </el-form-item>
                  <el-form-item label="图片" hide-required-asterisk>
                    <el-upload
                      action="https://jsonplaceholder.typicode.com/posts/"
                      list-type="picture-card"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="handleRemove"
                      :on-success="onsuccess"
                      :on-error="onerror"
                      :limit="1"
                      accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
                      >
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                      <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                  </el-form-item>
                  <el-form-item>
                   <div>
                        <div ref="editor" style="text-align:left"></div>
                    </div>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('form')">立即录入</el-button>
                    <el-button @click="resetForm('form')">取消</el-button>
                  </el-form-item>
                </el-form>

          </el-main>
  </div>
</template>

<script>
  import E from 'wangeditor'
  import 'wangeditor/release/wangEditor.js'
  export default {
    components: {
      E
    },
    data() {
      return {
        input: '',
        dialogImageUrl: '',
        dialogVisible: false,
        form: {
          name: '',
          code: '',
          specification: '',
          materials: '',
          count:'',
          remark:'',
          fileList: [],
          editorContent: ''
        },
        rules: {
          code: [ //代号
            { required: true, message: '请输入代号', trigger: 'blur'}
          ],
          name: [ //名称
            { required: true, message: '请输入名称', trigger: 'blur'}
          ],
          specification: [  //规格
            { required: true, message: '请输入规格', trigger: 'blur'}
          ],
          materials: [ // 材料
            { required: true, message: '请输入材料', trigger: 'blur'}
          ],
          count: [  //数量
            { required: true, message: '请输入数量', trigger: 'blur'}
          ],
          remark: [ //备注
            { required: false, message: '请输入备注', trigger: 'blur'}
          ]
        },
      }
    },
    methods:{
      golist(){
        this.$router.replace('/list')
      },
      onsuccess(response, file, fileList){
        console.log(response, file, fileList);
        // if(fileList.length >=1){
        //   this.$message({
        //   message: '只能添加一张',
        //   type: 'warning',
        //   })
        // }
        this.form.fileList=fileList;
        console.log(fileList.length);
        console.log(this.form.fileList);
      },
      onerror(error, file, fileList){
        console.log(error);
          this.$message({
          message: '上传失败',
          type: 'warning',
          })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('submit!',this.form);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      handleRemove(file) {
              console.log(file);
            },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleDownload(file) {
        console.log(file);
      },
      handlePreview(file) {
        console.log(file);
      },
     getContent:function(){
         console.log(this.form.editorContent);
      }

    },
    mounted() {
      var that = this;
      var editor = new E(this.$refs.editor);
      editor.customConfig.uploadImgShowBase64 = true;
      editor.customConfig.showLinkImg = true;
      editor.customConfig.onchange = function (html) {
          // 监控变化，同步更新到 textarea
          console.log(html);
          that.form.editorContent = html;
          console.log(html.split('"')[1]);

          console.log(that.form.editorContent);
      };
      editor.create();
    }
  }
</script>
