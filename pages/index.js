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

export default function Home({ data, setMetas, metas }) {
  const [loading, setloading] = useState(true);
  const [homeData, setHomeData] = useState([]);
  const [err, seterr] = useState(null);

  useEffect(() => {
    setMetas({
      title: data?.siteTitle ? data?.siteTitle : "Home",
      metaTitle: data?.meta ? data?.meta?.title : "",
      metaDescription: `${data?.meta ? data?.meta?.description : ""}`,
      metaKeyword: `${data?.meta ? data?.meta?.keywords : "Coupon Codes"}`,
    });

    fetch(`${APP_URL}api/home?key=${APP_KEY}`)
      .then((res) => res.json())
      .then((dta) => {
        setloading(false);

        if (homeData.success === false) {
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
