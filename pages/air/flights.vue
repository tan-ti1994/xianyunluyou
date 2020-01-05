<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->

        <flightsFilters
          :data="copyList"
          @setDataList="setDataList"
        ></flightsFilters>

        <!-- 航班头部布局 -->
        <div>
          <flightsListHead></flightsListHead>
        </div>

        <!-- 航班信息 -->
        <div>
          <flightsItem
            v-for="(item, index) in dataList"
            :key="index"
            :data="item"
          >
          </flightsItem>
          <!-- 分页组件 -->
          <!-- size-change：切换条数时候触发 -->
          <!-- current-change：选择页数时候触发 -->
          <!-- current-page: 当前页数 -->
          <!-- page-size：当前条数 -->
          <!-- total：总条数 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
      </div>
    </el-row>
  </section>
</template>

<script>
import moment from "moment";
import flightsListHead from "@/components/air/flightsListHead";
import flightsItem from "@/components/air/flightsItem";
import flightsFilters from "@/components/air/flightsFilters";

export default {
  components: {
    flightsListHead,
    flightsItem,
    flightsFilters
  },
  data() {
    return {
      flightsList: {
        // 航班总数据
        // 异步请求给个空值,防止报错
        flights: [],
        info: {},
        options: {}
      },
      // 缓存的变量,该变量一旦被赋值就不会被修改
      copyList: {
        flights: [],
        info: {},
        options: {}
      },
      // dataList: [], // 分页数据存放

      pageIndex: 1, // 当前页数
      pageSize: 5, // 显示条数
      total: 0 // 返回总数
    };
  },
  // 计算属性函数内部引用实例的属性,一旦发生了变化,该函数会重新计算,并且返回新的值
  computed: {
    dataList() {
      // 如果没有完成,返回空数组
      if (!this.flightsList.flights) return [];
      return this.flightsList.flights.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      );
    }
  },
  // 获取数据
  mounted() {
    //   console.log(this.$route.query)
    this.$axios({
      url: "/airs",
      params: this.$route.query //从首页传过来的的数据
    }).then(res => {
      console.log(res);
      // 赋值给总数据,但是在过滤的时候变量中的flights会被修改
      this.flightsList = res.data;
    // 这是缓存变量,不会被修改
      this.copyList = { ...res.data };
      // 切割出来第一页的数据
      // this.dataList = this.flightsList.flights.slice(0, 5);
      // 总条数
      this.total = this.flightsList.total;
    });
  },
  methods: {
    // 给过滤的组件来修改this.flightsList.flights的数据
    // arr就是过滤后得到的数据
    setDataList(arr) {
      // 过滤后的数组
      this.flightsList.flights = arr;
      // 修改后的总条数
      this.total=arr.length
    },
    // 切换分页条数时触发
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 切换页数时触发
    handleCurrentChange(val) {
      this.pageIndex = val;
    }
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>
