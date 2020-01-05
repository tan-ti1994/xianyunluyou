<template>
  <div class="main">
    <div class="air-column">
      <h2>剩机人</h2>
      <el-form class="member-info">
        <div
          class="member-info-item"
          v-for="(item, index) in users"
          :key="index"
        >
          <el-form-item label="乘机人类型">
            <el-input
              placeholder="姓名"
              class="input-with-select"
              v-model="item.username"
            >
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input
              placeholder="证件号码"
              class="input-with-select"
              v-model="item.id"
            >
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers"
        >添加乘机人</el-button
      >
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <div
          class="insurance-item"
          v-for="(item, index) in data.insurances"
          :key="index"
          @change="handleInsurance(item.id)"
        >
          <el-checkbox
            :label="
              `${item.type}：￥${item.price}/份×1  最高赔付${item.compensation}`
            "
            border
          >
          </el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入内容" v-model="contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit"
          >提交订单</el-button
        >
      </div>
    </div>
    <samp>{{ allPrice }}</samp>
  </div>
</template>

<script>
export default {
  // 组件接收父组件机票的信息
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      users: [
        {
          username: "",
          id: ""
        }
      ],
      insurances: [], // 保险
      contactName: "", //联系人姓名
      contactPhone: "", //联系人电话
      captcha: "", //手机验证码
      invoice: false, //发票
      seat_xid: "", //座位ID
      air: "" //航班ID
    };
  },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      this.users.push({
        username: "",
        id: ""
      });
    },
    // 保险数据处理
    handleInsurance(id) {
      let index = this.insurances.indexOf(id);
      if (index > -1) {
        this.insurances.splice(index, 1);
      } else {
        this.insurances.push(id);
      }
    },
    // 移除乘机人
    handleDeleteUser(index) {
      this.users.splice(index, 1);
    },

    // 发送手机验证码
    handleSendCaptcha() {
      if (!this.contactPhone) {
        this.$message.error("手机号码不能为空");
        return;
      }

      // 获取验证码数据
      this.$axios({
        url: "/captchas",
        method: "POST",
        data: {
          tel: this.contactPhone
        }
      }).then(res => {
        const { code } = res.data;
        this.$message.success("验证码发送成功");
      });
    },

    // 提交订单
    handleSubmit() {
      const data = {
        users: this.users,
        insurances: this.insurances,
        contactName: this.contactName,
        contactPhone: this.contactPhone,
        invoice: false,
        captcha: this.captcha,
        seat_xid: this.$route.query.seat_xid,
        air: this.$route.query.id
      };

      // console.log(data);

      this.$axios({
        url: "/airorders",
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.$store.state.user.userInfo.token
        },
        data
      }).then(res => {
        console.log(res);
        const { id } = res.data.data;
        this.$message.success("订单正在生成,请稍等");
        //  跳转到付款页
        this.$router.push({
          path:'/air/pay',
          query:{
            id
          }
        });
      });
    }
  },
  // 计算总价格
  computed: {
    allPrice() {
      let price = 0;
      if (!this.data.seat_infos.org_settle_price) return;
      // 机票价单格
      price += this.data.seat_infos.org_settle_price;
      // 保险价格
      price += this.insurances.length * 30;
      // 燃油
      price += this.data.airport_tax_audlet;
      // 人数
      price *= this.users.length;
      // 传递给store
      this.$store.commit("air/setAllpirce", price);
      return "";
    }
  }
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>
