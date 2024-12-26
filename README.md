## 说明

此博客模板 Fork 自仓库：[cnfeat/blog.io: 简单直接可用博客模板](https://github.com/cnfeat/blog.io)

配套说用说明：[如何搭建一个独立博客——简明 GitHub Pages 与 jekyll 教程 - 读立写生](http://www.cnfeat.com/blog/2014/05/10/how-to-build-a-blog/)

## 新漫画定时发布

新分支取名为{YYYY-MM-DD-new-manga}，则会在UTC时间每周五11:55(即北京时间晚7:55)自动为此分支创建PR并自动merge，具体设置需参阅：[Github Actions](https://github.com/lyfllrr/lyfllrr.github.io/blob/main/.github/workflows/merge-pr.yml)

## 第三方功能

- 图床使用了[Cloudflare R2](https://www.cloudflare.com/ja-jp/developer-platform/r2/)
- 图片缩略图使用了[AWS S3](https://aws.amazon.com/s3/)
- 网站DNS以及流量监控使用了[Cloudflare](https://www.cloudflare.com/)
- 图片查看使用了相册插件[lightGallery](https://www.lightgalleryjs.com/)
- 评论功能使用了[liveRe](https://livere.com/login_form)插件