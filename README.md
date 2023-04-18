# ReactWebNative8Koa

## Windows 所需安装的工具
Python 2.7；.Net Framework 2 或 3；Visual Studio 2005 或更高。

##  配置数据库
### 内存缓存数据库 redis

按照 [redis 官网相关页面](http://www.redis.cn/download.html) 里的说明下载、安装、运行。

### 持久化数据库 mysql

安装运行之。

使用命令行或图形界面软件打开 mysql ，在里面建立数据库名为 ReactWebNative8Koa 。

## 配置后端

### 配置文件
将记录着各种密码、端口等信息的文件从 `instances/config.example.js` 复制为 `instances/config.js` 中，并根据自己实际的密码、端口号等信息进行修改。

### 安装 Nodejs 及其自带的包下载工具 npm
从 [nodejs 官网](nodejs.org) 下载安装。

如果是 Linux 用户，需要手动将 node 安装位置的 `bin` 目录添加到 `$PATH` 中。

### 配置 npm 镜像
为避免后续执行 `npm install` 时因网络问题导致的下载失败，最好是配置一下镜像：

    npm config set registry https://registry.npm.taobao.org

### 使用 npm 自动安装 package.json 中的包
在项目根目录中运行如下命令会把包安装到 `node_modules/` 中：

    npm install

有些 nodejs 版本可能需要这样才能顺利安装：

    npm install --legacy-peer-deps

### 使用 npm 安装 NodeJS 源代码监控工具 supervisor

    npm install -g supervisor

### 安装其它必要的软件
目前上传图片生成缩略图，需要依赖 imagemagick 和 ffmpeg

如果是阿里服务器 ubuntu 版本的话，需要先增加更新源

    sudo apt-add-repository ppa:mc3man/trusty-media
    sudo apt-get update
    sudo apt-get install ffmpeg

imagemagick 安装步骤：

    sudo apt-get install imagemagick

ffmpeg 安装步骤：

    sudo apt-get install ffmpeg

执行 convert -v 和 ffmpeg -v，确认是否安装成功。

## 配置前端

### 使用 npm 安装 react-native 命令行工具

    npm install react-native-cli -g

## 初始化数据库
创建数据库登录mysql，使用命令行创建数据库

  CREATE DATABASE db_name DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

根据实际情况修改 `models/migrate.js` 文件内最后一个 `co()` 调用函数中的内容，开发阶段默认为调用 `development()` 函数，然后运行如下命令：

    models/migrate.js

如果是开发阶段需要一个崭新的数据库或是产品阶段，则使用如下命令

   models/migrate.js -p

`-p` 参数会删除原有的数据库并建立一个新的。

后续代码修改，如与数据库中具体数据相关，则需相应修改 `models/migrate.js` 。

### ACL
现在 ACL 已经全局保护 router 下面的所有 URL ，当新增一个 URL 时需要做如下操作，否则会被ACL拦截而出现 403 错误：

* 情况1. 若一个 URL ，有的 role 可以访问，有的禁止，请添加入 b_module ，并在 b_role_module 里把这些 URL 的权限赋
值给有权限的 role
* 情况2. 个别 URL 比如登陆功能，根路径等，无需 ACL 保护的，请把代码移至 router-noAcl 目录内
* 情况3. 个别 URL 比如后台测试接口等，为调试方便，希望 curl 可以直接访问，可以先加入 b_module 数据表内， name 取名
为 public ，则所有用户（包括未登录）都可以访问

如还是无法访问，可能需要在浏览器中清除下 cookie 。

## 启动后端
### 启动主进程
在项目根目录中简单使用如下命令即可运行：

    DEBUG=true node index.js

或是使用 package.json 中的 start 脚本启动：

    npm start

这里的 start 脚本实际上就是 `DEBUG=true supervisor -i src,public,views,webpack.config.js index.js` ，也就是用 supervisor 监控着，一旦有某个源代码修改了，会自动重启后端，这样就很方便于我们修改调试代码了。 `DEBUG=true` 的调试方式详见 [debug](https://www.npmjs.com/package/debug) 模块的介绍。这里直接让 start 脚本作为调试用途，是因为真正的发布版本我们会用下面提到的 pm2 来启动。

注： package.json 中的脚本，除了 start 和 test 可以直接加 `npm` 前缀来启动，其它脚本需要加 `npm run` 前缀。

## 浏览器登录
在 [http://0.0.0.0:8765](http://0.0.0.0:8765) 上注册登录 。

## 启动客户端 APP
支持 android 、 ios 、 web 三种 APP 。

web 应用的调试用 `npm run web` 然后在浏览器中进入 [http://0.0.0.0:3000/](http://0.0.0.0:3000/) ，这个命令使用了动态加载技术，不用手动刷新浏览器所以对调整界面元素比较方便，但如果访问后端的话会产生跨域问题（因为 3000 和 8765 是不同的端口号，就被认为是不同的域），此时要么使用带有 `DEBUG` 环境变量比如 `npm start` 那样的脚本启动后端以便让 `kcors` 模块来开放跨域权限，要么使用 `npm run debug-web-w` 然后在浏览器中进入 [http://0.0.0.0:8765/](http://0.0.0.0:8765/) ； 发布用 `npm run build-web` 。

android 应用的调试用 `npm run android` （需提前按照 [React 使用详解](https://github.com/flyskywhy/g/blob/master/i主观的体验方式/t快乐的体验/电信/Tool/编程语言/JavaScript/React使用详解.md) 配置环境），如果运行后安装完 APK 就自动退出的，则还需手动运行 `npm run rn` ； 发布用 `npm run build-android` ，发布用的签名方法详见 [React 使用详解](https://github.com/flyskywhy/g/blob/master/i主观的体验方式/t快乐的体验/电信/Tool/编程语言/JavaScript/React使用详解.md) 中的“ release 离线打包 ”小节。

##  调试LOG输出
代码默认情况下：

1. debug 等级之上 log 的输出同步输出到文件和命令行窗口；
2. debug 等级之上 log 的输出到文件 access.log ；
3. error 等级之上 log 的输出到文件 error.log ；

大家可以用 logger.debug( … ) , logger.info( … ) , logger.error( … ) ,等方便调用；
Bunyun 的调试等级从低到高依次为 trace(10) , debug(20) , info(30) , warn(40) , error(50) , fatal(60) ;

安装 bunyan

    npm install -g bunyan

然后使用 `npm start | bunyan` ， 可以格式化输出 log ；

    npm start | bunyan -L 按北京时间显示
    npm start | bunyan -c 'this.phone == 13900000001' 按条件搜索

1. 调试时，为了避免终端调试打印过多，可以用 `npm start | bunyan –l ${level}` （终端只打印 ${level} 等级之上的信息）;
2. 调试时，支持使用 `GET '/api/v0001/control/dbglevel'` 获得当前调试等级；支持 `POST /api/v0001/control/dbglevel  [{ "dbgLevel" ：${level}}]` 动态调整 log 等级;
3. 发布时，只有把上述第一条规则改为 `error` 等级以上终端输出即可；

注： ${level} 为 trace|debug|info|warn|error|fatal;

trace：最低等级的调试打印，用于高频，冗余，内部的打印调试信息，默认关闭;
debug：普通调试打印（建议少用），稳定发布版本后续也可能关闭;
info：需要记录的调试打印，表达有完整的意义;
warn：警告打印;
error：错误打印;
fatal：非常严重的错误打印;
debug和info使用容易混淆，调试打印主要用trace，info，而建议debug少用;
判断debug与trace的区别大致是，debug不影响系统性能，可以跟踪问题持续打开一段时间，而trace可能引起大量的打印，而不建议长时间开启，会影响系统性能

KOA架构下引入koa-bunyan-logger, 每个网络请求有request日志包含用户名，手机号码和req-id，返回值400-499，打印等级为warn，500以上为error， 400以下为info;

若在router接口内打印请使用`this.log.{dbgLevel}(...)`,log内将自动添加req-id（同一请求值唯一），若需添加用户信息可使用`this.log.{dbgLevel}({user: this}, ...)`;

若在router接口外，可以使用`log.{dbgLevel}(...)`;

## 调试后端
除了用 `console.log()` 这种打印方式来进行调试外，也存在许多图形界面单步调试的方法，典型的是 node-inspector，首先用如下命令安装：

    npm install -g node-inspector

然后先使用如下命令启动后端：

    node --debug index.js

接着使用如下命令启动 node-inspector：

    node-inspector --web-port 8081
## sequelize transaction 用法
### 方法一 自动callback方式
  事务处理回调函数成功结束，自动执行commit，执行报错则自动执行rollback;
  需要人为rollback的情况下，throw new Error(‘ ErrorInfo ...’);
  注意：为避免死锁，回调函数内的所有数据库操作，请带上{transaction: t}

    yield sequelize.transaction(function (t) {
    // chain all your queries here. make sure you return them.
    // 或使用  return co(function * () { ... }) 或async function（）{ await ...}
    return User.create({
        firstName: 'Abraham',
        lastName: 'Lincoln'
      }, {
        transaction: t
    })
    .then(function (user) {
      return user.setShooter({
        firstName: 'John',
        lastName: 'Boothe'
      }, {
        transaction: t
      });
    });
    }).then(function (result) {
      // Transaction has been committed
      // result is whatever the result of the promise chain returned to the transaction callback
    }).catch(function (err) {
      // Transaction has been rolled back
      // err is whatever rejected the promise chain returned to the transaction callback
    });

### 方法二 手动callback方式(推荐)
  需要人为根据逻辑，执行commit或rollback;
  注意：使用try..catch...,捕获错误，程序执行结束不能遗漏执行rollback或commit;

    var t = yield sequelize.transaction();
    try{
      var user = yield User.create({
          firstName: 'Abraham',
          lastName: 'Lincoln'
        }, {
          transaction: t
      });
      ...
      if (error) {
        yield t.rollback();
        return ;
      }
      yield t.commit();
    }
    catch(e) {
      log.error(e);
      yield t.rollback();
      return;
    }

## mysql查找死锁原因
    结合以下命令提供的信息和general log和代码分析原因;
    查看process：
    show processlist\G;

    查看process间等待关系：
    SELECT r.trx_id waiting_trx_id,
    r.trx_mysql_thread_id waiting_thread,
    r.trx_query waiting_query,
    b.trx_id blocking_trx_id,
    b.trx_mysql_thread_id blocking_thread,
    b.trx_query blocking_query
    FROM information_schema.innodb_lock_waits w
    INNER JOIN information_schema.innodb_trx b  ON b.trx_id = w.blocking_trx_id
    INNER JOIN information_schema.innodb_trx r  ON r.trx_id = w.requesting_trx_id\G;

    查看锁表情况：
    select * from information_schema.INNODB_LOCKS\G

    检查Innodb_row_lock状态变量来分析系统上的行锁的争夺情况
    mysql> show global status like '%innodb%row%lock%';
    参考http://blog.itpub.net/26506993/viewspace-2124488/

此时会打印出一个 URL 比如 [http://127.0.0.1:8081/?port=5858](http://127.0.0.1:8081/?port=5858) ，最后就是使用 Chrome 浏览器打开该 URL 就可以在一个功能强大、使用方便的网页界面中进行加断点、单步运行等常用调试方法了。

这里参考了 [用node-inspector调试Node.js](http://www.noanylove.com/2011/12/node-the-inspector-debugging-node-js/) 一文。

## 调试前端

参考 [Chrome developer tool介绍（javascript调试）](http://www.cnblogs.com/wukenaihe/archive/2013/01/27/javascript调试.html) 一文即可。

## 部署网站

### app 服务器
基本操作是把 node.js 转换成系统启动时的服务，崩溃后也可以重新开始继续服务，这个可以使用 npm 包 pm2 来实现，详见 [How To Set Up a Node.js Application for Production on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-14-04) 。简单来说，就是使用如下命令代替 `npm start`来启动 app 服务器：

    pm2 start index.js

### web 服务器
使用 nginx 做为 web 服务器反向代理到 app 服务器，这样可以减轻 node.js 的负担，而且也方便做负载均衡。

参考了如下两篇文档

[How To Set Up a Node.js Application for Production on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-14-04)

[HARDENING NODE.JS FOR PRODUCTION PART 2: USING NGINX TO AVOID NODE.JS LOAD](http://blog.argteam.com/coding/hardening-node-js-for-production-part-2-using-nginx-to-avoid-node-js-load/)

以及其它一些网文，这里以 Ubuntu 为例进行部署说明。

在使用 `sudo apt-get install nginx` 命令安装好 nginx 后，首先使用 `sudo rm /etc/nginx/sites-enabled/default` 命令把原先这个软链接到 `/etc/nginx/sites-available/default` 文件从而占用着 80 端口的 nginx 示例网站的配置删除，这样释放出来的 80 端口就能用于我们实际的网站了。

然后在项目根目录下使用如下命令

    sudo ln -s `readlink -f scripts/nginx.conf` /etc/nginx/sites-enabled/ReactWebNative8Koa
    sudo mkdir -p /var/www/ReactWebNative8Koa/
    sudo ln -s `readlink -f public/` /var/www/ReactWebNative8Koa/

来让我们的 `scripts/nginx.conf` 成为系统的 `/etc/nginx/nginx.conf` 所 include 的一部分。

最后使用如下命令重启 nginx 即可使用 `scripts/nginx.conf` 中 `server_name` 所示的网址进行访问了：

    sudo service nginx restart

注：后续如果发现 nginx 真如 `/etc/nginx/sites-available/default` 里的注释所说无法在 https 情况下开启 gzip ，则可能需要关闭 `/etc/nginx/nginx.conf` 中的 gzip 及开启 `index.js` 中的 `koa-compress` ，但貌似 nginx 会自动忽视 `koa-compress` 的压缩成果，也许要用 `gzip_static on;` 并预先提供好 `.gz` 文件才行？



## lint
安装 eslint

    npm install -g eslint

然后配合 `.eslintrc` 文件及下面提到的 Sublime Text 编辑器的 SublimeLinter-contrib-eslint 插件，可以非常方便地避免一些常见 BUG。

## 编辑代码
最好的 javascript 的编辑器，收费的要数 webstorm 第一，免费的则是开源世界普遍使用的 Sublime Text 最强， 虽然 Sublime Text 能编辑的并不仅仅是 javascript 源代码。

具体 Sublime Text 及其强大插件比如 SublimeLinter-contrib-eslint 的安装方法，详见 [Sublime Text 使用详解](https://github.com/flyskywhy/g/blob/master/i主观的体验方式/t快乐的体验/电信/Tool/文档编辑/SublimeText/SublimeText使用详解.md) 。

## 编码规范
* 普通文件权限为 644 ，可执行文件权限为 755 。
* 字符编码为 UTF-8。
* 换行符为 LF。 应用 Sublime Text 来保证，详见 [Sublime Text 使用详解](https://github.com/flyskywhy/g/blob/master/i主观的体验方式/t快乐的体验/电信/Tool/文档编辑/SublimeText/SublimeText使用详解.md) 中的“ 设置换行符为 LF ”小节。
* 行尾不要留有空白字符。应用 Sublime Text 来保证，详见 [Sublime Text 使用详解](https://github.com/flyskywhy/g/blob/master/i主观的体验方式/t快乐的体验/电信/Tool/文档编辑/SublimeText/SublimeText使用详解.md) 中的“自动删除行尾的空白字符（空格或制表符）”小节。
* 缩进为 4 个空格。应用 Sublime Text 来保证，详见 [Sublime Text 使用详解](https://github.com/flyskywhy/g/blob/master/i主观的体验方式/t快乐的体验/电信/Tool/文档编辑/SublimeText/SublimeText使用详解.md) 中的“ 转换 tab 为 space  ”小节。
* 应用上文提到的 SublimeLinter-contrib-eslint 插件，这样除了可以自动提示比如忘了加逗号的错误，也可以自动提示 [JavaScript 秘密花园](http://bonsaiden.github.io/JavaScript-Garden/zh/) 中提到的警告比如用 `===` 代替 `==` 、绝对不要省略分号、绝对不要使用 eval 等等。
* `.eslintrc` 未能覆盖的，详见 [JavaScript编码规范](https://github.com/flyskywhy/g/blob/master/i主观的体验方式/t快乐的体验/电信/Tool/编程语言/JavaScript/JavaScript编码规范.md) 。
* git 提交时的描述请参考 [Commit message 和 Change log 编写指南](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html) 一文。
* 后端代码即使没有数据要返回，比如许多 POST 或 PUT 的 API ，也要在返回前赋值 `this.body = {};` ，否则有些浏览器会因为无法按照 JSON 格式去解析 body 而返回 `Uncaught (in promise) SyntaxError: Unexpected token O` 的错误。
* 后端向前端错误提示: 偶尔会有在 errCode 所表示的国际化提示文字中添加变量的需求，此时需要添加一个与 errCode 平级的 keyWord 来表示变量，格式参照 keyWord: [['节目1', '节目2', '节目3'], ['屏幕1', '屏幕2', '屏幕3']] ，然后在 `locale/zh-CN.js` 中就可以用比如 x[1][0] 来代表 '屏幕1' 这个字符串变量，或是直接用 x[0] 来代表 '节目1, 节目2, 节目3' 这一整个字符串变量了。
* 生产环境的数据库字段操作，尽量规避字段的删除和重命名操作

其它未尽描述的编码规范，对于 js 文件，应用 Sublime Text 来保证，详见 [Sublime Text 使用详解](https://github.com/flyskywhy/g/blob/master/i主观的体验方式/t快乐的体验/电信/Tool/文档编辑/SublimeText/SublimeText使用详解.md) 中的“ JsFormat ”小节。对于 html 和 css 文件，参照原有代码的格式即可。

## 数据库迁移
1.使用mysqldump 来备份数据和结构到sql文件（非必须，为安全起见），如下；

    mysqldump -uroot -p123 -h 123.7.8.9 -P 8787 --routines --complete-insert=true --default-character-set=utf8  ReactWebNative8Koa_develop01 >  ReactWebNative8Koa_develop01.sql

2.确保instance/config.js数据库配置正确，执行migrate.js；

    node models/migrate.js

  migrate.js将执行如下工作：

  1)增加，删除表，同步表结构到最新;
  2)增加记录和更改记录;
  3}清空redis涉及ACL的KEY

3.若需要手动清空redis

  默认本地执行：

    redis-cli del `redis-cli keys "ReactWebNative8Koa//[0-9]*/[0-9]*"`

  远端带密码执行：

    redis-cli -h 127.0.0.1 -p 6379 -a '' del `redis-cli -h 127.0.0.1 -p 6379 -a '' -n 0 keys "ReactWebNative8Koa//[0-9]*/[0-9]*"`

    -h: host
    -p: port
    -a: password
    -n：database num
