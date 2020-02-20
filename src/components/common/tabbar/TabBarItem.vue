<template>
  <div class="tab-bar-item" @click="itemClick">
    <!--    <slot v-if="!isActive" name="item-icon"></slot>-->
    <!--    <slot v-else name="item-icon-active"></slot>-->
    <div v-if="!isActive"><slot name="item-icon"></slot></div>
    <div v-else><slot name="item-icon-active"></slot></div>
    <div :style="activeStyle"><slot name="item-text"></slot></div>
  </div>
</template>

<script>
  export default {
    name: "TabBerItem",
    props:{
      path: String,
      activeColor: {
        type: String,
        default: 'red'
      }
    },
    data(){
      return{
        //isActive: true
      }
    },
    computed:{
      isActive(){
        // indexOf()方法 !==-1(不等于-1)就是找到了
        return this.$route.path.indexOf(this.path) !==-1
      },
      activeStyle(){
        return this.isActive ? {color: this.activeColor} : {}
      }
    },
    methods:{
      itemClick(){
        this.$router.replace(this.path)
      }
    }
  }
</script>

<style scoped>
  .tab-bar-item{
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 14px;
  }
  .tab-bar-item img{
    width: 24px;
    height: 24px;
    margin-top: 7px;
    vertical-align: middle;
  }
  /*.active{*/
  /*  color: blue;*/
  /*}*/
</style>
