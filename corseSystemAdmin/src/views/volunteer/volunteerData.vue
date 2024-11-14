<template>
    <div id="userAdmin">
      <el-table
          :data="userData"
          border
          style="width: 100%"

      >
        <el-table-column
            prop="registrationTime"
            label="报名时间"
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
            prop="ID"
            label="学号"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="grade"
            label="年级"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="classes"
            label="班级"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="phoneNumber"
            label="手机号"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="counsellor"
            label="辅导员"
            align="center"
        >
        </el-table-column>
        <el-table-column
            fixed="right"
            label="超级管理员操作"
            align="center"
        >
          <template #default="scope">
            <el-button
                type="danger"
                @click="deleteUser(scope.row._id)"
                size="large"
            >删除报名
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>

  <script>
  import moment from 'moment'

  export default {
    name: "ContactMsg",
    data() {
      return {
        userData: [],
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
      //请求所有数据
      async getUserData() {
        let {data} = await this.$axios({
          method: "GET",
          url: "/api/get/volunteerInfo",
          params:{id:this.$route.query.id}
        })
        if (data.code) {
          return this.$message.error(data.msg)
        }
        this.userData = data.data

      },
      //用户注销
      async deleteUser(id) {
        let {data} = await this.$axios({
          method: "DELETE",
          url: "/api/adminServer/volunteer/deleteVtInfo",
          data: {id}
        })
        if (data.code) {
          return this.$message.error(data.msg)
        }
        this.$message.success("已删除此人报名数据")
        await this.getUserData()
      },


    },
    created() {
      this.getUserData()

    }
  }
  </script>

  <style scoped>

  </style>














