<template>
  <div id="account-info" data-root>
    <!-- <div id="bg-box">
      <img :src="accountView.avatar" alt id="bg" />
    </div>-->
    <div id="bg" :style="bgStyle" />
    <main>
      <header>
        <div id="avatar-box">
          <!-- <img id="avatar" @click="setAvatar" :src="accountView.avatar" draggable="false" /> -->
          <div id="avatar" @click="setAvatar" :style="avatarStyle" />
        </div>
        <div id="name-and-motto">
          <input
            class="account-name"
            type="text"
            ref="name-input"
            @keydown.enter="editedName"
            @blur="cancelEditName"
            v-model="newName"
            v-if="editingName"
          />
          <div
            :title="accountView.name"
            class="account-name"
            @click="editName"
            v-else
          >{{accountView.name}}</div>
          <input
            class="account-motto"
            ref="desc-input"
            @keydown.enter="editedDesc"
            @blur="cancelEditDesc"
            type="text"
            v-model="newDesc"
            v-if="editingDesc"
          />
          <div
            :title="accountView.motto"
            class="account-motto"
            @click="editDesc"
            v-else
          >{{accountView.motto}}</div>
        </div>
      </header>
      <main>
        <tabs :tabNames="['我的歌单']">
          <template :slot="'tab-'+'我的歌单'">
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
    height: 200px;
    top: 0;
    left: 0;
    width: 100%;
    filter: brightness(0.8) blur(1px);
    position: absolute;
    background-size: cover;
    background-position: center;
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
          background-size: cover;
          background-position: center;
          cursor: pointer;
        }
      }

      #name-and-motto {
        margin-left: 10px;

        .account-name {
          font-size: var(--l);
          /* 图片固定，不受换色影响 */
          color: white;
          text-shadow: var(--shadow);
          max-width: 300px;
          overflow: hidden;
          white-space: nowrap;
          cursor: pointer;
        }

        .account-motto {
          cursor: pointer;
          font-size: var(--s);
          color: var(--info);
          margin: 10px 0;
          max-width: 360px;
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