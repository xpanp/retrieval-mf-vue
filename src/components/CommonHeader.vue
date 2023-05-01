<template>
  <el-header @back="onBack">
    <div class="container">
      <span class="title"> 图像检索系统 </span>
      <div class="userinfo">
        <el-dropdown class="avatar-info">
          <el-avatar
            :size="32"
            class="avatar"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item @click="loginOut">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const onBack = () => {
  router.go(-1);
};
// 退出
const loginOut = () => {
  proxy.VueCookies.remove("token");
  router.push({ path: "/user/login" });
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #545c64;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 10px 20px 10px 5px;
  justify-content: space-between;
  border-bottom: 1px solid #bbb;
  .title {
    font-size: 18px;
    padding-left: 5px;
  }
  .userinfo {
    .avatar-info {
      .avatar {
        .img {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>
