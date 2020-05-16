<template>
  <div data-root id="search-info">
    <main>
      <header id="title-box">
        <div id="title">"{{keyword}}"的搜索结果</div>
        <div id="sub-title">结果来自网易云音乐</div>
      </header>
      <section id="info-bar">
        <div id="bar-left-box">
          <div id="total-count">
            共
            <span>{{total}}</span>
            首歌曲
          </div>
          <div id="current-page">{{currentPage}} / {{pageCount}} 页</div>
        </div>
        <div id="bar-right-box">
          <div @click="turnPage(-1)" class="page-btn iconfont icon-back info-to-normal" />
          <div @click="turnPage(1)" class="page-btn iconfont icon-more info-to-normal" />
        </div>
      </section>
      <section id="search-list">
        <musicTable
          id="list-table"
          @menu="menu"
          @favor="favor"
          @play="play"
          :list="musics"
          v-if="musics.length>0"
          type="local"
        />
        <div id="empty-msg" v-else>当前本地列表为空</div>
      </section>
    </main>
  </div>
</template>

<script src="./searchInfo.ts"/>

<style lang="stylus" scoped>
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

    #sub-title {
      font-size: var(--m);
      color: var(--info);
    }
  }

  #info-bar {
    padding-top: 20px;
    // height: 60px;
    display: flex;
    // align-items: center;
    justify-content: space-between;
    color: var(--info);

    #bar-left-box {
      display: flex;
      font-size: var(--m);

      // align-items: center;
      #total-count {
        margin-right: 10px;
      }
    }

    #bar-right-box {
      display: flex;

      .page-btn {
        font-size: var(--l);
      }
    }
  }

  #search-list {
    flex: 1;
    margin: 20px 0;
    overflow: auto;
  }
}
</style>