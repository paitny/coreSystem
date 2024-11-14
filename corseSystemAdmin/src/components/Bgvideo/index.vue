<template>
  <div class="login-page">
    <!-- 此处图片用于当视屏加载失败时的替换背景图片 -->
    <div class="videoContainer">
      <video
          :style="fixStyle"
          class="fillWidth"
          playsinline=""
          autoplay=""
          muted=""
          loop=""
          v-on:canplay="canplay"
      >
        <source src="../../assets/video/loginVideo.mp4" type="video/mp4" />
      </video>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      vedioCanPlay: false, //控制视屏加载状态显示图片
      fixStyle: ''  //屏幕发生变化时给播放器设置的样式
    }
  },
  mounted() {
    this.getVideoStyle()
  },
  methods: {
    //视屏播放失败展示背景图片
    canplay() {
      this.vedioCanPlay = true
    },
    //监听屏幕大小实时给播放器设置宽高
    getVideoStyle() {
      window.onresize = () => {
        const windowWidth = document.body.clientWidth
        const windowHeight = document.body.clientHeight
        const windowAspectRatio = windowHeight / windowWidth
        console.log(windowWidth, windowHeight, windowAspectRatio, '屏幕实时大小')
        let videoWidth
        let videoHeight
        if (windowAspectRatio < 0.5625) {
          videoWidth = windowWidth
          videoHeight = videoWidth * 0.5625
          this.fixStyle = {
            height: windowWidth * 0.5625 + 'px',
            width: windowWidth + 'px',
            'margin-bottom': (windowHeight - videoHeight) / 2 + 'px',
            'margin-left': 'initial'
          }
        } else {
          videoHeight = windowHeight
          videoWidth = videoHeight / 0.5625
          this.fixStyle = {
            height: windowHeight + 'px',
            width: windowHeight / 0.5625 + 'px',
            'margin-left': (windowWidth - videoWidth) / 2 + 'px',
            'margin-bottom': 'initial'
          }
        }
      }
      window.onresize()
    }
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  background-size: cover;
  background-attachment: scroll;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-background {
  width: 100%;
  display: block;
  position: fixed;
  top: 0;
  height: 100%;
  left: 0;
  z-index: -99;
}
//根据需求自行修改这个类名的样式，其他样式必须添加
.videoContainer {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -100;
}

.videoContainer:before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  display: block;
  z-index: -1;
  top: 0;
  left: 0;
  background: rgba(25, 29, 34, 0.65);
}
.fillWidth {
  width: 100%;
}

</style>
