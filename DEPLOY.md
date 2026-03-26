# Deploy Guide — LUCKY TCG THAILAND

## Prerequisites
- Hostinger VPS (Ubuntu 22/24)
- Domain: luckytcgthailand.com pointed to VPS IP
- GitHub repo: Seedzzzz01/GOODGUYTCG

---

## Step 1: Point Domain to VPS

ใน **Hostinger DNS Zone Editor**:
```
Type    Name    Value           TTL
A       @       YOUR_VPS_IP     3600
A       www     YOUR_VPS_IP     3600
```

รอ DNS propagate 5-30 นาที (เช็คด้วย `ping luckytcgthailand.com`)

---

## Step 2: First-Time VPS Setup

```bash
# SSH เข้า VPS
ssh root@YOUR_VPS_IP

# รัน setup script
curl -fsSL https://raw.githubusercontent.com/Seedzzzz01/GOODGUYTCG/main/scripts/vps-setup.sh | bash
```

Script จะ:
1. อัพเดต Ubuntu + ติดตั้ง Docker
2. ตั้ง Firewall (SSH + HTTP + HTTPS)
3. Clone repo ไปที่ `/opt/luckytcg`
4. สร้าง `.env.production` (auto-generate secrets)
5. ขอ SSL cert จาก Let's Encrypt
6. Build + start ทุก service
7. Run DB migrations + seed

---

## Step 3: Setup GitHub Actions (Auto Deploy)

ใน GitHub repo → Settings → Secrets and variables → Actions:

| Secret Name    | Value                          |
|---------------|--------------------------------|
| `VPS_HOST`    | IP ของ VPS (เช่น 103.xxx.xxx.xxx) |
| `VPS_USER`    | `root` (หรือ user ที่มี docker access) |
| `VPS_SSH_KEY` | SSH private key (ดูวิธีด้านล่าง) |

### สร้าง SSH Key สำหรับ CI/CD:
```bash
# บน VPS
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github-deploy -N ""
cat ~/.ssh/github-deploy.pub >> ~/.ssh/authorized_keys

# Copy private key → paste เป็น VPS_SSH_KEY secret
cat ~/.ssh/github-deploy
```

---

## Daily Operations

### View logs
```bash
cd /opt/luckytcg
docker compose -f docker-compose.prod.yml logs -f app     # App logs
docker compose -f docker-compose.prod.yml logs -f nginx    # Nginx logs
docker compose -f docker-compose.prod.yml logs -f db       # DB logs
```

### Restart services
```bash
docker compose -f docker-compose.prod.yml restart app      # Restart app
docker compose -f docker-compose.prod.yml restart nginx     # Restart nginx
docker compose -f docker-compose.prod.yml down && docker compose -f docker-compose.prod.yml up -d  # Full restart
```

### Manual deploy (without CI/CD)
```bash
cd /opt/luckytcg
git pull
docker compose -f docker-compose.prod.yml up -d --build app
docker compose -f docker-compose.prod.yml exec -T app npx prisma migrate deploy --schema=prisma/schema.prisma
```

### Database backup
```bash
docker compose -f docker-compose.prod.yml exec db pg_dump -U luckytcg luckytcg > backup_$(date +%Y%m%d).sql
```

### Database restore
```bash
docker compose -f docker-compose.prod.yml exec -T db psql -U luckytcg luckytcg < backup_20260326.sql
```

### SSL certificate renewal (auto via certbot, but manual if needed)
```bash
docker compose -f docker-compose.prod.yml run --rm certbot renew
docker compose -f docker-compose.prod.yml restart nginx
```

---

## Architecture

```
Internet → Nginx (port 80/443) → Next.js App (port 3000) → PostgreSQL (port 5432)
                ↑ SSL/HTTPS              ↑ Docker internal       ↑ Docker internal
           Let's Encrypt            Node.js standalone       pgdata volume
```

## Environment Variables (.env.production)

| Variable          | Description                    |
|-------------------|-------------------------------|
| POSTGRES_DB       | Database name                 |
| POSTGRES_USER     | Database user                 |
| POSTGRES_PASSWORD | Database password (generated) |
| AUTH_SECRET       | NextAuth.js secret (generated)|
| NEXTAUTH_URL      | https://luckytcgthailand.com  |
| AUTH_LINE_ID      | LINE OAuth client ID          |
| AUTH_LINE_SECRET  | LINE OAuth client secret      |
