<template>
  <el-card>


    <div class="semester">— 用户账号批量注册、更新操作 —</div>

    <div style="display: flex;align-items: center;justify-content: space-between;min-width: max-content;">


      <el-button color="#626aef" plain @click="openIsCadre" v-if="regUsersData.length">确认操作</el-button>

      <el-upload
          class="upload-demo"

          action=""
          :auto-upload="false"
          :on-change="handleChange"
          :show-file-list="false"
          v-else
      >
        <el-button color="#626aef" plain>普通用户注册</el-button>

      </el-upload>

      <el-upload
          class="upload-demo"

          action=""
          :auto-upload="false"
          :on-change="handleCadresChange"
          :show-file-list="false"
           v-if="cadreStudent.length===0"
      >
        <el-button color="#626aef" plain>学干注册导入</el-button>

      </el-upload>
      <div v-if="cadreStudent.length>0">
       届数:<el-input v-model="due" placeholder="例如:第18届"  style="width: 100px"></el-input>
        <el-button color="#626aef" plain  @click="openIsCadreStudent" v-if="cadreStudent.length">学干注册</el-button>
      </div>



      <div class="searchBox">
        <div>用户查询:&nbsp;</div>
        <div class="demo-input-size">
          <el-input
              v-model="searchTxt"
              size="large"
              placeholder="请输入年级、班级、学号或其他关键字"
              class="input-with-select"
          >
            <template #append>
              <el-button icon="Search" @click="handleSearch"/>
            </template>
          </el-input>
        </div>

      </div>


      <div>

        班级:
        <el-select v-model="selectedGrade" @change="loadClasses" placeholder="选择年级" style="width: 100px">
          <el-option v-for="grade in grades" :key="grade" :label="grade" :value="grade"></el-option>
        </el-select>


        <el-select v-model="selectedClass" placeholder="选择班级" style="width: 200px">
          <el-option v-for="classItem in classes" :key="classItem" :label="classItem" :value="classItem"></el-option>
        </el-select>


        <el-select v-model="selectedLevel" placeholder="选择层次" style="width: 100px">
          <el-option v-for="level in levels" :key="level" :label="level" :value="level"></el-option>
        </el-select>
        <el-button type="primary" icon="Search" @click="getPointClass"></el-button>

      </div>
      <a  href="https://wypty.cn/static/file/material/register.xlsx" download="test">  <el-button type="success"  plain >模版.xlsx</el-button></a>

    </div>


    <div id="userAdmin">
      <el-table
          :data="paginatedData"
          border
          v-loading="loading"
          element-loading-text="正在注册更新中,1-5分钟左右,请稍后..."
          :element-loading-spinner="svg"
          class="custom-loading-svg"
          element-loading-svg-view-box="-10, -10, 50, 50"
      >
        <el-table-column label="序号" width="60" align="center">
          <template #default="scope">
            {{ (query.currentPage - 1) * query.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
            prop="faculty"
            label="学院"
            align="center"
        >

        </el-table-column>
        <el-table-column
            prop="num"
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
            prop="num"
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
            prop="class"
            label="专业班级"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="levels"
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
            prop="chamber"
            label="寝室"
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
            prop="counsellor"
            label="辅导员"
            align="center"
        >
        </el-table-column>
      </el-table>

    </div>
    <el-pagination
        v-if="userData.length"
        background
        layout="sizes,prev,pager,next,jumper,->,total"
        :total="total"
        v-model:page-size="query.pageSize"
        v-model:current-page="query.currentPage"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[2, 5, 10, 20, 30 ,50]"
    />
  </el-card>

</template>

<script>

import {ElMessage, ElMessageBox} from 'element-plus';
import * as XLSX from 'xlsx'

export default {
  name: "ContactMsg",
  data() {
    return {
      setOpenCadre: false,
      due: "",
      userData: [],
      AllUserData: [],
      display: true,
      timer: null,
      searchTxt: "",
      grades: [],
      selectedGrade: "",
      setCadreTitle: "",
      selectedClass: "",
      selectedBranch: "",
      classes: [],
      levels: [],
      selectedLevel: "",
      query: {
        currentPage: 1, // 当前页码
        pageSize: 10, // 每页显示条数
      },
      counsellor: '',
      filenameTxt: "",
      regUsersData: [],
      gradeClassArr: [],
      cadreStudent:[],
      loading: false,
      svg: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
    }
  },
  watch: {
    selectedGrade(newGrade) {
      this.loadClasses();
    }
  },
  computed: {
    // 计算总条数
    total() {
      return this.userData.length
    },
    // 计算当前需要显示的数据
    paginatedData() {
      const startIndex = (this.query.currentPage - 1) * this.query.pageSize
      const endIndex = startIndex + this.query.pageSize
      return this.userData.slice(startIndex, endIndex)
    },
  },
  methods: {
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
        console.log(this.grades)
      } catch (error) {
        console.error('获取数据时出错:', error);
      }
    },
    downloadFile() {
      // 构建文件的 URL，这里假设文件名为 example.txt，路径为 /static/example.txt
      const fileUrl = '../../assets/xlsx/register.xlsx';
      // 构建文件名
      const fileName = 'register.xlsx';
      // 创建一个 <a> 标签
      const link = document.createElement('a');
      // 设置 <a> 标签的 href 属性为文件的 URL
      link.href = fileUrl;
      // 设置 <a> 标签的 download 属性为文件名
      link.download = fileName;
      // 将 <a> 标签添加到 DOM 中
      document.body.appendChild(link);
      // 模拟点击 <a> 标签来触发文件下载
      link.click();
      // 下载完成后移除 <a> 标签
      document.body.removeChild(link);
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


    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleSizeChange(val) {
      this.pageSize = val
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
        学院: 'faculty',
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target.result
        const workbook = XLSX.read(data, {type: 'array'})
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // 获取第一行作为表头
        const headers = XLSX.utils.sheet_to_json(worksheet, {header: 1})[0]

        // 将中文表头映射为英文字段名称
        const mappedHeaders = headers.map(header => headerMap[header] || header)

        // 解析为 JSON 数据并将映射后的表头作为 key
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: mappedHeaders, range: 1})

        this.userData = jsonData
        this.regUsersData = jsonData
        this.total = userData.length

      }
      reader.readAsArrayBuffer(file.raw)
    },
    handleCadresChange(file) {
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
        学院: 'faculty',
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target.result
        const workbook = XLSX.read(data, {type: 'array'})
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // 获取第一行作为表头
        const headers = XLSX.utils.sheet_to_json(worksheet, {header: 1})[0]

        // 将中文表头映射为英文字段名称
        const mappedHeaders = headers.map(header => headerMap[header] || header)

        // 解析为 JSON 数据并将映射后的表头作为 key
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: mappedHeaders, range: 1})

        this.userData = jsonData
        this.cadreStudent=jsonData
        this.total = userData.length

      }
      reader.readAsArrayBuffer(file.raw)
    },

    openIsCadre() {
      ElMessageBox.confirm(
          `你确定要注册${this.regUsersData[0].name}等${this.total}位同学`,
          'Warning',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {

            this.regCounsellor()
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
    openIsCadreStudent() {
      if(this.due.trim()===''){
        return this.$message.error("请输入要注册的学生干部届数")
      }
      ElMessageBox.confirm(
          `你确定要注册${this.cadreStudent[0].name}等${this.total}位${this.due}学生干部名单`,
          'Warning',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {

            this.regCounsellorCadre()
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

    async regCounsellor() {
      this.loading = true
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/updateData/updateUsersFromJson",
        data: {regUsersData: this.regUsersData}
      })
      console.log(data)
      this.$message.success(data.results[0].message)
      this.loading = false
      this.regUsersData = []
    },
    async regCounsellorCadre() {
      this.loading = true
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/updateData/updateUsersFromJsonCadre",
        data: {due:this.due,regUsersData: this.cadreStudent}
      })
      this.$message.success(data.results[0].message)
      this.loading = false
      this.cadreStudent = []
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


    //请求所有数据
    async getUserData() {
      this.searchTxt = ""
      let {data} = await this.$axios({
        method: "GET",
        url: "/api/adminServer/get/user",
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


  },

  mounted() {
    this.loadData()

    this.selectedGrade = this.grades[0];


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
  margin-bottom: 40px;
}

#userAdmin {
  margin-top: 20px;
}
</style>














