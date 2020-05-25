<template>
  <transition name="menu">
    <div data-root :style="setPosition" v-show="showMenu">
      <ul id="item-list">
        <li
          v-for="(item,index) in itemFilter"
          :style="{height:itemHeight+'px'}"
          class="item-box"
          :key="item.key"
          @click.stop="!item.subMenu && select(index)"
          @mouseenter="mouseEnter(index)"
        >
          <div class="click-box">
            <div class="item" :style="{'line-height':itemHeight+'px'}">
              {{item.text}}
              <span class="iconfont btn-icon" />
            </div>
          </div>

          <ul v-if="item.subMenu" v-show="item.subShow" class="sub-item-list">
            <li
              v-for="(subItem,subIndex) in item.subMenu"
              :style="{height:itemHeight+'px'}"
              class="item-box"
              :key="subItem.key"
              @click.stop="select(index,subIndex)"
            >
              <div class="click-box">
                <div class="item" :style="{'line-height':itemHeight+'px'}">
                  {{subItem.text}}
                  <span class="iconfont btn-icon" />
                </div>
              </div>
            </li>
          </ul>
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
    .sub-item-list {
      position: absolute;
      width: 120px;
      right: -120px + 5px;
      z-index: 1001;
      top: 0px;
      max-height: 128px;
      overflow: auto;
      box-shadow: var(--shadow);
    }

    .item-box {
      border-top: 1px var(--disabled) solid;
      color: var(--info);
      box-sizing: border-box;
      font-size: var(--s);
      cursor: pointer;
      position: relative;

      .click-box {
        height: 100%;
        padding: 0 10px;

        .item {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

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