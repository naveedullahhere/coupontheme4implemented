import React, { useEffect, useState } from "react";
import Image from "next/image";
import img1 from "../public/assets/slider/apparel-promozons-01.jpg";
import img2 from "../public/assets/slider/Memoria-Day-Sale-morecouponcode.png";
import memorialslider from "../public/assets/slider/Happy-Memorial Day-couponive.png";
import Spinner from "./Spinner";
import {
  APP_URL,
  APP_KEY,
} from "@/public/settings/there_is_nothing_holding_me_back/config";

const Slider = ({ data, sliderData }) => {
  return (
    <>
      {data.Style === 1 && (
        <div
          id="carouselExampleControlsNoTouching"
          class="carousel slide slider-css"
          data-bs-touch="false"
        >
          <div class="carousel-inner">
            {sliderData?.slider?.map((item) => {
              return (
                <div key={item.id} class="carousel-item active h-100">
                  <Image
                    src={`${sliderData?.slider_url + "/" + item.media}`}
                    class="d-block w-100 position-relative"
                    fill={true}
                    alt="..."
                  />
                </div>
              );
            })}
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleControlsNoTouching"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleControlsNoTouching"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      )}
      {data.Style === 2 && (
        <section className="bg-white">
          <div className="container  px-0">
            <Image
              src={`${
                sliderData?.slider_url +
                "/" +
                sliderData?.slider[sliderData?.slider?.length - 1].media
              }`}
              fill={true}
              className="position-relative custom-slider w-100"
            />
          </div>
        </section>
      )}
    </>
  );
};

export default Slider;
