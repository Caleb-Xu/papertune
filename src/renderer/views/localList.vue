<template>
  <div data-root>
    <main>
      <header id="title-box">
        <div id="title">本地音乐</div>
        <div class="iconfont icon-set info-to-normal" @click="toSetLocalFiles" id="setting-btn" />
      </header>
      <section id="info-bar">
        <div id="bar-left-box">
          <div id="total-count">
            共
            <span>{{filtedMusics.length}}</span>
            首歌曲
          </div>
          <div
            id="play-all-btn"
            @click="playAll"
            class="shadow-block flex-center"
            :disabled="!hasMusic"
          >
            播放全部
            <span class="iconfont icon-play btn-icon"></span>
          </div>
        </div>
        <div id="bar-right-box">
          <section id="search-box">
            <input type="text" v-show="showSearch" v-model.trim="filter" id="search-input" placeholder="键入搜索..." />
            <div class="btn-item" id="search-btn">
              <div
                @click="search"
                title="搜索"
                id="search-btn"
                class="iconfont icon-search"
                :disabled="filter"
              />
            </div>
          </section>
          <div class="iconfont icon-refresh info-to-normal" @click="refresh"></div>
        </div>
      </section>
      <section id="local-list">
        <musicTable
          id="list-table"
          @menu="menu"
          @favor="favor"
          @play="play"
          :list="filtedMusics"
          v-if="hasMusic"
          type="local"
        />
        <div id="empty-msg" v-else>当前本地列表为空</div>
      </section>
    </main>
  </div>
</template>

<script src="./localList.ts"/>

<style lang="stylus" scoped>
[data-root] {
  main {
    width: 720px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;

    header#title-box {
      margin-top: 30px;
      display: flex;
      align-items: baseline;

      #title {
        font-size: var(--xl);
        color: var(--important);
        margin-right: 10px;
      }

      #setting-btn {
        font-size: var(--l);
        color: var(--info);
        transition: color var(--during);

        &:hover {
          color: var(--normal);
        }
      }
    }

    #info-bar {
      $bar-height = 40px;
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      height: $bar-height;

      >* {
        align-items: center;
      }

      #bar-left-box {
        display: flex;

        #total-count {
          color: var(--info);
          font-size: var(--m);
          width: 120px;
          line-height: $bar-height;
        }

        #play-all-btn {
          height: 30px;
          color: var(--background);
          font-size: var(--s);
          background-color: var(--primary);
          padding: 0 10px;
          cursor: pointer;
        }
      }

      #bar-right-box {
        display: flex;
        align-items: center;

        >* {
          font-size: var(--l);
          color: var(--info);
          margin-left: 10px;
        }

        #search-box {
          display: flex;

          #search-btn {
            font-size: var(--l);
            color: var(--info);
          }

          input {
            font-size: var(--s);
            color: var(--info);
          }
        }
      }
    }

    #local-list {
      margin: 20px 0;
      flex: 1;
      overflow: auto;

      #empty-msg {
        text-align: center;
        margin-top: 100px;
        color: var(--disabled);
        font-size: var(--l);
      }
    }
  }
}
</style>