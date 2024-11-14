<template>
  <el-breadcrumb separator="/" class="breadcrumb" id="guide-breadcrumb">
    <transition-group name="breadcrumb">
    <el-breadcrumb-item
        v-for="(route,index) in breadcrumbData"
        :key="route.path"
    >
      <a
          class="redirect"
          v-if="index !== breadcrumbData.length - 1"
          @click.prevent="linkClick(route.path)"
      >{{ route.meta.title }}
      </a>
      <span v-else class="no-redirect">{{ route.meta.title }}</span>
    </el-breadcrumb-item>
      </transition-group>
  </el-breadcrumb>
</template>
<script setup>
import {useRoute,useRouter} from "vue-router";
import {computed} from "vue";

const route = useRoute()
const router=useRouter()
const breadcrumbData = computed(() =>
    route.matched.filter((item) => item.meta && item.meta.title)
)
const linkClick= path=>router.push(path)
</script>

<style lang="scss" scoped>
.breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 55px;
  margin-left: 15px;

  .redirect {
    color: #666;
    font-weight: 600;
    &:hover{
      color: blue;
    }
  }

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter-from,
.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
