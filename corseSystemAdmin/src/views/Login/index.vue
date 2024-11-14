<template>
  <div class="login-container">
    <router-view></router-view>
    <BackgroundParticles></BackgroundParticles>
    <div class="loginFrom">
      <div class="loginSwiper">

      </div>
      <el-form
          class="login-form"
          :model="loginForm"
          :rules="rules"
          ref="loginFormRef"
          @keydown.enter="handleSubmit"
      >
        <div class="title-container">
          <h4 class="title">芯系小助手管理系统</h4>
        </div>

        <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon="user"></svg-icon>
        </span>
          <el-input v-model="loginForm.user" placeholder="请输入学号"></el-input>
        </el-form-item>

        <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon="password"></svg-icon>
        </span>
          <el-input v-model="loginForm.pass" :type="typeInput" placeholder="初始密码为学号后六位"></el-input>
          <span class="show-pwd" @click="changeShowEye">
          <svg-icon :icon="eyeIcon"></svg-icon>
        </span>
        </el-form-item>
        <!--        验证码-->
        <div style="display: flex;width: 100% ;justify-content: space-between ;align-items: center">

          <el-form-item prop="num">
            <span class="svg-container" v-if="isShowSvg">

               <svg-icon icon="code"></svg-icon>
             </span>
            <span class="svg-container" v-else>
               <svg-icon icon="errCode"></svg-icon>
             </span>
            <el-input v-model="loginForm.num"></el-input>

          </el-form-item>
          <div ref="svg" style="height: 56px;cursor: pointer" @click="freshSvg"></div>
        </div>
        <div class="forgetPass">忘记密码</div>
        <el-button type="primary" color="#626aef" @click="handleSubmit">登录</el-button>
      </el-form>
    </div>


    <Bgvideo></Bgvideo>
  </div>

</template>

<script setup>
import BackgroundParticles from "../../components/BackgroundParticles/index.vue";
import Bgvideo from "../../components/Bgvideo/index.vue";

import {validatePassword} from "./rules";
import {computed, onMounted, ref} from "vue";
import {ElMessage} from 'element-plus'
import {useStore} from 'vuex'
import {checkSvg} from '../../api/login'

const loginForm = ref({
  user: "",
  pass: "",
  num: ''
});
const isShoeEye = ref(false)
const typeInput = computed(() => isShoeEye.value ? "text" : "password")
const eyeIcon = computed(() => isShoeEye.value ? "eye" : "eye-open")
const isShowSvg = ref(false)
const changeShowEye = () => {
  isShoeEye.value = !isShoeEye.value
}
const store = useStore()
const svgVal = ref()
const loginFormRef = ref(null)
const svg = ref()
const rules = ref({
  user: [{required: true, message: "账户名是必填项", trigger: "blur"}],
  pass: [
    {
      // 自定义校验规则
      validator: validatePassword,
      trigger: "blur",
    },
  ],
  num: [{required: true, message: "验证码是必填项", trigger: "blur"},
    {
      validator(rule, value, cb) {
        if (value.toLowerCase() !== svgVal.value) {

          cb(new Error('验证码不正确'))
          isShowSvg.value = false
        } else {
          cb()
          isShowSvg.value = true
        }
      }
    }],
});


const handleSubmit = () => {
  loginFormRef.value.validate(async (v) => {
    if (v) {
      //提交登录
      await store.dispatch("user/loginFn", loginForm.value)

    } else {
      ElMessage({
        showClose: true,
        message: '登录失败,验证不通过',
        type: 'error',
        grouping: true,
      })
    }
  })
}
const getSvg = () => {
  checkSvg().then(({data}) => {
    svg.value.innerHTML = data.data
    svgVal.value = data.text.toLowerCase()
  })
}
const freshSvg = () => {
  getSvg()
}
onMounted(() => {
  getSvg()
})
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$cursor: #fff;
.login-container {
  min-height: 100%;
  width: 100%;
  height: 450px;
  overflow: hidden;
  user-select: none;

  .loginFrom {
    width: 820px;
    height: 420px;
    margin: 0 auto;
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #fff;
    border-radius: 10px;
    background-size: cover;

    .loginSwiper {
      width: 400px;
      height: 420px;
      border-radius: 10px 0 0 0;
      border-right: 1px solid #fff;
      padding: 0 10px 0 10px;
      background: url("https://wypty.cn/static/file/material/rabbit.png") no-repeat;
      background-size: 100% 80%;
    }

    .login-form {
      width: 350px;
      max-width: 100%;
      margin: auto;
      overflow: hidden;

      :deep(.el-button) {
        width: 100%;

        span {
          color: #fff;
        }
      }

      :deep(.el-form-item) {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
      }

      :deep(.el-form-item:nth-child(4)) {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
        width: 150px;
        height: 47px;
      }

      :deep(.el-input) {
        // 修改element样式
        display: inline-block;
        height: 47px;
        width: 85%;

        div {
          width: 100%;
          background: transparent;
          border: 0;
          box-shadow: 0 0 0 0;

          input {
            border: 0px;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
          }
        }
      }
    }
  }


  .svg-container {
    padding: 6px 5px 6px 10px;
    color: $dark_gray;
    vertical-align: middle;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 23px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .forgetPass {
    margin-bottom: 20px;
    color: white;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}


</style>





