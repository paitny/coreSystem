"use strict";
const common_vendor = require("../../common/vendor.js");
const NumberRoller = () => "../../components/countUp/countUp.js";
const _sfc_main = {
  components: {
    NumberRoller
  },
  data() {
    return {
      className: "",
      title: "",
      time: "",
      pieData: {
        series: []
      },
      statusData: [],
      userData: []
    };
  },
  onLoad(options) {
    this.initData(options);
  },
  methods: {
    initData(options) {
      this.className = options.className;
      this.time = options.time;
      this.title = options.title || "默认标题";
      this.userData = JSON.parse(options.results);
      const coursePerson = {
        shouldAttend: parseInt(options.shouldAttend),
        actualAttend: parseInt(options.actualAttend),
        leave: parseInt(options.leave),
        absent: parseInt(options.absent)
      };
      const pieDataSeries = this.getPieDataSeries(coursePerson);
      const statusDataItems = this.getStatusDataItems(coursePerson);
      this.pieData.series = pieDataSeries;
      this.statusData = statusDataItems;
    },
    getPieDataSeries(coursePerson) {
      return [
        {
          name: "到课率",
          data: coursePerson.actualAttend
        },
        {
          name: "请假",
          data: coursePerson.leave
        },
        {
          name: "缺席",
          data: coursePerson.absent
        }
      ];
    },
    getStatusDataItems(coursePerson) {
      return [
        {
          label: "总人数",
          count: coursePerson.shouldAttend
        },
        {
          label: "实到",
          count: coursePerson.actualAttend
        },
        {
          label: "请假",
          count: coursePerson.leave
        },
        {
          label: "缺席",
          count: coursePerson.absent
        }
      ];
    },
    handleItemClick(item) {
      common_vendor.index.navigateTo({
        url: `../../subpkg-visualization/checkCourseData/checkCourseData?label=${item.label}&results=${JSON.stringify(this.userData)}`
      });
    }
  }
};
if (!Array) {
  const _easycom_qiun_data_charts2 = common_vendor.resolveComponent("qiun-data-charts");
  const _component_NumberRoller = common_vendor.resolveComponent("NumberRoller");
  (_easycom_qiun_data_charts2 + _component_NumberRoller)();
}
const _easycom_qiun_data_charts = () => "../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
if (!Math) {
  _easycom_qiun_data_charts();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.time),
    b: common_vendor.t($data.className),
    c: common_vendor.t($data.title),
    d: common_vendor.p({
      type: "pie",
      chartData: $data.pieData
    }),
    e: common_vendor.f($data.statusData, (item, index, i0) => {
      return {
        a: "391e50c9-1-" + i0,
        b: common_vendor.p({
          num: item.count,
          color: "#000000",
          width: "15",
          height: "15",
          fontSize: "15"
        }),
        c: common_vendor.t(item.label),
        d: index,
        e: common_vendor.o(($event) => $options.handleItemClick(item), index)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-391e50c9"]]);
wx.createPage(MiniProgramPage);
