import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const expire = ({ expire, img }) => {

    var date = new Date(expire.update_date);
    var edate = new Date(expire.expire_date);
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    console.log(expire);
    return (
        <div className="my-2 h-100 px-3 py-2 coupon d-flex bg-white">
            <div className="col-md-2 my-auto">
                <Image src={`${img || ''}`} fill={true} className='h-85-px object-fit-contain position-relative' />
            </div>
            <div className="col-8 my-auto px-2 px-md-4">
                <Link href="#" className={`h3 text-expired`}>{expire.title}</Link>
                <p className='tr-2 my-1 d-md-block d-none fs-px' dangerouslySetInnerHTML={{ __html: expire.description }}></p>

                <div className='d-md-flex justify-content-between mb-0'>
                    <p className='x-small'>Expires: {expire.expire_date === null ? 'Expire Soon...' : expire?.expire_date.includes('0000') ? 'Expire Soon...' : `${monthNames[edate.getMonth()].slice(0, 3)} ${edate.getDate()}, ${edate.getFullYear()}`} </p>
                </div>
            </div>
            <div className="col-2 text-end m-auto my-auto">
                <button className={`p-2 w-100 button button-expired  d-md-block d-none`}>
                    {expire.type === 'Discount' ? 'Show Code' : 'Show Deal'}
                </button>
                <button className={`p-2 w-100 button button-expired  d-md-none d-block`}>
                    {expire.type === 'Discount' ? '>' : '>'}
                </button>
                <p className='d-md-block d-none x-small text-center'>Update: {`${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`} </p>
            </div>

        </div >
    )
}

export default expire
