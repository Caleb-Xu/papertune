<template>
  <nav data-root>
    <ul id="left-button-group">
      <li id="logo-box">
        <div id="logo" title="Papertune" data-brand="tune" @click="back2Home">Paper</div>
      </li>
      <li class="btn-item">
        <div
          @click="go(-1)"
          title="后退"
          class="top-btn info-to-normal iconfont icon-back"
          :disabled="!canGo(-1)"
        />
      </li>
      <li class="btn-item">
        <div
          @click="go(1)"
          title="前进"
          class="top-btn info-to-normal iconfont icon-more"
          :disabled="!canGo(1)"
        />
      </li>
    </ul>

    <section id="search-box" v-if="!_config.SINGLE">
      <input
        type="text"
        @keydown.enter="search"
        v-model.trim="keyword"
        id="search-input"
        placeholder="键入搜索..."
      />
      <div class="btn-item" id="search-btn">
        <div
          @click="search"
          title="搜索"
          class="top-btn info-to-normal iconfont icon-search"
          :class="[keyword?'abled':'disabled']"
          :disabled="keyword"
        />
      </div>
    </section>
    <ul id="right-button-group">
      <li class="btn-item"></li>
      <li class="btn-item">
        <!-- <div
          @click.stop="showDownloadTab"
          data-type="downloadTab"
          title="下载列表"
          class="top-btn info-to-normal iconfont icon-icondownload"
        />-->
      </li>
      <li class="btn-item"></li>
      <li class="btn-item">
        <div
          @click.stop="showTopMenu"
          data-type="topMenu"
          title="菜单"
          class="top-btn info-to-normal iconfont icon-category"
        />
      </li>
      <li class="btn-item">
        <div
          @click="minimizeBtn"
          title="最小化"
          style="font-size:32px;"
          class="top-btn info-to-normal iconfont icon-moreunfold"
        />
      </li>
      <li class="btn-item">
        <div @click="close()" title="退出窗口" class="top-btn info-to-normal iconfont icon-close" />
      </li>
    </ul>
  </nav>
</template>

<script src="./topNav.ts" />

<style lang="stylus" scoped>
[data-root] {
  position: relative;
  z-index: 1000;
  border-bottom: 1px solid var(--disabled);
  display: flex;
  justify-content: space-between;
  -webkit-app-region: drag;

  #left-button-group {
    display: flex;

    #logo-box {
      width: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      -webkit-app-region: no-drag;
      user-select: none;
      margin-right: 10px;

      #logo {
        font-size: var(--xl);
        font-weight: bold;
        color: var(--info);
        letter-spacing: -2px;

        &::after {
          content: attr(data-brand);
          color: var(--primary);
        }
      }
    }
  }

  .btn-item {
    height: 100%;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;

    .top-btn {
      font-size: var(--l);
      -webkit-app-region: no-drag;
      // transition: all var(--during);
      // color: var(--info);
    }
  }

  #search-box {
    position: absolute;
    height: 100%;
    // width: 240px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;

    #search-input {
      font-size: var(--m);
      -webkit-app-region: no-drag;
      color: var(--normal);
      width: 200px;
      border-bottom: 2px solid transparent;
      padding: 5px;
      box-sizing: border-box;

      &:focus {
        border-bottom: 2px solid var(--info);
      }

      &::placeholder {
        color: var(--info);
      }
    }

    #search-btn {
      .abled {
        color: var(--important);
      }
    }
  }

  #right-button-group {
    display: flex;
    margin-right: 10px;
  }
}
</style>