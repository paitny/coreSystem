<template>
  <el-card>


    <div class="continer">
      <el-button type="success" class="Review" @click="submitExam">改卷提交</el-button>
      <!-- 标题 -->
      <h2>{{examData.termTopic}}</h2>
      <h5>{{ total }}</h5>
      <div class="msg">
        <span>姓名：</span>
        <span class="underline">{{ examData.name }}</span>
        <span>机构：</span>
        <span class="underline">{{ examData.institution }}</span>
        <span>部门+职位：</span>
        <span class="underline">{{ examData.position }}</span>

      </div>

      <p>注意事项：</p>
      <p class="notice">1、本卷共4页，答案务必书写在答卷上的指定位置上；</p>
      <p class="notice">2、请在考试时间内答题，答题时间到后停止作答。</p>
      <div>
        <table class="table">
          <thead>
          <tr>
            <td v-for="(header, index) in headers" :key="index">
              {{ header }}
            </td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td v-for="(row, rowIndex) in rows" :key="rowIndex">
              {{ row }}
            </td>
          </tr>
          <tr>
            <td>得分</td>
            <td>

              <input type="text" v-model="examData.singleChoiceScore" class="score" disabled/>
            </td>
            <td>
              <input type="text" v-model="examData.fillScore " class="score"/>
            </td>
            <td>
              <input type="text" v-model="examData.essayScore" class="score"/>
            </td>
            <td>
              <input type="text" v-model="examData.thinkingScore" class="score"/>
            </td>
            <td>
              <input type="text" :value="totalScore" class="score" disabled/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="topic">
        <table class="questionType">
          <thead>
          <tr>
            <td>实时阅卷人</td>
            <td>得分</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{userInfo.name}}</td>
            <td><input type="text" v-model="examData.singleChoiceScore" class="score" disabled/> </td>
          </tr>
          </tbody>
        </table>
        <h4>一、选择题（每题各2分，总计24分）</h4>
      </div>


      <!-- 单选题 -->
      <div
          v-for="(question, index) in singleChoiceQuestions"
          :key="index"
          class="question"
      >
        {{ index + 1 }} .
        <sapn>{{ question.text }}</sapn>
        <span class="answer">{{ question.answer }}</span>
        <ul>
          <li
              v-for="(option, optionIndex) in question.options"
              :key="optionIndex"
          >

            <label :for="`${index}-${optionIndex}`">{{ option.label }}、{{ option.value }}</label>

          </li>
        </ul>
        <div class="correctAnswer">参考答案：{{ question.correctAnswer }}</div>
      </div>

      <div class="topic">
        <table class="questionType">
          <thead>
          <tr>
            <td>实时阅卷人</td>
            <td>得分</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{userInfo.name}}</td>
            <td>  <input type="text" v-model="examData.fillScore " class="score"/> </td>
          </tr>
          </tbody>
        </table>
        <h4>二、填空题（每题各3分，总计30分）</h4>
      </div>

      <!-- 填空题 -->
      <div
          v-for="(question, index) in fillInQuestions"
          :key="index"
          class="question"
      >
        {{ index + 1 }}、 <span>{{ question.text }}</span>
        <div class="himAnswer">{{ question.answer }}</div>
        <div class="correctAnswer">参考答案：{{ question.correctAnswer }}</div>
      </div>

      <div class="topic">
        <table class="questionType">
          <thead>
          <tr>
            <td>实时阅卷人</td>
            <td>得分</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{userInfo.name}}</td>
            <td>  <input type="text" v-model="examData.essayScore " class="score"/> </td>
          </tr>
          </tbody>
        </table>
        <h4>三、主观题（每题各9分，总计36分）</h4>
      </div>

      <!-- 问答题 -->
      <div
          v-for="(question, index) in essayQuestions"
          :key="index"
          class="question"
      >
        {{ index + 1 }}、 <span>{{ question.text }}</span>
        <div class="himAnswer">{{ question.answer }}</div>
        <div class="correctAnswer">参考答案：{{ question.correctAnswer }}</div>
      </div>
      <div class="topic">
        <table class="questionType">
          <thead>
          <tr>
            <td>实时阅卷人</td>
            <td>得分</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{userInfo.name}}</td>
            <td><input type="text" v-model="examData.thinkingScore " class="score"/> </td>
          </tr>
          </tbody>
        </table>
        <h4>四、思维拓展题（每题10分，共10分）</h4>
      </div>

      <div
          v-for="(question, index) in thinkingQuestions"
          :key="index"
          class="question"
      >
        {{ index + 1 }}、 <span>{{ question.text }}</span>
        <div class="himAnswer">{{ question.answer }}</div>
        <div class="correctAnswer">参考答案：{{ question.correctAnswer }}</div>
      </div>

    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      total: "（卷面分值：100  考试时间：60分钟）",
      headers: ["题号", "一", "二", "三", "四", "总分"],
      rows: ["满分", "24", "30", "36", "10", "100"],
      scoreRow: [],
      examData: {},
      singleChoiceQuestions: [],
      fillInQuestions: [],
      thinkingQuestions: [],
      essayQuestions: []
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    },
    totalScore() {
      return parseInt(this.examData.singleChoiceScore) + parseInt(this.examData.fillScore) + parseInt(this.examData.essayScore) + parseInt(this.examData.thinkingScore)
    }
  },
  methods: {
    //请求所有数据
    async getExamData() {
      let {data} = await this.$axios({
        method: "GET",
        url: "/api/adminServer/get/ExamsData",
        params: {examId: this.$route.query.id}
      })
      if (data.code) {
        return this.$message.error(data.msg)
      }
      console.log(data)
      this.examData = data[0]

      this.scoreRow = data[0].score

      this.singleChoiceQuestions = data[0].examData.singleChoiceQuestions
      this.fillInQuestions = data[0].examData.fillInTheBlankQuestions
      this.essayQuestions = data[0].examData.essayQuestions
      this.thinkingQuestions = data[0].examData.thinkingQuestions

      console.log(this.scoreRow)

    },
    async submitExam() {
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/examine/updateScores",
        data: {
          userExamId: this.$route.query.id,
          singleChoiceScore: this.examData.singleChoiceScore,
          fillScore: this.examData.fillScore,
          essayScore: this.examData.essayScore,
          thinkingScore: this.examData.thinkingScore,
          reviewer:this.userInfo.name
        }
      })
      this.$message.success(data.message)
    }
  },
  mounted() {

    this.getExamData()

  },
  created() {

  }
};
</script>

<style scoped>
.topic{
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.questionType{
  width: 285px;
  border-collapse: collapse;
  margin-top: 20px;
}
.correctAnswer {
  color: #1b82f1;
  margin-bottom: 20px;
  margin-top: 20px;
  max-width: 480px;
}

.Review {
  float: right;
}

.continer {
  width: 100%;
  min-width: 1226px;
  margin: 0;

}

h4 {
  margin-top: 20px;
  margin-left: 20px;

;
}

.answer {
  color: red;
}

.msg {
  text-align: center;
}

h2,
h5 {
  text-align: center;
  width: 331px;
  margin: 0 auto;
}

.table {
  border-collapse: collapse;
  width: 90%;
  text-align: center;
  margin: 0 auto;
}

.himAnswer {
  color: red;
  margin-top: 10px;
  height: 300px;
}

th,
td {
  border: 1px solid black;
  padding: 8px;
  text-align: center;
}

.score {
  border: none;
  outline: none;
  width: 100%;
  text-align: center;
  background-color: white;
}

.notice {
  margin-left: 2em;
}

li {
  list-style: none;
}

.underline {
  position: relative;
  display: inline-block;
  width: 10em;
}

.underline::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background-color: black;
}
</style>



