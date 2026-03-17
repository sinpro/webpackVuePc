<template>
  <div class="bgimg-box">
    <div class="carousel-rtbtn">
      <span @keydown.enter="handleKeyEnter" @click="handleKeyEnter"></span>
    </div>
    <div
      :class="carouselClasses"
      @mouseenter.stop="handleMouseEnter"
      @mouseleave.stop="handleMouseLeave"
      ref="myHomeCarousel"
      tabindex="0"
    >
      <div class="el-carousel__container" :style="{ height: height }">
        <transition v-if="arrowDisplay" name="carousel-arrow-left">
          <button
            tabindex="0"
            type="button"
            :title="ariaLeftText"
            v-show="(arrow === 'always' || hover) && (loop || activeIndex > 0)"
            @mouseenter="handleButtonEnter('left')"
            @mouseleave="handleButtonLeave"
            @click.stop="throttledArrowClick(activeIndex - 1)"
            @keydown.enter.stop="throttledArrowClick(activeIndex - 1)"
            class="el-carousel__arrow el-carousel__arrow--left myBtnFocusCls"
          >
            <i class="el-icon-arrow-left"></i>
          </button>
        </transition>
        <transition v-if="arrowDisplay" name="carousel-arrow-pause">
          <!-- @mouseenter="handlePauseEnter"
            @mouseleave="handleButtonLeave" -->
          <button
            tabindex="0"
            type="button"
            :title="ariaPauseTextText"
            v-show="(arrow === 'always' || hover) && (loop || activeIndex > 0)"
            @click.stop="handlePauseEnter"
            @keydown.enter.stop="handlePauseEnter"
            class="el-carousel__arrow el-carousel__arrow--left myBtnFocusCls pauseIcon"
          >
            <i
              class="el-icon-video-pause"
              v-if="amazingCurrentStatus == 'autoplay'"
            ></i>
            <i
              class="el-icon-video-play"
              v-if="amazingCurrentStatus == 'pause'"
            ></i>
          </button>
        </transition>
        <transition v-if="arrowDisplay" name="carousel-arrow-right">
          <button
            tabindex="0"
            type="button"
            :title="ariaRightTextText"
            v-show="
              (arrow === 'always' || hover) &&
              (loop || activeIndex < items.length - 1)
            "
            @mouseenter="handleButtonEnter('right')"
            @mouseleave="handleButtonLeave"
            @click.stop="throttledArrowClick(activeIndex + 1)"
            @keydown.enter.stop="throttledArrowClick(activeIndex + 1)"
            class="el-carousel__arrow el-carousel__arrow--right myBtnFocusCls"
          >
            <i class="el-icon-arrow-right"></i>
          </button>
        </transition>

        <slot></slot>
      </div>
      <ul v-if="indicatorPosition !== 'none'" :class="indicatorsClasses">
        <li
          tabindex="0"
          v-for="(item, index) in items"
          :key="index"
          :class="[
            'el-carousel__indicator',
            'el-carousel__indicator--' + direction,
            { 'is-active': index === activeIndex }
          ]"
          @mouseenter="throttledIndicatorHover(index)"
          @click.stop="handleIndicatorClick(index)"
          @keydown.enter.stop="handleIndicatorClick(index)"
          :id="'myIndicator-' + index"
          :data-index="index"
        >
          <button
            tabindex="-1"
            :title="getIndicatorTitle(item, index)"
            class="el-carousel__button"
          >
            <span v-if="hasLabel">{{ item.label }}</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import throttle from 'throttle-debounce/throttle';
import {
  addResizeListener,
  removeResizeListener
} from 'element-ui/lib/utils/resize-event';
import i18n from 'src/i18n';

export default {
  name: 'ElCarousel',

  props: {
    initialIndex: {
      type: Number,
      default: 0
    },
    height: String,
    trigger: {
      type: String,
      default: 'hover'
    },
    stepTitle: {
      type: String,
      default: 'step'
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    },
    // indicatorPosition: String,
    indicatorPosition: {
      type: String,
      default: 'outside'
    },
    indicator: {
      type: Boolean,
      default: true
    },
    arrow: {
      type: String,
      default: 'hover'
    },
    leftText: {
      type: String,
      default: 'left'
    },
    pauseText: {
      type: String,
      default: 'pause'
    },
    rightText: {
      type: String,
      default: 'right'
    },
    type: String,
    loop: {
      type: Boolean,
      default: true
    },
    direction: {
      type: String,
      default: 'horizontal',
      validator(val) {
        return ['horizontal', 'vertical'].indexOf(val) !== -1;
      }
    }
  },

  data() {
    return {
      items: [],
      activeIndex: -1,
      containerWidth: 0,
      timer: null,
      hover: false,
      amazingCurrentStatus: 'autoplay'
    };
  },

  computed: {
    ariaLeftText() {
      return i18n.t('COMMON.LEFT') || this.leftText;
    },
    ariaPauseTextText() {
      return (
        (this.amazingCurrentStatus == 'autoplay'
          ? i18n.t('COMMON.PAUSE')
          : i18n.t('COMMON.PALYAUTO_PIC')) || this.pauseText
      );
    },
    ariaRightTextText() {
      return i18n.t('COMMON.RIGHT') || this.rightText;
    },
    arrowDisplay() {
      return this.arrow !== 'never' && this.direction !== 'vertical';
    },

    hasLabel() {
      return this.items.some(item => item.label.toString().length > 0);
    },

    carouselClasses() {
      const classes = ['el-carousel', 'el-carousel--' + this.direction];
      if (this.type === 'card') {
        classes.push('el-carousel--card');
      }
      return classes;
    },

    indicatorsClasses() {
      const classes = [
        'el-carousel__indicators',
        'el-carousel__indicators--' + this.direction
      ];
      if (this.hasLabel) {
        classes.push('el-carousel__indicators--labels');
      }
      if (this.indicatorPosition === 'outside' || this.type === 'card') {
        classes.push('el-carousel__indicators--outside');
      }
      return classes;
    }
  },

  watch: {
    items(val) {
      if (val.length > 0) this.setActiveItem(this.initialIndex);
    },

    activeIndex(val, oldVal) {
      this.resetItemPosition(oldVal);
      if (oldVal > -1) {
        this.$emit('change', val, oldVal);
      }
    },

    autoplay(val) {
      val ? this.startTimer() : this.pauseTimer();
    },

    loop() {
      this.setActiveItem(this.activeIndex);
    }
  },

  methods: {
    //指示器三語言
    getIndicatorTitle(item, index) {
      return i18n.t('COMMON.INDICATOR') || item.label || this.stepTitle + index;
    },
    //处理轮播图键盘事件
    keydownHandler(e) {
      let isTabKey = e.keyCode === 9 || e.code == 'Tab' || e.key == 'Tab';
      // let isArrowUpKey = e.keyCode === 38 || e.code == 'ArrowUp' || e.key =='ArrowUp';
      // let isArrowDownKey = e.keyCode === 40 || e.code == 'ArrowDown' || e.key =='ArrowDown';
      // let isEnterKey = e.keyCode === 13 ||  e.code == 'Enter' || e.key =='Enter';
      // let isSpaceKey = e.keyCode === 32 ||  e.code == 'Space' || e.key ==' ';
      // let isCarouselImg = e.target.alt&&e.target.alt=="banner"&&e.target.tagName=="IMG";//轮播图图片
      let isChooseCarousel = e.target.className == 'bgimg-box carousel';
      let hasIn = e.target.className == 'el-carousel el-carousel--horizontal';
      // let isLastDom = e.target.className =='el-carousel__button'&&e.target.dataset.index*1 == (this.items.length-1);
      let isLastLiDom =
        e.target.tagName == 'LI' &&
        e.target.dataset.index * 1 == this.items.length - 1; //tabkey最后选中的一定是最后一个指示器

      // 这里有点小缺陷，就是不知道是哪里的键盘事件支持上下键，导致可能切换出去了，但是左右暂停icon依然显示，，没时间去研究是哪里！！
      // 这里有点小缺陷，就是不知道是哪里的键盘事件支持上下键，导致可能切换出去了，但是左右暂停icon依然显示，，没时间去研究是哪里！！
      // 这里有点小缺陷，就是不知道是哪里的键盘事件支持上下键，导致可能切换出去了，但是左右暂停icon依然显示，，没时间去研究是哪里！！
      if (isTabKey) {
        if (isLastLiDom) {
          this.handleMouseLeave();
        }
        if (hasIn || isChooseCarousel) {
          this.handleMouseEnter();
        } else {
          //  this.$refs.myHomeCarousel.handleMouseLeave();
        }
      } else {
        e.preventDefault();
        return false;
      }
    },
    // 轮播图暂停/恢复
    handlePauseEnter() {
      if (this.amazingCurrentStatus == 'autoplay') {
        this.amazingCurrentStatus = 'pause';
        this.pauseTimer();
        return false;
      }
      if (this.amazingCurrentStatus == 'pause') {
        this.amazingCurrentStatus = 'autoplay';
        this.startTimer();
        return false;
      }
    },
    handleKeyEnter(e) {
      this.pauseTimer();
    },
    handleMouseEnter() {
      this.hover = true;
      this.pauseTimer();
    },

    handleMouseLeave() {
      this.hover = false;
      // 因为会触发，导致计时器恢复开始
      if (this.amazingCurrentStatus == 'pause') {
        return false;
      }
      this.startTimer();
    },

    itemInStage(item, index) {
      const length = this.items.length;
      if (
        (index === length - 1 && item.inStage && this.items[0].active) ||
        (item.inStage && this.items[index + 1] && this.items[index + 1].active)
      ) {
        return 'left';
      } else if (
        (index === 0 && item.inStage && this.items[length - 1].active) ||
        (item.inStage && this.items[index - 1] && this.items[index - 1].active)
      ) {
        return 'right';
      }
      return false;
    },

    handleButtonEnter(arrow) {
      if (this.direction === 'vertical') return;
      this.items.forEach((item, index) => {
        if (arrow === this.itemInStage(item, index)) {
          item.hover = true;
        }
      });
    },

    handleButtonLeave() {
      if (this.direction === 'vertical') return;
      this.items.forEach(item => {
        item.hover = false;
      });
    },

    updateItems() {
      this.items = this.$children.filter(
        child => child.$options.name === 'ElCarouselItem'
      );
    },

    resetItemPosition(oldIndex) {
      this.items.forEach((item, index) => {
        item.translateItem(index, this.activeIndex, oldIndex);
      });
    },

    playSlides() {
      if (this.activeIndex < this.items.length - 1) {
        this.activeIndex++;
      } else if (this.loop) {
        this.activeIndex = 0;
      }
    },

    pauseTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    startTimer() {
      if (this.interval <= 0 || !this.autoplay || this.timer) return;
      this.timer = setInterval(this.playSlides, this.interval);
    },

    setActiveItem(index) {
      if (typeof index === 'string') {
        const filteredItems = this.items.filter(item => item.name === index);
        if (filteredItems.length > 0) {
          index = this.items.indexOf(filteredItems[0]);
        }
      }
      index = Number(index);
      if (isNaN(index) || index !== Math.floor(index)) {
        console.warn('[Element Warn][Carousel]index must be an integer.');
        return;
      }
      let length = this.items.length;
      const oldIndex = this.activeIndex;
      if (index < 0) {
        this.activeIndex = this.loop ? length - 1 : 0;
      } else if (index >= length) {
        this.activeIndex = this.loop ? 0 : length - 1;
      } else {
        this.activeIndex = index;
      }
      if (oldIndex === this.activeIndex) {
        this.resetItemPosition(oldIndex);
      }
    },

    prev() {
      this.setActiveItem(this.activeIndex - 1);
    },

    next() {
      this.setActiveItem(this.activeIndex + 1);
    },

    handleIndicatorClick(index) {
      console.log('ui');
      this.activeIndex = index;
    },

    handleIndicatorHover(index) {
      if (this.trigger === 'hover' && index !== this.activeIndex) {
        this.activeIndex = index;
      }
    }
  },

  created() {
    this.throttledArrowClick = throttle(300, true, index => {
      this.setActiveItem(index);
    });
    this.throttledIndicatorHover = throttle(300, index => {
      this.handleIndicatorHover(index);
    });
  },

  mounted() {
    this.updateItems();
    this.$nextTick(() => {
      addResizeListener(this.$el, this.resetItemPosition);
      if (this.initialIndex < this.items.length && this.initialIndex >= 0) {
        this.activeIndex = this.initialIndex;
      }
      this.startTimer();
    });
    this.$refs?.myHomeCarousel &&
      this.$refs.myHomeCarousel.addEventListener(
        'keydown',
        this.keydownHandler
      );
  },

  beforeDestroy() {
    if (this.$el) removeResizeListener(this.$el, this.resetItemPosition);
    this.pauseTimer();
    this.$refs?.myHomeCarousel &&
      this.$refs.myHomeCarousel.removeEventListener(
        'keydown',
        this.keydownHandler
      );
  }
};
</script>
<style lang="scss" scoped>
.myBtnFocusCls {
  &:focus {
    // background-color: red;
    border: 1px solid #000;
    // color: green;
  }
}
.pauseIcon {
  left: 94%; //50%;
  background-color: rgba(31, 45, 61, 0.41);
  top: 10%;
  font-size: 24px;
  line-height: 24px;
}
</style>

