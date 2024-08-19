# Vuiter

Terminal TUI similar [vue-termui](https://github.com/vue-terminal/vue-termui).
base on Vue3

[//]: # (# 边框)

[//]: # (仅支持统一的边框定义, 例如 `border: 1rem solid #fff;`)

[//]: # ()
[//]: # (为什么不支持 border-<left|top|right|bottom>-<style>-<color>这样的对单边进行的样式定义？)

[//]: # ()
[//]: # (因为命令行实际是文本环境，边框也实际上是文本，所以:)

[//]: # (1. 超过1rem的边框的宽度设置首先没有意义)

[//]: # (2. 不同的边设置不同的样式)
[//]: # (想了一下是有意义的，需要在权衡一下)

# 尺寸单位

rem(推荐)

命令行实际上是字符组合形成的UI，因此使用rem会比较合理
1rem = 1个字符尺寸

rem & em
rem 是根节点确定的字符尺寸，而em是相对尺寸，我们这里使用根节点的字符尺寸更加符合直觉

为什么不推荐用px
因为px的含义是像素，而TUI无法精确的表达到某个像素点上，甚至连字符放大2x都很难处理好
因此我们不推荐使用px，当开发者使用px单位的时候会被转成rem

举例: 1px --- 自动转换成 ---> 1rem --- 最终是 ---> Number(1)

| 属性   | 支持的类型           | 说明                                                       |
| ------ | -------------------- | ---------------------------------------------------------- |
| width  | `rem` `%` `_number_` | 绝对值单位推荐使用 `rem`, 使用其他web单位将被自动转换成rem |
| height | `rem` `%` `_number_` | 绝对值单位推荐使用 `rem`, 使用其他web单位将被自动转换成rem |
| border | `rem` `_number_`     | 边框只支持 `1rem`, 举例: `border: 1rem solid`              |

## Relation

- [ansi-escapes](https://github.com/sindresorhus/ansi-escapes)
- [chalk](https://github.com/chalk/chalk)
- [yoga](https://github.com/facebook/yoga)
- [yoga-layout-prebuilt](https://github.com/vadimdemedes/yoga-layout-prebuilt)
- [vue-termui](https://github.com/vue-terminal/vue-termui)
- [blessed](https://github.com/chjj/blessed)
- [cheerio](https://github.com/cheeriojs/cheerio)
- [ink](https://github.com/vadimdemedes/ink)
- [terminal-kit](https://github.com/cronvel/terminal-kit)
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)
- [commander.js](https://github.com/tj/commander.js)
