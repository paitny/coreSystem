import { createApp } from 'vue';
import App from './App.vue';
import router from "./router";
import store from './store';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import "./assets/scss/index.scss";
import 'virtual:svg-icons-register';
import "../src/utils/permission";
import AudioPlayer from './components/Music/index.vue';

import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import installIcon from "./icons";
import axios from "axios";
import 'vue3-video-play/dist/style.css'; // 引入css
import Particles from 'particles.vue3';

// @ts-ignore
import VueAnimateNumber from 'vue-animate-number';

const app = createApp(App);

// 服务器前缀设置
const baseURL = process.env.NODE_ENV === "development" ? '/api' : '';
const staticURL = process.env.NODE_ENV === "development" ? '' : '/static';

// 配置全局axios
axios.defaults.baseURL = baseURL; // 配置前缀url
axios.defaults.withCredentials = true; // 携带cookie
app.config.globalProperties.$axios = axios;

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.use(ElementPlus);
installIcon(app);

// 注册音乐播放器组件
app.component('AudioPlayer', AudioPlayer);

// 全局播放和暂停方法
let audioPlayerInstance: { play: () => void; pause: () => void; };

app.mixin({
    data() {
        return {baseURL,staticURL}
    },
    mounted() {
        // 保存播放器实例
        if (this.$refs.audioPlayer) {
            audioPlayerInstance = this.$refs.audioPlayer;
        }
    },
    methods: {
        playMusic() {
            audioPlayerInstance?.play();
        },
        pauseMusic() {
            audioPlayerInstance?.pause();
        }
    }
});

app.use(store).use(Particles).use(router).mount('#app');
