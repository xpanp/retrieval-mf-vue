<template>
  <div id="container">
    <div class="main">
      <el-form :model="formData" ref="formDataRef" :rules="rules" class="form">
        <div class="title-wrapper">
          <span class="title">用户注册</span>
        </div>
        <div class="info-wrapper">
          <el-form-item prop="account" style="width: 220px; margin-top: 30px">
            <el-input
              v-model="formData.account"
              prefix-icon="UserFilled"
              placeholder="请输入注册邮箱"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="nickname" style="width: 220px; margin-top: 15px">
            <el-input
              v-model="formData.nickname"
              prefix-icon="UserFilled"
              placeholder="请输入昵称"
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
          <el-form-item prop="repasswd" style="margin-top: 15px">
            <el-input
              v-model="formData.repasswd"
              prefix-icon="Key"
              placeholder="请确认密码"
              show-password
            >
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button class="register-btn" @click="toRegister">
              注册
            </el-button>
          </el-form-item>

          <el-form-item style="text-align: center; color: white">
            <el-button class="back-btn" @click="toBack" text link>
              返回
            </el-button>
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
// 接口
const api = {
  toRegister: "/api/user/register",
};
// 检查两次密码
const checkRepassword = (rule, value, callback) => {
  if (value !== formData.value.passwd) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};
const rules = {
  account: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      validator: proxy.Verify.email,
      message: "请输入正确的邮箱",
      trigger: "blur",
    },
  ],
  nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  passwd: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      validator: proxy.Verify.password,
      message: "至少6-22位",
      trigger: "blur",
    },
  ],
  repasswd: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    {
      validator: checkRepassword,
      message: "两次输入密码不一致",
      trigger: "blur",
    },
  ],
};
const toRegister = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    const params = Object.assign({}, formData.value);
    params.type = 100;

    let result = await proxy.Request({
      url: api.toRegister,
      params: params,
    });
    if (!result) {
      return;
    }
    if (result.code == 0) {
      proxy.Message.success("注册成功，请登录");
    }
    router.push({ path: "/user/login" });
  });
};

// 重置表单
const resetForm = () => {
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = {};
  });
};
const toBack = () => {
  router.push({ path: "/user/login" });
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
    right: 350px;
    width: 360px;
    height: 420px;
    box-shadow: 0 5px 15px rgba(99, 99, 99, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    .form {
      height: 100%;
      width: 260px;

      .title-wrapper {
        width: 100%;
        height: 40px;
        margin-top: 15px;
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
        .register-btn {
          margin-top: 30px;
          color: black;
          border-radius: 30px;
          width: 100%;
          height: 40px;
          background: linear-gradient(90deg, #d4e6f7f4, #7aa0f2);
        }
        .back-btn {
          margin-top: 10px;
          color: black;
          width: 100%;
          text-align: center;
        }
      }
    }
  }
}
</style>
