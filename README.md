# Fufuland – Modded Minecraft Server Stack

A Dockerized Fabric-powered Minecraft 1.21.5 server with automated modpack installation, backups, and optional TypeScript tooling.

## Quick Start

1. Clone the repository
2. Run the server:
   ```bash
   docker compose up -d
   ```
3. Connect to `localhost:25565`

## Architecture

The stack consists of:

- **Server** – Multi-stage Docker build that:
  - Downloads and installs the modpack (`.mrpack`) automatically
  - Runs the Fabric server with configurable memory allocation
  - Includes health monitoring via `mc-monitor`
  
- **Backup/Restore** – Separate containers for disaster recovery:
  - Creates compressed snapshots (`.tar.zst`) of the server data
  - Stores backups in `.backups/` directory
  - Supports point-in-time restoration

## Configuration

Key settings in `docker-compose.yaml`:

| Variable | Default | Description |
|----------|---------|-------------|
| `MEMORY_ALLOCATION` | `10G` | JVM heap size for the server |
| `FABRIC_VERSION` | `1.21.5` | Minecraft version |
| `FABRIC_LOADER_VERSION` | `0.16.14` | Fabric loader version |

Server settings are managed through the bind-mounted `server.properties` file.

## Backup Operations

Create a backup:
```bash
docker compose --profile backup run --rm backup write
```

Restore from latest backup:
```bash
docker compose --profile restore run --rm restore read
```

## Modpack Management

The server automatically installs `the-modpack.mrpack` during build. To update:

1. Replace the `.mrpack` file
2. Rebuild the server:
   ```bash
   docker compose build server && docker compose up -d --force-recreate server
   ```

### Optional: Modpack Processing

The repository includes TypeScript scripts to enrich modpack metadata:

```bash
pnpm install
pnpm run process
```

This fetches additional mod information from Modrinth API and creates `the-modpack-processed.mrpack` with enhanced metadata.

## Project Structure

```
.
├── docker-compose.yaml      # Service orchestration
├── Dockerfile              # Server image build
├── backup.dockerfile       # Backup/restore operations
├── the-modpack.mrpack     # Modpack archive
├── server.properties      # Minecraft server config
├── scripts/               # Shell and TypeScript utilities
│   ├── start-server.sh    # Server entrypoint
│   ├── backup.sh         # Backup/restore logic
│   ├── install-mrpack.sh # Modpack installer
│   └── process.ts        # Modpack metadata enrichment
└── .backups/             # Local backup storage
```

## License

MIT
