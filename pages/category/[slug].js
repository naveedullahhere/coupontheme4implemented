// pages/category/[slug].js
import Categorycrad from "@/components/Categorycard";
import Favoritebrands from "@/components/Favoritebrands";
import Spinner from "@/components/Spinner";
import {
  APP_KEY,
  APP_URL,
} from "@/public/settings/there_is_nothing_holding_me_back/config";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Head from "next/head";

const CategoryPage = ({ data, metas, setMetas, initialMetas, slug }) => {
  const router = useRouter();
  const currentSlug = router?.query?.slug || slug;

  const [catcard, setcatcard] = useState({});
  const [err, setError] = useState(null);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    // Set initial metas from server-side
    if (initialMetas) {
      setMetas(initialMetas);
    }
  }, [initialMetas, setMetas]);

  useEffect(() => {
    if (!currentSlug) return;

    setloading(true);
    fetch(`${APP_URL}api/store?key=${APP_KEY}&category=${currentSlug}`)
      .then((res) => res.json())
      .then((json) => {
        setloading(false);
        setcatcard(json);

        // Update metas with category data
        setMetas({
          ...metas,
          title: `${json?.name ? json?.name + " Coupons & Promo Codes" : "Coupon & Promo Codes"}`,
          metaTitle: `${json?.name ? json?.name + " Coupons & Promo Codes" : "Coupon & Promo Codes"}`,
          metaDescription: json?.description
            ? json.description.replace(/<[^>]*>/g, "")
            : `Find the best ${json?.name || "category"} coupon codes, promo codes and discounts`,
          metaKeyword: `${json?.name || "category"}, coupon codes, promo codes, discounts, deals`,
        });

        if (json.success === false) {
          setError(json?.message);
        } else {
          setError(null);
        }
      })
      .catch((err) => {
        setError("No Category Found!");
        setloading(false);
      });
  }, [currentSlug]);

  if (loading)
    return (
      <div className="bg-white vh-100 vw-100 d-flex justify-content-center overflow-hidden align-items-center position-fixed top-0 start-0 z-1">
        <Spinner />
      </div>
    );

  return (
    <div className="min-vh-100">
      {err ? (
        <>
          <div className="container my-3">
            <h2> {catcard.name} Coupons & Promo Codes</h2>
            <p className="text-center my-auto py-5">{err}</p>
          </div>
        </>
      ) : (
        <div className="container my-3">
          <div className="row">
            <h2> {catcard.name} Coupons & Promo Codes</h2>
            {catcard?.data?.map((item) => {
              return (
                <div className="cat-card col-md-4">
                  <Link href={`/store/${item.slug}`}>
                    {" "}
                    <Categorycrad item={item} img={catcard.url} data={data} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {data?.Style === 1 ? (
        <Favoritebrands />
      ) : (
        <>
          <div className="container bg-white p-2 mb-2">
            <p
              className="mb-0"
              dangerouslySetInnerHTML={{ __html: catcard.description }}
            ></p>
          </div>
        </>
      )}
    </div>
  );
};

// Server-side props
CategoryPage.getInitialProps = async ({ query, req }) => {
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

      // Fetch category name from API to set proper meta tags
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/proxy-category?slug=${slug}`,
        );
        const categoryData = await response.json();

        initialMetas = {
          title: `${categoryData?.name || slug} Coupons & Promo Codes`,
          metaTitle: `${categoryData?.name || slug} Coupons & Promo Codes`,
          metaDescription: categoryData?.description
            ? categoryData.description.replace(/<[^>]*>/g, "")
            : `Find the best ${categoryData?.name || slug} coupon codes, promo codes and discounts`,
          metaKeyword: `${categoryData?.name || slug}, coupon codes, promo codes, discounts, deals`,
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
          metaDescription: `Find the best ${formattedSlug} coupon codes, promo codes and discounts`,
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
        metaDescription: `Find the best ${formattedSlug} coupon codes, promo codes and discounts`,
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

export default CategoryPage;
