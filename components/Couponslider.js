import React, { useEffect, useState } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Couponcard from './Couponcard';
import { APP_URL, APP_KEY } from '@/public/settings/there_is_nothing_holding_me_back/config';
import Spinner from './Spinner';
const Couponslider = ({ styledata }) => {


    const [mostview, setmostview] = useState({})
    const [err, setError] = useState(false);
    const [loading, setloading] = useState(true)

    useEffect(() => {
        
        fetch(`${APP_URL}api/coupon?key=${APP_KEY}&ttype=coupon-type(slug)&paginate=20`).then(res => res.json()).then((dta) => {
            setmostview(dta)
            setloading(false);
        }).catch(err => {
            setloading(false);
            setError(true);
        })
        
    }, [])
 
    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 570,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ]
    };

    return (
        <>
            <div className='container d-none my-5'>
                <h2 className='ms-2'>Most View Coupons</h2>
                {/* {loading ? */}
                <Slider {...settings}>
                    {mostview?.data?.data?.map((item) => {
                        return <div className='col px-2'>
                            <Couponcard item={item} data={styledata} img={mostview.url} />
                        </div>
                    })}

                </Slider>
                {/* : */}
                 {/* <Spinner />  */}
                {/* } */}
            </div>
        </>
    )
}

export default Couponslider