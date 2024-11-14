<template>
	<view class="change-password">
		<input v-model="currentPassword" type="text" placeholder="当前密码" />
		<input v-model="newPassword" type="text" placeholder="新密码必须包含字母数字符号" />
		<input v-model="confirmNewPassword" type="text" placeholder="确认新密码" />
		<button @click="toLogout" :disabled="!isFormValid">确认修改</button>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import changePasswordVue from './change-password.vue';
	export default {
		data() {
			return {
				currentPassword: '',
				newPassword: '',
				confirmNewPassword: '',
				isPasswordValid: false,
				isFormValid: false,
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		watch: {
			newPassword: function() {
				this.validatePassword();
				this.validateForm();
			},
			confirmNewPassword: function() {
				this.validateForm();
			},
		},
		methods: {
			...mapMutations(['loginOut']),
			validatePassword() {
				// 密码包含至少一个英文字符、一个数字和一个符号
				const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

				this.isPasswordValid = passwordRegex.test(this.newPassword);
			},
			validateForm() {
				this.isFormValid =
					this.isPasswordValid && this.currentPassword !== '' && this.newPassword !== '' && this
					.confirmNewPassword !== '' && this.newPassword.trim() === this.confirmNewPassword.trim();
			},
			removeStore() {
				uni.removeStorage({
					key: 'userinfo', // 要清除的数据的键名
					success: () => {
						console.log('数据清除成功');
					},
					fail: (err) => {
						console.log('数据清除失败', err);
					}
				});
				uni.removeStorage({
					key: 'token', // 要清除的数据的键名
					success: () => {
						console.log('数据清除成功');
					},
					fail: (err) => {
						console.log('数据清除失败', err);
					}
				});
			},
			toLogout() {
				uni.showModal({
					content: '确定要修改密码吗?',
					success: (e) => {
						if (e.confirm) {
							this.changePassword()
							setTimeout(() => {
								// 密码修改成功后的逻辑，比如跳转到登录页
								this.loginOut();
								this.removeStore()
								uni.switchTab({
									url: '/pages/me/me',
								});
							}, 200)
						}
					}
				});
			},

			async changePassword() {
				
				if (!this.isFormValid) {
					// 输入验证失败，可以给用户一个提示
					uni.showToast({
						title: '请填写有效的密码信息',
						icon: 'none',
					});
					return;
				}

				// 发送请求到后端修改密码接口
				uni.$http.post('/api/modify/change-password', {
					userId: this.userInfo._id,
					currentPassword: this.currentPassword,
					newPassword: this.newPassword
				}).then((res) => {
					// 处理响应
					if (res.statusCode === 200) {
						uni.showToast({
							title: '密码修改成功,请重新登录',
							icon: 'none',
							duration: 1500
						});
						
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none',
						});
					}
				})


			},
		},
	};
</script>

<style scoped>
	.change-password {
		padding: 20px;
	}

	input {
		margin-bottom: 10px;
		padding: 10px;
		width: 100%;
		box-sizing: border-box;
		height: 100rpx;
	}

	button {
		padding: 10px;
		background-color: #007bff;
		color: #fff;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}
</style>