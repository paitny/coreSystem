<template>
  <el-menu
      :unique-opened="true"
      router
      text-color="#ffff"
      background-color="#001529"
      active-text-color="#ffd04b"
      :default-active="activeMenu"
      :collapse="isCollapse"
  >
    <template v-for="item in menuRoute">
      <template v-if="item.children && item.children.length">
        <el-sub-menu :index="item.path" :key="item.path">
          <template #title>
            <svg-icon :icon="item.icon"></svg-icon>
            <span>{{ item.title }}</span>
          </template>
          <template v-for="childItem in item.children" :key="childItem.path">
            <template v-if="childItem.children && childItem.children.length">
              <el-sub-menu :index="childItem.path" :key="childItem.path">
                <template #title>
                  <svg-icon :icon="childItem.icon"></svg-icon>
                  <span>{{ childItem.title }}</span>
                </template>
                <el-menu-item v-for="grandchildItem in childItem.children" :index="grandchildItem.path" :key="grandchildItem.path">
                  <svg-icon :icon="grandchildItem.icon"></svg-icon>
                  <span>{{ grandchildItem.title }}</span>
                </el-menu-item>
              </el-sub-menu>
            </template>
            <template v-else>
              <el-menu-item :index="childItem.path" :key="childItem.path">
                <svg-icon :icon="childItem.icon"></svg-icon>
                <span>{{ childItem.title }}</span>
              </el-menu-item>
            </template>
          </template>
        </el-sub-menu>
      </template>
      <template v-else>
        <el-menu-item :index="item.path" :key="item.path">
          <svg-icon :icon="item.icon"></svg-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </template>
    </template>
  </el-menu>
</template>

<script setup>
import {useStore} from "vuex";
import {computed} from "vue";
import {useRoute} from "vue-router";

const store = useStore();
const menuRoute = computed(() => store.getters.menuRoute);

const route = useRoute();
const activeMenu = computed(() => route.path);
const isCollapse = computed(() => !store.getters.sidebarOpened);
</script>

<style lang="scss" scoped>
.el-menu {
  border-right: 0 !important;
}
span {
  margin-left: 10px;
}
.el-menu-item:hover {
  outline: 0 !important;
  color: #ffd04b !important;
}
.el-menu .el-menu-item.is-active {
  background: #409EFF;
}
</style>
