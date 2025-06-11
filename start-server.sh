#!/usr/bin/env sh

echo "Starting server..."

echo "Memory allocation: ${MEMORY_ALLOCATION:-6G}"
echo "Fabric launcher jar: ${FABRIC_LAUNCHER_JAR}"

exec java \
  -Xmx${MEMORY_ALLOCATION:-6G} \
  -Xms2G \
  -jar "${FABRIC_LAUNCHER_JAR}" \
  nogui
