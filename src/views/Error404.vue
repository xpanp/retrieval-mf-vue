<template>
  <div class="error">
    <div class="info">404</div>
    <div>
        <router-link to="/" class="a-link">返回首页</router-link>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.error{
    text-align: center;
    padding-top: 200px;
    .info{
        font-size: 100px;
        color: rgb(52, 187, 241);
    }
}
</style>
