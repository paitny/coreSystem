<template>
  <div>
    <el-carousel :height="bannerHeight+'px'" type="card"  v-if="MangerSwiper[0]">
      <el-carousel-item v-for="item in MangerSwiper" :key="item._id" >
        <div class="img" :style="{backgroundImage: `url(${baseURL}${staticURL}${item.sportPhoto})`}" alt="正在加载中" >  </div>
      </el-carousel-item>
    </el-carousel>
  </div>

</template>
<script>

export default {
  name: 'swiper',
  data(){
    return {
      //el-carousel容器高度
      bannerHeight:0,
      screenWidth:0
    };
  },
  //父级传递的数据
  props:['MangerSwiper'],
  mounted () {

    // 首次加载时,初始化高度
    this.screenWidth = window.innerWidth
    this.bannerHeight =350 / 2200 * this.screenWidth
    // 窗口大小发生改变
    window.onresize = () => {
      this.screenWidth = window.innerWidth
      this.bannerHeight = 350 / 2200 * this.screenWidth
    }
  }
}
</script>
<style lang="scss" scoped>
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
}
:deep(.el-carousel__button) {// 指示器按钮
  width: 8px;
  height: 8px;
  border: none;
  border-radius: 50%;
  background-color: #7d50f4;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
  border-radius: 10px;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
  border-radius: 10px;
}
.img{
  width: 100%;
  height: inherit;
  border-radius: 10px;
  background-size:cover ;
}
</style>
