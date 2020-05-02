<template>
  <div id="app" @click="hideMenu">
    <topNav class="top-nav" />
    <main>
      <sidebar class="side-bar" />
      <section class="router-view-box">
        <!-- <div id="test">111</div> -->
        <router-view />
      </section>
    </main>
    <player class="player" v-bind="playerOption" />
    <myMenu
      v-show="showMenu"
      :xy="menuOption.xy"
      @select="menuSelect"
      :menuItems="menuOption.menuItems"
    />
    <modals/>
  </div>
</template>

<script src="./App.ts"/>

<style lang="stylus" scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  .top-nav {
    height: 80px;
  }

  main {
    flex: 1;
    display: flex;
    overflow: hidden;

    .side-bar {
      width: 200px;
    }

    .router-view-box {
      flex: 1;
    }
  }

  .player {
    height: 100px;
  }
}
</style>
