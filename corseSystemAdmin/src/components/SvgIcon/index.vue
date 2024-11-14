<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="innerIcon"/>
  </svg>
</template>

<script setup>
import {computed,defineProps} from "vue";

const props =  defineProps({
  icon: {
    type: String,
    required: true,
  }
})
const innerIcon = computed(() => "#icon-" + props.icon)
</script>

<style lang="scss" scoped>
.svg-icon {
  overflow: hidden;
  width: 1.5em;
  height: 1.5em;
  vertical-align: -0.7em;
  fill: currentColor;
}
</style>
