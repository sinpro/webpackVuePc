<!--
  * @author:doujiandong
  * @date:2023/05/13
  * @describe:开发模板
  * @modified:
-->
<template>
  <!-- 根节点 1、注意：顶层DOM的类名必须为wrap-xxx，务必不要重名【强制】-->
  <div class="bank_logon">
    <!-- 业务功能在此开发 -->
    <div class="bank_logon_content">
      <bank-layout>
        <div>
          <button @click="startVerify">开始验证</button>
          <Vcode
            :show="isShow"
            @success="onSuccess"
            @close="onClose"
          />
        </div>
        <!-- 1111<br><br><br><br><br><br>
        22222<br><br><br><br><br><br>
        33333<br><br><br><br><br><br>
        44444<br><br><br><br><br><br>
        555555<br><br><br><br><br><br>
        666666<br><br><br><br><br><br>
        777777<br><br><br><br><br><br>
        888888<br><br><br><br><br><br>
        9999999<br><br><br><br><br><br>
        0000000<br><br><br><br><br><br> -->
      </bank-layout>
    </div>
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
import bankLayout from 'src/components/bank_layout';
import Vcode from 'vue-puzzle-vcode'
export default {
  name: 'bankLogon', // 组件名（首字母必须大写）
  props: [], // 组件传值所需数据
  // 组件注册
  components: {
    [bankLayout.name]:bankLayout,
    Vcode
  },
  // 页面所需数据
  data() {
    return {
      isShow: false // 控制验证码弹框是否显示
    };
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
  methods: {
    startVerify() {
      this.isShow = true // 显示验证码
    },
    onSuccess() {
      // 验证通过时的回调
      console.log('验证成功')
      this.isShow = false // 验证成功后需要手动关闭弹框
      // 这里可以执行后续操作，如表单提交
    },
    onClose() {
      // 用户点击遮罩层关闭弹框时的回调
      console.log('验证码弹框关闭')
      this.isShow = false
    }
  }
};
</script>

<style lang="scss" scoped>
/**
注意：样式拆分成单独的scss文件进行引入使用【强制】
 */
@import './index.scss';
</style>
