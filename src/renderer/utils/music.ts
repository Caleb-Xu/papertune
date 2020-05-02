export enum MusicType{
  LOCAL,
  CLOUD
}

/**歌曲信息
 * 本地歌曲通过唯一路径获取
 * 网络歌曲通过id获取
 */
export interface Music {
  /**用于适配Mysql的字段,在服务器中生成，在客户端中只读 */
  mid?: number;
  /**配合网易云API使用，本地id为0，-1为error */
  id: number;
  /**url，网易云的url在特定时间内会失效 */
  src: string;
  /**音乐标题 */
  title?: string;
  /**歌手 */
  artist?: string;
  /**专辑 */
  album?: string;
  /**封面，计算得出 */
  pic?: string;
  /**歌词，lrc格式的文本 | 路径，
   * 云音乐默认为文本，可以保存为文件
   * 根据字符串特征判断 
   */
  lrc?: string;
  /**来源，LOCAL or CLOUD */
  type: MusicType;
  /**时长 */
  duration: number;
  /**是否添加到【我喜欢】 */
  isFavor: boolean;
}

/**歌单 */
export interface MusicList {
  /**主键 */
  lid: string;
  /**歌曲列表 */
  list: Array<Music>;
  /**歌单名 */
  name: string;
  /**描述 */
  description?: string;
  /**封面 */
  pic?: string;
}

/**播放列表 */
export interface PlayList {
  /**播放队列 */
  queue: Array<Music>;
  /**播放模式 */
  mode: PlayMode;
  /**当前音乐 */
  current: Music;
  /**当前音乐所处位置 */
  currentIndex: number;
  /**是否正在播放 */
  playing: boolean;
}

/**历史记录 */
export interface PlayHistory {
  /**播放队列 */
  queue: Array<Music>;
  /**最大记录数 */
  max: number;
}

/**播放模式 */
export enum PlayMode {
  /**顺序播放 */
  ORDER,
  /**单曲循环 */
  LOOP,
  /**随机播放 */
  RANDOM,
}

export const ModeNames: Array<string> = [];
ModeNames[PlayMode.ORDER] = '顺序播放';
ModeNames[PlayMode.LOOP] = '单曲循环';
ModeNames[PlayMode.RANDOM] = '随机播放';


/**歌曲是否在列表中 */
export function hasMusic(music: Music, list: Array<Music>): boolean {
  /**云音乐根据id判断 */
  if(music.type == MusicType.CLOUD){
    return list.some(item=>{
      return item.id == music.id;
    })
  } 
  /**本地音乐根据路径判断 */
  else if(music.type == MusicType.LOCAL){
    return list.some(item=>{
      return item.src == music.src;
    })
  }
  console.warn('other type?',music.type);
  return false;
}