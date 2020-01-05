<template>
  <div class="container">
    <el-row type="flex" justify="space-between">
      <!-- 订单表单 -->

      <orderindex :data='infoData'></orderindex>

      <!-- 侧边栏 -->
     <orderAside :data="infoData"></orderAside>
    </el-row>
  </div>
</template>

<script>
import orderindex from "@/components/air/orderindex";
import orderAside from "@/components/air/orderAside";
export default {
  components: {
    orderindex,orderAside
  },
  data () {
      return {
            infoData:{
              insurances: [], // 初始化保险数据
              seat_infos:{}
            }
      }
  },
  mounted() {
    //id是动态参数
    const { id, seat_xid } = this.$route.query;
    this.$axios({
      url: "/airs/" + id,
      params: {
        seat_xid
      }
    }).then(res=>{
        // console.log(res);
        
        this.infoData=res.data
    })
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 1000px;
  margin: 20px auto;
}

/*aside*/
.aside {
  width: 350px;
  height: fit-content;
  border: 1px #ddd solid;
}
</style>
