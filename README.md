# Fufuland – Modded Minecraft Server Stack

## Table of contents

1. Project overview
2. Repository layout
3. Quick start
4. Configuration
5. Back-ups & disaster recovery
6. Updating / changing the modpack
7. Development scripts (TypeScript)
8. Troubleshooting
9. Acknowledgements & licence

---

## 1. Project overview

This repository contains everything required to run **Fufuland**, a self-hosted, Fabric-powered, modded Minecraft 1.21.5 server inside Docker.
It provides:

* **`server`** – a multi-stage image that automatically installs the chosen `.mrpack` modpack, applies the Minecraft EULA, and starts the Fabric server.
* **`playit`** – an optional [Playit.gg](https://playit.gg) tunnel so friends can join without port-forwarding.
* **`backup` / `restore`** – disposable containers that create compressed snapshots (`.tar.zst`) or restore them.
* **TypeScript utilities** that post-process the `.mrpack` file (e.g. enriching the Modrinth index with extra metadata).

Everything is orchestrated with **Docker Compose** so the whole stack can be reproduced with a single command.

---

## 2. Repository layout

```text
.
├── Dockerfile              # Multi-stage build producing the final server image
├── docker-compose.yaml     # All services & volumes
├── backup.dockerfile       # Minimal image used by backup / restore jobs
├── backup.sh               # Shell script executed inside the backup image
├── install-mrpack.sh       # Downloads the mrpack-install binary for the detected CPU
├── the-modpack.mrpack      # Original modpack archive
├── the-modpack-processed.mrpack
│   └── ...                 # Processed version created by scripts/process.ts
├── scripts/                # TypeScript helper utilities
│   └── process.ts          # Enriches modrinth.index.json inside the modpack
├── types/                  # Shared TypeScript type-defs
└── .backups/               # Local backup destination (mounted by `backup` service)
```

---

## 3. Quick start

Prerequisites:

* Docker Engine ≥ 20.10
* Docker Compose ≥ v2 (comes with modern Docker installs)

1.  Clone the repo and `cd` into it.
2.  Create a `.env` file containing your Playit **`SECRET_KEY`** (skip if you do not plan to use the tunnel).
3.  Launch everything:

   ```bash
   docker compose up -d              # builds the image the first time, then starts containers
   ```

4.  Join the server on `localhost:25565` (or the hostname given by Playit once the agent connects).

To tail logs:

```bash
docker compose logs -f server | cat
```

Stop the server:

```bash
docker compose stop server
```

---

## 4. Configuration

Most settings live in `docker-compose.yaml` and can be tweaked via environment variables.

| Variable            | Location                | Default | Description |
| ------------------- | ----------------------- | ------- | ----------- |
| `MEMORY_ALLOCATION` | `docker-compose.yaml` & `Dockerfile` | `10G`   | JVM `-Xmx` passed to the Fabric launcher |
| `SECRET_KEY`        | `.env` (Playit)         | –       | Authenticates your tunnel |
| `FABRIC_LAUNCHER_JAR` | `Dockerfile`          | current version | Path inside the image to the Fabric launcher |

Minecraft‐specific settings such as difficulty, world seed, etc. are handled through the usual `server.properties` file which is bind-mounted so you can edit it locally.

---

## 5. Back-ups & disaster recovery

Back-ups are compressed with **zstd** for speed and stored under `.backups/` (host) ➜ `/backup` (container).

Create a backup (takes a snapshot of the `mc-data` named volume):

```bash
docker compose --profile backup run --rm backup
```

This produces e.g. `.backups/mc-data-2024-06-14-22-33-01.tar.zst` and also updates `latest.tar.zst`.

Restore the most recent backup:

```bash
docker compose --profile restore run --rm restore
```

⚠️  The restore job **deletes everything** in the volume before extracting the archive – make sure the server is stopped.

---

## 6. Updating / changing the modpack

1. Replace `the-modpack.mrpack` with the new version (or another pack of your choosing).
2. Adjust `Dockerfile` (if the Fabric / Minecraft version changed).
3. Re-build & re-create the server:

   ```bash
   docker compose build server && docker compose up -d --force-recreate server
   ```

Optionally run `pnpm run process` beforehand to generate `the-modpack-processed.mrpack` which contains enriched metadata.

---

## 7. Development scripts (TypeScript)

Install Node deps with your favourite manager (here we use **pnpm**):

```bash
pnpm install
```

Then run the modpack processor:

```bash
pnpm run process
```

This will:

1. Extract the original `.mrpack` into `.backups/the-modpack/`
2. Fetch metadata from the Modrinth API and update `modrinth.index.json`
3. Re-zip the folder into `the-modpack-processed.mrpack`

---

## 8. Troubleshooting

• **Server does not start / keeps restarting** – check logs: `docker compose logs -f server | cat`
• **Playit agent not connecting** – validate `SECRET_KEY` and that UDP/TCP 25565 are exposed.
• **Out-of-memory errors** – raise `MEMORY_ALLOCATION` or allocate more to Docker Desktop.

---

## 9. Acknowledgements & licence

* [Fabric](https://fabricmc.net/) – lightweight mod loader.
* [Modrinth](https://modrinth.com) – open-source mod hosting platform.
* [itzg/mc-monitor](https://github.com/itzg/mc-monitor) – fantastic tool for health-checking servers.
* [Playit.gg](https://playit.gg) – secure tunnels for Minecraft.

This repository itself is released under the **MIT License** (see `LICENSE` if present). Game assets and mods belong to their respective authors.
