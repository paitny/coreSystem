<template>
  <el-card>

    <div id="ArticleManger">
      <el-table
          :data="StudentOrgsData"
          border
          style="width: 100%"
      >
        <el-table-column
            prop="date"
            label="发布日期"
            :key="StudentOrgsData.date"
            :formatter="dateFormat"
            align="center"
        >
        </el-table-column>
        <el-table-column label="届数" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.due"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="机构" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.description"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="查看部门" align="center">
          <template #default="scope">
              <el-button size="large"  color="#626aef" @click="lookDepartment(scope.row._id)">查看部门</el-button>
          </template>
        </el-table-column>
        <el-table-column label="重新上传封面图" align="center" width="300px">
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
        <el-table-column
            label="操作1"
            align="center"
        >
          <template #default="scope">

              <el-button
                  type="primary"
                  @click="update(scope.row._id,{due:scope.row.due,name:scope.row.name,description:scope.row.description})"
              >
                <el-icon><Edit /></el-icon>
              </el-button>



          </template>
        </el-table-column>
        <el-table-column
            label="操作2"
            align="center"
        >
          <template #default="scope">


              <el-button
                  type="danger"
                  @click="deleteStudentOrg(scope.row._id,scope.row.cover)"
                  circle
              > <el-icon>
                <Delete />
              </el-icon></el-button>


          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
        background
        layout="sizes,prev,pager,next,jumper,->,slot, total"
        :total="total"
        v-model:page-size="query.perPage"
        v-model:current-page="query.page"
        @current-change="getStudentOrg"
        @size-change="getStudentOrg"
        :page-sizes="[2,4,5,10,20,30]"

    />
  </el-card>

</template>

<script>
import moment from "moment";

export default {
  name: "ArticleManger",
  data() {
    return {
      StudentOrgsData: [],
      total: 0,
      display: true,
      query:
          {
            page: 1,
            perPage: 4
          }
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
    async getStudentOrg() {
      let {data} = await this.$axios({
        method: "get",
        url: "/api/adminServer/get/getAllStudentOrgs",
        params: this.query
      })
      if (data.code) {
        return this.$message.error(data.msg)
      }
      this.StudentOrgsData = data
      this.total = data.total
      if (this.total == 0) {
        this.display = false
      }

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
        url: "/api/adminServer/studentOrg/update",
        data: {id, doc,musicUrl}
      })

      if (data.code) {
        return this.$message.error(data.msg)
      }
      this.$message.success("更新成功")
      await this.getStudentOrg()
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
    //封面图上传成功后的回调
    cover_upload_success(res, id,musicUrl) {
      //失败
      if (res.code) {
        return this.$message.error(res.msg)
      }

      //成功
      this.update(id, {cover: res.url},musicUrl)
    },

    //删除音乐
    async deleteStudentOrg(id,orgCover) {
      let {data} = await this.$axios({
        method: "DELETE",
        url: "/api/adminServer/studentOrg/delete",
        data: {id,orgCover}
      })

      if (data.code) {
        return this.$message.error(data.msg)
      }

      this.$message.success("删除完成")
      await this.getStudentOrg()
    }
  },

  created() {
    this.getStudentOrg()
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














