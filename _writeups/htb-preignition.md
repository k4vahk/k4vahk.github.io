---
layout: post
title: HTB — Preignition
date: 2026-05-31
platform: HackTheBox
difficulty: very-easy
description: Panel de admin expuesto con credenciales por defecto
tags:
  - HTTP
  - Linux
---

## Introducción

Preignition introduce el flujo de trabajo más común en pentesting web: **encontrar lo que no está enlazado**. Un servidor web puede tener decenas de rutas, paneles de administración y archivos que no aparecen en el sitio principal pero que siguen siendo accesibles si sabes pedirlos.

La técnica se llama **directory brute forcing** o fuzzing de directorios. Consiste en probar una lista de rutas comunes contra el servidor y ver cuáles responden. En esta máquina, una de esas rutas es un panel de administración con credenciales por defecto.

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
80/tcp open  http
```

Un solo puerto. Toda la superficie de ataque está en el servicio web.

Escaneo de versiones y scripts:

```bash
nmap -sCV -p80 10.129.x.x -oN target
# -sC      Ejecuta scripts de detección por defecto (NSE)
# -sV      Detecta versión del servicio
# -p80     Escanea solo el puerto 80
# -oN      Guarda el output en formato Normal (legible)
```

Output relevante:

```
PORT   STATE SERVICE VERSION
80/tcp open  http    nginx 1.14.2
|_http-title: Welcome to nginx!
|_http-server-header: nginx/1.14.2
```

**nginx 1.14.2** corriendo en Linux. El título `Welcome to nginx!` confirma que es la página por defecto del servidor — no hay aplicación web visible en la raíz.

---

## Enumeración web

Visito `http://10.129.x.x` en el navegador. Página por defecto de nginx. Nada útil a simple vista.

Lanzo `gobuster` para descubrir rutas ocultas:

```bash
gobuster dir -u http://10.129.x.x -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt -o gobuster.txt
# dir        Modo de enumeración de directorios
# -u         URL objetivo
# -w         Wordlist — lista de rutas a probar
# -x         Extensiones a probar además de la ruta base
# -o         Guarda el output en un archivo
```

Output relevante:

```
/admin.php  (Status: 200) [Size: 999]
```

`/admin.php` responde con código **200** — existe y es accesible.

---

## Explotación

Visito `http://10.129.x.x/admin.php`. Aparece un formulario de login.

Pruebo credenciales por defecto: `admin` / `admin`.

```
Login successful.
```

Acceso concedido.

---

## Flag

Dentro del panel, la flag aparece directamente en la página:

```
6483bee07c1c1d57f14e5b0717503c73
```

---

## ¿Qué aprendemos de esto?

**Los paneles de administración no deberían ser públicos.** `/admin.php` respondía sin ningún tipo de restricción de IP, sin rate limiting, sin nada. En un entorno real, este panel debería estar detrás de VPN o restringido a IPs internas.

**Las credenciales por defecto siguen siendo un problema real.** `admin/admin` funciona en más sistemas de los que debería. CMS, routers, cámaras IP, paneles de control de hosting — todos vienen con credenciales conocidas que muchos administradores nunca cambian.

**El fuzzing de directorios es una habilidad fundamental.** La página principal no mostraba nada, pero el servidor tenía rutas activas. Este patrón — superficie oculta que el servidor sirve sin anunciar — aparece en prácticamente todas las máquinas web de HTB.

---

## Resumen técnico

| Elemento | Detalle |
|----------|---------|
| Puerto | 80/tcp (HTTP — nginx 1.14.2) |
| Vulnerabilidad | Panel de admin expuesto (`/admin.php`) con credenciales por defecto |
| Acceso obtenido | Administrador web |
| Herramientas | `nmap`, `gobuster` |
| Mitigación | Restringir acceso al panel por IP, cambiar credenciales por defecto, implementar rate limiting y bloqueo por intentos fallidos |
