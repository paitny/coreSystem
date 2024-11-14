<template>
  <div id="userAdmin">
    <el-table
        :data="userData"
        border
        style="width: 100%"
    >
      <el-table-column
          type="index"
          label="序号"
          align="center"
          width="200px"
      >

      </el-table-column>
      <el-table-column
          prop="date"
          label="交卷时间"
          :formatter="dateFormat"
          width="200px"
          align="center"
      >

      </el-table-column>

      <el-table-column
          prop="name"
          label="姓名"
          align="center"
      >

      </el-table-column>

      <el-table-column
          prop="sex"
          label="性别"
          align="center"
      >

      </el-table-column>



      <el-table-column
          prop="institution"
          label="机构"
          align="center"
      >
      </el-table-column>
      <el-table-column
          prop="position"
          label="职位"
          align="center"
      >
      </el-table-column>
      <el-table-column
          prop="totalScore"
          label="得分"
          align="center"
      >
      </el-table-column>
      <el-table-column
          prop="reviewer"
          label="评卷人"
          align="center"
      >
      </el-table-column>
      <el-table-column
          fixed="right"
          label="阅卷"
          align="center"
      >
        <template #default="scope">
          <el-button
              type="primary"
              @click="editNews(scope.row.id)"
              size="large"
          >阅卷
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
          fixed="right"
          label="超级管理员操作"
          align="center"
      >
        <template #default="scope">
          <el-button
              type="danger"
              @click="deleteUser(scope.row.id)"
              size="large"
          >试卷删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from 'moment'
import io from 'socket.io-client';
export default {
  name: "ContactMsg",
  data() {
    return {
      socket: null,
      userData: [],
    }
  },
  // 使用 Vue.js 中的 watch 属性监听数据的变化
  watch: {
    userData: {
      handler(newValue, oldValue) {
        // 当数据发生变化时，执行相应的操作
        this.fetchData();
      },
      deep: true,
    },
  },
  computed:{
    userInfo() {
      return this.$store.state.user.userInfo;
    },
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
    //请求所有数据
    async getUserData() {
      let {data} = await this.$axios({
        method: "GET",
        url: "/api/adminServer/get/userExamsData",
        params:{examId:this.$route.query.id}
      })
      if (data.code) {
        return this.$message.error(data.msg)
      }
      this.userData = data

    },
    //用户注销
    async deleteUser(id) {
      try {
        let {data} = await this.$axios({
          method: "DELETE",
          url: "/api/adminServer/examine/delete",
          data: {userExamId:id}
        })
        this.$message.success(data.message)

        await this.getUserData()
      }catch (error){
        if(error){
          return this.$message.error("你不是超级管理员")
        }

      }

    },
//修改文章
    async editNews(id) {
      const routeUrl =  this.$router.resolve({ name: 'examineUserData', query: { id: id } });
      window.open(routeUrl.href, '_blank')
    },

    async fetchData() {
      // 向服务器发送 'fetchData' 请求，并携带参数
      const examineId =await this.$route.query.id; // 替换成实际的 examineId

      // 确保 socket 对象存在
      if (this.socket) {
      await  this.socket.emit('fetchData', { examineId,userId: this.userInfo._id});
      } else {
        console.error('Socket 连接不存在。');
      }
    },
  },
  created() {


  },
  mounted() {
    const socketURL = process.env.NODE_ENV === "development" ? 'http://localhost:5200' : 'https://wypty.cn'
    this.socket = io(socketURL);
    this.fetchData()
    // 监听来自服务器的 userExamsData 事件
    this.socket.on('userExamsData', (data) => {
      this.userData = data;
    });
  },
  beforeRouteLeave() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
}
</script>

<style scoped>

</style>














