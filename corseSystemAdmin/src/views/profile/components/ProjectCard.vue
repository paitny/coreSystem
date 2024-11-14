<template>
  <el-card class="user-container">
    <template #header>
      <div class="header">项目介绍</div>
    </template>
    <div class="user-profile">
      <div class="box-center">
        <img
          :src="
            `${baseURL}${staticURL}${$store.getters.userInfo.photo}`|| getImg('default.jpg')
          "
          class="avatar"
        />
        <div class="user-name">
          {{ $store.getters.userInfo.user }}
        </div>
        <div class="user-role text-muted">
          {{ $store.getters.userInfo.admin ? "管理员" : "普通用户" }}
        </div>
      </div>
    </div>

    <!-- 项目介绍 -->
    <div class="project-bio-section">
      <div class="project-bio-section-header">
        <svg-icon icon="introduce"></svg-icon>
        <span>项目介绍</span>
      </div>
      <div class="project-bio-section-body">
        <div class="text-muted">
          《 vue3 vue-element-admin 实现后台前端综合解决方案 》项目演示
        </div>
      </div>
    </div>
    <!-- 具体的功能介绍 -->
    <div class="project-bio-section">
      <div class="project-bio-section-header">
        <svg-icon icon="reward"></svg-icon>
        <span>项目功能</span>
      </div>
      <div class="project-bio-section-body">
        <div class="progress-item" v-for="item in featureData" :key="item.id">
          <div>{{ item.title }}</div>
          <el-progress :percentage="item.percentage" status="success" />
        </div>
      </div>
    </div>
  </el-card>
</template>
<script setup>
import {defineProps} from "vue";

import {getImg} from "../../../utils/pub-use";


defineProps({
  featureData: {
    type: Array,
  },
});
</script>
<style lang="scss" scoped>
.user-container {
  margin-right: 20px;
  .text-muted {
    font-size: 14px;
    color: #777;
  }

  .user-profile {
    text-align: center;
    .user-name {
      margin-top: 20px;
      font-weight: bold;
    }

    .box-center {
      padding-top: 10px;
      .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
    }

    .user-role {
      padding-top: 10px;
      font-weight: 400;
    }
  }

  .project-bio-section {
    margin-bottom: 36px;
    margin-top: 20px;
    color: #606266;
    span {
      padding-left: 4px;
    }
    .project-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
    .project-bio-section-body {
      .progress-item {
        margin-top: 10px;
        div {
          font-size: 14px;
          margin-bottom: 2px;
        }
      }
    }
  }
}
</style>
