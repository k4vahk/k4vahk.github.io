---
layout: default
title: Writeups
---

<div class="page">
  <div class="section-header">
    <h2>Writeups</h2>
    <p>Soluciones documentadas de CTFs, HackTheBox, TryHackMe y otros labs.</p>
  </div>

  <div class="filter-bar">
    <button class="filter-btn active" data-filter="all">Todos</button>
    <div class="filter-separator"></div>
    <button class="filter-btn f-very-easy" data-filter="very-easy">Very Easy</button>
    <button class="filter-btn f-easy" data-filter="easy">Easy</button>
    <button class="filter-btn f-med"  data-filter="medium">Medium</button>
    <button class="filter-btn f-hard" data-filter="hard">Hard</button>
    <button class="filter-btn f-insane" data-filter="insane">Insane</button>
    <div class="filter-separator"></div>
    <button class="filter-btn f-htb" data-filter="HackTheBox">HackTheBox</button>
    <button class="filter-btn f-thm" data-filter="TryHackMe">TryHackMe</button>
    <button class="filter-btn f-docker" data-filter="DockerLabs">DockerLabs</button>
  </div>

  <div class="writeup-list">
    {% for writeup in site.writeups reversed %}
    <a class="writeup-row" href="{{ writeup.url }}"
       data-diff="{{ writeup.difficulty }}"
       data-platform="{{ writeup.platform }}">
      <div>
        <div class="writeup-title">{{ writeup.title }}</div>
        <div class="writeup-subtitle">{{ writeup.description }}</div>
      </div>
      <span class="writeup-meta">{{ writeup.platform }}</span>
      <span class="difficulty diff-{{ writeup.difficulty }}">{{ writeup.difficulty | replace: '-', ' ' | capitalize }}</span>
    </a>
    {% endfor %}
  </div>
  <div class="no-results" id="no-results">No hay writeups con ese filtro</div>
</div>