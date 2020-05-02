<template>
  <section data-root id="player">
    <audio id="main-audio" ref="audio" :src="src" :loop="isLoop" preload :muted="muted"></audio>
    <main id="main">
      <div id="left-box">
        <div id="music-info">
          <img id="music-pic" draggable="false" :src="pic" @error="pic = _config.DEFAULT_MUSIC_PIC" />
          <div id="name-and-artist">
            <div id="music-name">{{name}}</div>
            <div id="artist">{{artist}}</div>
          </div>
          <div id="favor-box">
            <div
              id="is-favor"
              class="iconfont"
              :class="[isFavor?'icon-favorites-filling':'icon-favorites']"
              @click="isFavor = !isFavor"
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
          <div id="toggle-icon" class="iconfont" :class="[playing?'icon-stop':'icon-play']" />
        </button>
        <button id="next-btn" class="control-btn" @click="go(-1)">
          <div id="next-icon" class="iconfont icon-next"></div>
        </button>
        <div id="vol-box">
          <div id="vol-btn" class="control-btn" @click="toggleMute" :class="[muted && 'muted']">
            <div id="vol-icon" class="iconfont icon-remind" />
          </div>
          <div id="vol-bar" ref="vol-bar" @click="setVol" @mousedown="dragVol">
            <div id="vol-track" :style="{width: vol*100 + '%'}">
              <div id="vol-point" />
            </div>
          </div>
        </div>
      </div>
      <div id="right-box">
        <div id="play-list-btn-box">
          <div id="play-list-icon" @click="togglePlayList" class="iconfont icon-music-list" />
        </div>
        <div id="play-mode-btn-box">
          <div id="play-mode-btn" @click="togglePlayModeList">{{modeName}}</div>
          <collapse during="0.2">
            <div id="play-mode-list" v-show="showPlayModeList">
              <div
                @click="changePlayMode(index)"
                class="play-mode"
                :class="[index==mode && 'current']"
                v-for="(name,index) in modeNames"
                :key="name"
              >{{name}}</div>
            </div>
          </collapse>
        </div>
      </div>
    </main>
    <div id="progress-bar-box" @click="setProgress" @mousedown="dragProgress">
      <div id="progress-bar">
        <div id="progress-track" :style="{width: (currentTime / duration)*100 + '%' }">
          <div id="progress-point"></div>
        </div>
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
        box-shadow: var(--shadow);

        #music-pic {
          height: 60px;
          width: 60px;
          background: var(--disabled);
        }

        #name-and-artist {
          margin-left: 20px;
          width: 120px;
          overflow: hidden;

          #music-name {
            // line-height: 20px;
            font-size: var(--m);
            color: var(--normal);
            text-overflow: ellipsis;
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
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 10px;

          #is-favor {
            font-size: var(--l);
            color: var(--red);
            cursor: pointer;
          }
        }

        &:hover {
          box-shadow: var(--shadow-hover);
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
          background: var(--disabled);
          display: flex;
          cursor: pointer;

          &:hover {
            #vol-track {
              background: var(--primary);

              #vol-point {
                background: var(--primary);
                visibility: visible;
              }
            }
          }

          #vol-track {
            // width: 100%;
            background: var(--info);
            position: relative;
          }

          #vol-point {
            $size = 8px;
            position: absolute;
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

    #right-box {
      margin-right: 20px;
      display: flex;
      flex-direction: row-reverse;

      #play-list-btn-box {
        width: 40px;
        display: flex;
        justify-content: center;
        align-items: center;

        #play-list-icon {
          font-size: var(--l);
          color: var(--info);

          &:hover {
            color: var(--primary);
          }
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
    flex-direction: column;
    justify-content: center;

    &:hover {
      cursor: pointer;

      #progress-track {
        box-shadow: 0 0 2px var(--info);
      }
    }

    #progress-bar {
      $height = 4px;
      display: flex;
      height: $height;
      background: var(--info);
      display: flex;

      #progress-track {
        height: $height;
        background: var(--primary);
        width: 200px;
        position: relative;

        #progress-point {
          position: absolute;
          height: 10px;
          width: @height;
          top: -(@height / 2) + ($height / 2);
          right: -(@width / 2) + ($height / 2);
          background: var(--primary);
        }
      }
    }
  }
}
</style>