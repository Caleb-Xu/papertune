# Papertune
> 基于Electron与Vuejs开发的简易Windows本地播放器



### 下载地址

链接：https://pan.baidu.com/s/1zXq68GeLVwOAvPKPwAEavQ 
提取码：m12d 



### 基本功能
- 读取本地音乐文件并播放
- 获取网络音乐并播放
- 歌词显示并滚动（仅网络音乐）
- 封面，歌手，专辑信息的显示
- 歌单的管理
- 其他的小功能（比如换色）



### 技术栈
- Electron  https://github.com/electron
- Vuejs  https://github.com/vuejs/vue
- Typescript https://github.com/microsoft/TypeScript
- Stylus https://github.com/stylus/stylus
- Axios https://github.com/axios/axios



### 其他技术

- ffmetadata https://github.com/parshap/node-ffmetadata --用于解析本地音乐文件元数据
- NeteaseCloudMusicApi https://github.com/Binaryify/NeteaseCloudMusicApi --网易云API



### 说明

- 这个项目是用自己的毕业设计修改的本地版本——因为毕设用了spring做了服务器端用于应付答辩，并不实用。
- 网易云的api需要单独部署，我的阿里云要到期了，如果要拿去跑的话建议改成自己的服务器地址。
- 本地持久化保存使用的是IndexedDB。
- 这是我第一次完整地造一个轮子，自己画的UI自己实现——有一说一不太好看。程序的变量命名与代码逻辑可能会有一点乱，也留有一点之前用了spring的代码痕迹，以后有时间再把代码整理整理。



### 效果图

- 首页/本地音乐

![首页](.\readme\首页.png)

- 歌曲详情

  ![歌曲详情](.\readme\歌曲详情.png)

- 歌单详情

  ![歌单详情](.\readme\歌单详情.png)

- 个人页

  ![个人页](.\readme\个人页.png)

- 歌曲搜素页

  ![搜索歌曲](.\readme\搜索歌曲.png)

- 设置页

  ![设置页](.\readme\设置页.png)



### 已知缺陷

- 第一次打开无法显示托盘图标
- 页面加载缓慢
- 某些情况下播放歌曲会产生闪烁
- 生硬的信息提示
- 其他未知bug