import { APP_KEY, APP_URL, DEFAULT_TITLE, DEFAULT_DESC } from "@/public/settings/there_is_nothing_holding_me_back/config";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";

const Layout = ({
  children,
  title = DEFAULT_TITLE,
  metaTitle = DEFAULT_TITLE,
  metaKeywords = "",
  metaDescription = DEFAULT_DESC
}) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch("/settings/data.json");
      const theme = await response.json();
      setData(theme);
    } catch (err) {
      console.error("Settings load error:", err);
    }
  }

  const favicon = data?.logo?.favicon
    ? `${data?.url}/${data.logo.favicon}`
    : "/favicon.png"; // fallback

  return (
    <>
      <Head>
        <title>{title}</title>

        <link rel="icon" type="image/png" sizes="32x32" href={favicon} />
        <link rel="shortcut icon" href={favicon} />
        <link rel="apple-touch-icon" href={favicon} />
        <link rel="image_src" href={favicon} />

        <link href="/css/fontawesome-all.css" rel="stylesheet" />
        <link href="/css/flaticon.css" rel="stylesheet" />
        <link href="/bootstrap.min.css" rel="stylesheet" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="title" content={metaTitle} />
        <meta name="keywords" content={metaKeywords} />
        <meta name="description" content={metaDescription} />

        <link rel="canonical" href={APP_URL} />

        <meta property="og:site_name" content={DEFAULT_TITLE} />
        <meta property="og:url" content={APP_URL} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={favicon} />
        <meta property="og:image:type" content="image/png" />

        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />

        <meta
          name="google-site-verification"
          content="DlPj7CVm0pxZExMMnC37egWVigS0ZQf9_nfvNAY9E0Q"
        />
      </Head>

      {/* Ahrefs Analytics */}
      <Script
        src="https://analytics.ahrefs.com/analytics.js"
        data-key="NHf4SHH2ipN1p9WCaYSHEQ"
        strategy="afterInteractive"
      />

      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-7DLR2MPMBF"
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-7DLR2MPMBF');
        `}
      </Script>

      <main
        coupon-style={data?.Style || 1}
        store-style={data?.Style || 1}
      >
        {children}
      </main>

      <Script src="/bs.js" strategy="lazyOnload" />
    </>
  );
};

export default Layout;
