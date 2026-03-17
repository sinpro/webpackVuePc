<template>
  <div class="menu-fold">
    <ul>
      <li
        v-for="(item, i) in menuList"
        :key="i"
        :class="
          item.name == getSliderMenusAct || item.name == getBreadcrumb
            ? 'is-active'
            : ''
        "
        @mouseover="iconMouseOver(item)"
        @mouseleave="() => (showSlideIcon = '')"
        @click="iconRouterClick(item)"
      >
        <span :title="$t(item.meta.navTitle)">
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
        </span>
        <div
          v-if="
            item.children &&
            item.children.length > 0 &&
            item.meta.navTitle == showSlideIcon
          "
          :class="$store.getters.getLang == 'en' ? 'w300' : 'w200'"
        >
          <p
            v-for="(val, j) in item.children"
            :key="j"
            @click.stop="iconRouterClick(val)"
            :class="val.name == getSliderMenusAct ? 'is-active' : ''"
          >
            <img
              :src="
                imageIcon[val.meta.navTitle]
                  ? imageIcon[val.meta.navTitle]
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
            <span>{{ $t(val.meta.navTitle) }}</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import imageIcon from 'utils/imageIcon';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'silderMenu',
  data() {
    return {
      imageIcon,
      showSlideIcon: ''
    };
  },
  computed: {
    ...mapGetters(['getSliderMenusAct', 'getBreadcrumb'])
  },
  props: ['menuList'],
  mounted() {},
  methods: {
    iconMouseOver(item) {
      this.showSlideIcon = item.meta.navTitle;
    },
    iconRouterClick(item = {}) {
      console.log(item, 'itemitemitemitem----------');
      this.$router.replace({
        name: item.name
      });
      //   this.$router.replace(item.path);
    }
  }
};
</script>
<style lang="scss" scoped></style>
