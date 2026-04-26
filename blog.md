---
layout: default
title: Blog
---

<div class="page">
  <div class="section-header">
    <h2>Blog</h2>
    <p>Artículos, notas de aprendizaje y reflexiones sobre ciberseguridad.</p>
  </div>

  <div class="article-list">
    {% for post in site.posts %}
    <a class="article-row" href="{{ post.url }}">
      <h3>{{ post.title }}</h3>
      <p>{{ post.excerpt | strip_html | truncate: 120 }}</p>
      <div class="article-meta">
        <span>{{ post.date | date: "%b %Y" }}</span>
        {% if post.tags %}
        <span class="sep"></span>
        {% for tag in post.tags %}
        <span class="tag">{{ tag }}</span>
        {% endfor %}
        {% endif %}
      </div>
    </a>
    {% endfor %}
  </div>
</div>