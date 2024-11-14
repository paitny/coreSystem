<template>
  <view class="container">
    <view class="background"></view>
    <view class="hm-spinner"></view>
  </view>
</template>

<script>
export default {
  name: "loading",
  data() {
    return {};
  }
}
</script>

<style>
.container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 使用视窗的高度来填满整个屏幕 */
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5); /* 半透明背景 */
  backdrop-filter: blur(10px); /* 模糊处理 */
  z-index: -1; /* 背景层在 z 轴上处于最底层 */
}

.hm-spinner {
  height: 115px;
  width: 115px;
  border: 5px solid transparent;
  border-top-color: #1976d2;
  border-bottom-color: #1976d2;
  border-radius: 50%;
  position: relative;
  animation: spin 3s linear infinite;
}

.hm-spinner::before {
  content: "";
  position: absolute;
  top: 20px;
  right: 20px;
  bottom: 20px;
  left: 20px;
  border: 5px solid transparent;
  border-top-color: #03a9f4;
  border-bottom-color: #03a9f4;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
