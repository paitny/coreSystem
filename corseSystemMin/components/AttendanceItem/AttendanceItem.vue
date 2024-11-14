<template>
  <view class="student">
	  <view class="info">
		  <text>姓名:{{ user.name }}</text>
		  <text>性别:{{ user.sex }}</text>
		  <text>学号:{{ user.num }}</text>
	  </view>
    
    <view class="button-group">
      <button
        :class="{ active: user.status === 'leave' }"
        @click="toggleStatus('leave')"
      >
        {{ user.status === 'leave' ? '取消请假' : '请假' }}
      </button>
      <button
        :class="{ active: user.status === 'absent' }"
        @click="toggleStatus('absent')"
      >
        {{ user.status === 'absent' ? '取消缺席' : '缺席' }}
      </button>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    user: Object
  },
  mounted() {
  	console.log(this.user);
  },
  methods: {
    toggleStatus(newStatus) {
      if (this.user.status === newStatus) {
        newStatus = 'present'; // 取消状态时的默认状态，根据需要调整
      }
      this.$emit('update-status', this.user, newStatus);
      this.updateRemarks(newStatus);
    },
    updateRemarks(newStatus) {
      if (!this.user || !this.user.remarks) {
        console.warn('User or remarks is undefined.');
        return;
      }

      let actionText = '';
      switch (newStatus) {
        case 'leave':
          actionText = ' 请假';
          break;
        case 'absent':
          actionText = ' 缺席';
          break;
        default:
          break;
      }

      if (actionText) {
        if (!this.user.remarks.includes(actionText)) {
          this.$set(this.user, 'remarks', (this.user.remarks + actionText).trim());
        }
      } else {
        this.user.remarks = this.user.remarks
          .replace(' 请假', '')
          .replace(' 缺席', '')
          .replace(/\s*,\s*$/, '');
      }

      console.log('Current remarks:', this.user.remarks);
    }
  }
};
</script>

<style scoped>
.student {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 垂直居中 */
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f8f9fa; /* 背景色 */
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  z-index: 999;
}

.button-group {
  display: flex;
  gap: 10px; /* 按钮间距 */
}

button {
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease; /* 按钮动画效果 */
}

button.active {
  background-color: red; /* 激活状态下的按钮颜色 */
}
.info{
	display: flex;
	flex-direction: column;
	font-size: 25rpx;
}
</style>
