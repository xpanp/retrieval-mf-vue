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
    <keep-alive>
      <BarPrecess
        v-if="
          percentage !== 0 && percentage !== 100 && percentage !== undefined
        "
        :percentage="percentage"
        :status="status"
        :tip="tip"
      ></BarPrecess>
    </keep-alive>
  </div>
</template>

<script setup>
import {
  ref,
  getCurrentInstance,
  watch
} from "vue";
import { useStore } from "vuex";
const store = useStore();
const { proxy } = getCurrentInstance();

const formData = ref({ dir: "/data/lyy/image-test" });
const formDataRef = ref();
const rules = {
  dir: [
    { required: true, message: "请输入文件路径", trigger: "blur" },
    {
      validator: proxy.Verify.fileDir,
      message: "请输入正确的路径",
      trigger: "blur",
    },
  ],
};
const api = {
  uploadDir: "/api/add_dir",
  statusProcess: "/api/add_dir/status",
};
const task_nums = ref(0);
const taskid = ref("");
const percentage = ref(0);
// 上传文件
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
    task_nums.value = result.data["task_nums"];
    taskid.value = result.data.taskid;
    proxy.Message.success(
      `添加成功，开始处理，任务id为：${taskid.value}，共有${task_nums.value}张图片`
    );
    statusCheck();
    let timer = setInterval(() => {
      statusCheck();
      const base = financial(100 / statusInfo.value["task_nums"]);
      percentage.value = financial(statusInfo.value["processed_nums"] * base);
      store.commit("updatePercentage", percentage.value);

      if (
        statusInfo.value["processed_nums"] === statusInfo.value["task_nums"]
      ) {
        store.commit("updatePercentage", 100);
        store.commit("updateStatus", "success");
        store.commit("updateTip", "处理完成!!");
        clearInterval(timer);
        proxy.Message.success("处理完成！！！");
        // console.log(tip.value, status.value, percentage.value);
      }
    }, 3000);
  });
};
const statusInfo = ref({});
const status = ref("");
const tip = ref("后台正在处理中...");
// 数值转换
const financial = (x) => {
  return Number.parseInt(x);
};
// 进度条状态，异步查询
const statusCheck = async () => {
  let result = await proxy.Request({
    url: api.statusProcess,
    params: {
      taskid: taskid.value,
    },
    // 在封装的时候有showLoading，设置为false就没有loading的效果了
    showLoading: false,
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
  statusInfo.value = result.data;
};
// watch监听percenage的变化
watch(
  () => store.state.percentage,
  (newVal, oldVal) => {
    if(newVal){
      percentage.value = newVal
      store.commit("updatePercentage",newVal)
    }
  },
  { immediate: true, deep: true }
);

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
