<template>
  <div id="app">
    <topNav class="top-nav" />
    <main>
      <sidebar class="side-bar" />
      <section class="router-view-box">
        <!-- <div id="test">111</div> -->
        <router-view />
        <playList />
      </section>
    </main>
    <player class="player" />
    <myMenu />
    <modals />
    <msg />
    <!-- <div id="test">
      <input type="file" ref="avatar" @change="uploadTest" />
    </div>-->
  </div>
</template>

<script src="./App.ts"/>

<style lang="stylus" scoped>
// .view-enter-active {
// animation: slide-in 0.5s;
// }
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  min-width: 1080px;
  min-height: 720px;
  position: relative;
  overflow: auto;

  .top-nav {
    height: 80px;
  }

  main {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  .side-bar {
    width: 200px;
  }

  .router-view-box {
    flex: 1;
    display: flex;
    z-index: 10;
    position: relative;

    >* {
      /* 填充整个空间 */
      flex: 1;
    }
  }
}

.player {
  height: 100px;
}

#test {
  position: absolute;
  z-index: 10000;
}
</style>
