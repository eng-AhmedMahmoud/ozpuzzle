#!/usr/bin/env bash
# Production deploy of https://ozpuzzle.devya.dev (OZ Puzzle demo store) to the Devya VPS (README "Hosting").
#
# Nothing builds on the VPS (2 vCPU, shared with ~30 apps). This builds the Next standalone
# server here from origin/main, swaps its native modules (sharp) for linux-x64 musl ones,
# ships the tree to releases/<sha> on the VPS, points `current` at it and restarts the
# container, which runs a stock node image over that directory (docker-compose.prod.yml).
#
#   bash scripts/deploy-vps.sh           deploy origin/main
#   bash scripts/deploy-vps.sh --setup   also install deploy/nginx/ozpuzzle.conf and issue
#                                        the TLS certificate (the DNS record must resolve)
#
# /home/devya/projects/ozpuzzle/.env.production lives only on the VPS (chmod 600). It is
# empty today (the store reads ozpuzzle.com's public Shopify JSON); any NEXT_PUBLIC_* line
# added there is read for the build. --setup creates it if missing.
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

HOST="${DEVYA_VPS:-root@72.61.81.59}"
VPS_IP=72.61.81.59
DIR=/home/devya/projects/ozpuzzle
DOMAIN=ozpuzzle.devya.dev
URL="https://$DOMAIN"
CONTAINER=ozpuzzle
PORT=3198
KEEP=3
SETUP=0
for arg in "$@"; do
  case "$arg" in
    --setup) SETUP=1 ;;
    *) echo "usage: $0 [--setup]" >&2; exit 2 ;;
  esac
done

git fetch -q origin main
SHA="$(git rev-parse --short origin/main)"
echo "deploy: ozpuzzle at origin/main $SHA"
PNPM=(pnpm)
command -v pnpm >/dev/null 2>&1 || PNPM=(corepack pnpm)
[ "$SETUP" = 1 ] && ssh -o BatchMode=yes "$HOST" "mkdir -p $DIR && touch $DIR/.env.production && chmod 600 $DIR/.env.production" </dev/null

ssh -o BatchMode=yes "$HOST" "test -f $DIR/.env.production" </dev/null \
  || { echo "deploy: $DIR/.env.production is missing on the VPS" >&2; exit 1; }

# Build from a clean checkout of origin/main, never from the working tree.
WORK="$(mktemp -d "${TMPDIR:-/tmp}/ozpuzzle-build.XXXXXX")"
trap 'git -C "$ROOT" worktree remove --force "$WORK/src" >/dev/null 2>&1 || true; rm -rf "${WORK:?}"' EXIT
git worktree add -q --detach "$WORK/src" origin/main
cd "$WORK/src"

# Public build-time values come from the VPS env file (NEXT_PUBLIC_* only).
while IFS='=' read -r key value; do
  [ -n "$key" ] && export "$key=$value"
done < <(ssh -o BatchMode=yes "$HOST" "grep -E '^NEXT_PUBLIC_[A-Z0-9_]+=' $DIR/.env.production || true" </dev/null)

"${PNPM[@]}" install --frozen-lockfile
NEXT_OUTPUT=standalone NEXT_TELEMETRY_DISABLED=1 "${PNPM[@]}" run build

OUT="$WORK/src/.next/standalone"
test -f "$OUT/server.js" || { echo "deploy: no standalone server.js (NEXT_OUTPUT ignored?)" >&2; exit 1; }
# Copy the contents, not the directories: the standalone build may already hold a
# partial .next/static, and `cp -R .next/static "$OUT/.next/static"` would then land
# everything in .next/static/static.
mkdir -p "$OUT/.next/static" "$OUT/public" "$OUT/.next/cache"
cp -R .next/static/. "$OUT/.next/static/"
cp -R public/. "$OUT/public/"
[ ! -e "$OUT/.next/static/static" ] && [ ! -e "$OUT/public/public" ] \
  || { echo "deploy: static or public copied into a nested directory" >&2; exit 1; }

# Native modules: every copy of sharp in the standalone tree gets its macOS builds
# replaced by the linux-x64 musl ones of the same version, to match node:alpine.
# Then nothing that is not an ELF x86-64 binary may ship.
find "$OUT" -path '*/node_modules/sharp/package.json' | while read -r pkg; do
  modules="$(dirname "$(dirname "$pkg")")"
  version="$(node -p "require('$pkg').version")"
  natives="$WORK/natives/$version"
  if [ ! -d "$natives/node_modules/@img" ]; then
    mkdir -p "$natives"
    npm install --prefix "$natives" --no-save --no-audit --no-fund \
      --os=linux --cpu=x64 --libc=musl "sharp@$version" >/dev/null
  fi
  rm -rf "$modules/@img"
  mkdir -p "$modules/@img"
  cp -R "$natives/node_modules/@img/." "$modules/@img/"
  echo "deploy: sharp $version natives swapped in ${modules#"$OUT"/}"
done
# pnpm keeps each platform package in its own .pnpm/@img+sharp-darwin-* directory and
# links it from .pnpm/node_modules/@img too: macOS-only packages never load on the VPS.
find "$OUT/node_modules/.pnpm" -maxdepth 1 -name '@img+sharp-*darwin*' -exec rm -rf {} + 2>/dev/null || true
find "$OUT/node_modules" -path '*/node_modules/@img/sharp-*darwin*' -prune -exec rm -rf {} + 2>/dev/null || true
bad="$(find -L "$OUT" -name '*.node' -exec file {} + 2>/dev/null | grep -v 'ELF 64-bit LSB.*x86-64' || true)"
[ -z "$bad" ] || { echo "deploy: non-linux native modules in the build:" >&2; echo "$bad" >&2; exit 1; }

# COPYFILE_DISABLE + --no-xattrs: no macOS ._* files or xattr headers in the release.
COPYFILE_DISABLE=1 tar --no-xattrs -C "$OUT" -czf "$WORK/release.tgz" .
echo "deploy: built $(du -h "$WORK/release.tgz" | cut -f1) release"
cd "$ROOT"

ssh -o BatchMode=yes "$HOST" "mkdir -p $DIR/releases/$SHA" </dev/null
ssh -o BatchMode=yes "$HOST" "tar -xzf - -C $DIR/releases/$SHA" < "$WORK/release.tgz"
ssh -o BatchMode=yes "$HOST" "chown -R root:root $DIR/releases/$SHA && mkdir -p $DIR/releases/$SHA/.next/server/app && chown -R 1000:1000 $DIR/releases/$SHA/.next/server/app" </dev/null
git show "origin/main:docker-compose.prod.yml" | ssh -o BatchMode=yes "$HOST" "cat > $DIR/docker-compose.prod.yml"

ssh -o BatchMode=yes "$HOST" "set -e; cd $DIR
  chmod 600 .env.production
  ln -sfn releases/$SHA current.new && mv -T current.new current
  docker compose -f docker-compose.prod.yml up -d --force-recreate
  for i in \$(seq 1 40); do
    code=\$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:$PORT/ || true)
    case \"\$code\" in 2*|3*) echo \"deploy: container answers \$code\"; break ;; esac
    sleep 3
    [ \"\$i\" = 40 ] && { echo 'deploy: container did not answer in 120s' >&2; docker logs $CONTAINER --tail 50; exit 1; }
  done
  ls -1t releases | tail -n +$((KEEP + 1)) | while read -r old; do rm -rf \"releases/\$old\"; done" </dev/null

# nginx only after the container answers: the VPS health check counts every vhost.
if [ "$SETUP" = 1 ]; then
  git show "origin/main:deploy/nginx/ozpuzzle.conf" | ssh -o BatchMode=yes "$HOST" "set -e
    if [ ! -e /etc/nginx/sites-available/ozpuzzle ]; then
      cat > /etc/nginx/sites-available/ozpuzzle
      ln -sf /etc/nginx/sites-available/ozpuzzle /etc/nginx/sites-enabled/ozpuzzle
      nginx -t && systemctl reload nginx
    else
      cat >/dev/null
      echo 'deploy: nginx site ozpuzzle already installed (certbot edits it in place); left as is'
    fi"
  if [ "$(dig +short A "$DOMAIN" @1.1.1.1 | tail -1)" != "$VPS_IP" ]; then
    echo "deploy: $DOMAIN does not resolve to $VPS_IP yet; add the DNS record, then rerun --setup" >&2
    exit 1
  fi
  ssh -o BatchMode=yes "$HOST" "certbot --nginx -n --agree-tos --redirect --cert-name $DOMAIN -d $DOMAIN" </dev/null
fi

status=0
handle="$(curl -s -m 20 "https://ozpuzzle.com/products.json?limit=1" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log(JSON.parse(s).products[0].handle)}catch{console.log("")}})')"
for path in / /shop "/products/$handle"; do
  code="$(curl -s -o /dev/null -m 20 -w '%{http_code}' "$URL$path" || true)"
  echo "deploy: $URL$path -> $code"
  [ "$code" = 200 ] || status=1
done
# A 200 page is not a working page: every asset it references must load too.
missing=0 total=0
for asset in $(curl -s -m 20 "$URL/" | grep -oE '(src|href)="/_next/static/[^"]+' | cut -d'"' -f2 | sort -u); do
  total=$((total + 1))
  code="$(curl -s -o /dev/null -m 20 -w '%{http_code}' "$URL$asset" || true)"
  [ "$code" = 200 ] || { echo "deploy: $asset -> $code" >&2; missing=$((missing + 1)); }
done
echo "deploy: $URL/ references $total static assets, $missing missing"
[ "$total" -gt 0 ] && [ "$missing" = 0 ] || status=1
exit "$status"
