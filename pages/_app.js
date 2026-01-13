import "@/styles/globals.css";
import Header1 from "@/components/layout/Header1";
import Header2 from "@/components/layout/Header2";
import Layout from "./Layout";
import logo from "@/public/assets/logo.png";
import Slider from "../components/Slider";
import Popular from "@/components/Popular";
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
import { toast } from "react-hot-toast";
import Header4 from "@/components/layout/Header4";
import Footer4 from "@/components/layout/Footer4";

const Toaster = dynamic(
  () => import("react-hot-toast").then((c) => c.Toaster),
  {
    ssr: false,
  }
);

export default function App({ Component, pageProps }) {
  const [data, setData] = useState([]);

  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(true);
  const [category, setcategory] = useState();
  const [season, setseason] = useState();
  const [coupons, setcoupons] = useState();
  const [country, setcountry] = useState();
  const [metas, setMetas] = useState({
    title: data?.siteTitle ? data?.siteTitle : "Home",
    metaTitle: data?.siteTitle ? data?.siteTitle : "",
    metaDescription: `${data?.meta ? data?.meta?.description : ""}`,
    metaKeyword: `${data?.meta ? data?.meta?.keywords : "More Coupon Codes"}`,
  });

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
    }
    fetchData();
  }, []);

  console.log(data?.header?.background);

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
      <div
        className={`_element ${
          CONTAINER_TYPE === "wide" ? "wide" : "none-wide"
        }`}
      >
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
            }
          `}
        </style>

        <Layout
          title={`${metas.title}`}
          metaTitle={`${metas.metaTitle}`}
          metaDescription={metas.metaDescription}
          logo=""
          metaKeywords={metas.metaKeyword}
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
            <Footer4
              data={data}
              category={category}
              season={season}
              coupons={coupons}
              country={country}
            />
          )}
        </Layout>
      </div>
    );
  }
}
