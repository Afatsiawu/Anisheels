# TODO

- [x] Fix Render static-site SPA deep-link routing so `/admin` and `/admin/*` load `index.html` instead of returning server 404.
- [ ] Redeploy to Render.
- [ ] Verify `/admin` redirects to `/admin/login` (or loads dashboard if authenticated).
- [ ] Verify other deep links: `/admin/products`, `/admin/orders`, etc.

- [x] Fix ESLint crash on deployment by disabling `@typescript-eslint/no-unused-expressions` in `eslint.config.js` (caused by TS 5.6.x + eslint-plugin mismatch).
- [ ] Fix remaining ESLint errors (unused vars) in:
  - [ ] src/pages/OrderConfirmation.tsx
  - [ ] src/pages/admin/AdminLayout.tsx
  - [ ] src/pages/admin/ProductForm.tsx
- [ ] Redeploy to Render again and confirm the app loads without runtime/build errors.

