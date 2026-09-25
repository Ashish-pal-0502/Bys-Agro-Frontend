import fs from "fs";
import { create } from "apisauce";

// This script runs with plain node before `next build`, so load .env.local ourselves.
for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // file not present; rely on the real environment
  }
}

const stripSlash = (url) => (url || "").replace(/\/+$/, "");

const API_URL = stripSlash(process.env.NEXT_PUBLIC_SERVER);
const BASE_URL = stripSlash(process.env.SITEMAP_BASE_URL || process.env.NEXT_PUBLIC_CLIENT);

const isLocal = (url) => /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(url);
const isBuildServer = Boolean(process.env.CI || process.env.VERCEL || process.env.AWS_BRANCH);

if (!API_URL || !BASE_URL) {
  console.error("Sitemap: set NEXT_PUBLIC_SERVER and NEXT_PUBLIC_CLIENT (or SITEMAP_BASE_URL).");
  process.exit(1);
}

if (isLocal(BASE_URL)) {
  if (isBuildServer) {
    console.error(`Sitemap: refusing to publish localhost URLs from a build server (BASE_URL=${BASE_URL}).`);
    process.exit(1);
  }
  console.warn(`Sitemap: BASE_URL is ${BASE_URL}. Set NEXT_PUBLIC_CLIENT to the real domain before deploying.`);
}

const apiClient = create({ baseURL: API_URL });

const writeFileAsync = fs.promises.writeFile;

// ---- SETTINGS ----
const PRODUCTS_PER_SITEMAP = 5000;
const BLOGS_PER_SITEMAP = 5000;

// ---- CREATE DIRECTORY ----
function ensureDir(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
}

// ---- PAGINATION FUNCTION ----
function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// ---- PRODUCT PAGINATED SITEMAPS ----
async function generateProductSitemaps() {
  console.log("📦 Generating product sitemaps for Bys Agro...");

  const response = await apiClient.get("/product/get-all-products");
  if (!response.ok || !response.data?.products) {
    console.warn("⚠️ Cannot fetch products");
    return [];
  }

  const products = response.data.products;

  // For Bys Agro, each product is standalone (no variants)
  // Use groupId for the product URL
  const productUrls = [];

  products.forEach((product) => {
    if (!product.groupId) return;

    // Only include active products
    if (product.isActive === false) return;

    productUrls.push({
      loc: `${BASE_URL}/product/${product.groupId}`,
      priority: 0.8,
      lastmod: product.updatedAt || new Date().toISOString(),
    });
  });

  // Remove duplicates (in case same groupId appears multiple times)
  const uniqueProductUrls = [];
  const seenGroupIds = new Set();
  
  productUrls.forEach((url) => {
    // Extract groupId from URL
    const groupId = url.loc.split('/').pop();
    if (!seenGroupIds.has(groupId)) {
      seenGroupIds.add(groupId);
      uniqueProductUrls.push(url);
    }
  });

  const chunks = chunkArray(uniqueProductUrls, PRODUCTS_PER_SITEMAP);
  ensureDir("public/product");

  const sitemapFiles = [];

  for (let i = 0; i < chunks.length; i++) {
    const items = chunks[i];

    const xmlItems = items
      .map(
        (item) => `
  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod || new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${item.priority}</priority>
  </url>`,
      )
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`;

    const fileName = `public/product/sitemap-${i + 1}.xml`;
    await writeFileAsync(fileName, xml);

    sitemapFiles.push(`${BASE_URL}/product/sitemap-${i + 1}.xml`);
    console.log(
      `✅ Created product sitemap ${i + 1} with ${items.length} URLs`,
    );
  }

  return sitemapFiles;
}

// ---- BLOG PAGINATED SITEMAPS ----
async function generateBlogSitemaps() {
  console.log("📝 Generating blog sitemaps...");

  const response = await apiClient.get("/blog/get-all-blogs");
  if (!response.ok || !response.data?.blogs) {
    console.warn("⚠️ Cannot fetch blogs");
    return [];
  }

  const blogs = response.data.blogs;
  
  // Filter only active blogs if you have that field
  const activeBlogs = blogs.filter(blog => blog.isActive !== false);
  
  const chunks = chunkArray(activeBlogs, BLOGS_PER_SITEMAP);

  ensureDir("public/blog");

  const sitemapFiles = [];

  for (let i = 0; i < chunks.length; i++) {
    const items = chunks[i];

    const xmlItems = items
      .map((b) => {
        // Use either _id or slug for URL
        const blogId = b.slug || b._id;
        return `
  <url>
    <loc>${BASE_URL}/blogs/${blogId}</loc>
    <lastmod>${b.updatedAt || new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`;

    const fileName = `public/blog/sitemap-${i + 1}.xml`;
    await writeFileAsync(fileName, xml);

    sitemapFiles.push(`${BASE_URL}/blog/sitemap-${i + 1}.xml`);
    console.log(`✅ Created blog sitemap ${i + 1}`);
  }

  return sitemapFiles;
}



// ---- CATEGORY SITEMAP ----
// ---- STATIC SITEMAP ----
async function generateStaticSitemap() {
  ensureDir("public/static");

  const staticPaths = [
    "/",
    "/blogs",
    "/all-products",
    "/about-us",
    "/contact-us",
    "/privacy-policy",
    "/terms-conditions",
    "/refund-policy",
  ];

  const xmlItems = staticPaths
    .map((url) => {
      return `
  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === "/" ? 1.0 : 0.5}</priority>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`;

  await writeFileAsync("public/static/sitemap.xml", xml);

  return [`${BASE_URL}/static/sitemap.xml`];
}

// ---- MAIN INDEX ----
async function generateIndexSitemap(allSitemaps) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allSitemaps
  .map(
    (loc) => `
  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`,
  )
  .join("")}
</sitemapindex>`;

  await writeFileAsync("public/sitemap.xml", xml);
  console.log("🏁 Main index sitemap created");
}

// ---- RUN ALL ----
(async () => {
  console.log("🚀 Starting sitemap generation for Bys Agro...\n");

  const staticSitemap = await generateStaticSitemap();
  const productSitemaps = await generateProductSitemaps();
  const blogSitemaps = await generateBlogSitemaps();
  // const concernSitemap = await generateConcernSitemap();

  const allSitemaps = [
    ...staticSitemap,
    ...productSitemaps,
    ...blogSitemaps,
    // ...concernSitemap,
  ];

  console.log(`\n📊 Total sitemaps: ${allSitemaps.length}`);
  console.log("   - Static: 1");
  console.log(`   - Product: ${productSitemaps.length}`);
  console.log(`   - Blog: ${blogSitemaps.length}`);
  // console.log(`   - Concern: ${concernSitemap.length}`);

  await generateIndexSitemap(allSitemaps);

  console.log("\n✅ Sitemap generation complete!");
})();