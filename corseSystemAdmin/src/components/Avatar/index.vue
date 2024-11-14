<template>
  <el-dropdown>
    <el-avatar :size="40"  shape="square" :src="`${baseURL}${staticURL}${avatarSrc}`" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="goHome">首页</el-dropdown-item>
        <el-dropdown-item divided @click="handleLoginOut">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import {useRouter} from "vue-router";
import {getAvatar} from "../../hooks/getAvatar";
const router=useRouter()
const goHome=()=>{
  router.push("/")
}
const {avatarSrc,store}= getAvatar()
const handleLoginOut=()=>{
  store.dispatch("user/logoutFn")
}

</script>

<style scoped>

</style>
