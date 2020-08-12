<template>
	<el-container>
		<el-container>
			<el-main style="padding: 10px;">
				<Head v-bind:showsearch="showsearch" @onceAgain="seachInputVlaue" />
				<el-main class="Content" v-if="orId">
					<!-- <SearchInput @onceAgain="seachInputVlaue"></SearchInput> -->
				
					<div class="swiperbanner_container">
						<swiper :options="swiperOption" ref="mySwiper" style="padding: 5px 0;">
							<swiper-slide v-for="(item, index) in BannerList" :key="index">
								<!-- v-lazy:backgroundImage="item.image"     图片懒加载-->
								<!-- :style="{backgroundImage: 'url(' + item.image + ')'}" 图片批量加载 -->
								<div class="partList" :style="{backgroundImage: 'url(' + item.image_url + ')'}" @click="BannerListClick(item)">
									<i v-if="item.pro_status" class="el-icon-success"></i>
									<el-form class="bgGrey">
										<!-- <div class="el-form_item">
											<div class="el-form-item__content" style="overflow: hidden;">
												<span style="width: 100px;display: inline-block;">任务状态:</span>
												{{item.status==1?'未开始':item.status==2?'进行中':item.status==3?'已完成':''}}
											</div>
										</div>
										<div class="el-form_item">
											<div class="el-form-item__content">
												<span style="width: 100px;display: inline-block;">是否使用扳手:</span>
												{{item.is_wrench==1?'不使用':item.is_wrench==2?'使用':''}}
											</div>
										</div> -->
									</el-form>
									<!-- <div class="weachBtn" v-if="item.is_wrench == 2">
										<el-link :underline="false" type="danger" @click="openwrenchdialog(item)">连接扳手</el-link>
									</div> -->
								</div>
							</swiper-slide>
							<div class="swiper-button-prev" slot="button-prev"></div>
							<div class="swiper-button-next" slot="button-next"></div>
						</swiper>
						<div class="swiper-pagination"></div>
						<!--分页器。如果放置在swiper-container外面，需要自定义样式。-->
						<div class="swiper-scrollbar"></div>
					</div>
					<div class="detail borderRadiou partsbox" style="display: flex;flex-wrap: nowrap;">
						<div class="partsbox_box box1" style="width: 40vw;background-color: #FFFFFF;">
							<div class="thisvideo">
								<template>
									<div class="demo" v-if="playerOptions.sources[0].src != ''">
										<video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions">
										</video-player>
									</div>
									<!-- <div class="demo" v-else style="background: url('http://zrui.e7vr.com/image/arm/default.gif') no-repeat center 50%;"></div> -->
								</template>
								<div class="partsbox_box box3" style="height:150px;background-color: #FFFFFF;position: relative;overflow: hidden;margin-top: 5px;">
									<div class='demo1' style="width: 285px; height: 148px;display: inline-block;vertical-align: top;margin-right: 10px;" v-if="playerOptions_.sources[0].src!=''">
										<video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions_">
										</video-player>
									</div>
									<div class="thisupData" style="overflow: hidden;display: inline-block;vertical-align: top;height: 150px;">
										<el-upload class="upload-demo" action=""  list-type="picture-card" 
										 :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" :on-error="handleError"
										 :before-upload="beforeUpload" :file-list="fileList" >
											<i class="el-icon-plus"></i>
										</el-upload>
									</div>
									
									<el-button id="canbtn" type="success" style="position: absolute;right: 10px;bottom: 0px;" @click="cropperPhoto.dialog=true">拍照</el-button>
								</div>
							</div>
						</div>
						
						<div class="partsbox_box box2" style="width: 59vw;background-color: #FFFFFF;padding: 10px;">
							<div class="inp" style="min-width: 300px;position: relative;line-height: 60px;">
								<el-input v-model.trim="stepcode" suffix-icon="el-icon-full-screen" autofocus @input="stepcodeget" placeholder="零件码" style="width: 220px;margin: 0 !important;"></el-input>
								<el-button type="success" v-if="barcodeObj.is_wrench == 2" @click="openwrenchdialog(barcodeObj)" style="margin-left: 10px;">连接扳手</el-button>
							</div>
							<div class="thisdetail">
								<el-popover
									placement="right"
									width="300"
									trigger="hover"
									v-for="(item, index) in stepList" :key="index">
									<div>
										<el-table :data="item.parts" height="150" size="mini">
										    <el-table-column label="零件名称">
										        <template slot-scope="scope">
										            <span style>{{ item.element_name }}</span>
										        </template>
										    </el-table-column>
										    <el-table-column label="零件条码" width="90">
										        <template slot-scope="scope">
										            <span style>{{ scope.row.parts_number }}</span>
										        </template>
										    </el-table-column>
										    <el-table-column label="数量" width="70">
										        <template slot-scope="scope">
										            <span style>{{ scope.row.number }}</span>
										        </template>
										    </el-table-column>
										</el-table>
									</div>
									<div class="detail"  slot="reference">
										<div class="detitem">
											<div class="det_lable">名称</div>
											<div class="det_block">{{item.element_name}}</div>
										</div>
										<div class="detitem">
											<div class="det_lable">数量</div>
											<div class="det_block">{{item.is_use}}/{{item.element_number}}</div>
										</div>
										<div class="detitem">
											<div class="det_lable">代号</div>
											<div class="det_block">{{item.item}}</div>
										</div>
										<div class="detitem">
											<div class="det_lable">规格</div>
											<div class="det_block">{{item.specs}}</div>
										</div>
										<div class="detitem">
											<div class="det_lable">编码</div>
											<div class="det_block">{{item.category}}</div>
										</div>
									</div>
								</el-popover>
								
							</div>
						</div>
						<!-- <div class="partsbox_box box3" style="width: 350px;height:auto;margin: 10px 10px;background-color: #FFFFFF;position: relative;overflow: hidden;">
							<div class="thisupData" style="padding: 10px;width: 500px;height: 170px;overflow: hidden;">
								<el-upload class="upload-demo" action=""  list-type="picture-card"
								 :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" :on-error="handleError"
								 :before-upload="beforeUpload" :file-list="fileList" >
									<i class="el-icon-plus"></i>
								</el-upload>
							</div>
							<div class='demo1' style="width: 100%; height: 200px;margin-top: 5px;padding: 10px;" v-if="playerOptions_.sources[0].src!=''">
								<video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions_">
								</video-player>
							</div>
							<el-button id="canbtn" type="success" style="position: absolute;right: 10px;bottom: 10px;" @click="cropperPhoto.dialog=true">拍照</el-button>
						</div> -->
				
					</div>
					<el-footer class="foot_" style="height: auto;">
						<el-row type="flex" justify="end">
							<el-col :span="4">
								<el-button type="success" :disabled="status_==3" @click="uploadData()" v-if="pro_status">提　　交</el-button>
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
									</el-card>
								</el-col>
								<el-col style="margin-top: 20px;">
									<!--  -->
									<el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview"
									 :on-remove="handleRemove" :on-success="handleSuccess" :on-error="handleError" :before-upload="beforeUpload"
									 :file-list="fileList">
										<el-button size="small" type="primary">选择文件</el-button>
									</el-upload>
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
					<wrench ref="getwrench" v-bind:wrenchDialogVisible="wrench" @change="wrenchClose"></wrench>
					
					<!-- 装配零件（Temporarily abandoned） -->
					<nowstep ref="noestepchild" v-bind:noestepdialogVisible="noestepdialogVisible" @change="noestepClose" />
					
				</el-main>
			</el-main>
		</el-container>
	</el-container>
	
</template>

<script>
	import { mapActions, mapState, mapGetters } from "vuex"
	import Head from '@/components/Head.vue'
	import SearchInput from './SearchInput.vue'
	import 'swiper/dist/css/swiper.min.css'
	import { swiper, swiperSlide } from 'vue-awesome-swiper'
	import Qs from 'qs'
	import cropperPhoto from '@/components/content/assembly/cropperPhoto/CropperPhoto.vue'
	import wrench from '@/components/content/assembly/cropperPhoto/Torquewrench.vue'
	import nowstep from './dialog/noestep.vue'

	export default {
		name: "Content",
		components: {
			swiper,
			swiperSlide,
			SearchInput,
			cropperPhoto,
			wrench,
			Head,
			nowstep
		},
		data() {
			const vm = this;
			return {
				showsearch: false,
				BannerList: [],
				true_Arr: [],
				timer: null,
				input: '',
				select: '',
				left: 0,
				owidth: '',
				okLength: 0,
				id_: 0,
				type: 0,
				status_: 0,
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
							vm.okLength = this.activeIndex;
							clearInterval(vm.timer);
							if(vm.BannerList[vm.okLength]) {
								vm.timer = setTimeout(() => {
									vm.playerOptions.sources[0].src = vm.BannerList[vm.okLength].assemble_url;
									vm.playerOptions.poster = vm.BannerList[vm.okLength].assemble_url;
									vm.barcodeObj = vm.BannerList[vm.okLength];
								}, 50);
								vm.nowstepsdetail(vm.BannerList[vm.okLength]);
								vm.fileList = [];
								vm.playerOptions_.sources[0].src = '';
								vm.assembleFileList(vm.BannerList[vm.okLength]);
							}
							
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
				//
				cropperPhoto: {
					dialog: false
				},
				wrench: {
					dialog: false,
					barcodeObj: {},
					query: {}
				},
				// 零件详情列表
				stepcode: '', //零件码
				stepList: [],
				noestepdialogVisible: {
					dialog: false,
					obj: {}
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
		watch: {
			true_Arr() {
				console.log(this.true_Arr.length,this.BannerList.length)
				if (this.true_Arr.length == this.BannerList.length) {
					this.pro_status = true;
				}
			}
		},
		methods: {
			/*  */
			// 拍照弹窗
			changeClose(param) {
				this.cropperPhoto.dialog = param.start;
				this.fileimgurl = param.fileimgurl;
				if (this.fileimgurl) {
					this.assembleObtain();
				}
			},
			// 扳手窗口关闭
			wrenchClose(param) {
				this.wrench.dialog = param;
			},
			//装配页面步骤数据
			axiosData(parts_number, name) { 
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
					if (response && response.data && response.data.code == 200) {
						let data = response.data.data;
						that.true_Arr = [];
						data.map((item, index) => {
							item.index_ = index;
							if (item.image_url == '') {
								item.image_url = 'http://zrui.e7vr.com/image/arm/default.gif';
							}
							if (item.status == 3) {
								item.pro_status = true;
								that.true_Arr.push(item.pro_status);
								that.okLength = index+1;
							}
							return item;
						})
						that.BannerList = data;
						if(data[that.okLength]) {
							that.nowstepsdetail(data[that.okLength]);
							that.barcodeObj = data[that.okLength];
							that.playerOptions.sources[0].src = data[that.okLength].assemble_url;
							that.playerOptions.poster = data[that.okLength].assemble_url;
							console.log(data[that.okLength])
							that.assembleFileList(data[that.okLength]);
						}
						
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			// 点击当前步骤的信息
			BannerListClick(val) {
				this.barcodeObj = val;
				this.okLength = val.index_;
				this.nowstepsdetail(val);
				this.fileList = [];
				this.playerOptions_.sources[0].src = '';
				this.assembleFileList(val);
				
				this.playerOptions.sources[0].src = val.assemble_url;
				this.playerOptions.poster = val.assemble_url;
			},
			// 打开连接扳手弹窗
			openwrenchdialog() {
				this.wrench.dialog = true;
				this.wrench.barcodeObj = this.barcodeObj;
				this.wrench.query = this.$route.query;
				this.$refs.getwrench.getwrenchList(this.barcodeObj);
			},
			// 当前步骤详情
			nowstepsdetail(step) {
				let that = this;
				// console.log(step)
				if (step) {
					let params = {
						pipeline_step_id: step.pipeline_step_id,	// pipeline_step_id	string	是	流水线步骤ID
						assemble_id: step.assemble_id,				// assemble_id	string	是	任务ID
					};
					that.axios({
						method: 'GET',
						url: that.url+'/api/v1/assemble/steps-detail',
						params: params,
						headers: {
							"content-type": "application/json",
							"token": that.token
						}
					}).then( response => {
						if (response && response.data && response.data.code == 200) {
							let data = response.data.data;
							that.stepList = data;
						}
						
					}).catch( error => {
						console.log(error)
					});
				}
				
			},
			// 扫码零件信息
			stepcodeget() {
				let that = this;
				if (that.stepcode.length == 8) {
					let params = {
						parts_number: that.stepcode
					};
					that.axios({
						method: 'GET',
						url: that.url+'/api/v1/assemble/obtain',
						params: params,
						headers: {
							"content-type": "application/json",
							"token": that.token
						}
					}).then( response => {
						if (response && response.data && response.data.code == 200) {
							let data = response.data.data;
							that.stepList.map((item, index) => {
								if (data.category == item.category) {
									if (Number(item.is_use) < item.element_number) {
										that.assembleparts(index);
									} else if (Number(item.is_use) >= item.element_number) {
										that.$message({
											type: 'success',
											message: '当前零件“' + item.element_name +'”已完成',
											offset: 200
										})
										that.stepcode = '';
									}
									return
								}
							})
						}
					}).catch( error => {
						console.log(error)
						that.$message({
							message: that.errmessage(error.response.data),
							type: 'warning'
						});
						that.stepcode = '';
					});
				}
			},
			// 零件装配
			assembleparts(index) {
				let that = this;
				let indexobj = that.stepList[index];
				let number = 1;
				if (indexobj.product_type == '1') number = indexobj.element_number - Number(indexobj.is_use);
				let params = {
					assemble_id: that.barcodeObj.assemble_id,				// assemble_id			int	是	任务ID
					pipeline_id: indexobj.pipeline_id,				// pipeline_id			int	是	流水线ID
					pipeline_step_id: indexobj.pipeline_step_id,		// pipeline_step_id		int	是	步骤ID
					parts_number: that.stepcode,							// parts_number			int	是	组装零件条形码
					number: number,												// number				int	是	数量
				};
				that.axios({
					method: 'POST',
					url: that.url+'/api/v1/assemble/parts',
					params: params,
					headers: {
						"content-type": "application/json",
						"token": that.token
					}
				}).then( response => {
					if (response && response.data && response.data.code == 200) {
						if (indexobj.product_type != '1') {
							indexobj.is_use = Number(indexobj.is_use) + 1;
							let cha = indexobj.element_number - Number(indexobj.is_use);
							if (cha > 0) {
								that.$message({
									message: '已添加1个，当前零件还需'+cha+'个',
									offset: 200
								})
							}
						}
						
						that.stepcode = '';
						let parts_number = that.$route.query.parts_number;
						that.axiosData(parts_number, '');
						
					}
				}).catch( error => {
					console.log(error)
					that.$message({
						message: that.errmessage(error.response.data),
						type: 'warning'
					});
				});
				
			},
			
			/* 装配零件弹窗(Temporarily abandoned) */
			nowstepclick(item) {
				if (item.is_use < item.element_number) {
					this.noestepdialogVisible.dialog = true;
					this.noestepdialogVisible.obj = item ; //this.barcodeObj
					this.noestepdialogVisible.obj.pipeline_id_ = this.barcodeObj.pipeline_id;
					this.noestepdialogVisible.obj.assemble_id_ = this.barcodeObj.assemble_id;
					this.$refs.noestepchild.getstep(this.noestepdialogVisible.obj);
				} else {
					this.$message({
						message: '当前零件已完成',
						offset: 200
					})
				}
			},
			/* 关闭(Temporarily abandoned) */
			noestepClose(params) {
				this.noestepdialogVisible.dialog = params;
				let parts_number = this.$route.query.parts_number;
				this.axiosData(parts_number, '');
			},
			
			//附件列表s
			assembleFileList(item) { 
				let that = this;
				that.axios.get(that.url + '/api/v1/assemble/file-list', {
					params: {
						assemble_id: item.assemble_id,// assemble_id	int	是	任务id
						pipeline_id: item.pipeline_id,// pipeline_id	int	是	流水线ID
						pipeline_step_id: item.pipeline_step_id,// pipeline_step_id	int	是	流水线步骤ID
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
							if (item.type == 1) { imgArr.push(item); }
							if (item.type == 2) {
								that.playerOptions_.sources[0].src = item.url;
							}
						})
						if (imgArr.length>=2) {
							document.getElementsByClassName('el-upload')[0].style.display = 'none';
						} else {
							document.getElementsByClassName('el-upload')[0].style.display = 'inline-block';
						}
						that.fileList = [...imgArr];
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			//需要上传的文件
			beforeUpload(file) {
				// this.file = file;
				this.update(file);
			},
			//上传附件（此时执行的是上传到服务器）
			update(file) { 
				var that = this;
				let postData = new FormData(); //创建form对象
				// var file_ = that.file
				postData.append('file', file); //通过append向form对象添加数据
				that.axios.post(that.url + '/api/v1/upload', postData, {
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': that.token
					}
				}).then(function(response) {
					that.fileimgurl = {
						url: response.data.data.url,
						type: file.type == 'video/mp4' ? 2 : 1
					}
					that.assembleObtain();
				}).catch(function(error) {
					console.log(error);
				});
			},
			//保存附加
			assembleObtain() { 
				let that = this;
				let fileimgurl = that.fileimgurl;
				var file = [fileimgurl];
				var id = that.$route.query.id;
				let postData = Qs.stringify({
					assemble_id: that.barcodeObj.assemble_id,// assemble_id	int	是	任务id
					pipeline_id: that.barcodeObj.pipeline_id,// pipeline_id	int	是	流水线ID
					pipeline_step_id: that.barcodeObj.pipeline_step_id,// pipeline_step_id	int	是	流水线步骤ID
					url: fileimgurl.url,// url	int	是	附件地址
					type: fileimgurl.type,// type	int	是	类型： 1 图片 2 视频
				});
				that.axios.post(that.url + '/api/v1/assemble/file-save', postData, {
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': that.token
					}
				}).then(function(response) {
					if (response.status == 200) {
						that.assembleFileList(that.barcodeObj);
						that.$message({
							message: '上传成功',
							type: 'success'
						});
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			//附件上传中列表删除
			handleRemove(file, fileList) { 
				let that = this;
				that.axios({
					method: 'GET',
					url: that.url+'/api/v1/assemble/file-deleted',
					params: {
						id: file.id
					},
					headers: {
						"content-type": "application/json",
						"token": that.token
					}
				}).then( response => {
					if (response && response.data && response.data.code == 200) {
						that.assembleFileList(that.barcodeObj);
						that.$message({
							message: '已删除',
							type: 'success'
						});
					}
				}).catch( error => {
					console.log(error)
				});
			
			},
			//点击附件图片放大
			handlePreview(file) { 
				this.bigBoxImg = file.url;
			},
			// 关闭放大图片
			bgDrage() {
				this.bigBoxImg = '';
			},
			
			
			//所有零件装配完成调用
			uploadData(status=3) { 
				let that = this;
				var assemble_id = that.$route.query.id;
				let postData = Qs.stringify({
					assemble_id: assemble_id,
					status: status
				});
				console.log(postData)
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
			
			
			/*  */
			
			
			barcode_Data() { //扫码触发(Temporarily abandoned)
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
			assembleParst(id, type, parts_id, parts_number, product_id, product_number) { //扫码零件完成调用(暂时废弃)
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
						// that.barcode_Data_type();
					}
				}
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
		},
		//注册局部组件指令（附件图片放大）
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
			// console.log( this.swiper);
			this.swiperOption.scrollbar = '.' + this.swiper.$el[0].nextElementSibling.className;
			this.swiper.slideTo(this.okLength, 1000, true);
			// this.update_arm_stepsArr();
			// var that = this;
			// for (var j = 0; j < that.arm_stepsArr.length; j++) {
			//   if (that.arm_stepsArr[j].pro_status == undefined ) {
			//     // console.log('-=-=-=-=-=',that.arm_stepsArr[j],j);
			//     that.barcodeObj = that.arm_stepsArr[j];
			//     break;
			//   }
			// }


		},
		
		created() {
			let that = this;
			let id = that.id_ = that.$route.query.id;
			let type = that.type = that.$route.query.type;
			that.status_ = that.$route.query.status;
			let parts_number = that.parts_number = that.$route.query.parts_number;
			// if (that.$route.path == "/content") {that.keyupEnter()}
			// const loading = that.$loading({
			// 	lock: true,
			// 	text: 'Loading',
			// 	spinner: 'el-icon-loading',
			// 	background: 'rgba(0, 0, 0, 0.7)'
			// });
			// setTimeout(() => {
			// 	loading.close();
			// }, 1000);
			if (id != undefined || parts_number != undefined) {
				// that.showsearch = true;
				that.axiosData(parts_number);
				that.orId = true;
				that.$store.state.ifThisPage = true;
				
				// setTimeout(() => {
				// 	that.assembleFileList(that.BannerList[that.okLength]);
				// }, 1000);
				
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
			let id = this.id_;
		},
		destroyed () {
			/* window.removeEventListener('popstate', this.goBack, false);
			this.websock.close() //离开路由之后断开websocket连接 */
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
	.thisdetail {
		height: 375px;
		overflow: auto;
	}
	.thisdetail > span {
		vertical-align: top;
		overflow: hidden;
		display: inline-block;
	}
	.thisdetail .detail {
		width: 180px;
		min-height: 125px;
		line-height: 1.8;
		display: inline-block;
		margin: 5px;
		padding: 5px;
		cursor: pointer;
		box-shadow: 1px 1px 1px 1px rgb(0, 0, 0, 0.16);
	}
	.thisdetail .detail > div {
		line-height: 1.3;
		margin-bottom: 2px;
	}
	.thisdetail .detail > div:last-of-type {
		margin-bottom: 0;
	}
	.thisdetail .detail .det_lable {
		float: left;
		width: 36px;
	}
	.thisdetail .detail .det_block {
		overflow: hidden;
		min-height: 18px;
	}
	.thisdetail .detail div span {
		width: 50px;
		display: inline-block;
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
		left: 27%;
		top: 20%;
		z-index: 10;
		font-size: 100px;
	}
	.partList .weachBtn {
		position: absolute;
		right: 15px;
		bottom: 10px;
	}

	.el-col .el-icon-error {
		color: #2c3e50;
	}

	.swiperbanner_container {
		width: 100%;
		height: 235px;
		position: relative;
		padding: 0 5px 5px;
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
		/* margin: 0 auto; */
		text-align: center;
		line-height: 100px;
		border: 1px solid;
		border-radius: 5px;
		overflow: hidden;
		background: #fff;
		position: relative;
		z-index: 100;
	}

	/deep/ .video-js.vjs-fluid, /deep/ .video-js.vjs-16-9, /deep/ .video-js.vjs-4-3 {
		height: 410px;
		padding: 0;
	}
	.demo1 /deep/ .video-js.vjs-fluid, /deep/ .video-js.vjs-16-9, /deep/ .video-js.vjs-4-3 {
		height: 148px;
		border-radius: 5px;
		overflow: hidden;
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
