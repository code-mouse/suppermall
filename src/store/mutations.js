import { ADD_COUNTER, ADD_TO_CART } from './mutation-types.ts'

export default {
  //mutations唯一目的修改修改state的状态
  [ADD_COUNTER](state,payload){
    payload.count++
  },
  [ADD_TO_CART](state,payload){
    payload.checked = true
    state.cartList.push(payload)
  }
}
