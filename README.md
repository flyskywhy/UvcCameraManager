# ReactWebNative8Koa

### 安装 Nodejs 及其自带的包下载工具 npm
从 [nodejs 官网](nodejs.org) 下载安装。

如果是 Linux 用户，需要手动将 node 安装位置的 `bin` 目录添加到 `$PATH` 中。

### 配置 npm 镜像
为避免后续执行 `npm install` 时因网络问题导致的下载失败，最好是配置一下镜像：

    npm config set registry https://registry.npm.taobao.org

### 使用 npm 自动安装 package.json 中的包
在项目根目录中运行如下命令会把包安装到 `node_modules/` 中：

    npm install

### 使用 npm 安装 react-native 命令行工具

    npm install react-native-cli -g

## 启动客户端 APP
支持 android 、 ios 、 web 三种 APP 。

web 应用的调试用 `npm run web` 然后在浏览器中进入 [http://0.0.0.0:3000/](http://0.0.0.0:3000/) ； 发布用 `npm run build-web` 在 public/ 生成 index.html 等文件。

android 应用的调试用 `npm run android` （需提前按照 [React 使用详解](https://github.com/flyskywhy/g/blob/master/i主观的体验方式/t快乐的体验/电信/Tool/编程语言/JavaScript/React使用详解.md) 配置环境），如果运行后安装完 APK 就自动退出的，则还需手动运行 `npm run rn` ； 发布用 `npm run build-android` ，发布用的签名方法详见 [React 使用详解](https://github.com/flyskywhy/g/blob/master/i主观的体验方式/t快乐的体验/电信/Tool/编程语言/JavaScript/React使用详解.md) 中的“ release 离线打包 ”小节。

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

其它未尽描述的编码规范，对于 js 文件，应用 Sublime Text 来保证，详见 [Sublime Text 使用详解](https://github.com/flyskywhy/g/blob/master/i主观的体验方式/t快乐的体验/电信/Tool/文档编辑/SublimeText/SublimeText使用详解.md) 中的“ JsFormat ”小节。对于 html 和 css 文件，参照原有代码的格式即可。
