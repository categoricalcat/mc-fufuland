FROM ubuntu:22.04

# Install zstd for modern, fast compression
RUN apt-get update && \
    apt-get install -y zstd && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Accept operation type as build argument
ARG OPERATION
ENV OPERATION=${OPERATION}

# Use sh -c to allow variable expansion in JSON format
ENTRYPOINT ["/bin/sh", "-c", "/script/backup.sh $OPERATION"]
