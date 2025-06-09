FROM eclipse-temurin:17-jre AS builder

ARG MINECRAFT_VERSION="1.21.5"
ARG FABRIC_LAUNCHER_JAR="mc/fabric-server-mc.1.21.5-loader.0.16.14-launcher.1.0.3.jar"
ARG MEMORY_ALLOCATION="6G"

WORKDIR /opt/minecraft

# ARGs must be declared before they're first used
ARG TARGETOS=linux
ARG TARGETARCH=mrpack-install-linux-arm64
ARG BASE_URL="https://github.com/nothub/mrpack-install/releases/download/v0.16.10"

ARG FULL_URL="${BASE_URL}/${TARGETARCH}"

# Download the right mrpack-install binary for the target platform
RUN set -e; \
    apt-get update && \
    echo "Downloading ${TARGETARCH} for architecture ${TARGETARCH}..." && \
    echo "url: ${BASE_URL}/${TARGETARCH}" && \
    curl -fsSL "${BASE_URL}/${TARGETARCH}" -o /usr/local/bin/mrpack-install && \
    chmod +x /usr/local/bin/mrpack-install && \
    echo "mrpack-install installed successfully" && \
    apt-get clean && rm -rf /var/lib/apt/lists/*


# COPY ${FABRIC_LAUNCHER_JAR} ./${FABRIC_LAUNCHER_JAR}
# COPY libraries ./libraries
COPY eula.txt ./eula.txt
COPY the-modpack.mrpack ./the-modpack.mrpack
COPY start-server.sh /usr/local/bin/

RUN /usr/local/bin/mrpack-install the-modpack.mrpack
RUN chmod +x /usr/local/bin/start-server.sh

EXPOSE 25565

# Use ENV for runtime variables or hardcode the values
ENV MEMORY_ALLOCATION=${MEMORY_ALLOCATION}
ENV FABRIC_LAUNCHER_JAR=${FABRIC_LAUNCHER_JAR}

CMD ["/usr/local/bin/start-server.sh"]
