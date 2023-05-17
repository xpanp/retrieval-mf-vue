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
              <el-select
                v-model="formData.algo"
                placeholder="请选择模型"
                :style="{ width: '350px' }"
              >
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
            <el-form-item prop="picture">
              <div class="insert-img">
                <!-- 这里是发表图片位置 -->
                <div class="comment-image" ref="toImage">
                  <CommentImage
                    :src="commentImg"
                    :srcList="[commentImg]"
                    :width="350"
                    :height="350"
                  ></CommentImage>
                  <span
                    v-if="commentImg"
                    class="iconfont icon-remove"
                    @click="removeCommentImg"
                  ></span>
                </div>
                <div class="pic-select">
                  <!-- 图片上传 -->
                  <!-- :http-request="selectImg"
                    :on-change="changeUpload" -->
                  <el-upload
                    name="file"
                    :show-file-list="false"
                    accept=".png,.PNG,.JPG,.jpg,.jpeg,.JPEG,.GIF,.gif,.bmp,.BMP"
                    :http-request="selectImg"
                  >
                    <span v-if="!commentImg" class="iconfont icon-image"></span>
                  </el-upload>
                </div>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button
                @click="searchHandle"
                type="primary"
                :style="{ width: '350px' }"
                >搜索</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="1"> </el-col>
      <el-col :span="17">
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
    <cropperDlg ref="cropperDlg" @cropperImg="cropperImg"></cropperDlg>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, nextTick, reactive } from "vue";
import cropperDlg from "./cropper.vue";
const { proxy } = getCurrentInstance();
const formData = ref({});
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
    commentImg.value = imgData;
    formData.value.file = file;
  };
};
// 叉掉图片
const removeCommentImg = () => {
  formData.value.file = null;
  commentImg.value = null;
};
// 搜索
const searchList = ref([]);
const searchHandle = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
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

const handleLike = (value, type) => {
  if (type == 1) {
    value.like = !value.like;
    value.unlike = false;
  } else {
    value.unlike = !value.unlike;
    value.like = false;
  }
  console.log( internalInstance.ctx.$refs.cropperDlg.changeImage);
 
};
const internalInstance = getCurrentInstance();
const imgFile = ref("");
const cropperImg = (file) => {
  if (internalInstance.ctx.$refs.cropperDlg && imgFile.value) {
    const _f = imgFile.value;
    const _file = readFile(_f);
    const _fileInfo = {
      url: _f,
      size: _file.size,
      file: _file,
    };
    internalInstance.ctx.$refs.cropperDlg.changeImage(_fileInfo);
  }
};
const readFile = (file, callback) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    callback(e.target.result);
  };
};

</script>

<style lang="scss">
.contain-panel {
  box-sizing: border-box;
  overflow: hidden;
  padding-top: 10px;

  .container {
    padding: 40px 5px;
    .insert-img {
      position: relative;
      .pic-select {
        height: 0;
      }
      .iconfont {
        position: absolute;
        top: -10px;
        right: -5px;
        font-size: 30px;
        color: var(--link);
      }
    }
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