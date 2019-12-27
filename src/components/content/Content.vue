<template>
  <el-main v-if="orId">
    <!-- <div> -->
      <!-- <el-main>
        <el-input placeholder="请输入您要搜索的内容" prefix-icon="el-icon-search" v-model="input"></el-input>
      </el-main> -->
      <div class="swiperbanner_container">
          <swiper :options="swiperOption" ref="mySwiper">
            <swiper-slide v-for="(item, index) in BannerList" :key="index">
              <div class="partList"  :style="{background: 'url('+item.image+') no-repeat 50% 50%','background-size': 'cover'}">
                <!-- :class="item.arm_id == 2 ? 'partListBg':''" -->
                <i v-if="item.pro_status" class="el-icon-success"></i>
                <el-form :class="item.pro_status ? 'bgGrey':''">
                  <div class="el-form_item">
                    <label class="el-form-item__label">名称</label>  <!-- name -->
                    <div class="el-form-item__content">{{item.title}}</div>
                  </div>
                  <div class="el-form_item">
                    <label class="el-form-item__label">代号</label>  <!-- mark -->
                    <div class="el-form-item__content"></div>
                  </div>
                  <div class="el-form_item">
                    <label class="el-form-item__label">规格</label> <!-- specs -->
                    <div class="el-form-item__content"></div>
                  </div>
                  <div class="el-form_item">
                    <label class="el-form-item__label">材料</label>  <!-- material -->
                    <div class="el-form-item__content"></div>
                  </div>
                  <div class="el-form_item">
                    <label class="el-form-item__label">ID</label>
                    <div class="el-form-item__content">{{item.product_id}}</div>
                  </div>
                </el-form>
              </div>
            </swiper-slide>
          </swiper>
          <div class="swiper-scrollbar"></div>
        </div>
      <el-row class="detail borderRadiou">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <div class="thisvideo">
           <template>
               <div class='demo'>
                   <video-player class="video-player vjs-custom-skin"
                                 ref="videoPlayer"
                                 :playsinline="true"
                                 :options="playerOptions">
                   </video-player>
               </div>
           </template>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <div class="thisdetail">
            <el-row>
              <el-col>
                <div class="detailwrap">
                    <Input suffix="md-barcode" placeholder="" style="width: auto" v-model="barcode_val" @on-change="barcode_Data"/>
                </div>
              </el-col>
           </el-row>
            <el-row v-if="barcodeObj!=''">
              <el-col>
                <label class="el-form-item__label">名称</label>
                <div class="el-form-item__content">{{barcodeObj.product_name}}</div>
              </el-col>
              <el-col>
                <label class="el-form-item__label">ID</label>
                <div class="el-form-item__content">{{ barcodeObj.product_id }}</div>
              </el-col>
              <el-col>
                <label class="el-form-item__label">数量</label>
                <div class="el-form-item__content">{{beforeNum}}/{{endNum}}</div>
              </el-col>
              <!-- <el-col :span="12">
                <label class="el-form-item__label">名称</label>
                <div class="el-form-item__content">{{barcodeObj.product_name}}</div>
              </el-col>
              <el-col :span="12">
                <label class="el-form-item__label">代号</label>
                <div class="el-form-item__content">{{ '' }}</div>
              </el-col> -->
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-footer class="foot_">
        <el-row type="flex" justify="end">
          <el-col :span="4" :pull="2">
            <el-button type="primary" @click="dialogFormVisible = true">
              <i class="el-icon-setting"></i>
              报损维修
            </el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="success" @click="assemble">提　　交</el-button>
          </el-col>
        </el-row>
      </el-footer>
      <el-dialog title="报损清单" :visible.sync="dialogFormVisible"  width="30%" :show-close="false">
        <div class="thisdetail">
          <el-row>
            <el-col>
              <div class="detailwrap">
                  <Input suffix="md-barcode" placeholder="" style="width: auto" v-model="barcode__val" @on-change="barcode__Data"/>
              </div>
            </el-col>
         </el-row>
          <el-row v-if="barcodeObj!=''">
            <el-col>
              <label class="el-form-item__label">名称</label>
              <div class="el-form-item__content">{{barcodeObj.product_name}}</div>
            </el-col>
            <el-col>
              <label class="el-form-item__label">代号</label>
              <div class="el-form-item__content">{{ '' }}</div>
            </el-col>
            <el-col>
              <label class="el-form-item__label">数量</label>
              <div class="el-form-item__content">{{beforeNum}}/{{endNum}}</div>
            </el-col>
            <!-- <el-col :span="12">
              <label class="el-form-item__label">名称</label>
              <div class="el-form-item__content">{{barcodeObj.product_name}}</div>
            </el-col>
            <el-col :span="12">
              <label class="el-form-item__label">代号</label>
              <div class="el-form-item__content">{{ '' }}</div>
            </el-col> -->
          </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    <!-- </div> -->
  </el-main>
</template>

<script>
  import { mpStore } from "vuex"
  import 'swiper/dist/css/swiper.css'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import bannerurl1 from '../../assets/4.png'
  import Qs from 'qs'

  export default {
    name: "Content",
    components: {
        swiper,
        swiperSlide
      },
    data () {
      return {
        input: '',
        left: 0,
        owidth: '',
        okLength: 0,
        id_: 0,
        type:0,
        barcode_val:'',
        barcode__val: '',
        pro_status: '',
        barcodeObj:'',
        beforeNum: 0,
        endNum: 0,
        parts_number: '',  //零件吗
        dialogFormVisible: false,
        swiperOption:{
          direction:'horizontal',  //Slides的滑动方向，可设置水平(horizontal)或垂直(vertical)。
          spaceBetween:15,     //每个slide的右边距
          observeParents: true,   //观察父组件，当父组件变化时，自己随着变化
          observer: true,     //观察自己，自己的参数变化时，更新
          slidesPerView:'auto',   //同时显示的slide数量
          freeMode: true,
          freeModeMomentumBounce: true,
          scrollbar: '',
          scrollbarHide:false,
        },
        orId: false,
        assembleDetail: {},
        arm_stepsArr: [],
        playerOptions: {
            //播放速度
            playbackRates: [0.5, 1.0, 1.5, 2.0],
            //如果true,浏览器准备好时开始回放。
            autoplay: true,
            // 默认情况下将会消除任何音频。
            muted: false,
            // 导致视频一结束就重新开始。
            loop: false,
            // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
            preload: 'auto',
            language: 'zh-CN',
             // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
            aspectRatio: '16:9',
             // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
            fluid: true,
            sources: [{
                //类型
                type: "video/mp4",
                //url地址
                src: ''
            }],
            //你的封面地址
            poster: '',
             //允许覆盖Video.js无法播放媒体源时显示的默认信息。
            notSupportedMessage: '此视频暂无法播放，请稍后再试',
            controlBar: {
                timeDivider: true,
                durationDisplay: true,
                remainingTimeDisplay: false,
                //全屏按钮
                fullscreenToggle: true
            }
        }
      }

    },
    methods: {
      axiosData(id) {
        let that = this;
        const url = that.$store.state.url;
        var ruleform=JSON.parse(localStorage.getItem("ruleForm"))
        var token=that.$store.state.token==""?ruleform.token:that.$store.state.token;
        that.axios.get(url+'/api/v1/assemble/detail',{
          params: {
          id: id
          },
          headers: {
           'content-type': 'application/x-www-form-urlencoded',
           'token':token
          }
        }).then(function (response) {
          console.log(response);
          if (response.status === 200) {
            const data = response.data.data;
            that.assembleDetail = data;
            that.playerOptions.sources[0].src = data.video;
            that.arm_stepsArr = data.arm_steps;
            that.BannerList = that.arm_stepsArr;
            console.log(that.assembleDetail, that.arm_stepsArr);
            for (var i = 0; i < that.arm_stepsArr.length; i++) {
              if (that.arm_stepsArr[i].sort == that.arm_stepsArr[i].user_count) {
                that.arm_stepsArr[i].pro_status = true;
              }
            }
          }
        }).catch(function (error) {
          console.log(error);
           that.$notify({title: '提示', message: '网络请求错误，请刷新页面', type: 'warning' });
        });
      },
      barcode_Data(){//扫码触发
        let that = this;
        const url = that.$store.state.url;
        var ruleform=JSON.parse(localStorage.getItem("ruleForm"))
        var token=that.$store.state.token==""?ruleform.token:that.$store.state.token;
        var type = '';
        var parts_number = ''
        console.log(that.type,that.barcode_val);
        that.axios.get(url+'/api/v1/assemble/obtain',{
          params: {
          type:that.type,
          parts_number:that.barcode_val
          },
          headers: {
           'content-type': 'application/x-www-form-urlencoded',
           'token':token
          }
        }).then(function (response) {
          console.log(response);
          var data=response.data.data;
          that.barcodeObj=data;//循环arm_stepsArr 对比两个id是否相等，调用assembleParst()
          for(var i=0;i<that.arm_stepsArr.length;i++){
            if(that.arm_stepsArr[i].product_id == that.barcodeObj.product_id &&that.arm_stepsArr[i].title == that.barcodeObj.product_name){
              if (that.arm_stepsArr[i].sort > 1 && that.arm_stepsArr[i].sort > that.arm_stepsArr[i].user_count) {
                that.arm_stepsArr[i].user_count += 1;
                that.$message('当前零件需要' + that.arm_stepsArr[i].sort + '个,已扫描'+that.arm_stepsArr[i].user_count+ '个');
                that.beforeNum = that.arm_stepsArr[i].user_count;
                that.endNum = that.arm_stepsArr[i].sort
                if (that.arm_stepsArr[i].sort == that.arm_stepsArr[i].user_count) {
                  // that.$notify({title: '提示', message: '成功', type: 'success' });
                  that.arm_stepsArr[i].title = that.arm_stepsArr[i].title+' ';
                  that.arm_stepsArr[i].pro_status = true;
                  console.log(that.assembleDetail,that.arm_stepsArr[i]);
                  that.okLength = i;
                  var id = that.$route.query.id;
                  var type = that.type;
                  var parts_id = that.barcodeObj.id;
                  var parts_number = that.barcode_val;
                  console.log(id,type,parts_id,parts_number)
                  that.assembleParst(id,type,parts_id,parts_number)
                }
                // else if (that.arm_stepsArr[i].sort < that.arm_stepsArr[i].user_count) {
                //   that.$notify({title: '警告', message: '扫描失败，请扫描下一个零件', type: 'warning' });
                // }
              } else if (that.arm_stepsArr[i].sort == 1) {
                that.arm_stepsArr[i].user_count += 1;
                that.$message('当前零件需要' + that.arm_stepsArr[i].sort + '个,已扫描'+that.arm_stepsArr[i].sort+ '个');
                that.beforeNum = that.arm_stepsArr[i].user_count;
                that.endNum = that.arm_stepsArr[i].sort
                // if (that.arm_stepsArr[i].sort == that.arm_stepsArr[i].user_count) {
                  // that.$notify({title: '提示', message: '成功', type: 'success' });
                  that.arm_stepsArr[i].title = that.arm_stepsArr[i].title+' ';
                  that.arm_stepsArr[i].pro_status = true;
                  // ++that.arm_stepsArr[i].user_count;
                  that.okLength = i;
                  var id = that.$route.query.id;
                  var type = that.type;
                  var parts_id = that.barcodeObj.id;
                  var parts_number = that.barcode_val;
                  console.log(id,type,parts_id,parts_number)
                  that.assembleParst(id,type,parts_id,parts_number)
                // }
              }
              continue;
            }
            // else {
            //   that.$notify({title: '警告', message: '扫描失败,请检查当前零件与扫描零件是否一致', type: 'warning' });
            // }
          }
          // console.log(that.barcodeObj);
        }).catch(function (error) {
          console.log(error);
        });
      },
      barcode__Data() { //报损
        console.log(this.barcode__val)
      },
      assembleParst(id,type,parts_id,parts_number){//扫码完成调用
        let that = this;
        const url = that.$store.state.url;
        var ruleform=JSON.parse(localStorage.getItem("ruleForm"))
        var token=that.$store.state.token==""?ruleform.token:that.$store.state.token;
        console.log(that.type,that.barcode_val);
        let postData = Qs.stringify({
          assemble_id:id,
          type:type,
          parts:[{
            parts_id:parts_id,
            parts_number:parts_number
          }]
        });
        that.axios.post(url+'/api/v1/assemble/parts',postData,{
          headers: {
           'content-type': 'application/x-www-form-urlencoded',
           'token':token
          }
        }).then(function (response) {
          console.log(response);
          if (response.status === 200) {
            that.$notify({title: '提示', message: '成功', type: 'success' });
          }
        }).catch(function (error) {
          console.log(error);
          that.$notify({title: '警告', message: '扫描失败，请检查编码是否重复', type: 'warning' });
        });
      },
      assemble(){//点击完成调用
        let that = this;
        var errorArr = [];
        console.log(that.arm_stepsArr);
        for (var i=0; i < that.arm_stepsArr.length; i++) {
          if (that.arm_stepsArr[i].pro_status != undefined) {
            console.log(that.arm_stepsArr[i].pro_status)
            that.pro_status = that.arm_stepsArr[i].pro_status;

          } else {
            console.log(that.arm_stepsArr[i],i)
            errorArr.push(that.arm_stepsArr[i]);
          }

        }
        if (that.pro_status) {
          let id = that.$route.query.id;
          that.uploadData(id,3)
          that.$notify({title: '提示', message: '装配完成，请返回任务列表选择新的任务', type: 'success' });
        }
        if (errorArr.length > 0) {
            console.log('未装配数组：：：：：',errorArr);
             that.$notify.error({
               title: '错误',
               message: errorArr[0].title+'未扫描装配'
             });
        }



      },
      uploadData(id,status) {
        let that = this;
        const url = that.$store.state.url;
        var ruleform=JSON.parse(localStorage.getItem("ruleForm"))
        var token=that.$store.state.token==""?ruleform.token:that.$store.state.token;
        let postData = Qs.stringify({
          assemble_id:id,
          status:status
        });
        that.axios.post(url+'/api/v1/assemble/update',postData,{
          headers: {
           'content-type': 'application/x-www-form-urlencoded',
           'token':token
          }
        }).then(function (response) {
          console.log(response);
        }).catch(function (error) {
          console.log(error);
        });
      }
    },
    props:{
     BannerList:{
       type:Array,
       default:function(){
         return []
       }
     }
    },
    computed: {
      swiper() {
        console.log(this.$refs)
        if (this.$refs.mySwiper != undefined) {
            return this.$refs.mySwiper.swiper
        }

      }
    },
    beforeUpdate() {
      console.log(this.BannerList, this.swiper);
      if (this.swiper!=undefined) {
        this.swiperOption.scrollbar = '.'+this.swiper.$el[0].nextElementSibling.className;
        this.swiper.slideTo(this.okLength, 1000, true);
      }

    },
    created() {
      let that = this;
      console.log(this.$route.query);
      that.type=that.$route.query.type;

      that.parts_number = that.$route.query.parts_number;
      console.log(that.type);
      let id = that.$route.query.id;
      that.id_ = id;
      const loading = that.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(() => {

        if (id != undefined) {
          that.axiosData(id);
          that.orId = true;
        } else {
          this.$confirm('请选择要配置的模块，方可进行装配', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.$router.push({path: '/createmodular'});
          }).catch(() => {
            that.$router.push({path: '/createmodular'});
          });
        }
        loading.close();
      }, 600);
    },
    beforeDestroy() {
      var that = this;
      for (var i=0; i < that.arm_stepsArr.length; i++) {
        if (that.arm_stepsArr[i].pro_status == undefined) {
          let id = that.id_;
          this.uploadData(id, 2)
        }

      }

    },
  }
</script>

<style scoped>
  .el-input {
    margin: 10px 0px;
  }
  .el-main {
    padding: 0;
    overflow: hidden;
  }
  .thisdetail, .thisvideo {
    height: 400px;
    background-color: #FFFFFF;
    padding: 30px;
  }
  .thisdetail>.el-row {
    margin: 20px 0;
  }
  .thisdetail>.el-row:last-child {
    margin: 0;
  }
  .thisdetail .el-form-item__label, .thisdetail .el-form-item__content {
    font-size: 16px;
  }
 /* .thisdetail .detailwrap {
    width: 176px;
    height: 164px;
    background: url(../../assets/4.png) no-repeat;

  } */
  .el-main .foot_ {
  }
  .foot_ .el-button {
    width: 100%;
    min-width: 180px;
    margin-top: 10px;
  }
  .menu-container {
    position: relative;
    height: 175px;
    overflow: hidden;
  }
  .menu-container .el_flex {
    position: absolute;
  }
  .el-form {
    padding: 15px;
    height: 100%;
  }
  .el-form_item {
    margin: 7px 0;
  }
  .el-form-item__label {
      width: 30%;
      text-align: center;
      vertical-align: middle;
      float: left;
      font-size: 15px;
      color: #606266;
      line-height: 25px;
      padding: 0 12px 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
  }
  .el-form-item__content {
      line-height: 25px;
      position: relative;
      font-size: 15px;
  }
  .partList {
    height: 100%;
    position: relative;
    z-index: 10;
    /* opacity: .6; */
  }
  .partList .el-form-item__label, .partList .el-form-item__content {
    color: #FFFFFF;
  }
  .partListBg {
    background-color: rgba(0,0,0,.3);
  }
  .el-icon-success {
    -ms-transition: .3s;
    -webkit-transition: .3s;
    transition: .3s;
    color: rgba(21,174,100,.8);
    position: absolute;
    right: 21%;
    top: 30%;
    z-index: 10;
    font-size: 100px;
  }
  .el-col .el-icon-error {
    color: #2c3e50;
  }
  .swiperbanner_container{
    width:100%;
    height:205px;
    padding: 5px;
    overflow: visible !important;
    margin-bottom: 15px;
  }
  .swiper-pagination{
    /* bottom:2px !important; */
  }
  .bgGrey{
    background-color: rgba(0,0,0,.3);
  }
  .swiper-slide {
    width: 200px!important;
    height: 200px;
    background-color: #FFFFFF;
    border-radius: 5px;
    overflow: hidden;
  }
  .swiper-wrapper {
    transform: translate3d(0px, 0px, 0px)!important;
  }
  .demo{
      /* display: inline-block; */
      width: 600px;
      height: 335px;
      margin: 0 auto;
      text-align: center;
      line-height: 100px;
      border: 1px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
      position: relative;
      box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    }
    .video-js.vjs-fluid, .video-js.vjs-16-9, .video-js.vjs-4-3 {
      height: 100%;
    }

    .demo:hover{
      display: block;
    }

</style>
