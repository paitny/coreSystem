<template>
  <el-card>
    <div class="classInfo"> {{ classInfo }}</div>
    <el-button type="success" @click="exportTimetable" plain>课表导出</el-button>
    <el-table :data="timetable" border style="width: 100%">
      <el-table-column prop="time" label="时间" fixed align="center">
        <template #default="scope">
          <div class="time-cell">
            第 {{ scope.row.time }} 节 <br/>
            {{ time[scope.row.time - 1] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
          v-for="day in days"
          :key="day"
          :label="day"
          align="center"
      >
        <template #default="scope">
          <div v-for="(course, index) in scope.row[day]" :key="index" class="course-cell">
            {{ course }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import {defineComponent} from 'vue';
import {ElTable, ElTableColumn, ElButton} from 'element-plus';
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
import {getCurrentSemester} from '../../utils/currentSemester.ts';

export default defineComponent({
  name: 'ClassCourse',
  components: {
    ElTable,
    ElTableColumn,
    ElButton
  },
  data() {
    return {
      days: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      time: ['8:30 ~ 10:05', '10:20 ~ 11:55', '13:40 ~ 15:15', '15:30 ~ 17:05', '18:40 ~ 20:15'],
      timetable: [],
      classInfo: ''
    };
  },
  mounted() {
    this.getCourseInfo();
    this.classInfo = this.$route.query.grade + this.$route.query.className + `(${this.$route.query.level})`;
  },
  methods: {
    getCurrentDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}/${month}/${day}`;
    },
    getCurrentTime() {
      const date = new Date();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    },

    async getCourseInfo() {
      let {data} = await this.$axios({
        method: 'GET',
        url: '/api/get/alternative',
        params: {
          grade: this.$route.query.grade,
          className: this.$route.query.className,
          level: this.$route.query.level,
          termName: getCurrentSemester()
        }
      });
      this.timetable = this.processCoursesData(data.data.result);
    },
    processCoursesData(coursesData) {
      const timetable = Array.from({length: 5}, (_, i) => {
        const time = i + 1;
        const days = {
          星期一: [],
          星期二: [],
          星期三: [],
          星期四: [],
          星期五: [],
          星期六: [],
          星期日: []
        };
        return {time, ...days};
      });

      const addedCourses = new Set(); // 用于存储已添加的课程信息

      coursesData.coursesList.forEach(course => {
        let startSection = course.section || 0;
        let endSection = (course.section + course.sectionCount - 1) || 0;
        const day = `星期${['一', '二', '三', '四', '五', '六', '日'][(course.week-1) % 7]}`;

        const courseInfo = `[${course.num}]${course.name} ${course.rawWeeks}${course.rawSection} ${course.address === "暂无" ? '' : course.address}`;

        for (let section = startSection; section <= endSection; section++) {
          const index = Math.floor((section - 1) / 2);
          if (index < timetable.length) {
            // 检查课程是否已存在
            if (!addedCourses.has(courseInfo)) {
              timetable[index][day].push(courseInfo);
              addedCourses.add(courseInfo); // 添加到集合中
            }
          }
        }
      });

      return timetable;
    },

    async exportTimetable() {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('课表');

      // 设置列宽
      worksheet.columns = [
        { header: '新列标题', width: 6 }, // 将第一列宽度设置为6
        { header: '时间', width: 20 }, // 第二列宽度为20
        ...Array(7).fill({ header: '', width: 23 }) // 其他列宽度为23
      ];

      // 添加表头字体
      worksheet.getColumn(1).font = { name: '黑体', size: 10 }; // 新列字体设置
      worksheet.getColumn(1).header = '新列标题'; // 设置新列表头
      worksheet.getColumn(2).font = { name: '新宋体', size: 12 }; // 第二列字体设置为新宋体12号
      worksheet.getColumn(2).header = '时间'; // 设置时间表头

      // 设置星期表头
      for (let i = 3; i <= 9; i++) {
        worksheet.getColumn(i).font = { name: '黑体', size: 10 }; // 设置黑体10号字体
        worksheet.getColumn(i).header = this.days[i - 3]; // 设置表头内容
      }

      // 合并第一行前六个单元格，并设置内容
      worksheet.mergeCells('A1:G1'); // 合并A1到F1
      const headerCell = worksheet.getCell('A1');
      headerCell.value = '成都文理学院' + getCurrentSemester() + "课表"; // 设置合并单元格的内容
      headerCell.font = { name: '黑体', size: 16, bold: true }; // 设置字体样式

      // 在H1和I1单元格中写入日期和时间
      worksheet.getCell('H1').value = this.getCurrentDate();
      worksheet.getCell('I1').value = this.getCurrentTime();

      // 添加第二行信息
      worksheet.getRow(2).values = [
        '院(系)/部：',
        '',
        '人工智能与大数据学院',
        '年级：', this.$route.query.grade.replace("级", ""),
        '专业：', this.$route.query.className.replace(/\d+班$/, ''),
        '班级：' + this.classInfo.replace(/(\d{4})级(.+?)(\d+)班\((.+?)\)/, "$1$2($4)$3") + '[34]'
      ];
      worksheet.mergeCells('A2:B2'); // 合并A2到B2
      worksheet.mergeCells('H2:I2'); // 合并H2到I2

      // 设置行高
      worksheet.getRow(1).height = 37; // 第一行行高设置为37
      worksheet.getRow(2).height = 22; // 第二行行高设置为22
      worksheet.getRow(3).height = 16; // 第三行行高设置为16

      // 添加第三行星期
      worksheet.getRow(3).values = ['', '时间', ...this.days]; // 设置时间列后面为星期数组

      // 填充课表数据，从第四行开始
      this.timetable.forEach(row => {
        const rowData = [
          '新列内容', // 添加新列内容
          `第 ${row.time} 节\n(${this.time[row.time - 1]})` // 使用换行符
        ];
        this.days.forEach(day => {
          const cellContent = row[day].join('\n') || ''; // 若没有课程则显示 "-"
          rowData.push(cellContent);
        });
        const newRow = worksheet.addRow(rowData);

        // 设置边框
        newRow.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });

      // 合并第一列的4,5行
      worksheet.getCell('A4').value = '上\n午';
      worksheet.mergeCells('A4:A5'); // 合并A4和A5

      // 合并第一列的6,7行
      worksheet.getCell('A6').value = '下\n午';
      worksheet.mergeCells('A6:A7'); // 合并A6和A7

      // 第8行设置为晚上
      worksheet.getCell('A8').value = '晚\n上'; // 使用换行符

      // 设置第四行的最小行高
      worksheet.getRow(4).height = 90; // 可以根据内容自动调整

      // 设置从第4行开始的所有行的行高为90
      for (let i = 4; i <= worksheet.rowCount; i++) {
        worksheet.getRow(i).height = 90;
      }

      // 设置每个单元格的对齐方式和边框
      worksheet.eachRow({ includeEmpty: true }, (row) => {
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.alignment = {
            wrapText: true,   // 设置换行
            horizontal: 'center', // 水平居中
            vertical: 'middle' // 垂直居中
          };

          // 设置边框
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });

      // 导出 Excel 文件
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, `${this.classInfo}.xlsx`);
    }
  }
});
</script>

<style scoped>
.classInfo {
  padding: 20px;
  text-align: center;
}

.el-table.el-table {
  margin-bottom: 20px;
}

.time-cell {
  font-weight: bold;
}

.course-cell {
  border: 1px solid #dcdfe6;
  margin: 5px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>



