import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'

const sidepanel = ({ data, sidepanelapi, img }) => {

    var math = Math.floor(Math.random() * (5 - 3 + 1)) + 3

    return (
        <>
            {data?.Style === 1 ?
                <div className="product-sidepanelapi bg-white p-4">
                    <div className="side-img">
                        <Image src={`${!img ? '' : img + "/" + sidepanelapi?.data?.store?.logo}`} fill={true} className='h-100 w-100 position-relative' />
                    </div>
                    <h4 className='my-2'>{sidepanelapi?.data?.store?.name}</h4>
                    <p dangerouslySetInnerHTML={{ __html: sidepanelapi?.data?.store?.description }}></p>

                    <div className=''> <Link href={`${sidepanelapi?.data?.store?.affiliate_url}`} className='button button-secondary p-2'>Go To Store</Link ></div>
                    {/* <div className="similar-cat">
                    <h5 className='my-4 '>Similar Category</h5> 
                    <div className='similar-cat-link'>
                        <Link href={`${sidepanelapi?.data?.category?.slug}`}>{sidepanelapi?.data?.category?.name}</Link>
                        <h6 className='mt-2'>Find More <strong> {sidepanelapi?.data?.category?.name}</strong> Coupon Codes </h6>
                    </div> 
                </div> */}
                    <div className="similar-store">
                        <h4 className='mt-5 my-3  '>Similar Store</h4>
                        {sidepanelapi?.data?.related_store?.data?.map((item) => {
                            return <div className='similar-store-link'>
                                <Link className='text-black' href={"/store/" + item.slug}>{item.name}</Link>
                            </div>
                        })}
                    </div>
                </div>
                : <div className="product-sidepanelapi">
                    <div className="side-img text-center ">
                        <Image src={`${!img ? '' : img + "/" + sidepanelapi?.data?.store?.logo}`} fill={true} className='mt-5 side-panel-theme-2 h-100 rounded-2 w-75 position-relative bg-white' />
                    </div>
                    <div className='bg-white p-4   rounded-2'>

                        <div className=' mt-5'>
                            <div class="d-flex lis list-unstyled justify-content-center ">

                                <li id="star_1"><i class="fas fa-star" aria-hidden="true"></i></li>
                                <li id="star_2"><i class="fas fa-star" aria-hidden="true"></i></li>
                                <li id="star_3"><i class="fas fa-star" aria-hidden="true"></i></li>
                                <li id="star_4"><i class="fas fa-star" aria-hidden="true"></i></li>
                                <li id="star_5"><i class="fas fa-star" aria-hidden="true"></i></li>

                            </div>
                            <p className='text-center'>Average Rating {math} Out Of 5</p>
                            <h4 className='my-2 fw-bold'>{sidepanelapi?.data?.store?.name}</h4>
                            <p className='lh-sm' dangerouslySetInnerHTML={{ __html: sidepanelapi?.data?.store?.description }}></p>

                            <div className='text-center '> <Link href={`${sidepanelapi?.data?.store?.affiliate_url}`} className='h4 fw-bold text-secondary p-2'>Go To Store</Link ></div>
                            {/* <div className="similar-cat">
                                <h5 className='my-4 '>Similar Category</h5>
                                <div className='similar-cat-link'>
                                    <Link href={`${sidepanelapi?.data?.category?.slug}`}>{sidepanelapi?.data?.category?.name}</Link>

                                    <h6 className='mt-2'>Find More <strong> {sidepanelapi?.data?.category?.name}</strong> Coupon Codes </h6>
                                </div>
                            </div> */}
                            <div className="similar-store">
                                <h4 className='mt-5 my-3  '>Similar Store</h4>
                                {sidepanelapi?.data?.related_store?.data?.map((item) => {
                                    return <div className='similar-store-link '>
                                        <Link className='text-black background-light rounded-2 btn mt-1 p-1' href={'/store/' + item.slug}>{item.name}</Link>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                </div>}
        </>
    )
}

export default sidepanel
