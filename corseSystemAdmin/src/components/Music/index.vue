<template>
  <div id="audioPlayer">
    <div id="aplayer" ref="playerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, nextTick, onBeforeUnmount, onMounted, defineExpose } from 'vue';
// @ts-ignore
import APlayer from 'aplayer';
import 'aplayer/dist/APlayer.min.css';
import { getMusic } from "../../api/getData";
import { emitter, audioInstance } from '../../utils/eventBus';

const playerRef = ref();
let instance: APlayer;

class Audio {
  artist: String;
  name: String;
  url: String;
  cover: String;
  lrc: String;
  theme: String;

  constructor(artist: String, name: String, url: String, cover: String, lrc: String, theme: String) {
    this.artist = artist;
    this.name = name;
    this.url = url;
    this.cover = cover;
    this.lrc = lrc;
    this.theme = theme;
  }
}

const props = defineProps({
  fixed: { type: Boolean, default: true },
  mini: { type: Boolean, default: true },
  autoplay: { type: Boolean, default: false },
  theme: { type: String, default: 'rgba(255,255,255,0.2)' },
  loop: { type: String, default: 'all' },
  order: { type: String, default: 'random' },
  preload: { type: String, default: 'auto' },
  volume: { type: Number, default: 0.7, validator: (value: Number) => value >= 0 && value <= 1 },
  songServer: { type: String, default: 'netease' },
  songType: { type: String, default: 'playlist' },
  songId: { type: String, default: '19723756' },
  mutex: { type: Boolean, default: false },
  lrcType: { type: Number, default: 3 },
  listFolded: { type: Boolean, default: true },
  listMaxHeight: { type: String, default: '160px' },
  storageName: { type: String, default: 'aplayer-setting' }
});

onMounted(async () => {
  await nextTick(async () => {
    try {
      const res = await getMusic();
      const baseURL = process.env.NODE_ENV === 'development' ? '/api' : '/static';
      const audioList = res.data.data.map((value: any) => new Audio(value.artist, value.name, baseURL + value.url, baseURL + value.cover, baseURL + value.lrc, value.theme));

      if (playerRef.value) {
        instance = new APlayer({
          container: playerRef.value,
          fixed: props.fixed,
          mini: props.mini,
          autoplay: props.autoplay,
          theme: props.theme,
          loop: props.loop,
          order: props.order,
          preload: props.preload,
          volume: props.volume,
          mutex: props.mutex,
          lrcType: props.lrcType,
          listFolded: props.listFolded,
          listMaxHeight: props.listMaxHeight,
          storageName: props.storageName,
          audio: audioList,
        });
        audioInstance.value = instance; // 保存实例到事件总线
        // @ts-ignore
         emitter.on('playMusic', ( url, lrc ) => {
          instance.audio.src = url; // 设置音频源
          instance.play(); // 播放
          if (lrc) {
            instance.lrc.load(lrc); // 加载歌词
          }
        });
      }
    } catch (error) {
      console.error('Error fetching music:', error);
    }
  });
});

onBeforeUnmount(() => {
  if (instance) {
    instance.destroy();
  }
});

defineExpose({ instance }); // 暴露实例
</script>

<style lang="scss" scoped>
#audioPlayer {
  :deep(.aplayer.aplayer-fixed .aplayer-lrc) {
    display: block;
    position: fixed;
    /* bottom: 10px; */
    top: 25px;
    left: 0;
    right: 0;
    margin: 0;
    z-index: 999;
    pointer-events: none;
    text-shadow: -1px -1px 0 #fff;
  }

  :deep(.aplayer .aplayer-lrc p.aplayer-lrc-current) {
    /* 大小 */
    font-size: 16px;
    /* 颜色 */
    color: #8967FC;
    opacity: 1;
    overflow: visible;
    height: auto !important;
    min-height: 16px;
  }

  :deep(.aplayer .aplayer-lrc p) {
    font-weight: 700;
    font-size: 13px;
    color: #1b82f1;
    line-height: 16px !important;
    height: 16px !important;
    padding: 0 !important;
    margin: 0 !important;
    transition: all .5s ease-out;
    opacity: .4;
    overflow: hidden
  }


  #player {
    width: 310px;
    // 定个宽度
    z-index: 9999 !important;
  }
}
</style>
