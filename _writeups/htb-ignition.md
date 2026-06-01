---
layout: post
title: HTB — Ignition
date: 2026-04-26
platform: HackTheBox
difficulty: very-easy
description: Panel de admin Magento con credenciales por defecto
tags:
  - Magento
  - Linux
---

## Introducción

Ignition presenta un CMS empresarial — **Magento** — con el panel de administración accesible y protegido únicamente por credenciales por defecto. El reto está en encontrar el panel (no está enlazado desde el sitio) y conocer las convenciones de contraseñas de Magento, que requieren mayúsculas y números.

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
80/tcp open  http
```

Escaneo de versiones y scripts:

```bash
nmap -sCV -p80 10.129.x.x -oN target
# -sC      Ejecuta scripts de detección por defecto (NSE)
# -sV      Detecta versión del servicio
# -p80     Escanea solo el puerto 80
# -oN      Guarda el output en formato Normal (legible)
```

Output relevante:

```
PORT   STATE SERVICE VERSION
80/tcp open  http    nginx 1.14.2
|_http-title: Did not follow redirect to http://ignition.htb/
```

Agrego el hostname al hosts:

```bash
echo "10.129.x.x  ignition.htb" >> /etc/hosts
```

---

## Enumeración web

Visito `http://ignition.htb` — tienda Magento con el logo "LUMA". El footer confirma: `Copyright © 2013-present Magento, Inc.`

El sitio es una tienda front-end. El objetivo es el panel de administración. Enumero directorios:

```bash
gobuster dir -u http://ignition.htb -w /usr/share/wordlists/seclists/Discovery/Web-Content/common.txt
# dir      Modo enumeración de directorios
# -u       URL objetivo
# -w       Wordlist de rutas a probar
```

Output relevante:

```
/admin    (Status: 200) [Size: 7095]
```

---

## Explotación

Visito `http://ignition.htb/admin` — panel de login de Magento Admin.

Magento requiere contraseñas con mayúsculas y números. Pruebo credenciales comunes adaptadas a ese formato:

```
admin / admin123    → fallo
admin / Admin1234   → fallo
admin / qwerty123   → éxito
```

```
Welcome, Administrator!
```

Acceso al panel de administración de Magento.

---

## Flag

Dentro del panel, la flag aparece en el dashboard:

```
797d6c988d9dc5865e010b9410f247e0
```

---

## ¿Qué aprendemos de esto?

**Los CMS empresariales también tienen credenciales por defecto.** Magento, WordPress, Joomla, Drupal — todos vienen con usuarios administradores que deben configurarse correctamente antes de exponer el sistema.

**Las políticas de contraseñas no son suficientes por sí solas.** Magento exige mayúsculas y números, pero `qwerty123` cumple esos requisitos y es extremadamente débil. Una política de contraseñas sin educación al usuario y sin verificación de contraseñas comunes es ineficaz.

**Gobuster encuentra lo que el sitio no enlaza.** `/admin` no aparecía en ningún menú ni enlace del sitio — solo el fuzzing de directorios lo reveló. Siempre enumerar antes de asumir que no hay nada.

---

## Nota sobre ffuf vs gobuster

Durante la resolución se identificó una diferencia importante entre ambas herramientas:

```bash
# Sintaxis CORRECTA en ffuf para múltiples extensiones:
ffuf -u http://ignition.htb/FUZZ -w wordlist.txt -e .txt,.php,.html

# Sintaxis INCORRECTA (slash en lugar de coma):
ffuf -u http://ignition.htb/FUZZ -w wordlist.txt -e .txt/.php/.html
```

Usar `/` en lugar de `,` hace que ffuf interprete mal las extensiones y pierda resultados.

---

## Resumen técnico

| Elemento | Detalle |
|----------|---------|
| Puerto | 80/tcp (nginx 1.14.2) |
| CMS | Magento |
| Vulnerabilidad | Panel de admin accesible con credenciales por defecto |
| Credenciales | `admin / qwerty123` |
| Acceso obtenido | Administrador de Magento |
| Herramientas | `nmap`, `gobuster` |
| Mitigación | Cambiar credenciales por defecto, restringir acceso al panel por IP, implementar 2FA, usar contraseñas robustas verificadas contra listas de contraseñas comunes |
