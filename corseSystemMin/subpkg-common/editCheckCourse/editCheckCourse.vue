<template>
  <view class="container">
    <view class="attendance-list">
      <view class="student" v-for="user in results" :key="user._id">
        <text>{{ user.name }}</text>
        <button @click="markLeave(user)">请假</button>
        <button @click="markAbsent(user)">缺席</button>
        <button @click="markPresent(user)">实到</button>
      </view>
    </view>
    <button @click="submitAttendance">提交考勤数据</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      results: [],
      actualAttend: 0,
      leaveCount: 0,
      absentCount: 0,
    };
  },
  onLoad(options) {
	  console.log( options);
    this.results = JSON.parse(decodeURIComponent(options.results));
	
    this.results.forEach(user => {
      user.status = 'not marked'; // Initialize status
    });
  },
  methods: {
    markLeave(user) {
      if (user.status === 'leave') return;
      this.updateCounts(user, 'leave');
    },
    markAbsent(user) {
      if (user.status === 'absent') return;
      this.updateCounts(user, 'absent');
    },
    markPresent(user) {
      if (user.status === 'present') return;
      this.updateCounts(user, 'present');
    },
    updateCounts(user, newStatus) {
      switch (user.status) {
        case 'leave':
          this.leaveCount--;
          break;
        case 'absent':
          this.absentCount--;
          break;
        case 'present':
          this.actualAttend--;
          break;
      }
      user.status = newStatus;
      switch (newStatus) {
        case 'leave':
          this.leaveCount++;
          break;
        case 'absent':
          this.absentCount++;
          break;
        case 'present':
          this.actualAttend++;
          break;
      }
    },
    submitAttendance() {
      const feedbackData = {
        actualAttend: this.actualAttend,
        leaveCount: this.leaveCount,
        absentCount: this.absentCount,
        results: this.results
      };
      // Navigate back with feedback data
      uni.navigateBack({
        url: `/subpkg-common/attendanceCourse/attendanceCourse?feedbackData=${encodeURIComponent(JSON.stringify(feedbackData))}`
      });
    }
  }
};
</script>

<style>
.container {
  padding: 20px;
}
.attendance-list {
  margin-bottom: 20px;
}
.student {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
}
</style>
