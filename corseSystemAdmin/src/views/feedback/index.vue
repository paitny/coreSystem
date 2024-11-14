<template>
  <el-card>


    <div class="semester">— {{ semester }} —</div>


    <div>


    </div>

    <el-dialog v-model="dialogTableVisible" title="批量更新班级辅导员" width="500">
      <el-form-item label="年级:" :label-width="formLabelWidth">
        <el-select v-model="selectedGrade" @change="loadClasses" placeholder="选择年级">
          <el-option v-for="grade in grades" :key="grade" :label="grade" :value="grade"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级:" :label-width="formLabelWidth">
        <el-select v-model="selectedClass" placeholder="选择班级">
          <el-option v-for="classItem in classes" :key="classItem" :label="classItem" :value="classItem"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="层次:" :label-width="formLabelWidth">
        <el-select v-model="selectedLevel" placeholder="选择层次">
          <el-option v-for="level in levels" :key="level" :label="level" :value="level"></el-option>
        </el-select>
      </el-form-item>
      <el-form :model="form">
        <el-form-item label="辅导员:" :label-width="formLabelWidth">
          <el-input v-model="counsellor" autocomplete="off"/>
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancellation">取消</el-button>
          <el-button type="primary" @click="openCounsellor">
            更新
          </el-button>
        </div>
      </template>
    </el-dialog>


    <div id="userAdmin">
      <el-table
          :data="userData"
          border
      >
        <el-table-column
            prop="createdAt"
            label="提交日期"
            :formatter="dateFormat"
            align="center"
        >

        </el-table-column>
        <el-table-column
            prop="faculty"
            label="学院"
            align="center"
        >

        </el-table-column>
        <el-table-column
            prop="account"
            label="账号"
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
            prop="studentId"
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
            label="专业班级"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="level"
            label="层次"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="phone"
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
            prop="description"
            label="问题描述"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="isRead"
            label="状态"
            align="center"
        >
          <template #default="scope">
            <span>{{ scope.row.isRead ? '已处理' : '未处理' }}</span>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="超级管理员操作"
            align="center"
        >
          <template #default="scope">
            <el-button
                :type="scope.row.isRead ? 'success' : 'warning'"
                @click="openHandle(scope.row.name,scope.row._id,scope.row.isRead)"
                size="small"
                plain
            >{{ scope.row.isRead ? '已读' : '未读' }}
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
                type="success"
                @click=" openIsCadre(scope.row._id,scope.row.name,scope.row.account,scope.row.sex,scope.row.faculty,scope.row.studentId,scope.row.grade,scope.row.classes,scope.row.level,scope.row.phone,scope.row.counsellor)"
                size="small"
            >注册更新
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
                type="primary"
                @click="open(scope.row.name,scope.row._id,scope.row.account)"
                size="small"
            >密码重置
            </el-button>
          </template>

        </el-table-column>


      </el-table>

    </div>
    <el-dialog v-model="setOpenCadre"
               :title="setCadreTitle"
               width="500">
      <el-form-item label="学生机构:" :label-width="formLabelWidth">
        <el-input v-model="due" disabled></el-input>
      </el-form-item>
      <el-form-item label="学生机构:" :label-width="formLabelWidth">
        <el-select v-model="selectedInstitution" @change="loadClasses" placeholder="选择机构">
          <el-option v-for="institution in institutions" :key="institution" :label="institution"
                     :value="institution"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学生部门:" :label-width="formLabelWidth">
        <el-select v-model="selectedBranch" placeholder="选择部门">
          <el-option v-for="classItem in branches" :key="classItem" :label="classItem"
                     :value="classItem"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学生部门:" :label-width="formLabelWidth">
        <el-select v-model="selectedPosition" placeholder="选择职位">
          <el-option v-for="position in position" :key="position" :label="position"
                     :value="position"></el-option>
        </el-select>
      </el-form-item>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancellation">取消</el-button>
          <el-button type="primary" @click="openSetCadreInfo">
            更新
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-pagination
        v-if="display"
        background
        layout="sizes,prev,pager,next,jumper,->,slot, total"
        :total="total"
        v-model:page-size="query.perPage"
        v-model:current-page="query.page"
        @current-change="getUserData"
        @size-change="getUserData"
        :page-sizes="[2,5,10,20,30]"

    />
  </el-card>

</template>

<script>

import {ElMessage, ElMessageBox} from 'element-plus';
import moment from 'moment'
import {exportUserToExcel} from "../../utils/xlsx.ts";
import * as XLSX from 'xlsx'
import {getCurrentSemester} from "../../utils/currentSemester.ts";

export default {
  name: "ContactMsg",
  data() {
    return {
      setOpenCadre: false,
      due: "第18届",
      userData: [],
      AllUserData: [],
      display: true,
      total: 0,
      timer: null,
      searchTxt: "",
      semester: "",
      courseList: [],
      students: [],
      grades: ["2020级", "2021级", "2022级", "2023级"],
      selectedGrade: "",
      institutions: ["分团委", "学生分会", "校友分会", "学生公寓自我管理委员会分会", "分团委学生社团管理部"],
      selectedInstitution: "",
      classes: [],
      setCadreTitle: "",
      selectedPosition: "",
      position: ["负责人", "干事", "队长"],
      branches: [],
      selectedClass: "",
      selectedBranch: "",
      levels: ["本", "专升本", "专"],
      selectedLevel: "",
      query: {
        page: 1,
        perPage: 10
      },
      counsellor: '',
      dialogTableVisible: false,
      dialogFormVisible: true,
      form: {},
      formLabelWidth: "140px",
      setUserId: "",
      filenameTxt: "",
      regUsersData:[]
    }
  },
  watch: {
    selectedGrade(newGrade) {
      this.loadClasses();
    },
    selectedInstitution(newInstitution) {
      this.loadBranches()
    }
  },

  methods: {
    openHandle(name,id,isRead){
      if(isRead){
        ElMessageBox.confirm(
            `你确定要将${name}同学的反馈信息设置未读吗?`,
            'Warning',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }

        )  .then(() => {

          this.handleSetIsRead(id)
        })
            .catch((res) => {

              ElMessage({
                type: 'info',
                message: '您已取消',
              });

            });
      }else {
        ElMessageBox.confirm(
            `你确定要将${name}同学的反馈信息设置已读吗?`,
            'Warning',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }

        )  .then(() => {

          this.handleSetIsRead(id)
        })
            .catch((res) => {

              ElMessage({
                type: 'info',
                message: '您已取消',
              });

            });
      }

    },
  async  handleSetIsRead(id){
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/feedback/toggle-read",
        data:{id}
      })
    this.$message.success("处理完成")
   await this.getUserData()

    },
    openIsCadre(id,name,user,sex,faculty,num,grade,classes,levels,phone,counsellor) {

      const data = [{
        name,
        user,
        sex,
        faculty,
        num,
        grade,
        class:classes,
        levels,
        phone,
        counsellor
      }];
      ElMessageBox.confirm(
          `你确定要注册更新${name}同学的账号信息吗?`,
          'Warning',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }

      )  .then(() => {

            this.regCounsellor(id,data)
          })
          .catch((res) => {
            ElMessage({
              type: 'info',
              message: '您已取消',
            });

          });

    },
    async loadData() {
      try {
        const response = await this.$axios({
          method: "GET",
          url: "/api/adminServer/get/gradeClass",

        })
        this.gradeClassArr = response.data
        this.grades = response.data.map(item => item.grade);

        this.selectedGrade = this.grades[0]
        this.getClassesAndLevelsByGrade(this.selectedGrade)
        this.loadClasses()
        this.selectedClass = this.classes[0]
        this.selectedLevel = this.levels[0]

      } catch (error) {
        console.error('获取数据时出错:', error);
      }
    },
    loadClasses() {
      const {classNames, levels} = this.getClassesAndLevelsByGrade(this.selectedGrade);
      this.classes = classNames;
      this.levels = levels;
    },

    // 根据年级获取对应的班级和层次
    getClassesAndLevelsByGrade(grade) {
      const filteredData = this.gradeClassArr.find(item => item.grade === grade);
      return filteredData ? {classNames: filteredData.classNames, levels: filteredData.levels} : {
        classNames: [],
        levels: []
      };
    },
    toRegisterPage(){
      this.$router.push("/userRegister")
    },

    handleChange(file) {
      const headerMap = {
        学号: 'num',
        辅导员: 'counsellor',
        年级: 'grade',
        班级: 'class',
        层次: 'levels',
        姓名: 'name',
        手机号: 'phone',
        性别: 'sex',
        机构: 'institution',
        职位: 'position',
        寝室号: 'chamber',
        学院:'faculty',
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target.result
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // 获取第一行作为表头
        const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0]

        // 将中文表头映射为英文字段名称
        const mappedHeaders = headers.map(header => headerMap[header] || header)

        // 解析为 JSON 数据并将映射后的表头作为 key
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: mappedHeaders, range: 1 })

        this.userData=jsonData
        this.regUsersData=jsonData
        this.regCounsellor()
      }
      reader.readAsArrayBuffer(file.raw)
    },


    cancellation() {
      this.dialogTableVisible = false
      this.setOpenCadre = false
    },
    openCounsellor() {
      ElMessageBox.confirm(
          `你确定要更新${this.selectedGrade}${this.selectedClass}(${this.selectedLevel})的辅导员?`,
          'Warning',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {

            this.updateCounsellor()
          })
          .catch((res) => {
            ElMessage({
              type: 'info',
              message: '您已取消',
            });

          });

    },
    openSetCadreInfo() {
      ElMessageBox.confirm(
          `你确定要将${this.setCadreTitle}同学设置为${this.selectedInstitution}${this.selectedBranch}${this.selectedPosition}`,
          'Warning',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {

            this.updateIsCadreInfo()
          })
          .catch((res) => {

            ElMessage({
              type: 'info',
              message: '您已取消',
            });

          });

    },
    async updateIsCadreInfo() {
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/updateData/updateCadre",
        data: {
          userId: this.setUserId,
          institution: this.selectedInstitution,
          position: this.selectedBranch + this.selectedPosition,
          isCadre: true,
          due: this.due

        }
      })

      this.setOpenCadre = false


      this.userData = []
      this.userData.push(data.user)
      this.$message.success(data.message)
    },

    openSetCadre(id, grade, classes, levels, name) {
      this.setCadreTitle = "请设置" + grade + classes + levels + name + "同学的学生干部任职情况"
      this.setUserId = id
      this.setOpenCadre = true

    },
    async updateCadre(id) {
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/updateData/updateCancelUserCadre",
        data: {
          userId: id,

        }
      })
      this.userData = []
      this.userData.push(data.user)
      this.$message.success(data.message)


    },
    async updateCounsellor() {
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/updateData/updateCounsellor",
        data: {
          grade: this.selectedGrade,
          className: this.selectedClass,
          levels: this.selectedLevel,
          counsellor: this.counsellor
        }
      })
      this.$message.success(data.message)
      this.dialogTableVisible = false
      await this.getPointClass()
    },
    async regCounsellor(id,userData) {
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/updateData/updateUsersFromJsonFeed",
        data:{id,regUsersData: userData}
      })
      await this.getUserData()
      this.$message.success(data.results[0].message)

    },
    async getPointClass() {
      let {data} = await this.$axios({
        method: "GET",
        url: "/api/adminServer/consumer/searchUsersAppoint",
        params: {
          grade: this.selectedGrade,
          className: this.selectedClass,
          levels: this.selectedLevel,
          counsellor: this.counsellor
        }
      })
      this.userData = data
      this.filenameTxt = this.selectedGrade + this.selectedClass + this.selectedLevel
      this.$message.success("查询成功")
    },
    loadBranches() {
      // // 模拟异步加载班级数据
      // 在实际应用中，这里应该是向后端发送请求获取数据
      setTimeout(() => {
        this.branches = this.getMockInstitution(this.selectedInstitution);

      }, 500);
    },
    open(name, id, user) {
      ElMessageBox.confirm(
          `你确定要重置${name}同学的账户密码?`,
          'Warning',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            this.resertPass(id, user)

          })
          .catch((res) => {

            ElMessage({
              type: 'info',
              message: '您已取消',
            });

          });
    },
    openLogout(name, id) {
      ElMessageBox.confirm(
          `你确定要注销${name}同学的账户,请谨慎使用该功能，注销后该账户将不复存在?`,
          'Warning',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            this.deleteUser(id)

          })
          .catch(() => {

            ElMessage({
              type: 'info',
              message: '您已取消',
            });
          });
    },
    //获取本学期是哪一学年度第几学期

    get_current_academic_year() {

        this.semester = getCurrentSemester();

    },


    //导出搜索用户
    exportUser() {
      if (this.filenameTxt.trim() === "") {
        this.$message.error("数据未搜索，不可导出xlsx文件")
      } else {
        exportUserToExcel(this.userData, this.filenameTxt)
        this.$message.success("数据导出成功")
      }

    },
    //搜索
    handleSearch() {
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        let txt = this.searchTxt.trim()
        if (!txt) {
          this.filenameTxt = ""
          this.userData = []
          await this.getUserData()
          return this.$message.error("请输入关键字,已请求初始数据")
        }
        let {data} = await this.$axios({
          method: "GET",
          url: "/api/adminServer/consumer/searchUser",
          params: {query: txt}
        })
        this.userData = []
        this.userData = data.data
        this.filenameTxt = this.searchTxt
      }, 500)
    },
    //重置密码
    async resertPass(id,user) {
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/consumer/resetPassFeed",
        data: {id, user}
      })
      if (data.code) {
        return this.$message.error(data.msg)
      }
      this.$message.success(data.msg)
      await this.getUserData()
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
      this.searchTxt = ""
      let {data} = await this.$axios({
        method: "GET",
        url: "/api/adminServer/get/feedbacks",
        params: this.query
      })

      if (data.code) {
        return this.$message.error(data.msg)
      }
      this.userData = data.data
      this.total = data.total
      if (this.total == 0) {
        this.display = false
      }


    },
    async courseAdd(userId, name, due, isCadre, institution, position, coursesList) {
      this.searchTxt = ""
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/course/updateAddCourse",
        data: {userId, name, due, isCadre, institution, position, termName: this.semester, coursesList}
      })

      if (data.code) {
        return this.$message.error(data.msg)
      }

      this.$message.success(data.message)


    },
    //用户注销
    async deleteUser(id) {
      let {data} = await this.$axios({
        method: "DELETE",
        url: "/api/adminServer/consumer/delete",
        data: {id}
      })
      if (data.code) {
        return this.$message.error(data.msg)
      }
      this.$message.success("用户已注销")
      await this.getUserData()
    },
    //管理员
    //switch切换触发
    async switchHandle(item) {
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/consumer/admin",
        data: {
          id: item._id,
          admin: item.admin,
        }
      })
      if (data.code) {
        await this.getUserData()
        return this.$message.error(data.msg)

      }
      this.$message.success(data.msg)
      await this.getUserData()
    },
    course_upload_success(res, userId, name, due, isCadre, institution, position) {
      //失败
      if (res.code) {
        return this.$message.error(res.msg)
      }

      //成功
      this.courseList = res.data.filter(item => {
        if (
            item.name === null ||
            item.num === null ||
            item.section === null ||
            item.sectionCount === null
        ) {
          return false; // 如果特定属性有任何一个为null，就排除该数据
        }
        return true; // 如果所有特定属性都不为null，保留该数据
      });
      this.courseAdd(userId, name, due, isCadre, institution, position, this.courseList)
    },

    course_before_upload(file) {

      let ifMic = /\.xlsx?$/.test(file.name)
      if (!ifMic) {
        this.$message.error("只能上传excel文件")
      }
      return ifMic
    },

  },
  mounted() {
    this.loadData()
    this.getUserData()
    this.get_current_academic_year()

  },
  created() {

  }
}
</script>

<style scoped lang="scss">
.studentTable {
  margin-top: 20px;
}

.searchBox {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.demo-input-size {
  width: 200px;
}

:deep(.el-input-group__append ) {
  background-color: pink;
  color: #fff;
}

.userSearch {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;

  .search {
    width: 95%;
  }

  .export {
    cursor: pointer;
  }
}

.semester {
  text-align: center;
  margin-bottom: 10px;
}

#userAdmin {
  margin-top: 20px;
}
</style>














