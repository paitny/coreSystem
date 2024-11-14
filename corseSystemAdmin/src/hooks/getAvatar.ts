import { computed } from "vue";
import { useStore } from "vuex";
const imgUrl = new URL(`../assets/img/default.jpg`, import.meta.url).href

export const getAvatar = () => {
    const store = useStore();
    // 登出状态 给default.gif作为默认图
    const avatarSrc = computed(() => store.getters.userInfo.photo || imgUrl);

    return {store,avatarSrc}

}
