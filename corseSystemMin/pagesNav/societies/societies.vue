<template>
	<view class="content">

		<!-- 聊天记录 -->
		<scroll-view class="chat" scroll-y="true" scroll-with-animation="true" :scroll-into-view="scrollToView">
			<view class="chat-main" :style="{ paddingBottom: inputh + 'px' }">
				<view class="chat-ls" v-for="(item, index) in msg" :key="index">
					<!-- 显示时间 -->
					<view class="chat-time" v-if="item.isTime">{{ changeTime(item.time) }}</view>
					<!-- AI 左侧消息 -->
					<view class="msg-m msg-left" v-if="item.id === 'ai'">
						<image :src="aiAvatar" class="user-img"></image>
						<view class="message">
							<view class="msg-text">{{ item.message }}</view>
						</view>
					</view>
					<!-- 用户右侧消息 -->
					<view class="msg-m msg-right" v-if="item.id === 'b'">
						<image :src="userPhoto" class="user-img"></image>
						<view class="message">
							<view class="msg-text">{{ item.message }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="padbt"></view>
		</scroll-view>

		<!-- 常见问题面板 -->
		<view class="faq-panel">
		    <view class="faq-title">常见问题</view>
		    <view class="faq-list">
		        <view v-for="(question, index) in faqList" :key="index" class="faq-item" @tap="handleFaqClick(question)">
		            {{ question }}
		        </view>
		    </view>
		</view>
		<!-- 提交信息 -->
		<submit @submit="submitChat" @hight="getSubHeight"></submit>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex";
	import myfun from "../commons/js/myfun.js";
	import submit from "../../components/submit/submit.vue";

	export default {
		data() {
			return {
				baseURL: "",
				aiAvatar: "https://wypty.cn/static/file/material/ai-avatar.png",
				scrollToView: "",
				userPhoto:'',
				msg: [],
				faqList: [
					"你好",
					"学院我知道",
					"芯系小助手小程序介绍",
					"人工智能与大数据学院学生机构",
					"学生分会体育部",
					"学生分会对外联络部",
					"学生分会秘书处",
					"分团委宣传部",
					"校友分会秘书处",
					"校友分会宣传部",
					"学生公寓自我管理委员会",
					"分团委学生社团管理部宣传部"
				],
				inputh: "60",
			};
		},
		onLoad() {
			this.baseURL = uni.baseURL;
			this.loadMessages(); // 加载本地存储的消息
			this.getUserPhoto()
		},
		components: {
			submit,
		},
		methods: {
			getUserPhoto() {
			            const userInfo = uni.getStorageSync('userInfo');
			            if (userInfo && userInfo.photo) {
			                this.userPhoto =this.baseURL+ userInfo.photo; // 从本地获取用户头像
			            } else {
			                this.userPhoto = this.aiAvatar; // 如果没有头像，使用默认头像
			            }
			        },
			loadMessages() {
				const storedMessages = uni.getStorageSync('chatMessages');
				if (storedMessages) {
					this.msg = this.processMessages(JSON.parse(storedMessages)); // 处理消息以合并时间
					this.$nextTick(() => {
						this.scrollToBottom(); // 滚动到最新消息
					});
				}
			},
			processMessages(messages) {
				const processedMessages = [];
				let lastTime = null;

				messages.forEach((message, index) => {
					const currentTime = new Date(message.time);
					if (lastTime) {
						const timeDiff = (currentTime - lastTime) / 1000 / 60; // 时间差（分钟）
						if (timeDiff > 5) {
							processedMessages.push({
								time: message.time,
								isTime: true
							});
						}
					} else {
						processedMessages.push({
							time: message.time,
							isTime: true
						});
					}
					processedMessages.push({
						...message,
						isTime: false
					}); // 这里不再直接添加时间
					lastTime = currentTime;
				});

				return processedMessages.map((msg, i) => {
					if (msg.isTime) {
						return {
							...msg,
							isTime: true
						}; // 仅在第一条上显示时间
					}
					if (i > 0 && processedMessages[i - 1].time === msg.time) {
						return {
							...msg,
							isTime: false
						}; // 其他时间不再显示
					}
					return msg;
				});
			},
			processTimeForMessages() {
				const processedMessages = [];
				let lastTime = null;

				this.msg.forEach((message) => {
					const currentTime = new Date(message.time);
					if (lastTime) {
						const timeDiff = (currentTime - lastTime) / 1000 / 60; // 时间差（分钟）
						if (timeDiff > 5) {
							processedMessages.push({
								time: message.time,
								isTime: true
							});
						}
					} else {
						processedMessages.push({
							time: message.time,
							isTime: true
						});
					}
					processedMessages.push({
						...message,
						isTime: false
					}); // 这里不再直接添加时间
					lastTime = currentTime;
				});

				this.msg = processedMessages.map((msg, i) => {
					if (msg.isTime) {
						return {
							...msg,
							isTime: true
						}; // 仅在第一条上显示时间
					}
					if (i > 0 && processedMessages[i - 1].time === msg.time) {
						return {
							...msg,
							isTime: false
						}; // 其他时间不再显示
					}
					return msg;
				});
			},
			changeTime(date) {
				return myfun.dateTime(date);
			},
			backOne() {
				uni.navigateBack({
					delta: 1,
				});
			},
			submitChat(e) {
				let len = this.msg.length;
				let data = {
					id: "b",
					imgurl: this.baseURL + this.userInfo.photo,
					message: e,
					types: 0,
					time: new Date(),
					tip: len,
				};

				this.msg.push(data);
				this.processTimeForMessages(); // 更新消息的时间显示
				this.scrollToView = `msg${len}`; // 设置滚动到最新消息
				this.$nextTick(() => {
					this.scrollToBottom(); // 确保滚动到最后
				});
				this.autoReply(e);
				this.saveMessages(); // 保存消息到本地
			},
			saveMessages() {
				uni.setStorageSync('chatMessages', JSON.stringify(this.msg));
			},
			autoReply(userMessage) {
				setTimeout(() => {
					let reply = this.generateAiReply(userMessage);
					let len = this.msg.length;
					let data = {
						id: "ai",
						imgurl: this.aiAvatar,
						message: reply,
						types: 0,
						time: new Date(),
						tip: len,
					};

					this.msg.push(data);
					this.processTimeForMessages(); // 更新消息的时间显示
					this.scrollToView = `msg${len}`; // 设置滚动到最新消息
					this.$nextTick(() => {
						this.scrollToBottom(); // 确保滚动到最后
					});
					this.saveMessages(); // 保存消息到本地
				}, 1000);
			},

			scrollToBottom() {
				this.$nextTick(() => {
					uni.createSelectorQuery().select('.chat-main').boundingClientRect((res) => {
						if (res) {
							uni.pageScrollTo({
								scrollTop: res.height,
								duration: 200,
							});
						}
					}).exec();
				});
			},
			handleFaqClick(question) {
				this.submitChat(question); // 模拟用户点击后发送消息
			},
			generateAiReply(message) {
				if (message.includes("你好")) {
					return "你好！有什么可以帮助你的吗？";
				} 
				else if(message.includes("芯系小助手")||message.includes("王亚鹏")||message.includes("兰星雨")||message.includes("赖雨")||message.includes("王宇佳")||message.includes("金继世")){
					return '芯系小助手微信小程序简介开发启动时间：2023年9月发起单位：人工智能与大数据学院项目背景："芯系小助手" 是一款由人工智能与大数据学院学生自主开发的微信小程序，旨在为学院师生提供便捷的学习、科研和日常管理服务。小程序包含丰富的功能模块，涵盖课程管理、科研项目申报、竞赛信息发布、校内通知、学生服务等，助力学院信息化建设，提升学生学习和管理的效率。开发团队：总发起人：  王亚鹏，男，2023级计算机科学与技术4班，专升本。人工智能与大数据学院第18届学生分会负责人，负责统筹和管理项目整体开发。项目成员：王宇佳，女，2021级物联网工程1班，本科。人工智能与大数据学院，负责前端开发与用户界面设计。兰星雨，女，2022级数字媒体技术1班，专科。人工智能与大数据学院，负责小程序的视觉设计与用户体验优化。金继世，男，2021级计算机科学与技术3班，本科。人工智能与大数据学院，负责后台开发与数据库管理。赖雨，女，2023级计算机科学与技术11班，专升本。人工智能与大数据学院，负责项目文档整理与测试。目标："芯系小助手" 致力于通过技术创新，改善学院的信息化水平，打造一个集学习、管理、互动于一体的数字化校园助手，为学院师生提供更加智能、高效的服务平台。'
				}else if (message.includes("学院我知道")) {
					return "作为四川省教育厅首批“卓越工程师人才培养计划”与“计算机一流专业建设”以及“应用型本科转型建设”教学改革项目与质量工程项目建设试点单位，人工智能与大数据学院(原信息工程学院)现开设有计算机科学与技术、电子商务、网络工程、物联网工程、数据科学与大数据技术五个本科专业及计算机应用技术、电子商务、数字媒体技术、云计算技术应用、信息安全技术应用等五个专科专业。近年来，学院依托天府软件园一线IT企业的技术支持，由五名博士领衔教学科研团队，下设软件开发与IT实习实训中心，并以实践为核心、以应用为目的，大力推行项目导向与案例驱动的全新教学模式，着力构建知识、理论、技能三位一体的培养体系;用心打造具备动手能力、开发能力与项目实战能力的应用型人才，为软件开发、网络通信、电子商务、互联网应用以及物联网、大数据、云计算、人工智能等领域培养一流的信息技术精英与卓越的IT工程师。";
				} else if (message.includes("学生机构")) {
					return "人工智能与大数据学生机构共有五大学生机构：分团委、学生分会、校友分会、学生公寓自我管理委员会和分团委学生社团管理部。";
				} else if (message.includes("分团委组织部")||message.includes("组织部")) {
					return "分团委组织部是上下级团组织的枢纽，也是连接各部门的纽带。主要负责团员发展、教育与管理，组织团内活动，如团组织生活观摩会、团组织生活会、团日活动等。我们致力于加强基层团组织建设，提高团员素质。积极协助团委开展各项工作，为同学们提供成长与锻炼的平台，与青年学子在新时代展现青春风采。";
				} else if (message.includes("分团委宣传部")) {
					return "分团委宣传部是学院学生工作的一个窗口，起着对内宣传学院动态，对外展示学院风貌的桥梁作用。宣传部负责运营学院官方账号，发布官方动态，向广大师生展现学院风采。它是与各部联系紧密，基础而又核心的一个部门。";
				} else if (message.includes("分团委记者团")||message.includes("记者团")) {
					return "分团委记者团主要负责学院的拍摄以及新闻稿撰写工作，收集各部门每周的工作计划。在积极配合其他部门完成各项工作的同时，广泛征集优秀的摄影作品，加强学院形象的塑造，展现学院良好的精神风貌。记者团不仅是一个撰写，报道的组织，还是一个在课余生活中可以进一步提升自我的组织。";
				} else if (message.includes("分团委技术部")||message.includes("技术部")) {
					return "分团委技术部是为学院宣传素材提供技术支持的技能型部门，主要工作是制作PPT、节目单，设计电子海报，邀请函，剪辑视频，控制和调试后台放映设备。运用PS、PR等软件完成宣传素材处理。加入技术部能让你熟练使用office办公软件，更对PS、PR等软件有更多的深入，欢迎加入技术部共同进步，学习更多的技能。";
				} else if (message.includes("学生分会秘书处")||message.includes("秘书处")) {
					return "学生分会秘书处，作为学生分会核心部门之一，是校级办公室与院系之间对接的重要纽带。主要工作有：策划会议活动，组织学生干部大会的召开，为学院各种活动派遣主持人，对学院其他部门进行考核，管理办公室物资和负责办公室的事务等。";
				} else if (message.includes("学生分会文艺部")||message.includes("文艺部")) {
					return "学生分会文艺部是校园文化的璀璨之星。我们以创意为笔，激情为墨，绘就多彩校园生活。我们将会策划组织运动会团体操、129合唱表演、五四朗诵和毕业晚会等，活动类型丰富多彩。在这里，你不仅是观看者，更是创造者，快来与我们一起，让艺术之花在校园内绚丽绽放!";
				} else if (message.includes("学生分会学习部")||message.includes("学习部")) {
					return "学生分会学习部致力于提高学生的学习意识，营造良好的校园学习氛围，负责与学习相关的工作以及组织管理学术活动。主要工作包括策划举办“一院一品”电脑嘉年华特色活动、三创赛，查课查早自习，协助管理辩论赛以及向学委传递学情等。";
				} else if (message.includes("学生分会辩论队")||message.includes("辩论队")) {
					return "学生分会辩论队是一支兼具知识性与竞赛性的队伍，旨在推广思辨文化，弘扬理性思考之风。以“思辨明哲”为宗旨，以“崇言杯”辩论赛为主，组织策划各类辩论赛事，为大家提供一个展示自我、提升自我的平台，并鼓励大家在辩论中明是非、察真伪。";
				} else if (message.includes("学生分会青年志愿服务中心")||message.includes("志愿")) {
					return "学生分会青年志愿服务中心一直秉持“温馨友爱，互帮互助”的精神，定期开展公益活动。点滴热泉储热能，释然忘我穿繁闹。赠人玫瑰，手有余香。部门的工作不仅能提升同学们沟通协作的能力，更能培养学生们的志愿精神和社会情怀。青年志愿服务中心期待你的加入，相信志同道合的我们会喜欢同一片风景。";
				} else if (message.includes("学生分会对外联络部")||message.includes("对外联络部")) {
					return "学生分会对外联络部主要工作是参与协作学院学校活动策划与组织、企业招聘资源整合与利用、就业咨询提供等。它不仅可以为同学们提供帮助，也能充分培养学生的服务意识。总体来说，本部门工作轻松，部门福利好。";
				} else if (message.includes("学生分会体育部")||message.includes("体育部")) {
					return "学生分会体育部是学生体育活动的引领者和领跑者，为引导广大同学积极参加体育活动开展运动会等各种体育活动、体育竞赛等提高同学们的生活质量，通过举办活动活跃校园气氛，通过参与校内各类体育赛事打造独属的精彩瞬间。我们不仅仅是一个部门更是一个充满活力与梦想的大家庭，活力四射阳光激情就是体育部的代名词。";
				} else if (message.includes("学生分会生活权益部")||message.includes("生活权益部")||message.includes("生活部")) {
					return "学生分会生活权益部是以服务学生为基础的部门，帮助同学们协调好学习和生活的关条，引导大家养成良好的生活习惯，确保有一个舒适的学习生活环境。本部门是一个团结友爱、互帮互助的大家庭，能丰富自己的实践和社交经验，提升自己的组织协调能力。";
				} else if (message.includes("校友分会宣传部")) {
					return "校友分会宣传部，精耕毕业班活动，挖掘学长学姐学习秘籍，撰写推文，传播正能量。我们不仅是故事的记录者，更是学院精神与校友成就的传播者。加入我们，不仅提升宣传技能，更能与优秀校友交流，优化学习方法，拓展人际网络，共同书写校友会的精彩篇章！";
				} else if (message.includes("校友分会秘书处")) {
					return "校友分会秘书处招新啦！我们秉持“严谨、务实、礼貌、智慧”理念，致力于校友情谊维系与弘扬。我们丰富校园文化，提供交流平台。加入我们可锻炼组织、创新及策划能力，为我们宝贵技能。诚邀您加入，共同服务校友，促进文理学科发展，共创美好未来。";
				} else if (message.includes("校友分会联络部")||message.includes("联络部")) {
					return "校友分会联络部招新啦！我们是连接校友与母校的桥梁。在这里，你可以拓展人脉、锻炼沟通能力。加入我们，一起为校友服务，传承母校精神，共同书写精彩篇章，快来成为联络部大家庭的一员吧！";
				} else if (message.includes("学生公寓自我管理委员会")) {
					return "学生公寓自我管理委员会（简称“自管委”）是学生在自我管理、自我教育、自我服务的重要组织，下辖办公室、外联部、楼管部以及宣传部四个部门。自管委旨在搭建一个学生与学校、公寓之间的沟通桥梁，维护学生公寓的正常秩序，营造和谐、温馨的居住环境，以及举办一系列围绕学生公寓展开的活动，提高同学们的综合素质，为同学们提供一个展示寝室凝聚力的舞台。欢迎广大同学积极参与自管委的各项工作，共同为我们的家园添彩！";
				} else if (message.includes("分团委学生社团管理部宣传部")) {
					return "分社管宣传部，期待你的加入！我们见之，布置活动现场、主持与拍照。我们宣之，整理宣传稿，发布推文。我们传之，制作各类宣传文件，运营平台。";
				} else if (message.includes("分团委学生社团管理部监察部")||message.includes("监察部")) {
					return "分社管监察部，作为大家庭里的一员，你需要认真负责监督并审核机构内部及各社团所上交的资料、四件套以及例会活动等，并且辅助社团活动的开展，没有监管，何来自由，在这里，你将续写大学辉煌，开启人生新的篇章！";
				} else if (message.includes("分团委学生社团管理部办公室")||message.includes("办公室")) {
					return "分社管办公室为每一个您助力梦想，加入我们提升管理技能，如管理社团财务收支，审批社团活动，维护社团档案资料，组织会议并记录，每月进行月计划和总结，办公室诚邀您加入我们，共同进步，共同服务校友，一起挥洒我们青春汗水！";
				} else if (message.includes("招新")) {
					return "我们正在进行招新活动，欢迎各位同学加入我们的学生机构，共同成长！";
				} else {
					return "抱歉，我不太明白你的意思。";
				}
			},
			getSubHeight(e) {
				this.inputh = e;
				this.scrollToBottom();
			},
		},
		computed: {
			...mapState(["userInfo"]),
		},
		onShareAppMessage() { // 分享到微信
			// 更多参数配置，参考文档
			return {
				title: '智数AI',
				path: 'pagesNav/societies/societies'
			}
		},

		onShareTimeline() { // 分享到朋友圈
			return {
				title: '智数AI',
				path: 'pagesNav/societies/societies'
			}
		},
	};
</script>

<style lang="scss">
	@import "../commons/css/mycss.scss";

	.chat {
		height: 100%;

		.top-bar {
			align-items: center;
		}

		.padbt {
			height: 500rpx;
			width: 100%;
		}

		.chat-main {
			padding-left: $uni-spacing-col-base;
			padding-right: $uni-spacing-col-base;
			display: flex;
			flex-direction: column;
		}

		.chat-ls {
			.chat-time {
				font-size: $uni-font-size-sm;
				color: rgba(39, 40, 50, 0.3);
				line-height: 34rpx;
				padding: 20rpx 0;
				text-align: center;
			}

			.msg-m {
				display: flex;
				padding: 20rpx 0;

				.user-img {
					flex: none;
					width: $uni-img-size-sm;
					height: $uni-img-size-sm;
					border-radius: $uni-border-radius-base;
				}

				.message {
					flex: none;
					max-width: 480rpx;
				}

				.msg-text {
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 44rpx;
					padding: 18rpx 24rpx;
				}
			}

			.msg-left {
				flex-direction: row;

				.msg-text {
					margin-left: 16rpx;
					background-color: #fff;
					border-radius: 0rpx 20rpx 20rpx 20rpx;
				}
			}

			.msg-right {
				flex-direction: row-reverse;

				.msg-text {
					margin-right: 16rpx;
					background-color: #f0f0f0;
					border-radius: 20px 0rpx 20rpx 20rpx;
				}
			}
		}
	}

	.faq-panel {
		position: fixed;
		bottom: 140rpx;
		left: 0;
		padding: 20rpx;
		background-color: #f9f9f9;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
		width: 100%;

		.faq-title {
			font-size: $uni-font-size-lg;
			margin-bottom: 10rpx;
		}

		.faq-list {
			max-height: 300rpx;
			/* 设置最大高度 */
			overflow-y: auto;
			/* 启用垂直滚动条 */
			
			/* 可选：添加边框 */
			padding: 10px;
			/* 可选：内边距 */
		

			/* 可选：圆角 */
			.faq-item {
				padding: 10rpx;
				border-bottom: 1px solid #eee;
				cursor: pointer;

				&:last-child {
					border-bottom: none;
				}
			}
		}
	}
</style>