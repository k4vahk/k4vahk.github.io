---
layout: post
title: HTB — Synced
date: 2026-05-31
platform: HackTheBox
difficulty: very-easy
description: Rsync con módulos accesibles sin autenticación
tags:
  - Rsync
  - Linux
---

## Introducción

Synced presenta un servicio que muchos administradores de sistemas Linux conocen bien pero pocos piensan en asegurar: **rsync**. Es una herramienta diseñada para sincronizar archivos entre máquinas de forma eficiente, muy usada para backups y despliegues. El problema surge cuando sus módulos quedan expuestos sin autenticación — cualquiera puede listar y descargar el contenido como si fuera su propio disco duro.

El patrón es el mismo que hemos visto en Fawn (FTP), Dancing (SMB) y Mongod (MongoDB): un servicio de transferencia de datos mal configurado que no pide credenciales.

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
PORT    STATE SERVICE
873/tcp open  rsync
```

Un solo puerto. **873**, el puerto estándar de rsync.

Escaneo de versiones y scripts:

```bash
nmap -sCV -p873 10.129.x.x -oN target
# -sC      Ejecuta scripts de detección por defecto (NSE)
# -sV      Detecta versión del servicio
# -p873    Escanea solo el puerto 873
# -oN      Guarda el output en formato Normal (legible)
```

Output relevante:

```
PORT    STATE SERVICE VERSION
873/tcp open  rsync   (protocol version 31)
```

---

## Enumeración

En rsync, un **módulo** es un directorio compartido. Listo los módulos disponibles sin autenticación:

```bash
rsync --list-only rsync://10.129.x.x/
# --list-only          Solo lista, no descarga nada
# rsync://IP/          Protocolo rsync apuntando a la raíz del servidor
```

Output:

```
public         	Anonymous Share
```

Listo el contenido del módulo `public`:

```bash
rsync --list-only rsync://10.129.x.x/public
# rsync://IP/módulo    Apunta al módulo específico para listar su contenido
```

Output:

```
drwxr-xr-x          4,096 2022/10/24 22:02:23 .
-rw-r--r--             33 2022/10/24 21:32:03 flag.txt
```

---

## Explotación

Descargo la flag directamente:

```bash
rsync rsync://10.129.x.x/public/flag.txt .
# rsync://IP/módulo/archivo    Ruta completa al archivo remoto
# .                            Destino: directorio actual
```

Sin solicitud de contraseña.

```bash
cat flag.txt
# 72eaf5344ebb84908ae543a719830519
```

---

## ¿Qué aprendemos de esto?

**rsync fue diseñado para redes internas de confianza.** Cuando se expone al exterior sin autenticación, se convierte en un servidor de archivos público que cualquiera puede explorar y descargar.

**Los módulos anónimos son una decisión consciente pero peligrosa.** A diferencia de MongoDB que arrancaba sin auth por defecto, rsync requiere configuración activa para permitir acceso anónimo. En entornos de producción esa decisión debería estar muy bien justificada y limitada a archivos verdaderamente públicos.

**El patrón del Tier 0 es claro.** Meow (Telnet), Fawn (FTP), Dancing (SMB), Mongod (MongoDB), Synced (rsync) — todos comparten el mismo vector: servicio expuesto, sin autenticación, acceso directo. La lección no es técnica, es de mentalidad: todo servicio abierto es una pregunta sin responder hasta que lo pruebes.

---

## Comandos esenciales de rsync para CTF

```bash
# Listar módulos disponibles en el servidor
rsync --list-only rsync://IP/

# Listar contenido de un módulo
rsync --list-only rsync://IP/modulo

# Listar contenido de forma recursiva
rsync --list-only -r rsync://IP/modulo

# Descargar un archivo específico
rsync rsync://IP/modulo/archivo.txt .

# Descargar todo el contenido del módulo
rsync -av rsync://IP/modulo ./destino
# -a    Modo archivo: preserva permisos, fechas y estructura
# -v    Verbose: muestra cada archivo transferido
```

---

## Resumen técnico

| Elemento | Detalle |
|----------|---------|
| Puerto | 873/tcp (rsync protocolo v31) |
| Vulnerabilidad | Módulo rsync accesible sin autenticación |
| Acceso obtenido | Descarga directa de archivos del servidor |
| Herramientas | `nmap`, `rsync` |
| Mitigación | Requerir autenticación en todos los módulos, restringir acceso por IP, no exponer rsync a internet, usar SSH como transporte (`rsync -e ssh`) |
