<!--
  * @author:doujiandong
  * @date:2023/05/13
  * @describe:开发模板
  * @modified:
-->
<template>
  <transition name="fadeIn">
    <router-view></router-view>
  </transition>
</template>
<script>
export default {
  data() {
    return {
      
    };
  },
  computed: {
    
  },
  watch: {
    $route: {
      handler(newVal, oldVal) {
        
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    
  },
  methods: {
    
  },
  beforeDestroy() {
    
  },
  destroyed() {
    
  }
};
</script>
<style lang="scss" scoped>
.wrap-app {
  &-content {
    // min-width: 1440px;
    min-width: 1000px;
  }
}
</style>
<style type="text/css" media="print,screen">
@media print {
  div {
    -webkit-print-color-adjust: exact;
    -moz-print-color-adjust: exact;
    -ms-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  @page {
    margin: 20px;
    /* size:A4 */
  }
  .bank-main-content {
    border-radius: 0 !important;
  }
  .bank-main,
  .cont,
  .wrap-trading-detail,
  .el-main {
    padding: 0 !important;
  }

  .breadCrumb,
  .btn,
  .bank-header,
  .bank-main-silder,
  .bank-footer {
    display: none !important;
  }
  .bank-main-content,.minWidthAuto {
    margin: 0 !important;
    width: 100%!important;
    max-width: 75%;
    margin-left: 0!important;
    background: #fff;
    overflow: visible!important;
  }
  body {
    height: auto !important;
  }
  .bank-layout-content,
  .bank-main-content .cont-wrap {
    height: auto !important;
    width: 100%!important;
    background-color: #fff!important;
  }
}
</style>