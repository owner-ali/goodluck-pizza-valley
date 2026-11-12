---
title: Good Luck API
emoji: 🍕
colorFrom: red
colorTo: yellow
sdk: docker
app_port: 5000
pinned: false
---
# Good Luck Pizza Valley & Ice Bar
*Taste the Happiness. Feel the Chill.* A 3D restaurant site: React, Vite, TypeScript, Tailwind, Three.js (React Three Fiber), GSAP, Framer Motion, Node, Express, MongoDB. All free and open source.

## Quick start (demo, no database)
```
cd client && npm i && npm test && npm run dev
```
Demo mode shows the sample menu and a localStorage cart. Orders, reservations, reviews and admin need the server (the site never fakes a successful order).

## Full stack
1. MongoDB running (local install or `docker run -p 27017:27017 mongo`).
2. `cd server && cp .env.example .env`, set `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
3. `npm i && npm test && npm run seed && npm run seed:admin && npm run dev`
4. `client/.env`: `VITE_API_URL=http://localhost:5000`, then `npm run dev`. Admin: http://localhost:5173/admin
Self-hosting with Docker and free-tier notes: `docs/DEPLOYMENT.md`. API: `docs/API.md`.

## Structure
`client/src` components, pages, sections, three (3D scenes), admin, hooks, context, services, lib, data. `server/src` config, controllers, models, routes, middleware, validators, utils, uploads.

## Placeholders
Address, phone, hours, delivery fee, menu names and PKR prices are SAMPLE placeholders. The owner edits them in the admin panel.

## Security notes
bcrypt password hashing, JWT (8 h), login rate limit, server-side validation, server-side order pricing, image uploads verified by file signature, Helmet. Admin password and secrets live only in `server/.env`.

## Developer
**CodedByAli**: https://codedbyali.site.je/ (Designed & Developed by CodedByAli)

## Real photos
Drop your own photos in `client/public/images/<product-id>.jpg` (see the README.txt there) or upload them per product in the admin panel. Missing photos fall back to the emoji. `preview/index.html` is a standalone animated design preview (open it in a browser).
