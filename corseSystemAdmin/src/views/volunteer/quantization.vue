<template>
  <el-card>

    <el-dialog v-model="dialogTableVisible" title="多功能数据导出" width="600">
      <div style="min-height: 350px;display: flex;flex-direction: column ;justify-content: space-around">
        <div>
          学院：
          <el-radio-group v-model="userDataKey" size="large" v-for="item in uniqueFaculty" style="margin-left: 10px">
            <el-radio-button :label="item" :value="item"/>

          </el-radio-group>
        </div>
        <div>
          年级：
          <el-radio-group v-for="item in excelGrades" v-model="userDataKey" size="large" style="margin-left: 10px">
            <el-radio-button :label="item" :value="item"/>
          </el-radio-group>
        </div>
        <div style="display: flex">
          <div style="width: 160px">导员：</div>
          <div>
            <el-radio-group v-model="userDataKey" v-for="item in instructor" size="large" style="margin-left: 10px;margin-top: 10px">
              <el-radio-button :label="item" :value="item"/>


            </el-radio-group>
          </div>

        </div>

      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="getUserMultifunctionalSingleData" type="success" plain  v-loading.fullscreen.lock="fullscreenLoading">单表数据导出</el-button>
          <el-button @click="getUserMultifunctionalMoreData" type="success" plain>多表分班导出</el-button>
        </div>
      </template>
    </el-dialog>

    <div style="display: flex;align-items: center;justify-content: space-between;min-width: max-content;">

      <el-button color="#626aef" @click="dialogTableVisible = true" plain>多功能导出</el-button>
      <el-button @click="handleExportOne" type="success" plain>单表导出</el-button>
      <el-button @click="handleExport" type="success" plain>分班导出</el-button>
      <div>
        学期:
        <el-select v-model="selectedTerm"  placeholder="选择学期" style="width: 240px">
          <el-option v-for="term in terms" :key="term" :label="term" :value="term"></el-option>
        </el-select>
      </div>

      <div class="searchBox">
        <div>全局查询:&nbsp;</div>
        <div class="demo-input-size">
          <el-input
              v-model="userDataKeyword"
              size="large"
              placeholder="请输入年级、班级、学号或其他关键字"
              class="input-with-select"
          >
            <template #append>
              <el-button icon="Search" @click="getUserData"/>
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
        <el-button type="primary" icon="Search" @click="getStudentData">Search</el-button>

      </div>



    </div>


    <div class="studentTable">
      <h2>学生活动班级量化表</h2>
      <el-table :data="students" border style="width: 100%" v-loading="loading" height="100vh">
        <el-table-column label="班级" prop="class" align="center" width="280px" fixed="left">
          <template v-slot="{ row }">
              <span v-if="row.activityIds.length > 0"
                    style="color: pink">{{ row.grade + row.class }} ({{ row.levels }})</span>
            <span v-else>{{ row.grade + row.class }} ({{ row.levels }})</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name" align="center" width="100px" fixed="left">
          <template v-slot="{ row }">
            <span v-if="row.activityIds.length > 0" style="color: pink">{{ row.name }}</span>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学号" prop="num" align="center" width="120px" fixed="left">
          <template v-slot="{ row }">
            <span v-if="row.activityIds.length > 0" style="color: pink">{{ row.num }}</span>
            <span v-else>{{ row.num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任职机构" prop="institution" align="center" width="120px">
          <template v-slot="{ row }">
            <span v-if="row.activityIds.length > 0"
                  style="color: pink">{{
                row.institution === '暂无' || row.institution === '芯系启航' ? '' : row.institution
              }}</span>
            <span v-else>{{ row.institution === '暂无' || row.institution === '芯系启航' ? '' : row.institution }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任职情况" prop="position" align="center" width="120px">
          <template v-slot="{ row }">
            <span v-if="row.activityIds.length > 0" style="color: pink">{{
                row.position === '普通用户' || row.position === '芯系小助手开发者' ? '' : row.position
              }}</span>
            <span v-else>{{ row.position === '普通用户' || row.position === '芯系小助手开发者' ? '' : row.position }}</span>
          </template>
        </el-table-column>
        <el-table-column v-for="(column, columnIndex) in tableColumns" :key="column._id" :label="column.title"
                         align="center"
                         v-if="tableColumns.length>0"
        >
          <template v-slot="{ row }">
            <span v-if="row.activityIds.includes(column._id)" style="color: #7d50f4">√</span>
          </template>
        </el-table-column>
        <el-table-column v-else label="暂无活动" align="center">

          <span>暂无数据</span>

        </el-table-column>
      </el-table>
    </div>

  </el-card>

</template>


<script>
import StudentExport from "../../utils/studentQuantization";
import StudentOneExport from "../../utils/studentOne";
import { ElLoading } from 'element-plus'
import {getCurrentSemester} from "../../utils/currentSemester.ts";

export default {
  data() {
    return {
      selectedTerm: "",
      terms: [],
      students: [],
      tableColumns: [],
      excelGrades:[],
      grades: [],
      selectedGrade: "",
      classes: [],
      selectedClass: "",
      levels: [],
      selectedLevel: "",
      userDataKey: "人工智能与大数据学院",
      fileName: "",
      loading: true,
      dialogTableVisible: false,
      userDataKeyword: '',
      instructor: [],
      gradeClassArr:[],
      uniqueFaculty:[],
      fullscreenLoading:false
    };
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
  watch: {

  },
  destroyed() {
    // 移除键盘事件监听器
    document.removeEventListener('keydown', this.handleEnterKey);
  },
  methods: {

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

      // 更新 updateFrom 对象
      this.updateFrom.grade = this.selectedGrade;
      this.updateFrom.classes = this.selectedClass;
      this.updateFrom.levels = this.selectedLevel;
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
        this.getStudentData()
      })
          .catch(error => {
            console.error('Error fetching data:', error);
          });


    },


    async getTerms(){
      const response = await this.$axios({
        method: "GET",
        url: "/api/get/semesters",

      })
    this.terms= response.data.data.map(item => item.name);

    },
    // 处理回车键按下事件
    handleEnterKey(event) {
      if (event.key === 'Enter') {
        this.getUserData();
      }
    },
    handleExport() {
      const loading = ElLoading.service({
        lock: true,
        text: '多表数据导出中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      StudentExport.exportToExcel(

          this.fileName,
          this.students,
          this.tableColumns
      )
      setTimeout(() => {
        this.$message.success("导出成功")
        loading.close()
      }, 200)
    },

    handleExportOne() {
      const loading = ElLoading.service({
        lock: true,
        text: '单表数据导出中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      StudentOneExport.exportToExcel(
          this.fileName,
          this.students,
          this.tableColumns
      )
      setTimeout(() => {
        this.$message.success("导出成功")
        loading.close()
      }, 200)

    },


    async getActivityData() {
      let {data} = await this.$axios({
        method: "GET",
        url: "/api/adminServer/get/newActive",
        params: {currentSemester: this.selectedTerm}
      })
      if (data.code) {
        return this.$message.error(data.msg)
      }
      this.tableColumns = []
      this.tableColumns = data.data
    },

    async getStudentData() {
      this.userDataKeyword = ""
      this.loading = true
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/get/studentQuantification",
        data: {
          grade: this.selectedGrade,
          userClass: this.selectedClass,
          levels: this.selectedLevel,
          semester: this.selectedTerm
        }
      })
      if (data.code) {
        return this.$message.error(data.msg)
      }
      this.students = []
      this.students = data.data
      this.fileName = this.selectedGrade + this.selectedClass + this.selectedLevel
      await this.getActivityData()
      setTimeout(() => {
        this.loading = false
        this.$message.success(data.msg)
      }, 1000)


    },
    async getUserData() {
      if (this.userDataKeyword === "") {
        return this.$message.error("请输入关键字")
      }
      this.loading = true
      await this.getActivityData()
      let {data} = await this.$axios({
        method: "GET",
        url: "/api/adminServer/get/userData",
        params: {query: this.userDataKeyword, semester: this.selectedTerm}
      })
      if (data.code) {
        return this.$message.error(data.msg)
      }
      this.students = []
      this.students = data.data
      this.fileName = this.userDataKeyword
      setTimeout(() => {
        this.loading = false
        this.$message.success(data.msg)
      }, 1000)

    },

    async getUserMultifunctionalSingleData() {
      if (this.userDataKey === "") {
        return this.$message.error("请输入关键字")
      }
      const loading = ElLoading.service({
        lock: true,
        text: '单表数据导出中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      let {data} = await this.$axios({
        method: "GET",
        url: "/api/adminServer/get/userData",
        params: {query: this.userDataKey, semester: this.selectedTerm}
      })
      if (data.code) {
        return this.$message.error(data.msg)
      }
      StudentOneExport.exportToExcel(
          this.userDataKey,
          data.data,
          this.tableColumns
      )
      setTimeout(() => {
        this.$message.success("导出成功")
        loading.close()
      }, 200)

    },


    async getUserMultifunctionalMoreData() {
      if (this.userDataKey === "") {
        return this.$message.error("请输入关键字")
      }
      const loading = ElLoading.service({
        lock: true,
        text: '多表数据导出中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      // this.fullscreenLoading=true
      let {data} = await this.$axios({
        method: "GET",
        url: "/api/adminServer/get/userData",
        params: {query: this.userDataKey, semester: this.selectedTerm}
      })
      if (data.code) {
        return this.$message.error(data.msg)
      }
      StudentExport.exportToExcel(
          this.userDataKey,
          data.data,
          this.tableColumns
      )


      setTimeout(() => {
        this.$message.success("导出成功")
        loading.close()
      }, 200)

    },
    async getClassInfo() {
      if (this.userDataKey === "") {
        return this.$message.error("请输入关键字")
      }

      let {data} = await this.$axios({
        method: "GET",
        url: "/api/adminServer/get/getUniqueInfo",
        params: {query: this.userDataKey, semester: this.selectedTerm}
      })
      if (data.code) {
        return this.$message.error(data.msg)
      }

      this.instructor = data.uniqueCounsellors
      this.excelGrades = data.uniqueGrades
      this.uniqueFaculty=data.uniqueFaculty


    },


  },
  created() {

  },
  mounted() {
    this.getGRLInfo()
    this.getTerms()
    this.selectedTerm = getCurrentSemester()
    this.getClassInfo()
    // 添加键盘事件监听器，在回车键按下时触发搜索方法
    document.addEventListener('keydown', this.handleEnterKey);

  }
};
</script>

<style>
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

.el-input-group__append {
  background-color: pink;
  color: #fff;
}
</style>
