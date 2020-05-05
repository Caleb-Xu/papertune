<template>
  <transition name="menu">
    <div data-root :style="setPosition" v-show="showMenu">
      <ul id="item-list">
        <li
          v-for="(item,index) in itemFilter"
          :style="{height:itemHeight+'px'}"
          class="item-box"
          :key="index+''"
          @click="select(index)"
        >
          <div
            class="click-box"
            :class="[isDisabled(index) && 'disabled']"
            :disabled="isDisabled(index)"
          >
            <div class="item" :style="{'line-height':itemHeight+'px'}">
              {{item.text}}
              <span
                class="iconfont"
                :class="[item.icon,isDisabled(index) && 'disabled']"
              />
            </div>
          </div>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script src="./menu.ts"/>

<style lang="stylus" scoped>
.menu-enter-active {
  animation: zoom-in var(--during);
}

.menu-leave-active {
  animation: zoom-in var(--during) reverse;
}

[data-root] {
  position: fixed;
  background: var(--background);
  z-index: 1000;
  box-shadow: var(--shadow-hover);
  overflow: visible;

  #item-list {
    .item-box {
      border-top: 1px var(--disabled) solid;
      color: var(--info);
      box-sizing: border-box;
      font-size: var(--s);
      cursor: pointer;

      .click-box {
        height: 100%;
        padding: 0 10px;

        &:hover {
          background: var(--primary);
          color: var(--background);
        }

        & * {
          background: transparent;
        }

        &.disabled {
          color: var(--disabled);

          &:hover {
            background: var(--background);
          }
        }
      }
    }
  }
}
</style>