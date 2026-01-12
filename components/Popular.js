
// import Image from 'next/image'
import Link from 'next/link'
import StoreItem from './StoreItem'
import React, { useEffect, useState } from 'react'
// import Spinner from './Spinner'
import { APP_URL, APP_KEY } from '@/public/settings/there_is_nothing_holding_me_back/config'
import Spinner from './Spinner'



const Popular = ({ styledata, popularStore }) => {

    return (
        <>
            <div className="container pt-5">
                <h3 className='head1'>
                    {styledata.Style === 1 ? " Most Popular Stores" : "Your Most Favorite Stores"}
                </h3>
                <div className="row p-2">
                    {popularStore?.popular_stores?.map((item) => {
                        return <StoreItem item={item} img={popularStore?.store_url} data={styledata} />
                    })}
                </div>
            </div>

        </>

    )
}

export default Popular
