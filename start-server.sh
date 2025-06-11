#!/usr/bin/env sh

exec java \
  -Xmx${MEMORY_ALLOCATION:-6G} \
  -Xms2G \
  -jar "${FABRIC_LAUNCHER_JAR}" \
  nogui
