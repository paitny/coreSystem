<template>
  <el-card>
    <div id="ArticleAdd">
      <el-form
          :model="form"
          status-icon
          ref="ruleForm"
          label-width="100px"
      >
        <el-form-item label="音乐名字：" label-width="100px">
          <el-input
              v-model="form.name"
              placeholder="可通过上传 music 自动获取文件名"
          ></el-input>
        </el-form-item>
        <el-form-item label="演唱者：" label-width="100px">
          <el-input
              v-model="form.artist"
          ></el-input>
        </el-form-item>
        <el-form-item label="主题颜色：" label-width="100px">
          <el-input
              v-model="form.theme"
          ></el-input>
        </el-form-item>

        <el-form-item label="音乐上传：" label-width="100px">
          <el-upload
              class="upload-demo"
              drag
              :action="`${baseURL}/api/adminServer/music/musicAdd`"
              :auto-upload="false"
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
        <el-form-item label="歌词上传：" label-width="100px">
          <el-upload
              class="upload-demo"
              :action="`${baseURL}/api/adminServer/music/lrc`"
              multiple
              :auto-upload="false"
              :on-change="fileChangelrc"
              :on-success="lrc_upload_success"
              :limit="1"
              :with-credentials="true"
              ref="lrcForm"
          >
            <el-button type="info" size="large" circle>
              <svg-icon icon="lrc" style="width: 60px;height: 60px"></svg-icon>
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="封面图上传：" label-width="100px">
          <el-upload
              class="avatar-uploader"
              :action="`${baseURL}/api/adminServer/music/cover`"
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
          <el-button type="success" @click="submitForm" size="large">确认添加</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "MusicAdd",
  data() {
    return {
      form: {
        name: "",
        artist: "",
        lrc: "",
        url: "",
        cover: "",
        theme: "#626aef"
      },
      imageUrl: "",

    }
  },
  methods: {
    //发表按钮点击
    submitForm() {
      //从上传music开始，后续的上传在对应的回调里面完成
      this.$refs.musicForm.submit()
      this.$refs.lrcForm.submit()
    },

    //音乐发表
    async submit() {
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/music/add",
        data: this.form
      })

      if (data.code) {
        return this.$message.error(data.msg)
      }
      //跳转到对应的文章页面
      await this.$router.push("/music/micMg")
    },

    //添加md文件的各种检测
    fileChangemusic(file, fileList) {
      if (file.status !== 'ready') return
      //简单判断是否是.md文件
      if (/^(.+)\.(mp3|m4a)$/.test(file.name)) {
        //当没有输入title的时候，获取名字填充到title
        if (this.form.name) return
        this.form.name = RegExp.$1
      } else {
        //提示并阻止文件添加
        this.$message.error("只能上传 .mp3或.m4a文件")
        fileList.pop()
      }
    },

    //删除音乐文件之前的钩子
    beforeRemovemusic() {
      this.form.name = ""
    },

    //md上传成功的钩子
    music_upload_success(res) {
      //md上传失败
      if (res.code) {
        return this.$message.error("上传md失败，请检查后端报错")
      }

      //md上传成功
      this.form.url = res.url
      //判断是否有封面图
      if (this.imageUrl) {
        //有封面图，触发封面图的上传
        this.$refs.imgForm.submit()
      } else {
        //没有封面图，直接发表文章
        this.submit()
      }
    },

    //歌词上传
    fileChangelrc(file, fileList) {
      if (file.status !== 'ready') return
      //简单判断是否是.md文件
      if (/^(.+)\.lrc$/.test(file.name)) {
      } else {
        //提示并阻止文件添加
        this.$message.error("只能上传 .lrc 格式的歌词文件")
        fileList.pop()
      }
    },

    //歌词上传成功的钩子
    lrc_upload_success(res) {
      //歌词上传失败
      if (res.code) {
        return this.$message.error("上传歌词失败，请检查后端报错")
      }
      //md上传成功
      this.form.lrc = res.url
      //没有封面图，直接发表
    },
    //添加封面的钩子
    coverChange(file, fileList) {
      if (file.status !== 'ready') return

      const isJPG = /^image\/(jpeg|png)$/.test(file.raw.type);
      const isLt2M = file.raw.size / 1024 / 1024 < 2;

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
}
</style>














