<template>
  <el-calendar ref="calendar" style="height: 650px">
    <template #header="{ date }">
      <span>Custom header content</span>
      <span>{{ date }}</span>
      <el-button-group style="display: flex">
        <el-button size="small" @click="selectDate('prev-year')">
          上一年
        </el-button>
        <el-button size="small" @click="selectDate('prev-month')">
          上月
        </el-button>
        <el-button size="small" @click="selectDate('today')">Today</el-button>
        <el-button size="small" @click="selectDate('next-month')">
          下月
        </el-button>
        <el-button size="small" @click="selectDate('next-year')">
          下一年
        </el-button>
      </el-button-group>
    </template>
  </el-calendar>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const calendar = ref()
const selectDate = (val: string) => {
  calendar.value.selectDate(val)
}
</script>

