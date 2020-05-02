<template>
  <transition name="tip">
    <div :style="setPosition">
      <div id="message-box" :class="[type]">
        <div id="message">
          {{message}}
          <span class="iconfont icon-close" @click="$emit('close')" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script src="./tip.ts"/>

<style lang="stylus" scoped>
.tip-enter-active {
  animation: zoom-in 0.1s;
}

.tip-leave-active {
  animation: zoom-in 0.1s reverse;
}

#message-box {
  height: 30px;
  line-height: @height;
  text-align: center;
  display: inline-block;
  padding: 0 5px;

  &.normal {
    background-color: var(--normal);
    color: var(--background);
  }

  &.error {
    background-color: var(--red);
    color: var(--background);
  }

  &.warning {
    background-color: var(--yellow);
    color: var(--background);
  }

  #message {
    text-align: center;
    background: transparent;
  }
}
</style>