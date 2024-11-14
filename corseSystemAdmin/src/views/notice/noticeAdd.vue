<template>
  <el-card>


    <el-input
        v-model="textarea"
        :rows="2"
        type="textarea"
        placeholder="Please input"
    />
    <el-button @click="submitNotice">发布</el-button>
  </el-card>

</template>

<script>
export default {
  name: "noticeAdd",
  data() {
    return {
      textarea: ""
    }
  },
  methods: {
    submitNotice() {
      this.$axios({
        method: "POST",
        url: "/api/adminServer/notice",
        data: {noticeComment: this.textarea}
      }).then((res) => {
        if (!res.data.code) {
          return this.$message.error("发布失败")
        }
        this.textarea=""
        this.$message.success(res.data.msg)

      })

    }
  }
}
</script>

<style scoped>

</style>