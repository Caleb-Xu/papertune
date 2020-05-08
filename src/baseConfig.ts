/**
 * 全局常量
 */
import { join } from 'path';
/**无法被识别的静态文件目录 */
//@ts-ignore
const _static = __static;
/**默认的应用存储根目录 */
/**prod */
// const baseAppUrl = 'D://papertune';
/**dev */
const baseAppUrl = 'D://~test/';

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
  // DEFAULT_DOWNLOAD_PATH: join(baseAppUrl,'download/') ,
  /**测试数据 */
  DEFAULT_DOWNLOAD_PATH: join(baseAppUrl,'download/') ,
  /**默认本地缓存目录 */
  DEFAULT_CACHE_MUSIC: join(baseAppUrl,'cache/') ,
  /**是否使用单机模式 */
  SINGLE: false,
  /**本地服务器或远程服务器 */
  /**dev */
  SERVER_HOST:'http://localhost:4396/client',
  /**prod */
  // SERVER_HOST:'http://domain:port',
  /**列表最大长度 */
  LIST_MAX_LENGTH: 200
};
