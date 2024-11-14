<template>
  <view class="box">
    <view class="title">{{ title }}数据可视化</view>
    <view class="charts-box">
      <qiun-data-charts type="pie" :chartData="pieData"/>
    </view>
  </view>
  <view class="flex-container">
    <view
      v-for="(item, index) in statusData"
      :key="index"
      class="status-item"
      @click="handleItemClick(item)"
    >
      <view class="status-count">
        <NumberRoller
          :num="item.count"
          color="#000000"
          width="15"
          height="15"
          fontSize="15"
        />
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
      title: '',
      pieData: {
        series: [],
      },
      statusData: [],
    };
  },

  onLoad(options) {
    const volunteerCounts = JSON.parse(options.volunteerCounts);
    this.initData(volunteerCounts, options);
  },

  methods: {
    initData(volunteerCounts, options) {
      this.title = options.title;
      const isSignedIn = JSON.parse(options.isSign);
	  const isCheckOut = JSON.parse(options.isCheckOut);
      const isAudit = JSON.parse(options.audit);
      const id = options.id;

      const pieDataSeries = this.getPieDataSeries(volunteerCounts, isSignedIn);
      const statusDataItems = this.getStatusDataItems(volunteerCounts, isSignedIn);
      this.pieData.series=[]
	  this.statusData=[]
      this.pieData.series = pieDataSeries;
      this.statusData = statusDataItems;

      this.handleItemClick = this.handleItemClick.bind(this, id, isSignedIn, isAudit,isCheckOut);
    },

    getPieDataSeries(volunteerCounts, isSignedIn) {
      if (isSignedIn) {
        return [
          {
            name: '已签到',
            data: volunteerCounts.signedVolunteers,
          },
          {
            name: '未签到',
            data: volunteerCounts.unsignedVolunteers,
          },
          {
            name: '学生干部',
            data: volunteerCounts.studentLeaderVolunteers,
          },
          {
            name: '普通学生',
            data: volunteerCounts.totalVolunteers - volunteerCounts.studentLeaderVolunteers,
          },
        ];
      } else {
        return [
          {
            name: '学生干部',
            data: volunteerCounts.studentLeaderVolunteers,
          },
          {
            name: '普通学生',
            data: volunteerCounts.totalVolunteers - volunteerCounts.studentLeaderVolunteers,
          },
          {
            name: '未参与学生干部',
            data: volunteerCounts.UnparticipatedStudentsCadre,
          },
        ];
      }
    },

    getStatusDataItems(volunteerCounts, isSignedIn) {
      if (isSignedIn) {
        return [
          {
            label: '总人数',
            count: volunteerCounts.totalVolunteers,
          },
          {
            label: '已签到',
            count: volunteerCounts.signedVolunteers,
          },
          {
            label: '未签到',
            count: volunteerCounts.unsignedVolunteers,
          },
          {
            label: '普通学生',
            count: volunteerCounts.totalVolunteers - volunteerCounts.studentLeaderVolunteers,
          },
          {
            label: '学生干部',
            count: volunteerCounts.studentLeaderVolunteers,
          },
          {
            label: '未参与学生干部',
            count: volunteerCounts.UnparticipatedStudentsCadre,
          },
        ];
      } else {
        return [
          {
            label: '总人数',
            count: volunteerCounts.totalVolunteers,
          },
          {
            label: '普通学生',
            count: volunteerCounts.totalVolunteers - volunteerCounts.studentLeaderVolunteers,
          },
          {
            label: '学生干部',
            count: volunteerCounts.studentLeaderVolunteers,
          },
          {
            label: '未参与学生干部',
            count: volunteerCounts.UnparticipatedStudentsCadre,
          },
        ];
      }
    },

    handleItemClick(id, isSignedIn, isAudit,isCheckOut, item) {
      if (['总人数', '已签到', '未签到'].includes(item.label)) {
        uni.navigateTo({
          url: `../../subpkg-activity/signPage/signPage?id=${id}&isSign=${isSignedIn}&audit=${isAudit}&isCheckOut=${isCheckOut}`,
        });
      } else {
        uni.navigateTo({
          url: `../studentActivity/studentActivity?id=${id}&label=${item.label}&isSign=${isSignedIn}&isCheckOut=${isCheckOut}`,
        });
      }
    },
  },
};
</script>

<!-- 样式部分未修改 -->
<style lang="scss" scoped>
.title {
  text-align: center;
  margin-top: 50rpx;
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