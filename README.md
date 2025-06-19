# Express Project Setup

---

## Requirements

Pastikan sudah terinstal di sistem Anda:

- Node.js >= 22.x
- PostgreSQL
- Yarn

---

## Langkah-langkah Setup

### 1. Clone Repository

```bash
git clone https://github.com/AdhiWaluyo/test-pt-sts-orgx-be
cd test-pt-sts-orgx-be
```

### 2. Install Dependency Backend

```bash
yarn install or npm run install
```

### 3. Copy File `.env` & Generate App Key

```bash
cp .env.example .env
```

### 4. Atur Konfigurasi Database

Edit file `.env` sesuai dengan database lokal Anda:

```env
DATABASE_URL="postgresql://[username]:[password]@[host]:[port]/[database_name]?schema=public"
```

Lalu buat database `your_database` di PostgreSQL.

### 5. Jalankan Migrasi dan Seeder (opsional)

```bash
yarn prisma db push --force-reset && yarn prisma db push
yarn prisma:seed
```

### 6. Jalankan Laravel Server

```bash
yarn dev
```

Backend akan berjalan di:

```
http://localhost:3000
```

## Selesai!
