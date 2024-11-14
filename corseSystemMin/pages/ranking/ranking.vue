<template>
	 <rankingLoad v-if="showload" ></rankingLoad>
  <view class="ranking-page" v-else>
    <view class="ranking-header">
      <text class="ranking-title">活动参与排名</text>
    </view>

   
      <view class="ranking-item" v-for="(student, index) in students" :key="student._id"  :class="student.userId === userInfo._id ? 'rotate' : 'stop'">
        <view
          class="ranking-number"
          :style="getNumberStyle(index)"
        >
          {{ index + 1 }}
        </view>
        <image class="ranking-avatar" :src="baseURL + student.avatar" />
        <view class="ranking-info">
          <text class="ranking-nickname">{{ student.nickname }}&nbsp; </text><br>
          <text class="ranking-details">年级:{{ student.grade }}</text><br>
          <text class="ranking-details">班级:{{ student.class }} {{ student.level }}</text><br>
          <text class="ranking-details">时间戳:{{ student.totalRegistrationTime }}</text>
        </view>
        <view class="ranking-activity-count">{{ student.activityCount }} 次</view>
      </view>

  </view>
 
</template>

<script>
	import rankingLoad from '../../components/ranking-skeleton/ranking-skeleton.vue'
	import {mapState} from 'vuex'
export default {
  data() {
    return {
	 showload: true,
      baseURL: '',
      students: [],
      currentSlide: 0,
      slideInterval: null
    };
  },
  onLoad() {
    this.baseURL = uni.baseURL;
    this.getRanking();
    this.startSlider();
  },
  computed:{
	...mapState(['userInfo'])  
  },
  components:{
	  rankingLoad
  },
  onShareAppMessage() { // 分享到微信
  	// 更多参数配置，参考文档
  	return {
  		title: '智数活动排名',
  		path: '/pages/ranking/ranking'
  	}
  },
  
  onShareTimeline() { // 分享到朋友圈
  	return {
  		title: '智数活动排名',
  		path: '/pages/ranking/ranking'
  	}
  },
  methods: {
    formatTime(timestamp) {
      const totalSeconds = Math.floor(timestamp / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      return `${hours}小时 ${minutes}分钟 ${seconds}秒`;
    },
    async getRanking() {
      try {
        const res = await uni.$http.get("/api/itVolunteer/user-activity-ranking");
		if (res.errMsg == "request:ok") {
			
			const newRanking = res.data;
			this.updateRanking(newRanking);
			
				this.showload = false
			
		}
       
      } catch (error) {
        console.error("获取排名数据失败:", error);
      }
    },
    updateRanking(newRanking) {
      const oldRankingMap = new Map(this.students.map(student => [student._id, student]));

      this.students = newRanking.map(student => {
        const oldStudent = oldRankingMap.get(student._id);
        if (oldStudent) {
          return {
            ...oldStudent,
            ...student
          };
        }
        return student;
      });

      this.students.sort((a, b) => {
        if (b.activityCount === a.activityCount) {
          return a.totalRegistrationTime - b.totalRegistrationTime;
        }
        return b.activityCount - a.activityCount;
      });
    },
    startSlider() {
    
        this.currentSlide = (this.currentSlide + 1) % this.students.length;
    
    },
    stopSlider() {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    },
    getNumberStyle(index) {
      let backgroundColor = '#f0f0f0'; // 默认灰色
      let color = '#333'; // 默认文字颜色

      switch (index) {
        case 0:
          backgroundColor = '#ffd700'; // 金色
          color = '#fff'; // 白色文字
          break;
        case 1:
          backgroundColor = '#c0c0c0'; // 银色
          color = '#000'; // 黑色文字
          break;
        case 2:
          backgroundColor = '#cd7f32'; // 铜色
          color = '#fff'; // 白色文字
          break;
      }

      return {
        backgroundColor: backgroundColor,
        color: color
      };
    }
  },
  mounted() {
   
      this.getRanking();
    
  },
  beforeDestroy() {
    clearInterval(this.interval);
    this.stopSlider();
  }
};
</script>

<style scoped>
.ranking-page {
  padding: 20rpx;
}

.ranking-header {
  text-align: center;
  margin-bottom: 20rpx;
}
/* .rotate {
  animation: rotate 2s linear infinite;
} */

.stop {
  animation: none; /* 不应用动画 */
}

/* @keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
} */
.ranking-title {
  font-size: 40rpx;
  font-weight: bold;
}

.loading {
  text-align: center;
  font-size: 36rpx;
  padding: 20rpx;
}

.ranking-slider {
  position: relative;
  transition: top 2s ease-in-out;
}

.ranking-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  padding: 20rpx;
  border-radius: 20rpx;
  background-color: #ffffff;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
}

.ranking-number {
  width: 60rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  font-size: 36rpx;
  font-weight: bold;
  border-radius: 50%;
}

.ranking-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-left: 20rpx;
}

.ranking-info {
  flex: 1;
  margin-left: 20rpx;
}

.ranking-nickname {
  font-size: 36rpx;
  font-weight: bold;
}

.ranking-details {
  font-size: 28rpx;
  color: #888;
}

.ranking-activity-count {
  font-size: 36rpx;
  font-weight: bold;
  margin-left: 20rpx;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
