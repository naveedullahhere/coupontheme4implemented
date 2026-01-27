// pages/index.js
import Newcoupon from "@/components/Newcoupon";
import Favorite from "@/components/Favoritebrands";
import Couponslider from "@/components/Couponslider";
import Popularcoupon from "@/components/Popularcoupon";
import Popular from "@/components/Popular";
import Slider from "@/components/Slider";
import Layout from "./Layout";
import Subscribe from "@/components/Subscribe";
import {
  APP_KEY,
  APP_NAME,
  APP_URL,
} from "@/public/settings/there_is_nothing_holding_me_back/config";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import CategoryWiseBlog from "@/components/CategoryWiseBlog";

export default function Home({ data, setMetas, metas, initialMetas }) {
  const [loading, setloading] = useState(true);
  const [homeData, setHomeData] = useState([]);
  const [err, seterr] = useState(null);

  useEffect(() => {
    // Set initial metas from server-side
    if (initialMetas) {
      setMetas(initialMetas);
    }
  }, [initialMetas, setMetas]);

  useEffect(() => {
    // Client-side metas update
    setMetas({
      title: data?.siteTitle ? data?.siteTitle : "Home",
      metaTitle: data?.siteTitle ? data?.siteTitle : "Home",
      metaDescription: `${data?.meta ? data?.meta?.description : "Find the best coupon codes, promo codes and discounts"}`,
      metaKeyword: `${data?.meta ? data?.meta?.keywords : "coupon codes, promo codes, discounts, deals"}`,
    });

    fetch(`${APP_URL}api/home?key=${APP_KEY}`)
      .then((res) => res.json())
      .then((dta) => {
        setloading(false);

        if (dta.success === false) {
          seterr("Something Went Wrong!");
        } else {
          setHomeData(dta?.data);
          seterr(null);
        }
      })
      .catch((err) => {
        setloading(false);
        seterr(err.message);
      });
  }, [data, setMetas]);

  if (loading)
    return (
      <div className="bg-white vh-100 vw-100 d-flex justify-content-center align-items-center">
        <Spinner />
      </div>
    );
  if (err)
    return (
      <div className="text-center error my-auto vw-100 vh-100 d-flex justify-content-center align-items-center">
        Something went wrong!
      </div>
    );
  else {
    return (
      <div className={`${data.Style === 4 ? "blogbg" : ""} `}>
        <Slider data={data} sliderData={homeData} />
        {data.Style === 4 && <CategoryWiseBlog data={data} />}

        {data.Style === 2 && <Subscribe data={data} />}

        {data.Style === 1 ||
          (data.Style === 2 && (
            <>
              <Popular styledata={data} popularStore={homeData} />
              <Popularcoupon data={data} popCoupon={homeData} />
            </>
          ))}

        {data.Style === 1 && (
          <>
            <Newcoupon styledata={data} trendingCoupon={homeData} />
          </>
        )}

        {data.Style !== 4 ? <Favorite styledata={data} /> : ""}
      </div>
    );
  }
}

// Server-side props for home page
Home.getInitialProps = async ({ query, req }) => {
  let themeData = null;
  let initialMetas = null;

  // Only fetch on server-side
  if (typeof window === "undefined") {
    try {
      const fs = (await import("fs")).default;
      const path = (await import("path")).default;

      const filePath = path.join(
        process.cwd(),
        "public",
        "settings",
        "data.json"
      );
      const fileContents = fs.readFileSync(filePath, "utf8");
      themeData = JSON.parse(fileContents);
      
      initialMetas = {
        title: themeData?.siteTitle ? themeData?.siteTitle : "Home",
        metaTitle: themeData?.siteTitle ? themeData?.siteTitle : "Home",
        metaDescription: `${themeData?.meta ? themeData?.meta?.description : "Find the best coupon codes, promo codes and discounts"}`,
        metaKeyword: `${themeData?.meta ? themeData?.meta?.keywords : "coupon codes, promo codes, discounts, deals"}`,
      };
    } catch (error) {
      console.error("Error reading data.json on server:", error);
      themeData = {};
      initialMetas = {
        title: "Home",
        metaTitle: "Home",
        metaDescription: "Find the best coupon codes, promo codes and discounts",
        metaKeyword: "coupon codes, promo codes, discounts, deals"
      };
    }
  }

  return {
    themeData,
    initialMetas,
  };
};