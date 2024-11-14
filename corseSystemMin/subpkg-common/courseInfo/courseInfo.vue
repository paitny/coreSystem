<template>
	<view class="container">
	  <view class="info-box">
	    <view class="course-title">{{info.name}}</view>
	    <view class="info-list">
	      <view class="info-item" v-for="item in infoRef" :key="item">
	        <view class="info-item__key">
	          {{item.title}}
	        </view>
	        <view class="info-item__val">
	          {{info[item.key]}}
	        </view>
	      </view>
	    </view>
	  </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info:[],
				infoRef: [
				      {
				        key: 'rawWeeks',
				        title: '周数'
				      },
				      {
				        key: 'rawSection',
				        title: '节数'
				      },
				      {
				        key: 'address',
				        title: '地址'
				      },
				      {
				        key: 'teacher',
				        title: '老师'
				      },
				      {
				        key: 'credit',
				        title: '学分'
				      },
				      {
				        key: 'category',
				        title: '类型'
				      },
				      {
				        key: 'method',
				        title: '考查'
				      }
				    ]
			};
		},
		onLoad(options) {
			let info = options.info || ''
			    if (info == '') {
			      wx.showToast({
			        title: '页面不存在',
			        icon: 'none'
			      })
			      setTimeout(() => {
			        uni.navigateBack({
			          delta: 1,
			        })
			      }, 1500);
			      return
			    }
			    info = JSON.parse(info)
			    info.rawSection = info.rawSection
				this.info=info
		},
		methods:{
			 getCurrentSemester() {
			  const currentDate = new Date();
			  const currentYear = currentDate.getFullYear();
			  const currentMonth = currentDate.getMonth() + 1; // 月份从0开始，所以要加1
			
			  // 根据月份判断学期
			  let semester;
			  if (currentMonth >= 9 && currentMonth <= 12) {
			    semester = '第一学期';
			  } else if (currentMonth >= 3 && currentMonth <= 6) {
			    semester = '第二学期';
			  } else {
			    // 如果不在以上月份范围内，可能是寒假或暑假，需要根据实际情况确定
			    semester = '寒假/暑假';
			  }
			
			  // 根据学期名称和年份生成学年度信息
			  const academicYear = `${currentYear }-${currentYear+1}学年度`;
			
			  // 返回结果
			  return `${academicYear}${semester}`;
			}
		}
	}
</script>

<style lang="scss">
page {
  background: #fafafa;
}

.info-box {
  background-color: #fff;
  padding: 30rpx 30rpx 0;
}

.course-title {
  font-size: 32rpx;
  color: #333333;
  text-align: center;
}

.info-list {
  margin-top: 10rpx;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
}

.info-item:not(:last-child) {
  border-bottom: 1rpx solid rgba(243, 243, 243, 0.82);
}

.info-item__key {
  color: var(--theme);
  margin-right: 40rpx;
}

.info-item__val {
  color: #666666;
}

</style>
