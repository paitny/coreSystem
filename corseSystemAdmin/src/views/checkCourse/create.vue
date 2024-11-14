<template>
  <el-card>


    <div class="semester">— {{ semester }} —</div>

    <div style="display: flex;align-items: center;justify-content: space-around;min-width: max-content;">
      <div class="searchBox">
        <div>全局查询:&nbsp;</div>
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
      <div style="display: flex;align-items: center">
        <div style="min-width: 50px">
          班级:
        </div>

        <!-- 年级选择框 -->
        <el-select v-model="selectedGrade" placeholder="请选择年级" @change="onGradeChange" style="min-width: 100px">
          <el-option v-for="grade in grades" :key="grade" :value="grade">{{ grade }}</el-option>
        </el-select>

        <!-- 班级选择框 -->
        <el-select v-model="selectedClass" placeholder="请选择班级" @change="onClassChange" style="min-width: 200px">
          <el-option v-for="classItem in filteredClasses" :key="classItem" :value="classItem">{{ classItem }}</el-option>
        </el-select>

        <!-- 层次选择框（单选） -->
        <el-select v-model="selectedLevel" placeholder="请选择层次" style="min-width: 100px">
          <el-option v-for="levelItem in filteredLevels" :key="levelItem" :value="levelItem">{{ levelItem }}</el-option>
        </el-select>
        <el-button type="primary" icon="Search" @click="getPointClass">Search</el-button>

      </div>


    </div>

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
            prop="date"
            label="注册日期"
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
            prop="level"
            label="层次"
            align="center"
        >
        </el-table-column>

        <el-table-column
            prop="counsellor"
            label="辅导员"
            align="center"
        >
        </el-table-column>
        <el-table-column label="课程更新" align="center" width="80">
          <template #default="scope">
            <el-upload
                class="upload-demo"
                :action="`${baseURL}/api/Curriculum/upload`"
                :on-success="function(res){course_upload_success(res,scope.row._id,scope.row.grade,scope.row.class,scope.row.level)}"
                :before-upload="course_before_upload"
                :limit="1"
                :with-credentials="true"
                :show-file-list="false"
            >
              <svg-icon icon="course" style="width: 30px;height: 30px"></svg-icon>
            </el-upload>
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
                @click="openClassCourse(scope.row._id,scope.row.grade,scope.row.class,scope.row.level)"
                size="large"
            >课表查询
            </el-button>
          </template>
        </el-table-column>

      </el-table>

    </div>


    <el-dialog v-model="setOpenCadres"
               :title="setCadreTitle"
               width="800">
      <el-form v-if="isCadre===false">
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
        <el-form-item label="部门职位:" :label-width="formLabelWidth">
          <el-select v-model="selectedPosition" placeholder="选择职位">
            <el-option v-for="position in position" :key="position" :label="position"
                       :value="position"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancellationCard">取消</el-button>
          <el-button type="primary" @click="SetCadreInfo">
            确定授予学干职位
          </el-button>


        </div>
      </template>
    </el-dialog>



    <el-dialog v-model="setOpenCadre"
               :title="setCadreTitle"
               width="800">
      <el-form :model="form">
        <el-form-item label="姓名:" :label-width="formLabelWidth">
          <el-input v-model="updateFrom.name" autocomplete="off"/>
        </el-form-item>

      </el-form>
      <el-form :model="form">
        <el-form-item label="性别:" :label-width="formLabelWidth">
          <el-input v-model="updateFrom.sex" autocomplete="off"/>
        </el-form-item>

      </el-form>
      <el-form-item label="年级:" :label-width="formLabelWidth">
        <el-select v-model="updateFrom.grade" @change="loadClasses" placeholder="选择年级">
          <el-option v-for="grade in grades" :key="grade" :label="grade" :value="grade"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级:" :label-width="formLabelWidth">
        <el-select v-model="updateFrom.classes" placeholder="选择班级">
          <el-option v-for="classItem in classes" :key="classItem" :label="classItem" :value="classItem"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="层次:" :label-width="formLabelWidth">
        <el-select v-model="updateFrom.levels" placeholder="选择层次">
          <el-option v-for="level in levels" :key="level" :label="level" :value="level"></el-option>
        </el-select>
      </el-form-item>
      <el-form :model="form">
        <el-form-item label="学号:" :label-width="formLabelWidth">
          <el-input v-model="updateFrom.num" autocomplete="off"/>
        </el-form-item>

      </el-form>
      <el-form :model="form">
        <el-form-item label="寝室:" :label-width="formLabelWidth">
          <el-input v-model="updateFrom.chamber" autocomplete="off"/>
        </el-form-item>

      </el-form>
      <el-form :model="form">
        <el-form-item label="手机号:" :label-width="formLabelWidth">
          <el-input v-model="updateFrom.phone" autocomplete="off"/>
        </el-form-item>

      </el-form>
      <el-form :model="form">
        <el-form-item label="辅导员:" :label-width="formLabelWidth">
          <el-input v-model="updateFrom.counsellor" autocomplete="off"/>
        </el-form-item>

      </el-form>



      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancellation">取消</el-button>
          <el-button type="primary" @click="openUpdateUserInfo">
            普通更新
          </el-button>
          <el-button
              type="warning"
              v-if="isCadre"
              @click="openIsCadre"
          >学干撤销
          </el-button>
          <el-button type="success" plain @click="openSetCadreInfo" v-else>
            学干授予
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
import {getCurrentSemester} from "../../utils/currentSemester.ts";
import {ElMessage, ElMessageBox} from 'element-plus';
import moment from 'moment'
import {exportUserToExcel} from "../../utils/xlsx.ts";
import * as XLSX from 'xlsx'

export default {
  name: "ContactMsg",
  data() {
    return {
      setOpenCadre: false,
      setOpenCadres:false,
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
      grades: [],
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
      regUsersData: [],
      updateFrom: {
        name: '',
        sex: '',
        grade: '',
        classes: '',
        levels: '',
        chamber: '',
        phone: '',
        num: '',
        counsellor: '',

      },
      isCadre: false
    }
  },
  computed: {
    // 根据选中的年级过滤出班级列表
    filteredClasses() {
      return this.selectedGrade ? Object.keys(this.classesByGrade[this.selectedGrade] || {}) : [];
    },
    // 根据选中的班级过滤出层次列表
    filteredLevels() {
      return this.selectedClass ? this.classesByGrade[this.selectedGrade][this.selectedClass] || [] : [];
    },
  },
  methods: {
    openClassCourse(id, grade, className, level) {

this.$router.push({
  name: 'classCourse', query: {
    id: id, grade: grade,
    className: className,
    level: level
  }
});
},
    onGradeChange() {
      // 选择年级时，保存之前选择的班级和层次
      const previousClass = this.selectedClass;
      this.selectedClass = '';
      this.selectedLevel = '';

      // 如果之前选择的班级在当前年级的班级中，则保持选择，否则选择第一个班级
      if (this.filteredClasses.includes(previousClass)) {
        this.selectedClass = previousClass;
      } else if (this.filteredClasses.length > 0) {
        this.selectedClass = this.filteredClasses[0]; // 选择第一个班级
      }

      // 更新层次选择
      this.updateLevelSelection();


    },
    onClassChange() {
      // 选择班级时，保存之前选择的层次
      const previousLevel = this.selectedLevel;
      this.selectedLevel = '';

      // 更新层次选择
      this.updateLevelSelection(previousLevel);


    },
    updateLevelSelection(previousLevel = '') {
      const currentLevels = this.filteredLevels;

      // 如果当前层次列表有值
      if (currentLevels.length > 0) {
        // 如果之前选择的层次在当前层次中，则保持选择
        this.selectedLevel = currentLevels.includes(previousLevel) ? previousLevel : currentLevels[0];
      } else {
        this.selectedLevel = ''; // 如果没有层次，则重置选项
      }


    },
    async  getGRLInfo(){
      await this.$axios({
        method: "GET",
        url: "/api/adminServer/get/processedData",

      }) .then(response => {
        const data = response.data;
        // 提取年级列表
        this.grades = Object.keys(data);
        // 构建年级-班级-层次映射
        this.classesByGrade = data; // 直接使用接口返回的数据

        // 初始化选择为第一个年级、班级和层次
        this.selectedGrade = this.grades[0] || '';
        this.selectedClass = this.filteredClasses[0] || '';
        this.selectedLevel = this.filteredLevels[0] || '';
      })
          .catch(error => {
            console.error('Error fetching data:', error);
          });


    },




    // 根据年级获取对应的班级和层次
    getClassesAndLevelsByGrade(grade) {
      const filteredData = this.gradeClassArr.find(item => item.grade === grade);
      return filteredData ? {classNames: filteredData.classNames, levels: filteredData.levels} : {
        classNames: [],
        levels: []
      };
    },

    toRegisterPage() {
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
        this.regCounsellor()
      }
      reader.readAsArrayBuffer(file.raw)
    },


    cancellation() {
      this.dialogTableVisible = false
      this.setOpenCadre = false
    },
    cancellationCard() {
      this.dialogTableVisible = false
      this.setOpenCadres = false
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
            console.log(res)
            console.log(1)
            ElMessage({
              type: 'info',
              message: '您已取消',
            });

          });

    },
    openSetCadreInfo(){
      this.setOpenCadres=true
    },
    SetCadreInfo() {
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
            console.log(res)
            console.log(1)
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
      this.setOpenCadres=false
      console.log(data)

      this.userData = []
      this.userData.push(data.user)
      this.$message.success(data.message)
    },
    openIsCadre() {
      ElMessageBox.confirm(
          `你确定要撤销${this.selectedInstitution}${this.selectedBranch}${this.selectedPosition}${this.updateFrom.name}同学的学生干部职位?`,
          'Warning',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {

            this.updateCadre(this.setUserId)

          })
          .catch((res) => {
            console.log(1)
            ElMessage({
              type: 'info',
              message: '您已取消',
            });

          });

    },

    openSetCadre(id, name, sex, grade, classes, levels, institution, position, counsellor, chamber, num, phone, isCadre) {
      this.setCadreTitle = "请更新" + grade + classes + levels + name + "同学的学生信息"
      this.updateFrom = {name, sex, grade, classes, levels, institution, position, counsellor, chamber, num, phone}
      this.selectedInstitution = institution
      this.isCadre = isCadre
      let match = position.match(/负责人|干事|队长/g);
      if (match) {
        this.selectedPosition = match[0];
      } else {
        this.selectedPosition = position;
      }

      this.selectedBranch = position.replace(/负责人|干事|队长/g, "") || position;
      console.log(this.selectedPosition)
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
      this.setOpenCadre = false

    },
    openUpdateUserInfo(){
      ElMessageBox.confirm(
          `你确定要更新${this.updateFrom.grade}${this.updateFrom.classes}${this.updateFrom.levels}${this.updateFrom.name}同学的学生信息?`,
          'Warning',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {

            this.updateUserInfo(this.setUserId)

          })
          .catch((res) => {
            console.log(1)
            ElMessage({
              type: 'info',
              message: '您已取消',
            });

          });
    },
    async updateUserInfo(id) {
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/updateData/updateUserInfo",
        data: {
          id: id,
          data: this.updateFrom
        }
      })
      this.userData = []
      this.userData.push(data.user)
      this.$message.success(data.message)
      this.setOpenCadre = false

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
    async regCounsellor() {
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/updateData/updateUsersFromJson",
        data: {regUsersData: this.regUsersData}
      })
      console.log(data)
      this.$message.success(data.results.message)

    },
    async getPointClass() {
      let {data} = await this.$axios({
        method: "GET",
        url: "/api/adminServer/get/searchClass",
        params: {
          grade: this.selectedGrade,
          className: this.selectedClass,
          level: this.selectedLevel
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
    getMockInstitution(institution) {
      switch (institution) {
        case "分团委":
          return ["分团委", "组织部", "宣传部", "技术部", "记者团"];
        case "学生分会":
          return ["学生分会", "体育部", "秘书处", "青年志愿者服务中心", "学习部", "对外联络部", "生活权益部", "文艺部", "辩论队"];
        case "校友分会":
          return ["校友分会", "联络部", "秘书处", "宣传部"];
        case "学生公寓自我管理委员会分会":
          return ["学生公寓自我管理委员会分会", "楼管部", "外联部", "宣传部", "办公室"];
        case "分团委学生社团管理部":
          return ["分团委学生社团管理部", "办公室", "宣传部", "监察部"];
        default:
          return [];
      }
    },
    open(name, id, user, secret) {
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
            this.resertPass(id, user, secret)

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
          url: "/api/adminServer/get/searchClassAll",
          params: {query: txt}
        })
        this.userData = []
        this.userData = data.data
        this.filenameTxt = this.searchTxt
      }, 500)
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
        url: "/api/adminServer/get/classInfo",
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
    async courseAdd(courseInfoId,grade,className, level, coursesList) {
      this.searchTxt = ""
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/course/aiCourse",
        data: {courseInfoId,grade,className, level, termName: this.semester, coursesList}
      })
      console.log(data)
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
    course_upload_success(res, courseInfoId,grade,className, level) {
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
      this.courseAdd( courseInfoId,grade,className, level, this.courseList)
    },

    course_before_upload(file) {
      console.log(file)
      let ifMic = /\.xlsx?$/.test(file.name)
      if (!ifMic) {
        this.$message.error("只能上传excel文件")
      }
      return ifMic
    },

  },
  mounted() {
    this.getGRLInfo()
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
.upload-demo{
  width: 50px;
  height: 50px;
  border: none;
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















