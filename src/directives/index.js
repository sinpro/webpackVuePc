import Vue from 'vue';

// v-focus
Vue.directive('focus', {
  inserted: function (el) {
    el.focus();
  }
});

Vue.directive('debounce', {
  bind: function (el, binding) {
    let handler = binding.value;
    el.addEventListener('keyup', function () {
      clearTimeout(el._timer); // 清除之前的定时器
      el._timer = setTimeout(() => {
        handler();
      }, 500); // 例如500毫秒后执行
    });
  }
});



Vue.directive('throttle', {
  bind: function (el, binding, vnode) {
    let handler = binding.value;
    let timeout = false;
    el.addEventListener('scroll', function () {
      if (!timeout) {
        timeout = true;
        setTimeout(() => {
          timeout = false;
          handler();
        }, 500); // 例如500毫秒后重置timeout
      }
    });
  }
});


Vue.directive('drag', {
  bind: function (el) {
    let originX, originY, originLeft, originTop;
    el.onmousedown = function (e) {
      // 鼠标按下，开始拖拽
      originX = e.clientX; // 获取鼠标按下时的水平位置
      originY = e.clientY; // 获取鼠标按下时的垂直位置
      originLeft = el.offsetLeft; // 获取元素左边界的位置
      originTop = el.offsetTop; // 获取元素上边界的位置
      document.onmousemove = function (e) { // 鼠标移动时的事件处理函数
        let moveX = e.clientX - originX; // 计算鼠标移动的水平距离
        let moveY = e.clientY - originY; // 计算鼠标移动的垂直距离
        el.style.left = originLeft + moveX + 'px'; // 更新元素左边界的位置
        el.style.top = originTop + moveY + 'px'; // 更新元素上边界的位置
      };
      document.onmouseup = function () { // 鼠标释放时的事件处理函数，停止拖拽并清理事件监听器
        document.onmousemove = document.onmouseup = null;
      };
      return false; // 阻止非IE浏览器文本被选择或页面滚动行为的发生
    };
  }
});


Vue.directive('selectLoadMore', {
    bind: (el, binding, vnode) => {
        setTimeout(() => {
            console.log(el, document);
            const selectDom = el.querySelector('.el-select-dropdown__wrap');
            selectDom.addEventListener('scroll', function () {
                if (this.scrollHeight - this.scrollTop < this.clientHeight + 1) {
                    binding.value();
                }
            });
        });
    }
})

