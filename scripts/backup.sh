#!/bin/sh
set -e

MODE="$1"
BACKUP_DIR="${BACKUP_DIR:-/backup}"
DATA_DIR="${DATA_DIR:-/data}"
ARCHIVE="${ARCHIVE:-mc-data-$(date +%Y-%m-%d-%H-%M-%S).tar.zst}"

case "$MODE" in
write)
  echo "Starting backup to $ARCHIVE..."
  tar -C "$DATA_DIR" -cf - . |
    zstd -9 -T0 >"$BACKUP_DIR/$ARCHIVE"
  cp "$BACKUP_DIR/$ARCHIVE" "$BACKUP_DIR/latest.tar.zst"
  echo "Backup completed! Archive stored at $BACKUP_DIR/$ARCHIVE"
  ;;
read)
  if [ ! -f "$BACKUP_DIR/latest.tar.zst" ]; then
    echo "No backup archive found at $BACKUP_DIR/latest.tar.zst"
    exit 1
  fi
  echo "Restoring from $BACKUP_DIR/latest.tar.zst..."
  echo "Clearing existing data in $DATA_DIR..."
  rm -rf "$DATA_DIR"/*
  mkdir -p "$DATA_DIR"
  zstd -d -c "$BACKUP_DIR/latest.tar.zst" | tar -xf - -C "$DATA_DIR"
  echo "Restore completed!"
  ;;
*)
  echo "Usage: $0 {write|read}"
  exit 1
  ;;
esac
