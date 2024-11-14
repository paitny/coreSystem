<template>
	<view class="container">
		<view v-for="(item, index) in list" :key="index" class="info-block">
			<image class="avatar" :src="`${baseURL}${item.photo}`"></image>
			<view class="info-content">
				<view class="info-label">姓名：{{ item.name }}</view>
				<view class="info-label">性别：{{ item.sex }}</view>
				<view class="info-label">职位：{{ item.institution}}&{{ item.position }}</view>
				<view class="info-label">年级：{{ item.grade }}</view>
				<view class="info-label">班级：{{ item.class }}</view>
				<view class="info-label" @click="goMakePhone(item.phone,item.position,item.name)">手机号：{{ item.phone }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				list: [],
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad() {

			this.baseURL = uni.baseURL
			uni.$http.get("/api/get/query", {
				due: this.userInfo.due,
				institution: this.userInfo.institution,
				position: this.userInfo.position
			}).then((res) => {
				this.list =this.customSort(res.data)
				
			});

			setTimeout(() => {
				this.loading = false
			}, 1000)
		},
		methods: {
			
			    customSort(data) {
			            /**
			             * 定义职位排序的优先级顺序
			             */
			            const roleOrder = {
			                "副书记": 1,
			                "学生办公室主任": 2,
			                "主席": 3,
			                "副主席": 4,
			                "部长": 5,
			                "副部长": 6,
			                "队长": 7,
			                "副队长": 8,
			                "干事": 9
			            };
			            const regex = /(\S+)/; // 匹配非空白字符
			
			            return data.sort((a, b) => {
			                const matchA = a.position.match(regex);
			                const matchB = b.position.match(regex);
			
			                // 获取职位名称
			                const roleA = matchA ? matchA[0] : null;
			                const roleB = matchB ? matchB[0] : null;
			
			                // 确定排序值
			                const orderA = roleA && roleOrder[roleA] !== undefined ? roleOrder[roleA] : Infinity;
			                const orderB = roleB && roleOrder[roleB] !== undefined ? roleOrder[roleB] : Infinity;
			
			                if (orderA !== Infinity && orderB !== Infinity) {
			                    return orderA - orderB;
			                } else {
			                    // 如果职位在排序规则中未找到，按字符串进行比较
			                    return a.position.localeCompare(b.position);
			                }
			            });
			        }
,
			
			goMakePhone(phone, position, name) {
				uni.showModal({
					content: '您确定要给' + position + name + '打电话嘛！',
					success: (e) => {
						if (e.confirm) {
							this.makePhone(phone)
						}
					}
				});
			},
			makePhone(phone) {
				// 验证手机号的正则表达式
				const phoneRegex = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;

				// 将传入的phone参数转换为字符串
				const phoneNumber = String(phone);

				// 使用正则表达式进行验证
				if (phoneRegex.test(phoneNumber)) {
					// 如果手机号合法，调用uni.makePhoneCall
					uni.makePhoneCall({
						phoneNumber: phoneNumber
					});
				} else {
					// 如果手机号不合法，可以进行相应的处理，例如打印错误信息
					return uni.showToast({
						icon: "none",
						title: "该手机号不正确，无法拨打",
						duration: 1500
					})
				}



			},
		}
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
	}

	.info-block {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 96%;
		margin: 0 auto;
		color: #282c35;
		font-weight: 100;
		font-size: 26rpx;
		margin-bottom: 10px;
		border-radius: 15rpx;
		background-color: #fff;
		padding: 30rpx 0;
	}

	.avatar {
		width: 80px;
		height: 80px;
		border-radius: 15rpx;
		margin-right: 10px;
	}

	.info-content {
		flex: 1;
	}

	.info-label {
		font-weight: bold;
	}

	.info-value {
		margin-top: 5px;
	}
</style>