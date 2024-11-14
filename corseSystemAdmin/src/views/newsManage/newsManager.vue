<template>
  <el-card>
    <div id="ArticleManger">

      <el-input
          class="search"
          placeholder="请输入搜索内容"
          prefix-icon="el-icon-search"
          @input="handleSearch"
          v-model="searchTxt">
      </el-input>

      <el-table
          :data="articleData"
          border
          style="width: 100%"
      >
        <el-table-column label="标题"
                         align="center"
        >
          <template #default="scope">
            <el-input v-model="scope.row.title"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="重新上传封面图" width="380" align="center">
          <template #default="scope">
            <div class="cover">
              <el-image
                  style="width: 200px; height: 150px;"
                  :src="`${baseURL}${staticURL}${scope.row.cover}`"
                  :preview-src-list="[`${baseURL}${staticURL}${scope.row.cover}`]"
                  preview-teleported="true"
                  previewTeleported
              >
              </el-image>
              <el-upload
                  class="upload-demo"
                  :action="`${baseURL}/api/adminServer/news/cover`"
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
            fixed="right"
            label="操作1"
            align="center"
        >
          <template #default="scope">

            <el-button
                type="primary"
                @click="update(scope.row._id,{title:scope.row.title,des:scope.row.des})"
                size="large"
            >修改
            </el-button>


          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作3"
            align="center"
        >
          <template #default="scope">


            <el-button
                type="success"
                @click="editNews(scope.row._id)"
                size="large"
            >文章内容修改
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
                @click="deleteArticle(scope.row._id,scope.row.cover)"
                size="large"
            >删除
            </el-button>


          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          v-if="display"
          background
          layout="sizes,prev,pager,next,jumper,->,slot, total"
          :total="total"
          v-model:page-size="query.perPage"
          v-model:current-page="query.page"
          @current-change="getArticles"
          @size-change="getArticles"
          :page-sizes="[2,5,10,20,30]"
      />
    </div>
  </el-card>

</template>

<script>
export default {
  name: "newsManger",
  data() {
    return {
      articleData: [],
      AllArticleData: [],
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
          url: "/api/adminServer/news/searchNews",
          params: {query: txt}
        })
        console.log(data)
        this.articleData = []
        this.articleData=data.data
      }, 500)
    },

    //请求所有文章数据
    async getArticles() {
      let {data} = await this.$axios({
        method: "get",
        url: "/api/get/news",
        params: this.query
      })

      if (data.code) {
        return this.$message.error(data.msg)
      }
      this.articleData=[]
      this.searchTxt=""
      this.AllArticleData = data.data
      this.total = data.total
      if (this.total == 0) {
        this.display = false
      }
      this.handleSearch()
    },

    //更新文章
    async update(id, doc) {
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/news/update",
        data: {id, doc}
      })

      if (data.code) {
        return this.$message.error(data.msg)
      }
      this.$message.success(data.msg)
      await this.getArticles()
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
    cover_upload_success(res, id, mdUrl) {
      //失败
      if (res.code) {
        return this.$message.error(res.msg)
      }

      //成功
      this.update(id, {cover: res.url}, mdUrl)
    },

    //删除文章
    async deleteArticle(id, newsCover) {
      let {data} = await this.$axios({
        method: "DELETE",
        url: "/api/adminServer/news/delete",
        data: {id, newsCover}
      })

      if (data.code) {
        return this.$message.error(data.msg)
      }

      this.$message.success("删除完成")
      await this.getArticles()
    },
    //修改文章
    async editNews(id) {
      this.$router.push({name: 'newsId', query: {id: id}});
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














