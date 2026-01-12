import Spinner from '@/components/Spinner';
import { APP_KEY, APP_URL } from '@/public/settings/there_is_nothing_holding_me_back/config';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

const pages = ({ metas, setMetas }) => {
    const [pages, setpages] = useState({})
    const [loading, setloading] = useState(true);
    const seasonslug = useRouter()
    let slug = seasonslug?.query?.slug;

    useEffect(() => {
        setloading(true)
        fetch(`${APP_URL}api/pages?key=${APP_KEY}&slug=${slug}`).then(res => res.json()).then((dta) => {
            setpages(dta);
            setloading(false);
            console.log(dta);

            setMetas({ ...metas, title: `${dta?.data?.name ? dta?.data?.name : slug}`, metaTitle: dta?.data?.seo_title, metaDescription: dta?.data?.seo_description, metaKeyword: dta?.data?.meta_key });

        }).catch(err => {
            setloading(false)
        })
    }, [slug])

    if (loading) return <div className='bg-white vh-100 vw-100 d-flex justify-content-center overflow-hidden align-items-center position-fixed top-0 start-0 z-1'><Spinner /></div>

    return (
        <>
            <div className='container my-5'>
                <h2 className='my-3 fw-bolder' >{pages?.data?.name}</h2>
                <div dangerouslySetInnerHTML={{ __html: pages?.data?.description }}></div>
            </div>
        </>
    )
}

export default pages