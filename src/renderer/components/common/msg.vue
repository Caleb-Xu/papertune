<template>
  <transition name="msg">
    <div data-root v-show="show" id="msg">
      <span id="text">{{msg}}</span>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";
import bus from "@/renderer/bus";

export default Vue.extend({
  data() {
    return {
      show: false,
      msg: ""
    };
  },
  methods: {
    showMsg(msg) {
      console.log("show msg", msg);
      this.show = true;
      this.msg = msg;
      this.$nextTick(() => (this.show = false));
    }
  },
  created() {
    bus.$on("showMsg", this.showMsg);
  }
});
</script>

<style lang="stylus" scoped>
$opacity = 0.6;

@keyframes show-msg {
  0% {
    opacity: 0;
  }

  50% {
    opacity: $opacity;
  }

  100% {
    opacity: $opacity;
  }
}

// .msg-enter-active {
// animation: show-msg 5s;
// }
.msg-leave-active {
  animation: show-msg 2s reverse;
}

/* *固定配色 */
[data-root] {
  user-select: none;
  align-self: center;
  position: absolute;
  top: 300px;
  height: 60px;
  background-color: var(--important);
  opacity: $opacity;
  // display: inline-block;
  min-width: 100px;
  z-index: 100000;
  padding: 0 10px;

  span {
    font-size: var(--l);
    font-weight: bold;
    line-height: 60px;
    text-align: center;
    color: white;
    background-color: transparent;
  }
}
</style>