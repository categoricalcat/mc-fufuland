# ---------------- Stage 1: grab mc-monitor binary ----------------
ARG MC_MONITOR_VERSION=0.15.5
FROM itzg/mc-monitor:${MC_MONITOR_VERSION} AS mcbin

# ---------------- Stage 2: build the server ----------------
FROM eclipse-temurin:21-jre AS builder

WORKDIR /opt/minecraft

ARG FABRIC_LAUNCHER_JAR="/opt/minecraft/mc/fabric-server-mc.1.21.5-loader.0.16.14-launcher.1.0.3.jar"
ARG MEMORY_ALLOCATION="6G"
ARG TARGETARCH=linux-arm64
ENV TARGETARCH=${TARGETARCH}

COPY install-mrpack.sh ./
COPY start-server.sh ./
COPY the-modpack.mrpack ./the-modpack.mrpack
COPY eula.txt ./eula.txt
COPY server.properties ./server.properties
COPY server-icon.png ./server-icon.png
COPY --from=mcbin /mc-monitor /usr/local/bin/

RUN chmod +x ./install-mrpack.sh && \
    chmod +x ./start-server.sh && \
    ./install-mrpack.sh && \
    ./mrpack-install the-modpack.mrpack

FROM builder AS runner

ENV MEMORY_ALLOCATION=${MEMORY_ALLOCATION}
ENV FABRIC_LAUNCHER_JAR=${FABRIC_LAUNCHER_JAR}

EXPOSE 25565

CMD ["./start-server.sh"]
