<template>
  <!--引入粒子特效-->
  <div class="bkpro-login-canvas">
    <Particles
        id="tsparticles"
        :particlesInit="particlesInit"
        :particlesLoaded="particlesLoaded"
        :options="options"
    />
  </div>
</template>


<script lang="ts">
import { defineComponent, reactive, UnwrapRef, ref } from "vue";
import { loadFull } from 'tsparticles'
export default defineComponent({
  setup() {


    const particlesInit = async (engine: any) => {
      await loadFull(engine)
    }

    const particlesLoaded = async (container: any) => {
      console.log('Particles container loaded', container)
    }

    const options = {
      background: {
        color: {
          value:0,//粒子颜色
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",//可用的click模式有: "push", "remove", "repulse", "bubble"。
          },
          onHover: {
            enable: true,
            mode: "grab",//可用的hover模式有: "grab", "repulse", "bubble"。
          },
          resize: true,
        },
        modes: {
          bubble: {
            distance: 400,
            duration: 2,
            opacity: 0.8,
            size: 40,
          },
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#9C0189",//'#dedede'。线条颜色。
          distance: 150,//线条长度
          enable: true,//是否有线条
          opacity: 0.5,//线条透明度。
          width: 1,//线条宽度。
        },
        collisions: {
          enable: false,
        },
        move: {
          direction: "none",
          enable: true,
          outMode: "bounce",
          random: false,
          speed: 4,//粒子运动速度。
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value:100,//粒子数量。
        },
        opacity: {
          value: 0.5,//粒子透明度。
        },
        shape: {
          type: "circle", //可用的粒子外观类型有："circle","edge","triangle", "polygon","star"
        },
        size: {
          random: true,
          value: 5,
        },
      },
      detectRetina: true,
    };
    return {
      options,particlesInit,particlesLoaded
    };
  },
});
</script>
