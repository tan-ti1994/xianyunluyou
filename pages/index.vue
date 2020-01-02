<template>
<!-- 轮播图 -->
<div>
  <el-carousel height="400px" :interval="5000" arrow="always">
    <el-carousel-item v-for="(item, index) in banners" :key="index">
      <img :src="`${$axios.defaults.baseURL + item.url}`" alt="" />
    </el-carousel-item>
  </el-carousel>

  </div>
</template>

<script>
import { lightpink } from "color-name";
export default {
  data() {
    return {
      banners: []
    };
  },
  mounted() {
    this.$axios({
      url: "/scenics/banners"
    }).then(res => {
      console.log(res);

      // const{data}=res.data;
      this.banners = res.data.data;
    });
  },
  
  
};
</script>

<style lang="less" scoped>
img {
  width: 100%;
  height: 100%;
 
}

</style>
