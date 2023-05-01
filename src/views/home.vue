<template>
  <div class="contain-panel">
    <el-row :gutter="10">
      <el-col :span="7"
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
            <el-form-item prop="picture">
              <!-- 登录发表图片 -->
              <div class="insert-img">
                <!-- 这里是发表图片位置 -->
                <div class="comment-image">
                  <CommentImage
                    :src="commentImg"
                    :srcList="[commentImg]"
                    :width="210"
                    :height="210"
                  ></CommentImage>
                  <span
                    v-if="commentImg"
                    class="iconfont icon-remove"
                    @click="removeCommentImg"
                  ></span>
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
              </div>
            </el-form-item>

            <el-form-item>
              <el-button
                @click="searchHandle"
                type="primary"
                :style="{ width: '210px' }"
                >搜索</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="17">
        <div class="search-panel">
          <el-table
            :data="searchList"
            style="width: 92%"
            stripe
          >
            <el-table-column type="index" width="80" />
            <el-table-column prop="filename" label="文件名" width="250" />
            <el-table-column label="搜索结果">
              <template #default="scope">
                <el-image
                  class="scale-pic"
                  :zoom-rate="1.2"
                  style="width: 80px; height: 80px"
                  :src="scope.row.filepath_thumbnail"
                  fit="fill"
                  loading="lazy"
                  hide-on-click-modal
                  :preview-teleported="true"
                  :initial-index="0"
                  :preview-src-list="[scope.row.filepath_thumbnail]"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column label="用户反馈" width="150">
              <template #default="scope">
                <span
                  :class="['iconfont', scope.row.like ? 'active' : '']"
                  @click="handleLike(scope.row, 1)"
                  >&#xe869;</span
                >
                <span
                  :class="['iconfont', scope.row.unlike ? 'active' : '']"
                  @click="handleLike(scope.row, 0)"
                  >&#xe86a;</span
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const formData = ref({});
const formDataRef = ref();
const rules = {
  algo: [{ required: true, message: "请选择算法", trigger: "blur" }],
};
const api = {
  search: "/api/search",
};
// const height =
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
};
</script>

<style lang="scss">
.contain-panel {
  box-sizing: border-box;
  overflow: hidden;
  padding-top: 10px;
  .iconfont {
    margin: 0 8px;
    cursor: pointer;
  }
  .active {
    color: var(--link);
  }
  .container {
    padding: 20px 5px;
    .insert-img {
      position: relative;
      .pic-select {
        height: 0;
      }
      .iconfont {
        position: absolute;
        top: -10px;
        right: -5px;
        font-size: 20px;
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
  .search-panel{
    padding: 10px;
    box-sizing: border-box;
    height: calc(100vh - 100px);
    overflow-y: scroll;
  }
}
</style>>