# 煎蛋外挂吐槽(假吐槽)

本脚本源自: ColtIsGayGay 的吐槽版本，

使用的都是 来必力 的社会化评论系统。

使用 uid: MTAyMC80NTA0MS8yMTU1OQ==

代码部分参考 煎蛋原生吐槽系统，

加载部分为全新重写。

目前已经完成功能：

显隐评论区 (煎蛋原生功能)

显示吐槽数 (使用懒加载 非公开接口 无法保证稳定 但(理论)不会影响现有功能)

单页评论区 (自动隐藏 零评论的原生吐槽)

安装地址: [https://greasyfork.org/zh-CN/scripts/387088](https://greasyfork.org/zh-CN/scripts/387088)
其实本git的 user.js 也行

## 手机上怎么用

### 安卓手机

建议安装 Yandex 浏览器 [Google Play](https://play.google.com/store/apps/details?id=com.yandex.browser)

然后进入 [Chrome 应用商店](https://chrome.google.com/webstore/category/extensions) 安装 [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

最后安装 [假吐槽插件](https://greasyfork.org/zh-CN/scripts/387088) 即可

PS: 经 @libook 提示(issue#1) Firefox 手机版是支持安装插件的。

### 苹果 iPhone 手机 (安卓也可以用)

将 **任意** 页面添加到个人收藏;

修改收藏的地址为下面:

    javascript:$.getScript('https://greasyfork.org/scripts/387088/code/jandan_fake_tucao.user.js');

每次打开页面需要手动点一下收藏加载(很挫,但没办法)
