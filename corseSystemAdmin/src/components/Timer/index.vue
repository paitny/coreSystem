<template>
  <p>
    <span id="time">{{ day }}</span>
  </p>
  <div>
    <svg-icon icon="tea" class="tea"></svg-icon>
  </div>

</template>
<script>
export default {
  name: 'Timer',
  data() {
    return {
      day: null,
      BirthDay: null,
      today: null,
      timeold: null,
      sectimeold: null,
      secondsold: null,
      msPerDay: null,
      e_daysold: null,
      daysold: null,
      e_hrsold: null,
      hrsold: null,
      e_minsold: null,
      minsold: null,
      seconds: null,
    }
  },
  methods: {
    showTime() {
      this.BirthDay = new Date("11/08/2023 07:57:00");
      this.today = new Date();
      this.timeold = (this.today.getTime() - this.BirthDay.getTime());
      this.sectimeold = this.timeold / 1000;
      this.secondsold = Math.floor(this.sectimeold);
      this.msPerDay = 24 * 60 * 60 * 1000;
      this.e_daysold = this.timeold / this.msPerDay;
      this.daysold = Math.floor(this.e_daysold);
      this.e_hrsold = (this.e_daysold - this.daysold) * 24;
      this.hrsold = Math.floor(this.e_hrsold);
      this.e_minsold = (this.e_hrsold - this.hrsold) * 60;
      this.minsold = Math.floor((this.e_hrsold - this.hrsold) * 60);
      this.seconds = Math.floor((this.e_minsold - this.minsold) * 60);
      this.day = "此破站已苟活:" + this.daysold + "天" + this.hrsold + "小时" + this.minsold + "分" + this.seconds + "秒";
    },
    setTimer() {
      window.setInterval(this.showTime, 1000)
    }
  },
  mounted() {
    this.showTime()
    this.setTimer()
  }
}
</script>
<style lang="scss" scoped>
#time{
  color: #7d50f4;
  font-size:20px;
  text-align: center;
}
.tea{
  width: 100%;
  height: 100px;
}
</style>
