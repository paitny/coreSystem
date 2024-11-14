<template>


<div></div>



</template>

<script setup>
import {defineProps} from "vue";
defineProps(['route'])

</script>

<style lang="scss" scoped>
span {
  margin-left: 10px;
}
.el-menu-item:hover{
  outline: 0 !important;
  color: #ffd04b !important;
}
.el-menu .el-menu-item.is-active{
  background: #409EFF;
}
</style>
