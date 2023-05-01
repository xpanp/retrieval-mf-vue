<template>
  <div class="picture-container">
    <el-form :model="formData" :rules="rules" ref="formDataRef" @submit.prevent>
      <el-form-item prop="picture">
        <!-- 这里是发表图片位置 -->
        <div class="select-image">
          <CommentImage
            :src="commentImg"
            :srcList="[commentImg]"
            :width="800"
          ></CommentImage>
          <span
            v-if="commentImg"
            class="iconfont icon-remove"
            @click="removeCommentImg"
          ></span>
        </div>
        <div class="pic-select">
          <el-upload
            class="upload-demo"
            name="file"
            :show-file-list="false"
            accept=".png,.PNG,.JPG,.jpg,.jpeg,.JPEG,.bmp,.BMP"
            :http-request="selectImg"
          >
            <el-icon
              v-if="!commentImg"
              class="el-icon--upload"
              :style="{
                'font-size': '20px',
                color: `var(--link)`,
                'margin-right': '6px',
              }"
              ><upload-filled
            /></el-icon>
            <div v-if="!commentImg" class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                jpg/png files with a size less than 20MB
              </div>
            </template>
            <!-- <span v-if="!commentImg" class="iconfont icon-image"></span> -->
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="op-btn">
          <el-button type="primary" @click="postHandle" size="large"
            >上传</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
  
<script setup>
import { ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  addPic: "/api/add_pic",
};
const formData = ref({});
const formDataRef = ref();
const rules = {
  title: [{ required: true, message: "请选择图片" }],
};

// 提交信息
// 图片上传
const commentImg = ref(null);

const selectImg = (file) => {
  file = file.file;
  let img = new FileReader();
  img.readAsDataURL(file);
  img.onload = ({ target }) => {
    let imgData = target.result;
    commentImg.value = imgData;
    formData.value.file = file;
  };
};
// 叉掉图片
const removeCommentImg = () => {
  formData.value.file = null;
  commentImg.value = null;
};
// 图片上传服务器
const postHandle = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) return;
    // 参数准备完毕：调用接口更新文章
    const params = Object.assign({}, formData.value);
    const result = await proxy.Request({
      url: api.addPic,
      params: params,
    });
    if (!result) {
      return;
    }
    proxy.Message.success("上传成功");
  });
};
</script>
  
<style lang="scss">
.picture-container {
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 0 20px;
  width: 100%;
  .el-form-item__content {
    justify-content: center;
    flex-direction: column;
  }
  .select-image {
    border: 2px dotted #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pic-select {
    .upload-demo {
      .el-upload--text {
        .el-upload__text {
          font-size: 16px;
          color: var(--text);
        }
      }
    }
  }
}
</style>
  