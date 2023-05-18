<template>
  <div class="contain-panel">
    <el-row :gutter="20">
      <el-col :span="6"
        ><div class="container">
          <el-form
            :model="formData"
            :rules="rules"
            ref="formDataRef"
            label-width="80px"
          >
            <!-- 模型选择 -->
            <el-form-item label="算法选择" prop="algo">
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
              <div class="cropper-panel">
                <div class="before"></div>
                <el-button
                  :icon="Edit"
                  size="large"
                  @click="sureSave"
                  type="danger"

                >
                  剪裁</el-button
                >
                <div class="image-source">
                  <div class="img-container">
                    <!-- 原始图片 -->
                    <img
                      :src="commentImg"
                      ref="image"
                      alt=""
                      :style="{ width: '250px', height: '250px' }"
                    />
                  </div>
                  <!-- 剪裁后图片 -->
                  <div class="afterCropper">
                    <img :src="afterImg" alt="" />
                  </div>
                </div>
                <div class="pic-select">
                  <el-upload
                    name="file"
                    :show-file-list="false"
                    accept=".png,.PNG,.JPG,.jpg,.jpeg,.JPEG,.GIF,.gif,.bmp,.BMP"
                    :http-request="selectImg"
                  >
                    <span v-if="!commentImg" class="iconfont icon-image"></span>
                  </el-upload>
                </div>
                <el-button v-if="commentImg" type="danger" :icon="Delete" @click="removeCommentImg"/>
              </div>

            </el-form-item>
            <el-form-item>
              
              <el-button
                @click="searchHandle"
                type="primary"
                :style="{ width: '250px' }"
                >搜索</el-button
              >
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

import { Edit,Delete } from "@element-plus/icons-vue";

const { proxy } = getCurrentInstance();
const formData = ref({algo:'fusion'});
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
    // afterImg.value = imgData
    myCropper.replace(imgData, false);
    commentImg.value = imgData;
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
    if(!myCropper.getCroppedCanvas()){
      proxy.Message.error("请选择图片")
      return
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
    viewMode: 0,
    dragMode: "none",
    initialAspectRatio: 1,
    aspectRatio: 0 / 0,
    preview: ".before",
    background: false,
    autoCropArea: 0.6,
    zoomOnWheel: false,
    resizable: true,
    zoomable: false,
    mouseWheelZoom: false,
  });
};
// 剪裁函数
const sureSave = () => {
  if (!myCropper.getCroppedCanvas()) {
    proxy.Message.error("请选择剪裁图片！！");
    return
  }
  afterImg.value = myCropper
    .getCroppedCanvas({
      imageSmoothingQuality: "high",
    })
    .toDataURL("image/jpg");
    // 把base64转为File，参数为File
  formData.value.file = dataURLtoFile(afterImg.value, "crop.jpg");
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
  padding-top: 10px;

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
          img {
            max-width: 250px;
            max-height: 250px;
            border-top: none;
          }
        }
        .afterCropper {
          margin-top: 5px;
          img {
            max-width: 250px;
            max-height: 250px;
          }
        }
      }
      .pic-select {
        height: 0;
        .icon-image {
          position: absolute;
          bottom: -5px;
          left: 115px;
          font-size: 30px;
          color: var(--link);
          cursor: pointer;
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
  }

  .image-panel {
    width: 100%;
    height: 700px;
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