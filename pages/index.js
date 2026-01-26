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
  NEXT_PUBLIC_APP_URL
} from "@/public/settings/there_is_nothing_holding_me_back/config";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import CategoryWiseBlog from "@/components/CategoryWiseBlog";
import fs from "fs";
import path from "path";

export default function Home({ 
  data, 
  setMetas, 
  metas, 
  // Props from getServerSideProps
  serverData,
  serverPageTitle,
  serverMetaTitle,
  serverMetaDescription,
  serverMetaKeywords,
  serverFavicon,
  // New prop for initial home data
  initialHomeData
}) {
  const [loading, setloading] = useState(!initialHomeData); // Only load if no initial data
  const [homeData, setHomeData] = useState(initialHomeData || []);
  const [err, seterr] = useState(null);

  // Use serverData if available (from getServerSideProps)
  const metaData = serverData || data;

  useEffect(() => {
    // Update parent component's metas if needed
    if (setMetas) {
      setMetas({
        title: serverPageTitle || "Home",
        metaTitle: serverMetaTitle || serverPageTitle || "Home",
        metaDescription: serverMetaDescription || "",
        metaKeyword: serverMetaKeywords || "Coupon Codes",
      });
    }

    // Only fetch if we don't have initial data
    if (!initialHomeData) {
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
    }
  }, [initialHomeData]);

  // If still loading and no initial data
  if (loading && !initialHomeData)
    return (
      <Layout
        title={serverPageTitle || "Home"}
        metaTitle={serverMetaTitle || serverPageTitle || "Home"}
        metaDescription={serverMetaDescription || ""}
        metaKeywords={serverMetaKeywords || "Coupon Codes"}
        serverFavicon={serverFavicon}
        serverData={serverData}
      >
        <div className="bg-white vh-100 vw-100 d-flex justify-content-center align-items-center">
          <Spinner />
        </div>
      </Layout>
    );
  
  if (err)
    return (
      <Layout
        title={serverPageTitle || "Home"}
        metaTitle={serverMetaTitle || serverPageTitle || "Home"}
        metaDescription={serverMetaDescription || ""}
        metaKeywords={serverMetaKeywords || "Coupon Codes"}
        serverFavicon={serverFavicon}
        serverData={serverData}
      >
        <div className="text-center error my-auto vw-100 vh-100 d-flex justify-content-center align-items-center">
          Something went wrong!
        </div>
      </Layout>
    );
  
  // Main render
  const displayData = metaData;
  
  return (
    <Layout
      title={serverPageTitle || "Home"}
      metaTitle={serverMetaTitle || serverPageTitle || "Home"}
      metaDescription={serverMetaDescription || ""}
      metaKeywords={serverMetaKeywords || "Coupon Codes"}
      serverFavicon={serverFavicon}
      serverData={serverData}
    >
      <div className={`${displayData?.Style === 4 ? "blogbg" : ""} `}>
        <Slider data={displayData} sliderData={homeData} />
        {displayData?.Style === 4 && <CategoryWiseBlog data={displayData} />}

        {displayData?.Style === 2 && <Subscribe data={displayData} />}

        {displayData?.Style === 1 ||
          (displayData?.Style === 2 && (
            <>
              <Popular styledata={displayData} popularStore={homeData} />
              <Popularcoupon data={displayData} popCoupon={homeData} />
            </>
          ))}

        {displayData?.Style === 1 && (
          <>
            <Newcoupon styledata={displayData} trendingCoupon={homeData} />
          </>
        )}

        {displayData?.Style !== 4 ? <Favorite styledata={displayData} /> : ""}
      </div>
    </Layout>
  );
}

// Server-side data fetching - Fetch ALL data needed for initial render
export async function getServerSideProps(context) {
  try {
    // Read data.json from public folder
    const dataPath = path.join(process.cwd(), "public", "settings", "data.json");
    const fileContents = fs.readFileSync(dataPath, "utf8");
    const serverData = JSON.parse(fileContents);

    // Extract meta information from serverData
    const serverPageTitle = serverData?.siteTitle || "Home";
    const serverMetaTitle = serverData?.meta?.title || serverData?.siteTitle || "Home";
    const serverMetaDescription = serverData?.meta?.description || "";
    const serverMetaKeywords = serverData?.meta?.keywords || "Coupon Codes";
    
    // Calculate favicon URL for server-side
    const serverFavicon = serverData?.logo?.favicon 
      ? `${serverData?.url}/${serverData.logo.favicon}`
      : "/favicon.png";

    // Fetch home data on server-side as well
    let initialHomeData = [];
    try {
      const apiUrl = process.env.APP_URL || "https://helloluvvy.com";
      const appKey = process.env.APP_KEY || "your-app-key";
      
      const homeResponse = await fetch(`${apiUrl}/api/home?key=${appKey}`);
      if (homeResponse.ok) {
        const homeJson = await homeResponse.json();
        initialHomeData = homeJson?.data || [];
      }
    } catch (apiError) {
      console.error("Error fetching home data:", apiError);
      // Continue without home data
    }

    return {
      props: {
        serverData,
        serverPageTitle,
        serverMetaTitle,
        serverMetaDescription,
        serverMetaKeywords,
        serverFavicon,
        initialHomeData
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        serverData: null,
        serverPageTitle: "Home",
        serverMetaTitle: "Home",
        serverMetaDescription: "",
        serverMetaKeywords: "Coupon Codes",
        serverFavicon: "/favicon.png",
        initialHomeData: []
      },
    };
  }
}