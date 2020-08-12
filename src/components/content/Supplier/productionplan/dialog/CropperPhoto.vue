<template>
	<div>
		<!-- 批量附件上传  拍照转PDF -->
		<el-dialog :visible.sync="centerDialogVisible" :close-on-click-modal="false" :before-close="close" width="800px">
			<div class="Record">
				<article>
					<section class="experiment">
						<div id="videos-container"></div>
					</section>
					<section class="experiment" v-show="false">
						<canvas id="canvasCamera" width="320" height="240"></canvas>
					</section>
					<section class="imglist" v-show="imgSrc">
						<div class="list" v-for="(item, i) in filesArr" :key="i">
							<i class="el-icon-error" @click="handleClose(item)"></i>
							<img :src="item" alt="">
						</div>
					</section>
					<section class="experimentbtn">
						<!-- <el-button id="openCamera" :disabled="openBtn.disabled" @click="openCameraBtn">打开摄像头</el-button> -->
						<el-button @click="setRecording">拍照</el-button>
						<el-button v-if="filesArr.length" :disabled="viewBtn" @click="closeview" >完成</el-button>
					</section>
				</article>
			</div>
		</el-dialog>
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
				filesArr: [],
				filelist: {
					start: false,
					fileimgurl: {
						url: '',
					}
				},
				
				myCropper: null,
				afterImg: '',
				viewBtn: false,
				
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
		watch: {
			centerDialogVisible() {
				setTimeout(() => {
					this.openCameraBtn()
				}, 100)
			}
		},
		methods: {
			
			/* 开始 */
			openCameraBtn() {
				this.openBtn.disabled = true;
				this.startBtn.disabled = false;
				this.openCamera();
			},
			
			setRecording() {
				this.setImage();
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
				// let nowTime = new Date() * 1000 + '.png';
				// this.imageFiles = this.dataURLtoFile(image, nowTime);
				// console.log(this.imageFiles)
				// if (this.imageFiles) {
				// 	this.filesArr.push(this.imageFiles)
				// 	console.log(this.filesArr)
				// }
				if(image) {
					this.filesArr.push(image)
				}
				// _
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
						console.log();
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
			
			
			//	关闭弹窗执行
			close() {
				this.imgSrc = '';
				this.filesArr = [];
				this.$emit("change", this.filelist)
				clearInterval(this.startInterval);
				clearTimeout(this.startTimeOut);
				this.openBtn.disabled = false;
				this.stopBtn = false;
				this.viewBtn = false;
				this.startBtn.start = false;
				this.startBtn.disabled = true;
				this.filelist.fileimgurl.url = '';
			},
			closeview() {
				if (this.filesArr.length) {
					this.viewBtn = true;
					this.update(this.filesArr)
				}
			},
			// 删除当前拍照的图片
			handleClose(tag) {
				this.filesArr.splice(this.filesArr.indexOf(tag), 1);
			},
			
			/* 上传文件开始 */
			update(file) { //上传附件（此时执行的是上传到服务器）
				var that = this;
				that.axios({
				    method: 'POST',
				    url: that.url + '/api/v1/supplier/uploadPdf',
					data: {
						image: file
					},
				    headers: {
				        "content-type": "application/json",
				        "token": that.token
				    }
				}).then( response => {
				    if (response && response.data.code == 200) {
						that.filelist.fileimgurl.url = response.data.data.url;
						that.close()
				    }
				}).catch( error => {
				    console.log(error)
					this.viewBtn = false;
				});
				
				
			},
			/* 上传文件结束 */
			
		}
	}
</script>

<style lang="less" scoped>
	.Record {
		
		article {
			width: 760px;
			// height: 400px;
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
				margin: 30px auto 20px;
				
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
			
			
			.imglist {
				width: 760px;
				border: none;
				.list {
					position: relative;
					display: inline-block;
					.el-icon-error {
						position: absolute;
						right: 5px;
						top: 5px;
						font-size: 20px;
						&:hover {
							color: orangered;
						}
					}
					> img {
						height: 94px;
					}
				}
				
			}
			
			.experimentbtn {
				width: 760px;
				text-align: center;
				border: none;
				
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
