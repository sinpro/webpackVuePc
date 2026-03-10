<!--
  * @author:doujiandong
  * @date:2023/05/13
  * @describe:开发模板
  * @modified:
-->
<template>
  <!-- 根节点 1、注意：顶层DOM的类名必须为wrap-xxx，务必不要重名【强制】-->
  <div class="wrap-xxx">
    <!-- 业务功能在此开发 -->
  </div>
</template>

<script>
/**
 *2、注意：严格按照以下引入顺序进行引入【强制】
 *       ⑤引入公共组件（即components中的组件）
 *       ②引入自定义组件业务组件（统一放在功能模块的components中）
 *       ③公共工具、方法（即utils里面的工具）
 *       ④自定义私有工具（统一放在功能模块的utils中）
 */
export default {
  name: '', // 组件名（首字母必须大写）
  props: [], // 组件传值所需数据
  // 组件注册
  components: {},
  // 页面所需数据
  data() {
    return {};
  },
  // 计算属性
  computed: {},
  watch: {},
  // 过滤器集合
  filters: {},
  // 页面初始化执行
  created() {},
  // DOM加载完毕执行
  mounted() {},
  // 页面用到的方法
  methods: {}
};
</script>

<style lang="scss" scoped>
/**
注意：样式拆分成单独的scss文件进行引入使用【强制】
 */
@import './index.scss';
</style>
