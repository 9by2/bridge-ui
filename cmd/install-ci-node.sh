#!/bin/sh
set -eu

apt-get update -qq
apt-get install -y --no-install-recommends ca-certificates curl xz-utils

# Vitest V8 coverage must use Node, not the Bun image's node fallback.
version=22.22.0
case "$(uname -m)" in
  x86_64) arch=x64 ;;
  aarch64) arch=arm64 ;;
  *) exit 1 ;;
esac
directory=$(mktemp -d)
trap 'rm -rf "$directory"' EXIT
archive="node-v${version}-linux-${arch}.tar.xz"
curl --fail --silent --show-error "https://nodejs.org/dist/v${version}/${archive}" -o "$directory/$archive"
curl --fail --silent --show-error "https://nodejs.org/dist/v${version}/SHASUMS256.txt" -o "$directory/SHASUMS256.txt"
cd "$directory"
grep " ${archive}\$" SHASUMS256.txt | sha256sum -c -
tar -xJf "$archive"
install -m 755 "node-v${version}-linux-${arch}/bin/node" /usr/local/bin/node
/usr/local/bin/node --version
