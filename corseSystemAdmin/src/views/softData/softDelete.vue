<template>
  <el-card>
  <div>
    <div class="table-container">
      <el-table :data="tableData" border >
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column prop="deletedAt" :formatter="dateFormat" label="删除时间" align="center" />
        <el-table-column prop="_id" label="id" align="center" />
        <el-table-column prop="tableName" label="数据库表名" align="center" />
        <el-table-column label="被删数据" align="center">
          <template #default="scope">

              <el-tooltip class="item" effect="dark" :content="JSON.stringify(scope.row) " placement="top-start">
                <div class="data-column">
                <span>{{ truncateText(scope.row) }}</span>
                </div>
              </el-tooltip>

          </template>
        </el-table-column>
        <el-table-column prop="isDeleted" label="已删除" align="center" />
        <el-table-column label="操作" align="center" width="120">
          <template #default="scope">
            <el-button type="success" plain @click="openLogout(scope.row,scope.row._id,scope.row.tableName)">
              <el-icon><Refresh/></el-icon>
              恢复
            </el-button>
          </template>
        </el-table-column>

      </el-table>


    </div>
  </div>
    <el-pagination
        background
        layout="sizes,prev,pager,next,jumper,->,slot, total"
        :total="totalCount"
        v-model:page-size="pageSize"
        v-model:current-page="currentPage"
        @current-change="getSoftDataInfo"
        @size-change="getSoftDataInfo"
        :page-sizes="[2,5,10,20,30]"

    />
  </el-card>
</template>

<script>
import axios from 'axios';
import moment from "moment";
import {ElMessage, ElMessageBox} from "element-plus";


export default {
  data() {
    return {
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示数量
      totalCount: 0, // 总数据数量
      tableData: []
    };
  },
  computed: {

  },
  methods: {
    openLogout(data,name, id) {
      ElMessageBox.confirm(
          `${this.truncateText( JSON.stringify(data)) }`,
          '还原该数据',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            this.SoftDataInfoRecover(name, id)

          })
          .catch(() => {

            ElMessage({
              type: 'info',
              message: '您已取消',
            });
          });
    },
    async getSoftDataInfo() {
      const { data } = await axios.get('/api/softDelete/deleted-data', {
        params: {
          page: this.currentPage,
          limit: this.pageSize
        }
      });
      this.tableData = data.data; // 获取当前页的数据
      console.log(data)
      this.totalCount = data.totalCount; // 获取总数
    },
    async SoftDataInfoRecover(id,tableName) {
    this.$axios({
        method: 'POST',
        url:"/api/softDelete/recover",
        data:{tableName,id}
      }).then((res)=>{
        if (res.status===200){
          this.$message.success(res.data)
        }else{
          this.$message.error(res.data)
        }

    })
      await this.getSoftDataInfo()
    },
    refreshData(row) {
      // 这里可以添加刷新该行数据的逻辑
      console.log('刷新数据:', row);
    },
    dateFormat: function (row, column) {
      let date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    truncateText(text) {
      return text.length > 20 ? text.slice(0, 20) + '...' : text; // 控制显示文本长度
    }
  },
  async mounted() {
    await this.getSoftDataInfo();
  }
};
</script>

<style>


.data-column {
  height: 60px; /* 控制被删数据列的高度 */
  line-height: 60px; /* 使文本垂直居中 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 文本溢出省略号 */
  white-space: nowrap; /* 不换行 */
}
</style>
