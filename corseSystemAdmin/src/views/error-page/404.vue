<template>
  <div class="">
    <CountDown
        msg="您访问的页面不存在"
        :isLogin="!!$store.getters.userInfo.user"
    >
      <el-icon><WarningFilled /></el-icon>
    </CountDown>
  </div>
</template>

<script setup>
import CountDown from "../../components/CountDown/index.vue";
import { WarningFilled } from "@element-plus/icons-vue";
</script>

<style lang="scss" scoped></style>
