<template>
  <el-card>


    <div id="lateUser">
      <el-table
          :data="noticeData"
          border
          style="width: 100%"

      >
        <el-table-column
            prop="date"
            label="访问时间"
            :key="noticeData.date"
            :formatter="dateFormat"
            width="200px"
            align="center"
        >

        </el-table-column>

        <el-table-column
            prop="noticeComment"
            label="通知内容"
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
        @current-change="getNoticeData"
        @size-change="getNoticeData"
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
      noticeData: [],
      display: true,
      total: 0,
      query: {
        page: 1,
        perPage: 20
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
    async getNoticeData() {
      let {data} = await this.$axios({
        method: "GET",
        url: "/api/adminServer/notice/get",
        params: this.query
      })
      console.log(data)


      this.noticeData = data.data
      this.total = data.total
      console.log(this.total)
      if (this.total === 0) {
        this.display = false
      }
    }
  },


  async mounted() {
    await this.getNoticeData()
  }
}
</script>

<style scoped>
</style>














