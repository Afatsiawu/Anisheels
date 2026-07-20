import express from 'express';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 3000;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SITE_URL = process.env.SITE_URL || 'https://anisheels.onrender.com';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

app.get('/', (_req, res) => {
  res.send('OG preview service is running.');
});

app.get('/product/:id', async (req, res) => {
  const productId = Number(req.params.id);
  const destination = `${SITE_URL}/product/${productId}`;

  if (!productId || Number.isNaN(productId)) {
    return res.status(400).send('Invalid product id');
  }

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !product) {
    return res.redirect(302, destination);
  }

  const title = escapeHtml(product.name);
  const description = escapeHtml(
    (product.description && product.description.slice(0, 160)) ||
      `${product.name} - available now on Anisheels.`
  );
  const image = escapeHtml(product.image);
  const price = product.price;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${title}</title>
<meta name="description" content="${description}" />

<meta property="og:type" content="product" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${image}" />
<meta property="og:url" content="${destination}" />
<meta property="og:site_name" content="Anisheels" />
<meta property="product:price:amount" content="${price}" />
<meta property="product:price:currency" content="GHS" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${image}" />

<meta http-equiv="refresh" content="0; url=${destination}" />
<script>window.location.replace(${JSON.stringify(destination)});</script>
</head>
<body>
<p>Redirecting to <a href="${destination}">${title}</a>...</p>
</body>
</html>`;

  res.set('Content-Type', 'text/html; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=300');
  res.status(200).send(html);
});

app.listen(PORT, () => {
  console.log(`OG server listening on port ${PORT}`);
});