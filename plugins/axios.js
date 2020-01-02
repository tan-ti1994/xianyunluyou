import { Message } from "element-ui";

export default ({ $axios }) => {
    // 拦截axios的错误
    $axios.onError(res => {
        console.log(res.response);
        // 结构函数
        const { statusCode, message } = res.response.data;
        if (statusCode === 400) {
            // Message相当于this.$message
           Message.error(message)
        }

    })
}
