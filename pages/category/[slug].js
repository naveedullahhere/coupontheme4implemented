import Categorycrad from '@/components/Categorycard'
import Favoritebrands from '@/components/Favoritebrands'
import Spinner from '@/components/Spinner'
import { APP_KEY, APP_URL, DEFAULT_DESC, DEFAULT_TITLE } from '@/public/settings/there_is_nothing_holding_me_back/config'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const category = ({ data, metas, setMetas }) => {

    const dta = useRouter()
    let slug = dta?.query?.slug;


    const [catcard, setcatcard] = useState({});
    const [err, setError] = useState(null);
    const [loading, setloading] = useState(true);

    useEffect(() => {

        setloading(true);

        fetch(`${APP_URL}api/store?key=${APP_KEY}&category=${slug}`).then(res => res.json()).then(json => {

            setloading(false);

            setcatcard(json);
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

        // if (categ) {
        //     setloading(false);
        //     setError(null)
        // }
        // if (categ.success === false) {
        //     setError('No Category Found!')
        // }
        // setcatcard(categ);
    }, [slug])

    if (loading) return <div className='bg-white vh-100 vw-100 d-flex justify-content-center overflow-hidden align-items-center position-fixed top-0 start-0 z-1'><Spinner /></div>

    return (
        <div className="min-vh-100">
            {err ?
                <>
                    <div className="container my-3">
                        <h2> {catcard.name} Coupons & Promo Codes</h2>
                        <p className='text-center my-auto py-5'>

                            {err}
                        </p>
                    </div>
                </> :
                <div className="container my-3">
                    <div className="row">
                        <h2> {catcard.name} Coupons & Promo Codes</h2>
                        {catcard?.data?.map((item) => {
                            return <div className="cat-card col-md-4">
                                <Link href={`/store/${item.slug}`} > <Categorycrad item={item} img={catcard.url} data={data} /></Link>
                            </div>
                        })}
                    </div>
                </div>
            }

            {data === 1 ? <Favoritebrands /> : <>
                <div className="container bg-white p-2 mb-2">
                    {/* <p className='mb-0'>Automotive Coupon Codes, Discount Codes & Free Shipping Coupons, Don't Pay Extra, Save More With couponive.com Your Discount Partner</p> */}
                    <p className='mb-0' dangerouslySetInnerHTML={{ __html: catcard.description }}></p>
                </div>
            </>}

        </div>
    )
}

export default category


// export async function getStaticProps({ params }) {

//     const slug = params.slug;

//     // const response = await fetch(`${APP_URL}api/store?key=${APP_KEY}&category=${slug}`)
//     const response = await fetch(`${APP_URL}api/category?key=${APP_KEY}&paginate=12`)

//     const data = await response.json();

//     const paths: response?.data?.map((item) => {
//         return item?.slug
//     })

//     return {
//         props: { categ: data },
//     };
// }