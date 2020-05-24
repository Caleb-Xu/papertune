<template>
  <section data-root id="player">
    <div id="disable-block" v-show="!playAble" />
    <audio
      id="main-audio"
      ref="audio"
      @error="playErr"
      :loop="isLoop"
      :muted="muted"
      @ended="go(1)"
    ></audio>
    <main id="main">
      <div id="left-box" v-if="music!=null">
        <div id="music-info" @click.right="menu"  @click="$router.push('musicInfo').catch(err=>{})">
          <img id="music-pic" draggable="false" :src="pic || _config.DEFAULT_MUSIC_PIC" />
          <div id="name-and-artist">
            <div id="music-name" :title="music.title">{{music.title || '未知音乐'}}</div>
            <div id="artist" :title="music.artist">{{music.artist || '未知歌手'}}</div>
          </div>
          <div id="favor-box">
            <div
              id="is-favor"
              class="iconfont"
              :class="[music.isFavor?'icon-favorites-filling':'icon-favorites']"
              @click.stop="favor"
            />
          </div>
        </div>
        <div id="music-time-box">
          <div id="music-time">{{getTimeFormat(currentTime)+'/'+getTimeFormat(duration)}}</div>
        </div>
      </div>
      <div id="center-box">
        <button id="previous-btn" class="control-btn" @click="go(-1)">
          <div id="previous-icon" class="iconfont icon-previous"></div>
        </button>
        <button id="toggle-play-btn" class="control-btn" @click="togglePlay">
          <div
            id="toggle-icon"
            class="iconfont"
            :class="[playList.playing?'icon-stop':'icon-play']"
          />
        </button>
        <button id="next-btn" class="control-btn" @click="go(1)">
          <div id="next-icon" class="iconfont icon-next"></div>
        </button>
        <div id="vol-box">
          <div id="vol-btn" class="control-btn" @click="toggleMute" :class="[muted && 'muted']">
            <div id="vol-icon" class="iconfont icon-remind" />
          </div>
          <div id="vol-bar" ref="vol-bar" @click="setVol" @mousedown="dragVol">
            <div id="vol-bg">
              <div id="vol-track" :style="{width: playList.vol*100 + '%'}">
                <!-- <div id="vol-point" /> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="right-box">
        <div id="play-list-btn-box">
          <div id="play-list-icon" @click="togglePlayList" class="iconfont icon-music-list" />
          <div id="list-length">{{playList.queue.length}}</div>
        </div>
        <div id="play-mode-btn-box">
          <div id="play-mode-btn" @click="togglePlayModeList">{{modeName}}</div>
          <collapse during="0.2">
            <div id="play-mode-list" v-show="showPlayModeList">
              <div
                @click="changePlayMode(index)"
                class="play-mode"
                :class="[index==playList.mode && 'current']"
                v-for="(name,index) in modeNames"
                :key="name"
              >{{name}}</div>
            </div>
          </collapse>
        </div>
      </div>
    </main>
    <div id="progress-bar-box" v-show="playAble" @click="setProgress" @mousedown="dragTime">
      <div id="progress-bar" ref="progress">
        <div id="progress-track" :style="{width: (currentTime / duration)*100 + '%' }"></div>
        <!-- <div id="progress-thumb" :style="{left: (currentTime / duration)*100 + '%' }"></div> -->
      </div>
    </div>
  </section>
</template>

<script src="./player.ts"/>

<style lang="stylus" scoped>
[data-root] {
  position: relative;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-top: var(--disabled) solid 2px;

  #disable-block {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    background-color: var(--disabled);
    filter: saturate(0);
    opacity: 0.4;
    cursor: not-allowed;
    z-index: 100;
  }

  #main {
    height: 60px;
    display: flex;
    justify-content: space-between;
    position: relative;

    #left-box {
      margin-left: 20px;
      display: flex;

      #music-info {
        display: flex;
        transition: all var(--during);
        cursor: pointer;
        width: 260px;
        position: relative;
        align-items: center;

        &:hover {
          box-shadow: var(--shadow);
        }

        #music-pic {
          height: 60px;
          width: 60px;
          background: var(--disabled);
        }

        #name-and-artist {
          margin-left: 20px;
          align-self: stretch;
          overflow: hidden;
          width: 120px;

          >* {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }

          #music-name {
            // line-height: 20px;
            font-size: var(--m);
            color: var(--normal);
            margin-top: 5px;
            margin-bottom: 5px;
          }

          #artist {
            color: var(--info);
            font-size: var(--s);
            line-height: 20px;
          }
        }

        #favor-box {
          width: 40px;
          right: 10px;
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;

          // margin-right: 10px;
          #is-favor {
            font-size: var(--l);
            color: var(--red);
            cursor: pointer;
          }
        }
      }

      #music-time-box {
        margin-left: 10px;
        width: 100px;
        display: flex;
        justify-content: center;
        align-self: center;
        user-select: none;
        font-size: var(--s);
        color: var(--info);
      }
    }

    #center-box {
      position: absolute;
      align-self: center;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: center;
      align-items: center;

      .control-btn {
        border-radius: 50%;
        box-shadow: var(--shadow);
        color: var(--normal);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:hover {
          box-shadow: var(--shadow-hover);
          color: var(--background);
          background: var(--primary);
        }
      }

      #toggle-play-btn {
        height: 60px;
        width: @height;

        #toggle-icon {
          font-size: var(--l);
        }
      }

      #previous-btn, #next-btn {
        margin: 0 20px;
        height: 40px;
        width: @height;

        #previous-icon, #next-icon {
          font-size: var(--m);
        }
      }

      #vol-box {
        position: absolute;
        right: -120px;
        display: flex;
        align-items: center;
        width: 120px;

        #vol-btn {
          height: 20px;
          width: @height;
          margin: 5px;

          &.muted {
            background: var(--disabled);
            color: var(--background);
          }

          #vol-icon {
            font-size: var(--s);
          }
        }

        #vol-bar {
          width: 80px;
          height: 4px;
          border-top: 10px solid transparent;
          border-bottom: @border-top;
          background: transparent;
          display: flex;
          cursor: pointer;

          &:hover {
            #vol-bg {
              #vol-track {
                background: var(--primary);

                #vol-point {
                  background: var(--primary);
                  visibility: visible;
                }
              }
            }
          }

          // position: relative;
          #vol-bg {
            width: 80px;
            background-color: var(--disabled);
            position: relative;

            #vol-track {
              background: var(--info);
              position: absolute;
              height: 4px;

              #vol-point {
                $size = 8px;
                position: absolute;
                top: 0;
                right: -($size / 2) + 2px;
                top: @right;
                height: $size;
                width: $size;
                background: var(--info);
                visibility: hidden;
              }
            }
          }
        }
      }
    }

    #right-box {
      margin-right: 20px;
      display: flex;
      flex-direction: row-reverse;

      #play-list-btn-box {
        width: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        #play-list-icon {
          font-size: var(--l);
          color: var(--info);

          &:hover {
            color: var(--primary);
          }
        }

        #list-length {
          position: absolute;
          right: 5px;
          bottom: 10px;
          font-size: var(--xs);
          color: var(--info);
        }
      }

      #play-mode-btn-box {
        width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        $height = 30px;
        $width = 80px;

        #play-mode-btn {
          height: $height;
          width: $width;
          box-shadow: var(--shadow);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: var(--s);
          color: var(--info);
          position: relative;
          cursor: pointer;

          &:hover {
            color: var(--primary);
            box-shadow: var(--shadow-hover);
          }
        }

        #play-mode-list {
          position: absolute;
          box-shadow: var(--shadow);
          z-index: 101;
          bottom: $height + 20px;

          .play-mode {
            height: $height;
            width: $width;
            line-height: @height;
            text-align: center;
            font-size: var(--s);
            color: var(--info);
            cursor: pointer;

            &.current {
              color: var(--primary);
            }

            &:hover {
              color: var(--background);
              background: var(--primary);
            }
          }
        }
      }
    }
  }

  audio {
    height: 100px;
    width: 200px;
  }

  #progress-bar-box {
    height: 20px;
    position: absolute;
    top: -(@height / 2);
    width: 100%;
    background: transparent;
    display: flex;
    z-index: 100;
    flex-direction: column;
    justify-content: center;

    &:hover {
      cursor: pointer;

      #progress-track {
        box-shadow: 0 0 2px var(--info);
      }

      #progress-thumb {
        display: block;
      }
    }

    #progress-bar {
      $height = 4px;
      display: flex;
      height: $height;
      background: var(--disabled);
      display: flex;

      #progress-track {
        height: $height;
        background: var(--primary);
        width: 200px;
        position: relative;
      }

      #progress-thumb {
        position: absolute;
        height: 10px;
        width: @height;
        top: (@height / 4) + ($height / 2);
        // right: -(@width / 2) + ($height / 2);
        background: var(--primary);
        display: none;
        // visibility: hidden;
      }
    }
  }
}
</style>