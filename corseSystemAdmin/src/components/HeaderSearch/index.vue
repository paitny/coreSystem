<template>
  <div class="header-search">
    <svg-icon
        icon="search"
        class="search-icon"
        @click.stop="onShowClick"
        id="guide-search"
    ></svg-icon>
    <el-select
        v-model="search"
        filterable
        placeholder="搜索"
        default-first-option
        remote
        class="header-search-select"
        :class="{show:ifShow}"
        :remote-method="querySearch"
        @change="chooseOption"
        ref="headerSearchSelectRef"
    >
      <el-option
          v-for="option in searchOptions"
          :key="option.refIndex"
          :value="option.item"
          :label="option.item.titles.join('>')"
      ></el-option>
    </el-select>

  </div>
</template>

<script setup>
import {ref, watch} from "vue";
import getRoutePool from '@/assets/ts/handleData'
import Fuse from 'fuse.js'
import {useRouter} from "vue-router";

const router = useRouter()
const search = ref(null)
const ifShow = ref(false)

const searchOptions = ref([]);
const headerSearchSelectRef = ref(null)
const onShowClick = () => {
  return ifShow.value = !ifShow.value

}
const searchPool = getRoutePool()

const fuse = new Fuse(searchPool, {
  shouldSort: true,
  minMatchCharLength: 1,
  keys: [
    {
      name: "title",
      weight: 0.7
    },
    {
      name: "path",
      weight: 0.3
    }
  ]
})
// 当选中某项时
const chooseOption = (val) => {
  onClose()
  router.push(val.path);
};
const querySearch = (query) => {

  searchOptions.value = fuse.search(query)
}
const onClose = () => {
  ifShow.value = false
  searchOptions.value = []
  search.value = null
}
watch(ifShow, (newShow) => {
  if (newShow) {
    document.addEventListener("click", onClose);
    // 打开
    headerSearchSelectRef.value.focus();
  } else {
    // 关闭
    onClose();
    document.removeEventListener("click", onClose);
  }
});
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    &.show {
      width: 210px;
      margin-left: 10px;
    }

    :deep(.el-input__wrapper) {
      box-shadow: none !important;

      .el-input__inner {
        border-bottom: 1px solid #d9d9d9;
      }
    }
  }
}
</style>
