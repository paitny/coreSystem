<template>
    <el-card>
        <div id="ArticleManger">

            <el-input class="search" placeholder="请输入搜索内容" prefix-icon="el-icon-search" @input="handleSearch"
                v-model="searchTxt">
            </el-input>

            <el-table :data="articleData" border style="width: 100%">
                <el-table-column label="发布时间" align="center">
                    <template #default="scope">
                        <div>{{ parseDateTime(scope.row.date) }} </div>
                    </template>
                </el-table-column>
                <el-table-column label="标题" align="center">
                    <template #default="scope">
                        <el-input v-model="scope.row.title"></el-input>
                    </template>
                </el-table-column>

                <el-table-column label="活动详情" align="center">
                    <template #default="scope">

                        <el-input v-model="scope.row.description"></el-input>
                    </template>
                </el-table-column>

                <el-table-column label="活动截止时间" align="center" width="250px">
                    <template #default="scope">
                        <div>{{ parseDateTime(scope.row.deadline) }}</div>
                        <el-input type="datetime-local" v-model="scope.row.deadline"></el-input>
                    </template>
                </el-table-column>

                <el-table-column label="重新上传封面图" width="300" align="center">
                    <template #default="scope">
                        <div class="cover">
                            <el-image style="width: 150px; height: 150px;" :src="`${baseURL}${staticURL}${scope.row.cover}`"
                                :preview-src-list="[`${baseURL}${staticURL}${scope.row.cover}`]" preview-teleported="true"
                                previewTeleported>
                            </el-image>
                            <el-upload class="upload-demo" :action="`${baseURL}/api/adminServer/volunteer/cover`"
                                :on-success="function (res) { cover_upload_success(res, scope.row._id, scope.row.cover) }"
                                :before-upload="cover_before_upload" :limit="1" :with-credentials="true"
                                :show-file-list="false">
                                <el-button size="large" type="warning" style="margin: auto 0">重传封面</el-button>
                            </el-upload>
                        </div>

                    </template>
                </el-table-column>
              <el-table-column
                  fixed="right"
                  label="数据导出"
                  align="center"
              >
                <template #default="scope">


                  <svg-icon icon="download" style="width: 35px;height: 35px; cursor: pointer;" @click="downloadExcel(scope.row._id,String(scope.row.title))"></svg-icon>


                </template>

              </el-table-column>
              <el-table-column
                  fixed="right"
                  label="数据导入"
                  align="center"
              >
                <template #default="scope">


                  <svg-icon icon="download" style="width: 35px;height: 35px; cursor: pointer;" @click="downloadExcel(scope.row._id,String(scope.row.title))"></svg-icon>


                </template>

              </el-table-column>
                <el-table-column fixed="right" label="操作1" align="center">
                    <template #default="scope">

                        <el-button type="primary"
                            @click="update(scope.row._id, { title: scope.row.title, description: scope.row.description, deadline: scope.row.deadline })"
                            size="large">修改
                        </el-button>


                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作2" align="center">
                    <template #default="scope">


                        <el-button color="#7d50f4" type="success" @click="editNews(scope.row._id)" size="large">报名数据
                        </el-button>


                    </template>

                </el-table-column>

              <el-table-column
                  label="量化活动"
                  align="center"

              >
                <template #default="scope">
                  <el-switch

                      v-model="scope.row.quantization"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-text="是"
                      inactive-text="否"
                      @change="switchHandle(scope.row)"
                  >
                  </el-switch>
                </template>
              </el-table-column>
                <el-table-column fixed="right" label="操作3" align="center">
                    <template #default="scope">


                        <el-button type="danger" @click="openIsCadre(scope.row._id, scope.row.cover,scope.row.title)" size="large">删除
                        </el-button>


                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-if="display" background layout="sizes,prev,pager,next,jumper,->,slot, total" :total="total"
                v-model:page-size="query.perPage" v-model:current-page="query.page" @current-change="getArticles"
                @size-change="getArticles" :page-sizes="[2, 5, 10, 20, 30]" />
        </div>
    </el-card>
</template>

<script>
import {exportToExcel} from "../../utils/xlsx.ts";
import {ElMessage, ElMessageBox} from "element-plus";
export default {
    name: "ArticleManger",
    data() {
        return {
            articleData: [],
            AllArticleData: [],
          exportActiveData:[],
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
      openIsCadre(id, cover, title) {
        ElMessageBox.confirm(
            `你确定要删除${title}活动?`,
            'Warning',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
        )
            .then(() => {

              this.deleteArticle(id,cover)
            })
            .catch((res) => {
              console.log(res)
              console.log(1)
              ElMessage({
                type: 'info',
                message: '您已取消',
              });

            });

      },
      async switchHandle(item) {
        let {data} = await this.$axios({
          method: "POST",
          url: "/api/adminServer/volunteer/quantization",
          data: {
            activityId: item._id,
            quantization: item.quantization,
          }
        })
        if (data.code) {
          await this.getUserData()
          return this.$message.error(data.msg)

        }
        this.$message.success(data.msg)
        await this.getArticles()
      },

     async downloadExcel(id,title){
        let {data} = await this.$axios({
          method: "GET",
          url: "/api/adminServer/get/volunteerInfo",
          params:{id:id}
        })

        if (data.code) {
          return this.$message.error(data.msg)
        }
       console.log(data)
        this.exportActiveData = data.data
        exportToExcel(this.exportActiveData,title)
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

        //搜索
        handleSearch() {
            clearTimeout(this.timer)
            this.timer = setTimeout(async () => {
                let txt = this.searchTxt.trim()
                if (!txt) {
                    return this.articleData = this.AllArticleData
                }
                let { data } = await this.$axios({
                    method: "GET",
                    url: "/api/adminServer/volunteer/searchVt",
                    params: { query: txt }
                })
                this.articleData = []
                this.articleData = data.data
            }, 500)
        },

        //请求所有文章数据
        async getArticles() {
            let { data } = await this.$axios({
                method: "get",
                url: "/api/get/activeData",
                params: this.query
            })

            if (data.code) {
                return this.$message.error(data.msg)
            }
            this.articleData = []
            this.searchTxt = ""
            this.AllArticleData = data.data
            this.total = data.total
            if (this.total == 0) {
                this.display = false
            }
            this.handleSearch()
        },

        //更新活动
        async update(id, doc) {
            let { data } = await this.$axios({
                method: "POST",
                url: "/api/adminServer/volunteer/update",
                data: { id, doc }
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
            this.update(id, { cover: res.url }, mdUrl)
        },

        //删除文章
        async deleteArticle(id, vtCover) {
            let { data } = await this.$axios({
                method: "DELETE",
                url: "/api/adminServer/volunteer/delete",
                data: { id, vtCover }
            })

            if (data.code) {
                return this.$message.error(data.msg)
            }

            this.$message.success("删除完成")
            await this.getArticles()
        },
        //修改文章
        async editNews(id) {
            this.$router.push({ name: 'volunteerID', query: { id: id } });
        }
    },
mounted() {
  this.getArticles()
},
  created() {

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














