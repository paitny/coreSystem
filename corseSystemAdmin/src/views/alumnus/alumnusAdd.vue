<template>
  <el-card>
    <div id="ArticleAdd">

      <div class="video-class">
        <span>信息工程学院优秀学生创建</span>

      </div>
      <el-form
          :model="form"
          status-icon
          ref="ruleForm"
          label-width="100px"
      >

        <el-form-item label="姓名：" label-width="100px">
          <el-input
              v-model="form.name"
              placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别：" label-width="100px">
          <el-input
              v-model="form.sex"
              placeholder="请输入性别"
          ></el-input>
        </el-form-item>
        <el-form-item label="年级：" label-width="100px">
          <el-input
              v-model="form.grade"
              placeholder="请输入班级"
          ></el-input>
        </el-form-item>
        <el-form-item label="班级：" label-width="100px">
          <el-input
              v-model="form.classes"
              placeholder="请输入专业班级"
          ></el-input>
        </el-form-item>
        <el-form-item label="职位：" label-width="100px">
          <el-input
              v-model="form.position"
              placeholder="请输入职位"
          ></el-input>
        </el-form-item>

        <el-form-item label="薪资待遇：" label-width="100px">
          <el-input
              v-model="form.salary"
              placeholder="请输入薪资"
          ></el-input>
        </el-form-item>
        <el-form-item label="经历：" label-width="100px">
          <el-input
              v-model="form.description"
              placeholder="请描述经历"
          ></el-input>
        </el-form-item>
        <el-form-item label="校友照片上传：" label-width="100px">
          <el-upload
              class="avatar-uploader"
              :action="`${baseURL}/api/adminServer/alumnus/cover`"
              :show-file-list="false"
              :on-change="coverChange"
              :on-success="cover_upload_success"
              :auto-upload="false"
              ref="imgForm"
              :with-credentials="true"
          >
            <div
                v-if="imageUrl"
                class="avatar"
                :style="{
                backgroundImage: `url(${imageUrl})`
              }"
            >
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon">
              <el-icon>
                <Plus/>
              </el-icon>
            </i>
          </el-upload>
        </el-form-item>

        <el-form-item label-width="100px">
          <el-button type="primary" @click="submitForm" size="large">确认创建</el-button>
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
      editorContent: '',
      form: {
        name: "",
        sex:"",
        grade:"",
        classes:"",
        position:"",
        description: "",
        salary:"",
        cover: "",
      },
      imageUrl: "",
      content: '',

    }
  },
  components: {

  },
  methods: {

    //发表按钮点击
    submitForm() {
      //从上传md开始，后续的上传在对应的回调里面完成
      this.$refs.imgForm.submit()
    },

    //文章发表
    async submit() {
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/alumnus/create",
        data: this.form
      })
      if (data.code) {
        return this.$message.error(data.msg)
      }

    },


    //添加封面的钩子
    coverChange(file, fileList) {
      if (file.status !== 'ready') return

      const isJPG = /^image\/(jpeg|png)$/.test(file.raw.type);
      const isLt2M = file.raw.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      if (isJPG && isLt2M) {
        this.imageUrl = URL.createObjectURL(file.raw);
      } else {
        this.imageUrl = ""
        fileList.pop()
      }
    },

    //封面上传成功
    cover_upload_success(res) {
      if (res.code) {
        return this.$message.error("上传封面失败，请检查后端报错")
      }
      this.form.cover = res.url
      this.submit()
    }
  }
}
</script>
<style lang="scss" scoped>
#ArticleAdd {

  z-index: 999;

  .video-class {
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















