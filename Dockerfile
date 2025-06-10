FROM eclipse-temurin:21-jre AS builder

ARG FABRIC_LAUNCHER_JAR="/opt/minecraft/mc/fabric-server-mc.1.21.5-loader.0.16.14-launcher.1.0.3.jar"
ARG MEMORY_ALLOCATION="6G"

WORKDIR /opt/minecraft

# ARGs must be declared before they're first used
ARG TARGETARCH=linux-arm64
ENV TARGETARCH=${TARGETARCH}

COPY install-mrpack.sh ./
COPY start-server.sh ./
COPY the-modpack.mrpack ./the-modpack.mrpack
COPY eula.txt ./eula.txt
COPY server.properties ./server.properties
COPY server-icon.png ./server-icon.png

RUN chmod +x ./install-mrpack.sh && \
    chmod +x ./start-server.sh && \
    ./install-mrpack.sh && \
    ./mrpack-install the-modpack.mrpack

# Use ENV for runtime variables or hardcode the values
ENV MEMORY_ALLOCATION=${MEMORY_ALLOCATION}
ENV FABRIC_LAUNCHER_JAR=${FABRIC_LAUNCHER_JAR}

EXPOSE 25565

CMD ["./start-server.sh"]
