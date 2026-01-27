// Layout.js
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
  themeData = null,
  favicon = "/favicon.png" // Accept favicon as prop
}) => {
  const [data, setData] = useState(themeData);

  useEffect(() => {
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

  return (
    <>
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