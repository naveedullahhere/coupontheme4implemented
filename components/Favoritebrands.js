import { APP_URL, APP_KEY } from '@/public/settings/there_is_nothing_holding_me_back/config'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Spinner from './Spinner'


const Favoritebrands = ({ styledata }) => {

    return (
        <>

            <div className='container pb-3 py-md-5'>
                <h3 className='fw-500 head1 '> {styledata === 1 ? "CODES FOR YOUR FAVOURITE BRANDS" : "Shop Your Desired Categories"} </h3>
                <div className="row bg-white py-1 ">
                    {styledata?.brands?.map(item => <div className="col-6 col-md-3 my-2 fav-brand-coupon"> <Link href={`/store/${item.slug}`}> {item.name} </Link>  </div>)}
                </div>
            </div>

        </>
    )
}

export default Favoritebrands