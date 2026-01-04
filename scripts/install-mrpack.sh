#!/usr/bin/env sh

set -e -u

# os types
# darwin
# darwin-arm64
# linux
# linux-arm64
# windows.exe

BASE_URL="https://github.com/nothub/mrpack-install/releases/download/v0.16.10"

if [ -n "$1" ]; then
  TARGETARCH="$1"
  echo "Using TARGETARCH from argument: ${TARGETARCH}"
elif [ -n "${TARGETARCH}" ]; then
  echo "Using TARGETARCH from environment: ${TARGETARCH}"
else
  echo "Error: TARGETARCH not provided. Please pass it as an argument or set it as an environment variable." >&2
  echo "Usage: $0 <TARGETARCH>" >&2
  echo "Supported values are: darwin, darwin-arm64, linux, linux-arm64, windows.exe" >&2
  exit 1
fi

# Validate TARGETARCH is supported
case "${TARGETARCH}" in
darwin | darwin-arm64 | linux | linux-arm64 | windows.exe)
  echo "Validated TARGETARCH: ${TARGETARCH}"
  ;;
*)
  echo "Error: Unsupported TARGETARCH value: ${TARGETARCH}" >&2
  echo "Supported values are: darwin, darwin-arm64, linux, linux-arm64, windows.exe" >&2
  exit 1
  ;;
esac

# Update package index and install mrpack-install
apt-get update

# Fetch the appropriate binary and make it executable
FILENAME="mrpack-install-${TARGETARCH}"
DOWNLOAD_URL="${BASE_URL}/${FILENAME}"

echo "Downloading from: ${DOWNLOAD_URL}"
curl -L --progress-bar --show-error "${DOWNLOAD_URL}" -o ./mrpack-install

chmod +x ./mrpack-install

if [ -f ./mrpack-install ]; then
  echo "mrpack-install installed successfully"
else
  echo "Error: mrpack-install was not downloaded or is missing." >&2
  exit 1
fi

# Clean up to keep the image small
# apt-get clean
# rm -rf /var/lib/apt/lists/*
