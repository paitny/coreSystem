import { ref, onMounted, onActivated, onDeactivated, onUnmounted } from 'vue'
export const getAutoHeight = (marginTop:number) => {
  const tableHeight = ref(window.innerHeight - marginTop)
  const refreshHeight = () => {
    tableHeight.value = window.innerHeight - marginTop
  }
  onMounted(() => {
    window.onresize = refreshHeight
  })

  onUnmounted(() => {
    window.onresize = null
  })

  onActivated(() => {
    refreshHeight()
    window.onresize = refreshHeight
  })
  onDeactivated(() => {
    window.onresize = null
  })

  return { tableHeight }
}
