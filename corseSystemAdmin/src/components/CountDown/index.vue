<template>
  <div class="count-wrapper">
    <slot class="icon"></slot>
    <h2>{{ msg }}</h2>
    <div class="count-txt">
      页面将在{{ time }}秒后跳转至 <span>{{ targetRoute.title }}</span>
    </div>
    <div class="return" @click="immediateReturn">立即跳转</div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import {reactive, ref,defineProps} from "vue";
const router = useRouter();

const props =  defineProps({
  msg: {
    type: String,
    required: true,
  },
  isLogin: {
    type: Boolean,
    required: true,
  },
});
const time = ref(5);
const targetRoute = props.isLogin
  ? {
      path: "/login",
      title: "首页",
    }
  : {
      path: "/login",
      title: "登录页面",

    };

let timer = null;
const countFn = (time) => {
  if (time.value <= 0) {
    // 倒计时完成
    console.log(targetRoute.path)
    router.replace(targetRoute.path);
  } else {
    timer = setTimeout(() => {
      time.value--;
      countFn(time);
    }, 1000);
  }
};

countFn(time);

const immediateReturn = () => {
  clearTimeout(timer);
  router.replace(targetRoute.path);
};
</script>
<style lang="scss" scoped>
.count-wrapper {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 300px;
  transform: translate(-50%, -50%);
  text-align: center;
  :deep(.el-icon) {
    font-size: 150px;
  }
  h2 {
    margin-top: 20px;
    font-size: 26px;
  }
  .count-txt {
    margin-top: 20px;
    span {
      color: #000;
    }
  }
  .return {
    width: 100px;
    height: 40px;
    background-color: #304156;
    border-radius: 20px;
    margin: 20px auto;
    line-height: 40px;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
