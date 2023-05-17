<template>
  <div class="container">
    <el-aside>
      <el-menu
        class="el-menu-vertical-demo"
        :default-active="route.path"
        active-text-color="#ffd04b"
        background-color="#545c64"
        text-color="#fff"
        router
      >
        <el-menu-item index="/home">
          <template #title>
            <el-icon><Search /></el-icon>
            图像检索
          </template>
        </el-menu-item>
        <el-menu-item index="/uploadfile">
          <el-icon><UploadFilled /></el-icon>
          文件上传
        </el-menu-item>
        <el-menu-item index="/batchupload">
          <el-icon><UploadFilled /></el-icon>
          批量上传
        </el-menu-item>
      </el-menu>
    </el-aside>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
</script>

<style lang="scss" scoped>
.container {
  .el-menu {
    width: 150px;
    height: calc(100vh);
    overflow: hidden;
    border-right: none;
    a {
      color: #fff;
      font-size: 18px;
    }
    .el-menu-item{
      font-size: 18px;
    }
  }
}
</style>