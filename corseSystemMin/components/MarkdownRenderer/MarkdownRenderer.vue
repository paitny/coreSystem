<template>
  <view>
    <!-- 使用 rich-text 渲染 HTML -->
    <rich-text :nodes="renderedHTML"></rich-text>
  </view>
</template>

<script>
import {marked } from 'marked';

export default {
  data() {
    return {
      filePath: 'https://wypty.cn/static/file/mdTechnology/interface.md', // 文件路径，请根据实际情况调整
      renderedHTML: '',
    };
  },

  mounted() {
    // 调用读取文件并渲染Markdown的函数
    this.readAndRenderMarkdown();
  },

  methods: {
    readAndRenderMarkdown() {
      uni.request({
        url: this.filePath,
        method: 'GET',
        success: (res) => {
          const markdownText = res.data;

          // 使用 marked 库将Markdown文本转换为HTML
          const htmlText = marked(markdownText);

          // 将HTML设置到 data 中，用于在页面中渲染
          this.renderedHTML = htmlText;
        },
        fail: (err) => {
          console.error('读取文件失败', err);
        },
      });
    },
  },
};
</script>
