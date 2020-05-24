<template>
  <div id="my-tab" data-root>
    <section id="tab-bar">
      <ul id="tabs">
        <li
          v-for="(name, index) in tabNames"
          :key="name"
          @click="active = index"
          class="tab"
          :class="[active==index &&'active']"
        >
          <span>{{name}}</span>
        </li>
      </ul>
      <div id="line"></div>
    </section>
    <section id="views">
      <section
        v-for="(name, index) in tabNames"
        :key="name"
        class="tab-content"
        v-show="active==index"
      >
        <slot :name="'tab-'+index">{{name}}</slot>
      </section>
    </section>
  </div>
</template>

<script src="./tab.ts"/>

<style lang="stylus" scoped>
#my-tab {
  margin-top: 40px;
  flex: 1;

  * {
    background: transparent;
  }

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
    padding: 10px 20px;

    .tab-content {
      // width: 100%;
      height: 100%;
    }
  }
}
</style>