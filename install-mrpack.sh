#!/usr/bin/env sh

# os types
# darwin
# darwin-arm64
# linux
# linux-arm64
# windows.exe

BASE_URL="https://github.com/nothub/mrpack-install/releases/download/v0.16.10"

# Get TARGETARCH from command line argument or environment variable
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

# set -e to exit the script if any command fails
set -e

# Update package index and install mrpack-install
apt-get update

# Fetch the appropriate binary and make it executable
FILENAME="mrpack-install-${TARGETARCH}"
curl -fsSL "${BASE_URL}/${FILENAME}" -o ./mrpack-install
chmod +x ./mrpack-install

echo "mrpack-install installed successfully"

# Clean up to keep the image small
apt-get clean
rm -rf /var/lib/apt/lists/*
