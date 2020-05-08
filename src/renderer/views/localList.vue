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
            <span>{{musics.length}}</span>
            首歌曲
          </div>
          <div id="play-all-btn" class="shadow-block flex-center" :disabled="!hasMusic">
            播放全部
            <span class="iconfont icon-play btn-icon"></span>
          </div>
        </div>
        <div id="bar-right-box">
          <div class="iconfont icon-search info-to-normal" :disabled="!hasMusic"></div>
          <div class="iconfont icon-viewlist info-to-normal" :disabled="!hasMusic"></div>
        </div>
      </section>
      <section id="local-list">
        <musicTable id="list-table" :list="musics" v-if="hasMusic" type="local" />
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
      }
    }

    #local-list {
      margin-top: 20px;
      flex: 1;

      #empty-msg {
        text-align: center;
        margin-top: 100px;
        color: var(--disabled);
        font-size: var(--l);
      }
    }

    #table {
      flex: 1;
    }
  }
}
</style>