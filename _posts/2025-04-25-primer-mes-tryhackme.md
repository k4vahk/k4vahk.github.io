---
layout: post
title: "Mi primer mes en TryHackMe: lo que aprendí"
date: 2025-04-25
tags: [aprendizaje, ctf, tryhackme]
---

Después de un mes usando TryHackMe, esto es lo que aprendí sobre reconocimiento y escaneo de puertos.

## Herramientas que usé

- `nmap` para escaneo de puertos
- `gobuster` para fuzzing de directorios
- `netcat` para reverse shells

## Ejemplo de escaneo básico

```bash
nmap -sV -sC -oN scan.txt 10.10.10.1
```

## Conclusión

El módulo de **Pre-Security** es el mejor punto de partida si vienes de cero.