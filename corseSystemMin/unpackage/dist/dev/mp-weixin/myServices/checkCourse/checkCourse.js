"use strict";
const common_vendor = require("../../common/vendor.js");
const Utils_getNowWeek = require("../../Utils/getNowWeek.js");
const classPop = () => "../../components/classPop/classPop.js";
const _sfc_main = {
  data() {
    return {
      grades: [],
      classList: [],
      // 班级信息数组
      classarray: [],
      levelsarray: [],
      weeks: Array.from({
        length: 20
      }, (v, k) => k + 1),
      weekdays: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      selectedGrade: 0,
      selectedClass: 0,
      selectedLevel: 0,
      selectedWeek: 0,
      selectedWeekday: 0,
      checkGrade: "",
      checkClass: "",
      checkLevels: "",
      courses: [],
      searching: false,
      gradeClassArr: [],
      totalWeek: 25,
      // 周总数
      startDate: "2024/9/2",
      // 开学日期
      nowMonth: 0,
      nowWeek: 0,
      baseURL: "",
      showDialog: false,
      optionsArr: {}
    };
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  watch: {
    selectedGrade(newGrade) {
      this.loadClasses(this.optionsArr);
    }
  },
  created() {
  },
  components: {
    classPop
  },
  onLoad(options) {
    console.log(options.grade, options.className, options.level);
    this.baseURL = common_vendor.index.baseURL;
    this.optionsArr = options;
    this.loadData(options);
    this.getNowWeek();
    this.getCurrentWeekday();
  },
  methods: {
    handleItemSelected(item) {
      console.log("Selected item:", item);
      this.onClassSelect(item);
      this.showDialog = false;
    },
    // 关闭弹窗的方法
    closeDialog() {
      this.showDialog = false;
    },
    getClassList() {
      common_vendor.index.$http.get("/api/aiCourse/search-by-class", {
        counsellor: this.userInfo.name
      }).then((res) => {
        this.classList = res.data.classList;
        this.showDialog = true;
      });
    },
    onClassSelect(gradeClassName) {
      const gradeMatch = gradeClassName.match(/^(\d+级)/);
      const classMatch = gradeClassName.match(/(\D+?\d+班)/);
      const levelMatch = gradeClassName.match(/\(([^)]+)\)/);
      const grade = gradeMatch ? gradeMatch[0] : "";
      const className = classMatch ? gradeClassName.split(grade)[1].split("(")[0] : "";
      const level = levelMatch ? levelMatch[1] : "";
      this.checkGrade = grade;
      this.checkClass = className;
      this.checkLevels = level;
      this.searchCourse();
    },
    getNowWeek() {
      const nowWeek = Utils_getNowWeek.getNowWeek(this.startDate, this.totalWeek);
      this.selectedWeek = nowWeek - 1;
      this.getWeekDates();
    },
    getWeekDates() {
      const startDate = new Date(this.startDate);
      const addTime = (this.nowWeek - 1) * 7 * 24 * 60 * 60 * 1e3;
      const firstDate = startDate.getTime() + addTime;
      const {
        month: nowMonth
      } = this.getDateObject(new Date(firstDate));
      const weekCalendar = [];
      for (let i = 0; i < this.weekDayCount; i++) {
        const date = new Date(firstDate + i * 24 * 60 * 60 * 1e3);
        const {
          day
        } = this.getDateObject(date);
        weekCalendar.push(day);
      }
      this.nowMonth = nowMonth;
      console.log(weekCalendar);
      this.weekCalendar = weekCalendar;
    },
    getCurrentWeekday() {
      const today = /* @__PURE__ */ new Date();
      const dayIndex = today.getDay();
      this.selectedWeekday = dayIndex;
    },
    getDateObject(date = /* @__PURE__ */ new Date()) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const daysOfWeek = ["日", "一", "二", "三", "四", "五", "六"];
      const dayOfWeekIndex = date.getDay();
      const dayOfWeek = daysOfWeek[dayOfWeekIndex];
      return {
        year,
        month,
        day,
        dayOfWeek
        // 返回星期名称
      };
    },
    getCurrentSemester() {
      const currentDate = /* @__PURE__ */ new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      let semester;
      let academicYear;
      if (currentMonth >= 9 && currentMonth <= 12) {
        semester = "第一学期";
        academicYear = `${currentYear}-${currentYear + 1}学年度`;
      } else if (currentMonth >= 1 && currentMonth <= 2) {
        semester = "第一学期";
        academicYear = `${currentYear - 1}-${currentYear}学年度`;
      } else if (currentMonth >= 3 && currentMonth <= 6) {
        semester = "第二学期";
        academicYear = `${currentYear - 1}-${currentYear}学年度`;
      } else {
        semester = "暑假";
        academicYear = `${currentYear - 1}-${currentYear}学年度`;
      }
      return `${academicYear}${semester}`;
    },
    async loadData(options) {
      try {
        const res = await common_vendor.index.$http.get("/api/get/gradeClass");
        this.gradeClassArr = res.data;
        this.grades = res.data.map((item) => item.grade);
        const userGradeData = res.data.find((item) => item.grade === this.userInfo.grade);
        if (userGradeData) {
          this.selectedGrade = this.grades.indexOf(userGradeData.grade);
          this.classarray = userGradeData.classNames;
          this.levelsarray = userGradeData.levels;
        } else {
          this.loadClasses(options);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    },
    loadClasses(options) {
      const {
        classNames,
        levels
      } = this.getClassesAndLevelsByGrade(this.grades[this.selectedGrade]);
      this.classarray = classNames;
      this.levelsarray = levels;
      this.selectedClass = 0;
      this.selectedLevel = 0;
      this.checkGrade = options.grade || this.grades[this.selectedGrade];
      this.checkClass = options.className || this.classarray[this.selectedClass];
      this.checkLevels = options.level || this.levelsarray[this.selectedLevel];
      this.searchCourse();
    },
    getClassesAndLevelsByGrade(grade) {
      const gradeData = this.gradeClassArr.find((item) => item.grade === grade);
      return gradeData ? {
        classNames: gradeData.classNames,
        levels: gradeData.levels
      } : {
        classNames: [],
        levels: []
      };
    },
    onGradeChange(event) {
      this.selectedGrade = event.detail.value;
      this.checkGrade = this.grades[event.detail.value];
    },
    onClassChange(event) {
      this.selectedClass = event.detail.value;
      this.checkClass = this.classarray[event.detail.value];
    },
    onLevelChange(event) {
      this.selectedLevel = event.detail.value;
      this.checkLevels = this.levelsarray[event.detail.value];
    },
    onWeekChange(event) {
      this.selectedWeek = event.detail.value;
    },
    onWeekdayChange(event) {
      this.selectedWeekday = event.detail.value;
    },
    async searchCourse() {
      try {
        this.searching = true;
        const response = await common_vendor.index.$http.get("/api/aicourse/checkCourses", {
          termName: this.getCurrentSemester(),
          grade: this.checkGrade,
          className: this.checkClass,
          level: this.checkLevels,
          week: this.weeks[this.selectedWeek],
          weekday: this.selectedWeekday === 0 ? 7 : this.selectedWeekday
        });
        if (response.statusCode === 200) {
          this.courses = response.data.matchedCourses;
        } else {
          common_vendor.index.showToast({
            icon: "error",
            title: response.data.message || "查询失败",
            duration: 1500
          });
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        common_vendor.index.showToast({
          icon: "error",
          title: "查询失败，请稍后重试",
          duration: 1500
        });
      } finally {
        this.searching = false;
      }
    },
    viewCourseDetail(course) {
      const serializedCourse = JSON.stringify(course);
      const result = JSON.stringify([]);
      const photo = JSON.stringify([]);
      const isProvide = JSON.stringify(false);
      common_vendor.index.navigateTo({
        url: `/subpkg-common/attendanceCourse/attendanceCourse?grade=${this.checkGrade}&class=${this.checkClass}&level=${this.checkLevels}&course=${encodeURIComponent(serializedCourse)}&week=${this.weeks[this.selectedWeek]}&weekday=${this.selectedWeekday}&results=${result}&photo=${photo}&isProvide=${isProvide}`
      });
    }
  }
};
if (!Array) {
  const _easycom_classPop2 = common_vendor.resolveComponent("classPop");
  _easycom_classPop2();
}
const _easycom_classPop = () => "../../components/classPop/classPop.js";
if (!Math) {
  _easycom_classPop();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($options.getCurrentSemester()),
    b: `${$data.baseURL}${_ctx.userInfo.photo}`,
    c: common_vendor.t(_ctx.userInfo.name),
    d: common_vendor.t($data.weeks[$data.selectedWeek]),
    e: $data.weeks,
    f: $data.selectedWeek,
    g: common_vendor.o((...args) => $options.onWeekChange && $options.onWeekChange(...args)),
    h: common_vendor.t($data.weekdays[$data.selectedWeekday]),
    i: $data.weekdays,
    j: $data.selectedWeekday,
    k: common_vendor.o((...args) => $options.onWeekdayChange && $options.onWeekdayChange(...args)),
    l: common_vendor.t($data.checkGrade),
    m: $data.grades,
    n: $data.checkGrade,
    o: common_vendor.o((...args) => $options.onGradeChange && $options.onGradeChange(...args)),
    p: common_vendor.t($data.checkClass),
    q: $data.classarray,
    r: $data.checkClass,
    s: common_vendor.o((...args) => $options.onClassChange && $options.onClassChange(...args)),
    t: common_vendor.t($data.checkLevels),
    v: $data.levelsarray,
    w: $data.checkLevels,
    x: common_vendor.o((...args) => $options.onLevelChange && $options.onLevelChange(...args)),
    y: !$data.searching
  }, !$data.searching ? {} : {}, {
    z: $data.searching,
    A: common_vendor.o((...args) => $options.searchCourse && $options.searchCourse(...args)),
    B: $data.courses.length > 0
  }, $data.courses.length > 0 ? {
    C: common_vendor.f($data.courses, (course, k0, i0) => {
      return {
        a: common_vendor.t(course.name),
        b: common_vendor.t(course.num),
        c: common_vendor.t(course.rawSection),
        d: common_vendor.t(course.address),
        e: course._id,
        f: common_vendor.o(($event) => $options.viewCourseDetail(course), course._id)
      };
    }),
    D: common_vendor.t($data.checkGrade),
    E: common_vendor.t($data.checkClass),
    F: common_vendor.t($data.checkLevels)
  } : {}, {
    G: common_vendor.o((...args) => $options.getClassList && $options.getClassList(...args)),
    H: common_vendor.o($options.closeDialog),
    I: common_vendor.o($options.handleItemSelected),
    J: common_vendor.p({
      show: $data.showDialog,
      dataList: $data.classList
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bd277846"]]);
wx.createPage(MiniProgramPage);
