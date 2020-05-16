<template>
  <transition name="modal">
    <div data-root :data-size="size">
      <header id="modal-header" @mousedown="drag">
        <div id="modal-title">{{title}}</div>
        <div id="close-box">
          <div
            class="iconfont icon-close"
            title="取消"
            @click.stop="$emit('close',name)"
            id="close-btn"
          />
        </div>
      </header>
      <main id="modal-body">
        <slot id="slot">
          <div id="modal-text">{{text}}</div>
        </slot>
      </main>
      <footer id="modal-footer" v-show="checkbox || yes || no">
        <div id="checkbox-box" :class="[isChecked && 'checked']">
          <label :for="name+'-checkbox'" v-show="checkbox">{{checkbox}}</label>
          <label
            :for="name+'-checkbox'"
            :class="[isChecked && 'checked']"
            class="my-checkbox"
            v-show="checkbox"
          />
          <input
            type="checkbox"
            v-model="isChecked"
            class="checkbox"
            :id="name+'-checkbox'"
            v-show="checkbox"
          />
        </div>
        <div id="btn-group">
          <div id="yes-btn" v-show="yes" class="btn shadow-block" @click="select('yes')">
            <div id="yes">{{yes}}</div>
            <span class="iconfont btn-icon" v-if="yesIcon" :class="[yesIcon]" />
          </div>

          <div id="no-btn" v-show="no" class="btn shadow-block" @click="select('no')">
            <div id="no">{{no}}</div>
            <span class="iconfont btn-icon" v-if="noIcon" :class="[noIcon]" />
          </div>
        </div>
      </footer>
    </div>
  </transition>
</template>

<script src="./modal.ts"/>

<style lang="stylus" scoped>
.normal {
  background: var(--border);
}

.modal-enter-active {
  animation: zoom-in var(--during);
}

.modal-leave-active {
  animation: zoom-in var(--during) reverse;
}

[data-root] {
  --theme: var(--primary);
  position: fixed;
  top: 200px;
  z-index: 1000;
  display: flex;
  align-items: stretch;
  flex-direction: column;
  box-shadow: var(--shadow-hover);

  &[data-size='s'] {
    width: 360px;
    height: 240px;
  }

  &[data-size='m'] {
    width: 540px;
    height: 360px;
  }

  #modal-header {
    position: relative;
    height: 40px;
    box-shadow: var(--shadow);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--theme);

    #modal-title {
      user-select: none;
      color: var(--background);
      font-size: var(--s);
      background: transparent;
      padding-left: 10px;
    }

    #close-box {
      width: 40px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;

      #close-btn {
        color: var(--background);
        font-size: var(--l);
        transition: all var(--during);
        position: relative;

        &:hover {
          transform: scale(1.2);
        }
      }
    }
  }

  #modal-body {
    flex: 1;
    padding: 20px;
    overflow-y: auto;

    #slot {
      overflow-y: auto;

      #modal-text {
        color: var(--normal);
        font-size: var(--m);
      }
    }
  }

  #modal-footer {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;

    #checkbox-box {
      display: flex;
      align-items: center;
      color: var(--info);
      font-size: var(--s);

      >* {
        cursor: pointer;
      }

      &.checked, &:hover {
        color: var(--theme);

        .my-checkbox {
          border-color: var(--theme);
        }
      }

      label {
        margin-right: 5px;
        display: block;
      }

      input[type=checkbox] {
        // display: block;
        display: none;
      }

      .my-checkbox {
        height: var(--s);
        width: @height;
        box-sizing: border-box;
        border: var(--info) solid 2px;
        position: relative;

        &.checked::after {
          position: absolute;
          left: -20%;
          top: -50%;
          transform: rotate(-45deg);
          content: '';
          width: 160%;
          height: 80%;
          background: transparent;
          border-bottom: 2px solid var(--info);
          border-left: 2px solid var(--info);
        }
      }
    }

    #btn-group {
      display: flex;
      justify-content: flex-end;

      .btn {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 10px;
        padding: 8px;
        cursor: pointer;
        font-size: var(--s);

        >* {
          background: transparent;
          display: block;
          margin: 0 2px;
        }

        &#yes-btn {
          background: var(--theme);
          color: var(--background);
        }

        &#no-btn {
          color: var(--theme);
          border: 1px solid var(--theme);
        }
      }
    }
  }
}
</style>