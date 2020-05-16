# 获取具体的云音乐的逻辑

- 获取 url
  - /song/url
  - 参数
    - id number
  - 返回 url
    - **url 会在一定时间之后过期**
- 搜索音乐
  - /search
  - 参数
    - keyword string
    - type 默认为 1
      - 1 单曲
      - 10 专辑
      - 100 歌手
      - 1000 歌单
      - ...
      - 1006 歌词
      - 1018 综合
  - 返回 对象
    - album 专辑对象
      - id
      - ...
      - picId 用于获取专辑图片
      - name 专辑名
      - publishTime 发布时间 时间戳
    - id **用于获取 url**
    - name 歌曲名
    - duration 时长
    - artist 歌手数组
      - id
      - name
      - img1v1Url 歌手头像路径
- 获取歌词
  - /lyric
  - 参数
    - id
  - 返回 对象
    - code 状态码
    - lrc 歌词
      - version
      - lyric 歌词内容 字符串
    - ...

# 启动逻辑

- 判断是否联网
  - 根据 Navigator 和 SINGLE
- 初始化数据
  - localStorage
    - SINGLE 是否为单机模式
      - 用来修改 config.SINGLE
      - 如果为空则使用 baseconfig 的默认选项
    - UID 上一次使用的用户 id
      - 如果是 SINGLE 或者上次没有登录，使用 LOCAL 账号，即本地数据
      - 账号用于在 indexedDB 与服务器拿到对应的歌单
    - 如果不是 LOCAL 且 Online，向服务器发送 UID 和 SAVE_TIME
      - 如果找不到 UID，报错
      - 如果 SAVE_TIME 与本地不一致，从服务器获取个人信息与歌单
    - THEME 应用主题，默认为 green
      - 可选 red,yellow,blue,dark(beta),十六进制颜色码
    - DOWNLOAD_PATH 下载路径 string
      - 本地路径的一部分，下载音乐的文件夹
      - 其下有/music 与/lyric 两个子文件夹，分别存放歌曲与歌词
    - LOCAL_PATHS 本地路径 string[]
      - 在拿到之后与下载路径中的歌曲路径合并显示在本地音乐中
    - NOTICE 通知 number 时间戳，表示阅读时间
      - _异步操作_
      - 在联网的情况下向服务器请求最新通知的时间，如果小于NOTICE，跳过
      - 如果时间大于NOTICE，获取通知内容并弹窗显示
  - indexedDB
    - ACCOUNT 用户个人信息
      - 键 uid
      - 值 Account 对象
      - 有一个固定键值对 LOCAL: {localAccount}
    - MUSIC_LIST 歌单信息
      - _异步操作_
      - 键 uid
      - 值 MusicList[]
      - 有一个固定键 favor
        - 表示【我喜欢】 包括 LOCAL 在内的每个用户都有
    - PLAY_LIST 播放列表 PlayList 对象的键值对一一对应

# 注册逻辑
- 创建成功之后在服务器添加一条用户数据，其中musicListTable为空
  - 发送的同时携带一个时间戳0表示新数据

# 登录逻辑
- 登录成功之后在服务器建立一个本次会话使用的token并返回，用于接下来的http传输
- 获取到登录信息，取出其中的时间戳与服务器上的进行对比
  - 如果服务器上的数值更大，则向服务器获取最新数据
  - 以后可以添加手动push和pull的功能
- 将UID设置在localStorage上

# 注销逻辑
- 生成一个最新的时间戳，对个人信息进行更新，并将个人信息与歌单发送给服务器
- 服务器保存时间戳，并更新数据
- 将个人信息与歌单存放到indexedDB
- 本地UID改为LOCAL
  - 获取LOCAL的数据更新到页面上

# 退出逻辑
- 如果在登录状态
  - 中断退出程序，客户端隐藏在托盘
  - 生成一个最新的时间戳，对个人信息进行更新，并将个人信息与歌单发送给服务器
  - 服务器保存时间戳，并更新数据
  - 将个人信息与歌单存放到indexedDB
  - 操作执行成功之后再手动触发退出程序，客户端从托盘退出


# 关于歌曲
- 歌曲分为本地歌曲与网络歌曲
  - 本地歌曲
    - 通过路径识别
  - 网络歌曲
    - 通过id识别
- 使用一个统一的mid作为主键
  - 用于匹配mysql，在本地没有实际意义

# 关于单机模式
- 优先级最高的模式，直接确定是否联网以及账号是否在线

# 数据使用优先级
vuex -> _config -> localStorage -> indexedDB

# 关于数据同步
- 播放列表不与云端同步，且只在程序启动与关闭时才读取与写入
- 用户信息与用户歌单会在每一次改动时进行同步

# 搜索本地音乐文件逻辑
- 直接使用插件解析
- 累了

# 关于图片保存
- mysql使用varchar保存url
- 本地优先使用远程路径，否则使用本地cache，再否则使用默认图片
- 本地cache按照不同的用户，单独设置文件夹，在文件夹内寻找

# 关于账号
- updatetime与password一起放在netAccount上