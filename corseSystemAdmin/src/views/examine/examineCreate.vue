<template>
  <el-card>
    <div id="ArticleAdd">

      <div class="video-class">
        学生干部考核发布

      </div>
      <el-form
          :model="form"
          status-icon
          ref="ruleForm"
          label-width="100px"
      >
        <el-form-item label="标题：" label-width="100px">
          <el-input
              v-model="form.title"
              placeholder="请输入标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="试卷标题：" label-width="100px">
          <el-input
              v-model="form.termTopic"
              placeholder="请输入试卷标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="开始时间：" label-width="100px">
          <el-input
              v-model="form.startTime"
              type="datetime-local"
          ></el-input>
        </el-form-item>
        <el-form-item label="截止时间：" label-width="100px">
          <el-input
              v-model="form.endTime"
              type="datetime-local"
          ></el-input>
        </el-form-item>


        <el-form-item label-width="100px">
          <el-button type="primary" @click="submit" size="large">确认发表</el-button>
        </el-form-item>

      </el-form>

    </div>

  </el-card>

</template>

<script>
export default {
  name: "ArticleAdd",
  data() {
    return {

      form: {
        title: "",
        termTopic:"",
        startTime:"",
        endTime: "",
        cover: "",
      },
      imageUrl: "",
      content: '',

    }
  },
  components: {

  },
  methods: {
    //文章发表
    async submit() {
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/examine/publish-exam",
        data: this.form
      })
         this.$message.success(data.message)
      //跳转到对应的文章页面
      await this.$router.push("/examine/examineMg")
    },
  }
}
</script>
<style lang="scss" scoped>
#ArticleAdd {

  z-index: 999;
  width: 600px;
  margin: 0 auto;
  .video-class {
    text-align: center;
    margin-bottom: 20px;
    margin-left: 20px;
  }

  :deep(.avatar-uploader .el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

  }

  :deep(.avatar-uploader .el-upload:hover) {
    border-color: #409EFF;
  }

  :deep(.avatar-uploader-icon) {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;

  }

  :deep(.avatar) {
    width: 178px;
    height: 178px;
    display: block;
    background: none center center/cover;
  }

  :deep(.el-upload-dragger) {
    width: 360px;

  }

  :deep(.el-textarea__inner) {
    height: 400px;
  }
}

:deep(.ck.ck-editor__main>.ck-editor__editable:not(.ck-focused)) {
  height: 350px;
  width: 100%;
}

:deep(.ck.ck-editor__editable_inline>:last-child ) {
  width: 100%;
  height: 350px;
}
</style>














