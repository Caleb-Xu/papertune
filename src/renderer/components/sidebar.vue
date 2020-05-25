<template>
  <aside id="root">
    <section id="account-box" v-if="!_config.SINGLE && isOnline">
      <!-- <div v-if="netActive"> -->
      <div v-if="isLogin || !netActive" id="account-info">
        <!-- <img id="user-avatar" draggable="false" :src="userInfo.avatar" /> -->
        <div id="user-avatar" :style="avatarStyle" />
        <div id="name-and-link">
          <div id="user-name" :title="userInfo.name">{{userInfo.name}}</div>
          <a id="info-link" @click="toPage('account')">
            个人主页
            <span class="iconfont icon-more" />
          </a>
        </div>
      </div>
      <div v-else id="login-or-register">
        <div id="login-link" @click="toPage('login')">未登录，请登录...</div>
        <a id="reg-link" @click="toPage('reg')">
          注册账号
          <span class="iconfont icon-more" />
        </a>
      </div>

      <!-- <div v-else @click="toPage('account')">本地</div> -->
    </section>

    <main id="music-list-section">
      <section id="my-music" class="music-list-box">
        <header>
          <div class="title">我的音乐</div>
        </header>
        <ul class="music-list-list">
          <li class="music-list-item" :index="LIST_INDEX.LOCAL">
            <div
              class="music-list-title"
              :class="[activeList== LIST_INDEX.LOCAL && 'active']"
              @click="openLocalMusic"
            >本地音乐</div>
          </li>
        </ul>
      </section>

      <div id="sidebar-block"></div>

      <section id="music-list-list" class="music-list-box">
        <header>
          <div class="title">我的歌单</div>
          <div
            id="add-music-list"
            @click="toggleAddingMusicList"
            v-show="!adding"
            title="添加歌单"
            class="iconfont icon-add"
          ></div>
        </header>
        <ul class="music-list-list">
          <li
            class="music-list-item"
            @click.right.stop="showListMenu(list.lid,$event)"
            :key="list.lid"
            v-for="list in musicLists"
          >
            <div
              class="music-list-title"
              :class="[activeList== list.lid && 'active']"
              @click="openMusicList(list.name)"
            >{{list.name}}</div>
            <div
              class="iconfont icon-category music-list-menu-btn"
              :data-index="list.lid"
              @click.stop="showListMenu(list.lid,$event)"
            />
          </li>
          <li class="music-list-item" id="adding-item" v-show="adding || editing">
            <input
              id="new-list-input"
              type="text"
              ref="add-input"
              v-model="newListName"
              @keydown.enter="submit"
              @blur="cancel"
              placeholder="输入歌单名"
            />
            <div class="iconfont icon-close music-list-menu-btn" @click="toggleAddingMusicList"></div>
          </li>
        </ul>
        <!-- <div v-else id="no-list">
          <div id="no-list-message">点击右上方添加歌单</div>
        </div>-->
      </section>
    </main>
  </aside>
</template>

<script src="./sidebar.ts"/>

<style lang="stylus" scoped>
#root {
  position: relative;
  z-index: 90;
  box-shadow: var(--shadow-hover);
  display: flex;
  flex-direction: column;
}

$padding = 20px;

#account-box {
  // width: 100%;
  height: 80px;
  box-shadow: var(--shadow);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  flex: none;

  >* {
    height: 60px;
    flex: 1;
    padding-left: $padding;
    padding-right: @padding-left;
  }

  #login-or-register {
    display: flex;
    flex-direction: column;
    justify-content: center;

    #login-link {
      margin-bottom: 5px;
      font-size: var(--m);
      color: var(--info);
      cursor: pointer;

      &:hover {
        color: var(--primary);
      }
    }

    #reg-link {
      color: var(--link);
      font-size: var(--s);
      cursor: pointer;
    }
  }

  #account-info {
    display: flex;

    #user-avatar {
      height: 60px;
      width: @height;
      overflow: hidden;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      box-shadow: var(--shadow);
    }

    #name-and-link {
      flex: 1;
      padding-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      #user-name {
        font-size: var(--m);
        color: var(--normal);
        white-space nowrap
        overflow hidden
        max-width 90px
        margin-bottom: 5px;
      }

      #info-link {
        font-size: var(--s);
        color: var(--link);
        cursor: pointer;
      }
    }
  }
}

#music-list-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;

  #sidebar-block {
    min-height: 40px;
    background-color: transparent;
  }

  #music-list-list {
    // flex: 1;
    overflow: hidden;

    #add-music-list {
      position: absolute;
      right: $padding;
      top: 0;
      line-height: 30px;
      background-color: transparent;
      color: var(--background);
    }

    .music-list-list {
      overflow: auto;
    }

    #adding-item, #editing-item {
      position: relative;

      input#new-list-input {
        color: var(--info);
      }
    }
  }

  #no-list {
    height: 30px;
    padding: 0 $padding;

    #no-list-message {
      line-height: 30px;
      color: var(--info);
      font-size: var(--s);
    }
  }

  .music-list-box {
    box-shadow: var(--shadow);
    position: relative;
    user-select: none;

    header {
      height: 30px;
      background-color: var(--border);
      margin-bottom: 10px;

      .title {
        background-color: transparent;
        font-size: var(--s);
        color: var(--background);
        text-indent: $padding;
        line-height: @height;
      }
    }

    .music-list-list {
      .music-list-item {
        height: 30px;
        padding: 0 $padding;
        position: relative;

        >* {
          background-color: transparent;
          cursor: pointer;
          line-height: @height;
        }

        input {
          cursor: auto;
        }

        .active {
          color: var(--primary) !important;
        }

        .music-list-title {
          font-size: var(--s);
          color: var(--normal);
          overflow: hidden;
          white-space: nowrap;
          width: 120px;
        }

        .music-list-menu-btn {
          position: absolute;
          right: $padding;
          top: 0;
        }
      }
    }
  }
}
</style>