<template>
  <div data-root>
    <img :src="pic" id="bg-img" draggable="false" />
    <main>
      <section id="music-info-box">
        <div id="music-info-inner-box">
          <img :src="pic" id="music-pic" draggable="false" />
          <div id="music-info">
            <div id="music-title" :title="music.title || '未知歌曲'">{{music.title || '未知歌曲'}}</div>
            <div id="music-artist" :title="music.artist || '未知歌手'">歌手：{{music.artist || '未知歌手'}}</div>
            <div id="music-album" :title="music.album || '未知专辑'">所在专辑：{{music.album || '未知专辑'}}</div>
          </div>
        </div>
      </section>
      <section id="lyric-box">
        <div id="lyric-inner-box">
          <div v-if="lrcs.length>0" ref="box" id="lyric-contents">
            <p
              class="lrc-str"
              ref="lrc"
              :class="[index==current && 'current']"
              v-for="(lrc,index) in lrcs"
              :key="lrc.time"
            >{{lrc.str}}</p>
          </div>
          <div v-else id="no-lyric-box">
            <div id="no-lyric-msg">本歌曲未有歌词，敬请期待</div>
            <div id="set-lryic-link">设置歌词-></div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script src="./musicInfo.ts"/>

<style lang="stylus" scoped>
[data-root] {
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;

  #bg-img {
    position: absolute;
    width: 100%;
    height: auto;
    z-index: 0;
    filter: blur(5px);
    opacity: 0.2;
  }

  main {
    position: relative;
    flex: 1;
    display: flex;
    justify-content: center;
    background: transparent;
    $width = 300px;

    * {
      background: transparent;
    }

    >* {
      width: 40%;
    }

    #music-info-box {
      display: flex;
      justify-content: center;

      #music-info-inner-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: $width;

        #music-pic {
          margin-top: 50px;
          width: $width;
          height: $width;
          overflow: hidden;
          box-shadow: var(--shadow-hover);
          background: var(--background);
        }

        #music-info {
          margin-top: 40px;
          display: flex;
          align-items: center;
          flex-direction: column;

          >* {
            max-width: $width;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          #music-title {
            font-size: var(--l);
            color: var(--normal);
            font-weight: bold;
          }

          #music-artist, #music-album {
            color: var(--info);
            font-size: var(--m);
            margin-top: 10px;
          }
        }
      }
    }

    #lyric-box {
      #lyric-inner-box {
        width: $width;
        height: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        flex-direction: column;

        #lyric-contents {
          overflow-y: auto;
          height: 450px;
          white-space: normal;
          position: relative;

          .lrc-str {
            color: var(--info);
            font-size: var(--m);
            // margin: 10px 0;
            line-height: 30px;

            &.current {
              color: var(--normal);
            }
          }
        }

        #no-lyric-box {
          // margin-top: 200px;
          #no-lyric-msg {
            color: var(--info);
            font-size: var(--l);
          }

          #set-lryic-link {
            margin-top: 10px;
            cursor: pointer;
            color: var(--blue);
            font-size: var(--s);
            text-align: right;
          }
        }
      }
    }
  }
}
</style>