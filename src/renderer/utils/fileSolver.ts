/**负责处理音乐文件以及其他文件 */

import fs from 'fs';
import jsmediatags from 'jsmediatags';
import config from '@/baseConfig';

/**读取音乐文件的信息
 * @param src 文件url
 * @param properties 需要的属性，默认为['title', 'artist','album']
 */
export function readMusicInfo(
  src: string,
  properties: Array<string> = ['title', 'artist', 'album', 'picture']
) {
  jsmediatags.read(src, {
    onSuccess: function(tag) {
      console.log(tag);
    },
    onError: function(error) {
      console.log(':(', error.type, error.info);
    }
  });
  // const reader = new jsmediatags.Reader(src);
  // const result = {};
  // reader./* setTagsToRead(properties).*/ read({
  //   onSuccess(info) {
  //     /* properties.forEach(prop => {
  //       if (info.tags[prop]) result[prop] = info.tags[prop];
  //     }); */
  //     const tags = info.tags;
  //     console.log(src);
  //     tags?.foreach((tag, index) => {
  //       console.log(index + ': ' + tag);
  //     });
  //   },
  //   onError(error) {
  //     console.log(':(', error.type, error.info);
  //   },
  // });

  // return result;
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
            readMusicInfo(path + '/' + ele);
            result.push(path + '/' + ele);
          }
        }
      });
    });
  });
}
