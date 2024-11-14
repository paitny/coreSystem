<template>
  <div id="data">
    <div>
      <el-row :gutter="12">
        <el-col :span="16">
          <el-card shadow="hover">
            <div style="display: flex" class="data-welcom">
              <div class="data-welcom-left">
                <svg-icon icon="work" class="work-icon"></svg-icon>
              </div>
              <div class="data-welcom-right">

                <p>亲爱的 {{ name.name }}
                  <span v-if="name.sex === '男'">先生</span>
                  <span v-else-if="name.sex === '女'">女士</span>
                  {{ greeting }}
                </p>
                <span>开源等于互助；开源需要大家一起来支持，支持的方式有很多种，比如使用、推荐、写教程、保护生态、贡献代码、回答问题、分享经验、打赏赞助等；欢迎您加入我们！</span>
              </div>
            </div>

          </el-card>


        </el-col>

        <el-col :span="8" style="text-align: center">
          <Timer></Timer>
        </el-col>
      </el-row>

    </div>
    <div class="data-data">
      <el-row :gutter="12">
        <el-col :span="12">
          <el-card shadow="hover"> 本站注册数量
            <div class="data-number">
              <router-link to="/userSport">
                <svg-icon icon="user" class="data-icon"></svg-icon>
              </router-link>
              <div class="number-max">
                <NumberAdd :value="user" :time="30"></NumberAdd>
              </div>
            </div>

          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">

            文章数量
            <div class="data-number">
              <router-link to="/newsMg/newsManage">
                <svg-icon icon="article" class="data-icon"></svg-icon>
              </router-link>
              <div class="number-max">
                <NumberAdd :value="Article"></NumberAdd>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="data-data">
      <el-row :gutter="12">
        <el-col :span="8">

          <el-card shadow="hover">学生动态数量
            <div class="data-number">
              <router-link to="/leaveMsg/leaveMg">
                <svg-icon icon="trend" class="data-icon"></svg-icon>
              </router-link>
              <div class="number-max">
                <NumberAdd :value="Contact" :time="30"></NumberAdd>
              </div>
            </div>
          </el-card>
          <el-card shadow="hover" style="margin-top: 43px">志愿者报名数据
            <div class="data-number">
              <router-link to="/volunteer/volunteerMg">
                <svg-icon icon="fleece-heart" class="data-icon"></svg-icon>
              </router-link>
              <div class="number-max">
                <NumberAdd :value="volunteerCount"></NumberAdd>
              </div>
            </div>
          </el-card>
          <el-card shadow="hover" style="margin-top: 43px"> 学生干部考核发布次数
            <div class="data-number">
              <router-link to="/examine/examineMg">
                <svg-icon icon="kaohe" class="data-icon"></svg-icon>
              </router-link>
              <div class="number-max">
                <NumberAdd :value="publishedIssuesCount" :time="30"></NumberAdd>
              </div>
            </div>
          </el-card>
          <el-card shadow="hover" style="margin-top: 43px">学生机构数量
            <div class="data-number">
              <router-link to="/studentOrg/studentOrgMg">
                <svg-icon icon="orgcreate" class="data-icon"></svg-icon>
              </router-link>
              <div class="number-max">
                <NumberAdd :value="studentOrgCount" :time="30"></NumberAdd>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">访问数量
            <div class="data-number">
              <router-link to="/visitorSport">
                <svg-icon icon="visitor" class="data-icon"></svg-icon>
              </router-link>
              <div class="number-max">
                <NumberAdd :value="Visitor" :time="30"></NumberAdd>
              </div>
            </div>
          </el-card>
          <el-card shadow="hover" style="margin-top: 43px">优秀校友数量
            <div class="data-number">
              <router-link to="/alumnus/alumnusMg">
                <svg-icon icon="alumnus" class="data-icon"></svg-icon>
              </router-link>
              <div class="number-max">
                <NumberAdd :value="alumnusCount" :time="30"></NumberAdd>
              </div>
            </div>
          </el-card>
          <el-card shadow="hover" style="margin-top: 43px">音乐数量
            <div class="data-number">
              <router-link to="/music/micMg">
                <svg-icon icon="music-manage" class="data-icon"></svg-icon>
              </router-link>
              <div class="number-max">
                <NumberAdd :value="Music" :time="30"></NumberAdd>
              </div>
            </div>
          </el-card>
          <el-card shadow="hover" style="margin-top: 43px">部门数量
            <div class="data-number">
              <router-link to="/studentOrg/studentOrgMg">
              <svg-icon icon="iTeam" class="data-icon"></svg-icon>
              </router-link>
              <div class="number-max">
                <NumberAdd :value="departmentCount" :time="30">{{ departmentCount }}</NumberAdd>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card shadow="hover">
            <Calendar></Calendar>

          </el-card>
        </el-col>

      </el-row>
    </div>

  </div>

</template>

<script>
import {getLocal} from "../../utils/storage";
import Timer from "../../components/Timer/index.vue";
import NumberAdd from "../../components/Number/index.vue";
import Calendar from "../../components/Calendar/index.vue"

export default {
  data() {
    return {
      name: getLocal("userInfo"),
      user: 200,
      publishedIssuesCount: 100,
      Music: 100,
      departmentCount: 100,
      Article: 100,
      Contact: 100,
      Visitor: 100,
      alumnusCount: 100,
      studentOrgCount: 100,
      volunteerCount: 100,
      greeting: ""
    }
  },
  components: {
    Timer, NumberAdd, Calendar

  },
  methods: {
    setGreeting() {
      const currentHour = new Date().getHours();
      const ampm = currentHour >= 12 ? '下午' : '上午';

      if (currentHour >= 9 && currentHour < 12) {
        this.greeting = `${ampm}好！今天一定要开心哦！`;
      } else if (currentHour >= 0 && currentHour < 9) {
        this.greeting = '您该睡觉咯！休息好，祝你又可以拥有神奇的一天！';
      } else if (currentHour >= 19 && currentHour < 23) {
        this.greeting = '休息时间到咯哟！可以关闭小破站啦！';
      } else {
        this.greeting = `${ampm}好！忙碌的一天过半咯，再坚持一下下哟！`;
      }
    },

    async getDataNumber() {
      let {data} = await this.$axios({
        method: "GET",
        url: "/api/adminServer/analysis"
      })
      console.log(data)
      if (data.code) return
      this.user = data.data.userCount
      this.publishedIssuesCount = data.data.publishedIssuesCount
      this.Music = data.data.musicCount
      this.departmentCount = data.data.departmentCount
      this.Article = data.data.newsCount
      this.Contact = data.data.trendsCount
      this.Visitor = data.data.visitorCount
      this.alumnusCount = data.data.alumnusCount
      this.studentOrgCount = data.data.studentOrgCount
      this.volunteerCount = data.data.volunteerCount
    },
  },

  mounted() {
    this.setGreeting()
    this.getDataNumber()
  }

}

</script>

<style lang="scss" scoped>
#data {
  .data-welcom {
    display: flex;
    align-items: center;

    p {
      font-size: 1.5rem;
      color: #7d50f4;
      margin-bottom: 10px;
    }

    .work-icon {
      width: 160px;
      height: 100px;
    }

    .data-welcom-right {
      margin-left: 30px;
    }
  }

  .data-data {
    margin-top: 20px;
  }

  .data-number {
    margin-top: 20px;
    display: flex;
    align-items: center;

    .number-max {
      margin-left: 100px;
      font-size: 50px;
    }

    .data-icon {
      width: 50px;
      height: 50px;
    }
  }
}
</style>
