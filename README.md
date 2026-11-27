This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Hosting

https://ozpuzzle.devya.dev — a demo storefront for OZ Puzzle that reads ozpuzzle.com's public
Shopify JSON (no token; checkout hands off to the real store). The Next standalone server runs
in a stock `node:24.22.1-alpine` container (`ozpuzzle`, loopback `127.0.0.1:3198`) behind nginx
on the Devya VPS (`deploy/nginx/ozpuzzle.conf`, TLS by certbot). It left Vercel on 2026-11-27.

- **Deploy:** `bash scripts/deploy-vps.sh` builds origin/main on the Mac (nothing builds on the
  VPS), ships `releases/<sha>`, points `current` at it and restarts the container. First time:
  `--setup` installs the nginx site and the certificate.
- **Merge gate:** Jenkins `continuous-integration/jenkins/pr-head`, which runs
  `bash scripts/ci-local.sh` (lint, typecheck, standalone build, smoke run).
