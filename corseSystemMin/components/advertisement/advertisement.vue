<template>
  <view class="content">
    <ad-rewarded-video adpid="adunit-36f40df016ca3710" :loadnext="true" v-slot:default="{loading, error}" @load="onadload" @close="onadclose" @error="onaderror">
      <button :disabled="loading" :loading="loading">显示广告</button>
      <view v-if="error">{{error}}</view>
    </ad-rewarded-video>
  </view>
</template>

<script>
    export default {
        data() {
            return {
                title: 'createRewardedVideoAd'
            }
        },
        onReady() {
          this._isLoaded = false
          rewardedVideoAd = this._rewardedVideoAd = uni.createRewardedVideoAd({
            adpid: 'adunit-36f40df016ca3710',
            urlCallback: { // 服务器回调透传参数
              userId: 'testuser',
              extra: 'testdata'
            }
          }) // 仅用于HBuilder基座调试 adpid: '1507000689'
          rewardedVideoAd.onLoad(() => {
            this._isLoaded = true
            console.log('onLoad event')
            // 当激励视频被关闭时，默认预载下一条数据，加载完成时仍然触发 `onLoad` 事件
          })
          rewardedVideoAd.onError((err) => {
            console.log('onError event', err)
          })
          rewardedVideoAd.onClose((res) => {
            console.log('onClose event', res)
          })
        },
        methods: {
          show() {
            if (this._isLoaded) {
              this._rewardedVideoAd.show()
            }
          }
        }
    }
</script>


