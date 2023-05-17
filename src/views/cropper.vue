
<template>
  <!-- vueCropper 剪裁图片实现-->
  <el-dialog title="图片剪裁" v-model="dialogVisible" append-to-body>
    <div class="cropper-content">
      <div class="cropper" style="text-align: center">
        <VueCropper
          ref="cropper"
          :img="option.img"
          :output-size="option.size"
          :output-type="option.outputType"
          :info="true"
          :full="option.full"
          :can-move="option.canMove"
          :can-move-box="option.canMoveBox"
          :original="option.original"
          :auto-crop="option.autoCrop"
          :fixed="option.fixed"
          :fixed-number="option.fixedNumber"
          :center-box="option.centerBox"
          :info-true="option.infoTrue"
          :fixed-box="option.fixedBox"
        ></VueCropper>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="finish" :loading="loading"
          >确认</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { VueCropper }  from 'vue-cropper' 
export default({
  components: { VueCropper },
  data() {
    return {
      dialogVisible: false,
      // 裁剪组件的基础配置option
      option: {
        img: new URL("@/assets/images/default.png",import.meta.url).href, // 裁剪图片的地址
        info: false, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 360, // 默认生成截图框宽度
        autoCropHeight: 400, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [3, 4], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: true, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: false // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      picsList: [],  //页面显示的数组
      // 防止重复提交
      loading: false
    }
  },
  methods: {
    // 限制图片大小
    changeImage(file) {
      this.loading = false
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB!')
        return false
      }

      // 上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        this.option.img = file.url
        this.dialogVisible = true
      })
    },
    // 点击裁剪，这一步是可以拿到处理后的地址
    finish() {
      this.$refs.cropper.getCropBlob((data) => {
        var fileName = 'fileCropper'
        this.loading = true
        console.log(fileName, data)
        this.option.img = ''
        this.dialogVisible = false
        this.blobToDataURI(data, (res)=>{
          this.$emit('cropperImg', res)
        })
      })
    },
    // blob 装 base64
    blobToDataURI(blob, callback) {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = function (e) {
          callback(e.target.result);
      }
    }
  }
})
</script>
​
<style lang="scss">
// 截图
.cropper-content {
  .cropper {
    width: auto;
    height: 500px;
  }
}
</style>
