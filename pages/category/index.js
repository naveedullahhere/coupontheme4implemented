// pages/categories/index.js
import Spinner from "@/components/Spinner";
import {
  APP_KEY,
  APP_URL,
} from "@/public/settings/there_is_nothing_holding_me_back/config";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const CategoriesPage = ({ data, metas, setMetas, initialMetas }) => {
  const [favcat, setfavcat] = useState({});
  const [err, setError] = useState(false);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    // Set initial metas from server-side
    if (initialMetas) {
      setMetas(initialMetas);
    }
  }, [initialMetas, setMetas]);

  useEffect(() => {
    fetch(`${APP_URL}api/category?key=${APP_KEY}`)
      .then((res) => res.json())
      .then((json) => {
        setloading(false);
        setfavcat(json);
      })
      .catch((err) => {
        setloading(false);
        setError(err.message);
        setfavcat({});
      });
  }, []);

  if (loading)
    return (
      <div className="bg-white vh-100 vw-100 d-flex justify-content-center overflow-hidden align-items-center position-fixed top-0 start-0 z-1">
        <Spinner />
      </div>
    );

  return (
    <div className="container my-5">
      <h3>CODES FOR YOUR FAVOURITE CATEGORIES</h3>
      <div className="row bg-white py-3 px-2">
        {favcat?.map((item) => {
          return (
            <div className="col-md-4 col-6  favcat">
              <Link href={`/category/${item.slug}`}>{item.name}</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Server-side props
CategoriesPage.getInitialProps = async ({ query, req }) => {
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

      initialMetas = {
        title: `Category ${themeData?.siteTitle ? "- " + themeData?.siteTitle : ""}`,
        metaTitle: `Category ${themeData?.siteTitle ? "- " + themeData?.siteTitle : ""}`,
        metaDescription:
          "Browse all categories and find the best coupon codes, promo codes and discounts for your favorite brands",
        metaKeyword:
          "categories, coupon codes, promo codes, discounts, deals, brands",
      };
    } catch (error) {
      console.error("Error reading data.json on server:", error);
      themeData = {};
      initialMetas = {
        title: "Categories",
        metaTitle: "Categories",
        metaDescription:
          "Browse all categories and find the best coupon codes, promo codes and discounts for your favorite brands",
        metaKeyword:
          "categories, coupon codes, promo codes, discounts, deals, brands",
      };
    }
  }

  return {
    themeData,
    initialMetas,
  };
};

export default CategoriesPage;
