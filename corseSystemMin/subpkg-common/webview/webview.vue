<template>
  <view class="webview-container">
    <web-view :src="externalLink" @message="onWebviewMessage"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      externalLink: '', // 外部链接的URL
    };
  },
  onLoad(options) {
    // 从路由参数获取外部链接的URL

    if (options && options.url) {
      this.externalLink = options.url;
    }
  },
  methods: {
    onWebviewMessage(e) {
      // 处理来自webview的消息
      console.log('Received message from webview:', e.detail);
      // 在这里可以根据需要处理webview发送的消息
    },
  },
};
</script>

<style>
.webview-container {
  width: 100%;
  height: 100%;
}
</style>
