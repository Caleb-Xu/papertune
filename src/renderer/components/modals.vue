<template>
  <div data-root>
    <modal
      v-for="(item,index) in modalList"
      :key="item.id"
      v-bind="item.option"
      :name="index"
      v-show="item.active"
      @close="closeModal"
    />
  </div>
</template>

<script src="./modals.ts"/>

<style lang="stylus" scoped>
[data-root] {
  position: absolute;
  background: transparent;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>