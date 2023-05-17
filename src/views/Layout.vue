<template>
    <div class="common-layout">
      <el-container>
        <el-aside width="auto">
          <common-aside></common-aside>
        </el-aside>
        <el-container>
          <el-header>
            <common-header></common-header>
          </el-header>
          <el-main>
            <!-- 路由出口 -->
            <!-- 路由匹配到的组件将渲染在这里 -->
              <router-view></router-view>         
          </el-main>
        </el-container>
      </el-container>
    </div>
    </template>
    
    <script>
    import CommonAside from '@/components/CommonAside.vue'
    import CommonHeader from '@/components/CommonHeader.vue';
    import { defineComponent } from 'vue';
    export default defineComponent({
      components:{
        CommonAside,
        CommonHeader
      }
    })
    </script>
    
    <style scoped>
      .el-header, .el-main{
        padding: 0;
      }
    </style>