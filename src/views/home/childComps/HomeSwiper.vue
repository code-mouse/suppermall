<template>
  <swiper>
    <swiper-item v-for="item in banners" >
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoad"/>
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
  import {Swiper, SwiperItem} from 'components/common/swiper'

  export default {
    name: "HomeSwiper",
    props: {
      banners: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data(){
      return{
        isLoad: false
      }
    },
    methods:{
      //轮播图四张，发送一次就够了
      imageLoad(){
        if (!this.isLoad){
          this.$emit('swiperImageLoad')
          this.isLoad = true
        }
        //console.log('-----');
      }
    },
    components: {
      Swiper,
      SwiperItem
    }
  }
</script>

<style scoped>

</style>
