import { ADD_COUNTER, ADD_TO_CART } from './mutation-types.ts'

export default {
  addCart(context,payload){
    return new Promise((resolve, reject) => {
      //查询之前数组中是否有该商品
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      //判断oldProduct
      if (oldProduct) {
        //oldProduct.count += 1
        context.commit(ADD_COUNTER,oldProduct)
        resolve('当前商品数量加1')
      }else {
        payload.count = 1
        //context.state.cartList.push(payload)
        context.commit(ADD_TO_CART,payload)
        resolve('添加新的商品')
      }
    })
    //payload新添加的商品
    //1.
    // let oldProduct = null;
    // for(let item of state.cartList){
    //   if (item.iid === payload.iid){
    //     oldProduct = item
    //   }
    // }
  }
}
