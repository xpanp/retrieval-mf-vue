<template>
  <el-image
    class="image-content"
    :zoom-rate="1.2"
    :src="url"
    :initial-index="0"
    :preview-src-list="srcList ? srcList : [url]"
    fit="scale-down"
    loading="lazy"
    hide-on-click-modal
    :style="{
      width: width + 'px',
      height: height + 'px',
    }"
  >
    <template #error>
      <div class="image-slot">
        <el-icon><Picture /></el-icon>
      </div>
    </template>
  </el-image>
</template>

<script setup>
const props = defineProps({
  url: {
    type: String,
  },
  srcList: {
    type: Array,
  },
  width: {
    type: Number,
    default: 210,
  },
  height: {
    type: Number,
    default: 210,
  },
});
</script>

<style lang="scss">
.image-content {
  width: 210px;
  height: 210px;
  background: rgb(245, 247, 250);
  .image-slot{
    display: none;
  }
}
</style>
