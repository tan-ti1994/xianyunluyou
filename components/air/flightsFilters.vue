<template>
  <div class="filters">
    <el-row
      type="flex"
      class="filters-top"
      justify="space-between"
      align="middle"
    >
      <el-col :span="8">
        单程： {{ data.info.departCity }} - {{ data.info.destCity }}
        /
        {{ data.info.departDate }}
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airport" placeholder="起飞机场">
          <el-option
            v-for="(item, index) in data.options.airport"
            :key="index"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="flightTimes" placeholder="起飞时间">
          <el-option
            v-for="(item, index) in data.options.flightTimes"
            :key="index"
            :label="`${item.from}:00-${item.to}:00`"
            :value="`${item.from},${item.to}`"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="company" placeholder="航空公司">
          <el-option
            v-for="(item, index) in data.options.company"
            :key="index"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airSize" placeholder="机型">
          <el-option
            v-for="(item, index) in sizeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button
        type="primary"
        round
        plain
        size="mini"
        @click="handleFiltersCancel"
      >
        撤销
      </el-button>
    </div>
    <!-- 随便调用,为了函数能使用 -->
    <span>{{ filterData }}</span>
  </div>
</template>

<script>
export default {
  props: {
    // 传入的总数据
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      airport: "", // 机场
      flightTimes: "", // 出发时间
      company: "", // 航空公司
      airSize: "", // 机型大小

      //   客机的大小
      sizeOptions: [
        { label: "大", value: "L" },
        { label: "中", value: "M" },
        { label: "小", value: "S" }
      ]
    };
  },
  computed: {
    //   监听选项变化,返回过滤后符合条件的数组,返回给父组件
    // filter过滤
    filterData() {
      let arr = this.data.flights.filter(item => {
        //   默认每条数据都符合条件
        let valid = true;
        // 航空公司
        if (this.company && item.airline_name !== this.company) {
          valid = false;
        }
        // 起飞时间
        if (this.flightTimes) {
          const [from, to] = this.flightTimes.split(",");
          // 出发时间
          const state = item.dep_time.split(":")[0];
          if (state < from || state >= to) {
            valid = false;
          }
          //   机型大小
        }
        if (this.airSize && item.plane_size !== this.airSize) {
          valid = false;
        }

        // 机场
        if (this.airport && item.org_airport_name !== this.airport) {
          valid = false;
        }

        return valid;
      });
      this.$emit("setDataList", arr);
      //   为了渲染页面字符串
      return "";
    }
  },
    methods: {
        
        // 撤销条件时候触发
        handleFiltersCancel(){
            this.airport = "";        
            this.flightTimes = "";    
            this.company =  "";      
            this.airSize = "";   
        }
    }
};
</script>

<style scoped lang="less">
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
</style>
