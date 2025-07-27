# ---------------- Stage 1, mc-monitor binary ----------------
ARG MC_MONITOR_VERSION=0.15.5
FROM itzg/mc-monitor:${MC_MONITOR_VERSION} AS mcbin

# ---------------- Stage 2, install the modpack ----------------
FROM eclipse-temurin:21-jre AS builder

WORKDIR /opt/minecraft

ARG MEMORY_ALLOCATION="6G"
ARG TARGETARCH=linux-arm64
# ARG MODPACK_ARCHIVE=the-modpack-processed.mrpack
ARG MODPACK_ARCHIVE=the-modpack.mrpack

ENV MODPACK_ARCHIVE=${MODPACK_ARCHIVE}
ENV TARGETARCH=${TARGETARCH}

COPY ${MODPACK_ARCHIVE} ./
COPY scripts/install-mrpack.sh ./

RUN chmod +x ./install-mrpack.sh && \
./install-mrpack.sh ${TARGETARCH} && \
./mrpack-install ./${MODPACK_ARCHIVE} --server-dir mc --server-file server.jar

# ---------------- Stage 3, the runner ----------------
FROM eclipse-temurin:21-jre AS runner

WORKDIR /opt/minecraft

ENV MEMORY_ALLOCATION=${MEMORY_ALLOCATION}

COPY --from=mcbin /mc-monitor /usr/local/bin/
COPY --from=builder /opt/minecraft/mc ./mc/

COPY eula.txt ./mc/
COPY server-icon.png ./mc/
COPY server.properties ./mc/
COPY scripts/start-server.sh ./

RUN chmod +x ./start-server.sh

EXPOSE 25565

ENTRYPOINT ["./start-server.sh"]
