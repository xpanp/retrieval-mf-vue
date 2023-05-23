<template>
  <div class="contain-panel">
    <el-row :gutter="20">
      <el-col :span="6"
        ><div class="container">
          <el-form
            :model="formData"
            :rules="rules"
            ref="formDataRef"
            label-width="60px"
          >
            <!-- 模型选择 -->
            <el-form-item label="算法" prop="algo">
              <el-select v-model="formData.algo" placeholder="请选择模型">
                <el-option label="fusion" value="fusion" />
                <el-option label="vgg" value="vgg" />
                <el-option label="vit" value="vit" />
                <el-option label="color" value="color" />
                <el-option label="lbp" value="lbp" />
                <el-option label="glcm" value="glcm" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <div class="splitInfo">
                <div class="first-line">
                  <el-tag class="ml-2" type="success">vit* 0.4</el-tag>
                  <el-tag>vgg* 0.3</el-tag>
                  <el-tag class="ml-2" type="info">color* 0.1</el-tag>
                </div>
                <div class="second-line">
                  <el-tag class="ml-2" type="warning">lbp* 0.1</el-tag>
                  <el-tag class="ml-2" type="danger">glcm* 0.1</el-tag>
                </div>
              </div>
            </el-form-item>
            <el-form-item prop="file">
              <div class="pic-select">
                <el-upload
                  name="file"
                  :show-file-list="false"
                  accept=".png,.PNG,.JPG,.jpg,.jpeg,.JPEG,.GIF,.gif,.bmp,.BMP"
                  :http-request="selectImg"
                >
                  <div class="btn-option">
                    <el-button v-if="!commentImg" type="danger" :icon="Plus"
                      >选择图片</el-button
                    >
                    <el-button
                      v-if="commentImg"
                      v-debounce="{
                        fn: removeCommentImg,
                        event: 'click',
                        delay: 200,
                      }"
                      type="danger"
                      :icon="Delete"
                      >重选图片</el-button
                    >
                  </div>
                </el-upload>
              </div>
              <div class="cropper-panel">
                <div class="before"></div>

                <div class="image-source">
                  <div class="img-container">
                    <!-- 原始图片 -->
                    <img
                      :src="commentImg"
                      ref="image"
                      alt=""
                      :style="{ width: '250px', height: '250px' }"
                    />
                    <el-button
                      :icon="Edit"
                      size="large"
                      v-debounce="{ fn: sureSave, event: 'click', delay: 200 }"
                      type="danger"
                    >
                      剪裁</el-button
                    >
                  </div>
                  <!-- 剪裁后图片 -->
                  <div class="afterCropper">
                    <img :src="afterImg" alt="" />
                    <el-button
                      v-debounce="{
                        fn: searchHandle,
                        event: 'click',
                        delay: 200,
                      }"
                      type="primary"
                      :style="{ width: '250px' }"
                      >搜索</el-button
                    >
                  </div>
                </div>
              </div>
            </el-form-item>

            
          </el-form>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="image-panel" v-if="searchList.length > 0">
          <el-card
            v-for="item in searchList"
            :key="item.id"
            class="imgage-result"
            :body-style="{ padding: '3px' }"
          >
            <el-image
              v-lazyLoad
              class="scale-pic"
              :zoom-rate="1.2"
              :src="item.filepath_thumbnail"
              fit="fill"
              loading="lazy"
              hide-on-click-modal
              :preview-teleported="true"
              :initial-index="0"
              :preview-src-list="[item.filepath_thumbnail]"
            ></el-image>
            <div class="image-info">
              <span class="filename">
                {{ item.filename }}
              </span>
              <span
                :class="['iconfont', item.like ? 'active' : '']"
                @click="handleLike(item, 1)"
                >&#xe869;</span
              >
              <span
                :class="['iconfont', item.unlike ? 'active' : '']"
                @click="handleLike(item, 0)"
                >&#xe86a;</span
              >
            </div>
          </el-card>
        </div>
        <div class="nodata-panel" v-else>
          <span class="no-data">暂无内容</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

import { Edit, Delete, Plus } from "@element-plus/icons-vue";
const { proxy } = getCurrentInstance();
const formData = ref({ algo: "fusion" });
const formDataRef = ref();

const rules = {
  algo: [{ required: true, message: "请选择算法", trigger: "blur" }],
};
const api = {
  search: "/api/search",
};
// 图片上传
const commentImg = ref(null);
const selectImg = (file) => {
  file = file.file;
  let img = new FileReader();
  img.readAsDataURL(file);
  img.onload = ({ target }) => {
    let imgData = target.result;
    myCropper.replace(imgData, false);
    commentImg.value = imgData;
    // 无剪裁图片按照原图片搜索
    formData.value.file = dataURLtoFile(commentImg.value, "crop.jpg");
  };
};
// 叉掉图片
const removeCommentImg = () => {
  formData.value.file = null;
  commentImg.value = null;
  afterImg.value = null;
};
// 搜索
const searchList = ref([]);
const searchHandle = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    if (!myCropper.getCroppedCanvas()) {
      proxy.Message.error("请选择图片");
      return;
    }
    const params = Object.assign({}, formData.value);
    params.result_num = 12;
    const result = await proxy.Request({
      url: api.search,
      params: params,
    });
    if (!result) {
      return;
    }
    searchList.value = result.data.result;
    searchList.value.forEach((item) => {
      item.like = false;
      item.unlike = false;
    });
  });
};
// 反馈
const handleLike = (value, type) => {
  if (type == 1) {
    value.like = !value.like;
    value.unlike = false;
  } else {
    value.unlike = !value.unlike;
    value.like = false;
  }
};
// 剪裁图片

const afterImg = ref("");
onMounted(() => {
  init();
});
var myCropper = null;
const init = () => {
  myCropper = new Cropper(proxy.$refs.image, {
    aspectRatio: 0 / 0, // 裁剪框的宽高比,默认NAN,可以随意改变裁剪框的宽高比
    viewMode: 2, // 0,1,2,3
    dragMode: "crop", // 'crop': 可以产生一个新的裁剪框 'move': 只可以移动 'none': 什么也不处理
    // preview:".small",  // 添加额外的元素(容器)以供预览
    responsive: false, //在调整窗口大小的时候重新渲染cropper,默认为true
    restore: true, // 调整窗口大小后恢复裁剪的区域。
    checkCrossOrigin: true, //检查当前图像是否为跨域图像,默认为true
    modal: false, // 显示图片上方的黑色模态并在裁剪框下面，默认为true
    guides: true, // 显示在裁剪框里面的虚线，默认为true
    center: true, // 裁剪框在图片正中心，默认为true
    highlight: false, // 在裁剪框上方显示白色的区域,默认为true
    background: false, // 显示容器的网格背景(即马赛克背景)，默认为true，若为false，这不显示
    autoCrop: false, // 当初始化时，显示裁剪框，改成false裁剪框消失需要你重绘裁剪区域，默认为true
    autoCropArea: 1, // 定义自动裁剪面积大小(百分比)和图片进行对比，默认为0.8
    movable: true, // 是否允许可以移动后面的图片，默认为true（但是如果dragMode为crop，由于和重绘裁剪框冲突，所以移动图片会失效）
    rotatable: true, // 是否允许旋转图像,默认为true
    scalable: false, // 是否允许缩放图像，默认为true
    zoomable: false, // 是否允许放大图像，默认为true
    zoomOnTouch: false, // 是否可以通过拖动触摸来放大图像，默认为true
    wheelZoomRatio: 0.1, // 用鼠标移动图像时，定义缩放比例,默认0.1
    cropBoxMovable: true, // 是否通过拖拽来移动剪裁框，默认为true
    cropBoxResizable: true, // 是否通过拖动来调整剪裁框的大小，默认为true
    toggleDragModeOnDblclick: true, // 当点击两次时可以在“crop”和“move”之间切换拖拽模式，默认为true
  });
};
// 剪裁函数
const sureSave = () => {
  if (!myCropper.getCroppedCanvas()) {
    proxy.Message.error("请选择剪裁图片！！");
    return;
  }
  afterImg.value = myCropper
    .getCroppedCanvas({
      imageSmoothingQuality: "high",
    })
    .toDataURL("image/jpg");
  // 把base64转为File，参数为File
  if (afterImg.value) {
    // 有剪裁图片按照剪裁图片搜
    formData.value.file = dataURLtoFile(afterImg.value, "crop.jpg");
  }
};

// 将base64转换为文件
const dataURLtoFile = (dataurl, filename) => {
  let arr = dataurl.split(",");
  let mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let len = bstr.length;
  let u8arr = new Uint8Array(len);
  while (len--) {
    u8arr[len] = bstr.charCodeAt(len);
  }
  return new File([u8arr], filename, { type: mime });
};
</script>

<style lang="scss">
.contain-panel {
  box-sizing: border-box;
  overflow: hidden;

  .container {
    .cropper-panel {
      display: flex;
      flex-direction: column;
      .before {
        max-width: 250px;
        max-height: 250px;
      }
      .image-source {
        .img-container {
          display: flex;
          flex-direction: column;
          .cropper-container {
             height:250px !important; 
          }
          .cropper-crop {
              height: 250px;
              display: flex;
              align-items:center !important;
            }

          img {
            max-width: 250px;
            max-height: 250px;
            border-top: none;
          }
        }
        .afterCropper {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-top: 20px;
          
          max-width: 250px;
          img {
            max-width: 250px;
            max-height: 250px;
            margin-bottom: 20px;
          }
        }
      }
      .pic-select {
        height: 0;
        :deep(.btn-option) {
          margin-bottom: 5px;
          display: flex;
          flex-direction: column;
        }
      }
    }

    padding: 10px 5px;
    .splitInfo {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      flex-direction: column;
      width: 100%;
      .first-line {
        .el-tag {
          margin-right: 2px;
        }
      }
      .second-line {
        .el-tag {
          margin-right: 8px;
        }
      }
    }

    .el-form-item__content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      width: 100%;
    }
  }

  .image-panel {
    width: 100%;
    margin-top: 20px;
    overflow-y: scroll;
    display: flex;
    justify-content: space-around;
    height: calc(100vh - 110px);
    flex-wrap: wrap;
    .imgage-result {
      padding: 3px 10px;
      .image-info {
        width: 100%;
        line-height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        .iconfont {
          cursor: pointer;
          margin: 0 10px;
          font-size: 18px;
        }
        .active {
          color: var(--link);
        }
      }
    }

    .el-card__body {
      display: flex;
      flex-direction: column;
      font-size: 16px;
      font-weight: 200px;
      color: rgb(31, 29, 29);
      align-items: center;
    }
  }
  .nodata-panel {
    display: flex;
    height: 300px;
    justify-content: center;
    align-items: center;
    width: 100%;
    .no-data {
      font-size: 30px;
      color: rgb(144, 141, 141);
    }
  }

  .cropper-content {
    .cropper {
      width: auto;
      height: 400px;
    }
  }
}
</style>>