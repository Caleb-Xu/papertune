<template>
  <table data-root>
    <thead>
      <tr>
        <th>歌曲名</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>来源</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="music in list" :key="music.src">
        <td>{{music.title}}</td>
        <td>{{music.artist}}</td>
        <td>{{music.album}}</td>
        <td>{{music.type==0?'本地':'网易云'}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script src="./musicTable.ts" />

<style lang="stylus" scoped>
[data-root] {
  display: flex;
  flex-direction: column;
  height: 100%;

  & * {
    background-color: transparent;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }

  thead {
    color: var(--info);
    font-size: var(--s);
  }

  tbody {
    overflow-y: auto;
    flex: 1;
  }
}
</style>