<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物商城APP</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 class="tab-control"
                 ref="tabControl1" v-show="isTabFixed"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="tabControl2" />
      <goods-list :goods="showGoods"/>
    </scroll>
          <!--    ul>li{列表$}*100-->

<!--    .native用于监听原生组件的点击事件(原生组件不能监听点击事件)-->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import Scroll from "components/common/scroll/Scroll";
  import TabControl from "components/content/tabControl/TabControl"
  import GoodsList from "components/content/goods/GoodsList"
  import BackTop from "components/content/backTop/BackTop"

  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";

  import FeatureView from "views/home/childComps/FeatureView"

  import {getHomeMultiData,getHomeGoods} from "network/home"
  import {debounce} from "common/utils"
  import {itemListenerMixin} from "common/mixin";

  export default {
    name: "Home",
    components:{
      NavBar,
      Scroll,
      TabControl,
      HomeSwiper,
      BackTop,
      RecommendView,
      FeatureView,
      GoodsList,
    },
    mixins: [itemListenerMixin],
    data(){
      return{
        banners: [],
        recommends: [],
        goods:{
          'pop':{page: 0, list: []},
          'new':{page: 0, list: []},
          'sell':{page: 0, list: []}
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
      }
    },
    created() {
      //请求多个数据
      this.getHomeMultiData()
      //请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {
      //解决首页可滚动区域bug方法二：世界总线
      // this.$bus.$on('itemImageLoad',() => {
      //   this.$refs.scroll.refresh()
      // })

      //this.$refs.scroll.refresh这个函数进行防抖操作
      //mixin引入
      // let refresh = debounce(this.$refs.scroll.refresh,100)
      //
      // //对监听的世家进行保存
      // this.itemImgListener = () => {
      //   refresh()
      // }
      // this.$bus.$on('itemImageLoad',this.itemImgListener)
    },
    activated() {
      //第三个为时间参数
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      //保存Y值
      this.saveY = this.$refs.scroll.getScrollY()

      //取消全局事件监听,第二个参数为取消的函数
      //this.$bus.$off('itemImgLoad',this.itemImgListener)
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    methods:{
      //事件监听方法
      tabClick(index){
        //console.log(index);
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break;
          case 1:
            this.currentType = 'new'
            break;
          case 2:
            this.currentType = 'sell'
            break;
        }
        //console.log(this.$refs.tabControl1.currentType);
        //console.log(this.$refs.tabControl2.currentType);
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      backClick(){
        this.$refs.scroll.scrollTo(0,0)
      },
      contentScroll(position){
        //判断BackTop是否显示
        //console.log(position);
        this.isShowBackTop = -position.y > 1000
        //决定tabControl是否吸顶(position:fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore(){
        this.getHomeGoods(this.currentType)
        //解决首页可滚动区域bug方法一：
        // this.$refs.scroll.refresh()
      },
      swiperImageLoad(){
        //console.log(this.$refs.tabControl2.$el.offsetTop);
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },

      //网络请求方法
      getHomeMultiData(){
        getHomeMultiData().then(res => {
          //console.log(res);
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type){
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res => {
          //console.log(res);
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home{
    height: 100vh;
    /*padding-top: 44px;*/
    position: relative;
  }
  .home-nav{
  background-color: var(--color-tint);
  color: #fff;
  /*background-color: var(--color-tint);*/
  /*position: fixed;*/
  /*left: 0;*/
  /*right: 0;*/
  /*top: 0;*/
  /*z-index: 9;*/
  }
  .content{
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
.tab-control{
  position: relative;
  z-index: 9;
}
  /*.content {*/
  /*height: calc(100% - 93px);*/
  /*overflow: hidden;*/
  /*margin-top: 44px;*/
  /*}*/
</style>
