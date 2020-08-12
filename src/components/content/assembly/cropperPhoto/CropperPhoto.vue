<template>
	<div>
		<el-dialog :visible.sync="centerDialogVisible" :close-on-click-modal="false" :before-close="close" width="700px">
			<div class="Record">
				<article>
					<section class="experiment">
						<div id="videos-container"></div>
						<el-progress :percentage="percentage" :show-text="false" :color="customColorMethod" v-if="startBtn.start"></el-progress>
					</section>
					<section class="experiment" v-show="imgSrc">
						<canvas id="canvasCamera" width="320" height="240"></canvas>
					</section>
					<section class="experimentbtn">
						<!-- <el-button id="openCamera" :disabled="openBtn.disabled" @click="openCameraBtn">打开摄像头</el-button> -->
						<el-button id="start-recording" :disabled="startBtn.disabled" @click="startRecording">开始录制</el-button>
						<el-button id="start-recording" v-if="stopBtn" @click="stopRecording">停止录制</el-button>
						<!-- <el-button id="save-recording" :disabled="saveBtn.disabled" @click="saveRecording">保存</el-button> -->
						<el-button v-if="openBtn.disabled" @click="setRecording">{{startBtn.disabled?'抓拍':'拍照'}}</el-button>
					</section>
				</article>
			</div>
		</el-dialog>
		<!-- <div class="hello">
			<p>预览</p>
			<div class="before"></div>
			<el-button style="margin: 30px auto;" type="error" @click="sureSava">裁剪</el-button>
			<div class="container">
				<div class="img-container">
					<img src="../../../assets/110420cf.png" ref="image" alt=""> 
				</div>
				<div class="afterCropper">
					<img :src="afterImg" alt="">
				</div>
			</div>
		</div> -->
	</div>
	
</template>

<script>
	import { mapActions, mapState, mapGetters } from "vuex"
	export default {
		data() {
			return {
				mediaStream: '',
				recorderFile: '',
				stopRecordCallback: '',
				mediaRecorder: {
					blobs: []
				},
				openBtn: {
					disabled: false
				},
				startBtn: {
					disabled: true,
					start: false,
				},
				saveBtn: {
					disabled: true
				},
				stopBtn: false,
				startTimeOut: '',
				startInterval: '',
				imgSrc: '',
				imageFiles: {},
				filelist: {},
				percentage: 0,
				
				myCropper: null,
				afterImg: '',
				
			}
		},
		computed: {
			...mapState({
				url: state => state.url,
			}),
			...mapGetters({
				token: "getToken"
			})
		},
		props: {
			centerDialogVisible: '',
		},
		mounted() {
			// this.init()
			// this.openCameraBtn();
		},
		watch: {
			centerDialogVisible() {
				setTimeout(() => {
					this.openCameraBtn()
				}, 100)
			}
		},
		methods: {
			
			customColorMethod(percentage) {
				if (percentage < 20) {
					return '#909399';
				} else if (percentage < 99) {
					return '#e6a23c';
				} else {
					return '#67c23a';
				}
			},
			
			/* 开始 */
			openCameraBtn() {
				this.openBtn.disabled = true;
				this.startBtn.disabled = false;
				this.openCamera();
			},
			
			startRecording() {
				this.startBtn.disabled = true;
				this.stopBtn = true;
				this.startRecord();
			},
			
			saveRecording() {
				this.saver();
			},
			
			setRecording() {
				if (this.openBtn.disabled) {
					this.setImage();
				}
			},
			
			stopRecording() {
				// 结束
				var that = this;
				that.stopRecord(function() {
					that.$message({
						type: 'success',
						message: '录制成功!',
						offset: 300
					})
					clearInterval(that.startInterval);
					clearTimeout(that.startTimeOut);
					that.openBtn.disabled = false;
					that.saveBtn.disabled = false;
					that.saver();
					that.$emit("change", false);
				});
			},
			
			// 打开摄像头
			openCamera() {
				var videosContainer = document.getElementById('videos-container');
				var len = videosContainer.childNodes.length;
				for (var i = 0; i < len; i++) {
					videosContainer.removeChild(videosContainer.childNodes[i]);
				}
				var video = document.createElement('video');
			
				var videoWidth = 320;
				var videoHeight = 238;
			
				video.controls = false;
				video.muted = true;
				video.width = videoWidth;
				video.height = videoHeight;
				video.id = 'video0'
				var that = this;
				that.getUserMedia(true, false, function(err, stream) {
					if (err) {
						throw err;
					} else {
						// 通过 MediaRecorder 记录获取到的媒体流
						that.mediaRecorder = new MediaRecorder(stream);
						that.mediaStream = stream;
						var chunks = [],
							startTime = 0;
						video.srcObject = stream;
						video.play();
			
						videosContainer.appendChild(video);
						that.mediaRecorder.ondataavailable = function(e) {
							that.mediaRecorder.blobs.push(e.data);
							chunks.push(e.data);
						};
						that.mediaRecorder.blobs = [];
			
						that.mediaRecorder.onstop = function(e) {
							that.recorderFile = new Blob(chunks, {
								'type': that.mediaRecorder.mimeType
							});
							chunks = [];
							if (null != that.stopRecordCallback) {
								that.stopRecordCallback();
							}
						};
					}
				});
			},
			// 开始录制
			startRecord() {
				var that = this;
				that.startBtn.start = true;
				that.mediaRecorder.start();
				that.percentage = 0;
				that.startInterval = setInterval(() => {
					that.percentage += parseInt(100/10);
				}, 1000)
				that.startTimeOut = setTimeout(function() {
					// 结束
					that.stopRecord(function() {
						that.$message({
							type: 'success',
							message: '录制成功!',
							offset: 300
						})
						clearInterval(that.startInterval);
						that.openBtn.disabled = false;
						that.saveBtn.disabled = false;
						that.saver();
						that.$emit("change", false);
					});
				}, 10000);
			},
			// 保存录制文件
			saver() {
				this.startBtn.start = false;
				// (new Date).toISOString().replace(/:|\./g, '-')
				var file = new File([this.recorderFile], (new Date() * 1000) + '.mp4', {
					type: 'video/mp4'
				});
				this.saveBtn.disabled = true;
				this.stopBtn = false;
				if (file) {
					this.update(file, 2)
				}
				
			},
			//  绘制图片（拍照功能）
			setImage() {
				var thisCancas = document.getElementById('canvasCamera');
				
				var thisContext = thisCancas.getContext('2d');
				
				var thisVideo = document.getElementById('video0');
				// 点击，canvas画图
				thisContext.drawImage(thisVideo, 0, 0, 318, 238)
				// 获取图片base64链接
				var image = thisCancas.toDataURL('image/png')
				this.imgSrc = image;
				let nowTime = new Date() * 1000 + '.png';
				this.imageFiles = this.dataURLtoFile(image, nowTime);
				console.log(this.imageFiles)
				if (this.imageFiles) {
					this.update(this.imageFiles, 1)
				}
				// _
			},
			
			// 停止录制
			stopRecord(callback) {
				this.stopRecordCallback = callback;
				// 终止录制器
				this.mediaRecorder.stop();
				// 关闭媒体流
				this.closeStream(this.mediaStream);
			},
			
			/**
			 * 获取用户媒体设备(处理兼容的问题)
			 * @param videoEnable {boolean} - 是否启用摄像头
			 * @param audioEnable {boolean} - 是否启用麦克风
			 * @param callback {Function} - 处理回调
			 */
			getUserMedia(videoEnable, audioEnable, callback) {
				navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
					navigator.msGetUserMedia || window.getUserMedia;
				var constraints = {
					video: videoEnable,
					audio: audioEnable
				};
				if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
					navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
						callback(false, stream);
					})['catch'](function(err) {
						callback(err);
					});
				} else if (navigator.getUserMedia) {
					navigator.getUserMedia(constraints, function(stream) {
						callback(false, stream);
					}, function(err) {
						callback(err);
					});
				} else {
					callback(new Error('Not support userMedia'));
				}
			},
			/**
			 * 关闭媒体流
			 * @param stream {MediaStream} - 需要关闭的流
			 */
			closeStream(stream) {
				if (typeof stream.stop === 'function') {
					stream.stop();
				} else {
					let trackList = [stream.getAudioTracks(), stream.getVideoTracks()];
						
					for (let i = 0; i < trackList.length; i++) {
						let tracks = trackList[i];
						if (tracks && tracks.length > 0) {
							for (let j = 0; j < tracks.length; j++) {
								let track = tracks[j];
								if (typeof track.stop === 'function') {
									track.stop();
								}
							}
						}
					}
				}
			},
			/* 结束 */
			
			// base64转文件
			dataURLtoFile(dataurl, filename) {
				var arr = dataurl.split(',')
				var mime = arr[0].match(/:(.*?);/)[1]
				var bstr = atob(arr[1])
				var n = bstr.length
				var u8arr = new Uint8Array(n)
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n)
				}
				return new File([u8arr], filename, {
					type: mime
				})
			},
			
			// 编辑图片
			/* init() {
				this.myCropper = new Cropper(this.$refs.image, {
					viewMode: 1,
					dragMode: 'move',
					initialAspectRatio: 1,
					aspectRatio: 1,
					preview: '.before',
					background: true,
					autoCropArea: 0.6,
					zoomOnWheel: true,
				})
			},
			sureSava() {
				this.afterImg = this.myCropper.getCroppedCanvas({
					imageSmoothingQuality: 'high'
				}).toDataURL('image/jpeg')
				console.log(this.afterImg)
			}, */
			
			//	关闭弹窗执行
			close() {
				this.imgSrc = '';
				this.$emit("change", this.filelist)
				clearInterval(this.startInterval);
				clearTimeout(this.startTimeOut);
				this.openBtn.disabled = false;
				this.stopBtn = false;
				this.startBtn.start = false;
				this.startBtn.disabled = true;
			},
			
			/* 上传文件开始 */
			update(file, type) { //上传附件（此时执行的是上传到服务器）
				var that = this;
				let postData = new FormData(); //创建form对象
				postData.append('file', file); //通过append向form对象添加数据
				that.axios.post(that.url + '/api/v1/upload', postData, {
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': that.token
					}
				}).then(function(response) {
					if (response && response.data && response.data.data && response.data.code == 200) {
						that.filelist = {};
						that.filelist = {
							start: false,
							fileimgurl: {
								url: response.data.data.url,
								type: type
							}
						};
						if (that.filelist) {
							that.close()
						}
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			/* 上传文件结束 */
			
		}
	}
</script>

<style lang="less" scoped>
	.Record {
		
		article {
			width: 660px;
			height: 400px;
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			-ms-flex-wrap: wrap;
			flex-wrap: wrap;
			-webkit-box-pack: center;
			-ms-flex-pack: center;
			justify-content: center;
			border: 1px solid white;
			background-color: white;
			
			.experiment {
				width: 320px;
				height: 240px;
				border: 1px solid green;
				margin: 50px auto;
				
				#videos-container {
					width: 320px;
					height: 240px;
				}
				.el-progress {
					// width: 270px;
					// margin-right: 5px;
					// display: inline-block;
				}
				
			}
			
			.experimentbtn {
				width: 400px;
				text-align: center;
				border: none;
				margin-top: 20px;
				
				.el-button {
					width: 100px;
				}
				
			}
			
		}
		
	}
	.hello {
		
		.before{
			width: 100px;
			height: 100px;
			overflow: hidden;
			/* 这个属性可以得到想要的效果 */
		}
		
		.container{
			display: flex;
			
			.img-container{
				height: 400px;
				overflow: hidden;
			}
			
			.afterCropper{
				flex: 1;
				margin-left: 20px;
				border: 1px solid salmon; 
				text-align: center;
				
				img{
					width: 150px;
					margin-top: 30px;
				}
				
			}
			
		}
		
	}
	
</style>
