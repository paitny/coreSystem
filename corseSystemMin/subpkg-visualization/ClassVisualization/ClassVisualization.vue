<template>
	<view class="box">
		<view class="title">{{ time }}</view>
		<view class="title">{{ className }}</view>
		<view class="title">{{ title }}查课数据可视化</view>
		<view class="charts-box">
			<qiun-data-charts type="pie" :chartData="pieData" />
		</view>
	</view>
	<view class="flex-container">
		<view v-for="(item, index) in statusData" :key="index" class="status-item" @click="handleItemClick(item)">
			<view class="status-count">
				<NumberRoller :num="item.count" color="#000000" width="15" height="15" fontSize="15" />
			</view>
			<view class="status-label">{{ item.label }}</view>
		</view>
	</view>
</template>
<script>
	import NumberRoller from '@/components/countUp/countUp.vue';

	export default {
		components: {
			NumberRoller,
		},
		data() {
			return {
				className:'',
				title: '',
				time: '',
				pieData: {
					series: [],
				},
				statusData: [],
				userData: []
			};
		},

		onLoad(options) {
			this.initData(options);
		},

		methods: {
			initData(options) {
				this.className=options.className
				this.time = options.time
				this.title = options.title || '默认标题';
				this.userData =JSON.parse(options.results) 
				
				

				const coursePerson = {
					shouldAttend: parseInt(options.shouldAttend),
					actualAttend: parseInt(options.actualAttend),
					leave: parseInt(options.leave),
					absent: parseInt(options.absent)
				};
				const pieDataSeries = this.getPieDataSeries(coursePerson);
				const statusDataItems = this.getStatusDataItems(coursePerson);

				this.pieData.series = pieDataSeries;
				this.statusData = statusDataItems;
			},

			getPieDataSeries(coursePerson) {
				return [

					{
						name: '到课率',
						data: coursePerson.actualAttend,
					},
					{
						name: '请假',
						data: coursePerson.leave,
					},
					{
						name: '缺席',
						data: coursePerson.absent,
					},
				];
			},

			getStatusDataItems(coursePerson) {
				return [{
						label: '总人数',
						count: coursePerson.shouldAttend,
					},
					{
						label: '实到',
						count: coursePerson.actualAttend,
					},
					{
						label: '请假',
						count: coursePerson.leave,
					},
					{
						label: '缺席',
						count: coursePerson.absent,
					},
				];
			},

			handleItemClick(item) {
				uni.navigateTo({
					url: `../../subpkg-visualization/checkCourseData/checkCourseData?label=${item.label}&results=${JSON.stringify(this.userData)}`,
				});
			},
		},
	};
</script>
<style lang="scss" scoped>
	.title {
		text-align: center;
		margin-top: 20rpx;
	}

	.flex-container {
		margin-top: 50rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.charts-box {
		margin-top: 50rpx;
		width: 100%; // 确保图表容器有足够的宽度
	}

	.status-item {
		flex: 0 0 45%;
		box-sizing: border-box;
		border: 2rpx solid #4d6398;
		margin: 10rpx;
		padding: 20rpx;
		text-align: center;
		border-radius: 10rpx;
	}

	.status-count {
		font-size: 36rpx;
		font-weight: bold;
	}

	.status-label {
		font-size: 28rpx;
	}
</style>