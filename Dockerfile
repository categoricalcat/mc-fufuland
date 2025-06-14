# ---------------- Stage 1, mc-monitor binary ----------------
ARG MC_MONITOR_VERSION=0.15.5
FROM itzg/mc-monitor:${MC_MONITOR_VERSION} AS mcbin

# ---------------- Stage 2, install the modpack ----------------
FROM eclipse-temurin:21-jre AS builder

WORKDIR /opt/minecraft

ARG FABRIC_LAUNCHER_JAR="/opt/minecraft/mc/fabric-server-mc.1.21.5-loader.0.16.14-launcher.1.0.3.jar"
ARG MEMORY_ALLOCATION="6G"
ARG TARGETARCH=linux-arm64
# ARG MODPACK_ARCHIVE=the-modpack-processed.mrpack
ARG MODPACK_ARCHIVE=the-modpack.mrpack
ENV TARGETARCH=${TARGETARCH}
ENV MODPACK_ARCHIVE=${MODPACK_ARCHIVE}

COPY ${MODPACK_ARCHIVE} ./
COPY install-mrpack.sh ./

RUN chmod +x ./install-mrpack.sh && \
    ./install-mrpack.sh && \
    ./mrpack-install ./${MODPACK_ARCHIVE} --server-dir mc --server-file server.jar

# ---------------- Stage 3, the runner ----------------
FROM eclipse-temurin:21-jre AS runner

WORKDIR /opt/minecraft

ENV MEMORY_ALLOCATION=${MEMORY_ALLOCATION}
ENV FABRIC_LAUNCHER_JAR=${FABRIC_LAUNCHER_JAR}

COPY --from=mcbin /mc-monitor /usr/local/bin/
COPY --from=builder /opt/minecraft/mc ./mc/

COPY eula.txt ./mc/
COPY server-icon.png ./mc/
COPY server.properties ./mc/
COPY start-server.sh ./

RUN chmod +x ./start-server.sh

EXPOSE 25565

ENTRYPOINT ["./start-server.sh"]
