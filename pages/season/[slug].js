import Spinner from '@/components/Spinner'
import Categorycrad from '@/components/store/coupon'
import { APP_KEY, APP_URL, DEFAULT_DESC, DEFAULT_TITLE } from '@/public/settings/there_is_nothing_holding_me_back/config'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import StoreCrad from "@/components/StoreCrad";


const Seasonpage = ({ data, setMetas, metas }) => {

    const [seasondropdown, setseasondropdown] = useState({})
    const [err, setError] = useState(false);
    const [loading, setloading] = useState(true);
    const seasonslug = useRouter()
    let slug = seasonslug?.query?.slug;


    useEffect(() => {
        setloading(true);

        fetch(`${APP_URL}api/coupon?key=${APP_KEY}&season=${slug}`).then(res => res.json()).then(json => {

            setloading(false);
            setseasondropdown(json);
            setMetas({ ...metas, title: `${json?.name ? json?.name + ' Coupons & Promo Codes' : 'Coupon & Promo Codes'}` });
            if (json.success === false) {
                setError(json?.message);
            }
            else {
                setError(null);
            }
        }).catch(err => {

            setError('No Season Found!');
            setloading(false);

        })


    }, [slug])

    if (loading) return <div className='bg-white vh-100 vw-100 d-flex justify-content-center overflow-hidden align-items-center position-fixed top-0 start-0 z-1'><Spinner /></div>

    return (

        <div div className="container my-3" >
            {err ? <p className='text-center my-auto py-5'>{err}</p> :
                <div className="row ">
                    <div className="col-md-10 mx-auto">
                        <h2> {seasondropdown?.name} Coupons & Promo Codes</h2>

                        {seasondropdown?.data?.map((item) => {
                            return <div className="px-1 my-0 ">
                                <StoreCrad padd={true} coupon={item} styledata={data} isSingle={true} img={seasondropdown?.url + "/" + item.store_logo} data={data} />
                            </div>
                        })}
                    </div>
                </div>
            }
        </div >
    )
}

export default Seasonpage