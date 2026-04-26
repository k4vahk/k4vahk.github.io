---
layout: default
title: Portafolio
---

<div class="page">
  <div class="section-header">
    <h2>Portafolio</h2>
    <p>Proyectos, herramientas y labs que he desarrollado o completado.</p>
  </div>

  <div class="card-grid">
    {% for project in site.portfolio %}
    <div class="card">
      <div class="card-top">
        <div>
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
        </div>
        {% if project.link %}
        <a class="card-link" href="{{ project.link }}" target="_blank">Ver →</a>
        {% endif %}
      </div>
      {% if project.image %}
      <img class="card-img" src="{{ project.image }}" alt="{{ project.title }}">
      {% endif %}
      <div class="tags">
        {% for tag in project.tags %}
        <span class="tag">{{ tag }}</span>
        {% endfor %}
        {% if project.status %}
        <span class="tag tag-accent">{{ project.status }}</span>
        {% endif %}
      </div>
    </div>
    {% endfor %}
  </div>
</div>