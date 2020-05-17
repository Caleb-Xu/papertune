<template>
  <div id="account-info" data-root>
    <!-- <div id="bg-box">
      <img :src="accountView.avatar" alt id="bg" />
    </div>-->
    <div id="bg" />
    <main>
      <header>
        <div id="avatar-box">
          <img id="avatar" :src="pic" draggable="false" />
        </div>
        <div id="name-and-motto">
          <div id="title-and-desc">
            <div id="title">{{musicList.name}}</div>
            <div id="desc">{{musicList.description || '暂无介绍'}}</div>
          </div>
          <div id="btn-and-count">
            <div id="total-count">
              共
              <span>{{length}}</span>
              首歌曲
            </div>
            <div
              id="play-all-btn"
              @click="playAll"
              class="shadow-block flex-center"
              :disabled="length==0"
            >
              播放全部
              <span class="iconfont icon-play btn-icon"></span>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section id="local-list">
          <musicTable
            id="list-table"
            @menu="menu"
            @favor="favor"
            @play="play"
            :list="musicList.list"
            v-if="length>0"
          />
          <div id="empty-msg" v-else>当前列表为空</div>
        </section>
      </main>
    </main>
  </div>
</template>

<script src="./musicList.ts"/>

<style lang="stylus" scoped>
::-webkit-scrollbar {
  width: 0;
}

[data-root] {
  position: relative;
  overflow-y: auto;

  * {
    background: transparent;
  }

  #bg {
    background-image: url('/image/default-music-pic.jpg');
    height: 200px;
    top: 0;
    left: 0;
    width: 100%;
    filter: brightness(0.8);
    position: absolute;
    z-index: 0;
  }

  >main {
    width: 720px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;

    >header {
      position: relative;
      z-index: 10;
      margin-top: 100px;
      display: flex;

      // align-items: center;
      #avatar-box {
        #avatar {
          display: block;
          height: 150px;
          width: 150px;
          box-shadow: var(--shadow);
        }
      }

      #name-and-motto {
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        #title-and-desc {
          #title {
            font-size: var(--xl);
            /* 图片固定，不受换色影响 */
            color: white;
            text-shadow: var(--shadow);
          }

          #desc {
            margin-top: 10px;
            font-size: var(--m);
            /* 图片固定，不受换色影响 */
            color: white;
            text-shadow: var(--shadow);
          }
        }

        #btn-and-count {
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
      }
    }

    main {
      margin: 20px 0 20px;
      flex: 1;

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
}
</style>