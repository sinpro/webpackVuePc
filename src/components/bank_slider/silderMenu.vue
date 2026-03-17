<template>
  <div class="silder-menu">
    <template v-for="(item, index) in menuList">
      <el-submenu
        :key="item.name"
        v-if="item.children && !!item.children.length"
        :index="item.name"
        ref="menu"
      >
        <template slot="title">
          <div tabindex="0" @keydown.enter="handleTollage(index)">
            <img
              :src="
                imageIcon[item.meta.navTitle]
                  ? imageIcon[item.meta.navTitle]
                  : imageIcon['NAV_TIT.IMPORTANT_FILE']
              "
              alt=""
              style="
                height: 20px;
                width: 20px;
                margin-right: 5px;
                vertical-align: middle;
              "
            />
            <span>{{ $t(item.meta.navTitle) }}</span>
          </div>
        </template>
        <silderMenu :menuList="item.children" tabindex="0"></silderMenu>
      </el-submenu>
      <el-menu-item
        v-else
        :key="item.name"
        :index="item.name"
        @click="clickHander(item)"
      >
        <div tabindex="0" @keydown.enter="clickHander(item)">
          <img
            :src="
              imageIcon[item.meta.navTitle]
                ? imageIcon[item.meta.navTitle]
                : imageIcon['NAV_TIT.IMPORTANT_FILE']
            "
            alt=""
            style="
              height: 20px;
              width: 20px;
              margin-right: 5px;
              vertical-align: middle;
            "
          />
          <span>{{ $t(item.meta.navTitle) }}</span>
        </div>
      </el-menu-item>
    </template>
  </div>
</template>
<script>
import imageIcon from 'utils/imageIcon';
export default {
  name: 'silderMenu',
  data() {
    return {
      imageIcon
    };
  },
  computed: {},
  props: ['menuList'],
  mounted() {
    console.log(imageIcon, 'imageIconimageIcon');
  },
  methods: {
    clickHander(val) {
        // if(sessionStorage.getItem('isDoneModFlag')){
        //     this.$LogoutClear();
        //     return
        // }
      this.$router.replace(val.path);
    },
    handleTollage(index) {
      this.$refs.menu[index].handleClick();
    }
  }
};
</script>
<style lang="scss" scoped></style>

