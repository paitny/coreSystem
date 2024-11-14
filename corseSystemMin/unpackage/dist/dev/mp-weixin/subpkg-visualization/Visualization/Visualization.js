"use strict";
const common_vendor = require("../../common/vendor.js");
const NumberRoller = () => "../../components/countUp/countUp.js";
const _sfc_main = {
  components: {
    NumberRoller
  },
  data() {
    return {
      title: "",
      pieData: {
        series: []
      },
      statusData: []
    };
  },
  onLoad(options) {
    const volunteerCounts = JSON.parse(options.volunteerCounts);
    this.initData(volunteerCounts, options);
  },
  methods: {
    initData(volunteerCounts, options) {
      this.title = options.title;
      const isSignedIn = JSON.parse(options.isSign);
      const isCheckOut = JSON.parse(options.isCheckOut);
      const isAudit = JSON.parse(options.audit);
      const id = options.id;
      const pieDataSeries = this.getPieDataSeries(volunteerCounts, isSignedIn);
      const statusDataItems = this.getStatusDataItems(volunteerCounts, isSignedIn);
      this.pieData.series = [];
      this.statusData = [];
      this.pieData.series = pieDataSeries;
      this.statusData = statusDataItems;
      this.handleItemClick = this.handleItemClick.bind(this, id, isSignedIn, isAudit, isCheckOut);
    },
    getPieDataSeries(volunteerCounts, isSignedIn) {
      if (isSignedIn) {
        return [
          {
            name: "已签到",
            data: volunteerCounts.signedVolunteers
          },
          {
            name: "未签到",
            data: volunteerCounts.unsignedVolunteers
          },
          {
            name: "学生干部",
            data: volunteerCounts.studentLeaderVolunteers
          },
          {
            name: "普通学生",
            data: volunteerCounts.totalVolunteers - volunteerCounts.studentLeaderVolunteers
          }
        ];
      } else {
        return [
          {
            name: "学生干部",
            data: volunteerCounts.studentLeaderVolunteers
          },
          {
            name: "普通学生",
            data: volunteerCounts.totalVolunteers - volunteerCounts.studentLeaderVolunteers
          },
          {
            name: "未参与学生干部",
            data: volunteerCounts.UnparticipatedStudentsCadre
          }
        ];
      }
    },
    getStatusDataItems(volunteerCounts, isSignedIn) {
      if (isSignedIn) {
        return [
          {
            label: "总人数",
            count: volunteerCounts.totalVolunteers
          },
          {
            label: "已签到",
            count: volunteerCounts.signedVolunteers
          },
          {
            label: "未签到",
            count: volunteerCounts.unsignedVolunteers
          },
          {
            label: "普通学生",
            count: volunteerCounts.totalVolunteers - volunteerCounts.studentLeaderVolunteers
          },
          {
            label: "学生干部",
            count: volunteerCounts.studentLeaderVolunteers
          },
          {
            label: "未参与学生干部",
            count: volunteerCounts.UnparticipatedStudentsCadre
          }
        ];
      } else {
        return [
          {
            label: "总人数",
            count: volunteerCounts.totalVolunteers
          },
          {
            label: "普通学生",
            count: volunteerCounts.totalVolunteers - volunteerCounts.studentLeaderVolunteers
          },
          {
            label: "学生干部",
            count: volunteerCounts.studentLeaderVolunteers
          },
          {
            label: "未参与学生干部",
            count: volunteerCounts.UnparticipatedStudentsCadre
          }
        ];
      }
    },
    handleItemClick(id, isSignedIn, isAudit, isCheckOut, item) {
      if (["总人数", "已签到", "未签到"].includes(item.label)) {
        common_vendor.index.navigateTo({
          url: `../../subpkg-activity/signPage/signPage?id=${id}&isSign=${isSignedIn}&audit=${isAudit}&isCheckOut=${isCheckOut}`
        });
      } else {
        common_vendor.index.navigateTo({
          url: `../studentActivity/studentActivity?id=${id}&label=${item.label}&isSign=${isSignedIn}&isCheckOut=${isCheckOut}`
        });
      }
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
    a: common_vendor.t($data.title),
    b: common_vendor.p({
      type: "pie",
      chartData: $data.pieData
    }),
    c: common_vendor.f($data.statusData, (item, index, i0) => {
      return {
        a: "7bc4c76a-1-" + i0,
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
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7bc4c76a"]]);
wx.createPage(MiniProgramPage);
