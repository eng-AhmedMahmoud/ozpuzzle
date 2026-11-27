#!/usr/bin/env bash
# The merge gate, run by Jenkins (Jenkinsfile) and by hand when Jenkins is busy:
# clean install, typecheck, the production standalone build that
# scripts/deploy-vps.sh ships, then a smoke run of that server.
#
# Not in the gate yet: `pnpm lint` fails on main with 2 errors (a raw <a> to "/" and a
# synchronous setState in an effect); a follow-up fixes them, then lint joins here.
#   bash scripts/ci-local.sh
set -euo pipefail
cd "$(dirname "$0")/.."

PNPM=(pnpm)
command -v pnpm >/dev/null 2>&1 || PNPM=(corepack pnpm)
export NEXT_TELEMETRY_DISABLED=1

"${PNPM[@]}" install --frozen-lockfile
"${PNPM[@]}" exec tsc --noEmit
NEXT_OUTPUT=standalone "${PNPM[@]}" run build

OUT=.next/standalone
test -f "$OUT/server.js"
mkdir -p "$OUT/.next/static" "$OUT/public"
cp -R .next/static/. "$OUT/.next/static/"
cp -R public/. "$OUT/public/"

PORT="$(node -e 'const s=require("net").createServer().listen(0,()=>{console.log(s.address().port);s.close()})')"
PORT="$PORT" HOSTNAME=127.0.0.1 NODE_ENV=production node "$OUT/server.js" >/tmp/ozpuzzle-ci-server.log 2>&1 &
SERVER=$!
trap 'kill "$SERVER" 2>/dev/null || true' EXIT
for i in $(seq 1 30); do curl -s -o /dev/null "http://127.0.0.1:$PORT/" && break; sleep 1; done
status=0
for path in / /shop; do
  code="$(curl -s -o /dev/null -m 30 -w '%{http_code}' "http://127.0.0.1:$PORT$path" || true)"
  echo "ci-local: $path -> $code"
  [ "$code" = 200 ] || status=1
done
grep -q 'https://ozpuzzle.devya.dev' <(curl -s "http://127.0.0.1:$PORT/") || { echo "ci-local: canonical host is not ozpuzzle.devya.dev" >&2; status=1; }
! curl -s "http://127.0.0.1:$PORT/" | grep -qE '[a-z0-9-]+\.vercel\.app' || { echo "ci-local: page links *.vercel.app" >&2; status=1; }
[ "$status" = 0 ] || { tail -30 /tmp/ozpuzzle-ci-server.log >&2; exit 1; }
echo "ci-local: all steps passed"
