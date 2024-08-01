## 为什么要做vuiter？
vuiter最终会基于vue3语法实现，JavaScript有用很繁荣的生态，个人更加偏好vue，因为可以做编译时优化
<br>像tui-rs虽然很好，但是对于前端开发者（即基本只专注于JS/TS的开发者）来说上手成本太高
<br>ink可能是一个不错的选择，但是ink看起来也很重，我想做一个轻量级的，前端友好的终端UI库


## 使用flex布局

对比blessed yoga tui-rs ink 的实现之后最终决定先重新实现flex布局
<br>blessed 已经停止维护
<br>yoga 比较臃肿，看起来并不需要这么复杂的实现
<br>tui-rs 看起来也是自己实现
<br>ink 使用的yoga实现

vuiter实现的flex布局应该会很简单，实现的尺寸也只有两种百分比和绝对值(px)，
<br>由于是flex布局，因此最后一个元素可以通过flex: 1 做到完全撑满


## 知识储备
### DOM parser
- [jsdom](https://github.com/jsdom/jsdom)
- [cheerio](https://github.com/cheeriojs/cheerio)
- [node-html-parser](https://github.com/taoqf/node-html-parser)
- [scraper by rust](https://github.com/causal-agent/scraper)

### Virtual DOM
- [snabbdom](https://github.com/snabbdom/snabbdom)
