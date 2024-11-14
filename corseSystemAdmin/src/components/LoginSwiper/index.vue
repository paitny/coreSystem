<template>


<div id="loginLeft">
  <div class="logo">
    <img src="../../assets/img/admin.png">
  </div>
  <div id="leftSwiper">
    <el-carousel :interval="5000"  v-if="MangerSwiper[0]" direction="vertical">
      <el-carousel-item v-for="item in MangerSwiper" :key="item">
        <div class="img" :style="{backgroundImage: `url(${baseURL}${item.swiper})`}" alt="正在加载中" >  </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</div>

</template>

<script>
export default {
  name: "index",
  data(){
    return{
      MangerSwiper:[],
    }
  },
  methods:{
    //获取轮播图数据
    async getMangerSwiper() {
      let {data} = await this.$axios({
        method: "GET",
        url: "/api/get/swiper"
      })
      this.MangerSwiper = data.data
    },
  },
  mounted() {
    this.getMangerSwiper()
  }
}
</script>

<style scoped lang="scss">

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin:0;


}
:deep(.el-carousel__indicators) {// 指示器
  left: unset;
  transform: unset;
  right: 2%;
  top: 40%;
}
:deep(.el-carousel__button) {// 指示器按钮
  width: 8px;
  height: 8px;
  border: none;
  border-radius: 50%;
  background-color: #ffd700;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
  border-radius: 10px;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
  border-radius: 10px;
}

#loginLeft{
  width: 400px;
  height: 410px;
  .logo{
    width: 50px;
    height: 100px;
    margin: 0 auto;
    img{
      width: 70px;
      height: 70px;
      margin-top: 20%;
    }
  }
  #leftSwiper{
    border-radius:10px;
    .login{
      width: 50px;
      height: 50px;
      margin: 0 auto;
    }
    .img{
      width: 100%;
      height: inherit;
      border-radius: 10px;
      background-size:cover ;

    }
  }
}

</style>
