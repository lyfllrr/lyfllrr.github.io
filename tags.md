---
layout: page
title: "TAGS"
description: "看，她们的故事交织在了一起"
header-img: "img/navi.jpg"
---

## 本页使用方法

1. 在下面选一个你喜欢的标签
2. 点击它
3. 相关的文章会「唰」地一声跳到页面顶端
4. 马上试试？

## 标签列表

<div id='tag_cloud'>
{% for tag in site.tags %}
<a href="#{{ tag[0] }}" title="{{ tag[0] }}" rel="{{ forloop.index }}">{{ tag[0] }}</a>
{% endfor %}
</div>

<ul class="listing">
{% for tag in site.tags %}
  <h4 class="listing-seperator" id="{{ tag[0] }}">{{ tag[0] }}</h4>
{% for post in tag[1] %}
  <li class="listing-item">
  <time datetime="{{ post.date | date:"%Y-%m-%d" }}">{{ post.date | date:"%Y-%m-%d" }}</time>
  <a href="{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a>
  </li>
{% endfor %}
{% endfor %}
</ul>

<script src="/js/jquery.tagcloud.js" type="text/javascript" charset="utf-8"></script>
<script language="javascript">
$.fn.tagcloud.defaults = {
    size: {start: 1, end: 1, unit: 'em'},
    color: {start: '#4ec675', end: '#006b23'}
};

$(function () {
    $('#tag_cloud a').tagcloud();
});
</script>
