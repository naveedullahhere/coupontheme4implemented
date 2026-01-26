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
import { useRouter } from "next/router";

const Toaster = dynamic(
  () => import("react-hot-toast").then((c) => c.Toaster),
  {
    ssr: false,
  }
);

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(true);
  const [category, setcategory] = useState();
  const [season, setseason] = useState();
  const [coupons, setcoupons] = useState();
  const [country, setcountry] = useState();
  
  // Initialize metas with serverData if available (for server-side rendering)
  const serverData = pageProps?.serverData;
  const [metas, setMetas] = useState({
    title: serverData?.siteTitle || "Home",
    metaTitle: serverData?.meta?.title || serverData?.siteTitle || "",
    metaDescription: serverData?.meta?.description || "",
    metaKeyword: serverData?.meta?.keywords || "More Coupon Codes",
  });
  
  // Check if current page is home page (has its own Head with meta tags)
  // During SSR, router.pathname might not be available, so check pageProps.serverData
  // If serverData exists, it means getServerSideProps ran, which only happens on home page
  const isHomePage = pageProps?.serverData !== undefined || router.pathname === '/';

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/settings/data.json");
      const theme = await response.json();

      setData(theme);
      setcategory(theme?.category);
      setcoupons(theme?.type);
      setseason(theme?.season);
      setcountry(theme?.country);
      setLoading(false);
      
      // Update metas with serverData if available (for initial server-side render)
      if (serverData) {
        setMetas({
          title: serverData?.siteTitle || "Home",
          metaTitle: serverData?.meta?.title || serverData?.siteTitle || "",
          metaDescription: serverData?.meta?.description || "",
          metaKeyword: serverData?.meta?.keywords || "More Coupon Codes",
        });
      }
    }
    fetchData();
  }, []);

  if (loading)
    return (
      <Layout
        title={`${data?.siteTitle ? data?.siteTitle : "Home"}`}
        metaTitle={`${data?.siteTitle ? data?.siteTitle : "Home"}`}
        metaDescription={`${
          data?.meta ? data?.meta?.description : "More Coupon Codes"
        }`}
        logo=""
        metaKeywords={`${
          data?.meta ? data?.meta?.keywords : "More Coupon Codes"
        }`}
      >
        <div className="bg-white vh-100 vw-100 d-flex justify-content-center align-items-center">
          <Spinner />
        </div>
      </Layout>
    );
  if (err)
    return (
      <div className="text-center error my-auto vw-100 vh-100 d-flex justify-content-center align-items-center">
        Something went wrong!
      </div>
    );
  else {
    return (
      <>
        <Head>
          {data?.head_scripts && (
            <script
              dangerouslySetInnerHTML={{
                __html: data.head_scripts
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
              --primary: ${data?.color?.primary || "green"};
              --secondary: ${data?.color?.secondary || "#1b96b8"};
              --header: ${data?.header?.background || "blue"};
              --header-text: ${data?.header?.color || "white"};
              --header-btn-bg: ${data?.header?.button_background || "white"};
              --header-btn-text: ${data?.header?.button_color || "white"};
              --footer-bg: ${data?.footer?.background || "blue"};
              --footer-text: ${data?.footer?.color || "white"};
              --body-bg: ${data.Style === 4 ? "#ffffff" : "#eeee"};
              --font-family-body: ${data.Style === 4
                ? "neuzeit-grotesk, Calibri"
                : "Calibri"};
              --font-family-heading: ${data.Style === 4
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
            title={`${metas.title}`}
            metaTitle={`${metas.metaTitle}`}
            metaDescription={metas.metaDescription}
            logo=""
            metaKeywords={metas.metaKeyword}
            skipMetaTags={isHomePage}
          >
            {data.Style === 1 && (
              <Header1
                data={data}
                category={category}
                season={season}
                coupons={coupons}
                country={country}
              />
            )}
            {data.Style === 2 && (
              <Header2
                data={data}
                category={category}
                season={season}
                coupons={coupons}
                country={country}
              />
            )}
            {data.Style === 4 && (
              <Header4
                data={data}
                category={category}
                season={season}
                coupons={coupons}
                country={country}
              />
            )}
            <div className={`min-vh-90`}>
              <Component
                {...pageProps}
                data={data}
                metas={metas}
                setMetas={setMetas}
              />
            </div>
            <Toaster position="top-right" />
            {data.Style === 1 && (
              <Footer1
                data={data}
                category={category}
                season={season}
                coupons={coupons}
                country={country}
              />
            )}
            {data.Style === 2 && (
              <Footer2
                data={data}
                category={category}
                season={season}
                coupons={coupons}
                country={country}
              />
            )}
            {data.Style === 4 && (
              <>
                <Footer4
                  data={data}
                  category={category}
                  season={season}
                  coupons={coupons}
                  country={country}
                />
              </>
            )}
          </Layout>
        </div>
      </>
    );
  }
}
