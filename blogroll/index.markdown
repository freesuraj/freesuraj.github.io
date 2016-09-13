---
layout: default
title: Blogroll
description: My blog and web bookmarks
blogroll:
  -
    title: "Developing for Android"
    url: https://medium.com/google-developers/developing-for-android-introduction-5345b451567c
    host: medium.com
---

<h1>{{ page.title }}<br/><small>{{ page.description }}</small></h1>

{% for post in page.blogroll %}
<h4>
  <a href="{{ post.url }}" target="_blank">{{ post.title }}</a>
  <small>{{ post.host }}</small>
</h4>
{% endfor %}
