<template>
	<view class="container">
		<view class="title">
			<text>学院概况</text><br />
			<text class="time">2019年05月28日</text>
		</view>
		<view class="content">
			<text>作为四川省教育厅首批“卓越工程师人才培养计划”与“应用型本科转型建设”教改项目与质量工程试点单位，信息工程学院(原信息技术学院)开设计算机科学与技术、电子商务、网络工程、物联网工程四个本科专业及电子商务、数字媒体应用技术等三个专科专业。近年来，学院依托天府软件园一线IT企业的技术支持，由五名博士领衔教学科研团队，下设软件开发与IT实习实训中心，并以实践为核心、以应用为目的，大力推行项目导向与案例驱动的全新教学模式，着力构建知识、理论、技能三位一体的培养体系;用心打造具备动手能力、开发能力与项目实战能力的应用型人才，为软件开发、网络通信、电子商务、互联网应用以及物联网、大数据、云计算、人工智能等领域培养一流的技术精英与IT工程师。</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}

		,
		onShareAppMessage() { // 分享到微信
			// 更多参数配置，参考文档
			return {
				title: '信工学院概况',
				path: '/pagesHome/home/overview'
			}
		},

		onShareTimeline() { // 分享到朋友圈
			return {
				title: '信工学院概况',
				path: '/pagesHome/home/overview'
			}
		},
	}
</script>

<style lang="scss">
	page{
		background-image: url("https://wypty.cn/static/file/material/specialityBg.jpg");
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
	
	.container {
		width: 100%;
		height: 100%;
		font-family: "幼圆";

		.title {
			margin: 20px 25% 0px;
			width: 50%;
			display: flex;
			flex-wrap: wrap;
			text-align: center;

			text {
				width: 100%;
				line-height: 50px;
				font-size: 28px;
				font-weight: bold;
				
			}

			.time {
				color: gray;
				font-weight: 400;
				font-size: 12px;
				color: #fff;
			}
		}

		.content {
			color: #1f1f1f;
			text-align: justify;
			margin: 8%;
			font-family: "幼圆";
			font-size: 18px;
			line-height: 25px;
			color: #525252;
			text{
				color: #fff;
			}
		}
	}
</style>