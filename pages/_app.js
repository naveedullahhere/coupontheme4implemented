// pages/_app.js
import "@/styles/globals.css";
import Header1 from "@/components/layout/Header1";
import Header2 from "@/components/layout/Header2";
import Layout from "./Layout";
import Footer1 from "@/components/layout/Footer1";
import Footer2 from "@/components/layout/Footer2";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import {
  APP_URL,
  APP_KEY,
  CONTAINER_TYPE,
} from "@/public/settings/there_is_nothing_holding_me_back/config";
import Spinner from "@/components/Spinner";
import Header4 from "@/components/layout/Header4";
import Footer4 from "@/components/layout/Footer4";
import "@/public/fonts/font-dec.css";
import Head from "next/head";

const Toaster = dynamic(
  () => import("react-hot-toast").then((c) => c.Toaster),
  {
    ssr: false,
  }
);

export default function App({ 
  Component, 
  pageProps,
  themeData
}) {
  const [data, setData] = useState(themeData || {});
  const [loading, setLoading] = useState(!themeData);
  const [err, setErr] = useState(false);
  const [category, setCategory] = useState(themeData?.category || []);
  const [season, setSeason] = useState(themeData?.season || []);
  const [coupons, setCoupons] = useState(themeData?.type || []);
  const [country, setCountry] = useState(themeData?.country || []);
  
  // Initialize metas from pageProps
  const [metas, setMetas] = useState(pageProps.initialMetas || {
    title: "Home",
    metaTitle: "",
    metaDescription: "More Coupon Codes",
    metaKeyword: "More Coupon Codes",
  });

  useEffect(() => {
    if (!themeData && typeof window !== 'undefined') {
      async function fetchData() {
        try {
          setLoading(true);
          const response = await fetch("/settings/data.json");
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const theme = await response.json();
          setData(theme);
          setCategory(theme?.category || []);
          setSeason(theme?.season || []);
          setCoupons(theme?.type || []);
          setCountry(theme?.country || []);
          
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setErr(true);
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [themeData]);

  // Update metas when pageProps change
  useEffect(() => {
    if (pageProps.initialMetas) {
      setMetas(pageProps.initialMetas);
    }
  }, [pageProps.initialMetas]);

  if (loading && !themeData) {
    return (
      <Layout>
        <div className="bg-white vh-100 vw-100 d-flex justify-content-center align-items-center">
          <Spinner />
        </div>
      </Layout>
    );
  }

  if (err && !themeData) {
    return (
      <div className="text-center error my-auto vw-100 vh-100 d-flex justify-content-center align-items-center">
        Something went wrong!
      </div>
    );
  }

  const currentData = themeData || data;
  const currentCategory = category;
  const currentSeason = season;
  const currentCoupons = coupons;
  const currentCountry = country;
  
  // Favicon URL
  const favicon = currentData?.logo?.favicon
    ? `${currentData?.url}/${currentData.logo.favicon}`
    : "/favicon.png";

  return (
    <>
      <Head>
        {/* Title */}
        <title>{metas.title}</title>
        
        {/* Basic Meta Tags */}
        <meta name="description" content={metas.metaDescription} />
        <meta name="keywords" content={metas.metaKeyword} />
        
        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href={favicon} />
        <link rel="shortcut icon" href={favicon} />
        <link rel="apple-touch-icon" href={favicon} />
        <link rel="image_src" href={favicon} />
        
        {/* External CSS */}
        <link href="/css/fontawesome-all.css" rel="stylesheet" />
        <link href="/css/flaticon.css" rel="stylesheet" />
        <link href="/bootstrap.min.css" rel="stylesheet" />
        
        {/* OG Tags */}
        <meta property="og:title" content={metas.metaTitle || metas.title} />
        <meta property="og:description" content={metas.metaDescription} />
        <meta property="og:image" content={favicon} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Cards */}
        <meta name="twitter:title" content={metas.metaTitle || metas.title} />
        <meta name="twitter:description" content={metas.metaDescription} />
        
        {/* Canonical */}
        <link rel="canonical" href="https://helloluvvy.com" />
        
        {/* Additional OG Tags */}
        <meta property="og:site_name" content={metas.metaTitle || metas.title} />
        <meta property="og:url" content="https://helloluvvy.com" />
        <meta property="og:image:type" content="image/png" />
        
        {/* Google Verification */}
        <meta name="google-site-verification" content="DlPj7CVm0pxZExMMnC37egWVigS0ZQf9_nfvNAY9E0Q" />
        
        {/* Head Scripts */}
        {currentData?.head_scripts && (
          <script
            dangerouslySetInnerHTML={{
              __html: currentData.head_scripts
                .replace(/<script>/gi, "")
                .replace(/<\/script>/gi, "")
                .trim(),
            }}
          />
        )}
      </Head>

      <style jsx global>
        {`
          :root {
            --primary: ${currentData?.color?.primary || "green"};
            --secondary: ${currentData?.color?.secondary || "#1b96b8"};
            --header: ${currentData?.header?.background || "blue"};
            --header-text: ${currentData?.header?.color || "white"};
            --header-btn-bg: ${currentData?.header?.button_background || "white"};
            --header-btn-text: ${currentData?.header?.button_color || "white"};
            --footer-bg: ${currentData?.footer?.background || "blue"};
            --footer-text: ${currentData?.footer?.color || "white"};
            --body-bg: ${currentData?.Style === 4 ? "#ffffff" : "#eeee"};
            --font-family-body: ${currentData?.Style === 4
              ? "neuzeit-grotesk, Calibri"
              : "Calibri"};
            --font-family-heading: ${currentData?.Style === 4
              ? "neuzeit-grotesk"
              : "Calibri"};
          }
        `}
      </style>

      <div
        className={`_element ${
          CONTAINER_TYPE === "wide" ? "wide" : "none-wide"
        }`}
      >
        <Layout
          themeData={currentData}
          favicon={favicon}
        >
          {currentData?.Style === 1 && (
            <Header1
              data={currentData}
              category={currentCategory}
              season={currentSeason}
              coupons={currentCoupons}
              country={currentCountry}
            />
          )}
          {currentData?.Style === 2 && (
            <Header2
              data={currentData}
              category={currentCategory}
              season={currentSeason}
              coupons={currentCoupons}
              country={currentCountry}
            />
          )}
          {currentData?.Style === 4 && (
            <Header4
              data={currentData}
              category={currentCategory}
              season={currentSeason}
              coupons={currentCoupons}
              country={currentCountry}
            />
          )}
          <div className={`min-vh-90`}>
            <Component
              {...pageProps}
              data={currentData}
              metas={metas}
              setMetas={setMetas}
              category={currentCategory}
              season={currentSeason}
              coupons={currentCoupons}
              country={currentCountry}
            />
          </div>
          <Toaster position="top-right" />
          {currentData?.Style === 1 && (
            <Footer1
              data={currentData}
              category={currentCategory}
              season={currentSeason}
              coupons={currentCoupons}
              country={currentCountry}
            />
          )}
          {currentData?.Style === 2 && (
            <Footer2
              data={currentData}
              category={currentCategory}
              season={currentSeason}
              coupons={currentCoupons}
              country={currentCountry}
            />
          )}
          {currentData?.Style === 4 && (
            <Footer4
              data={currentData}
              category={currentCategory}
              season={currentSeason}
              coupons={currentCoupons}
              country={currentCountry}
            />
          )}
        </Layout>
      </div>
    </>
  );
}

// Server-side data fetching using getInitialProps
App.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};
  let themeData = null;

  // Only fetch on server-side
  if (typeof window === 'undefined') {
    try {
      const fs = (await import('fs')).default;
      const path = (await import('path')).default;
      
      const filePath = path.join(process.cwd(), 'public', 'settings', 'data.json');
      const fileContents = fs.readFileSync(filePath, 'utf8');
      themeData = JSON.parse(fileContents);
    } catch (error) {
      console.error("Error reading data.json on server:", error);
      themeData = {};
    }
  }

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return {
    pageProps,
    themeData,
  };
};