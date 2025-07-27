# mc-fufuland

A Dockerized Minecraft server running Fabric 1.21.5 with automated modpack installation and backups.

## Tech Stack

- Docker & Docker Compose
- Fabric-powered Minecraft server
- TypeScript for modpack processing
- Playit.gg tunnel for external access
- Zstd compression for backups

## Getting Started

```bash
git clone [repo-url]
cd mc-fufuland
docker compose up -d
```

That's it. Connect to `localhost:25565`.

## How to Run

```bash
# Start server
docker compose up -d

# Stop server
docker compose down

# View logs
docker compose logs -f server
```

## Backups

```bash
# Create backup
docker compose --profile backup run --rm backup write

# Restore from latest
docker compose --profile restore run --rm restore read
```

## Update Modpack

1. Replace `the-modpack.mrpack`
2. Rebuild:
   ```bash
   docker compose build server
   docker compose up -d --force-recreate server
   ```

## Config

Edit `docker-compose.yaml`:
- `MEMORY_ALLOCATION`: Server RAM (default: 16G)
- `FABRIC_VERSION`: Minecraft version (1.21.5)

Server settings: `server.properties`

## Optional: Process Modpack

Enriches modpack with metadata from Modrinth:

```bash
pnpm install
pnpm run process
```

Creates `the-modpack-processed.mrpack` with enhanced mod info.
