# Papertune

> 一个基于Electron与Vuejs开发的简易音乐播放器，目前暂时只有win版与web版。由于在浏览器上无法使用Electron与Nodejs模块，因此部分功能会有所缺失。该程序虽然结构较为简单，但从前期设计到代码实现，均在没有使用UI框架的情况下独立完成。



### 地址

- 安装包：https://pan.baidu.com/s/1zXq68GeLVwOAvPKPwAEavQ  提取码：m12d 
- github：https://github.com/Caleb-Xu/papertune
- web预览版（部分功能缺失）：http://123.57.229.114:9094



### 基本功能

- 读取本地音乐文件与网易云音乐并播放
- 歌词显示并滚动（仅网易云音乐）
- 封面，歌手，专辑信息的显示
- 歌单的管理
- 其他的小功能（比如换色）



### 技术栈

- Electron  https://github.com/electron
- Vuejs  https://github.com/vuejs/vue
- Typescript https://github.com/microsoft/TypeScript
- Stylus https://github.com/stylus/stylus
- Axios https://github.com/axios/axios



### 依赖

- ffmetadata https://github.com/parshap/node-ffmetadata --用于解析本地音乐文件元数据
- NeteaseCloudMusicApi https://github.com/Binaryify/NeteaseCloudMusicApi --网易云API



### 说明

- 这个项目是用自己的毕业设计修改的本地版本——因为毕设用了spring做了服务器端用于答辩，实际上不太实用。
- 网易云的api需要单独部署，我的阿里云要到期了，如果要拿去跑的话建议改成自己的服务器地址。
- 本地持久化保存使用的是IndexedDB。
- 轮子可能造得不太好，若有问题欢迎指出。



### 效果图

- 首页/本地音乐
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200525133810695.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2JhaWR1XzM4MzM1NTc4,size_16,color_FFFFFF,t_70)

- 歌曲详情
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200525133810925.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2JhaWR1XzM4MzM1NTc4,size_16,color_FFFFFF,t_70)

- 歌单详情
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200525133810821.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2JhaWR1XzM4MzM1NTc4,size_16,color_FFFFFF,t_70)

- 个人页
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200528233537647.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2JhaWR1XzM4MzM1NTc4,size_16,color_FFFFFF,t_70#pic_center)

- 歌曲搜素页
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200525133810697.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2JhaWR1XzM4MzM1NTc4,size_16,color_FFFFFF,t_70)

- 设置页
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200525133810492.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2JhaWR1XzM4MzM1NTc4,size_16,color_FFFFFF,t_70)
- 网页版
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200528232759715.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2JhaWR1XzM4MzM1NTc4,size_16,color_FFFFFF,t_70#pic_center)




### 已知缺陷

- 第一次打开无法显示托盘图标
- 页面加载缓慢
- 某些情况下播放歌曲会产生闪烁
- 生硬的信息提示
- 其他未知bug