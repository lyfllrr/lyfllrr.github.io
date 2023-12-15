---
layout: post
title: 将图床切换至AWS S3以及设置CDN、防盗链、生成缩略图的过程
header-img: 2023-05-21-HowDoITransferImagesToAWSS3/%E9%A2%98%E5%9B%BE.jpg
subtitle: “嗨，第三方图床终究靠不住，还是得自己来”
date: 2023-5-21
categories: blog
isOriginalArtwork: false
tags: [SFW]
description:
imgUrls:
author: 中毒患者
---

> 5月19日晚，我制作了两个月之久的最新作品终于发布了。  
> 还以为这次能同时发布在Pixiv和这里，应该是万无一失，却没想到被这里用的图床网站背刺了——漫画的最后几十张图上传后立刻被删除，恐怕是触发了对未成年作品的伦理审查。  
> 第三方服务，尤其是免费的服务，终究靠不住。本想着能苟多久苟多久，这回苟无可苟，只好亲自出手了。  
> 既然要换，那就把需要的全做完，建一个以后能长久使用，服务稳定的图床。  
>   
> 昨天辛苦了一天，把从建立S3到分发服务到防盗链到自动生成缩略图这一套全做完了，现在想把这个过程记录下来，一来以后回头看知道我当初为了这个网站都做过什么，二来也许也能帮到其他个人站长，于是就有了这篇文章。  

- [新的图床——AWS S3](#新的图床aws-s3)
- [CDN——AWS CloudFront](#cdnaws-cloudfront)
  - [为什么要使用CDN](#为什么要使用cdn)
  - [CloudFront该如何设置](#cloudfront该如何设置)
- [防盗链——AWS WAF](#防盗链aws-waf)
  - [为什么要设置防盗链](#为什么要设置防盗链)
  - [AWS WAF该如何设置](#aws-waf该如何设置)
- [自动生成缩略图——AWS Lambda](#自动生成缩略图aws-lambda)
  - [漫画的特殊需求](#漫画的特殊需求)
  - [S3的缩略图该如何设置](#s3的缩略图该如何设置)
    - [准备运行环境](#准备运行环境)
      - [Java11](#java11)
      - [AWS CLI](#aws-cli)
      - [Maven](#maven)
    - [打包生成缩略图程序并上传至AWS Lambda](#打包生成缩略图程序并上传至aws-lambda)
- [后记](#后记)


## 新的图床——AWS S3

AWS S3用作图床的指南网上随便一搜就有很多了，我参考的是这一篇：[用AWS S3做博客图床-水八口](https://blog.shuiba.co/use-aws-s3-as-static-files-hosting-for-blog)。  
开通S3并用来存储内容的设置本身并不复杂，5月19日晚收到读者评论说图床挂了后，我从开始操作到完成链接更换总共只花了30多分钟，可见操作有多简单。如果你也要把东西存到S3并直接使用S3的链接，那么你只需要  
1. 在S3服务新建一个存储桶
2. 设置为允许公开访问
3. 把内容上传进去后点击完成上传的内容，复制`对象 URL`
4. 大功告成  

19日晚上我通过以上操作，把网站这边的图片链接全部替换了过来。(但是这个非常仓促的补救行为也给我自己挖了一个坑，后面会提到)  

![5月19晚，连夜替换图片链接](https://d3i33ap8n3le07.cloudfront.net/2023-05-21-HowDoITransferImagesToAWSS3/5%E6%9C%8819%E6%99%9A%EF%BC%8C%E8%BF%9E%E5%A4%9C%E6%9B%BF%E6%8D%A2%E4%BA%86%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5.jpg)
  
但如上面那篇博文所介绍，S3开通只算做完了一半的工作，要想把S3当作图床用，还需要再设置用于分发S3内容的CDN。  


## CDN——AWS CloudFront  
  

### 为什么要使用CDN
这里先简单介绍一下为什么用S3当图床时最好要设置CDN。  
首先CDN是什么呢？CDN，即內容分发网络（英语：Content Delivery Network或Content Distribution Network，缩写：CDN）是指一种透过互联网互相连接的电脑网络系统，利用最靠近每位用户的服务器，更快、更可靠地将音乐、图片、视频、应用程序及其他文件发送给用户，来提供高性能、可扩展性及低成本的网络内容传递给用户。——Wikipedia  
我们在自己服务器上存储的图片、视频等静态内容，在公开到网络上时，如果没有CDN，那么访问者是以下图的模式访问的  

![无CDN时的静态内容访问路径](https://d3i33ap8n3le07.cloudfront.net/2023-05-21-HowDoITransferImagesToAWSS3/%E6%97%A0CDN%E6%97%B6%E7%9A%84%E9%9D%99%E6%80%81%E5%86%85%E5%AE%B9%E8%AE%BF%E9%97%AE%E8%B7%AF%E5%BE%84.jpg)
  
这种访问模式并没有功能上的问题，访问者可以顺畅得获得服务器上存储的图片，它唯一的问题就是会过多占用服务器端的上行带宽，因为服务器要直接承担所有的请求，而AWS S3的收费模式是——  
> 作为 AWS 免费套餐的一部分，您可以免费开始使用 Amazon S3。注册后，AWS 新客户将每个月获得 S3 Standard 存储类中的 5GB Amazon S3 存储空间、20,000 个 GET 请求、2,000 个 PUT、COPY、POST 或 LIST 请求以及 100 GB 的数据传出量。  

20,000 个 GET 请求——如果我放在S3上的所有图片，加起来总共被查看了超过2万次/月，我就要向AWS付钱了。  
最新一章的漫画有281张图片，也就是说只需要不到100个人在我的个人站看完一次漫画，就能把我S3的免费配额给用光！  
——在不使用CDN的情况下  

有CDN就能回避掉上面的问题，为什么呢？因为有CDN的情况下，访问者的访问模式是这样的  

![有CDN时的静态内容访问路径](https://d3i33ap8n3le07.cloudfront.net/2023-05-21-HowDoITransferImagesToAWSS3/%E6%9C%89CDN%E6%97%B6%E7%9A%84%E9%9D%99%E6%80%81%E5%86%85%E5%AE%B9%E8%AE%BF%E9%97%AE%E8%B7%AF%E5%BE%84.jpg)
  
访问者不再直接访问到服务器，而是从CDN的缓存中取得服务器里的静态内容，服务器的负担有相当一部分会转移到CDN那边。  
有人说那CDN也不是免费的呀，没错。但AWS的CDN服务的免费额度如下  
> 每月 1 TB 传出数据  
> 每月 10000000 个 HTTP 或 HTTPS 请求  
> 每月 200 万次 CloudFront 函数调用  
> 免费 SSL 证书  
> 无限制，所有功能均可用  

1T数据（我一章漫画只有200M左右），1000万次HTTP请求——对比S3的2万次，轻松多了吧？    
所以如果想用S3当图床的话，从成本角度，给图床设置CDN分发是极其必要的。  
而上面我说仓促的替换链接给自己挖了一个坑，就是19日晚上我替换链接时还没有设置CDN服务，所以在个人站上直接使用了S3的链接，而第二天当我设置好CDN准备替换时，S3那边的2万次访问的免费额度其实已经用完了……  
不过好在也不贵，账单只有几块钱而已（不再增长的话）……


### CloudFront该如何设置

依然可以直接参考这篇文章：[用AWS S3做博客图床-水八口](https://blog.shuiba.co/use-aws-s3-as-static-files-hosting-for-blog)。  
事实上如果使用S3的话，在AWS内部与CloudFront进行联动设置是非常方便的，无论是S3那边的访问权限还是CloudFront的源，都可以直接复制/选择。  

这里我唯一需要补充的就是，CloudFront里有多个源时该怎么设置。  
比如我在S3这边有两个存储桶，分别储存漫画原图和缩小后的缩略图，而在CloudFront上进行分发时，一个桶就是一个源，所以我现在使用的CloudFront分配器里同时绑定着两个源。  

![一个分配器里绑定了两个源](https://d3i33ap8n3le07.cloudfront.net/2023-05-21-HowDoITransferImagesToAWSS3/%E4%B8%80%E4%B8%AA%E5%88%86%E9%85%8D%E5%99%A8%E4%B8%AD%E6%9C%89%E4%B8%A4%E4%B8%AA%E6%BA%90.jpg)
  
这种时候只需要在行为Tab下设置多个行为就可以了。  
以我的情况为例，如图。  

![多个源时的行为设置](https://d3i33ap8n3le07.cloudfront.net/2023-05-21-HowDoITransferImagesToAWSS3/%E5%A4%9A%E4%B8%AA%E6%BA%90%E6%97%B6%E7%9A%84%E8%A1%8C%E4%B8%BA%E8%AE%BE%E7%BD%AE.jpg)
  
首先，在默认行为之外新增一个行为，为新的行为设置路径模式，意为只转发`resized`文件夹下的`.jpg`内容，且优先级高于默认行为，该行为的源要设置为储存缩略图的源（`naturerealized.images-resized`）。  
这样当访问的url是`https://foo.cloudfront.net/resized/sample.jpg`时，就会从缩略图源中获取`sample.jpg`，而url是`https://foo.cloudfront.net/sample.jpg`时，就会继续以默认行为，从默认行为的源（`naturerealized.images`）中获取`sample.jpg`，即原图。  
然后，S3的存储桶里也要把路径设置为对应的状态。如我现在的设置下，S3这边的文件结构就需要设置为如下状态  
─ naturerealized.images  
├ 2023-05-19-MySexyGirlFriendAndHerIntrovertedCousin-Chapter.1/  
├ 2022-11-26-MyBustyLicentiousMon-Chapter.8/  
└ ...  
─ naturerealized.images-resized  
└ resized  
　├ 2023-05-19-MySexyGirlFriendAndHerIntrovertedCousin-Chapter.1/  
　├ 2022-11-26-MyBustyLicentiousMon-Chapter.8/  
　└ ...  

这样一来，CDN的设置就结束了。  


## 防盗链——AWS WAF  
  
### 为什么要设置防盗链
虽然我觉得没有太多解释的必要，不过还是姑且一说。  
CDN的分发的免费限额虽然很高，但是也架不住有心怀恶意之人，直接复制了你的网站里的图的链接，贴到他们的网站中。  
如果不设置防盗链的话，你就相当于用自己的CDN和S3，来为他们提供服务——当然了，如果他们到处引流，把他们的网站流量做得很大，那最后付费的也会是你。  
不想当这个冤大头吧？那就请好好设置一下防盗链。  

### AWS WAF该如何设置
这里我依然参考了水八口（先生？女士？）的[AWS图床防盗链](https://blog.shuiba.co/aws-hotlink-protection)。  
> 这里我闲扯一嘴，不得不说这位仁兄非常认真，上面的S3和CDN设置的介绍文章写自2年前，那篇文章在遗留问题里提到了没有设置防盗链。2年后23年4月17日，这篇防盗链的文章终于被追加上了……  

因为依然是AWS自己的服务，WAF与AWS的CloudFront的联动同样非常方便，大部分设置可以跟着上面文章的说明完成，但值得留意的是规则部分。  
如果你要给自己的网站设置防盗链，那么最简单的方式也是设置Referer，即通过限制对图片发起GET请求的Domain来限制自己以外的网站使用图片的url。  
不过如果限制了Referer，那就意味着你直接把图片url放到浏览器里打开的话，是会被拒绝访问的——这样很不方便调试。  

![直接访问的话会像这样被阻止](https://d3i33ap8n3le07.cloudfront.net/2023-05-21-HowDoITransferImagesToAWSS3/%E7%9B%B4%E6%8E%A5%E8%AE%BF%E9%97%AE%E7%9A%84%E8%AF%9D%E4%BC%9A%E5%83%8F%E8%BF%99%E6%A0%B7%E8%A2%AB%E9%98%BB%E6%AD%A2.jpg)  
  
我的解决办法是在Referer的匹配规则里使用了正则表达式。  
```
(https://naturerealized.com/|http://localhost:4000/)
```    

这样虽然仍然无法直接访问图片，但至少同时允许了来自线上的个人站和本地的测试环境的访问，方便我进行调试了。  
除此之外也有一些其他的野路子，比如你可以增设一个规则，允许cookie中包含指定关键词的访问，然后对url的domain，也就是你的cdn，手动设置指定的关键词——不过要记得Cookie的有效期设置得久一些，哈哈。


## 自动生成缩略图——AWS Lambda
  
### 漫画的特殊需求  
预览，但不需要完全预览。  
对长篇连续漫画的展示功能来说，打开大图前，一个能看到大概内容的缩略图预览是非常重要的。  
预览缩略图可以在读者尚未看完全部内容就因为外力中断，需要重新找到观看进度时起辅助参考作用，同时因为读者能从指定页码开始加载大图，可以同时节省服务器的流量，和读者等待的时间。  
然而非常可惜的是无论pixiv还是其他R18漫画网站（我记得哔咔、禁漫都不行），都少有配备小图预览功能，不得不说非常遗憾——这个世界，需要更多优秀的产品经理啊。


### S3的缩略图该如何设置  
与前两个服务不同，为S3设置缩略图的指南虽然也有很多，但大都非常难用，我在搭建图床时也是在缩略图的生成功能上花费了最多的时间。  
这既是因为缩略图功能需要用编程在AWS Lambda上实现“生成缩略图”功能，同时这个功能的实装需要设置AWS IAM、AWS S3的权限，以及AWS CLI和指定编程语言的执行环境等，对没有编程经验的人难度确实有点大。  
我比较熟悉的是Java，所以这里我以Java为例介绍如何在AWS Lambda上添加为指定S3存储桶文件生成缩略图的功能。  

#### 准备运行环境
首先你需要设置好Java11的JDK环境和AWS CLI的执行环境以及提前安装好maven。
##### Java11
  可以使用Amazon Corretto，下载地址在这里：[Amazon Corretto 11](https://docs.aws.amazon.com/zh_cn/corretto/latest/corretto-11-ug/downloads-list.html)   
  需要你在本地执行Java，所以按照你的系统来选择安装包就可以了，有编程经验的人这一步应该并不需要我过多说明，不过如果不懂如何安装Java11 JDK，可以看这里：[Amazon Corretto 11的安装说明](https://docs.aws.amazon.com/zh_cn/corretto/latest/corretto-11-ug/windows-7-install.html)
##### AWS CLI
  AWS CLI的安装分为两部分
- 首先是安装AWS CLI本身，这一步非常简单，参考这里就可以了：[安装或更新最新版本的 AWS CLI](https://docs.aws.amazon.com/zh_cn/cli/latest/userguide/getting-started-install.html)
- 然后我们需要为本机设置访问我们的AWS账户的凭证（credentials）  
  - 在IAM中创建一个用户，并为用户赋予`AWSLambda_FullAccess`的权限策略。  
  - 然后在这个用户的`安全凭证`分页中，在`访问密钥`栏创建新的访问密钥，创建完成后记得下载`.csv`文件，接下来用得到。
  - 接下来前往你本地的`C:\Users\{用户名}\.aws`文件夹，这里应该有一个credentials文件和一个config，用文本编辑器打开它们，参考刚刚下载的`.csv`文件，将下面的内容写进去并保存
credentials要改成下面这样：  
```
[default]
aws_access_key_id = {下载.csv文件的Access key ID}
AWS_SECRET_ACCESS_KEY = {下载.csv文件的Secret access key}
```
config要改成下面这样：
~~~
[default]
region = {你的S3所在的区域，如ap-northeast-1}
~~~

##### Maven
如果你有开发Java经验的话，那你的电脑上多半已经有Maven了，没有的话从这里下载安装：[Downloading Apache Maven](https://maven.apache.org/download.cgi)  
Windows的话下载zip即可，下载完成后将内容解压缩到任意文件夹，然后将maven文件夹下`bin`文件夹的完整路径添加到系统的环境变量Path中。
添加完之后在命令行里执行  
~~~
mvn -v
~~~
有显示Apache Maven的字样的话就说明安装完成了。  

如此，运行环境就准备好了

#### 打包生成缩略图程序并上传至AWS Lambda

具体的程序我参考了AWS官方的这篇文章：[使用 Amazon S3 触发器创建缩略图](https://docs.aws.amazon.com/zh_cn/lambda/latest/dg/with-s3-tutorial.html)  
每一步跟随该教程执行即可。

当你执行到`第 4 步 创建部署程序包`时记得选择Java。然后`创建项目`的第1小步，`使用以下命令创建一个名为……`中，官方给出的多行执行命令如果在本地无法顺利执行，可以把`\`删掉，把命令行合并为一行执行，即从这样  
```
mvn -B archetype:generate \
 -DarchetypeGroupId=org.apache.maven.archetypes \
 -DgroupId=com.example.CreateThumbnail \
 -DartifactId=create-thumbnail
```
变为这样
~~~
mvn -B archetype:generate -DarchetypeGroupId=org.apache.maven.archetypes -DgroupId=com.example.CreateThumbnail -DartifactId=create-thumbnail
~~~  
※后面遇到类似的问题都可以用这种方式解决，不再赘言  

接下来在第4小步，`打开 Handler.java 并用以下代码替换内容，然后保存文件。`中，第53行  
~~~java
String dstBucket = srcBucket + "-resized";
String dstKey = "resized-" + srcKey;
~~~
这里的`dstBucket`为最终生成缩略图时使用的存储桶，`dstKey`为最终生成缩略图的路径+文件名。  
在这里为了匹配我在[CloudFront该如何设置](#cloudfront该如何设置)里的多个源状态下的路径模式，我将官方默认的`dstKey`的值进行了修改，改为了  
~~~java
String dstKey = "resized/" + srcKey;
~~~
以使生成缩略图的文件结构与CDN的行为里的路径模式相匹配。  

剩下的就没有难点了，按照教程的指引一步步完成，最终就可以在AWS Lambda上实装AWS S3上传新图时自动生成缩略图的功能了。



## 后记

至此，图床的搭建总算告一段落了。  
  
写出来看似很长，但实际上一天就全部做完了，对AWS有足够了解的情况下，这篇文章里的操作都算不上复杂。  
这个过程里我也确实学习到了一些新东西，这样记下来就像学习笔记一样，除了节省以后的后来者的时间，更多的其实只是满足自己一种打怪升级般的小小成就感。  
但不管怎么说，自建的图床有了，以后大家在这里看漫画也会方便很多吧。  
今天我又下载了一个S3图片上传工具，以后我发布漫画时也能节省很多功夫了。  
唯一需要担心的，大概只有费用问题……  