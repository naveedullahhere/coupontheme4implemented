import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default function StoreItem({ styledata, item, img, cols, head, allStorez }) {
    return (

        // <div className={`most-popular-stores px-1 py-1 ${data?.Style === 1 ? 'popular-width-1' : 'col-4 '} ${cols === true ? 'col-md-2 ' : 'popular-width-2 '}`}  >
        <div className={`most-popular-stores px-1 py-1 ${allStorez ? 'my-1 col-6' : 'col-4'}  ${cols === true ? 'col-md-2 ' : 'popular-width-2 '}`}  >
            <Link href={`/store/${item.slug}`} className='d-block h-100'>
                <div className={`card-hover card rounded-0  popular-img-card ${head === true ? 'h-100' : ''}`}>
                    <div className={`card-body p-0 popular-img d-flex align-items-center h-85-px ${head === true ? '' : ''} `}>
                        <Image src={`${img + '/' + item.logo}`} alt={`${item.name}`} fill={true} className='h-100 object-fit-contain p-0 position-relative w-100 ' />
                    </div>
                    <div className={`card-footer bg-white text-center bg-transparent border-0 ${head === true ? '' : 'd-none'}`}>
                        <p className='mb-0' >{item.name}</p>
                    </div>
                </div>
            </Link>
        </div>

    )
}
