# TODO

- [ ] Confirm how Render is returning `/admin` (404 vs served index.html) by checking Render logs.
- [ ] Update `render.yaml` to add explicit SPA rewrite rules for `/admin` (e.g. `/admin`, `/admin/*`) plus catch-all.
- [ ] Ensure build produces `dist/index.html` (confirm by checking build logs or running `npm run build` locally).
- [ ] Deploy again and verify `https://anisheels.onrender.com/admin` loads the SPA.

