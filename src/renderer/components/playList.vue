<template>
  <transition name="playlist">
    <div data-root v-show="show">
      <transition-group name="list" id="list" tag="ul">
        <li
          class="music-box"
          v-for="(music,index) in playList.queue"
          :class="[index==playList.currentIndex && 'active']"
          :key="music.src+music.id"
          @dblclick="to(index)"
        >
          <div class="music-info">
            <div class="music-title">{{music.title}}</div>
            <div class="music-artist">{{music.artist}}</div>
          </div>
          <div class="menu-btn iconfont icon-close" @click="remove(index)" />
        </li>
      </transition-group>
    </div>
  </transition>
</template>

<script src="./playList.ts"/>

<style lang="stylus" scoped>
$width = 250px;

@keyframes enter {
  from {
    right: - $width;
  }

  to {
    right: 0;
  }
}

.playlist-enter-active {
  animation: enter var(--during);
}

.playlist-leave-active {
  animation: enter var(--during) reverse;
}

[data-root] {
  overflow-x: hidden;

  * {
    background: transparent;
  }

  position: absolute;
  right: 0;
  top: 0;
  width: $width;
  height: 100%;
  box-shadow: var(--shadow-hover);
  overflow-y: auto;

  #list {
    margin: 20px 0;
  }

  .music-box {
    height: 40px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all var(--during);

    &:hover {
      background-color: var(--disabled);
    }

    &.active {
      .music-title {
        color: var(--normal) !important;
      }
    }

    .music-info {
      margin: 0 20px;
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;

      >* {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .music-title {
        font-size: var(--s);
        color: var(--info);
        width: 120px;
      }

      .music-artist {
        font-size: var(--s);
        color: var(--info);
        width: 50px;
      }
    }

    .menu-btn {
      width: 30px;
      color: var(--info);
      line-height: 40px;

      &:hover {
        color: var(--normal);
      }
    }
  }
}
</style>