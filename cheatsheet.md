---
layout: default
title: CheetSheet
---

<div class="page">
  <div class="section-header">
    <h2>Referencia de puertos</h2>
    <p>Selecciona los puertos que encontraste en tu escaneo para ver servicios, vulnerabilidades y comandos útiles.</p>
  </div>
</div>

<style>
  .pt-wrap { font-family: var(--sans); padding: 0 2rem 4rem; max-width: 780px; margin: 0 auto; }
  .pt-top { display: flex; gap: 10px; margin-bottom: 1rem; align-items: center; }
  .pt-search {
    flex: 1;
    background: var(--surface2);
    border: 1px solid var(--border-strong);
    border-radius: 6px;
    padding: 0.4rem 0.85rem;
    font-size: 13px;
    color: var(--text);
    font-family: var(--sans);
    outline: none;
  }
  .pt-search::placeholder { color: var(--text-dim); }
  .pt-search:focus { border-color: rgba(255,255,255,0.25); }
  .pt-clear-btn {
    font-family: var(--mono);
    font-size: 12px;
    padding: 4px 14px;
    border-radius: 20px;
    border: 1px solid var(--border-strong);
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .pt-clear-btn:hover { background: var(--surface2); color: var(--text); }

  .pt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 8px; margin-bottom: 1.5rem; }
  .pt-btn {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 10px 8px;
    cursor: pointer;
    text-align: center;
    transition: border-color 0.15s, background 0.15s;
  }
  .pt-btn:hover { border-color: var(--border-strong); background: var(--surface2); }
  .pt-btn.selected { border: 2px solid #378ADD; background: #0c1f35; }
  .pt-btn .pnum { font-size: 15px; font-weight: 500; color: var(--text); display: block; font-family: var(--mono); }
  .pt-btn .pname { font-size: 11px; color: var(--text-muted); display: block; margin-top: 2px; }
  .pt-btn.selected .pnum { color: #60a5fa; }
  .pt-btn.selected .pname { color: #60a5fa; }
  .pt-btn.hidden { display: none; }

  .pt-divider { border: none; border-top: 1px solid var(--border); margin: 0.5rem 0 1.5rem; }

  .pt-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: 12px;
    overflow: hidden;
  }
  .pt-card-header {
    display: flex; align-items: center; gap: 12px;
    padding: 1rem 1.1rem;
    border-bottom: 1px solid var(--border);
  }
  .pt-badge {
    font-size: 15px; font-weight: 500;
    color: #60a5fa; background: #0c1f35;
    border-radius: var(--radius-sm);
    padding: 5px 12px; min-width: 58px;
    text-align: center; flex-shrink: 0;
    font-family: var(--mono);
  }
  .pt-card-header h3 { font-size: 15px; font-weight: 500; color: var(--text); margin: 0 0 3px; flex: 1; }
  .pt-card-header p { font-size: 13px; color: var(--text-muted); margin: 0; }
  .pt-proto {
    font-size: 11px; color: var(--text-dim);
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 4px; padding: 3px 8px; flex-shrink: 0;
    font-family: var(--mono);
  }
  .pt-remove {
    background: none; border: none; cursor: pointer;
    color: var(--text-dim); font-size: 18px;
    padding: 0 0 0 8px; line-height: 1; flex-shrink: 0;
    transition: color 0.15s;
  }
  .pt-remove:hover { color: #f87171; }

  .pt-body { padding: 1rem 1.1rem; }
  .pt-sections { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .pt-section { background: var(--surface2); border-radius: var(--radius-sm); padding: 0.75rem 0.9rem; }
  .pt-section h4 {
    font-size: 10px; font-weight: 500; color: var(--text-dim);
    text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 8px;
    font-family: var(--mono);
  }
  .pt-section ul { list-style: none; margin: 0; padding: 0; }
  .pt-section ul li {
    font-size: 13px; color: var(--text-muted); padding: 2px 0;
    display: flex; gap: 6px; align-items: flex-start;
  }
  .pt-section ul li::before { content: '·'; color: var(--text-dim); flex-shrink: 0; }
  .pt-full { grid-column: 1 / -1; }
  .pt-cmd {
    font-family: var(--mono); font-size: 12px;
    background: var(--surface); padding: 2px 7px;
    border-radius: 4px; border: 1px solid var(--border);
    display: inline-block; margin: 2px 0; color: #c084fc;
  }
  .pt-tag-vuln {
    display: inline-block; font-size: 11px; padding: 1px 7px;
    border-radius: 4px; background: #2b0d0d; color: #f87171;
  }
  .pt-tip {
    grid-column: 1 / -1;
    background: #0c1f35;
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    border-left: 3px solid #378ADD;
    padding: 0.75rem 0.9rem;
    font-size: 13px; color: #60a5fa;
  }
  .pt-tip strong {
    font-weight: 500; display: block; margin-bottom: 3px;
    font-size: 10px; text-transform: uppercase;
    letter-spacing: 0.06em; font-family: var(--mono);
  }
  .pt-empty {
    text-align: center; padding: 2.5rem;
    color: var(--text-dim); font-size: 14px;
    font-family: var(--mono);
  }
</style>

<div class="pt-wrap">
  <div class="pt-top">
    <input class="pt-search" type="text" id="pt-filter" placeholder="Filtrar por puerto o servicio...">
    <button class="pt-clear-btn" id="pt-clear-btn">↺ Limpiar</button>
  </div>
  <div class="pt-grid" id="pt-grid"></div>
  <hr class="pt-divider" id="pt-divider" style="display:none">
  <div id="pt-detail"></div>
</div>

<script>
const PORTS = [
  { port: 21, name: 'FTP', proto: 'TCP', desc: 'Transferencia de archivos. Transmite en texto plano sin cifrado.', services: ['vsftpd', 'ProFTPD', 'FileZilla Server'], vulns: ['Login anónimo habilitado', 'Credenciales por defecto', 'Bounce attack', 'FTP sin TLS (sniffing)'], tools: ['nmap -sV -p21', 'ftp ip', 'hydra -l user -P pass.txt ftp://ip', 'metasploit: ftp_login'], tip: 'Prueba siempre acceso anónimo: usuario anonymous, contraseña vacía o anonymous@.' },
  { port: 22, name: 'SSH', proto: 'TCP', desc: 'Acceso remoto cifrado a sistemas Linux/Unix.', services: ['OpenSSH', 'Dropbear'], vulns: ['Credenciales débiles', 'Versiones antiguas vulnerables', 'Claves privadas expuestas'], tools: ['nmap -sV -p22', 'hydra -l user -P pass.txt ssh://ip', 'ssh-audit', 'medusa'], tip: 'Si encuentras un id_rsa expuesto, prueba conectarte directamente. chmod 600 id_rsa.' },
  { port: 23, name: 'Telnet', proto: 'TCP', desc: 'Acceso remoto sin cifrado. Presente en dispositivos legacy y CTFs.', services: ['Telnet server', 'BusyBox telnet'], vulns: ['Tráfico en texto plano', 'Credenciales por defecto', 'Sin autenticación en algunos casos'], tools: ['telnet ip 23', 'nmap -sV -p23', 'hydra -l user -P pass.txt telnet://ip'], tip: 'En CTFs, Telnet frecuentemente no tiene contraseña o usa credenciales por defecto como admin/admin.' },
  { port: 25, name: 'SMTP', proto: 'TCP', desc: 'Envío de correo electrónico entre servidores.', services: ['Postfix', 'Sendmail', 'Exim'], vulns: ['Open relay', 'User enumeration (VRFY/EXPN)', 'Email spoofing'], tools: ['nmap -p25 --script smtp-enum-users', 'smtp-user-enum', 'swaks', 'telnet ip 25'], tip: 'Prueba VRFY y EXPN para enumerar usuarios. Un open relay permite enviar correo como cualquiera.' },
  { port: 53, name: 'DNS', proto: 'TCP/UDP', desc: 'Resolución de nombres de dominio. Crítico en reconocimiento.', services: ['BIND', 'dnsmasq', 'Unbound'], vulns: ['Zone transfer (AXFR)', 'DNS cache poisoning', 'Amplification DDoS'], tools: ['dig axfr @ip dominio', 'nmap -sU -p53', 'dnsrecon', 'fierce', 'dnsenum'], tip: 'Intenta un zone transfer: dig axfr @ip dominio. Si funciona, revela todos los subdominios.' },
  { port: 80, name: 'HTTP', proto: 'TCP', desc: 'Tráfico web sin cifrar. Primer puerto a revisar en CTFs.', services: ['Apache', 'Nginx', 'IIS'], vulns: ['SQLi', 'XSS', 'Directory traversal', 'LFI/RFI', 'Credenciales por defecto'], tools: ['gobuster dir -u http://ip -w wordlist', 'nikto -h ip', 'burpsuite', 'ffuf'], tip: 'Siempre haz fuzzing de directorios. Revisa /robots.txt, /.git/, /admin, /backup.' },
  { port: 110, name: 'POP3', proto: 'TCP', desc: 'Descarga de correos desde el servidor. Transmite en texto plano.', services: ['Dovecot', 'Courier'], vulns: ['Credenciales en texto plano', 'Brute force', 'User enumeration'], tools: ['telnet ip 110', 'hydra -l user -P pass.txt pop3://ip', 'nmap -p110'], tip: 'Conéctate con telnet: USER admin → PASS password → LIST para ver mensajes.' },
  { port: 135, name: 'RPC', proto: 'TCP', desc: 'Remote Procedure Call de Microsoft. Comunicación entre servicios Windows.', services: ['Microsoft RPC', 'DCE/RPC'], vulns: ['MS03-026 (RPC DCOM)', 'Enumeración de servicios', 'Relay attacks'], tools: ['nmap -sV -p135', 'rpcclient -U "" ip', 'impacket-rpcdump'], tip: 'rpcclient -U "" ip permite enumerar usuarios y shares sin credenciales en configuraciones débiles.' },
  { port: 139, name: 'NetBIOS', proto: 'TCP', desc: 'Compartición de archivos en redes Windows antiguas.', services: ['Samba', 'Windows File Sharing'], vulns: ['Enumeración de usuarios', 'MS08-067', 'Sesión nula'], tools: ['enum4linux -a ip', 'nbtscan ip', 'nmap --script nbstat', 'smbclient'], tip: 'Usa enum4linux para extraer usuarios, grupos y shares sin credenciales.' },
  { port: 143, name: 'IMAP', proto: 'TCP', desc: 'Acceso a correos en servidor. Más potente que POP3.', services: ['Dovecot', 'Courier', 'Cyrus'], vulns: ['Brute force', 'Credenciales débiles', 'Versiones vulnerables'], tools: ['telnet ip 143', 'hydra -l user -P pass.txt imap://ip', 'nmap -p143'], tip: 'LOGIN usuario pass → SELECT INBOX → FETCH 1 BODY[] para leer el primer correo.' },
  { port: 161, name: 'SNMP', proto: 'UDP', desc: 'Simple Network Management Protocol. Expone información del sistema y dispositivos de red.', services: ['Net-SNMP', 'snmpd'], vulns: ['Community string por defecto (public/private)', 'Enumeración de usuarios y procesos', 'Escritura si community string es write'], tools: ['snmpwalk -v2c -c public ip', 'snmp-check ip', 'nmap -sU -p161 --script snmp-info', 'onesixtyone ip public'], tip: 'snmpwalk -v2c -c public ip revela usuarios, procesos, interfaces y rutas. Prueba también "private" como community string.' },
  { port: 389, name: 'LDAP', proto: 'TCP', desc: 'Lightweight Directory Access Protocol. Directorio de usuarios, grupos y equipos en Active Directory.', services: ['OpenLDAP', 'Microsoft AD'], vulns: ['Consultas anónimas habilitadas', 'Enumeración de usuarios y grupos', 'Password spray'], tools: ['ldapsearch -x -H ldap://ip -b "dc=dominio,dc=com"', 'nmap -p389 --script ldap-search', 'enum4linux -a ip', 'bloodhound'], tip: 'ldapsearch -x -H ldap://ip -b "dc=dominio,dc=com" lista todos los objetos si las consultas anónimas están habilitadas.' },
  { port: 443, name: 'HTTPS', proto: 'TCP', desc: 'HTTP sobre TLS/SSL. Los certificados pueden revelar subdominios.', services: ['Apache', 'Nginx', 'IIS'], vulns: ['SQLi', 'XSS', 'Heartbleed', 'Certificados expirados'], tools: ['gobuster dir -u https://ip -w wordlist', 'sslscan ip', 'nikto -h https://ip', 'burpsuite'], tip: 'Revisa el certificado SSL: puede contener subdominios en el campo CN o SAN.' },
  { port: 445, name: 'SMB', proto: 'TCP', desc: 'Compartición de archivos en Windows. Objetivo frecuente en CTFs.', services: ['Samba', 'Windows SMB'], vulns: ['EternalBlue (MS17-010)', 'Pass-the-hash', 'Shares sin auth', 'PrintNightmare'], tools: ['smbclient -L //ip', 'smbmap -H ip', 'crackmapexec smb ip', 'metasploit: ms17_010'], tip: 'smbclient -L //ip -N lista shares sin contraseña. Busca shares con acceso de lectura/escritura.' },
  { port: 636, name: 'LDAPS', proto: 'TCP', desc: 'LDAP sobre SSL. Versión cifrada de LDAP para Active Directory.', services: ['OpenLDAP', 'Microsoft AD'], vulns: ['Enumeración de usuarios', 'Certificados autofirmados', 'Password spray'], tools: ['ldapsearch -x -H ldaps://ip -b "dc=dominio,dc=com"', 'nmap -p636', 'bloodhound'], tip: 'Igual que LDAP pero cifrado. Si LDAP (389) está bloqueado, prueba LDAPS (636).' },
  { port: 873, name: 'Rsync', proto: 'TCP', desc: 'Sincronización de archivos entre sistemas. Frecuentemente sin autenticación.', services: ['rsync daemon'], vulns: ['Acceso sin autenticación', 'Lectura/escritura de archivos sensibles', 'Escalación via authorized_keys'], tools: ['rsync rsync://ip/', 'rsync rsync://ip/share /', 'nmap -p873 --script rsync-list-modules'], tip: 'rsync rsync://ip/ lista los módulos disponibles. Si hay acceso de escritura, planta una SSH key en /root/.ssh/.' },
  { port: 1433, name: 'MSSQL', proto: 'TCP', desc: 'Microsoft SQL Server. Puede permitir ejecución de comandos del sistema.', services: ['Microsoft SQL Server'], vulns: ['Credenciales sa por defecto', 'xp_cmdshell (RCE)', 'Linked servers'], tools: ['nmap -p1433 --script ms-sql-info', 'impacket-mssqlclient', 'sqsh'], tip: 'Si accedes como sa, activa xp_cmdshell para ejecutar comandos del sistema operativo.' },
  { port: 1521, name: 'Oracle DB', proto: 'TCP', desc: 'Base de datos empresarial de Oracle.', services: ['Oracle Database'], vulns: ['Credenciales por defecto', 'TNS Poison', 'Privilege escalation'], tools: ['nmap -p1521', 'odat', 'sqlplus', 'hydra -l user -P pass.txt oracle://ip'], tip: 'Prueba credenciales por defecto: scott/tiger, sys/change_on_install, system/manager.' },
  { port: 2049, name: 'NFS', proto: 'TCP/UDP', desc: 'Compartición de archivos en sistemas Unix/Linux.', services: ['NFS server', 'rpcbind'], vulns: ['Shares sin autenticación', 'Escalación montando /root', 'Symlink attacks'], tools: ['showmount -e ip', 'mount -t nfs ip:/share /mnt', 'nmap -p2049'], tip: 'showmount -e ip muestra los shares. Móntalos y busca archivos sensibles como SSH keys.' },
  { port: 2121, name: 'FTP-Alt', proto: 'TCP', desc: 'Puerto FTP alternativo. Mismo protocolo que el 21 pero en puerto no estándar.', services: ['vsftpd', 'ProFTPD', 'pyftpdlib'], vulns: ['Login anónimo', 'Credenciales por defecto', 'Versiones vulnerables'], tools: ['ftp ip 2121', 'nmap -sV -p2121', 'hydra -l user -P pass.txt -s 2121 ftp://ip'], tip: 'Mismo enfoque que FTP en puerto 21. Prueba acceso anónimo primero.' },
  { port: 3306, name: 'MySQL', proto: 'TCP', desc: 'Base de datos relacional muy común en aplicaciones web.', services: ['MySQL', 'MariaDB'], vulns: ['Credenciales débiles', 'UDF injection (RCE)', 'Acceso remoto habilitado'], tools: ['mysql -h ip -u root -p', 'nmap -p3306 --script mysql-info', 'hydra -l root -P pass.txt mysql://ip'], tip: 'Prueba root sin contraseña: mysql -h ip -u root. Busca credenciales en las bases de datos.' },
  { port: 3389, name: 'RDP', proto: 'TCP', desc: 'Escritorio remoto de Windows. Acceso gráfico completo al sistema.', services: ['Windows RDP', 'xrdp'], vulns: ['BlueKeep (CVE-2019-0708)', 'Credenciales débiles', 'DejaBlue', 'Pass-the-hash'], tools: ['xfreerdp /u:user /p:pass /v:ip', 'rdesktop ip', 'hydra -l user -P pass.txt rdp://ip'], tip: 'Busca credenciales en otros servicios y pruébalas en RDP. Da acceso completo al escritorio.' },
  { port: 4444, name: 'Metasploit', proto: 'TCP', desc: 'Puerto por defecto del listener de Metasploit para reverse shells.', services: ['Metasploit handler', 'nc listener'], vulns: ['Listener expuesto accidentalmente', 'Backdoor activa'], tools: ['nc -lvnp 4444', 'msfconsole: use multi/handler', 'nmap -sV -p4444'], tip: 'Si está abierto en un CTF puede indicar que hay un listener activo o un servicio custom. Conéctate con nc ip 4444.' },
  { port: 5432, name: 'PostgreSQL', proto: 'TCP', desc: 'Base de datos relacional de código abierto muy potente.', services: ['PostgreSQL'], vulns: ['Credenciales débiles', 'COPY TO/FROM (RCE)', 'Extensiones maliciosas'], tools: ['psql -h ip -U postgres', 'nmap -p5432', 'hydra -l postgres -P pass.txt postgres://ip'], tip: 'Prueba postgres/postgres. COPY TO PROGRAM permite ejecución de comandos del sistema.' },
  { port: 5985, name: 'WinRM', proto: 'TCP', desc: 'Windows Remote Management. Ejecución remota de comandos PowerShell.', services: ['WinRM', 'WSMan'], vulns: ['Credenciales débiles', 'Pass-the-hash'], tools: ['evil-winrm -i ip -u user -p pass', 'crackmapexec winrm ip -u user -p pass'], tip: 'evil-winrm es la herramienta estándar para obtener una shell PowerShell con credenciales válidas.' },
  { port: 6379, name: 'Redis', proto: 'TCP', desc: 'Base de datos en memoria. Frecuentemente sin autenticación.', services: ['Redis'], vulns: ['Sin autenticación', 'Escritura de archivos arbitrarios', 'RCE via cron/SSH'], tools: ['redis-cli -h ip', 'redis-cli -h ip CONFIG GET *', 'nmap -p6379'], tip: 'CONFIG SET dir /root/.ssh → SET x "ssh-rsa ..." → SAVE para plantar una SSH key.' },
  { port: 8080, name: 'HTTP-Alt', proto: 'TCP', desc: 'Puerto HTTP alternativo. Servidores de desarrollo, proxies y apps Java.', services: ['Tomcat', 'JBoss', 'Jenkins', 'Jetty'], vulns: ['Credenciales por defecto en Tomcat', 'WAR malicioso', 'Panel admin expuesto'], tools: ['gobuster dir -u http://ip:8080 -w wordlist', 'nikto -h ip:8080', 'burpsuite'], tip: 'Tomcat /manager/html: prueba tomcat/tomcat, admin/admin. Si entras, sube un WAR con reverse shell.' },
  { port: 8443, name: 'HTTPS-Alt', proto: 'TCP', desc: 'Puerto HTTPS alternativo. Paneles de administración y Tomcat SSL.', services: ['Tomcat SSL', 'Nginx', 'Paneles admin'], vulns: ['Credenciales por defecto', 'Certificados autofirmados', 'Misma superficie que HTTPS'], tools: ['gobuster dir -u https://ip:8443 -w wordlist', 'sslscan ip:8443', 'nikto -h https://ip:8443'], tip: 'Revisa el certificado y haz fuzzing de directorios. Paneles admin como pfSense, VMware usan este puerto.' },
  { port: 9200, name: 'Elasticsearch', proto: 'TCP', desc: 'Motor de búsqueda y análisis. Sin autenticación por defecto en versiones antiguas.', services: ['Elasticsearch'], vulns: ['Sin autenticación', 'Exposición masiva de datos', 'RCE via script groovy (versiones antiguas)'], tools: ['curl http://ip:9200', 'curl http://ip:9200/_cat/indices', 'nmap -p9200'], tip: 'curl http://ip:9200/_cat/indices lista todos los índices. curl http://ip:9200/indice/_search muestra los datos.' },
  { port: 11211, name: 'Memcached', proto: 'TCP/UDP', desc: 'Sistema de caché en memoria. Sin autenticación por defecto.', services: ['Memcached'], vulns: ['Sin autenticación', 'Lectura de datos en caché', 'Amplification DDoS (UDP)'], tools: ['nc ip 11211', 'nmap -p11211 --script memcached-info', 'echo "stats" | nc ip 11211'], tip: 'echo "stats items" | nc ip 11211 lista los items en caché. Puede contener sesiones, tokens o contraseñas.' },
  { port: 27017, name: 'MongoDB', proto: 'TCP', desc: 'Base de datos NoSQL de documentos JSON.', services: ['MongoDB'], vulns: ['Sin autenticación por defecto', 'Exposición a internet', 'NoSQL injection'], tools: ['mongosh ip', 'mongo ip', 'nmap -p27017'], tip: 'mongosh ip sin credenciales. show dbs → use db → db.users.find() para ver todos los datos.' },
];

let selected = [];

function renderGrid() {
  const q = document.getElementById('pt-filter').value.toLowerCase();
  const grid = document.getElementById('pt-grid');
  grid.innerHTML = PORTS.map(p => {
    const isSelected = selected.includes(p.port);
    const isVisible = !q || p.port.toString().includes(q) || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
    return '<button class="pt-btn ' + (isSelected ? 'selected' : '') + ' ' + (isVisible ? '' : 'hidden') + '" onclick="togglePort(' + p.port + ')">' +
      '<span class="pnum">' + p.port + '</span>' +
      '<span class="pname">' + p.name + '</span>' +
      '</button>';
  }).join('');
}

function renderDetail() {
  const el = document.getElementById('pt-detail');
  const divider = document.getElementById('pt-divider');
  if (selected.length === 0) {
    el.innerHTML = '<div class="pt-empty">Selecciona uno o más puertos para ver su información</div>';
    divider.style.display = 'none';
    return;
  }
  divider.style.display = 'block';
  el.innerHTML = selected.map(function(port) {
    const p = PORTS.find(function(x) { return x.port === port; });
    return '<div class="pt-card">' +
      '<div class="pt-card-header">' +
        '<div class="pt-badge">' + p.port + '</div>' +
        '<div style="flex:1">' +
          '<h3>' + p.name + ' <span style="font-size:12px;font-weight:400;color:var(--text-muted)">' + p.proto + '</span></h3>' +
          '<p>' + p.desc + '</p>' +
        '</div>' +
        '<button class="pt-remove" onclick="removePort(' + p.port + ')" aria-label="Quitar">✕</button>' +
      '</div>' +
      '<div class="pt-body">' +
        '<div class="pt-sections">' +
          '<div class="pt-section">' +
            '<h4>Servicios</h4>' +
            '<ul>' + p.services.map(function(s) { return '<li>' + s + '</li>'; }).join('') + '</ul>' +
          '</div>' +
          '<div class="pt-section">' +
            '<h4>Vulnerabilidades</h4>' +
            '<ul>' + p.vulns.map(function(v) { return '<li><span class="pt-tag-vuln">' + v + '</span></li>'; }).join('') + '</ul>' +
          '</div>' +
          '<div class="pt-section pt-full">' +
            '<h4>Herramientas y comandos</h4>' +
            '<ul>' + p.tools.map(function(t) { return '<li><span class="pt-cmd">' + t + '</span></li>'; }).join('') + '</ul>' +
          '</div>' +
          '<div class="pt-tip">' +
            '<strong>Tip</strong>' +
            p.tip +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function togglePort(port) {
  const idx = selected.indexOf(port);
  if (idx >= 0) selected.splice(idx, 1);
  else selected.push(port);
  renderGrid();
  renderDetail();
}

function removePort(port) {
  selected = selected.filter(function(p) { return p !== port; });
  renderGrid();
  renderDetail();
}

document.getElementById('pt-filter').addEventListener('input', renderGrid);
document.getElementById('pt-clear-btn').addEventListener('click', function() {
  selected = [];
  document.getElementById('pt-filter').value = '';
  renderGrid();
  renderDetail();
});

renderGrid();
renderDetail();
</script>