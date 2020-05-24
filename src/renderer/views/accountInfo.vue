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
        <tabs :tabNames="['我的歌单']">
          <template v-slot:tab-0>
            <ul id="music-lists">
              <li class="list" v-for="(list,index) in musicLists" :key="list.lid">
                <div
                  class="list-pic shadow-block"
                  @click.right="showListMenu(list.lid,$event)"
                  @click="toMusicList(list.name)"
                >
                  <img
                    class="pic"
                    :src="pics[index] || _config.DEFAULT_MUSIC_PIC"
                    draggable="false"
                  />
                </div>
                <div class="list-name" v-if="list.lid!=editingList">{{list.name}}</div>
                <input
                  type="text"
                  class="edit-input"
                  ref="edit-input"
                  @blur="cancelEdit"
                  @keydown.enter="editListName(list.lid)"
                  v-else
                  v-model="newListName"
                />
              </li>
              <li class="list">
                <div class="list-pic shadow-block" id="add-btn" @click="toggleAddMusicList">
                  <div id="add-icon" class="iconfont icon-add"></div>
                </div>
                <div class="list-name adding" v-if="adding==false">添加歌单</div>
                <input
                  v-model.trim="newListName"
                  @keydown.enter="addMusicList"
                  @blur="toggleAddMusicList"
                  class="list-name"
                  ref="add-input"
                  v-else
                />
              </li>
            </ul>
          </template>
        </tabs>
      </main>
    </main>
  </div>
</template>

<script src="./accountInfo.ts"/>

<style lang="stylus" scoped>
[data-root] {
  position: relative;
  overflow: auto;

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

      #music-lists {
        width: 100%;
        display: flex;
        align-items: center;
        flex-flow: wrap;

        .list {
          width: 100px;
          margin: 20px 15px;
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

          .edit-input {
            width: 100px;
            color: var(--normal);
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
</style>