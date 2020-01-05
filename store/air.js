export const state = () => ({
    price: 0
})

export const mutations = {
    // 存储总价格
    setAllpirce(state, price) {
        state.allpirce = price
    }
}