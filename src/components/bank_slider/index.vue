<template>
  <div class="slider">
    <div class="slider-title">
      <span v-show="!getIsFold"> {{ $t(sliderTitle) }}</span>
      <span @click="foldChange()">
        <i
          :class="!getIsFold ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"
        ></i>
      </span>
    </div>
    <el-row>
      <el-col :span="24">
        <div v-if="!getIsFold" key="silderMenu">
          <chbMenu
            :default-active="getSliderMenusAct"
            :unique-opened="true"
            class="el-menu-slider"
            @open="handleOpen"
            @close="handleClose"
            @select="handleSelect"
          >
            <silderMenu :menuList="getSliderMenus"></silderMenu>
          </chbMenu>
        </div>
        <div v-else key="sildeIcon">
          <sildeIcon :menuList="getSliderMenus"></sildeIcon>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import silderMenu from './silderMenu';
import sildeIcon from './sildeIcon';
import ChbMenu from 'src/components/w3cComponents/components/chb-menu/chb-menu.vue';
import imageIcon from 'utils/imageIcon';
export default {
  name: 'SilderBar',
  data() {
    return {
      defaultActive: '',
      defaultOpeneds: ['7'],
      list: [],
      imageIcon,
      isFold: false
    };
  },
  components: {
    silderMenu,
    sildeIcon,
    ChbMenu
  },
  computed: {
    ...mapGetters([
      'getSliderMenus',
      'getSliderMenusAct',
      'getUserMenus',
      'getUserMenusAct',
      'getIsFold'
    ]),
    sliderTitle() {
      return (
        this.getUserMenus.length > 0 &&
        this.getUserMenus.filter(item => item.name === this.getUserMenusAct)[0]
          .meta.navTitle
      );
    }
  },
  mounted() {
    console.log(
      this.getIsFold,
      typeof this.getIsFold,
      'this.getIsFoldthis.getIsFold'
    );
  },
  methods: {
    ...mapMutations(['setIsClickSliderHomeNavJump', 'setIsFold']),
    handleSelect(key, keyPath) {
      this.setIsClickSliderHomeNavJump(key);
    },
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
    foldChange() {
      this.getIsFold ? this.setIsFold('false') : this.setIsFold('true');
    }
  }
};
</script>
<style lang="scss">
@import './index.scss';
</style>