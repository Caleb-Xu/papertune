<template>
  <div id="setting" data-root>
    <main id="page-body">
      <header id="title-box">
        <div id="title">应用设置</div>
      </header>
      <tab class="setting-tab" :activeTab="activeTab" :tabNames="tabNames">
        <template :slot="'tab-'+'路径相关'">
          <div class="setting-title">本地路径</div>
          <ul id="path-list" v-if="localPaths.length>0">
            <li class="path-item" v-for="(path,index) in localPaths" :key="path">
              <div class="path-name">{{path}}</div>
              <div class="path-btns">
                <button @click="editPath(index)" class="edit-btn iconfont icon-attachment" />
                <button @click="removePath(index)" class="delete-btn iconfont icon-close" />
              </div>
            </li>
          </ul>
          <div v-else>
            <div id="no-path">暂未设置本地路径！</div>
          </div>
          <div id="add-btn" @click="addPath">
            <span class="iconfont icon-add"></span>
          </div>
          <!-- <button @click="selectFolder">test</button> -->
        </template>
        <template :slot="'tab-'+'个性外观'">
          <div class="setting-title">主题选择</div>
          <ul id="theme-list">
            <li
              v-for="theme in themes"
              :style="{background: theme.color}"
              :key="theme.key"
              class="theme-box shadow-block"
              @click="setSkin(theme.key)"
            >
              <div class="theme-title">
                <span>{{theme.title}}</span>
                <span class="iconfont icon-selected current" v-show="currentTheme == theme.key" />
              </div>
            </li>
          </ul>
        </template>
      </tab>
    </main>
  </div>
</template>

<script src="./setting.ts" />

<style lang="stylus" scoped>
#page-body {
  width: 720px;
  height: 100%;
  margin: 0 auto;
  overflow-y: auto;

  header#title-box {
    margin-top: 30px;
    display: flex;
    align-items: baseline;

    #title {
      font-size: var(--xl);
      color: var(--important);
      margin-right: 10px;
    }
  }

  .setting-tab {
    margin-top: 40px;

    .setting-title {
      font-size: var(--m);
      color: var(--normal);
      line-height: 1em;
      margin-top: 20px;
    }

    #path-list {
      width: 99%;
      margin: 10px 1px 0;
      border: 1px solid var(--disabled);
      box-sizing: border-box;
      position: relative;
      max-height: 200px;
      overflow: auto;

      .path-item {
        height: 40px;
        display: flex;
        // justify-content: space-between;
        align-items: center;
        padding: 0 20px;

        .path-name {
          color: var(--info);
          font-size: var(--s);
        }

        .path-btns {
          display: flex;
          margin: 0 10px;

          >* {
            margin-left: 5px;
            font-size: var(--m);
            color: var(--info);

            &:hover {
              color: var(--normal);
            }
          }
        }

        &:hover {
          background-color: var(--disabled);

          .path-name {
            color: var(--normal);
          }
        }
      }
    }

    #no-path {
      margin-top: 20px;
      font-size: var(--m);
      color: var(--info);
      text-align: center;
      line-height: 2em;
      border: 1px solid var(--disabled);
      cursor: not-allowed;
    }

    #add-btn {
      position: absolute;
      height: 30px;
      width: @height;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid var(--disabled);

      &:hover {
        background: var(--disabled);
        color: var(--normal);
      }
    }

    #theme-list {
      cursor: pointer;
      display: flex;
      flex-flow: wrap;

      .theme-box {
        width: 100px;
        height: @width;
        margin: 20px;
        position: relative;

        .theme-title {
          position: absolute;
          left: 0;
          bottom: 20px;
          width: 80%;
          background: var(--normal);
          color: var(--background);
          padding: 5px;
          font-size: var(--s);
          opacity: 0.7;

          .current {
            margin-left: 5px;
          }
        }
      }
    }
  }
}
</style>