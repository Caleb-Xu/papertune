import { MusicList } from 'utils/music';

/**本地用户信息
 * 为了安全，没有密码
 * 歌单信息通过用户id获取
 */
export interface Account {
  /**唯一标识符,从服务器获取，用于获取歌单，以及创建用户文件夹 */
  uid: number;
  /**用户名 */
  name: string;
  /**性别，true为男false为女 */
  gender?: number;
  /**头像的url */
  avatar?: string;
  /**邮箱 */
  email?: string;
  /**出生年份 */
  birthYear?: number;
  /**所在地区 */
  location?: string;
  /**个性签名,20个字符以下 */
  motto?: string;
  /**数据同步的时间
   * 用于判断数据是否最新
   * 新用户和LOCAL为0
   */
  updateTime?: number;
}

/**同步到服务器的个人信息，整合了歌单信息 */
export interface NetAccount {
  account: Account;
  password: string;
  musicLists: Array<MusicList>;
  /**从account获取 */
  updateTime: number;
}
