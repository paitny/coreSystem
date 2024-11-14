<template>
  <el-card>
    <div id="ArticleAdd">

      <div class="video-class">
        <span>人工智能与大数据学院部门创建</span>

      </div>
      <el-form
          :model="form"
          status-icon
          ref="ruleForm"
          label-width="100px"
      >


        <el-form-item label="所属机构:" label-width="150px">
          <div class="video-class">
            <el-select v-model="form.institution" placeholder="Select">
              <el-option
                  v-for="(item,index) in StudentOrgData"
                  :key="item._id"
                  :label="item.name"
                  :value="item.name"
                  @click="handleInstitutionChange(index)"
              />
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="机构名字：" label-width="100px">
          <el-input
              v-model="form.name"
              placeholder="请输入机构"
          ></el-input>
        </el-form-item>

        <el-form-item label="部长" label-width="100px">
          <el-input
              v-model="form.leader"
              placeholder="请输入机构"
          ></el-input>
        </el-form-item>
        <el-form-item label="qq" label-width="100px">
          <el-input
              v-model="form.qq"
              placeholder="请输入部门qq"
          ></el-input>
        </el-form-item>
        <el-form-item label="微博" label-width="100px">
          <el-input
              v-model="form.weibo"
              placeholder="请输入部门微博"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input
              v-model="form.email"
              placeholder="请输入部门邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述：" label-width="100px">
          <el-input
              v-model="form.description"
              placeholder="请描述机构"
          ></el-input>
        </el-form-item>
        <el-form-item label="机构封面图上传：" label-width="100px">
          <el-upload
              class="avatar-uploader"
              :action="`${baseURL}/api/adminServer/StudentOrg/cover`"
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
        <el-form-item label="海报上传：" label-width="100px">
          <el-upload
              class="upload-demo"
              drag
              :action="`${baseURL}/api/adminServer/StudentOrg/cover`"
              :auto-upload="true"
              :on-change="fileChangemusic"
              :on-success="music_upload_success"
              :before-remove="beforeRemovemusic"
              :limit="1"
              ref="musicForm"
              :with-credentials="true"
          >
            <i class="el-icon-upload">
              <el-icon class="el-icon--upload">
                <upload-filled/>
              </el-icon>
            </i>
            <div class="el-upload__text">将.音乐文件文件拖到此处，或<em>点击上传</em></div>
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
        studentOrgId: "",
        institution: "",
        leader: "",
        name: "",
        description: "",
        cover: "",
        qq: "",
        weibo: "",
        email: "",
        phone: "",
        poster: ""
      },
      imageUrl: "",
      content: '',
      StudentOrgData: []
    }
  },
  components: {},
  mounted() {
    this.getInstitution()
  },
  methods: {
    handleInstitutionChange(index) {
      this.form.studentOrgId = this.StudentOrgData[index]._id
    },
    //发表按钮点击
    submitForm() {
      //从上传md开始，后续的上传在对应的回调里面完成
      this.$refs.imgForm.submit()
    },

    //文章发表
    async getInstitution() {
      let {data} = await this.$axios({
        method: "get",
        url: "/api/get/getAllStudentOrgs",

      })

      if (data.code) {
        return this.$message.error(data.msg)
      }
      this.StudentOrgData = data
    },
    //文章发表
    async submit() {
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/StudentOrg/departments",
        data: this.form
      })

      if (data.code) {
        return this.$message.error(data.msg)
      }
      this.$message.success(data.msg)
      this.$refs.ruleForm.resetFields()
    },
    beforeRemovemusic() {
      this.form.name = ""
    },
    fileChangemusic(file, fileList) {
      if (file.status !== 'ready') return
      //简单判断是否是.md文件
      if (/^(.+)\.(jpg|png)$/.test(file.name)) {
        //当没有输入title的时候，获取名字填充到title
        if (this.form.name) return
        this.form.name = RegExp.$1
      } else {
        //提示并阻止文件添加
        this.$message.error("只能上传 .png或.jpg文件")
        fileList.pop()
      }
    },
    music_before_upload(file) {
      let ifMic = /\.(png|jpg)$/.test(file.name)
      if (!ifMic) {
        this.$message.error("上传非png或jpg类型文件")
      }
      return ifMic
    },
    //md上传成功后的回调
    music_upload_success(res) {
      //失败
      if (res.code) {
        return this.$message.error(res.msg)
      }
      console.log(res.url)
      //成功
      this.form.poster = res.url
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















