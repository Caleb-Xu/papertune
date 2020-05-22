<template>
  <table data-root>
    <thead>
      <tr>
        <th class="title">
          <div>歌曲名</div>
        </th>
        <th class="artist">
          <div>歌手</div>
        </th>
        <th class="album">
          <div>专辑</div>
        </th>
        <th class="type">
          <div>来源</div>
        </th>
      </tr>
    </thead>
    <!-- <transition-group tag="tbody" name="list"> -->
    <tbody>
      <tr
        v-for="music in list"
        :key="music.src+music.id"
        @click="!music.fee && setActive(music)"
        @click.right="!music.fee && $emit('menu',music,$event)"
        @dblclick="music.fee?cannotPlay():$emit('play', music)"
        class="music"
        :class="[music==active && 'active', music.fee && 'fee']"
        :disabled="music.fee"
      >
        <td class="title" :title="music.title">
          <div class="title-box">
            <div class="title-name">{{music.title}}</div>
            <div
              title="喜欢"
              @click="!music.fee && $emit('favor',music)"
              class="iconfont is-favor"
              :class="music.isFavor?'icon-favorites-filling':'icon-favorites'"
            />
          </div>
          <div class="btn-box">
            <div
              title="播放"
              @click="!music.fee && $emit('play', music)"
              class="btn iconfont icon-play"
            />
            <div
              title="菜单"
              @click="!music.fee && $emit('menu',music,$event)"
              class="btn iconfont icon-viewgallery"
            />
          </div>
        </td>
        <td class="artist" :title="music.artist || '未知歌手'">
          <div>{{music.artist || '未知歌手'}}</div>
        </td>
        <td class="album" :title="music.album || '未知专辑'">
          <div>{{music.album || '未知专辑'}}</div>
        </td>
        <td class="type" :title="music.type==0?'本地':'网易云'">
          <div>{{music.type==0?'本地':'网易云'}}</div>
        </td>
      </tr>
    </tbody>
    <!-- </transition-group> -->
  </table>
</template>

<script src="./musicTable.ts" />

<style lang="stylus" scoped>
[data-root] {
  table-layout: fixed;
  overflow-x: hidden;

  & * {
    background: transparent;
    overflow-x: hidden;
  }

  td, th {
    background-color: transparent;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
    vertical-align: center;
    white-space: nowrap;

    >div {
      overflow: hidden;
      margin-right: 10px;
    }

    &.title {
      width: 360px;
      max-width: @width;
    }

    &.artist {
      width: 140px;
      max-width: @width;
      color: var(--info);
    }

    &.album {
      width: 140px;
      max-width: @width;
      color: var(--info);
    }

    &.type {
      width: 80px;
      max-width: @width;
      color: var(--info);
    }
  }

  tr {
    height: 40px;
  }

  thead {
    color: var(--info);
    font-size: var(--s);
    border-bottom: 2px solid var(--primart);
    position: relative;

    th {
      border-bottom: solid 2px var(--primary);
    }
  }

  tbody {
    overflow-y: auto;
    font-size: var(--s);

    tr {
      cursor: pointer;
      transition: all var(--during);

      &.fee {
        background: var(--disabled) !important;
        color: var(--info) !important;
        cursor: not-allowed !important;
      }

      &:hover, &.active {
        background-color: var(--disabled);
      }

      td {
        &.title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;

          .title-box {
            width: 300px;
            display: flex;

            .title-name {
              margin-right: 10px;
              overflow: hidden;
              text-overflow: ellipsis;
              max-width: 260px;
              // flex: 1;
            }

            .is-favor {
              color: var(--red);

              &:hover {
                text-shadow: var(--shadow);
              }
            }
          }

          .btn-box {
            display: flex;
            margin-right: 10px;

            .btn {
              margin-right: 5px;

              &:hover {
                color: var(--primary);
                text-shadow: var(--shadow);
              }
            }
          }
        }
      }
    }
  }
}
</style>