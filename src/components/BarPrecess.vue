<template>
  <div class="demo-progress">
    <span class="message">{{ tip }}</span>
    <el-progress
      :type="bartype"
      :percentage="percentage"
      :status="status"
      :width="250"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  tip: {
    type: String,
    default: "后台正在处理中...",
  },
  bartype: {
    type: String,
    default: "circle",
  },
  percentage: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
  },
});
</script>

<style lang="scss" scoped>
.demo-progress {
  .message {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    color: rgb(118, 118, 118);
  }
  .el-progress--circle {
    margin: 10px auto;
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
  }
}
</style>
