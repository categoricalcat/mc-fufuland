FROM --platform=linux/amd64 eclipse-temurin:21-jre

WORKDIR /data

# Install unzip
RUN apt-get update && \
    apt-get install -y unzip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy and unzip the server pack
COPY ServerPack.zip ./
RUN unzip ServerPack.zip -d /data && \
    rm ServerPack.zip

COPY scripts/start-server.sh ./start-server.sh
COPY server-1.16.5.jar .

RUN chmod +x ./start-server.sh

EXPOSE 25566

ENTRYPOINT ["./start-server.sh"]
