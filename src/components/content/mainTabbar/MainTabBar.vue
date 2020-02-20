<template>
  <tab-bar>
    <tab-bar-item path="/home" activeColor="blue">
      <img slot="item-icon" src="~assets/img/tabbar/1.svg" alt="">
      <img slot="item-icon-active" src="~assets/img/tabbar/5.svg" alt="">
      <div slot="item-text">首页</div>
    </tab-bar-item>
    <tab-bar-item path="/category" >
      <img slot="item-icon" src="~assets/img/tabbar/2.svg" alt="">
      <img slot="item-icon-active" src="~assets/img/tabbar/6.svg" alt="">
      <div slot="item-text">分类</div>
      <div></div>
    </tab-bar-item>
    <tab-bar-item path="/cart" activeColor="green">
      <img slot="item-icon" src="~assets/img/tabbar/3.svg" alt="">
      <img slot="item-icon-active" src="~assets/img/tabbar/7.svg" alt="">
      <div slot="item-text">购物车</div>
    </tab-bar-item>
    <TabBarItem path="/profile" activeColor="orange">
      <img slot="item-icon" src="~assets/img/tabbar/4.svg" alt="">
      <img slot="item-icon-active" src="~assets/img/tabbar/8.svg" alt="">
      <div slot="item-text">我的</div>
    </TabBarItem>
  </tab-bar>
</template>

<script>
  import TabBar from "../../common/tabbar/TabBar";
  import TabBarItem from "../../common/tabbar/TabBarItem";

  export default {
    name: "MainTabBar",
    components:{
      TabBar,
      TabBarItem
    }
  }
</script>

<style scoped>

</style>
