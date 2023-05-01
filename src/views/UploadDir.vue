<template>
  <div class="container">
    <el-form
      :model="formData"
      :rules="rules"
      ref="formDataRef"
      label-width="80px"
      @submit.prevent
    >
      <!--input输入-->
      <el-form-item label="文件路径" prop="dir">
        <div class="upload">
          <el-input
            clearable
            placeholder="请输入文件夹路径"
            v-model.trim="formData.dir"
          ></el-input>
          <div class="op-btn">
            <el-button type="primary" size="large" @click="uploadDir"
              >上传</el-button
            >
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div class="tip">
      <el-card>
        <div class="box-card">请确保该文件夹可以被服务器访问到！！！</div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";

import { useRoute, useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const formData = ref({});
const formDataRef = ref();
const rules = {
  dir: [
    { required: true, message: "请输入文件路径" },
    { validator: proxy.Verify.fileDir, message: "请输入正确的路径" },
  ],
};
const api = {
  uploadDir: "/api/add_dir",
};
const picNum = ref(0)
const taskid = ref("")
const uploadDir = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) return;
    let params = Object.assign({}, formData.value);
    let result = await proxy.Request({
      url: api.uploadDir,
      params: params,
      showError: false,
      //错误的回调，返回:错误信息
      errorCallback: (response) => {
        ElMessageBox.alert(response.info, "错误", {
          "show-close": false,
          callback: (action) => {
            proxy.Message.warn(response.data.msg);
          },
        });
      },
    });
    if (!result) {
      return;
    }
    picNum.value = result.data["task_nums"]
    taskid.value = result.data.taskid
    proxy.Message.success(`添加成功，开始处理，任务id为：${taskid.value}，共有${picNum.value}张图片`);
  });
};
</script>

<style lang="scss" scoped>
.container {
  margin-top: 10px;
  .upload {
    flex: 1;
    display: flex;
    .op-btn {
      padding-left: 10px;
      padding-right: 10px;
    }
  }
  .tip {
    width: 250px;
    height: 100px;
    margin-left: 80px;
    .box-card {
      font-size: 18px;
      color: rgb(242, 87, 87);
    }
  }
}
</style>
