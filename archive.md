---
layout: page
title: "ARCHIVE"
description: "人生漫漫，祝你能快乐地消磨时间。"
header-img: "img/navi.jpg"
---

<script src="/js/archive.js" type="text/javascript" charset="utf-8"></script>
<ul class="listing" id="rawPosts">
{% for post in site.posts %}
  <li class="listing-item" data-time="{{ post.date | date:"%Y-%m-%d" }}" data-url="{{ post.url }}" data-title="{{ post.title }}" data-subtitle="{{ post.subtitle }}" data-series="{{ post.series}}" data-header-img="{{ post.header-img }}">
    {{ post.title }}
  </li>
{% endfor %}
</ul>
