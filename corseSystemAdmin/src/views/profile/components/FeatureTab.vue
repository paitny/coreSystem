<template>
  <el-card>
    <el-tabs v-model="activeName">
      <el-tab-pane label="功能介绍" name="first">
        <el-collapse v-model="activeCollapse" accordion>
          <el-collapse-item
            :title="item.title"
            v-for="item in featureData"
            :key="item.id"
            :name="item.id"
          >
            <div v-html="item.content"></div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="技术团队" name="second">
        <div class="author-container" >
          <div class="header">
            <img
              :src="
                `${baseURL}${staticURL}${$store.getters.userInfo.photo}` || getImg('default.jpg')
              "
              class="avatar"
            />
            <div class="header-desc">
              <h3>王亚鹏</h3>
              <span>一名00后程序猿</span>
            </div>
          </div>
          <div class="info">
            三年前进入程序猿领域,钻研技术,现已精通 :
            高级计算机的开机与关机,传统办公软件excel甚至word等高端软件的安装与卸载,在各大主流后端语言如python,java中输出hello
            world,意外发现前端,从此爱上了,并学废了前端至高要义,ctrl-a ctrl-v
            编程手法, 未来还将研究更多与前端有关的高端技术! 活到老 学到老!
          </div>
        </div>
        <div class="author-container" >
          <div class="header">
            <img
                :src="
                `${baseURL}${staticURL}${$store.getters.userInfo.photo}` || getImg('default.jpg')
              "
                class="avatar"
            />
            <div class="header-desc">
              <h3>兰星雨</h3>
              <span>一名00后UI设计工程狮</span>
            </div>
          </div>
          <div class="info">
            充满创意和热情的UI设计师，拥有丰富的设计经验和专业技能。的设计理念注重简约直观，致力于通过精美的界面提升用户体验。熟练使用设计工具如Sketch和Figma，能快速将创意转化为高质量的设计稿，并注重与开发团队的紧密合作，确保设计的实施性和可交付性。关注设计趋势和用户反馈，不断迭代和优化设计方案，以适应变化的市场需求。以责任心和团队协作精神为驱动，愿意与多个团队合作，确保最终的产品设计既满足用户期望，又符合业务目标。
          </div>
        </div>
        <div class="author-container" >
          <div class="header">
            <img
                :src="
                `${baseURL}${staticURL}${$store.getters.userInfo.photo}` || getImg('default.jpg')
              "
                class="avatar"
            />
            <div class="header-desc">
              <h3>赖雨</h3>
              <span>一名00后程序猿</span>
            </div>
          </div>
          <div class="info">
            一位充满激情的女程序员，对编程充满热爱。在软件开发领域有着坚实的技术基础，熟练掌握多种编程语言，包括Python、JavaScript和Java等。通过灵活运用各种框架和库，致力于创造高效、优雅的代码。
            特别热衷于前端开发，善于通过HTML、CSS以及React/Vue等技术打造引人入胜的用户界面。在用户体验和交互设计方面，积累了丰富的经验，努力确保每个用户都能享受到流畅、友好的应用。
            除了技术方面的专业能力，注重团队合作和沟通。在协作中，善于分享知识，与团队成员密切合作，共同攻克技术难题。对于新技术的学习充满激情，不断保持对行业发展的敏感性。

          </div>
        </div>
        <div class="author-container" >
          <div class="header">
            <img
                :src="
                `${baseURL}${staticURL}${$store.getters.userInfo.photo}` || getImg('default.jpg')
              "
                class="avatar"
            />
            <div class="header-desc">
              <h3>金继世</h3>
              <span>一名00后测试攻城狮</span>
            </div>
          </div>
          <div class="info">
            一名经验丰富的测试工程师，专注于确保软件质量和用户体验。具备全面的测试技能，熟练使用各种自动化测试工具和手动测试方法，以确保软件的稳定性和功能完整性。
            在自动化测试方面，有着深厚的经验，熟练使用Selenium、Appium和JUnit等工具，设计和执行自动化测试脚本，提高了测试效率和覆盖率。同时，注重持续集成和持续交付实践，确保每次代码提交都能够进行全面的自动化测试。
            对软件开发生命周期有着全面的了解，参与过需求分析、设计评审和代码审查，以确保在早期阶段就能够发现和解决潜在问题。善于制定详细的测试计划和测试用例，覆盖各种场景，以保证软件的质量。
            在团队协作方面，善于与开发团队和产品团队紧密合作，及早了解产品需求，确保测试活动与开发过程的有效对接。还注重与团队成员分享测试经验和最佳实践，提高整体团队的测试水平。
          </div>
        </div>
        <div class="author-container" >
          <div class="header">
            <img
                :src="
                `${baseURL}${staticURL}${$store.getters.userInfo.photo}` || getImg('default.jpg')
              "
                class="avatar"
            />
            <div class="header-desc">
              <h3>王宇佳</h3>
              <span>一名00后运维攻城狮</span>
            </div>
          </div>
          <div class="info">
            一名经验丰富的运维工程师，致力于保障系统的稳定性和安全性。擅长系统管理和维护，具备深厚的Linux和Windows操作系统经验，熟练运用Ansible和Puppet等自动化工具，提高了系统的可维护性和稳定性。
            在网络和服务器管理方面，有着扎实的技术背景，能够迅速解决复杂的故障和优化系统性能。对于容器化技术如Docker和Kubernetes有着实践经验，实现了系统的高度可伸缩性。
            注重系统安全，负责制定和执行系统安全策略，实施防火墙和入侵检测系统，确保系统的安全性。同时，参与过应急响应团队，迅速处置安全事件，最大程度减小了潜在损失。
            具备丰富的云计算经验，熟练使用AWS、Azure或Google Cloud Platform，构建高可用的云基础架构，通过云平台的弹性资源管理，优化了系统的成本结构。
            在团队协作方面，善于与开发人员和其他团队成员紧密合作，协同解决问题。通过引入监控系统如Nagios和Prometheus，实现了对系统和服务的实时监控，提前发现并解决了潜在问题。
          </div>
        </div>
      </el-tab-pane
      >
    </el-tabs>
  </el-card>
</template>
<script setup>
import { ref,defineProps} from "vue";
import {getImg} from "../../../utils/pub-use";

defineProps({
  featureData: {
    type: Array,
  },
});
const activeName = ref("second");
const activeCollapse = ref(0);
</script>

<style lang="scss" scoped>
:deep(.el-collapse-item__header) {
  font-weight: bold;
}
.el-collapse-item {
  :deep(a) {
    color: #409eff;
    margin: 0 4px;
  }
}
.author-container {
  .header {
    display: flex;
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
    .header-desc {
      margin-left: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      span {
        font-size: 14px;
      }
    }
  }
  .info {
    margin-top: 16px;
    line-height: 22px;
    font-size: 14px;
    text-indent: 26px;
  }
}
</style>
