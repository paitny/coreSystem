<template>
	<view class="container">
		<view class="form">
			姓名：<input v-model="name" placeholder="请输入姓名" />
			学号：<input v-model="studentId" placeholder="请输入学号" />
			
		</view>
		<view class="" style="margin-top:20px ;">
				<button @click="searchGrade" size="default">成绩查询</button>
		</view>
	
		<view v-if="grades !== null" class="result">
			<text> 标题：{{ grades.termTopic }}</text>
			<text>姓名: {{grades.name }}</text>
			<text>学号: {{ grades.num }}</text>
			<text>机构: {{ grades.institution }}</text>
			<text>部门: {{ grades.department }}</text>
			<text>单选题得分: {{ grades.singleChoiceScore }}</text>
			<text>填空题得分: {{ grades.fillScore }}</text>
			<text>主观题得分: {{ grades.essayScore }}</text>
			<text>思维拓展题得分: {{ grades.thinkingScore }}</text>
			<text>总得分: {{ grades.totalScore }}</text>
			<text>排名: {{ grades.rank }}</text>
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
				name: '',
				studentId: '',
				grades: null
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad() {
			this.name = this.userInfo.name
			this.studentId = this.userInfo.num
		},
		onShareAppMessage() { // 分享到微信
			// 更多参数配置，参考文档
			return {
				title: '学干考核成绩查询',
				path: '/subpkg-common/grades/grades'
			}
		},

		onShareTimeline() { // 分享到朋友圈
			return {
				title: '学干考核成绩查询',
				path: '/subpkg-common/grades/grades'
			}
		},
		methods: {
			async searchGrade() {
				if (this.name === '' || this.studentId === '') {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					});
					return;
				}
				try {
					const response = await uni.$http.get('/api/get/grades', {
						name: this.name,
						num: this.studentId
					});
					if (response.statusCode === 200) {
						this.grades = response.data;

					} else {
						uni.showToast({
							title: '查询失败，' + `${response.data.message}`,
							icon: 'none'
						});
					}
				} catch (error) {
					uni.showToast({
						title: '查询出错',
						icon: 'none'
					});
				}
			}
		}
	};
</script>

<style>
	.container {
		padding: 20px;
	}

	.form {
		display: flex;
		flex-direction: column;
	}

	input {
		margin-bottom: 10px;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		margin-top: 10px;
	}

	button {
		padding: 10px;
		background-color: #007aff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:active {
		background-color: #005ecb;
	}

	.result {
		margin-top: 20px;
	}

	.result text {
		display: block;
		margin-bottom: 5px;
	}
</style>