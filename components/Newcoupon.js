import { APP_URL, APP_KEY } from '@/public/settings/there_is_nothing_holding_me_back/config'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Newcouponcard from './Couponcard'
import Spinner from './Spinner'

const Newcoupon = ({ styledata, trendingCoupon }) => {


    // const [coupon, setCoupon] = useState({})
    // const [err, setError] = useState(false);
    // const [loading, setLoading] = useState(true)

    // useEffect(() => {

    //     fetch(`${APP_URL}api/coupon?key=${APP_KEY}&graph=tranding&ttype=coupon-type(slug)&paginate=16`).then(res => res.json()).then((dta) => {
    //         setCoupon(dta)
    //         setLoading(false);
    //     }).catch(err => {
    //         setLoading(false);
    //         setError(true);
    //     })

    // }, [])


    return (
        <>

            <div className="container mt-5">
                <h3 className='head1 pt-5'>{styledata.Style === 1 ? "Most Trending Coupons" : "Today's Most Popular Deals"}</h3>
                <div className='row '>
                    {trendingCoupon?.trending_coupon?.map((item) => {
                        return <div className=" col-12 col-sm-6 col-md-3 my-1 p-1">
                            <Newcouponcard item={item} data={styledata} img={trendingCoupon?.store_url} />
                        </div>
                    })}
                </div>
                <div className=" text-center my-3">
                    {styledata.Style === 1 ? <Link href='/trending-coupon' className={`p-2 button ${styledata?.Style === 1 ? 'button-primary' : 'button-secondary'}`}>View All</Link>
                        : ""}
                </div>
            </div>


        </>
    )
}

export default Newcoupon
