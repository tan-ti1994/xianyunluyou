import { Message } from "element-ui";

export default (Nuxt) => {
    // 拦截axios的错误

    Nuxt.$axios.onError(res => {
            console.log(res.response);
            // 结构函数
            const { statusCode, message } = res.response.data;
            if (statusCode === 400) {
                // Message相当于this.$message
                Message.error(message)
            }
            if (statusCode === 401) {
                // Message相当于this.$message
                Message.error("登录过期，跳转到登录页");
                // 跳转到登录页
                Nuxt.redirect(200, "/user/login");
            }

        })
    }
