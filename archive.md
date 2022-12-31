---
layout: page
title: "ARCHIVE"
description: "人生漫漫，祝你能快乐地消磨时间。"
header-img: "img/navi.jpg"
---

<ul class="listing">
{% for post in site.posts %}
  {% capture y %}{{post.date | date:"%Y"}}{% endcapture %}
  {% if year != y %}
    {% assign year = y %}
    <h3 class="listing-seperator">{{ y }}</h3>
  {% endif %}
  <li class="listing-item">
    <time datetime="{{ post.date | date:"%Y-%m-%d" }}">{{ post.date | date:"%Y-%m-%d" }}</time>
    <a href="{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a>
  </li>
{% endfor %}
</ul>
