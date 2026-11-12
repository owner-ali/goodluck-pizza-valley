# Deploy on Netlify (free, no card)
Website + API in one site. Photos uploaded in the admin panel are stored in MongoDB (max 2 MB each, counts toward Atlas 512 MB).
1. Netlify > Add new site > Import from Git > pick this repo. Build settings come from `netlify.toml`.
2. Site configuration > Environment variables: `MONGODB_URI`, `JWT_SECRET` (and optional `DELIVERY_FEE`).
3. Deploy. Test `https://YOURSITE.netlify.app/api/health` -> `{"ok":true,"db":true}`.
Limits: function timeout 10 s on free; rate-limit counters are per instance; check Netlify's current free-plan credits.
