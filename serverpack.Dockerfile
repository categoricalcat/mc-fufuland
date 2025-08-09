FROM eclipse-temurin:21-jre

WORKDIR /opt/minecraft

# Install unzip
RUN apt-get update && \
    apt-get install -y unzip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy and unzip the server pack
COPY ServerPack.zip ./
RUN unzip ServerPack.zip && \
    rm ServerPack.zip && \
    chmod +x startserver.sh

EXPOSE 25566

CMD ["./startserver.sh"]
