import {
  APP_KEY,
  APP_URL,
  NEXT_PUBLIC_APP_URL,
} from "@/public/settings/there_is_nothing_holding_me_back/config";

// Helper function to escape XML entities in URLs
const escapeXml = (url) => {
  if (!url) return url;
  return String(url)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

export const getServerSideProps = async ({ res, req }) => {
  // Get frontend URL from environment or config, or use request origin
  let frontendAppUrl = process.env.NEXT_PUBLIC_APP_URL || NEXT_PUBLIC_APP_URL;

  // If no protocol, add http:// (for localhost) or https://
  if (frontendAppUrl && !frontendAppUrl.startsWith("http")) {
    frontendAppUrl = frontendAppUrl.includes("localhost")
      ? `http://${frontendAppUrl}`
      : `https://${frontendAppUrl}`;
  }

  // Fallback to request origin if nothing else available
  if (!frontendAppUrl && req) {
    const protocol =
      req.headers["x-forwarded-proto"] ||
      (req.connection?.encrypted ? "https" : "http");
    const host = req.headers.host;
    frontendAppUrl = `${protocol}://${host}`;
  }

  // Ensure no trailing slash
  frontendAppUrl = frontendAppUrl?.replace(/\/$/, "");

  try {
    // 👉 Yahan apni real Laravel APIs lagao
    const response = await fetch(
      `${APP_URL}api/v1/api-for-sitemap?key=${APP_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const apiData = await response.json();

    // Extract data from API response - sab kuch extract karo
    const blog_categories =
      apiData?.data?.blog_categories || apiData?.blog_categories || [];
    const blogs = apiData?.data?.blogs || apiData?.blogs || [];
    const coupons = apiData?.data?.coupons || apiData?.coupons || [];
    const categories = apiData?.data?.categories || apiData?.categories || [];
    const seasons = apiData?.data?.seasons || apiData?.seasons || [];
    const stores = apiData?.data?.stores || apiData?.stores || [];
    const countries = apiData?.data?.countries || apiData?.countries || [];
    const pages = apiData?.data?.pages || apiData?.pages || [];

    console.log("Sitemap data:", {
      blog_categories: blog_categories.length,
      blogs: blogs.length,
      coupons: coupons.length,
      categories: categories.length,
      seasons: seasons.length,
      stores: stores.length,
      countries: countries.length,
    });

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Home page
    sitemap += `
  <url>
    <loc>${escapeXml(frontendAppUrl)}/</loc>
    <priority>1.00</priority>
  </url>`;

    // Stores page
    sitemap += `
  <url>
    <loc>${escapeXml(frontendAppUrl)}/all-stores</loc>
    <priority>1.00</priority>
  </url>`;
    // Seasons page
    sitemap += `
  <url>
    <loc>${escapeXml(frontendAppUrl)}/seasons</loc>
    <priority>1.00</priority>
  </url>`;
    // Categories page
    sitemap += `
  <url>
    <loc>${escapeXml(frontendAppUrl)}/category</loc>
    <priority>1.00</priority>
  </url>`;
   // Contact page
   sitemap += `
   <url>
     <loc>${escapeXml(frontendAppUrl)}/contact</loc>
     <priority>1.00</priority>
   </url>`;


   // Blog Categories
   if (pages && pages.length > 0) {
    pages.forEach((page) => {
      if (page?.slug) {
        sitemap += `
<url>
  <loc>${escapeXml(`${frontendAppUrl}/pages/${page.slug}`)}</loc>
  <priority>0.90</priority>
</url>`;
      }
    });
  }

    // Blog Categories
    if (blog_categories && blog_categories.length > 0) {
      blog_categories.forEach((blog_category) => {
        if (blog_category?.slug) {
          sitemap += `
  <url>
    <loc>${escapeXml(`${frontendAppUrl}/blogs/${blog_category.slug}`)}</loc>
    <priority>0.90</priority>
  </url>`;
        }
      });
    }

    // Blogs
    if (blogs && blogs.length > 0) {
      blogs.forEach((blog) => {
        if (blog?.slug) {
          sitemap += `
  <url>
    <loc>${escapeXml(`${frontendAppUrl}/blog/${blog.slug}`)}</loc>
    <priority>0.80</priority>
  </url>`;
        }
      });
    }

    // Coupons
    if (coupons && coupons.length > 0) {
      coupons.forEach((coupon) => {
        if (coupon?.slug) {
          sitemap += `
  <url>
    <loc>${escapeXml(`${frontendAppUrl}/coupon/${coupon.slug}`)}</loc>
    <priority>0.70</priority>
  </url>`;
        }
      });
    }

    // Categories
    if (categories && categories.length > 0) {
      categories.forEach((category) => {
        if (category?.slug) {
          sitemap += `
  <url>
    <loc>${escapeXml(`${frontendAppUrl}/category/${category.slug}`)}</loc>
    <priority>0.70</priority>
  </url>`;
        }
      });
    }

    // Seasons
    if (seasons && seasons.length > 0) {
      seasons.forEach((season) => {
        if (season?.slug) {
          sitemap += `
  <url>
    <loc>${escapeXml(`${frontendAppUrl}/season/${season.slug}`)}</loc>
    <priority>0.70</priority>
  </url>`;
        }
      });
    }

    // Stores
    if (stores && stores.length > 0) {
      stores.forEach((store) => {
        if (store?.slug) {
          sitemap += `
  <url>
    <loc>${escapeXml(`${frontendAppUrl}/store/${store.slug}`)}</loc>
    <priority>0.70</priority>
  </url>`;
        }
      });
    }

    // Countries
    if (countries && countries.length > 0) {
      countries.forEach((country) => {
        if (country?.slug) {
          sitemap += `
  <url>
    <loc>${escapeXml(`${frontendAppUrl}/country/${country.slug}`)}</loc>
    <priority>0.60</priority>
  </url>`;
        }
      });
    }

    sitemap += `
</urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error("Sitemap generation error:", error);

    // Generate minimal sitemap with just homepage on error
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeXml(frontendAppUrl)}/</loc>
    <priority>1.00</priority>
  </url>
</urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();
  }

  return { props: {} };
};

export default function Sitemap() {
  return null; // No UI needed
}
