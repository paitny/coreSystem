<template>
  <ul class="context-menu-container">
    <li @click="onRefreshClick">刷新</li>
    <li @click="onCloseRightClick">关闭右侧</li>
    <li @click="onCloseOtherClick">关闭其他</li>
  </ul>
</template>

<script setup>
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import {computed,defineProps} from "vue";
const router = useRouter();
const route = useRoute();

const props =  defineProps(["index"]);
const store = useStore();

const tagsViewList = computed(() => store.getters.tagsViewList);
const onRefreshClick = () => {
  router.go(0);
};
const onCloseRightClick = () => {
  // 关闭右侧时 判断 active的高亮元素是否在 右侧
  const activeIndex = tagsViewList.value.findIndex(
      (item) => item.path === route.path
  );

  store.dispatch("app/removeTagsViewList", {
    type: "right",
    index: props.index,
  });

  if (activeIndex > props.index) {
    // 在右侧
    // 高亮应该要变成当前的元素
    router.push(tagsViewList.value[props.index].path);
  }
};
const onCloseOtherClick = () => {
  store.dispatch("app/removeTagsViewList", {
    type: "other",
    index: props.index,
  });
  // 移除其他 必然只剩一个了 跳到此路由去
  router.push(tagsViewList.value[0].path);
};
</script>
<style lang="scss" scoped>
.context-menu-container {
  position: fixed;
  background: #fff;
  z-index: 100001;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
</style>
