---
layout: default
title: Inicio
---

<div class="page">
  <div class="hero-tag">Disponible para oportunidades</div>
  <h1>Hola, soy<br><em>Angel Kavanagh</em></h1>
  <p class="hero-desc">Aprendiz de ciberseguridad apasionado por el hacking ético, CTFs y la seguridad ofensiva. Documentando mi camino mientras aprendo.</p>

  <div class="hero-links">
    <a class="btn btn-primary" href="/portfolio/">Ver proyectos →</a>
    <a class="btn btn-ghost" href="/writeups/">Writeups</a>
    <a class="btn btn-ghost" href="https://github.com/k4vahk" target="_blank">GitHub ↗</a>
    <a class="btn btn-ghost" href="https://linkedin.com/in/k4vahk" target="_blank">LinkedIn ↗</a>
  </div>

  <div class="hero-stats">
    <div class="stat-cell">
      <div class="stat-num">{{ site.writeups | size }}</div>
      <div class="stat-label">Writeups</div>
    </div>
    <div class="stat-cell">
      <div class="stat-num">{{ site.posts | size }}</div>
      <div class="stat-label">Artículos</div>
    </div>
    <div class="stat-cell">
      <div class="stat-num">{{ site.portfolio | size }}</div>
      <div class="stat-label">Proyectos</div>
    </div>
  </div>
</div>