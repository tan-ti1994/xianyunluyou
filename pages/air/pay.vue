<template>
  <div class="container">
    <div class="main">
      <div class="pay-title">
        支付总金额 <span class="pay-price">￥ {{ this.details.price }}</span>
      </div>
      <div class="pay-main">
        <h4>微信支付</h4>
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          class="pay-qrcode"
        >
          <div class="qrcode">
            <!-- 二维码 -->
            <canvas id="qrcode-stage"></canvas>
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt="" />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
export default {
  data() {
    return {
      //    订单详情
      details: "",
      //  定时器
      timer: false
    };
  },
  methods: {
    checkPay() {
      this.timer = setInterval(() => {
        this.$axios({
          url: "/airorders/checkpay",
          method: "POST",
          data: {
            id: this.details.id,
            monce_str: this.details.price, //订单金额
            out_trade_no: this.details.orderNo // 订单编码
          },
          headers: {
            Authorization: "Bearer " + this.$store.state.user.userInfo.token
          }
        }).then(res => {
          console.log(res);
          if (res.data.statusTxt !== "订单未支付") {
            this.$alert("订单支付成功", "提示");
            // 停止定时器
            clearInterval(this.timer);
            // this.timer = false
          }
        });
      }, 3000);
    }
  },
  // 组件卸载时清楚定时器
  destroyed() {
    clearInterval(this.timer);
  },
  mounted() {
    // 获取订单ID
    const { id } = this.$route.query;
    // 订单详情
    setTimeout(() => {
      this.$axios({
        url: "/airorders/" + id,
        headers: {
          Authorization: "Bearer " + this.$store.state.user.userInfo.token
        }
      }).then(res => {
        console.log(res);
        this.details = res.data;
        //   生成二维码
        const stage = document.querySelector("#qrcode-stage");
        QRCode.toCanvas(stage, this.details.payInfo.code_url, {
          width: 200
        });
      });
      this.checkPay();
    }, 0);
  }
};
</script>

<style scoped lang="less">
.container {
  background: #f5f5f5;
  padding: 30px 0;

  .main {
    width: 1000px;
    margin: 0 auto;

    .pay-title {
      text-align: right;
      span {
        font-size: 28px;
        color: orangered;
      }
    }

    .pay-main {
      background: #fff;
      margin-top: 10px;
      border-top: 5px orange solid;
      padding: 30px;

      h4 {
        font-size: 28px;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .pay-qrcode {
        padding: 0 80px;
      }

      .qrcode {
        border: 1px #ddd solid;
        padding: 15px;
        height: fit-content;

        #qrcode-stage {
          width: 200px;
          height: 200px;
          margin-bottom: 10px;
        }

        p {
          line-height: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>
