<template>
  <el-card>


    <div id="lateUser">
      <el-table
          :data="visitorData"
          border
          style="width: 100%"

      >
        <el-table-column
            prop="date"
            label="访问时间"
            :key="visitorData.date"
            :formatter="dateFormat"
            width="200px"
            align="center"
        >

        </el-table-column>
        <el-table-column
            prop="_id"
            label="id"
            align="center"
        >

        </el-table-column>
        <el-table-column
            prop="visitor.user"
            label="账号"
            align="center"
        >

        </el-table-column>
        <el-table-column
            prop="visitor.name"
            label="姓名"
            align="center"
        >

        </el-table-column>
        <el-table-column
            prop="visitor.sex"
            label="性别"
            align="center"
        >

        </el-table-column>

        <el-table-column
            prop="visitor.grade"
            label="年级"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="visitor.class"
            label="班级"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="visitor.levels"
            label="层次"
            align="center"
        >
        </el-table-column>




        <el-table-column
            prop="visitor.photo"
            label="头像"
            align="center"
        >
          <template #default="scope">
            <div class="demo-image__preview">
              <el-image
                  style="width: 150px; height:100px"
                  :src="[`${baseURL}${staticURL}${scope.row.visitor.photo}`]"
                  :preview-src-list="[`${baseURL}${staticURL}${scope.row.visitor.photo}`]"
                  :initial-index="4"
                  fit="cover"
                  preview-teleported="true"
                  previewTeleported
              >
              </el-image>
            </div>
          </template>
        </el-table-column>

        <el-table-column
            label="是否管理员登录"
            align="center"
            prop="visitor.admin"
        >
          <template #default="scope">
            {{ scope.row.visitor.admin ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column
            prop="visitor.province"
            label="ip"
            align="center"
        >
          <template #default="scope">
            {{ scope.row.visitor.province || '未知' }}
          </template>
        </el-table-column>
        <el-table-column
            prop="userType"
            label="登录方式"
            align="center"
        >

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
        @current-change="getVisitor"
        @size-change="getVisitor"
        :page-sizes="[2,5,10,20,30]"
    />
  </el-card>
</template>

<script>
import moment from 'moment'


export default {
  name: "LatelyVisitor",
  data() {
    return {
      visitorData: [],
      display: true,
      total: 0,
      query: {
        page: 1,
        perPage: 10
      }
    }
  },
  methods: {
    //转换日期显示
    //ui中自带的方法
    dateFormat: function (row, column) {
      let date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    async getVisitor() {
      let {data} = await this.$axios({
        method: "GET",
        url: "/api/get/visitor",
        params: this.query
      })
      if (data.code) return
      console.log(data)
      this.visitorData = data.data
      this.total = data.total
      console.log(this.total)
      if (this.total === 0) {
        this.display = false
      }
    }
  },


  async mounted() {
    await this.getVisitor()
  }
}
</script>

<style scoped>
</style>














