# ---------------- Stage 1, mc-monitor binary ----------------
ARG MC_MONITOR_VERSION=0.15.5
FROM itzg/mc-monitor:${MC_MONITOR_VERSION} AS mcbin

# ---------------- Stage 2, install the modpack ----------------
FROM eclipse-temurin:21-jre AS builder

WORKDIR /opt/minecraft

ARG FABRIC_LAUNCHER_JAR="/opt/minecraft/mc/fabric-server-mc.1.21.5-loader.0.16.14-launcher.1.0.3.jar"
ARG MEMORY_ALLOCATION="6G"
ARG TARGETARCH=linux-arm64
ENV TARGETARCH=${TARGETARCH}

COPY the-modpack.mrpack ./the-modpack.mrpack
COPY install-mrpack.sh ./

RUN chmod +x ./install-mrpack.sh && \
    ./install-mrpack.sh && \
    ./mrpack-install the-modpack.mrpack

# ---------------- Stage 3, the runner ----------------
FROM eclipse-temurin:21-jre AS runner

WORKDIR /opt/minecraft/mc

ENV MEMORY_ALLOCATION=${MEMORY_ALLOCATION}
ENV FABRIC_LAUNCHER_JAR=${FABRIC_LAUNCHER_JAR}

COPY --from=mcbin /mc-monitor /usr/local/bin/
COPY --from=builder /opt/minecraft/mc ./

COPY eula.txt ./
COPY server-icon.png ./
COPY server.properties ./
COPY start-server.sh ./

RUN chmod +x ./start-server.sh

EXPOSE 25565

CMD ["./start-server.sh"]
