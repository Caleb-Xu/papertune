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
        <slot>
          <div id="modal-text">{{text}}</div>
        </slot>
      </main>
      <footer id="modal-footer">
        <div id="checkbox-box" :class="[isChecked && 'checked']" v-if="checkbox">
          <label :for="name+'-checkbox'">{{checkbox}}</label>
          <label :for="name+'-checkbox'" :class="[isChecked && 'checked']" class="my-checkbox" />
          <input type="checkbox" v-model="isChecked" class="checkbox" :id="name+'-checkbox'" />
        </div>
        <div id="btn-group">
          <div id="yes-btn" class="btn" @click="clickBtn('yes')">
            <div id="yes">{{yes}}</div>
            <span class="iconfont" v-if="yesIcon" :class="[yesIcon]" />
          </div>

          <div id="no-btn" class="btn" @click="clickBtn('no')">
            <div id="no">{{no}}</div>
            <span class="iconfont" v-if="noIcon" :class="[noIcon]" />
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
  // align-self: center;
  // left: 50%;
  // transform: translateX(-50%);
  // white-space:nowrap
  z-index: 1000;
  display: flex;
  align-items: stretch;
  flex-direction: column;
  box-shadow: var(--shadow-hover);

  &[data-size="s"]{
    width: 360px;
    height: 200px
  }
  &[data-size="m"]{
    width: 540px;
    height: 300px
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

    #modal-text {
      color: var(--normal);
      font-size: var(--m);
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
        box-shadow: var(--shadow);
        font-size: var(--s);

        >* {
          background: transparent;
          display: block;
          margin: 0 2px;
        }

        &:hover {
          transform: translateY(-5%);
          box-shadow: var(--shadow-hover);
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