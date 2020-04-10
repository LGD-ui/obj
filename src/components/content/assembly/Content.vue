<template>
	<el-container>
		<el-container>
			<el-main style="padding: 10px;">
				<Head/>
				<el-main class="Content" v-if="orId">
					<SearchInput @onceAgain="seachInputVlaue"></SearchInput>
				
					<div class="swiperbanner_container">
						<swiper :options="swiperOption" ref="mySwiper" style="padding: 5px 0;">
							<swiper-slide v-for="(item, index) in BannerList" :key="index">
								<!-- v-lazy:backgroundImage="item.image"     图片懒加载-->
								<!-- :style="{backgroundImage: 'url(' + item.image + ')'}" 图片批量加载 -->
								<div class="partList" :style="{backgroundImage: 'url(' + item.image + ')'}"
								 @click="BannerListClick(item)">
									<i v-if="item.pro_status" class="el-icon-success"></i>
									<el-form class="bgGrey" v-if="item.title!=undefined">
										<div class="el-form_item">
											<label class="el-form-item__label">名称</label>
											<div class="el-form-item__content" style="overflow: hidden;">{{item.title}}</div>
										</div>
										<div class="el-form_item">
											<label class="el-form-item__label">代号</label>
											<div class="el-form-item__content">{{item.item}}</div>
										</div>
										<div class="el-form_item">
											<label class="el-form-item__label">规格</label>
											<div class="el-form-item__content">{{item.specs}}</div>
										</div>
										<div class="el-form_item">
											<label class="el-form-item__label">材料</label>
											<div class="el-form-item__content">{{item.material}}</div>
										</div>
									</el-form>
								</div>
							</swiper-slide>
							<div class="swiper-button-prev" slot="button-prev"></div>
							<div class="swiper-button-next" slot="button-next"></div>
						</swiper>
						<div class="swiper-pagination"></div>
						<!--分页器。如果放置在swiper-container外面，需要自定义样式。-->
						<div class="swiper-scrollbar"></div>
					</div>
					<el-row class="detail borderRadiou" type="flex" style="flex-wrap: nowrap;">
						<el-col style="width: 600px;height:335px;margin: 10px;background-color: #FFFFFF;">
							<div class="thisvideo">
								<template>
									<div class="demo" v-if="playerOptions.sources[0].src != ''">
										<video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions">
										</video-player>
									</div>
									<!-- <div class="demo" v-else style="background: url('http://zrui.e7vr.com/image/arm/default.gif') no-repeat center 50%;"></div> -->
								</template>
							</div>
						</el-col>
						<el-col :span="7" style="min-width: 36%;height:auto;margin: 10px 10px;background-color: #FFFFFF;position: relative;">
							<div class="thisupData" style="padding: 10px;">
				
								<!-- list-type="picture-card" -->
								<!-- drag -->
								<!-- style="display: flex;flex-wrap: wrap;" -->
								<el-upload class="upload-demo" action=""  list-type="picture-card"
								 :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" :on-error="handleError"
								 :before-upload="beforeUpload" :file-list="fileList" >
									<i class="el-icon-plus"></i>
									<!-- <i class="el-icon-upload"></i> -->
									<!-- <el-button size="small" type="primary">选择文件</el-button> -->
									<!-- <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div> -->
									<!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
								</el-upload>
								<!-- <div class="upload-demo" style="float: right;">
									<el-button style="" size="small" type="success" v-if="uploadBtn" @click="assembleObtain">上传到服务器</el-button>
								</div>
								<div v-if="assembleFileListimgArr.length != 0" >
								  <ul>
									<li class="el-upload-list__item" v-for="(tab, index) in assembleFileListimgArr" :key="index">
									  <i class="el-icon-circle-close" @click="removeThisImg(tab,index)"></i>
									  <img :src="tab.url"></img>
									</li>
								  </ul>
								</div>
								<div v-if="assembleFileListvideoArr.length != 0">
									<div class='demo' style="width: 300px; height: auto;margin-top: 5px;" v-if="playerOptions_.sources[0].src!=''">
										<video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions_">
										</video-player>
									</div>
								</div> -->
								
							</div>
							<el-button type="success" style="position: absolute;right: 10px;bottom: 10px;" @click="cropperPhoto.dialog=true">拍照</el-button>
						</el-col>
						<el-col :span="4" style="min-width: 340px;height:335px;margin: 10px;background-color: #FFFFFF;padding: 0 20px;">
							<div class="thisdetail">
								<el-row v-if="barcodeObj.product_type == 2">
									<el-col>
										<div class="detailwrap">
											<Input suffix="md-barcode" autofocus :maxlength="8" placeholder="" style="width: auto;" v-model.trim="barcode_val"
											 @on-change="barcode_Data" />
										</div>
									</el-col>
								</el-row>
				
								<el-row>
									<el-col style="width: 100%;">
										<div class="box-card">
											<div class="text item" v-if="barcodeObj.product_type == 1">
												<label class="el-form-item__label" style="text-align: right;width: 60px;">编号：</label>
												<div class="el-form-item__content"></div>
											</div>
											<div class="text item">
												<label class="el-form-item__label" style="text-align: right;width: 60px;">名称：</label>
												<div class="el-form-item__content">{{barcodeObj.title}}</div>
											</div>
											<div class="text item">
												<label class="el-form-item__label" style="text-align: right;width: 60px;">代号：</label>
												<div class="el-form-item__content">{{barcodeObj.item}}</div>
											</div>
											<div class="text item">
												<label class="el-form-item__label" style="text-align: right;width: 60px;">规格：</label>
												<div class="el-form-item__content">{{barcodeObj.specs}}</div>
											</div>
											<div class="text item">
												<label class="el-form-item__label" style="text-align: right;width: 60px;">材料：</label>
												<div class="el-form-item__content">{{barcodeObj.material}}</div>
											</div>
											<!-- <div class="text item">
				               <label class="el-form-item__label" style="text-align: right;width: 60px;">ID：</label>
				               <div class="el-form-item__content">{{ barcodeObj.product_id }}</div>
				             </div> -->
											<div class="text item">
												<label class="el-form-item__label" style="text-align: right;width: 60px;">数量：</label>
												<div class="el-form-item__content" v-if="barcodeObj.product_type == 2">
													{{barcodeObj.user_count == undefined ? 0: barcodeObj.user_count}}/{{barcodeObj.number == undefined ? 0: barcodeObj.number}}
												</div>
												<div class="el-form-item__content" v-if="barcodeObj.product_type == 1">
													<!-- {{barcodeObj.number == undefined ? 0: barcodeObj.number}} -->
													<el-input-number size="mini" v-model="barcodeObj.user_count" :min="0" :max="barcodeObj.number"></el-input-number>　/　{{barcodeObj.number}}
												</div>
												<!-- <div class="el-form-item__content">
				                 {{barcodeObj.user_count == undefined ? 0: barcodeObj.user_count}}/{{barcodeObj.number == undefined ? 0: barcodeObj.number}}
				               </div> -->
											</div>
										</div>
									</el-col>
									<el-col style="margin-top: 15px;width: 100%;">
										<el-button type="primary" @click="dialogFormVisible = true">
											<i class="el-icon-setting"></i>
											报损维修
										</el-button>
										<el-button type="primary" v-if="barcodeObj.pro_status==true" @click="dialogFormVisible_editor = true">
											编辑
										</el-button>
										<el-button type="primary" v-if="barcodeObj.product_type == 1 && barcodeObj.pro_status!=true" @click="barcode_Data_type"
										 @keyup.enter="barcode_Data_type">
											确认
										</el-button>
									</el-col>
				
								</el-row>
							</div>
						</el-col>
				
					</el-row>
					<el-footer class="foot_">
						<el-row type="flex" justify="end">
							<!-- <el-col :span="4">
								<el-button type="success" @click="cropperPhoto.dialog=true">拍照</el-button>
							</el-col> -->
							<el-col :span="4">
								<el-button type="success" @click="uploadData" v-if="pro_status">提　　交</el-button>
							</el-col>
						</el-row>
					</el-footer>
					<el-dialog title="报损清单" :visible.sync="dialogFormVisible" width="30%" :show-close="false">
						<div class="thisdetail" style="padding: 0;">
							<el-row>
								<el-col>
									<div class="detailwrap">
										<Input suffix="md-barcode" autofocus placeholder="" style="width: auto" v-model="barcode__val" @on-change="barcode__Data" />
									</div>
								</el-col>
							</el-row>
							<el-row>
								<el-col>
									<el-card class="box-card">
										<div class="text item">
											<label class="el-form-item__label" style="text-align: right;width: 60px;">编号：</label>
											<div class="el-form-item__content">{{lossSave.title}}</div>
										</div>
										<div class="text item">
											<label class="el-form-item__label" style="text-align: right;width: 60px;">名称：</label>
											<div class="el-form-item__content">{{lossSave.title}}</div>
										</div>
										<div class="text item">
											<label class="el-form-item__label" style="text-align: right;width: 60px;">代号：</label>
											<div class="el-form-item__content">{{lossSave.name}}</div>
										</div>
										<div class="text item">
											<label class="el-form-item__label" style="text-align: right;width: 60px;">规格：</label>
											<div class="el-form-item__content">{{lossSave.name}}</div>
										</div>
										<div class="text item">
											<label class="el-form-item__label" style="text-align: right;width: 60px;">材料：</label>
											<div class="el-form-item__content">{{lossSave.name}}</div>
										</div>
										<!-- <div class="text item">
				              <label class="el-form-item__label" style="text-align: right;width: 60px;">ID：</label>
				              <div class="el-form-item__content">{{ lossSave.product_id }}</div>
				            </div> -->
										<!-- <div class="text item">
				              <label class="el-form-item__label" style="text-align: right;">数量：</label>
				              <div class="el-form-item__content">{{beforeNum}}/{{endNum}}</div>
				            </div> -->
									</el-card>
								</el-col>
								<el-col style="margin-top: 20px;">
									<!--  -->
									<el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview"
									 :on-remove="handleRemove" :on-success="handleSuccess" :on-error="handleError" :before-upload="beforeUpload"
									 :file-list="fileList">
										<el-button size="small" type="primary">选择文件</el-button>
										<!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
									</el-upload>
									<!-- <div class="upload-demo">
										<el-button style="margin-top: 10px;" size="small" type="success" v-if="uploadBtn" @click="assembleObtain">上传到服务器</el-button>
									</div>
									<div v-if="assembleFileListimgArr.length != 0">
										<ul>
											<li class="el-upload-list__item" v-for="(tab, index) in assembleFileListimgArr" :key="index">
												<img :src="tab.url" />
											</li>
										</ul>
									</div>
									<div v-if="assembleFileListvideoArr.length != 0">
										<div class='demo' style="width: 300px; margin-top: 10px;" v-if="playerOptions_.sources[0].src!=''">
											<video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions_">
											</video-player>
										</div>
									</div> -->
									<!--  -->
								</el-col>
							</el-row>
						</div>
						<div slot="footer" class="dialog-footer">
							<el-button @click="dialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="upBarcode__Data">确 定</el-button>
						</div>
					</el-dialog>
					<el-dialog title="零件编辑" :visible.sync="dialogFormVisible_editor" width="35%">
						<el-form :model="barcodeObj" style="margin-right: 5.3125rem;" label-position="">
							<!-- <el-form-item label="" label-width="120px" style="margin-bottom: 0;">
				        <el-input size="medium" v-model="barcodeObj.title" autocomplete="off"></el-input>
				      </el-form-item> -->
							<el-form-item label="名称" label-width="120px" style="margin-bottom: 0;">
								<el-input size="medium" v-model="barcodeObj.title" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item label="规格" label-width="120px" style="margin-bottom: 0;">
								<el-input size="medium" v-model="barcodeObj.title" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item label="材料" label-width="120px" style="margin-bottom: 0;">
								<el-input size="medium" v-model="barcodeObj.title" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item label="数量" label-width="120px">
								<el-input-number v-model="num__" @change="handleChange_num" :min="1" :max="barcodeObj.number" label="描述文字" style="margin-top: 0.625rem;"></el-input-number>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="dialogFormVisible_editor = false;num__ = 1">取 消</el-button>
							<el-button type="primary" @click="assemble_updateDetail">确 定</el-button>
						</div>
					</el-dialog>
					<!-- </div> -->
					<div class="drag" v-if="bigBoxImg!=''">
						<div class="drag_box" v-drag>
							<div :style="{background: 'url('+bigBoxImg+') center / contain no-repeat'}">
								<i class="el-icon-error" @click="bgDrage"></i>
							</div>
						</div>
				
					</div>
					
					<!-- Picture editing popover -->
					<cropperPhoto v-bind:centerDialogVisible="cropperPhoto.dialog" @change="changeClose"></cropperPhoto>
					
					<!-- Torquewrench -->
					<wrench v-bind:wrenchDialogVisible="wrench" @change="wrenchClose"></wrench>
					
				</el-main>
			</el-main>
		</el-container>
	</el-container>
	
</template>

<script>
	import { mapActions, mapState, mapGetters } from "vuex"
	import Head from '@/components/Head.vue'
	import SearchInput from './SearchInput.vue'
	import 'swiper/dist/css/swiper.css'
	import { swiper, swiperSlide } from 'vue-awesome-swiper'
	import Qs from 'qs'
	import cropperPhoto from '@/components/content/assembly/cropperPhoto/CropperPhoto.vue'
	import wrench from '@/components/content/assembly/cropperPhoto/Torquewrench.vue'

	export default {
		name: "Content",
		components: {
			swiper,
			swiperSlide,
			SearchInput,
			cropperPhoto,
			wrench,
			Head
		},
		data() {
			const vm = this;
			return {
				BannerList: [],
				timer: null,
				input: '',
				select: '',
				left: 0,
				owidth: '',
				okLength: 0,
				id_: 0,
				type: 0,
				barcode_val: '',
				barcode__val: '',
				pro_status: false,
				barcodeObj: '',
				beforeNum: 0,
				endNum: 0,
				num__: 1,
				parts_number: '', //零件吗
				lossSave: '', //报损零件信息
				dialogFormVisible: false,
				dialogFormVisible_editor: false,
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
				swiperOption: {
					pagination: {
						el: '.swiper-pagination',
						// type : 'progressbar',
						type: 'fraction',
					},
					direction: 'horizontal', //Slides的滑动方向，可设置水平(horizontal)或垂直(vertical)。
					spaceBetween: 15, //每个slide的右边距
					//observeParents: true,   //观察父组件，当父组件变化时，自己随着变化
					//observer: true,     //观察自己，自己的参数变化时，更新
					slidesPerView: 'auto', //同时显示的slide数量
					freeMode: false,
					freeModeMomentumBounce: true,
					scrollbar: '',
					scrollbarHide: true,
					centeredSlides: true, //居中
					grabCursor: true,
					keyboard: true,
					navigation: {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev'
					},
					on: {
						slideChange: function() { //轮播图变化事件,将当前下标更新到okLength中；
							// console.log(vm.timer)
							vm.okLength = this.activeIndex;
							clearInterval(vm.timer);
							// console.log(`clearinterval`)
							vm.timer = setTimeout(() => {
								// console.log(this.activeIndex);
								// console.log(vm.okLength);
								// console.log(`debounce,timer${vm.timer}`)
								vm.playerOptions.sources[0].src = vm.BannerList[vm.okLength].video;
								vm.playerOptions.poster = vm.BannerList[vm.okLength].image;
								vm.barcodeObj = vm.BannerList[vm.okLength];
								// console.log(vm.playerOptions.sources[0].src)
								// console.log(vm.BannerList[vm.okLength].video)
							}, 50)
						},
					},
				},
				orId: false,
				assembleDetail: '',
				arm_stepsArr: [],
				playerOptions: {
					playbackRates: [0.5, 1.0, 1.5, 2.0], //播放速度
					autoplay: true, //如果true,浏览器准备好时开始回放。
					muted: false, // 默认情况下将会消除任何音频。
					loop: true, // 导致视频一结束就重新开始。
					preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
					aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
					fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
					sources: [{
						type: "video/mp4", //类型
						src: '' //url地址
					}],
					poster: '', //你的封面地址
					notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
					controlBar: {
						timeDivider: true,
						durationDisplay: true,
						remainingTimeDisplay: false,
						fullscreenToggle: true //全屏按钮
					}
				},
				playerOptions_: {
					autoplay: false, //如果true,浏览器准备好时开始回放。
					muted: false, // 默认情况下将会消除任何音频。
					loop: false, // 导致视频一结束就重新开始。
					preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
					language: 'zh-CN',
					aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
					fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
					sources: [{
						type: "video/mp4", //类型
						src: '' //url地址
					}],
					poster: '', //你的封面地址
					notSupportedMessage: '此视频暂无法播放，请稍后再试' //允许覆盖Video.js无法播放媒体源时显示的默认信息。
				},
				fileList: [],
				bigBoxImg: '',
				file: '',
				fileimgurl: [],
				filevideourl: [],
				uploadBtn: false,
				assembleFileListArr: '',
				assembleFileListimgArr: [],
				assembleFileListvideoArr: [],
				fileBtn: false,
				cropperPhoto: {
					dialog: false
				},
				wrench: {
					dialog: false,
					barcodeObj: {},
					query: {}
				},
				
			}

		},
		props: {
			/* BannerList:{
				type:Array,
				default:function(){
					return [{},{},{},{},{},{},{},{}]
				}
			} */
		},
		computed: {
			swiper() { //零件滑动
				return this.$refs.mySwiper.swiper
			},
			...mapGetters({
				url: "geturl",
				token: "getToken"
			})
		},
		methods: {
			changeClose(param) {
				this.cropperPhoto.dialog = param;
			},
			wrenchClose(param) {
				this.wrench.dialog = param;
			},
			axiosData(parts_number, name) { //装配页面数据
				let that = this;
				that.axios.get(that.url + '/api/v1/assemble/detail', {
					params: {
						parts_number: parts_number,
						name: name,
					},
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': that.token
					}
				}).then(function(response) {
					if (response.status === 200) {
						const data = response.data.data;
						that.assembleDetail = data;
						that.playerOptions.sources[0].src = data.arm_steps[0].video;
						that.playerOptions.poster = data.arm_steps[0].image;
						that.arm_stepsArr = data.arm_steps;
						that.BannerList = that.arm_stepsArr;
						// console.log(that.assembleDetail, that.arm_stepsArr);
						for (var j = 0; j < that.arm_stepsArr.length; j++) {
							that.arm_stepsArr[j].index_ = j;
							if (that.arm_stepsArr[j].number == that.arm_stepsArr[j].user_count) {
								that.arm_stepsArr[j].pro_status = true;
							}
							if (that.arm_stepsArr[j].image == '') {
								that.arm_stepsArr[j].image = 'http://zrui.e7vr.com/image/arm/default.gif';
							}
						}
						// that.update_arm_stepsArr();
					}
				}).catch(function(error) {
					console.log(error);
					that.$notify({
						title: '提示',
						message: '网络请求错误，请刷新页面',
						type: 'warning'
					});
				});
			},
			BannerListClick(val) { //零件当前点击的
				var that = this;
				if (val.pro_status != undefined && val.pro_status == true) {
					that.$notify({
						title: '提示',
						message: '当前零件已装配,可编辑',
						type: 'warning'
					});
				}
				that.barcodeObj = val;
				if (val.wrench == 2) {
					that.wrench.dialog = true;
					that.wrench.barcodeObj = val;
					that.wrench.query = that.$route.query;
				}
				that.okLength = val.index_;
				that.playerOptions.sources[0].src = val.video;
				that.playerOptions.poster = val.image;
			},
			assembleFileList() { //附件列表s
				let that = this;
				that.axios.get(that.url + '/api/v1/assemble/file-list', {
					params: {
						id: that.$route.query.id
					},
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': that.token
					}
				}).then(function(response) {
					
					if (response && response.data && response.data.code == 200) {
						var data = response.data.data;
						var imgArr = [];
						var videoArr = [];
						data.map(item => {
							if (item.type == 1) { imgArr.push(item) }
							if (item.type == 2) { 
								that.playerOptions_.sources[0].src = item.url;
							}
						})
						that.fileList = [...imgArr];
					}
					
					
					// that.assembleFileListArr = response.data.data;
					// for (var i = 0; i < that.assembleFileListArr.length; i++) {
					// 	if (that.assembleFileListArr[i].type == 1) {
					// 		that.assembleFileListimgArr.push(that.assembleFileListArr[i]);
					// 		that.fileList = that.assembleFileListimgArr;
					// 	} else if (that.assembleFileListArr[i].type == 2) {
					// 		that.assembleFileListvideoArr.push(that.assembleFileListArr[i])
					// 		that.playerOptions_.sources[0].src = that.assembleFileListArr[i].url;
					// 	}
					// }
				}).catch(function(error) {
					console.log(error);
				});
			},
			removeThisImg(tab, index) { //删除附件中的元素
				// console.log(tab, index);
				var that = this;
				// that.assembleFileListimgArr.splice(index, 1);
			},
			assembleObtain() { //保存附加
				let that = this;
				let fileimgurl = that.fileimgurl;
				// var url_ = that.fileList;
				// var vidurl_ = that.filevideourl;
				// that.fileimgurl = [];
				// that.filevideourl = [];
				// console.log('IMGIMGIMGIMG', fileimgurl);
				var file = [fileimgurl];
				// if (url_.length > 0) {
				// 	var urlArr = [];
				// 	for (var i = 0; i < url_.length; i++) {
				// 		file.push({
				// 			url: url_[i].url,
				// 			type: 1
				// 		})
				// 	}
				// }
				// if (vidurl_.length > 0) {
				// 	var vidurl_Arr = [];
				// 	for (var i = 0; i < vidurl_.length; i++) {
				// 		file.push({
				// 			url: vidurl_[i].url,
				// 			type: 2
				// 		})
				// 	}
				// }
				var id = that.$route.query.id;
				let postData = Qs.stringify({
					assemble_id: id,
					file: file
				});
				that.axios.post(that.url + '/api/v1/assemble/file-save', postData, {
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': that.token
					}
				}).then(function(response) {
					// console.log('保存附加',response);
					if (response.status == 200) {
						// that.fileList = [];
						// that.assembleFileListArr = '';
						// that.assembleFileListimgArr = [];
						// that.assembleFileListvideoArr = [];
						// that.uploadBtn = false;
						that.assembleFileList();
						that.$message({
							message: '上传成功',
							type: 'success'
						});
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			barcode_Data() { //扫码触发
				let that = this;
				var type = that.type;
				var parts_number = that.barcode_val;

				if (parts_number.length == 8) {
					that.axios.get(that.url + '/api/v1/assemble/obtain', {
						params: {
							type: type,
							parts_number: parts_number
						},
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							'token': that.token
						}
					}).then(function(response) {
						// console.log(response);
						var data = response.data.data;
						//that.barcodeObj=data;//循环arm_stepsArr 对比两个id是否相等，调用assembleParst()
						for (var i = 0; i < that.arm_stepsArr.length; i++) {
							// if (that.arm_stepsArr[i].product_type == 2) {
							if (that.arm_stepsArr[i].module_id == that.barcodeObj.module_id && that.arm_stepsArr[i].title == that.barcodeObj
								.title && that.arm_stepsArr[i].pro_status == undefined && that.arm_stepsArr[i].product_type == 2) {
								if (that.arm_stepsArr[i].number > 1 && that.arm_stepsArr[i].number > that.arm_stepsArr[i].user_count) {
									that.arm_stepsArr[i].user_count += 1;
									that.$message('当前零件需要' + that.arm_stepsArr[i].number + '个,已扫描' + that.arm_stepsArr[i].user_count + '个');
									that.beforeNum = that.arm_stepsArr[i].user_count;
									// that.endNum = that.arm_stepsArr[i].number
									if (that.arm_stepsArr[i].number == that.arm_stepsArr[i].user_count) {
										// that.$notify({title: '提示', message: '成功', type: 'success' });
										that.arm_stepsArr[i].title = that.arm_stepsArr[i].title + ' ';
										that.arm_stepsArr[i].pro_status = true;
										// console.log(that.assembleDetail,that.arm_stepsArr[i]);
										that.okLength = i;
										var id = that.$route.query.id;
										var type = that.type;
										var parts_id = that.barcodeObj.id;
										var parts_number = that.barcode_val;
										that.barcode_val = '';
										that.assembleParst(id, type, parts_id, parts_number)
									}
									// else if (that.arm_stepsArr[i].number < that.arm_stepsArr[i].user_count) {
									//   that.$notify({title: '警告', message: '扫描失败，请扫描下一个零件', type: 'warning' });
									// }
								} else if (that.arm_stepsArr[i].number == 1) {
									that.arm_stepsArr[i].user_count += 1;
									that.$message('当前零件需要' + that.arm_stepsArr[i].number + '个,已扫描' + that.arm_stepsArr[i].number + '个');
									that.beforeNum = that.arm_stepsArr[i].user_count;
									// that.endNum = that.arm_stepsArr[i].number
									// if (that.arm_stepsArr[i].number == that.arm_stepsArr[i].user_count) {
									// that.$notify({title: '提示', message: '成功', type: 'success' });
									that.arm_stepsArr[i].title = that.arm_stepsArr[i].title + ' ';
									that.arm_stepsArr[i].pro_status = true;
									// ++that.arm_stepsArr[i].user_count;
									that.okLength = i;
									var id = that.$route.query.id;
									var type = that.type;
									var parts_id = that.barcodeObj.id;
									var parts_number = that.barcode_val;
									that.barcode_val = '';
									that.assembleParst(id, type, parts_id, parts_number)
									// }
								}
								break;
							}
							// }
						}
						// console.log(that.barcodeObj);
					}).catch(function(error) {
						console.log(error);
					});
				}

			},
			barcode_Data_type() { //标件1
				let that = this;
				//
				for (var i = 0; i < that.arm_stepsArr.length; i++) {
					// console.log('.....')
					if (that.arm_stepsArr[i].module_id == that.barcodeObj.module_id && that.arm_stepsArr[i].title == that.barcodeObj.title &&
						that.arm_stepsArr[i].pro_status == undefined && that.arm_stepsArr[i].product_type == 1) {
						// console.log('___________________________')
						// that.arm_stepsArr[i].user_count = that.arm_stepsArr[i].number;
						if (that.arm_stepsArr[i].number == that.arm_stepsArr[i].user_count) {
							// that.$notify({title: '提示', message: '成功', type: 'success' });
							that.arm_stepsArr[i].title = that.arm_stepsArr[i].title + ' ';
							that.arm_stepsArr[i].pro_status = true;
							// console.log('+++++',that.assembleDetail,that.arm_stepsArr[i]);
							that.okLength = i;
							var id = that.$route.query.id;
							var product_id = that.barcodeObj.product_id;
							var product_number = that.barcodeObj.user_count;
							that.assembleParst(id, 3, '', '', product_id, product_number)
						} else {
							if (that.arm_stepsArr[i].user_count == 0) {
								that.$message('当前零件' + that.arm_stepsArr[i].title + '需要添加' + that.arm_stepsArr[i].number + '个');
							} else if (that.arm_stepsArr[i].user_count > 0) {
								var allNUM = that.arm_stepsArr[i].user_count;
								var chaNUM = that.arm_stepsArr[i].number - that.arm_stepsArr[i].user_count;
								// console.log(allNUM, chaNUM);
								that.$notify.info({
									title: that.arm_stepsArr[i].title,
									message: '当前零件已添加' + allNUM + '个,还要添加' + chaNUM + '个'
								});
							}

						}
						break;
					}
				}

			},
			handleChange_num(value) {
				console.log(value);
				this.num__ = value;
			},
			assemble_updateDetail() { //编辑
				var that = this;
				var id = that.$route.query.id;
				var product_id = that.barcodeObj.product_id;
				var type = that.barcodeObj.product_type;
				var parts_number = '';
				var number = '';
				if (type == 1) {
					number = that.num__;
				}
				if (type == 2) {
					parts_number = that.barcodeObj.number;
				}
				//console.log('任务ID：', id, '图样id：', product_id, '类型：', type, '零件(非标准化)：', parts_number, '数量(标准化)：', number);
				let postData = Qs.stringify({
					assemble_id: id, //
					product_id: product_id, //
					type: type, //
					parts_number: parts_number, //
					number: number //
				});
				that.axios.post(that.url + '/api/v1/assemble/update-detail', postData, {
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': that.token
					}
				}).then(function(response) {
					// console.log(response);
					if (response.status === 200) {
						that.barcodeObj.pro_status = false;
						that.$notify({
							title: '提示',
							message: '零件已提交',
							type: 'success'
						});
						that.dialogFormVisible_editor = false;
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			barcode__Data() { //报损
				let that = this;
				that.axios.get(that.url + '/api/v1/assemble/obtain', {
					params: {
						type: that.type,
						parts_number: that.barcode__val
					},
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': that.token
					}
				}).then(function(response) {
					// console.log(response);
					that.lossSave = response.data.data;
				}).catch(function(error) {
					console.log(error);
				});
				//
			},
			upBarcode__Data() { //报损提交
				let that = this;
				var product_id = that.lossSave.product_id;
				var product_name = that.lossSave.product_name;
				var parts_number = that.barcode__val;
				var image = '';
				var video = '';
				var number = '';
				var type = that.type;
				let postData = Qs.stringify({
					product_id: product_id, //
					product_name: product_name, //
					parts_number: parts_number, ////
					// image: image,//
					// video: video,//
					// number: number,//
					type: type, ////
					source: 3 ////
				});
				that.axios.post(that.url + '/api/v1/loss/save', postData, {
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': that.token
					}
				}).then(function(response) {
					// console.log(response);
					if (response.status === 200) {
						that.$notify({
							title: '提示',
							message: '报损零件已提交',
							type: 'success'
						});
						that.dialogFormVisible = false;
						that.barcode__val = '';
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			assembleParst(id, type, parts_id, parts_number, product_id, product_number) { //扫码零件完成调用
				let that = this;
				let postData = Qs.stringify({
					assemble_id: id,
					type: type,
					product_id: product_id,
					product_number: product_number,
					parts: [{
						parts_id: parts_id,
						parts_number: parts_number
					}]
				});
				that.axios.post(that.url + '/api/v1/assemble/parts', postData, {
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': that.token
					}
				}).then(function(response) {
					// console.log(response);
					if (response.status === 200) {
						that.$notify({
							title: that.barcodeObj.title,
							message: '装配成功',
							type: 'success'
						});
						that.okLength += 1;
						// console.log(that.okLength)
						that.barcodeObj = that.arm_stepsArr[that.okLength];
					}
				}).catch(function(error) {
					console.log(error);
					that.barcodeObj.title = that.barcodeObj.title + ' ';
					that.barcodeObj.pro_status = false;
					that.$notify({
						title: '扫描失败',
						message: '零件库存不足或条码重复使用',
						type: 'warning'
					});
				});
			},
			uploadData(assemble_id, status = 3) { //所有零件装配完成调用
				let that = this;
				var assemble_id = that.$route.query.id;
				let postData = Qs.stringify({
					assemble_id: assemble_id,
					status: status
				});
				that.axios.post(that.url + '/api/v1/assemble/update', postData, {
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': that.token
					}
				}).then(function(response) {
					// console.log(response);
					if (status == 3) {
						that.$notify({
							title: '提示',
							message: '装配完成，请返回任务列表选择新的任务',
							type: 'success'
						});
					}

				}).catch(function(error) {
					console.log(error);
				});
			},
			handleRemove(file, fileList) { //附件上传中列表删除（此时没有上传到服务器）
				
				let that = this;
				var delfile = [{
					url: file.url,
					type: file.type
				}];
				let postData = Qs.stringify({
					assemble_id: that.$route.query.id, //
					file: delfile
				});
				that.axios.post(that.url + '/api/v1/assemble/file-save', postData, {
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': that.token
					}
				}).then(function(response) {
					if (response.status == 200) {
						that.assembleFileList();
						that.$message({
							message: '上传成功',
							type: 'success'
						});
					}
				}).catch(function(error) {
					console.log(error);
				});

			},
			handlePreview(file) { //点击附件图片放大
				this.bigBoxImg = file.url;
			},
			handleSuccess(event, file, fileList) {
				console.log(event, file, fileList);

			},
			handleError(err, file, fileList) {
				if (fileList.length == 0) {
					this.uploadBtn = false;
				}
			},
			/* handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			}, */
			beforeUpload(file) { //需要上传的文件
				console.log(file, '文件');
				this.file = file;
				// this.fileBtn = true;
				//
				this.update();
				//
			},
			update() { //上传附件（此时执行的是上传到服务器）
				var that = this;
				let postData = new FormData(); //创建form对象
				var file_ = that.file
				postData.append('file', file_); //通过append向form对象添加数据
				that.axios.post(that.url + '/api/v1/upload', postData, {
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': that.token
					}
				}).then(function(response) {
					// if (that.file.type == 'video/mp4') {
					// 	// console.log('video/mp4',response.data.data.url);
					// 	// that.fileimgurl = [];
					// 	// that.filevideourl = [];
					// 	that.filevideourl.push({
					// 		url: response.data.data.url,
					// 		type: 2
					// 	})
					// 	// console.log(that.filevideourl)
					// 	if (that.filevideourl.length > 0) {
					// 		// that.uploadBtn = true;
					// 		that.assembleObtain();
					// 	}
					// } else {
					// 	// console.log('image/jpg',response.data.data.url);
					// 	// that.filevideourl = [];
					// 	// that.fileimgurl = [];
					// 	that.fileList.push({
					// 		url: response.data.data.url,
					// 		type: 1
					// 	})
					// 	// console.log(that.fileList)
					// 	if (that.fileList.length > 0) {
					// 		// that.uploadBtn = true;
					// 		// console.log(that.fileList);
					// 		that.assembleObtain();
					// 	}
					// }
					that.fileimgurl = {
						url: response.data.data.url,
						type: file_.type == 'video/mp4' ? 2 : 1
					}
					that.assembleObtain();
				}).catch(function(error) {
					console.log(error);
				});
			},
			goBack() { //点击了浏览器的返回按钮
				// console.log("点击了浏览器的返回按钮");
				var that = this;
				let id = that.id_;
				// this.uploadData(id, 2)
				sessionStorage.clear();
				window.history.back();
			},
			keyupEnter() {
				var that = this;
				document.onkeydown = e => {
					if (e.keyCode === 13) {
						that.barcode_Data_type();
					}
				}
			},
			bgDrage() {
				this.bigBoxImg = '';
			},
			update_arm_stepsArr() {
				var that = this;
				// console.log('++++++++++++++++++++++++++++++++++++++++++')
				var pro_status_true = [];
				var pro_status_fasle = [];
				for (var i = 0; i < that.arm_stepsArr.length; i++) {
					if (that.arm_stepsArr[i].pro_status != undefined && that.arm_stepsArr[i].pro_status == true) {
						pro_status_true.push(that.arm_stepsArr[i].pro_status)

					}
					if (that.arm_stepsArr[i].pro_status == undefined || that.arm_stepsArr[i].pro_status == false) {
						pro_status_fasle.push(that.arm_stepsArr[i]);
					}

				}
				if (pro_status_fasle.length > 0) {
					if (that.barcodeObj == '') {
						that.barcodeObj = pro_status_fasle[0];
						that.okLength = that.barcodeObj.index_;
					}

				}
				// console.log('已装配：',pro_status_true,'\n','未装配：',pro_status_fasle);
				if (that.arm_stepsArr.length == pro_status_true.length) {
					// console.log('===========')
					that.pro_status = true;
				} else {
					that.pro_status = false;
				}
			},
			seachInputVlaue(val) {

				var that = this;
				let parts_number = that.$route.query.parts_number;
				let name = val;
				if (name != '') {
					that.axiosData(parts_number, name);
					that.okLength = 0;
				} else {
					that.axiosData(parts_number);
					that.okLength = 0;
				}

			},

			////////////////////////
			
		},
		//注册局部组件指令
		directives: {
			drag: function(el) {
				let dragBox = el; //获取当前元素
				dragBox.onmousedown = e => {
					//算出鼠标相对元素的位置
					let disX = e.clientX - dragBox.offsetLeft;
					let disY = e.clientY - dragBox.offsetTop;
					document.onmousemove = e => {
						//用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
						let left = e.clientX - disX;
						let top = e.clientY - disY;
						//移动当前元素
						dragBox.style.left = left + "px";
						dragBox.style.top = top + "px";
					};
					document.onmouseup = e => {
						//鼠标弹起来的时候不再移动
						document.onmousemove = null;
						//预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
						document.onmouseup = null;
					};
				};
			}
		},

		beforeUpdate() { //生命周期（数据发生变化零件滑动）
			console.log( this.swiper);
			this.swiperOption.scrollbar = '.' + this.swiper.$el[0].nextElementSibling.className;
			this.swiper.slideTo(this.okLength, 1000, true);
			this.update_arm_stepsArr();
			var that = this;
			// for (var j = 0; j < that.arm_stepsArr.length; j++) {
			//   if (that.arm_stepsArr[j].pro_status == undefined ) {
			//     // console.log('-=-=-=-=-=',that.arm_stepsArr[j],j);
			//     that.barcodeObj = that.arm_stepsArr[j];
			//     break;
			//   }
			// }


		},
		// updated() {
		//   // if(this.barcodeObj == '') {
		//     // this.update_arm_stepsArr();
		//   // }
		// },
		created() {
			let that = this;
			let id = that.id_ = that.$route.query.id;
			let type = that.type = that.$route.query.type;
			let parts_number = that.parts_number = that.$route.query.parts_number;
			if (that.$route.path == "/content") {that.keyupEnter()}
			const loading = that.$loading({
				lock: true,
				text: 'Loading',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			});
			setTimeout(() => {
				loading.close();
			}, 1000);
			if (id != undefined || parts_number != undefined) {
				that.axiosData(parts_number);
				that.orId = true;
				that.$store.state.ifThisPage = true;
				that.assembleFileList();
			} else {
				this.$confirm('请选择要配置的模块，方可进行装配', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					that.$router.push({
						path: '/createmodular'
					});
				}).catch(() => {
					that.$router.push({
						path: '/createmodular'
					});
				});
			}



		},
		beforeDestroy() {
			var that = this;
			// for (var i=0; i < that.arm_stepsArr.length; i++) {
			//   if (that.arm_stepsArr[i].pro_status == undefined) {
			let id = that.id_;
			//     if (id != undefined) {
			//       console.log(id, 'beforeDestroy')
			// this.uploadData(id, 2)
			//     }

			//   }

			// }

		},
		//     mounted () {
		//         if (window.history && window.history.pushState) {
		//             // 向历史记录中插入了当前页
		//             history.pushState(null, null, document.URL);
		//             window.addEventListener('popstate', this.goBack, false);
		//         }


		//     },
		destroyed () {
			// window.removeEventListener('popstate', this.goBack, false);
			//this.websock.close() //离开路由之后断开websocket连接
			
		},
	}
</script>

<style scoped>
	.el-input {
		margin: 10px 0px;
	}

	/deep/ .el-select .el-input {
		width: 100px;
	}

	.el-main {
		padding: 0;
		overflow: hidden;
	}

	/* .swiperbanner_container /deep/ .swiper-wrapper {
    margin-left: 10px;
  } */
	/* .thisdetail, .thisupData {
    margin-left: 20px;
  } */
	.thisdetail>.el-row {
		margin-top: 10px;
	}

	.thisdetail>.el-row:last-child {
		margin: 0;
	}

	.thisdetail .el-form-item__label,
	.thisdetail .el-form-item__content {
		font-size: 16px;
		line-height: 45px;
	}

	/* .thisdetail .detailwrap {
    width: 176px;
    height: 164px;
    background: url(../../assets/4.png) no-repeat;

  } */
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
		margin: 14px 0;
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
		background-size: cover;
		background-position: center;
		/* opacity: .6; */
	}

	.swiper-button-next,
	.swiper-button-prev {
		width: 100px;
		height: 180px;
		border-radius: 10px;
		top: 20%;
		background-size: 80px 80px;
	}

	.partList .el-form-item__label,
	.partList .el-form-item__content {
		color: #FFFFFF;
		height: 25px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.partListBg {
		background-color: rgba(0, 0, 0, .3);
	}

	.el-icon-success {
		-ms-transition: .3s;
		-webkit-transition: .3s;
		transition: .3s;
		color: rgba(0, 255, 132, 0.65);
		position: absolute;
		left: 30%;
		top: 28%;
		z-index: 10;
		font-size: 100px;
	}

	.el-col .el-icon-error {
		color: #2c3e50;
	}

	.swiperbanner_container {
		width: 100%;
		height: 235px;
		position: relative;
		padding: 5px;
		margin-top: 10px;
		overflow: visible !important;
		margin-bottom: 15px;
	}

	.swiper-pagination {
		bottom: -12px;
	}

	.bgGrey {
		background-color: rgba(0, 0, 0, .3);
	}

	.swiper-slide {
		width: 220px !important;
		height: 200px;
		margin-top: 3px;
		background-color: #FFFFFF;
		border-radius: 10px;
		overflow: hidden;
	}

	.swiper-wrapper {
		transform: translate3d(0px, 0px, 0px) !important;
	}

	.swiper-wrapper .swiper-slide-active {
		box-shadow: 0px 10px 20px 0px rgba(140, 140, 140, 0.99);
		margin-top: 0px;
		border: 4px solid #66ec0b;
		width: 225px !important;
		height: 205px !important;
	}

	.thisvideo .demo {
		/* display: inline-block; */
		/* width: 550px; */
		width: 100%;
		height: 335px;
		/* margin: 0 auto; */
		text-align: center;
		line-height: 100px;
		border: 1px solid transparent;
		/* border-radius: 10px; */
		overflow: hidden;
		background: #fff;
		position: relative;
	}

	/deep/ .video-js.vjs-fluid, /deep/ .video-js.vjs-16-9, /deep/ .video-js.vjs-4-3 {
		height: 335px;
		padding: 0;
	}
	/deep/ .vjs-poster {
		height: 335px;
	}
	/deep/ .video-player.video-player.vjs-custom-skin {
		height: 335px;
	}

	.demo:hover {
		display: block;
	}

	.upload-demo /deep/ .el-upload--picture-card {
		/* width: 120px;
    height: 120px; */
		line-height: 148px;
	}

	/* .upload-demo /deep/ .el-upload-dragger {
    width: 100%;
    height: 80px;
  }
  .upload-demo .el-upload-dragger .el-icon-upload {
    margin: 0;
    font-size: 60px;
  } */
	ul,
	li {
		list-style: none;
	}

	.el-upload-list__item {
		overflow: hidden;
		background-color: #fff;
		border: 1px solid #c0ccda;
		border-radius: 10px;
		box-sizing: border-box;
		width: 120px;
		height: 120px;
		margin: 5px 5px 5px 0;
		display: inline-block;
		position: relative;
	}

	.el-upload-list__item .el-icon-circle-close {
		position: absolute;
		right: -1px;
		top: -1px;
		font-size: 25px;
		color: #ff000073;
	}

	.el-upload-list__item>img {
		width: 100%;
		height: 100%;
	}

	.drag {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: rgba(0, 0, 0, 0);
	}

	.drag .el-icon-error {
		font-size: 40px;
		float: right;
		color: azure;
	}

	.drag_box {
		width: 620px;
		height: 500px;
		border: 1px solid #666;
		background-color: #060606;
		/* 使用定位，脱离文档流 */
		position: relative;
		top: 130px;
		left: 700px;
		/* 鼠标移入变成拖拽手势 */
		cursor: move;
		z-index: 3000;
	}

	.drag_box div {
		width: 100%;
		height: 100%;
	}
</style>
