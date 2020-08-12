<template>
	<!--  -->
	<div class="Login">
		<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
			<div class="demonstration">登　录</div>
			<el-form-item prop="loginNum">
				<el-input type="text" v-model.trim="ruleForm.loginNum" placeholder="账　号" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item prop="checkPass">
				<el-input type="password" v-model.trim="ruleForm.checkPass" placeholder="密　码" autocomplete="off"
				 @keyup.enter.native="submitForm('ruleForm')"></el-input>
			</el-form-item>
			<el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
			<div class="down">
				<el-divider>扫码登录</el-divider>
				<el-button type="text" size="mini" style="margin-top: 10px;" @click="scancode(2)">扫码登录</el-button>
			</div>

		</el-form>
		<el-dialog :visible.sync="DialogVisible" width="500px" :modal="false" :show-close="false" @close="scancode('')">
			<div class="card">
				<div slot="header" class="clearfix cardHeader">
					<span class="title">扫码登录</span>
				</div>
				<div class="main">
					<div id="qrcode" ref="qrcode" :class="{'blur-qrcode': hideQrCode}"></div>
					<div class="mask" :class="{'mask-bg': hideQrCode}">
						<div v-if="hideQrCode">
							<p>二维码已失效,请刷新</p>
							<el-button type="primary" @click="getQrCode">刷新二维码</el-button>
						</div>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import QRCode from 'qrcodejs2' //组件内引入，生成二维码
	import Qs from 'qs'
	import { mapGetters } from "vuex";
	export default {
		name: 'Login',
		components: {
			QRCode,
		},
		computed: {
			...mapGetters({
				url: "geturl",
				key: "getKey"
			})
		},
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
				DialogVisible: false,
				hideQrCode: false, //如果二维码更新后,隐藏当前二维码,如果手动操作刷新时需要(看需求)
				link: '', //二维码链接
				qrcode: null, //二位码实例
				keyTime: 600,
				auth_timetimer: '',
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
				},
			};
		},

		methods: {
			scancode(tab) {
				if (tab == 2) {
					this.DialogVisible = true
					this.getQrCode();
				} else {
					clearInterval(this.auth_timetimer)
				}
			},
			//生成二维码 
			makeQrcode() {
				this.qrcode = new QRCode('qrcode', {
					width: 300,
					height: 300, // 高度
					text: this.link, // 二维码内容
					// render: 'table' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
					// background: '#ff0000',   // 背景色
					// foreground: '#0000ff'    // 前景色
				})
			},
			// 清除二维码
			clearQrCode() {
				this.$refs.qrcode.innerHTML = '';
			},
			//获取二维码URL   每次获取二维码之前先清除
			getQrCode() {
				let that = this;
				let url = `${this.url}/admin/v1/weChat/qeCode`
				this.axios.get(url, {
					params: {
						key: that.key
					},
				}).then(res => {
					if (res.data.code == 200) {
						let key = res.data.data.url.split('?')[1].split('=')[1]; //key
						that.$store.commit('updataKey', key);
						that.$nextTick(function() { //生成二维码必须使用$nextTick
							that.clearQrCode();
							that.makeQrcode();
							that.hideQrCode = false;
						})
						that.link = res.data.data.url; //二维码链接
						that.keyTime = 600;
						that.auth_timetimer = setInterval(() => {
							that.keyTime--;
							if (that.keyTime <= 0) {
								that.hideQrCode = true;
								clearInterval(that.auth_timetimer)
							} else {
								that.getToken(); //循环获取key，直到拿到token
							}
						}, 1000);
					}
				}).catch(err => {
					console.log(err);
					this.$message({
						type: 'error',
						message: '获取二维码失败稍后再试',
						offset: 300
					})
				})
			},
			//获取用户token(非微信token)及身份权限
			getToken() {
				let that = this;
				let url = `${that.url}/admin/v1/weChat/get-token`;
				let data = Qs.stringify({
					key: that.key
				})
				this.axios.post(url, data).then(res => {
					if (res && res.data && res.data.code == 200 && res.data.data.token && res.data.data.user) {
						that.$store.commit('updatetoken', res.data.data);
						that.functionset('ruleFormStat', res.data.data)
						switch (res.data.data.user) {
							case 'product': //暂存区管理
								that.$router.push({
									path: '/stockpend'
								});
								that.$message({
									message: '登录成功',
									type: 'success',
									offset: 400
								});
								clearInterval(that.auth_timetimer)
								break;
							case 'moudle': //装配区管理
								that.$router.push({
									path: '/createmodular'
								});
								that.$message({
									message: '登录成功',
									type: 'success',
									offset: 400
								});
								clearInterval(that.auth_timetimer)
								break;
							case 'storehouse': //仓储区管理
								// that.$router.push({path: '/private/createmodular'});
								// that.$message({ message: '登录成功', type: 'success', offset: 400 });
								break;
							case 'supplier': //新增供应商权限***
								that.$router.push({
									path: '/supplierdetail'
								});
								that.$message({
									message: '登录成功',
									type: 'success',
									offset: 400
								});
								clearInterval(that.auth_timetimer)
								break;
							default:
								that.$message({
									message: '权限不足，请联系管理员',
									type: 'warning',
									offset: 400
								})
								clearInterval(that.auth_timetimer)
								break;
						}
					}
				}).catch(err => {})
			},

			/* 存储判断登录超时的数对象 //登录超时判断 */
			functionset(key, value) {
				var curTime = new Date().getTime();
				localStorage.setItem(key, JSON.stringify({
					data: value,
					time: curTime
				}));
			},
			/* 结束 */

			submitForm(formName) {
				/*
					15469823145		暂存端
					17765982130		装配端
					13109887898		供应商
				*/

				var that = this;
				const url = that.url;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let mobile = that.ruleForm.loginNum;
						let password = that.ruleForm.checkPass
						that.axios.get(url + '/admin/v1/login', {
							params: {
								mobile: mobile,
								password: password,
								type: 2
							},
							headers: {
								'content-type': 'application/x-www-form-urlencoded'
							}
						}).then(function(response) {
							if (response.status === 200) {
								const data = response.data.data;
								var tokenUser = {
									token: data.token,
									user: data.user,
									name: data.name
								};
								that.$store.commit('updatetoken', tokenUser);
								switch (data.user) {
									//产品、模型、流
									case 'product,moudle,flow,storehouse': //智能车间管理
										that.functionset('ruleFormStat', tokenUser)
										that.$router.push({
											path: '/page/list'
										});
										that.$message({
											message: '登录成功',
											type: 'success',
											offset: 400
										});
										break;
									case 'product': //暂存区管理
										that.functionset('ruleFormStat', tokenUser)
										that.$router.push({
											path: '/stockpend'
										});
										localStorage.setItem("index", "1-4");
										that.$message({
											message: '登录成功',
											type: 'success',
											offset: 400
										});
										break;
									case 'moudle': //装配区管理
										that.functionset('ruleFormStat', tokenUser)
										that.$router.push({
											path: '/createmodular'
										});
										that.$message({
											message: '登录成功',
											type: 'success',
											offset: 400
										});
										break;
									case 'storehouse': //仓储区管理
										// that.functionset('ruleFormStat', tokenUser)
										// that.$router.push({path: '/createmodular'});
										// that.$message({ message: '登录成功', type: 'success', offset: 400 });
										break;
									case 'supplier': //新增供应商权限***
										that.functionset('ruleFormStat', tokenUser)
										that.$router.push({
											path: '/supplierdetail'
										});
										that.$message({
											message: '登录成功',
											type: 'success',
											offset: 400
										});
										break;
									default:
										that.$message({
											message: '权限不足，请联系管理员',
											type: 'warning',
											offset: 400
										})
										break;
								}
							}
						}).catch(function(error) {
							that.$message.error({
								message: '请输入有效的账号和密码',
								offset: 400
							})
						});
					} else {
						that.$message({
							message: '账号和密码不能为空',
							type: 'warning',
							offset: 400
						})
						return false;
					}
				});
			},
		}
	}
</script>

<style scoped>
	.Login {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		overflow: hidden;
		background-color: #EEEEEE;
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
		font-size: 25px;
		text-align: center;
		text-align: -moz-center;
		text-align: -webkit-center;
		margin: 15px auto;
		margin-bottom: 25px;
	}

	.Login .demo-ruleForm {
		width: 500px;
		display: block;
		margin: 20vh auto 0;
		background-color: #FFFFFF;
		padding: 15px 80px 40px;
		border-radius: 10px;
		overflow: hidden;
	}
	.demo-ruleForm .down {
		margin-top: 2.25rem;
	}

	.el-button {
		width: 100%;
		display: block;
		margin: 0 auto;
	}

	/* *************************************************************** */
	/* .container {
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		user-select: none;
		background: #00d2ff; */
		/* fallback for old browsers */
		/* background: -webkit-linear-gradient(30deg, #928DAB, #00d2ff); */
		/* Chrome 10-25, Safari 5.1-6 */
		/* background: linear-gradient(30deg, #928DAB, #00d2ff); */
		/* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

	/* } */

	.content {
		display: flex;
		justify-content: center;
		min-width: 500px;
	}

	.card {
		width: 450px;
		margin: 0 auto;
		text-align: center;
	}

	.title {
		font-size: 25px;
		color: #303133;
	}


	.main {
		position: relative;
		height: 400px;
		padding: 50px;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		justify-content: center;
	}

	#qrcode {
		width: 300px;
		height: 300px;
		transition: all 1s ease;
	}

	.mask {
		position: absolute;
		width: 300px;
		height: 300px;
		text-align: center;
		color: white;
		font-size: 25px;
		top: 50px;
		left: 50%;
		transform: translateX(-50%);
		transition: all 1s ease;
	}

	.mask div {
		margin-top: 100px;
	}

	.mask div .el-button {
		width: auto;
		margin-top: 20px;
	}

	.blur-qrcode {
		filter: blur(2px);
	}

	.mask-bg {
		background: rgba(0, 0, 0, .3);
	}
</style>
