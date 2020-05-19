<template>
  <div id="account-info" data-root>
    <!-- <div id="bg-box">
      <img :src="accountView.avatar" alt id="bg" />
    </div>-->
    <div id="bg" />
    <main>
      <header>
        <div id="avatar-box">
          <img id="avatar" :src="accountView.avatar" draggable="false" />
        </div>
        <div id="name-and-motto">
          <div id="account-name">{{accountView.name}}</div>
          <div id="account-motto">{{accountView.motto}}</div>
        </div>
      </header>
      <main>
        <section id="tab-bar">
          <ul id="tabs">
            <li id="lists-tab" @click="activeTab=0" class="tab" :class="[activeTab==0 &&'active']">
              <span>我的歌单</span>
            </li>
            <!-- <li id="info-tab" @click="activeTab=1" class="tab" :class="[activeTab==1 &&'active']">
              <span>个人资料</span>
            </li> -->
          </ul>
          <div id="line"></div>
        </section>
        <section id="views">
          <section id="lists" v-show="activeTab==0">
            <transition-group tag="ul" id="music-lists">
              <li class="list" v-for="(list,index) in musicLists" :key="list.lid">
                <div class="list-pic shadow-block" @click="toMusicList(list.name)">
                  <img
                    class="pic"
                    :src="pics[index]"
                    draggable="false"
                  />
                </div>
                <div class="list-name">{{list.name}}</div>
              </li>
              <li class="list">
                <div class="list-pic shadow-block" id="add-btn" @click="toggleAddMusicList">
                  <div id="add-icon" class="iconfont icon-add"></div>
                </div>
                <div class="list-name adding" v-if="adding==false">添加歌单</div>
                <input
                  v-model.trim="newListName"
                  @keydown.enter="addMusicList"
                  @keydown.esc="toggleAddMusicList"
                  class="list-name"
                  ref="add-input"
                  v-else
                />
              </li>
            </transition-group>
          </section>
          <section id="info" v-show="activeTab==1">info</section>
        </section>
      </main>
    </main>
  </div>
</template>

<script src="./accountInfo.ts"/>

<style lang="stylus" scoped>
[data-root] {
  position: relative;

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
      margin-top: 150px;
      display: flex;
      align-items: center;

      #avatar-box {
        #avatar {
          display: block;
          height: 100px;
          width: 100px;
          border-radius: 50%;
          box-shadow: var(--shadow);
        }
      }

      #name-and-motto {
        margin-left: 10px;

        #account-name {
          font-size: var(--l);
          /* 图片固定，不受换色影响 */
          color: white;
          text-shadow: var(--shadow);
        }

        #account-motto {
          font-size: var(--s);
          color: var(--info);
          margin: 10px 0;
        }
      }
    }

    main {
      margin: 40px 0 20px;
      flex: 1;

      #tab-bar {
        width: 100%;

        #line {
          height: 2px;
          width: 100%;
          background-color: var(--primary);
        }

        #tabs {
          display: flex;

          .tab {
            width: 100px;
            height: 30px;
            box-shadow: var(--shadow);
            display: flex;
            justify-content: center;
            align-self: center;
            cursor: pointer;
            color: var(--info);

            &.active {
              background-color: var(--primary);
              color: var(--background);
            }

            span {
              line-height: 30px;
              font-size: var(--m);
            }
          }
        }
      }

      #views {
        padding: 10px;

        #lists {
          widtoh: 100%;
          height: 100%;
          overflow-y: auto;

          #music-lists {
            width: 100%;
            display: flex;
            align-items: center;

            .list {
              width: 100px;
              margin: 20px 10px;
              box-shaodw: var(--shadow);

              &:hover {
                box-shaodw: var(--shadow-hover);
              }

              .list-pic {
                width: 100px;
                height: @width;
                overflow: hidden;

                .pic {
                  width: 100px;
                  height: auto;
                  cursor: pointer;
                }
              }

              .list-name {
                margin-top: 5px;
                color: var(--normal);
                font-size: var(--s);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: center;
                width: 100px;

                &.adding {
                  color: var(--info);
                }
              }

              #add-btn {
                display: flex;
                justify-content: center;
                align-items: center;

                #add-icon {
                  color: var(--primary);
                  font-size: var(--xl);
                  font-weight: bold;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>