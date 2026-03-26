#!/bin/bash
# ============================================================
# LUCKY TCG THAILAND — VPS First-Time Setup (Ubuntu 22/24)
# Run: ssh root@YOUR_VPS_IP < scripts/vps-setup.sh
# ============================================================

set -e

DOMAIN="luckytcgthailand.com"
APP_DIR="/opt/luckytcg"
REPO="https://github.com/Seedzzzz01/GOODGUYTCG.git"

echo "=========================================="
echo "  LUCKY TCG THAILAND — VPS Setup"
echo "=========================================="

# --- 1. System updates ---
echo "[1/7] Updating system..."
apt-get update && apt-get upgrade -y
apt-get install -y curl git ufw

# --- 2. Install Docker ---
echo "[2/7] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

# Install Docker Compose plugin
if ! docker compose version &> /dev/null; then
    apt-get install -y docker-compose-plugin
fi

echo "Docker version: $(docker --version)"

# --- 3. Firewall ---
echo "[3/7] Configuring firewall..."
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw --force enable

# --- 4. Clone repo ---
echo "[4/7] Cloning repository..."
if [ -d "$APP_DIR" ]; then
    cd "$APP_DIR" && git pull
else
    git clone "$REPO" "$APP_DIR"
    cd "$APP_DIR"
fi

# --- 5. Create .env ---
echo "[5/7] Creating .env file..."
if [ ! -f .env.production ]; then
    AUTH_SECRET=$(openssl rand -base64 32)
    DB_PASS=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9' | head -c 20)

    cat > .env.production << EOF
# Database
POSTGRES_DB=luckytcg
POSTGRES_USER=luckytcg
POSTGRES_PASSWORD=${DB_PASS}
DATABASE_URL=postgresql://luckytcg:${DB_PASS}@db:5432/luckytcg

# Auth
AUTH_SECRET=${AUTH_SECRET}
NEXTAUTH_URL=https://${DOMAIN}

# LINE OAuth (fill in later)
AUTH_LINE_ID=
AUTH_LINE_SECRET=
EOF

    echo "Created .env.production with generated secrets"
    echo "DB Password: ${DB_PASS} (save this!)"
else
    echo ".env.production already exists, skipping"
fi

# Copy env for docker
cp .env.production .env

# --- 6. SSL Certificate ---
echo "[6/7] Getting SSL certificate..."

# First, start nginx with HTTP-only config for certbot challenge
cat > nginx/default-init.conf << 'INITCONF'
server {
    listen 80;
    server_name luckytcgthailand.com www.luckytcgthailand.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'Setting up...';
        add_header Content-Type text/plain;
    }
}
INITCONF

# Swap config temporarily
cp nginx/default.conf nginx/default-ssl.conf
cp nginx/default-init.conf nginx/default.conf

# Start just nginx + certbot
docker compose -f docker-compose.prod.yml up -d nginx

# Get cert
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot --webroot-path=/var/www/certbot \
    --email admin@${DOMAIN} \
    --agree-tos --no-eff-email \
    -d ${DOMAIN} -d www.${DOMAIN}

# Restore SSL config
cp nginx/default-ssl.conf nginx/default.conf
rm -f nginx/default-init.conf nginx/default-ssl.conf

docker compose -f docker-compose.prod.yml down

# --- 7. Start everything ---
echo "[7/7] Building and starting services..."
docker compose -f docker-compose.prod.yml up -d --build

# Run database migrations
echo "Running database migrations..."
sleep 5  # Wait for DB to be ready
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy --schema=prisma/schema.prisma

# Seed data
echo "Seeding database..."
docker compose -f docker-compose.prod.yml exec app npx prisma db seed

echo ""
echo "=========================================="
echo "  SETUP COMPLETE!"
echo "=========================================="
echo ""
echo "  https://${DOMAIN}"
echo ""
echo "  Admin: admin@luckytcgthailand.com / admin123"
echo "  (CHANGE THIS PASSWORD IMMEDIATELY!)"
echo ""
echo "  Commands:"
echo "    cd ${APP_DIR}"
echo "    docker compose -f docker-compose.prod.yml logs -f      # View logs"
echo "    docker compose -f docker-compose.prod.yml restart app   # Restart app"
echo "    docker compose -f docker-compose.prod.yml down          # Stop all"
echo ""
