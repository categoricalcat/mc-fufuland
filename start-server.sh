#!/usr/bin/env sh

exec java \
  -Xmx${MEMORY_ALLOCATION:-6G} \
  -Xms1G \
  -jar "${FABRIC_LAUNCHER_JAR:-fabric-server-mc.1.21.5-loader.0.16.14-launcher.1.0.3.jar}" \
  nogui
