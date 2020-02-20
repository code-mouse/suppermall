<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>

      <div>{{$store.state.cartList.length}}</div>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
<!--    <toast :message="" :show=""/>-->
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo"
  import DetailParamInfo from "./childComps/DetailParamInfo"
  import DetailCommentInfo from "./childComps/DetailCommentInfo"
  import BackTop from "components/content/backTop/BackTop"
  import GoodsList from "components/content/goods/GoodsList";
  //import Toast from "components/common/toast/Toast";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import Scroll from "components/common/scroll/Scroll";

  import {getDetail,getRecommend,Goods,Shop,GoodsParam} from "network/detail";

  import {debounce} from "common/utils";
  import {itemListenerMixin} from "common/mixin";

  import {mapActions} from "vuex"

  export default {
    name: "Detail",
    components:{
      DetailShopInfo,
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      GoodsList,
      BackTop,
      //Toast,
      Scroll
    },
    mixins: [itemListenerMixin],
    data(){
      return{
        iid: null,
        topImages:[],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        isShowBackTop: false,
        // show:false,
        // message:''
      }
    },
    created() {
      //1保存传入的iid
      this.iid = this.$route.params.iid

      //2根据iid请求详细数据
      getDetail(this.iid).then(res => {
        console.log(res);

        //获取轮播图数据
        const data = res.result;
        this.topImages = data.itemInfo.topImages

        //获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        //创建店铺信息
        this.shop = new Shop(data.shopInfo)

        //保存商品详细数据
        this.detailInfo = data.detailInfo;

        //获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

        //获取评论信息
        if (data.rate.cRate !==0){
          this.commentInfo = data.rate.list[0]
        }

        this.$nextTick(() => {
          this.themeTopYs = []

          this.themeTopYs.push(0);
          this.themeTopYs.push(this.$refs.params.$el.offsetTop);
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
          console.log(this.themeTopYs);
        })
      })

      //3请求推荐数据
      getRecommend().then(res => {
        console.log(res);
        this.recommends = res.data.list
      })

      //4给getThemeTopY赋值,防抖
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        this.themeTopYs.push(Number.MAX_VALUE)

        console.log(this.themeTopYs);
      },100)
    },
    mounted() {
    },
    destroyed() {
      //取消全局事件监听,第二个参数为取消的函数
      this.$bus.$off('itemImgLoad',this.itemImgListener)
    },
    methods:{
      ...mapActions(['addCart']),
      imageLoad(){
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },
      titleClick(index){
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],1000)
      },
      contentScroll(position){
        //console.log(position);
        //获取Y值
        const positionY = -position.y

        let length = this.themeTopYs.length
        for (let i=0;i < length-1; i++){
          // if (positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]){
          //
          // }
          if (this.currentIndex !==i
            && ( positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex
          }

          //1.
          // if (this.currentIndex !==i
          //   && ((i < length-1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])
          //   || (i === length - 1 && positionY > this.themeTopYs[i]))){
          //   this.currentIndex = i;
          //   this.$refs.nav.currentIndex = this.currentIndex
          // }
        }

        //是否显示回到顶部
        this.isShowBackTop = -position.y > 1000
      },
      backClick(){
        this.$refs.scroll.scrollTo(0,0,500)
      },
      addToCart(){
        //console.log('----');
        //1.获取购物车需要展示的商品信息
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;

        //2.将商品添加到购物车
        //this.$store.cartList.push(product)
        //this.$store.commit('addCart',product)
        this.addCart(product).then(res => {
          // this.show = true;
          // this.message = res;
          // setTimeout(() => {
          //   this.show = false;
          // },1500)
          this.$toast.show(res, 2000)
          //console.log(this.$toast);
        })
        // this.$store.dispatch('addCart',product).then(res => {
        //   console.log(res);
        // })

        //成功添加到购物车
      }
    }
  }
</script>

<style scoped>
  #detail{
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content{
    height: calc(100% - 44px - 58px);
  }
</style>
