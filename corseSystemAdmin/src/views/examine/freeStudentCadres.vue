<template>
  <el-card>
    <div class="function">
      <div>

        <el-button type="primary" plain @click="getUserInfoWithout">空闲部长数据</el-button>
        <el-button type="primary" plain @click="getUserInfoWithouthing">空闲干事数据</el-button>
        <el-button color="#626aef" plain @click="getUserInfo">干事值班表随机生成</el-button>
        <el-button color="#626aef" plain @click="getUserMaxInfo">部长值班表随机生成</el-button>
      </div>

      <div class="title">当前数据: <span class="highlight">{{ xlsxTitle }}</span>
        <div class="exportXLSX">
          <el-button type="success" size="large" plain @click="exportToExcel">数据导出</el-button>
        </div>

      </div>

    </div>

    <div class="duty">
      <div>


        开始周次:
        <el-select v-model="selectedStartWeek" @change="loadStartWeek" placeholder="选择开始周次" style="width: 200px">
          <el-option v-for="startWeek in startWeeks" :key="startWeek" :label="'第 '+startWeek+' 周'"
                     :value="startWeek"></el-option>
        </el-select>
      </div>
      <div>


        结束周次:
        <el-select v-model="selectedEndWeek" @change="loadEndWeek" placeholder="选择结束周次" style="width: 200px">
          <el-option v-for="endWeek in endWeeks" :key="endWeek" :label="'第 '+endWeek+' 周'" :value="endWeek"></el-option>
        </el-select>
      </div>
      <div>
        值班人数:
        <el-select v-model="selectedPeopleNum" @change="loadPeopleNum" placeholder="选择值班人数" style="width: 200px">
          <el-option v-for="num in PeopleNums" :key="num" :label="num+'人'" :value="num"></el-option>
        </el-select>
      </div>
    </div>


    <el-table :data="tableData" border height="calc(100vh - 200px)" v-loading="loading">
      <el-table-column label="节次" align="center">
        <template #default="scope">
          第 {{ scope.row.section }} 节 <br/>
          {{ time[scope.row.section - 1] }}
        </template>
      </el-table-column>
      <el-table-column v-for="(day, index) in daysOfWeek" :key="index" :label="day" align="center">
        <template #default="scope">
          <div v-if="getUserInfoByWeekAndSection(scope.row.section, index + 1).length">
            <span v-for="(item, itemIndex) in getUserInfoByWeekAndSection(scope.row.section, index + 1)"
                  :key="itemIndex">
              {{ item }}
              <br v-if="itemIndex !== getUserInfoByWeekAndSection(scope.row.section, index + 1).length - 1">
            </span>
          </div>
          <div v-else>无信息</div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
import ExcelJS from 'exceljs';

export default {
  data() {
    return {
      daysOfWeek: ['星期一', '星期二', '星期三', '星期四', '星期五'],
      rawData: [],
      selectedPeopleNum: 1,
      PeopleNums: Array.from({length: 20}, (_, i) => i + 1),
      startWeeks: Array.from({length: 18}, (_, i) => i + 1),
      endWeeks: Array.from({length: 18}, (_, i) => i + 1),
      selectedStartWeek: 1,
      selectedEndWeek: 18,
      tableData: Array.from({length: 8}, (_, index) => ({section: index + 1})),
      xlsxTitle: "",
      loading:true,
      time: [
        "8:30~9:15",
        "9:20~10:05",
        "10:20~11:05",
        "11:10~11:55",
        "13:40~14:25",
        "14:30~15:15",
        "15:30~16:15",
        "16:20~17:05"
      ],
    };
  },
  methods: {
    async exportToExcel() {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet1');

      // 设置表头
      const header = ['节次', ...this.daysOfWeek];
      worksheet.addRow(header);

      // 将表格数据转换为工作表
      const data = this.formatDataToExport();
      data.forEach((row) => {
        worksheet.addRow(Object.values(row));
      });

      // 设置对齐方式为水平垂直居中
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
        });
      });

      // 自动调整列宽
      this.adjustColumnWidths(worksheet);

      // 自动调整行高
      worksheet.eachRow((row) => {
        let maxHeight = 100; // 默认行高
        row.eachCell((cell) => {
          const cellValue = cell.value ? cell.value.toString() : '';
          const lines = cellValue.split('\n').length;
          const estimatedHeight = lines * 15; // 每行文本的估计高度
          if (estimatedHeight > maxHeight) {
            maxHeight = estimatedHeight;
          }
        });
        row.height = maxHeight;
      });

      // 导出并下载 Excel 文件
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {type: 'application/octet-stream'});

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${this.xlsxTitle}${this.selectedStartWeek}-${this.selectedEndWeek}周.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    adjustColumnWidths(worksheet) {
      worksheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell({includeEmpty: true}, (cell) => {
          const cellValue = cell.value ? cell.value.toString() : '';
          const lines = cellValue.split('\n');
          lines.forEach(line => {
            const length = line.length;
            if (length > maxLength) {
              maxLength = length;
            }
          });
        });
        // 设置列宽，根据最长行内容设置
        column.width = maxLength < 10 ? 10 : maxLength + 2; // +2 是为了留出一些额外空间
      });
    },
    formatDataToExport() {
      return this.tableData.map((rowData, index) => {
        const row = {};
        const sectionWithTime = `第 ${rowData.section} 节 \n ${this.time[index]}`;
        row['节次'] = sectionWithTime;
        this.daysOfWeek.forEach((day, dayIndex) => {
          const info = this.getUserInfoByWeekAndSection(rowData.section, dayIndex + 1);
          row[day] = info.length > 0 ? info.join('\n') : '无信息';
        });
        return row;
      });
    },

    getUserInfoByWeekAndSection(section, week) {
      const found = this.rawData.find(item => item.week === week && item.section === section);
      if (found && Array.isArray(found.availableCadres)) {
        return [...new Set(found.availableCadres)];
      }
      return [];
    },

    async getUserInfo() {
      this.loading = true
      let {data} = await this.$axios({
        method: "GET",
        url: "/api/get/students-without-courses",
        params: {startWeek: this.selectedStartWeek, endWeek: this.selectedEndWeek, peopleNum: this.selectedPeopleNum}
      });
      this.rawData = data;
      this.xlsxTitle = "学生干部值班表";
      setTimeout(() => {
        this.loading = false
        this.$message.success("随机值班表生成成功");
      }, 1000)

    },

    async getUserMaxInfo() {
      this.loading = true
      let {data} = await this.$axios({
        method: "GET",
        url: "/api/get/students-without-courses-max",
        params: {startWeek: this.selectedStartWeek, endWeek: this.selectedEndWeek, peopleNum: this.selectedPeopleNum}
      });
      this.rawData = data;
      this.xlsxTitle = "部长值班表";
      setTimeout(() => {
        this.loading = false
        this.$message.success("随机值班表生成成功");
      }, 1000)

    },

    async getUserInfoWithouthing() {
      this.loading = true
      let {data} = await this.$axios({
        method: "GET",
        url: "/api/get/without-courses-thing",
        params: {startWeek: this.selectedStartWeek, endWeek: this.selectedEndWeek}
      });
      this.rawData = data;
      this.xlsxTitle = "空闲干事数据";
      setTimeout(() => {
        this.loading = false
        this.$message.success("获取成功");
      }, 1000)

    },

    async getUserInfoWithout() {
      this.loading = true
      let {data} = await this.$axios({
        method: "GET",
        url: "/api/get/without-courses",
        params: {startWeek: this.selectedStartWeek, endWeek: this.selectedEndWeek}
      });
      this.rawData = data;
      this.xlsxTitle = "空闲部长数据";
      setTimeout(() => {
        this.loading = false
        this.$message.success("获取成功");
      }, 1000)

    },

    loadStartWeek(value) {
      this.selectedStartWeek = value;
    },

    loadEndWeek(value) {
      this.selectedEndWeek = value;
    },

    loadPeopleNum(value) {
      this.selectedPeopleNum = value;
    }
  },
  mounted() {
    this.getUserInfoWithout();
  },
};
</script>

<style>
.duty {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
  padding-bottom: 20px;
}

.title {
  font-size: 20px;
  color: #333;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.highlight {
  font-weight: bold;
  font-size: 24px;
  color: #ffffff;
  background-color: #007bff;
  padding: 5px 10px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.highlight:hover {
  background-color: #0056b3;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.function {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: 20px;
}

.el-button {
  margin: 0 5px;
}
.exportXLSX{
  margin-left:20px ;
}
</style>
