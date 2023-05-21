<template>
  <div id="container">
    <div class="main">
      <el-form :model="formData" ref="formDataRef" :rules="rules" class="form">
        <div class="title-wrapper">
          <span class="title">用户登录</span>
        </div>
        <div class="info-wrapper">
          <el-form-item prop="account" style="width: 220px; margin-top: 30px">
            <el-input
              v-model="formData.account"
              prefix-icon="UserFilled"
              placeholder="请输入登录邮箱"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="passwd" style="margin-top: 15px">
            <el-input
              v-model="formData.passwd"
              prefix-icon="Lock"
              placeholder="请输入密码"
              show-password
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="login-btn" @click="toLogin"> 登录 </el-button>
          </el-form-item>
          <el-form-item>
            <router-link :to="{ path: '/user/register' }" class="register-btn">
              注册</router-link
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";

import { useRoute, useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const formData = ref({});
const formDataRef = ref();
const api = {
  login: "/user/login",
};
const rules = {
  account: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { validator: proxy.Verify.email, message: "请输入正确的邮箱",trigger: "blur" },
  ],
  passwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const toLogin = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    const params = Object.assign({}, formData.value);
    params.type = 100;

    let result = await proxy.Request({
      url: api.login,
      params: params,
      showError: false,
      //错误的回调，返回:错误信息
      errorCallback: (response) => {
        ElMessageBox.alert(response.msg, "错误", {
          "show-close": false,
          callback: (action) => {
            proxy.Message.error("用户名或密码错误");
          },
        });
      },
    });

    if (!result) {
      return;
    }
    proxy.VueCookies.set("token", result.data.token);
    if (result.code == 0) {
      proxy.Message.success("登录成功");
    }
    router.push({ path: "/home" });
  });
};
</script>

<style lang="scss" scoped>
#container {
  width: 100%;
  height: 100vh;
  background: rgb(255, 255, 255);
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(../assets/background.png) no-repeat 5px 5px;
  background-position: 20% 35%;
  .main {
    position: absolute;
    right: 300px;
    width: 360px;
    height: 420px;
    box-shadow: 0 5px 15px rgba(99, 99, 99, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    .form {
      height: 90%;
      width: 260px;
      margin-top: 40px;
      .title-wrapper {
        width: 100%;
        height: 40px;
        margin-top: 20px;
        line-height: 40px;
        text-align: center;
        .title {
          color: black;
          font-weight: bold;
          font-size: 30px;
        }
      }
      .info-wrapper {
        width: 220px;
        height: 40px;
        margin: 30px auto 0;
        line-height: 40px;
        text-align: center;
        .login-btn {
          margin-top: 30px;
          color: black;
          border-radius: 30px;
          width: 100%;
          height: 40px;
          background: linear-gradient(90deg, #d4e6f7f4, #7aa0f2);
        }
        .register-btn {
          color: var(--link);
          width: 100%;
          height: 40px;
        }
      }
    }
  }
}
</style>
