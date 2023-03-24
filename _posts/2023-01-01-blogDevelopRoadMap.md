---
layout: post
headerStyle:
title: 博客开发路线/功能实装清单
header-img:
subtitle: 关于我做了什么，以及接下来还要做什么
date: 2023-1-1
categories: blog
isOriginalArtwork: false
tags: [SFW]
description:
thumbnails:
imgWidth:
imgHeight:
imgUrls:
---

### Feature

- [x] ~~0. 架设平台 -> Github Pages，方便、免费~~
- [x] ~~1. 相册功能 -> PhotoSwipe~~
- [x] ~~2. 图库 -> imagebam，号称 10 年老网站，别的不说，反爬虫做的是真好~~
- [x] ~~3. 评论功能 -> 最初采用 Disqus，UI 真好看，然而不翻墙无法使用，后改用 LiveRe~~
- [x] ~~4. Domain/DNS -> [Xserver](https://secure.xserver.ne.jp/xapanel/myaccount/index)+[HE DNS](https://dns.he.net/)~~
- [x] ~~5. RSS 推送功能 -> Jekyll Feed 功能有限，但别无选择~~
- [x] ~~6. 分享功能 -> AddThis（意外的简单）~~
- [x] ~~7. 访问统计 -> Google Analytics~~
- [x] ~~8. 搭建本地开发环境 -> 从没用过 Ruby，不过好在不难~~
- [ ] 9. 增加 SFW 模式
- [ ] 10. 站内搜索功能
- [ ] 11. 图片弹幕功能
- [ ] 12. 应用美化插件 -> 也许会采用 NEXT?尚未决定
- [ ] 13. 更新邮箱推送系统 -> 或许会需要独立后端
- [ ] 14. SSO 登陆系统 -> twitter/QQ/微信/Google 都可以，可与邮箱系统联动
- [ ] 15. 漫画内容建立 github project 进行管理，CI/CD 脚本实现对 main branch 的新增内容上传至云端（AWS S3？）、获取链接并基于 Github Pages 自动发帖 <-commit 到 github 的图片应该无法直接使用，会被墙

### Bug

- [x] ~~0.1 更改网站图标等\_config.yml 中的默认设置，删除各.html 中不需要的默认元素~~
- [x] ~~0.2 更改默认 UI 设置~~
- [x] ~~1.1 基于 liquid template 实现单循环的 image 与 thumbnail 的同步 html 生成~~
- [x] ~~1.2 thumbnail 顺序加载~~
- [x] ~~1.3 lazyload+position 固定~~
- [x] ~~1.4 修改 PhotoSwipe lib 文件实装空格翻页~~
- [ ] 1.5 实装全屏状态下滚轮翻页功能
- [ ] 1.6 基于 liquid template，从 json 中加载图片链接
- [x] ~~2.1 写一个方便拿取图链的图库爬虫 -> 反爬虫需要 Request 持有 header+cookie+click 事件。~~  
       ~~技术不足，用 axios 无法实现，退而求其次，用 tampermonkey 脚本实现自动收集链接并下载~~
- [ ] 2.2 扩充 tampermonkey 脚本，直接生成漫画用 template 并填充 img 与 thumbnail
- [x] ~~3.1 测试评论功能 -> Disqus 不翻墙无法使用，废弃~~
- [x] ~~3.2 更换评论插件 -> 更换为 LiveRe~~
- [ ] 9.1 SFW 模式选择状态储存于 localStorage
- [ ] 9.2 SFW 模式手动开关（需要设置在不起眼的位置，about.md?）
- [ ] 9.3 SFW 模式自动开关（从 URL 中读取变量并保存设置）
- [ ] 9.4 SFW 模式下隐藏 NSFW 的 post、tag、archive，更换 background 图片、网站 title
- [ ] 9.5 从 NSFW 到 SFW 模式需要全局快捷键（Boss key）
