<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名手机" v-model="form.username"> </el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="captcha">
      <el-input placeholder="验证码" v-model="form.captcha">
        <template slot="append">
          <el-button @click="handleSendCaptcha">
            发送验证码
          </el-button>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="nickname">
      <el-input placeholder="你的名字" v-model="form.nickname"> </el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input
        placeholder="密码"
        type="password"
        v-model="form.password"
      ></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="checkPassword">
      <el-input
        placeholder="确认密码"
        type="password"
        v-model="form.checkPassword"
      >
      </el-input>
    </el-form-item>

    <el-button class="submit" type="primary" @click="handleRegSubmit">
      注册
    </el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      const res = /^1[3-9][0-9]{9}$/;
      if (res.test(value)) {
        // 验证通过;
        callback();
      } else {
        callback("手机号码格式错误");
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 表单数据
      form: {
        username: "", //手机号码
        nickname: "", //昵称
        captcha: "", //手机验证码
        password: "", //密码
        checkPassword: "" // 确认密码
      },
      // 表单规则
      rules: {
        username: [{ validator: validatePass, trigger: "blur" }],
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        checkPassword: [{ validator: validatePass2, trigger: "blur" }],
        captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 发送验证码
    handleSendCaptcha() {
      if (!this.form.username) {
        this.$message.warning("手机号不能为空");
        return;
      }

      // if (!this.form.captcha) {
      //   this.$message.warning("验证码不能为空");
      // }
      this.$axios({
        url: "/captchas",
        method: "POST",
        data: {
          tel: this.form.username
        }
      }).then(res => {
        console.log(res);
        this.captcha = res.data;
        // 提示发送到手机
        this.$message.success("验证码已发送到手机");
      });
    },

    // 注册
    handleRegSubmit() {
      console.log(this.form);
      // valid代表验证通过
      this.$refs.form.validate(valid => {
        if (valid) {
          // 删除验证码数据
          const { checkPassword, ...pass } = this.form;
          this.$axios({
            url: "/accounts/register",
            method:'POST',
            data:pass
          }).then(res=>{
            this.$message.success('注册成功')
          })
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}

.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}

.submit {
  width: 100%;
  margin-top: 10px;
}
</style>
