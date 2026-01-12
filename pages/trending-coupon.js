import Spinner from '@/components/Spinner';
import { APP_KEY, APP_URL } from '@/public/settings/there_is_nothing_holding_me_back/config';
import React, { useEffect, useState } from 'react'
import Newcouponcard from '../components/Couponcard'

const trendingcoupon = ({data}) => {


    const [trending, settrending] = useState({})
    const [err, setError] = useState(false);
    const [loading, setloading] = useState(true)

    useEffect(() => {
        fetch(`${APP_URL}api/coupon?key=${APP_KEY}&graph=tranding&ttype=coupon-type(slug)`).then(res => res.json()).then((dta) => {
            settrending(dta)
            setloading(false);
        }).catch(err => {
            setloading(false);
            setError(true);
        })
    }, [])
    if (loading) return <div className='bg-white vh-100 vw-100 d-flex justify-content-center overflow-hidden align-items-center position-fixed top-0 start-0 z-1'><Spinner /></div>
   

    return (
        <>
            <div className="container my-5">
                <h3 className='head1 pt-5'>Most Trending Coupons</h3>
                <div className='row '>
                    {trending?.data?.map((item) => {
                        return <div className=" col-12 col-sm-6 col-md-3 my-1 p-1">

                            <Newcouponcard item={item} data={data} img={trending?.url} />
                        </div>
                    })}
                </div>
                
            </div>
        </>
    )
}

export default trendingcoupon