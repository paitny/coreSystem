<template>
	<view class="flex-col space-y-40 page-login">
		<view class="flex-col space-y-11 group">

			<!-- 上方的图片 -->
			<view class="flex-row items-start group_2">
				<view class="flex-col items-center group_3 vertical-center">
					<!-- 星星 -->
					<image class="image_3_star" src="https://wypty.cn/static/file/material/rabbit.png" />
				</view>
			</view>
		</view>
		<!-- 登录框 -->
		<view class="flex-col space-y-21 group">
			<view class="text" v-if="type==2">登录</view>
			<view class="text" v-if="type==1">注册</view>
			<view class="flex-col space-y-6 group">
				<view class="flex-col group_4">
					<view class="flex-col items-center group_5">
						<view class="flex-col section_2">

							<!-- 账号 -->
							<view class="flex-row space-x-21 user_name">
								<image class="image_5" src="https://wypty.cn/static/file/material/user.png" />
								<input v-model="loginForm.user" class="input font_1 text_2" type="text"
									:placeholder="placeholderUser" maxlength="30" @input="clearInput" />
								<uni-icons type="closeempty" color="#808080" size="20" v-if="showClearIcon"
									@click="clearIcon"></uni-icons>
								<view class="" v-if="showBox"></view>
							</view>


							<image class="image_6" src="https://wypty.cn/static/file/material/line.png" />

							<!-- 密码 -->
							<view class="flex-row space-x-20 pass_word">
								<image class="image_5" src="https://wypty.cn/static/file/material/pass.png" />
								<input v-model="loginForm.pass" class="font_1 text_3 input"
									:placeholder="placeholderPass" maxlength="20" :password="showPassword" />
								<uni-icons type="eye-filled" color="#808080" size="25"
									@click="changePassword"></uni-icons>
							</view>
						</view>
					</view>

					<!-- 登录操作 -->
					<view class="operation flex-row">
						<view class="forget_password vertical-center flex-row" v-if="type==2" @click="setLoginType(1)">
							<text class="text_5">去注册吧</text>
						</view>
						<view class="forget_password vertical-center flex-row" v-if="type==1" @click="setLoginType(2)">
							<text class="text_5">密码登录</text>
						</view>
						<view class="flex-col vertical-center login_btn">
							<view class="text-wrapper flex-col vertical-center" @click="Login()" v-if="type==2">
								<text class="font_1 text_4" :disabled="!isChecked">登录</text>
							</view>
							<view class="text-wrapper flex-col vertical-center" @click="reg()" v-if="type==1">
								<text class="font_1 text_4" :disabled="!isChecked">注册</text>
							</view>
						</view>


					</view>

					<!-- 用户协议啥的 -->
					<view class="flex-row vertical-center equal-division">
						<checkbox-group @change="handleChange">
							<label style="display: flex; align-items: center;">
								<checkbox style="transform: scale(0.7)" :value="false" class="more">
								</checkbox>


							</label>
						</checkbox-group>
						<view class="xieyi text-center">
							<text class="text-grey1">我已阅读并同意</text>
							<text @click="handleUserAgrement" class="text-blue">《用户协议》</text>和
							<text @click="handlePrivacy" class="text-blue">《隐私协议》</text>
						</view>
					</view>
					<image class="image_8"
						src="https://wypty.cn/static/file/material/codefun.png" />
				</view>
				<view class="flex-col items-end group_8">
					<image class="image_10"
						src="https://wypty.cn/static/file/material/bottom.png" />
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				loginForm: {
					user: '', //手机号码
					pass: '', //密码
					province: ''
				},
				placeholderUser: "请输入学号",
				placeholderPass: "初始密码为学号后六位",
				showPassword: true, //是否显示密码
				showClearIcon: false, //是否显示清除按钮
				showBox: true,
				type: 2, //登录的状态 - - - 1是注册用户、2是密码登录
				isChecked: false, // 勾选按钮状态
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad(options) {
			this.type = options.type
			this.getProvince()
		},
		methods: {
			handleChange(e) {
				if (e.detail.value.length > 0) {
					this.isChecked = true
				} else {
					this.isChecked = false
				}

			},
			handleUserAgrement() {
				wx.downloadFile({
					url: 'https://wypty.cn/static/file/userAgreement/userAgree.pdf ', // 自己换个其他的地址（"https://www.xxxxx.com/file/用户协议.pdf"）
					success: function(res) {

						if (res.statusCode != 200) {
							return false
						}
						var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
						wx.openDocument({
							filePath: Path,
							fileType: 'pdf',
							showMenu: true,
							success: function(res) {
								console.log('打开成功');
								// util.hideLoading()
							}
						})
					},
					fail: function(err) {
						console.log(err, "wx.downloadFile fail err");
						// util.hideLoadingWithErrorTips()
					}
				})
			},
			handlePrivacy() {
				wx.downloadFile({
					url: 'https://wypty.cn/static/file/userAgreement/privacy.pdf ', // 自己换个其他的地址（"https://www.xxxxx.com/file/用户协议.pdf"）
					success: function(res) {

						if (res.statusCode != 200) {
							return false
						}
						var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
						wx.openDocument({
							filePath: Path,
							fileType: 'pdf',
							showMenu: true,
							success: function(res) {
								console.log('打开成功');
								// util.hideLoading()
							}
						})
					},
					fail: function(err) {
						console.log(err, "wx.downloadFile fail err");
						// util.hideLoadingWithErrorTips()
					}
				})
			},
			// 切换登录的方式
			setLoginType(type) {
				this.type = type
				if(type===1){
				this.placeholderUser= "请输入学号或手机号"
				this.placeholderPass= "必须包含数字英文符号"
				}else{
					this.placeholderUser= "请输入学号"
					this.placeholderPass= "初始密码为学号后六位"
				}
			},
			// 判断是否显示清除按钮
			clearInput: function(event) {
				this.loginForm.user = event.detail.value;
				if (event.detail.value.length > 0) {
					this.showClearIcon = true;
					this.showBox = false
				} else {
					this.showClearIcon = false;
					this.showBox = true
				}
			},
			// 清除内容/隐藏按钮
			clearIcon: function() {
				this.loginForm.user = '';
				this.showClearIcon = false;
				this.showBox = true
			},
			// 显示隐藏密码
			changePassword() {
				this.showPassword = !this.showPassword;
			},
			getProvince(ip) {
				uni.$http.get("/api/get/province", {
					ip: ip
				}).then(res => {
					this.province = res.data.data
				})
			},
			// 密码登录
			async Login() {

				if (this.isChecked) {
					let that = this.loginForm
					//当手机号为空或者手机号不正确时
					if (!that.user) {
						uni.showToast({
							title: '请输入正确的用户名',
							icon: 'none'
						})
						return false
					}
					// 当使用密码登录并且未输入密码时
					if (that.type == 2 && !that.pass) {
						uni.showToast({
							title: '请输入密码',
							icon: 'none'
						})
						return false
					}
					// 当使用验证码登录并且未输入验证码时

					if (that.type == 1 && !that.testValue) {
						uni.showToast({
							title: '请输入验证码',
							icon: 'none'
						})
						return false

					}
					const {
						data
					} = await uni.$http.post('/api/login/min', this.loginForm)
					if (data.code) {
						return uni.showLoading({
							title: data.msg
						})

					}
					uni.showLoading({
						title: data.msg,
						icon: 'exception',
						duration: 150
					})
					uni.setStorage({
						key: 'userInfo', // 设置存储数据的键名
						data: data.data.doc, // 设置要存储的数据
						success: () => {

							console.log('数据保存成功');
						},
						fail: (err) => {
							console.log('数据保存失败', err);
						}
					});
					uni.setStorage({
						key: 'token', // 设置存储数据的键名
						data: data.data.token, // 设置要存储的数据
						success: () => {
							console.log('数据保存成功');
						},
						fail: (err) => {
							console.log('数据保存失败', err);
						}
					});
					this.loginSuccess(data.data.doc)
					// 获取当前页面栈
					var pages = getCurrentPages();
					console.log(pages);
					// 获取上一个页面的实例对象
					var prevPage = pages[pages.length - 2].route;
					console.log(prevPage);
					// 判断上一个页面是否为tabbar页面
					if (prevPage === 'pages/index/index') {
						uni.navigateBack({
							url:'pages/index/index',
							success() {
								let page = getCurrentPages().pop(); //跳转页面成功之后
								if (page == undefined || page == null) return;
								page.onLoad(); //如果页面存在，则重新刷新页面
								uni.showToast({
									duration: 1000,
									title: "登录成功",
									icon: 'success'
								})

							}
						});
					}else if(prevPage === 'pages/leave/leave' ){
						uni.navigateBack({
							url:'pages/leave/leave',
							success() {
								let page = getCurrentPages().pop(); //跳转页面成功之后
								if (page == undefined || page == null) return;
								page.onLoad(); //如果页面存在，则重新刷新页面
								uni.showToast({
									duration: 1000,
									title: "登录成功",
									icon: 'success'
								})
						
							}
						});
					}else if( prevPage === 'pages/Schedule/Schedule'){
						uni.navigateBack({
							url:'pages/Schedule/Schedule',
							success() {
								let page = getCurrentPages().pop(); //跳转页面成功之后
								if (page == undefined || page == null) return;
								page.onLoad(); //如果页面存在，则重新刷新页面
								uni.showToast({
									duration: 1000,
									title: "登录成功",
									icon: 'success'
								})
						
							}
						});
					}else if(prevPage === 'pagesMe/me/me'){
						uni.navigateBack({
							url:'pagesMe/me/me',
							success() {
								let page = getCurrentPages().pop(); //跳转页面成功之后
								if (page == undefined || page == null) return;
								page.onLoad(); //如果页面存在，则重新刷新页面
								uni.showToast({
									duration: 1000,
									title: "登录成功",
									icon: 'success'
								})
						
							}
						});
					}else if(prevPage==='pagesHome/activity/volunteer') {
						uni.navigateBack({
							url:'pagesHome/activity/volunteer',
							success() {
								let page = getCurrentPages().pop(); //跳转页面成功之后
								if (page == undefined || page == null) return;
								page.onLoad(); //如果页面存在，则重新刷新页面
								uni.showToast({
									duration: 1000,
									title: "登录成功",
									icon: 'success'
								})

							}
						});
					}else if(prevPage==='pagesHome/application/active') {
						uni.navigateBack({
							url:'pagesHome/application/active',
							success() {
								let page = getCurrentPages().pop(); //跳转页面成功之后
								if (page == undefined || page == null) return;
								page.onLoad(); //如果页面存在，则重新刷新页面
								uni.showToast({
									duration: 1000,
									title: "登录成功",
									icon: 'success'
								})

							}
						});
					}else{
						uni.navigateBack({
							url:'pagesMe/me/me',
							success() {
								let page = getCurrentPages().pop(); //跳转页面成功之后
								if (page == undefined || page == null) return;
								page.onLoad(); //如果页面存在，则重新刷新页面
								uni.showToast({
									duration: 1000,
									title: "登录成功",
									icon: 'success'
								})
						
							}
						});
					}


				} else {
					// 提示用户先勾选按钮
					uni.showToast({
						title: '请先勾选按钮',
						icon: 'none',
					});
				}


			},

			...mapMutations(['loginSuccess']),

			async reg() {

				if (this.isChecked) {
					const {
						data
					} = await uni.$http.post('/api/reg', this.loginForm)
					if (data.code) {
						return uni.showLoading({
							title: data.msg,
							icon: 'exception',
							duration: 1800
						})

					}
					uni.showLoading({
						title: data.msg,
						icon: 'exception',
						duration: 1800
					})
					this.Login()
					this.loginSuccess(data.data)

				} else {
					// 提示用户先勾选按钮
					uni.showToast({
						title: '请先勾选按钮',
						icon: 'none',
					});
				}

			}


		}
	}
</script>

<style lang="scss" scoped>
	.normal-login-container {
		width: 100%;


		.login-form-content {
			text-align: center;
			margin: 20px auto;
			margin-top: 15%;
			width: 80%;

			.input-item {
				margin: 20px auto;
				background-color: #f5f6f7;
				height: 45px;
				border-radius: 20px;

				.icon {
					font-size: 38rpx;
					margin-left: 10px;
					color: #999;
				}

				.input {
					width: 100%;
					font-size: 14px;
					line-height: 20px;
					text-align: left;
					padding-left: 15px;
				}
			}
		}

		.easyinput {
			width: 100%;
		}
	}

	.login-code-img {
		height: 45px;
	}

	.space-y-40 {

		&>view:not(:first-child),
		&>text:not(:first-child),
		&>image:not(:first-child) {
			margin-top: 80rpx;
		}

		.space-y-11 {

			&>view:not(:first-child),
			&>text:not(:first-child),
			&>image:not(:first-child) {
				// margin-top: 22rpx;
			}

			.group_2 {
				display: flex;
				align-self: flex-end;
				overflow-x: hidden;
				width: 100%;

				.group_3 {
					margin: 0 auto;
					padding-top: 100rpx;
					flex-shrink: 0;
					position: relative;

					.image_4 {
						opacity: 0.2;
						filter: blur(44rpx);
						width: 244rpx;
						height: 86rpx;
					}


				}

				.image {
					margin-left: -484rpx;
					flex-shrink: 0;
					width: 128rpx;
					height: 128rpx;
				}

				.image_2_compass {
					margin-left: 368rpx;
					margin-top: 8rpx;
					flex-shrink: 0;
					width: 206rpx;
					height: 206rpx;
				}
			}
		}

		.group {
			overflow-x: hidden;
		}

		.space-y-21 {

			&>view:not(:first-child),
			&>text:not(:first-child),
			&>image:not(:first-child) {
				// margin-top: 22rpx;
			}

			.text {
				text-align: center;
				align-self: center;
				color: #191c32;
				font-size: 64rpx;
				font-family: HarmonyOSSansSC;
				line-height: 58rpx;
			}

			.space-y-6 {

				&>view:not(:first-child),
				&>text:not(:first-child),
				&>image:not(:first-child) {
					// margin-top: 12rpx;
				}

				.group_4 {
					overflow-x: hidden;
					position: relative;

					.group_5 {
						padding-top: 30rpx;
						// overflow-x: hidden;
						// position: absolute;
						width: 100%;
						// background-color: #9a9dd8;
						// left: 0;
						// right: 50rpx;
						// top: 0;

						.section_2 {
							padding-left: 30rpx;
							padding-right: 28rpx;
							background-image: url('https://wypty.cn/static/file/material/logonButtonWrite.png');
							background-position: 0% 0%;
							background-size: 100% 100%;
							background-repeat: no-repeat;
							// position: absolute;
							// right: 0;
							// top: 0;

							.space-x-21 {

								&>view:not(:first-child),
								&>text:not(:first-child),
								&>image:not(:first-child) {
									margin-left: 42rpx;
								}

								.text_2 {
									align-self: center;
									line-height: 30rpx;
									margin-left: 50rpx;
								}
							}

							.user_name {
								display: flex;
								align-items: center;
								padding: 36rpx 12rpx 30rpx;
								justify-content: space-around;
							}

							.image_6 {
								width: 592rpx;
								height: 2rpx;
							}

							.space-x-20 {

								&>view:not(:first-child),
								&>text:not(:first-child),
								&>image:not(:first-child) {
									margin-left: 40rpx;
								}

								.text_3 {
									align-self: center;
									margin-left: 50rpx;
								}
							}

							.pass_word {
								display: flex;
								padding: 32rpx 12rpx 34rpx;
								align-items: center;
								justify-content: space-around;
							}

							.image_5 {
								width: 64rpx;
								height: 64rpx;
							}
						}
					}

					.operation {
						width: 100%;
						height: 150rpx;
						display: flex;
						justify-content: space-around;
						align-items: center;
						margin-top: 50rpx;

						.forget_password {

							.text_5 {
								color: #9a9dd8;
								font-size: 28rpx;
								font-family: HarmonyOSSansSC;
								line-height: 26rpx;
								transform: translateY(-50%);
							}
						}

						.login_btn {


							.text-wrapper {
								text-align: center;
								line-height: 100rpx;
								filter: drop-shadow(0px 40rpx 30rpx #191c321a);
								background-image: url('https://wypty.cn/static/file/material/logonButtonBlack.png');
								background-size: 100% 100%;
								background-repeat: no-repeat;
								width: 290rpx;
								height: 100rpx;
								// position: absolute;

								.text_4 {
									color: #ffffff;
								}
							}
						}

					}

					.font_1 {
						font-size: 32rpx;
						font-family: HarmonyOSSansSC;
						line-height: 29rpx;
						color: #9395a4;
					}

					.equal-division {
						display: flex;
						align-items: center;
						text-align: center;
						justify-content: center;
						margin-top: 100rpx;
						width: 100%;

						.text-blue {
							color: #007AFF;
						}

						.xieyi {
							color: #333;
							font-size: 25rpx;

						}

						.equal-division-item {
							padding: 30rpx 0;
							filter: drop-shadow(0px 40rpx 60rpx #373e7d0d);
							background-image: url('https://wypty.cn/static/file/material/circleWhrite.png');
							background-position: 0% 0%;
							background-size: 100% 100%;
							background-repeat: no-repeat;
							width: 108rpx;
							height: 108rpx;

							.image_9 {
								width: 46rpx;
								height: 46rpx;
							}
						}
					}

					.image_8 {
						filter: blur(104rpx);
						width: 290rpx;
						height: 290rpx;
						position: absolute;
						right: -222rpx;
						bottom: 6rpx;
					}
				}

				.group_8 {
					position: relative;

					.image_10 {
						filter: blur(164rpx);
						width: 241rpx;
						height: 69rpx;
					}

				}
			}
		}
	}

	.page-login {
		background-color: #ffffff;
		overflow: hidden;
		background-image: url('https://wypty.cn/static/file/material/loginBg.png');
		background-position: 100% 0%;
		background-size: 117.5% 100%;
		background-repeat: no-repeat;
		width: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		height: 100%;
	}
</style>