<!-- Exam.vue -->

<template>

	<view class="exam-container" v-if="examDataLoaded">
		<view class="examTitle">
			{{termTopic}}({{userInfo.position.match(/(负责人|干事|部长)/)[0]==='负责人'||'部长'?'部长':'干事'}}卷)</view>
		<!-- 单选题 -->
		<view class="Question-type" v-if="singleChoiceQuestions.length>0">一、单选题</view>
		<view v-for="(question, index) in singleChoiceQuestions" :key="'singleChoice' + index" class="question">
			<text class="question-text">{{ index + 1 }}. {{ question.text }}</text>
			<radio-group :name="'question' + index" @change="handleSingleChoiceChange" @click="singleChange(index)">
				<label v-for="(option, optionIndex) in question.options" :key="optionIndex" class="option">
					<view class="singleChoice">
						<radio :value="option.label" :checked="question.answer === option.value">{{ option.label }}.
							{{ option.value }}
						</radio>
					</view>

				</label>
			</radio-group>
		</view>

		<!-- 填空题 -->
		<view class="Question-type" v-if="fillInTheBlankQuestions.length>0">二、填空题</view>
		<view v-for="(question, index) in fillInTheBlankQuestions" :key="'fillIn' + index" class="question">
			<text class="question-text">{{ index + 1 }}. {{ question.text }}</text>
			<textarea v-model="question.answer" placeholder="请在此处输入您的答案" class="fill-in-answer"
				maxlength="1000"></textarea>
		</view>

		<!-- 主观题 -->
		<view class="Question-type" v-if="essayQuestions.length>0">三、主观题</view>
		<view v-for="(question, index) in essayQuestions" :key="'essay' + index" class="question">
			<text class="question-text">{{ index + 1 }}. {{ question.text }}</text>
			<textarea v-model="question.answer" placeholder="请在此处输入您的答案" class="essay-answer"
				maxlength="1000"></textarea>
		</view>
		<view class="Question-type" v-if="thinkingQuestions.length>0">四、思维拓展题</view>
		<view v-for="(question, index) in thinkingQuestions" :key="'thinking' + index" class="question">
			<text class="question-text">{{ index + 1 }}. {{ question.text }}</text>
			<textarea v-model="question.answer" placeholder="请在此处输入您的答案" class="essay-answer"
				maxlength="1000"></textarea>
		</view>
		<!-- 提交按钮 -->
		<button @click="referExam" class="submit-button">提交答案</button>
	</view>
	<view class="loading" v-else>
		<view class="loading-center">
			<image src="https://wypty.cn/static/file/material/loading.gif" mode=""></image>
			<view class="text">题目随机匹配中...</view>
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
				examDataLoaded: false,
				singleChoiceQuestions: [],
				fillInTheBlankQuestions: [], // 多选题改为填空题
				essayQuestions: [],
				thinkingQuestions: [],
				testId: '',
				termTopic:'',
				questionValue: ''
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		onShow() {
			this.singleChoiceQuestions = []
			this.fillInTheBlankQuestions = []
			this.essayQuestions = []
			this.loadRandomExam(this.testId)
		},
		onLoad(option) {
			this.testId = option.id
			this.termTopic=option.termTopic
		},
		methods: {
			async loadRandomExam(id) {
				try {
					this.examDataLoaded = false;
					const response = await uni.$http.get('/api/examinationOrg/random-exam', {
						examId: id,
						targetsUser: this.userInfo.position.match(/(负责人|干事|部长)/)[0]
					});

					if (response.errMsg == "request:ok") {
						const {
							singleChoiceQuestions,
							fillInTheBlankQuestions,
							essayQuestions,
							thinkingQuestions
						} = response.data;


						// 添加 answer 属性用于存储用户答案
						singleChoiceQuestions.forEach(question => {
							question.answer = '';
						});
						fillInTheBlankQuestions.forEach(question => {
							question.answer = ''; // 多选题改为填空题，清空数组改为清空字符串
						});
						essayQuestions.forEach(question => {
							question.answer = '';
						});
						thinkingQuestions.forEach(question => {
							question.answer = '';
						});
						this.singleChoiceQuestions = singleChoiceQuestions;
						this.fillInTheBlankQuestions = fillInTheBlankQuestions;
						this.essayQuestions = essayQuestions;
						this.thinkingQuestions = thinkingQuestions;


						setTimeout(() => {
							this.examDataLoaded = true;
						}, 1500)
					}

				} catch (error) {
					console.error('Failed to load random exam data:', error);
				}
			},

			handleSingleChoiceChange(e) {
				this.questionValue = e.detail.value;
			},
			singleChange(questionIndex) {
				this.singleChoiceQuestions[questionIndex].answer = this.questionValue
				
			},

			referExam() {
				uni.showModal({
					content:"温馨提示：您确定要提交试卷嘛？\n 提交后将无法修改试卷!",
					success: (e) => {
						if (e.confirm) {
							this.submitExam()

						}
					}
				});
			},

			async submitExam() {

				try {
					// 构造提交的数据对象，包含用户答案
					const submissionData = {
						singleChoiceQuestions: this.singleChoiceQuestions.map(question => ({
							id: question._id,
							type: 'single-choice',
							text: question.text,
							options: question.options,
							answer: question.answer,
						})),
						fillInTheBlankQuestions: this.fillInTheBlankQuestions.map(question => ({
							id: question._id,
							type: 'fill-in-the-blank', // 多选题改为填空题，修改类型
							text: question.text,
							answer: question.answer,
						})),
						essayQuestions: this.essayQuestions.map(question => ({
							id: question._id,
							type: 'essay',
							text: question.text,
							answer: question.answer,
						})),
						thinkingQuestions: this.thinkingQuestions.map(question => ({
							id: question._id,
							type: 'thinking',
							text: question.text,
							answer: question.answer,
						})),
					};

					// 发送提交请求
					uni.$http.post('/api/examinationOrg/saveUserExam', {
						userId: this.userInfo._id,
						examineId: this.testId,
						termTopic:this.termTopic,
						examData: submissionData
					}).then(res => {
						if (res.statusCode === 400) {
							return uni.showToast({
								icon: "none",
								title: res.data.msg,
								duration: 1800
							})

						} else if (res.statusCode === 500) {
							return uni.showToast({
								icon: "none",
								title: res.data.error,
								duration: 1800
							})
						} else if (res.statusCode === 201) {
							 uni.showToast({
								icon: "none",
								title: res.data.msg,
								duration: 1800
							})
							setTimeout(() => {
								uni.navigateBack();
							}, 500)
						}

					})


				} catch (error) {
					console.error('提交失败:', error);
					// 在实际项目中可能需要处理提交失败的情况，例如显示错误信息
				}
			},
		},
	};
</script>

<style scoped lang="scss">
	.examTitle {
		width: 62%;
		margin: 0 auto;
		text-align: center;
	}

	/* 样式... */
	.exam-container {
		padding: 20px;
	}

	.question {
		margin-bottom: 20px;
	}

	.question-text {
		font-size: 16px;
		font-weight: bold;
	}

	/* 删除多选题样式类 */
	.fill-in-answer {
		width: 100%;
		height: 200px;
		/* 根据实际需要调整高度 */
		margin-top: 5px;
		padding: 5px;
		box-sizing: border-box;
	}

	.essay-answer {
		width: 100%;
		height: 500px;
		margin-top: 5px;
	}

	.submit-button {
		background-color: #4caf50;
		color: white;
		padding: 10px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	.Question-type {
		margin-bottom: 30rpx;
	}

	.singleChoice {
		margin-top: 10rpx;
	}

	radio {
		margin-top: 10rpx;
	}

	.submit-button:hover {
		background-color: #45a049;
	}

	.loading {
		width: 100%;
		height: 100vh;
		position: relative;

	}

	.loading-center {
		position: absolute;
		/* 绝对定位 */
		top: 50%;
		/* 子盒子顶部距离父盒子顶部的距离为父盒子高度的一半 */
		left: 50%;
		/* 子盒子左侧距离父盒子左侧的距离为父盒子宽度的一半 */
		transform: translate(-50%, -75%);

		.text {
			font-size: 50rpx;
			color: #2ecc71;
			text-align: center;
			font-family: 'Helvetica', 'Arial', sans-serif;
			animation: waveAnimation 1.5s infinite;
		}
	}

	@keyframes waveAnimation {

		0%,
		100% {
			transform: translateY(0);
		}

		50% {
			transform: translateY(-10px);
		}
	}
</style>