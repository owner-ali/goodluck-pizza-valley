# Deployment (free options, honest limits)
Nothing here needs a credit card by itself, but free tiers change. Check each provider's current terms before relying on them.

## 1. Self-host with Docker (full control)
1. `cp server/.env.example server/.env`, set `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
2. `docker compose up --build -d`
3. `docker compose exec server node --env-file=.env src/utils/seedMenu.js` (sample menu) and `docker compose exec server node --env-file=.env src/utils/seedAdmin.js`.
4. Open http://localhost:8080 and sign in at /admin. Then delete `ADMIN_PASSWORD` from `.env`.
Cost: the computer or VPS you run it on (a home server is free but not always online). Put HTTPS in front (for example Caddy or nginx with Let's Encrypt, which is free). Back up the `mongo-data` and `uploads` volumes.

## 2. Free-tier hosting (limits apply)
- Client: any static host (build with `npm run build`, set `VITE_API_URL` to your API URL first).
- API: a free Node host. Free plans often sleep when idle (slow first request) and may have monthly hour limits. Uploaded images on free hosts are usually NOT permanent, so use a persistent disk or a different image store.
- Database: MongoDB Atlas free tier (M0) has a small storage cap and no guarantee of permanent free access. Export backups regularly.
- Set `CLIENT_ORIGIN` on the API to your website's exact URL.

## Before launch checklist
Replace placeholders (admin panel: contact, hours, delivery fee, about, deals, FAQ); replace the sample menu and prices; set a strong `JWT_SECRET` and admin password; use HTTPS; review the Privacy and Terms pages with a professional; replace `YOUR-DOMAIN` in `client/public/sitemap.xml` and `robots.txt`.

---
# Free setup, step by step (Atlas + Render + Netlify or Cloudflare Pages)
Checked against provider pages in Nov 2026. Free terms change, so re-check before relying on them.

## 1. Database: MongoDB Atlas M0
1. Sign up at cloud.mongodb.com, create a free **M0** cluster (512 MB, about 100 operations/second, no SLA, no backups by default).
2. Database Access: create a user. Network Access: allow `0.0.0.0/0` (Render's free IPs change). Use a strong password.
3. Copy the `mongodb+srv://...` connection string and add the database name, e.g. `.../goodluck`.

## 2. Load the data FROM YOUR OWN COMPUTER (free Render has no shell)
In `server/.env` set `MONGODB_URI` (Atlas), `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, then:
`npm i && npm run seed && npm run seed:admin`. Afterwards delete `ADMIN_PASSWORD` from the file.

## 3. API: Render (free web service)
1. Push this project to GitHub. In Render choose **New > Blueprint** and select the repo (uses `render.yaml`), or create a Web Service with root `server`, build `npm install`, start `npm run start:prod`.
2. Set `MONGODB_URI` and `CLIENT_ORIGIN` (your site URL, no trailing slash). `JWT_SECRET` is generated.
3. Your API URL will look like `https://goodluck-api.onrender.com`. Test `/api/health`.
Limits: free services sleep after 15 minutes idle and take about a minute to wake; 750 free instance hours per month; the free disk is not persistent, so **admin photo uploads can disappear** on restart or redeploy. For permanent photos use a paid disk, self-hosting (Docker), or put photos in `client/public/images/` (they ship with the site).

## 4. Website: Netlify or Cloudflare Pages (free static hosting)
- **Netlify:** New site from Git, it reads `netlify.toml`. Add environment variable `VITE_API_URL` = your Render API URL. Pick a site name to get `yourname.netlify.app`.
- **Cloudflare Pages:** root directory `client`, build `npm run build`, output `dist`, env `VITE_API_URL` = your API URL. You get `yourname.pages.dev`.
Then put that exact URL into `CLIENT_ORIGIN` on Render and redeploy the API.

## 5. Subdomain
- Instant and free: `yourname.netlify.app` or `yourname.pages.dev`.
- Your own subdomain (e.g. `pizza.yourdomain.com`): add it in the host's Domains settings, then create the DNS record they show (usually a CNAME) at whoever controls your domain's DNS. This only works if your DNS provider lets you add records. Many free subdomain services (including free `*.site.je`-style names) do not, so ask them or use the free `*.netlify.app` / `*.pages.dev` name.
- After a custom domain works, update `CLIENT_ORIGIN` on Render and the `YOUR-DOMAIN` placeholders in `client/public/sitemap.xml` and `robots.txt`.

## 6. Check it works
Open the site, add an item, place a test order, track it, sign in at `/admin`, approve it. The first request after idle may take about a minute (free Render wake-up).
