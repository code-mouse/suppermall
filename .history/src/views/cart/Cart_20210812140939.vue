<template>
  <div class="cart">
    <!--导航-->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{ cartLength }})</div>
      <cart-list />
    </nav-bar>
    <!--商品列表-->
    <cart-list />
    <!--底部汇总-->
    <cart-bottom-bar />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import CartBottomBar from "./childComps/CartBottomBar";
import CartList from "./childComps/CartList";

import { mapGetters } from "vuex";

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar,
  },
  computed: {
    //语法一
    ...mapGetters(["cartLength"]),
    //语法二
    // ...mapGetters({
    //   length: 'cartLength',
    //   list: 'cartList',
    // })
  },
};
</script>

<style scoped>
.cart {
  height: 100vh;
}
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
}
</style>
