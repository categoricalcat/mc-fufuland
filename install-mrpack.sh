#!/usr/bin/env sh

# os types
# darwin
# darwin-arm64
# linux
# linux-arm64
# windows.exe

BASE_URL="https://github.com/nothub/mrpack-install/releases/download/v0.16.10"

# Validate TARGETARCH is set and supported
case "${TARGETARCH}" in
darwin | darwin-arm64 | linux | linux-arm64 | windows.exe)
  echo "Using TARGETARCH: ${TARGETARCH}"
  ;;
"")
  echo "Error: TARGETARCH is not set. Please export a supported architecture value (e.g. linux-arm64)." >&2
  exit 1
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
