/**
 * 全局常量
 */
import { join } from 'path';
/* //@ts-ignore
const ICON = join(__static, 'icon/logo.png'); */
/**无法被识别的静态文件目录 */
//@ts-ignore
const _static = __static;
/**默认的应用存储根目录 */
const baseAppUrl = 'D://papertune';

export default {
  /**窗口尺寸 */
  SIZE: {
    WIDTH: 1080,
    HEIGHT: 720,
  },
  /** 应用默认图标*/
  LOGO: join(_static, 'logo/logo.png'),
  /**默认头像 */
  DEFAULT_BOY_AVATAR: join(_static, 'image/default-boy-avatar.jpg'),
  DEFAULT_GRIL_AVATAR: join(_static, 'image/default-gril-avatar.jpg'),
  /**默认音乐封面 */
  DEFAULT_MUSIC_PIC: join(_static,'image/default-music-pic.png'),
  /**默认本地音乐目录，也是下载目录 */
  DEFAULT_LOCAL_MUSIC: join(baseAppUrl,'local-music/') ,
  /**默认本地缓存目录 */
  DEFAULT_CACHE_MUSIC: join(baseAppUrl,'cache/') ,
  /**是否使用单机模式 */
  SINGLE: false,
  /**本地服务器或远程服务器 */
  SERVER_TYPE: 'dev', //'dev | prod',
  SERVER_HOST: {
    dev: 'http://localhost:port/',
    prod: 'http://domain:port/',
  },
};
