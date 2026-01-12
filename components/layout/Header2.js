
import Image from 'next/image'
import logo from '@/public/assets/logo-white.png'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { APP_KEY, APP_URL } from '@/public/settings/there_is_nothing_holding_me_back/config'

const Header2 = ({ data, category, season, coupons, country }) => {

    const [searchQuery, setSearchQuery] = useState([]);
    const [isActive, setIsActive] = useState(false);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (e) => {

        setQuery(e);

        if (query.length >= 1) {

            setIsActive(true);
            setIsLoading(true);
            fetch(`${APP_URL}api/store?key=${APP_KEY}&search=${e}`).then(res => res.json()).then(results => {
                let query = [];
                results?.data?.map(item => query.push({ name: item.name, slug: item.slug }))

                setIsLoading(false);
                setSearchQuery(query);
            })
        }
        else {
            setIsLoading(false);
            setIsActive(false);
            setSearchQuery([]);
        }
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-header px-3 py-2">
                <div className="container-fluid">
                    <Link className="navbar-brand col-md-2 col-4" href="/">
                        {/* <Image src={data?.url + "/" + data?.logo?.header || logo} alt="" className={'position-relative my-1 h-100'} fill={200} /> */}
                        <Image src={data?.url + "/" + data?.logo?.header || logo} alt="" className={'position-relative my-1 header-logo w-100'} fill={true} />
                    </Link>
                    <button className="navbar-toggler shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        {/* <i class="bi bi-justify"></i> */}
                        {/* <span className="navbar-toggler-icon"></span> */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-justify text-header" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                        </svg>
                    </button>
                    <div className="collapse navbar-collapse w-75 mt-2 h2 position-relative" id="navbarSupportedContent">
                        {/* <form className="mx-auto mx-md-0 d-flex w-75 rounded-2" role="search">
                            <input className="form-control me-2 rounded-1 " type="search" placeholder="Search 5000+ Brands Coupons & Promo Codes" aria-label="Search" />

                        </form> */}
                        <form className="mx-auto mx-md-0 d-flex w-75 rounded-2" role="search">
                            <input className="form-control rounded-1" type="search" placeholder="Search 5000+ Brands Coupons & Promo Codes" aria-label="Search" onChange={(e) => handleSearch(e.target.value)} value={query} />
                            <div class="w-75 top-100 pl-0 z-2 position-absolute header-search z-2">
                                {
                                    isActive &&

                                        isLoading ?

                                        <div class="list-group" ><a class="list-group-item list-group-item-action rounded-0 z-2">Loading...</a></div>

                                        :

                                        searchQuery.length ?
                                            searchQuery.map(item => {
                                                return <div class="list-group" onClick={() => {
                                                    setQuery(''); setIsLoading(false);
                                                    setIsActive(false);
                                                    setSearchQuery([]);
                                                }}><Link href={`/store/${item.slug}`} class="list-group-item list-group-item-action rounded-0">{item.name}</Link></div>
                                            })

                                            :

                                            query.length ? <div class="list-group" ><a class="list-group-item list-group-item-action rounded-0">No Result Found</a></div> : ''
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </nav>
            <nav className="navbar navbar-expand-lg py-0 bg-white">
                <div className="container ">


                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mb-2 mb-lg-0 nav-css">
                            <li className="nav-item ">
                                <Link className="nav-link" href="/all-stores" >
                                    All Stores
                                </Link >

                            </li>
                            <li className="nav-item dropdown">

                                <Link href="/category" className="nav-link dropdown-toggle"  >
                                    Category
                                </Link >
                                <ul className="dropdown-menu rounded-0 header-dd-2">
                                    {category?.slice(0, 10).map((cat) => {
                                        return <li ><Link className="dropdown-item dropdown-item-hov " href={`/category/${cat.slug}`}>{cat.name}</Link >
                                        </li>
                                    })}
                                </ul>
                            </li>

                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Coupon
                                </Link >
                                <ul className="dropdown-menu rounded-0 header-dd-2">
                                    {coupons?.slice(0, 10).map((coupondd) => {
                                        return <li ><Link className="dropdown-item dropdown-item-hov" href={`/coupon/${coupondd.slug}`}>{coupondd.name}</Link>
                                        </li>

                                    })}
                                </ul>
                            </li>

                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Seasons
                                </Link >
                                <ul className="dropdown-menu  rounded-0 header-dd-2">
                                    {season?.slice(0, 10).map((seasondd) => {
                                        return <li ><Link className="dropdown-item dropdown-item-hov" href={`/season/${seasondd.slug}`}>{seasondd.name}</Link>
                                        </li>

                                    })}

                                </ul>
                            </li>

                            <li className="nav-item dropdown memorial-btn">
                                {/* <Link href={data.header.button_url} className='button button-primary py-1 px-2'>{data.header.button_text}</Link > */}
                                <Link href={`${data.header.button_url}`} className='button header-btn-bg header-btn-text'>{data?.header?.button_text}</Link >
                            </li>

                        </ul>

                    </div>
                </div>
            </nav>

        </>
    )
}

export default Header2










