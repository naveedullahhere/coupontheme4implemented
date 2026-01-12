import { APP_URL, APP_KEY } from '@/public/settings/there_is_nothing_holding_me_back/config'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Couponcard from './Couponcard'
import Spinner from './Spinner'

const Popularcoupon = ({ data, popCoupon }) => {
 
    return (
        <>
            <div className="container mt-5">
                <h3 className='head1 pt-5'>Most Popular Coupons</h3>
                <div className='row p-2'>
                    {popCoupon?.popular_coupon?.map((item) => {
                        return <div className="col-12 col-sm-6 col-md-3 my-1 p-1">
                            <Couponcard item={item} data={data} img={popCoupon?.store_url} />
                        </div>
                    })}
                </div>
                {data.Style === 1 ?
                    <div className=" text-center my-3">
                        <Link href='/popular-coupons' className={`p-2 button  ${data?.Style === 1 ? 'button-primary' : 'button-secondary'}`}>View All</Link>
                    </div>
                    : ''
                }
            </div>

        </>
    )
}

export default Popularcoupon
