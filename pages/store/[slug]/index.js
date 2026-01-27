// pages/store/[slug].js
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Modal from "@/components/store/modal";
import { useRouter } from "next/router";
import Link from "next/link";
import Sidepanel from "@/components/store/sidepanel";
import Detail from "@/components/store/detail";
import {
  APP_KEY,
  APP_URL,
} from "@/public/settings/there_is_nothing_holding_me_back/config";
import Spinner from "@/components/Spinner";
import Favoritebrands from "@/components/Favoritebrands";

const StoreDetailPage = ({ data, metas, setMetas, initialMetas, slug }) => {
  const router = useRouter();
  const currentSlug = router?.query?.slug || slug;
  let couponid = router?.query?.couponid;

  const [singlestore, setsinglestore] = useState({});
  const [err, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set initial metas from server-side
    if (initialMetas) {
      setMetas(initialMetas);
    }
  }, [initialMetas, setMetas]);

  useEffect(() => {
    if (!currentSlug) return;

    setLoading(true);
    fetch(
      `${APP_URL}api/single-store/${currentSlug}?key=${APP_KEY}&cou=${couponid}`,
    )
      .then((res) => res.json())
      .then((json) => {
        setsinglestore(json);

        // Update metas with store data
        setMetas({
          ...metas,
          title: `${json?.data?.store?.name ? json?.data?.store?.name + " Coupons & Promo Codes" : "Coupon & Promo Codes"}`,
          metaTitle:
            json?.data?.store?.seo_title ||
            `${json?.data?.store?.name ? json?.data?.store?.name + " Coupons & Promo Codes" : "Coupon & Promo Codes"}`,
          metaDescription:
            json?.data?.store?.seo_description ||
            `${json?.data?.store?.name || "Store"} coupon codes, promo codes and discounts`,
          metaKeyword:
            json?.data?.store?.meta_key ||
            `${json?.data?.store?.name || "store"}, coupon codes, promo codes, discounts, deals`,
        });

        setError(null);
        setLoading(false);

        if (json.success === false) {
          setError("No Store Found!");
          // Reset to default metas if store not found
          setMetas({
            ...metas,
            title: `Store Not Found`,
            metaTitle: `Store Not Found`,
            metaDescription: `The store you're looking for doesn't exist or has been removed.`,
            metaKeyword: `store, coupon codes, promo codes`,
          });
        }
      })
      .catch((err) => {
        setError("Error loading store");
        setLoading(false);
      });
  }, [currentSlug, couponid]);

  if (loading)
    return (
      <div className="bg-white vh-100 vw-100 d-flex justify-content-center overflow-hidden align-items-center position-fixed top-0 start-0 z-1">
        <Spinner />
      </div>
    );

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-3 col-12  my-md-5 my-2 h-100">
            <Sidepanel
              sidepanelapi={singlestore}
              img={singlestore.url}
              data={data}
            />
          </div>
          <div className="col-md-9 col-12 my-md-5 my-2 px-2">
            <Detail
              storedetailapi={singlestore}
              img={singlestore.url}
              data={data}
            />
          </div>
        </div>
      </div>
      {router.query.couponid && (
        <Modal
          popup={singlestore?.data?.popup_coupon}
          store={singlestore?.data?.store?.name}
          data={data}
          img={data.url}
        />
      )}
      <Favoritebrands styledata={data} />
    </>
  );
};

// Server-side props
StoreDetailPage.getInitialProps = async ({ query, req }) => {
  const { slug } = query;

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
        "data.json",
      );
      const fileContents = fs.readFileSync(filePath, "utf8");
      themeData = JSON.parse(fileContents);

      // Try to fetch store data for meta tags
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/proxy-store?slug=${slug}`,
        );
        const storeData = await response.json();

        initialMetas = {
          title: `${storeData?.data?.store?.name ? storeData?.data?.store?.name + " Coupons & Promo Codes" : "Coupon & Promo Codes"}`,
          metaTitle:
            storeData?.data?.store?.seo_title ||
            `${storeData?.data?.store?.name ? storeData?.data?.store?.name + " Coupons & Promo Codes" : "Coupon & Promo Codes"}`,
          metaDescription:
            storeData?.data?.store?.seo_description ||
            `${storeData?.data?.store?.name || "Store"} coupon codes, promo codes and discounts`,
          metaKeyword:
            storeData?.data?.store?.meta_key ||
            `${storeData?.data?.store?.name || "store"}, coupon codes, promo codes, discounts, deals`,
        };
      } catch (apiError) {
        // Fallback if API fails
        const formattedSlug = slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        initialMetas = {
          title: `${formattedSlug} Coupons & Promo Codes`,
          metaTitle: `${formattedSlug} Coupons & Promo Codes`,
          metaDescription: `${formattedSlug} coupon codes, promo codes and discounts`,
          metaKeyword: `${formattedSlug}, coupon codes, promo codes, discounts, deals`,
        };
      }
    } catch (error) {
      console.error("Error reading data.json on server:", error);
      themeData = {};
      const formattedSlug = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      initialMetas = {
        title: `${formattedSlug} Coupons & Promo Codes`,
        metaTitle: `${formattedSlug} Coupons & Promo Codes`,
        metaDescription: `${formattedSlug} coupon codes, promo codes and discounts`,
        metaKeyword: `${formattedSlug}, coupon codes, promo codes, discounts, deals`,
      };
    }
  }

  return {
    themeData,
    initialMetas,
    slug,
  };
};

export default StoreDetailPage;
