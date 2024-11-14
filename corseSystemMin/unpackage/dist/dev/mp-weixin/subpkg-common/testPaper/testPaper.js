"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      examDataLoaded: false,
      singleChoiceQuestions: [],
      fillInTheBlankQuestions: [],
      // 多选题改为填空题
      essayQuestions: [],
      thinkingQuestions: [],
      testId: "",
      termTopic: "",
      questionValue: ""
    };
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  onShow() {
    this.singleChoiceQuestions = [];
    this.fillInTheBlankQuestions = [];
    this.essayQuestions = [];
    this.loadRandomExam(this.testId);
  },
  onLoad(option) {
    this.testId = option.id;
    this.termTopic = option.termTopic;
  },
  methods: {
    async loadRandomExam(id) {
      try {
        this.examDataLoaded = false;
        const response = await common_vendor.index.$http.get("/api/examinationOrg/random-exam", {
          examId: id,
          targetsUser: this.userInfo.position.match(/(负责人|干事|部长)/)[0]
        });
        if (response.errMsg == "request:ok") {
          const {
            singleChoiceQuestions,
            fillInTheBlankQuestions,
            essayQuestions,
            thinkingQuestions
          } = response.data;
          singleChoiceQuestions.forEach((question) => {
            question.answer = "";
          });
          fillInTheBlankQuestions.forEach((question) => {
            question.answer = "";
          });
          essayQuestions.forEach((question) => {
            question.answer = "";
          });
          thinkingQuestions.forEach((question) => {
            question.answer = "";
          });
          this.singleChoiceQuestions = singleChoiceQuestions;
          this.fillInTheBlankQuestions = fillInTheBlankQuestions;
          this.essayQuestions = essayQuestions;
          this.thinkingQuestions = thinkingQuestions;
          setTimeout(() => {
            this.examDataLoaded = true;
          }, 1500);
        }
      } catch (error) {
        console.error("Failed to load random exam data:", error);
      }
    },
    handleSingleChoiceChange(e) {
      this.questionValue = e.detail.value;
    },
    singleChange(questionIndex) {
      this.singleChoiceQuestions[questionIndex].answer = this.questionValue;
    },
    referExam() {
      common_vendor.index.showModal({
        content: "温馨提示：您确定要提交试卷嘛？\n 提交后将无法修改试卷!",
        success: (e) => {
          if (e.confirm) {
            this.submitExam();
          }
        }
      });
    },
    async submitExam() {
      try {
        const submissionData = {
          singleChoiceQuestions: this.singleChoiceQuestions.map((question) => ({
            id: question._id,
            type: "single-choice",
            text: question.text,
            options: question.options,
            answer: question.answer
          })),
          fillInTheBlankQuestions: this.fillInTheBlankQuestions.map((question) => ({
            id: question._id,
            type: "fill-in-the-blank",
            // 多选题改为填空题，修改类型
            text: question.text,
            answer: question.answer
          })),
          essayQuestions: this.essayQuestions.map((question) => ({
            id: question._id,
            type: "essay",
            text: question.text,
            answer: question.answer
          })),
          thinkingQuestions: this.thinkingQuestions.map((question) => ({
            id: question._id,
            type: "thinking",
            text: question.text,
            answer: question.answer
          }))
        };
        common_vendor.index.$http.post("/api/examinationOrg/saveUserExam", {
          userId: this.userInfo._id,
          examineId: this.testId,
          termTopic: this.termTopic,
          examData: submissionData
        }).then((res) => {
          if (res.statusCode === 400) {
            return common_vendor.index.showToast({
              icon: "none",
              title: res.data.msg,
              duration: 1800
            });
          } else if (res.statusCode === 500) {
            return common_vendor.index.showToast({
              icon: "none",
              title: res.data.error,
              duration: 1800
            });
          } else if (res.statusCode === 201) {
            common_vendor.index.showToast({
              icon: "none",
              title: res.data.msg,
              duration: 1800
            });
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 500);
          }
        });
      } catch (error) {
        console.error("提交失败:", error);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.examDataLoaded
  }, $data.examDataLoaded ? common_vendor.e({
    b: common_vendor.t($data.termTopic),
    c: common_vendor.t(_ctx.userInfo.position.match(/(负责人|干事|部长)/)[0] === "负责人" || "部长" ? "部长" : "干事"),
    d: $data.singleChoiceQuestions.length > 0
  }, $data.singleChoiceQuestions.length > 0 ? {} : {}, {
    e: common_vendor.f($data.singleChoiceQuestions, (question, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(question.text),
        c: common_vendor.f(question.options, (option, optionIndex, i1) => {
          return {
            a: common_vendor.t(option.label),
            b: common_vendor.t(option.value),
            c: option.label,
            d: question.answer === option.value,
            e: optionIndex
          };
        }),
        d: "question" + index,
        e: common_vendor.o((...args) => $options.handleSingleChoiceChange && $options.handleSingleChoiceChange(...args), "singleChoice" + index),
        f: common_vendor.o(($event) => $options.singleChange(index), "singleChoice" + index),
        g: "singleChoice" + index
      };
    }),
    f: $data.fillInTheBlankQuestions.length > 0
  }, $data.fillInTheBlankQuestions.length > 0 ? {} : {}, {
    g: common_vendor.f($data.fillInTheBlankQuestions, (question, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(question.text),
        c: question.answer,
        d: common_vendor.o(($event) => question.answer = $event.detail.value, "fillIn" + index),
        e: "fillIn" + index
      };
    }),
    h: $data.essayQuestions.length > 0
  }, $data.essayQuestions.length > 0 ? {} : {}, {
    i: common_vendor.f($data.essayQuestions, (question, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(question.text),
        c: question.answer,
        d: common_vendor.o(($event) => question.answer = $event.detail.value, "essay" + index),
        e: "essay" + index
      };
    }),
    j: $data.thinkingQuestions.length > 0
  }, $data.thinkingQuestions.length > 0 ? {} : {}, {
    k: common_vendor.f($data.thinkingQuestions, (question, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(question.text),
        c: question.answer,
        d: common_vendor.o(($event) => question.answer = $event.detail.value, "thinking" + index),
        e: "thinking" + index
      };
    }),
    l: common_vendor.o((...args) => $options.referExam && $options.referExam(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e0bff9a3"]]);
wx.createPage(MiniProgramPage);
