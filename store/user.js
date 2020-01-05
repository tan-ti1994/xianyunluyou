// 用户管理
// 保存user下的数据
export const state = {
    userInfo: {}
};
// 用户信息存到state
// 同步修改state的数据
export const mutations = {
    userInfo(state, data) {
        state.userInfo = data
    }
};
// 异步修改state的数据,存放公共请求函数
export const actions = {

    login(store, data) {
        // 登录接口
        return  this.$axios({
            url: "/accounts/login",
            method: "POST",
            data
        }).then(res => {
            //   登录成功返回上一页
            this.$router.back()

            store.commit('userInfo',res.data)
            return true
        })
    }
}
