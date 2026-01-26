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
  },
);

export default function App({ Component, pageProps, themeData, initialMetas }) {
  const [data, setData] = useState(themeData || {});
  const [loading, setLoading] = useState(!themeData);
  const [err, setErr] = useState(false);
  const [metas, setMetas] = useState(
    initialMetas || {
      title: "Home",
      metaTitle: "",
      metaDescription: "More Coupon Codes",
      metaKeyword: "More Coupon Codes",
    },
  );

  useEffect(() => {
    // Only fetch on client-side if server-side data not available
    if (!themeData && typeof window !== "undefined") {
      async function fetchData() {
        try {
          setLoading(true);
          const response = await fetch("/settings/data.json");
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const theme = await response.json();
          setData(theme);

          // Update metas based on fetched data
          setMetas({
            title: theme?.siteTitle ? theme?.siteTitle : "Home",
            metaTitle: theme?.siteTitle ? theme?.siteTitle : "",
            metaDescription: `${theme?.meta ? theme?.meta?.description : "More Coupon Codes"}`,
            metaKeyword: `${theme?.meta ? theme?.meta?.keywords : "More Coupon Codes"}`,
          });

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

  if (loading && !themeData) {
    return (
      <Layout
        title={`Loading...`}
        metaTitle={`Loading...`}
        metaDescription={`Loading...`}
        logo=""
        metaKeywords={`Loading...`}
      >
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

  return (
    <>
      {/* Main Layout component se pehle Head mein meta tags set karo */}
      <Head>
        <title>{metas.title}</title>
        <meta name="description" content={metas.metaDescription} />
        <meta name="keywords" content={metas.metaKeyword} />

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
            --header-btn-bg: ${currentData?.header?.button_background ||
            "white"};
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
        {/* Layout component ko simplified props do */}
        <Layout
          title={metas.title}
          metaTitle={metas.metaTitle}
          metaDescription={metas.metaDescription}
          logo=""
          metaKeywords={metas.metaKeyword}
          themeData={currentData}
        >
          {currentData?.Style === 1 && (
            <Header1
              data={currentData}
              category={currentData?.category}
              season={currentData?.season}
              coupons={currentData?.type}
              country={currentData?.country}
            />
          )}
          {currentData?.Style === 2 && (
            <Header2
              data={currentData}
              category={currentData?.category}
              season={currentData?.season}
              coupons={currentData?.type}
              country={currentData?.country}
            />
          )}
          {currentData?.Style === 4 && (
            <Header4
              data={currentData}
              category={currentData?.category}
              season={currentData?.season}
              coupons={currentData?.type}
              country={currentData?.country}
            />
          )}
          <div className={`min-vh-90`}>
            <Component
              {...pageProps}
              data={currentData}
              metas={metas}
              setMetas={setMetas}
            />
          </div>
          <Toaster position="top-right" />
          {currentData?.Style === 1 && (
            <Footer1
              data={currentData}
              category={currentData?.category}
              season={currentData?.season}
              coupons={currentData?.type}
              country={currentData?.country}
            />
          )}
          {currentData?.Style === 2 && (
            <Footer2
              data={currentData}
              category={currentData?.category}
              season={currentData?.season}
              coupons={currentData?.type}
              country={currentData?.country}
            />
          )}
          {currentData?.Style === 4 && (
            <>
              <Footer4
                data={currentData}
                category={currentData?.category}
                season={currentData?.season}
                coupons={currentData?.type}
                country={currentData?.country}
              />
            </>
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
  let initialMetas = null;

  // Only fetch on server-side
  if (typeof window === "undefined") {
    try {
      // Dynamic import for fs module (only on server)
      const fs = (await import("fs")).default;
      const path = (await import("path")).default;

      const filePath = path.join(
        process.cwd(),
        "public",
        "settings",
        "data.json",
      );
      const fileContents = fs.readFileSync(filePath, "utf8");
      themeData = JSON.parse(fileContents);

      initialMetas = {
        title: themeData?.siteTitle ? themeData?.siteTitle : "Home",
        metaTitle: themeData?.siteTitle ? themeData?.siteTitle : "",
        metaDescription: `${themeData?.meta ? themeData?.meta?.description : "More Coupon Codes"}`,
        metaKeyword: `${themeData?.meta ? themeData?.meta?.keywords : "More Coupon Codes"}`,
      };
    } catch (error) {
      console.error("Error reading data.json on server:", error);
      // Fallback to empty data
      themeData = {};
      initialMetas = {
        title: "Home",
        metaTitle: "",
        metaDescription: "More Coupon Codes",
        metaKeyword: "More Coupon Codes",
      };
    }
  }

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return {
    pageProps,
    themeData,
    initialMetas,
  };
};
