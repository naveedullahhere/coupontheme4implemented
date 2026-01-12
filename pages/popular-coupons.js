import Couponcard from '@/components/Couponcard';
import Spinner from '@/components/Spinner';
import { APP_KEY, APP_URL } from '@/public/settings/there_is_nothing_holding_me_back/config';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'


const popularcoupons = ({data}) => {
    const [popular, setpopular] = useState({})
    const [err, setError] = useState(false);
    const [loading, setloading] = useState(true)

    useEffect(() => {
        fetch(`${APP_URL}api/coupon?key=${APP_KEY}&graph=popular`).then(res => res.json()).then((dta) => {
            setpopular(dta)
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
                <h3 className='head1 pt-5'>Most Popular Coupons</h3>
                <div className='row '>
                    {popular?.data?.map((item) => {
                        return <div className="col-12 col-sm-6 col-md-3 my-1 p-1">
                            <Couponcard item={item} data={data} img={popular.url} />
                        </div>
                    })}
                </div>
                {/* <div className=" text-center my-3">
                    <Link href='/popular-coupons' className={`p-2 button  ${data?.Style === 1 ? 'button-primary' : 'button-secondary'}`}>View All</Link>
                </div> */}
            </div>
        </>
    )
}

export default popularcoupons