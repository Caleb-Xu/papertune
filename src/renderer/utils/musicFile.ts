/**负责处理音乐文件以及其他文件 */

import fs from 'fs';
import config from '@/baseConfig';
import { parseFile, IAudioMetadata } from 'music-metadata';
import { MusicFileInfo, Music, MusicType } from './music';
import Axios from 'axios';

/**解析本地音乐文件的信息
 * 失败的话将文件名置于title返回
 * * 持久化保存时不保存pic，pic只在需要获取时才计算获取，否则会大量占用磁盘与内存
 */
export async function readLocalMusicInfo(src: string): Promise<MusicFileInfo> {
  // new FileReader().readAsDataURL(src)

  // console.info('music path is', src);
  const result: MusicFileInfo = {};

  const msg: IAudioMetadata = await parseFile(src);
  if (msg.common.title) result.title = msg.common.title;
  else result.title = (/[^\\/]*[(mp3)|(wav)]$/.exec(src) as string[])[0];

  if (msg.common.album) result.album = msg.common.album;
  if (msg.common.artist) result.artist = msg.common.artist;
  // console.log('common: ',msg.common);
  return result;
}

/**获取歌词 */
export async function getLyric(music: Music): Promise<string | void> {
  console.log('getLyric', music.lrc);
  if (music.lrc) {
    /**已拥有 */
    if (music.lrc[0] == '[') {
      /**文本类型歌词，直接返回 */
      return music.lrc;
    } else {
      /**链接类型歌词，获取 */
      let result;
      await Axios.get(music.lrc)
        .then(resp => {
          if (resp.data[0] == '[') result = resp.data;
          else console.warn('歌词不符合格式', resp.data);
        })
        .catch(err => {
          console.warn('获取歌词失败', music);
        });
      return result;
    }
  } else {
    if (music.type == MusicType.LOCAL) {
      /**未拥有 */
      /**本地文件无能为力 */
      console.warn('没有歌词', music);
      return;
    } else if (music.type == MusicType.CLOUD) {
      console.log('get cloud lrc', music.title);
      /**已拥有 */
      let result;
      await Axios.get('http://123.57.229.114:3000/lyric?id=' + music.id)
        .then(resp => {
          result = resp.data.lrc.lyric;
        })
        .catch(err => {
          console.warn('找不到歌词', music, err);
        });
      return result;
    }
  }
}

/**获取封面 */

/**本地 */
export async function getLocalMusicPic(src: string): Promise<string | void> {
  if (!src) {
    console.warn('getLocalMusicPic with no src', src);
    return;
  }
  const msg: IAudioMetadata = await parseFile(src);
  if (msg.common.picture) {
    const pic = msg.common.picture[0];
    return `data:${pic.format};base64,${pic.data.toString('base64')}`;
  } else {
    console.warn(src, 'has no pic');
  }
}

/**云端 */
export async function getCloudMusicPic(id: number): Promise<string | void> {
  if (!id) {
    console.warn('getCloudMusicPic with no id', id);
    return;
  }
  const resp = await Axios.get('nec/song/detail?ids=' + id);
  return resp.data.songs[0].al.picUrl || null;
}

/**通过策略模式获取 */
export async function getMusicPic(music: Music): Promise<string | void> {
  if (music.type == MusicType.LOCAL) {
    return await getLocalMusicPic(music.src);
  } else if (music.type == MusicType.CLOUD) {
    return await getCloudMusicPic(music.id);
  }
}

/**遍历读取并返回文件数组
 * @param path 文件夹目录
 *
 */
export function readDir(path: string, checker: RegExp, result: Array<string>) {
  fs.readdir(path, function(err, menu) {
    if (!menu) return;
    menu.forEach(function(ele) {
      fs.stat(path + '/' + ele, function(err, info) {
        if (info?.isDirectory()) {
          // console.log('dir: ' + ele);
          readDir(path + '/' + ele, checker, result);
        } else {
          if (checker.test(ele)) {
            // console.log(ele);
            readLocalMusicInfo(path + '/' + ele);
            result.push(path + '/' + ele);
          }
        }
      });
    });
  });
}

/**判断是不是本地音乐文件 */
export function isLocalMusic(src: string): boolean {
  return /^[a-zA-Z]:[(\\)|(//)].*\.[(mp3)|(wav)]$/.test(src);
}
