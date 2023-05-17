<template>
  <div class="picture-container">
    <el-form :model="formData" ref="formDataRef" @submit.prevent>
      <el-form-item prop="picture">
        <!-- 这里是发表图片位置 -->
        <div class="select-image">
          <CommentImage
            :src="commentImg"
            :srcList="[commentImg]"
            :width="1500"
            :height="400"
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
                'font-size': '40px',
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
    if(!commentImg.value){
      proxy.Message.error("请输入图片")
    }
    // 参数准备完毕：调用接口更新文章
    const params = Object.assign({}, formData.value);
    const result = await proxy.Request({
      url: api.addPic,
      params: params,
    });
    if (!result) {
      return;
    }
      proxy.Message.success("上传成功")
  });
};
</script>
  
<style lang="scss">
.picture-container {
  flex-direction: column;
  position: relative;
  padding: 0 20px;
  width: 100%;
  .el-form-item__content {
    margin-top: 30px;
    justify-content: center;
    flex-direction: column;
  }
  .select-image {
    border: 2px dotted #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfont {
      font-size: 30px;
      cursor: pointer;
    }
  }
  .pic-select {
    margin-top: 30px;
    .upload-demo {
      .el-upload--text {
        .el-upload__text {
          font-size: 20px;
          color: var(--text);
        }
      }
    }
  }
}
</style>
  