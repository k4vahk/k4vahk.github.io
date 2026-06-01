---
layout: post
title: HTB — Crocodile
date: 2026-05-31
platform: HackTheBox
difficulty: very-easy
description: FTP anónimo + credenciales expuestas + panel de admin
tags:
  - FTP
  - Linux
---

## Introducción

Crocodile combina dos vectores que ya conocemos por separado — FTP anónimo y panel de administración web — pero esta vez hay un paso intermedio: las credenciales para el panel web están almacenadas en archivos accesibles vía FTP. Es la primera máquina donde hay que **encadenar dos servicios** para llegar al objetivo.

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
21/tcp open  ftp
80/tcp open  http
```

Escaneo de versiones y scripts:

```bash
nmap -sCV -p21,80 10.129.x.x -oN target
# -sC       Ejecuta scripts de detección por defecto (NSE)
# -sV       Detecta versión del servicio
# -p21,80   Escanea solo los puertos especificados
# -oN       Guarda el output en formato Normal (legible)
```

Output relevante:

```
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
| ftp-anon: Anonymous FTP login allowed
80/tcp open  http    Apache httpd 2.4.41
|_http-title: Smash - Bootstrap Business Template
```

Dos servicios: FTP con acceso anónimo habilitado y un servidor web Apache.

---

## Enumeración FTP

Me conecto con usuario anónimo:

```bash
ftp 10.129.x.x
# Usuario: anonymous
# Contraseña: (enter)
```

```
230 Login successful.
ftp>
```

Listo el contenido:

```bash
ftp> ls -la
# allowed.userlist
# allowed.userlist.passwd
```

Dos archivos muy interesantes. Los descargo:

```bash
ftp> get allowed.userlist
ftp> get allowed.userlist.passwd
# get    Descarga el archivo al directorio local
```

Reviso su contenido:

```bash
cat allowed.userlist
# aron
# pwnmeow
# egotisticalsw
# admin

cat allowed.userlist.passwd
# root
# Supersecretpassword1
# @BaASD&9032123sADS
# rKXM59ESxesUFHAd
```

Lista de usuarios y sus contraseñas en texto plano. La última entrada `admin / rKXM59ESxesUFHAd` es el candidato para el panel web.

---

## Enumeración web

Visito `http://10.129.x.x` — sitio web corporativo estático. No hay panel de login visible en la raíz.

Enumero directorios:

```bash
gobuster dir -u http://10.129.x.x -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html -o gobuster.txt
# dir      Modo enumeración de directorios
# -u       URL objetivo
# -w       Wordlist de rutas a probar
# -x       Extensiones a probar
# -o       Guarda el output en archivo
```

Output relevante:

```
/login.php   (Status: 200)
```

---

## Explotación

Visito `http://10.129.x.x/login.php` — panel de login. Uso las credenciales encontradas en el FTP:

```
Usuario: admin
Contraseña: rKXM59ESxesUFHAd
```

```
Login successful.
```

Acceso al panel de administración.

---

## Flag

Dentro del panel, la flag aparece en la página:

```
c7110277ac44d78b6a9fff2232434d16
```

---

## ¿Qué aprendemos de esto?

**Nunca almacenar credenciales en archivos accesibles públicamente.** El error crítico aquí no fue tener FTP anónimo — fue almacenar una lista de usuarios y contraseñas en texto plano en un directorio accesible sin autenticación. Un atacante que encuentre esos archivos tiene acceso inmediato a todos los servicios que usen esas credenciales.

**El encadenamiento de vulnerabilidades multiplica el impacto.** FTP anónimo solo da acceso a archivos. Un panel de admin con credenciales por defecto solo requiere adivinar. Juntos, se convierten en acceso garantizado. Esta es la lógica detrás de la mayoría de las intrusiones reales.

**La enumeración web es indispensable.** El panel de login no estaba enlazado desde el sitio principal — solo gobuster lo encontró. Sin fuzzing de directorios, el vector de entrada permanece oculto.

---

## Resumen técnico

| Elemento | Detalle |
|----------|---------|
| Puertos | 21/tcp (FTP), 80/tcp (HTTP) |
| Vulnerabilidad | FTP anónimo con credenciales expuestas + panel de admin |
| Credenciales | `admin / rKXM59ESxesUFHAd` (encontradas en FTP) |
| Acceso obtenido | Panel de administración web |
| Herramientas | `nmap`, `ftp`, `gobuster` |
| Mitigación | Deshabilitar FTP anónimo, nunca almacenar credenciales en texto plano, restringir acceso al panel de admin por IP |
