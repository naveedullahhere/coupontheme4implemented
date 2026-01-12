
import { useEffect, useState } from 'react'
import StoreItem from '@/components/StoreItem'
import Pagination from '@/components/layout/Pagnation'
import { APP_URL, APP_KEY } from '@/public/settings/there_is_nothing_holding_me_back/config'
import Spinner from '@/components/Spinner'

const index = ({ data, setMetas, metas }) => {

    const [allstore, setAllStore] = useState({});
    const [err, setError] = useState(false);
    const [loading, setloading] = useState(false);


    useEffect(() => {
        fetchStores();
    }, []);


    const fetchStores = () => {
        setloading(true);
        fetch(`${APP_URL}api/store?key=${APP_KEY}&type=featured`).then(res => res.json()).then((itm) => {
            setAllStore(itm);
            setloading(false);
            setMetas({ ...metas, title: `All Stores ${data?.siteTitle ? '- ' + data?.siteTitle : ''}` })
        }).catch(err => {
            setloading(false);
            setError(true);
        });
    }

    const words = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    ]

    if (loading) return <div className='bg-white vh-100 vw-100 d-flex justify-content-center overflow-hidden align-items-center position-fixed top-0 start-0 z-1'><Spinner /></div>

    return (
        <>
            <div className="min-vh-100">
                {err ? "Something Went Wrong" :
                    <div className="container">
                        <div className="">
                            <h3 className='ps-0 my-3'>Browse Your Coupon By Store</h3>
                            <div className='ps-0'>
                                <Pagination words={words} />
                            </div>
                        </div>
                        <div className="row my-5 w-100 mx-auto">
                            {words?.map((itm) => <>
                                <div class="col-12 page-link" id={`${itm}`}>
                                    <div className='browse-coupon'> {allstore?.data?.filter(item => item?.name?.charAt(0).toLowerCase() === itm.toLowerCase())?.length ? itm : ''}</div>
                                </div>
                                {allstore?.data?.filter(item => item?.name?.charAt(0).toLowerCase() === itm.toLowerCase())?.flat()?.map(dta => <StoreItem cols={true} allStorez={true} head={true} item={dta} styledata={data} img={allstore?.url} />)}
                            </>
                            )}
                        </div>

                    </div>
                }
            </div>
        </>
    )
}

export default index
