# Docker Deployment Anleitung

## Voraussetzungen auf dem Hetzner Cloud Server

- Docker installiert
- Docker Compose installiert
- NGINX Reverse Proxy läuft bereits als Container
- SSH-Zugriff auf den Server

## Deployment-Schritte

### 1. Code auf den Server übertragen

**Option A: Per Git (empfohlen)**
```bash
# Auf dem Server
git clone <dein-repository-url>
cd Fagus-Frontend
```

**Option B: Per SCP/SFTP**
```bash
# Von deinem lokalen Computer
scp -r . user@dein-server:/pfad/zum/deployment/
```

### 2. Docker Image bauen und Container starten

```bash
# Im Projekt-Verzeichnis auf dem Server
docker-compose up -d --build
```

Das war's! Der Container läuft nun auf Port 3000.

### 3. NGINX Reverse Proxy konfigurieren

Da du bereits NGINX als Docker-Container hast, musst du eine neue Server-Konfiguration hinzufügen:

**Beispiel NGINX-Konfiguration:**
```nginx
server {
    listen 80;
    server_name deine-domain.de www.deine-domain.de;

    location / {
        proxy_pass http://fagus-frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Wichtig:** Stelle sicher, dass dein NGINX-Container im selben Docker-Netzwerk ist wie der fagus-frontend Container, oder verwende `host.docker.internal:3000` bzw. die Server-IP.

### 4. SSL/HTTPS mit Let's Encrypt (optional)

Wenn du HTTPS einrichten möchtest:

```bash
# Certbot im NGINX-Container oder separat ausführen
certbot --nginx -d deine-domain.de -d www.deine-domain.de
```

## Nützliche Docker-Befehle

```bash
# Container-Logs ansehen
docker-compose logs -f

# Container neustarten
docker-compose restart

# Container stoppen
docker-compose down

# Container stoppen und Images löschen
docker-compose down --rmi all

# In den Container einsteigen (für Debugging)
docker exec -it fagus-frontend sh

# Container-Status prüfen
docker-compose ps
```

## Updates deployen

```bash
# Code aktualisieren (wenn per Git)
git pull

# Container neu bauen und starten
docker-compose up -d --build
```

## Umgebungsvariablen

Falls deine App Environment-Variablen benötigt, erstelle eine `.env.production` Datei:

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.deine-domain.de
# Weitere Variablen...
```

Dann aktiviere in der [docker-compose.yml](docker-compose.yml) die auskommentierte `env_file` Zeile.

## Troubleshooting

**Container startet nicht:**
```bash
docker-compose logs fagus-frontend
```

**Port-Konflikt:**
Ändere in der [docker-compose.yml](docker-compose.yml) den Port:
```yaml
ports:
  - "3001:3000"  # Externer Port:Interner Port
```

**NGINX kann Container nicht erreichen:**
- Prüfe, ob beide Container im selben Netzwerk sind
- Verwende den Container-Namen als Hostname: `http://fagus-frontend:3000`
- Oder verbinde den NGINX-Container mit dem fagus-network:
  ```bash
  docker network connect fagus-network dein-nginx-container
  ```

## Production Checklist

- [ ] Environment-Variablen gesetzt
- [ ] NGINX Reverse Proxy konfiguriert
- [ ] SSL-Zertifikat installiert
- [ ] Firewall-Regeln geprüft (Port 80/443 offen)
- [ ] Container-Logs geprüft
- [ ] Webseite im Browser getestet
- [ ] Health-Check eingerichtet (optional)

## Monitoring (optional)

Container-Ressourcen überwachen:
```bash
docker stats fagus-frontend
```
