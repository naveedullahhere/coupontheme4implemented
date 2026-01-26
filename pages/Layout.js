import { APP_KEY, APP_URL, NEXT_PUBLIC_APP_URL, DEFAULT_TITLE, DEFAULT_DESC } from "@/public/settings/there_is_nothing_holding_me_back/config";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";

const Layout = ({
  children,
  title = DEFAULT_TITLE,
  metaTitle = DEFAULT_TITLE,
  metaKeywords = "",
  metaDescription = DEFAULT_DESC,
  themeData = null // Props se themeData receive karo
}) => {
  const [data, setData] = useState(themeData);

  useEffect(() => {
    // Agar server-side se data nahi aaya, toh client-side fetch karo
    if (!data && typeof window !== 'undefined') {
      async function fetchData() {
        try {
          const response = await fetch("/settings/data.json");
          const theme = await response.json();
          setData(theme);
        } catch (err) {
          console.error("Settings load error:", err);
        }
      }
      fetchData();
    }
  }, [data]);

  const favicon = data?.logo?.favicon
    ? `${data?.url}/${data.logo.favicon}`
    : "/favicon.png";

  return (
    <>
      <Head>
        {/* Only set meta tags here if they are different from _app.js */}
        {/* Default meta tags - specific page meta tags will override these */}
        {!title && <title>{metaTitle}</title>}
        {title && <title>{title}</title>}
        
        {metaDescription && (
          <meta name="description" content={metaDescription} />
        )}
        
        {metaKeywords && (
          <meta name="keywords" content={metaKeywords} />
        )}

        {/* Favicon and other head elements */}
        <link rel="icon" type="image/png" sizes="32x32" href={favicon} />
        <link rel="shortcut icon" href={favicon} />
        <link rel="apple-touch-icon" href={favicon} />
        <link rel="image_src" href={favicon} />

        <link href="/css/fontawesome-all.css" rel="stylesheet" />
        <link href="/css/flaticon.css" rel="stylesheet" />
        <link href="/bootstrap.min.css" rel="stylesheet" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="title" content={metaTitle || title} />

        <link rel="canonical" href={NEXT_PUBLIC_APP_URL} />

        <meta property="og:site_name" content={metaTitle || title} />
        <meta property="og:url" content={NEXT_PUBLIC_APP_URL} />
        <meta property="og:title" content={metaTitle || title} />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={favicon} />
        <meta property="og:image:type" content="image/png" />

        <meta name="twitter:title" content={metaTitle || title} />
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