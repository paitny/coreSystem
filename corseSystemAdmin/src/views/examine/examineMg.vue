<template>
  <el-card>
    <div id="ArticleManger">

      <el-input class="search" placeholder="请输入搜索内容" prefix-icon="el-icon-search" @input="handleSearch"
                v-model="searchTxt">
      </el-input>

      <el-table :data="articleData" border style="width: 100%">
        <el-table-column label="发布时间" align="center">
          <template #default="scope">
            <div>{{ parseDateTime(scope.row.date) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="标题" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.title"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="试卷标题" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.termTopic"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" align="center" width="250px">
          <template #default="scope">
            <div>{{ parseDateTime(scope.row.startTime) }}</div>
            <el-input type="datetime-local" v-model="scope.row.startTime"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="活动截止时间" align="center" width="250px">
          <template #default="scope">
            <div>{{ parseDateTime(scope.row.endTime) }}</div>
            <el-input type="datetime-local" v-model="scope.row.endTime"></el-input>
          </template>
        </el-table-column>


        <el-table-column
            fixed="right"
            label="成绩导出"
            align="center"
        >
          <template #default="scope">


            <svg-icon icon="download" style="width: 35px;height: 35px; cursor: pointer;"
                      @click="downloadExcel(scope.row._id,String(scope.row.title))"></svg-icon>


          </template>

        </el-table-column>
        <el-table-column fixed="right" label="操作1" align="center">
          <template #default="scope">
            <el-button color="#7d50f4" type="success" @click="editNews(scope.row._id)" size="large">考核数据
            </el-button>


          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作2" align="center">
          <template #default="scope">


            <el-button type="primary"
                       @click="updateExam(scope.row._id,scope.row.title,scope.row.termTopic, scope.row.startTime, scope.row.endTime )"
                       size="large">修改
            </el-button>

          </template>

        </el-table-column>
        <el-table-column fixed="right" label="操作3" align="center">
          <template #default="scope">


            <el-button type="danger" @click="deleteArticle(scope.row._id)" size="large">删除
            </el-button>


          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="display" background layout="sizes,prev,pager,next,jumper,->,slot, total" :total="total"
                     v-model:page-size="query.perPage" v-model:current-page="query.page" @current-change="getArticles"
                     @size-change="getArticles" :page-sizes="[2, 5, 10, 20, 30]"/>
    </div>
  </el-card>
</template>

<script>
import {exportOrgGrade} from "../../utils/xlsx.ts";

export default {
  name: "ArticleManger",
  data() {
    return {
      articleData: [],
      AllArticleData: [],
      exportActiveData: [],
      searchTxt: "",
      timer: null,
      total: 0,
      display: true,
      query: {
        page: 1,
        perPage: 5
      }
    }
  },
  methods: {
    async downloadExcel(id, title) {
      let {data} = await this.$axios({
        method: "GET",
        url: "/api/adminServer/get/userExamsData",
        params: {examId: id}
      })
      this.exportActiveData = data
      exportOrgGrade(this.exportActiveData, title)
    },


    parseDateTime(dateTimeString) {
      const dateObj = new Date(dateTimeString);

      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      const hour = dateObj.getHours();
      const minute = dateObj.getMinutes();

      return `${year}-${month}-${day} ${hour}:${minute}`
    },

    async updateExam(id, title,termTopic, startTime, endTime) {
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/examine/updateExamCreate",
        data: {id, title, termTopic, startTime, endTime}
      })
      this.$message.success(data.message)
    },
    //搜索
    handleSearch() {
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        let txt = this.searchTxt.trim()
        if (!txt) {
          return this.articleData = this.AllArticleData
        }
        let {data} = await this.$axios({
          method: "GET",
          url: "/api/adminServer/examine/searchExam",
          params: {query: txt}
        })
        console.log(data)
        this.articleData = []
        this.articleData = data.data
      }, 500)
    },

    //请求所有文章数据
    async getArticles() {

      let {data} = await this.$axios({
        method: "get",
        url: "/api/adminServer/get/exams",
        params: this.query
      })
      if (data.code) {
        return this.$message.error(data.msg)
      }
      this.articleData = []
      this.searchTxt = ""
      this.AllArticleData = data
      this.total = data.total
      if (this.total == 0) {
        this.display = false
      }
      this.handleSearch()
    },


    //删除文章
    async deleteArticle(id) {

      try {
        let {data} = await this.$axios({
          method: "DELETE",
          url: "/api/adminServer/examine/deletePublish",
          data: {ExamId: id}
        })
        this.$message.success(data.message)
        await this.getArticles()
      } catch (error) {
        return this.$message.error("你不是超级管理员")
      }

    },
    //修改文章
    async editNews(id) {
      this.$router.push({name: 'examineData', query: {id: id}});
    }
  },

  created() {
    this.getArticles()
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

}
</style>














