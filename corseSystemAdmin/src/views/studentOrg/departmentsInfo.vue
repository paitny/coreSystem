<template>
  <el-card>

    <div id="ArticleManger">
      <el-table
          :data="departmentsData"
          border
          style="width: 100%"
      >
        <el-table-column
            prop="date"
            label="发布日期"
            :key="departmentsData.date"
            :formatter="dateFormat"
            align="center"
        >
        </el-table-column>

        <el-table-column label="机构" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="部门负责人" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.leader"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.phone"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="qq" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.qq"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.email"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.description"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="重新上传封面图" align="center" width="350px">
          <template #default="scope">
            <div class="cover">
              <el-image
                  style="width: 150px; height: 150px;"
                  :src="`${baseURL}${staticURL}${scope.row.cover}`"
                  :preview-src-list="[`${baseURL}${staticURL}${scope.row.cover}`]"
                  preview-teleported="true"
                  previewTeleported
              >
              </el-image>
              <el-upload
                  class="upload-demo"
                  :action="`${baseURL}/api/adminServer/studentOrg/cover`"
                  :on-success="function(res){cover_upload_success(res,scope.row._id,scope.row.cover)}"
                  :before-upload="cover_before_upload"
                  :limit="1"
                  :with-credentials="true"
                  :show-file-list="false"

              >
                <el-button size="large" type="warning" style="margin: auto 0">重传封面</el-button>
              </el-upload>
            </div>

          </template>
        </el-table-column>
        <el-table-column label="重新上传海报" align="center" width="350px">
          <template #default="scope">
            <div class="cover">
              <el-image
                  style="width: 150px; height: 150px;"
                  :src="`${baseURL}${staticURL}${scope.row.poster}`"
                  :preview-src-list="[`${baseURL}${staticURL}${scope.row.poster}`]"
                  preview-teleported="true"
                  previewTeleported
              >
              </el-image>
              <el-upload
                  class="upload-demo"
                  :action="`${baseURL}/api/adminServer/studentOrg/cover`"
                  :on-success="function(res){poster_upload_success(res,scope.row._id,scope.row.poster)}"
                  :before-upload="poster_before_upload"
                  :limit="1"
                  :with-credentials="true"
                  :show-file-list="false"

              >
                <el-button size="large" type="warning" style="margin: auto 0">重传海报</el-button>
              </el-upload>
            </div>

          </template>
        </el-table-column>

        <el-table-column
            label="操作"
            align="center"
        >
          <template #default="scope">

              <el-button
                  type="primary"
                  @click="update(scope.row._id,{name:scope.row.name,leader:scope.row.leader,phone:scope.row.phone,qq:scope.row.qq,email:scope.row.email,description:scope.row.description})"
              >
                <el-icon><Edit /></el-icon>
              </el-button>





          </template>
        </el-table-column>

        <el-table-column
            label="操作"
            align="center"
        >
          <template #default="scope">
            <div class="buttonSubmit">

              <el-button
                  type="danger"
                  @click="deleteMusic(scope.row._id,scope.row.cover)"
                  circle
              > <el-icon>
                <Delete />
              </el-icon></el-button>
            </div>

          </template>
        </el-table-column>
      </el-table>
    </div>

  </el-card>

</template>

<script>
import moment from "moment";

export default {
  name: "ArticleManger",
  data() {
    return {
      departmentsData: [],

    }
  },
  methods: {
    lookDepartment(id){
      this.$router.push({ name: 'departmentsInfo', query: { id: id } });
    },
//上传时间
    dateFormat: function (row, column) {
      let date = row[column.property];
      if (date == undefined) {
        return "";
      }

      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },

    //请求所有音乐数据
    async getDepartments() {
      let {data} = await this.$axios({
        method: "get",
        url: "/api/adminServer/get/departments",
        params:{id:this.$route.query.id}
      })
      if (data.code) {
        return this.$message.error(data.msg)
      }
      this.departmentsData = data.data



    },
    //md上传之前的回调
    lrc_before_upload(file) {
      let ifMic = /\.lrc$/.test(file.name)
      if (!ifMic) {
        this.$message.error("只能上传.lrc文件")
      }
      return ifMic
    },
    //md上传成功后的回调
    lrc_upload_success(res, id,musicUrl) {
      //失败
      if (res.code) {
        return this.$message.error(res.msg)
      }

      //成功
      this.update(id, {lrc: res.url},musicUrl)
    },


    //更新文章
    async update(id, doc,musicUrl) {
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/studentOrg/updateDepartment",
        data: {id, doc,musicUrl}
      })

      if (data.code) {
        return this.$message.error(data.msg)
      }
      this.$message.success("更新成功")
      await this.getDepartments()
    },

    //md上传之前的回调
    music_before_upload(file) {
      let ifMic = /\.(mp3|m4a)$/.test(file.name)
      if (!ifMic) {
        this.$message.error("请上传音乐文件")
      }
      return ifMic
    },
    //md上传成功后的回调
    music_upload_success(res, id,musicUrl) {
      //失败
      if (res.code) {
        return this.$message.error(res.msg)
      }

      //成功
      this.update(id, {url: res.url},musicUrl)
    },

    //封面图上传之前的回调
    cover_before_upload(file) {
      const isJPG = /^image\/(jpeg|png)$/.test(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M
    },
    poster_before_upload(file) {
      const isJPG = /^image\/(jpeg|png)$/.test(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M
    },
    //封面图上传成功后的回调
    cover_upload_success(res, id,musicUrl) {
      //失败
      if (res.code) {
        return this.$message.error(res.msg)
      }

      //成功
      this.update(id, {cover: res.url},musicUrl)
    },
    poster_upload_success(res, id,musicUrl) {
      //失败
      if (res.code) {
        return this.$message.error(res.msg)
      }

      //成功
      this.update(id, {poster: res.url},musicUrl)
    },
    //删除音乐
    async deleteMusic(id,departmentUrl) {
      let {data} = await this.$axios({
        method: "DELETE",
        url: "/api/adminServer/studentOrg/deleteDepartment",
        data: {id,departmentUrl}
      })

      if (data.code) {
        return this.$message.error(data.msg)
      }

      this.$message.success("删除完成")
      await this.getDepartments()
    }
  },

  created() {
    this.getDepartments()
  }
}
</script>

<style lang="scss" scoped>
#ArticleManger {
  .cover {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .search {
    margin-bottom: 10px;
  }

  .buttonSubmit {
    width: 70%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
  }
}
</style>














