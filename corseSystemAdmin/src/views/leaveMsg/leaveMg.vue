<template>
  <el-card>
  <div id="userAdmin">
    <el-table
        :data="leaveData"
        border
        style="width: 100%"

    >
      <el-table-column
          prop="date"
          label="发布时间"
          :formatter="dateFormat"
          align="center"
      >

      </el-table-column>
      <el-table-column
          prop="leaveType"
          label="话题"
          align="center"
      >

      </el-table-column>
      <el-table-column
          prop="leaveContent"
          label="内容"
          align="center"
      >

      </el-table-column>

      <el-table-column
          prop="images"
          label="图片"
          align="center"
      >
        <template #default="scope">
          <div class="demo-images__container" style="width: 150px;height: 100px;margin: 0 auto">
            <el-image
                :src="`${baseURL}${staticURL}${scope.row.images[0].filename}`"
                :preview-src-list="scope.row.images.map(image => `${baseURL}${staticURL}${image.filename}`)"
                fit="cover"
                preview-teleported="true"
                previewTeleported

            >
            </el-image>
          </div>
        </template>
      </el-table-column>

      <el-table-column
          prop="user.name"
          label="发布者"
          align="center"
      >

      </el-table-column>
      <el-table-column
          prop="user.nickName"
          label="昵称"
          align="center"
      >

      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作1"
          align="center"
      >
        <template #default="scope">
          <el-button
              type="warning"
              @click="agreeLeave(scope.row._id,scope.row.process)"
              size="large"
          >屏蔽
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作2"
          align="center"
      >
        <template #default="scope">
          <el-button
              type="danger"
              @click="deleteLeave(scope.row._id,scope.row.images)"
              size="large"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
    <el-pagination
        v-if="display"
        background
        layout="sizes,prev,pager,next,jumper,->,slot, total"
        :total="total"
        v-model:page-size="query.perPage"
        v-model:current-page="query.page"
        @current-change="getLeaveData"
        @size-change="getLeaveData"
        :page-sizes="[2,5,10,20,30]"
    />
  </el-card>
</template>

<script>
import moment from 'moment'

export default {
  name: "ContactMsg",
  data() {
    return {
      leaveData: [],
      display: true,
      total:0,
      query: {
        page: 1,
        perPage: 5
      }
    }
  },
  methods: {
    //重置密码
    async resertPass(id,user,secret){
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/consumer/resetPass",
        data: {id,user,secret}
      })
      if (data.code) {
        return this.$message.error(data.msg)
      }
      this.$message.success(data.msg)
    },
    //转换日期显示
    //ui中自带的方法
    dateFormat: function (row, column) {
      let date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    async agreeLeave(id,process){
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/trends/agree",
        data:{id:id,process:!process}
      })
      if (data.code) {
        return this.$message.error(data.msg)
      }
      this.$message.error(data.msg)
      await this.getLeaveData()
    },
    //请求所有数据
    async getLeaveData() {
      let {data} = await this.$axios({
        method: "GET",
        url: "/api/trends/audited",
        params: this.query
      })
      console.log(data);
      if (data.data.code) {
        return this.$message.error(data.msg)
      }
      this.leaveData = data.data
      this.total = data.total
      console.log(this.total)
      if (this.total == 0) {
        this.display = false
      }



    },
    //用户注销
    async deleteLeave(id,imageArr) {
      let {data} = await this.$axios({
        method: "DELETE",
        url: "/api/adminServer/trends/delete",
        data: {id,imageArr}
      })
      if (data.code) {
        return this.$message.error(data.msg)
      }
      this.$message.success(data.msg)
      await this.getLeaveData()
    },


  },
  created() {
    this.getLeaveData()

  }
}
</script>

<style scoped>

</style>














