<template>
    <span class="number-grow-warp">
        <span ref="numberGrow" :data-time="time" class="number-grow" :data-value="value">0</span>
    </span>
</template>

<script>
export default {
  name:'numberGrow',
  props: {
    time: {
      type: Number,
      default: 2
    },
    value: {
      type: Number,
      default: 0
    },
    thousandSign:{
      type: Boolean,
      default:()=>false
    }
  },
  data(){
    return{
      oldValue:0
    }
  },
  watch:{
    value:function(value,oldValue){
      this.numberGrow(this.$refs.numberGrow)
    }
  },
  methods: {
    numberGrow (ele) {
      let _this = this
      let value = _this.value - _this.oldValue
      let step = (value * 10) / (_this.time * 10)
      let current = 0
      let start = _this.oldValue
      let t = setInterval(function () {
        start += step
        if (start > _this.value) {
          clearInterval(t)
          start = _this.value
          t = null
        }
        if (current === start) {
          return
        }
        current = parseInt(start)
        _this.oldValue = current
        if(_this.thousandSign){
          ele.innerHTML = current.toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,')
        }else{
          ele.innerHTML = current.toString()
        }
      }, 10)
    }
  },
  mounted () {
    this.numberGrow(this.$refs.numberGrow)
  }
}
</script>

<style lang="scss" scoped>
.number-grow-warp{
  transform: translateZ(0);
}
</style>
