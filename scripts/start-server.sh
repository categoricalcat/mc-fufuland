#!/usr/bin/env sh

set -e

# Change to the minecraft server directory
cd /opt/minecraft/mc

PATH_TO_JAR="fabric-server-mc.${FABRIC_VERSION:-1.21.5}-loader.${FABRIC_LOADER_VERSION:-0.16.14}-launcher.${FABRIC_LAUNCHER_VERSION:-1.0.3}.jar"

echo "Starting server..."
echo "Memory allocation: ${MEMORY_ALLOCATION:-6G}"
echo "Fabric launcher jar: ${PATH_TO_JAR}"

exec java \
  -Xmx${MEMORY_ALLOCATION:-6G} \
  -Xms2G \
  -jar "${PATH_TO_JAR}" \
  nogui
