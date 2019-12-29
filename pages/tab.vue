<template>
  <div class="tab">
    <div>
      <span
        v-for="(item, index) in List"
        :key="index"
        @click="handClick(index)"
        :class="{active:current===index}"
        >{{ item }}</span
      >
    </div>
    <div v-if="current === 0">
      <ul>
        <li>普通新闻1</li>
        <li>普通新闻2</li>
        <li>普通新闻3</li>
      </ul>
    </div>
    <div v-if="current === 1">
      <ul>
        <li>体育新闻1</li>
        <li>体育新闻2</li>
        <li>体育新闻3</li>
      </ul>
    </div>
    <div v-if="current === 2">
      <ul>
        <li>娱乐新闻1</li>
        <li>娱乐新闻2</li>
        <li>娱乐新闻3</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      List: ["新闻", "体育", "娱乐"],
      current: 0
    };
  },
  methods: {
      handClick(index){
this.current=index
      }
  }
};
</script>

<style>
.active{
color: blue;

}
.tab{
    margin: 100px 0 0 100px;

}
</style>
