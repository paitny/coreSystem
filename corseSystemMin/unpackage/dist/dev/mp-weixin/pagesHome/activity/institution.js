"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      inputname: "",
      inputnum: "",
      inputsex: "请选择",
      inputclass: "",
      inputphone: "",
      inputteachar: "",
      gradearray: ["2021级", "2022级", "2023级", "2024级"],
      gradevalue: "请选择",
      activityId: "",
      sexarray: ["男", "女"],
      // 省略其他数据
      organizationArray: ["学生分会", "分团委", "校友分会", "学生公寓自我管理委员会分会", "分团委学生社团管理部"],
      // 第一个选择框的选项数组
      organizationValue: "请选择",
      departments: {
        "学生分会": ["体育部", "学习部", "生活权益部", "秘书处", "辩论队", "文艺部", "对外联络部", "青年志愿者服务中心"],
        "分团委": ["技术部", "组织部", "技术部", "记者团"],
        "校友分会": ["联络部", "秘书处", "宣传部"],
        "学生公寓自我管理委员会分会": ["楼管部", "外联部", "宣传部", "办公室"],
        "分团委学生社团管理部": ["监察部", "宣传部", "办公室"]
      },
      departmentArray: [],
      // 第二个选择框的选项数组
      departmentValue: "请选择"
      // 第二个选择框的值
    };
  },
  onLoad(option) {
    this.organizationValue = option.institution || "请选择";
    this.departmentValue = option.department || "请选择";
    this.updateDepartmentOptions(option.institution);
  },
  methods: {
    // 省略其他方法
    onPickerChangeIn(e) {
      this.organizationValue = this.organizationArray[e.detail.value];
      this.updateDepartmentOptions(this.organizationValue);
    },
    onPickerChangeSex(e) {
      this.inputsex = this.sexarray[e.detail.value];
    },
    handDempartment() {
      if (this.organizationValue === "请选择") {
        return common_vendor.index.showToast({
          icon: "none",
          title: "请先选择机构"
        });
      }
    },
    updateDepartmentOptions(organization) {
      this.departmentArray = this.departments[organization] || [];
      this.departmentValue = this.departmentArray.length > 0 && this.departmentArray.includes(this.departmentValue) ? this.departmentValue || "请选择" : this.departmentArray[0] || "请选择";
    },
    onDepartmentPickerChange(e) {
      this.departmentValue = this.departmentArray[e.detail.value];
    },
    onPickerChange(e) {
      this.gradevalue = this.gradearray[e.detail.value];
    },
    handsubmit() {
      if (this.inputname.trim() == "") {
        return common_vendor.index.showToast({
          title: "姓名不能为空",
          icon: "none"
        });
      } else if (this.inputsex.trim() == "") {
        return common_vendor.index.showToast({
          title: "性别不能为空",
          icon: "none"
        });
      } else if (this.inputnum.trim() == "") {
        return common_vendor.index.showToast({
          title: "学号不能为空",
          icon: "none"
        });
      } else if (this.gradevalue.trim() == "请选择") {
        return common_vendor.index.showToast({
          title: "年级不能为空",
          icon: "none"
        });
      } else if (this.inputclass.trim() == "") {
        return common_vendor.index.showToast({
          title: "班级不能为空",
          icon: "none"
        });
      } else if (this.inputphone.trim() == "") {
        return common_vendor.index.showToast({
          title: "手机号码不能为空",
          icon: "none"
        });
      } else if (this.inputteachar.trim() == "") {
        return common_vendor.index.showToast({
          title: "辅导员不能为空",
          icon: "none"
        });
      } else if (this.organizationValue.trim() == "请选择") {
        return common_vendor.index.showToast({
          title: "未选择机构",
          icon: "none"
        });
      } else if (this.departmentValue.trim() == "请选择") {
        return common_vendor.index.showToast({
          title: "未选择部门",
          icon: "none"
        });
      }
      common_vendor.index.$http.post("/api/ApplicationOrg/application", {
        name: this.inputname,
        sex: this.inputsex,
        ID: this.inputnum,
        grade: this.gradevalue,
        classes: this.inputclass,
        phoneNumber: this.inputphone,
        counsellor: this.inputteachar,
        organizationValue: this.organizationValue,
        departmentValue: this.departmentValue
      }).then((res) => {
        common_vendor.index.showToast({
          icon: "none",
          title: res.data.msg
        });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.inputname,
    b: common_vendor.o(($event) => $data.inputname = $event.detail.value),
    c: common_vendor.t($data.inputsex),
    d: common_vendor.o((...args) => $options.onPickerChangeSex && $options.onPickerChangeSex(...args)),
    e: $data.sexarray,
    f: $data.inputnum,
    g: common_vendor.o(($event) => $data.inputnum = $event.detail.value),
    h: common_vendor.t($data.gradevalue),
    i: common_vendor.o((...args) => $options.onPickerChange && $options.onPickerChange(...args)),
    j: $data.gradearray,
    k: $data.inputclass,
    l: common_vendor.o(($event) => $data.inputclass = $event.detail.value),
    m: $data.inputphone,
    n: common_vendor.o(($event) => $data.inputphone = $event.detail.value),
    o: common_vendor.t($data.organizationValue),
    p: common_vendor.o((...args) => $options.onPickerChangeIn && $options.onPickerChangeIn(...args)),
    q: $data.organizationArray,
    r: common_vendor.t($data.departmentValue),
    s: common_vendor.o((...args) => $options.onDepartmentPickerChange && $options.onDepartmentPickerChange(...args)),
    t: $data.departmentArray,
    v: common_vendor.o((...args) => $options.handDempartment && $options.handDempartment(...args)),
    w: $data.inputteachar,
    x: common_vendor.o(($event) => $data.inputteachar = $event.detail.value),
    y: common_vendor.o((...args) => $options.handsubmit && $options.handsubmit(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
