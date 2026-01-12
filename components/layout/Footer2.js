import { FOOTER_DESC, FOOTER_ABOUT } from '@/public/settings/there_is_nothing_holding_me_back/config'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import logo from '../../public/assets/logo-white.png'

const Footer2 = ({ season, country, data }) => {
const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isSlidingOut, setIsSlidingOut] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookiesAccepted') && data?.is_cookies_policy_popup === 1) {
      // Delay popup by 3 seconds
      const timer = setTimeout(() => {
        setIsPopupVisible(true);
      }, 3000);

      // Cleanup timeout on unmount
      return () => clearTimeout(timer);
    }
  }, [data?.is_cookies_policy_popup]);

  const handleAcceptCookies = () => {
    const timestampNow = new Date().getTime(); // Current time in milliseconds
    const expirationTime = timestampNow + 3600000; // 1 hour (3600000 milliseconds) from now
    
    // Save acceptance and expiration timestamp
    localStorage.setItem('cookiesAccepted', 'true');
    localStorage.setItem('cookieExpiration', expirationTime);
  
    setIsSlidingOut(true); // Start slide-out animation
    setTimeout(() => {
        setIsPopupVisible(false); // Remove popup from DOM
    }, 300);
  
    // Start checking for expiration in real-time
    startRealTimeCookieCheck();
};

const startRealTimeCookieCheck = () => {
    const interval = setInterval(() => {
        const timestampNow = new Date().getTime();
        const expirationTime = localStorage.getItem('cookieExpiration');
  
        // If expiration time has passed, remove the cookie
        if (expirationTime && timestampNow > expirationTime) {
            localStorage.removeItem('cookiesAccepted');
            localStorage.removeItem('cookieExpiration');
            console.log('Cookies have been removed in real-time!');
            clearInterval(interval); // Stop the interval after removal
        }
    }, 1000); // Check every second
};

startRealTimeCookieCheck();

  
  



    return (
        <>

            <div className="bg-footer">
                <div className="container py-4 ">
                    <div className="row">
                        <div className="col-md-4">
                            <Link href={'/'} className="footer-2-logo">
                                <Image src={data?.url + "/" + data?.logo?.footer || logo} alt="" className={'position-relative my-1 header-logo w-100'} style={{ objectFit: 'contain' }} fill={true}></Image>
                            </Link>
                            <p className='text-white footer-desc'>{FOOTER_ABOUT}</p>
                            <ul className='footer-link footer2-icon  p-0 text-white pt-1 d-flex'>
                                <li><Link href=""> <i className='fab fa-facebook-f'></i></Link></li>
                                <li><Link href=""> <i className='fab fa-pinterest-p'></i></Link></li>
                                <li><Link href=""> <i className='fab fa-twitter '></i></Link></li>
                            </ul>
                        </div>
                        <div className="col-md-8 row ">
                            <div className="col-md-4 ">
                                <h2 className='my-auto text-white fw-bolder'>About US</h2>
                                <ul className='footer-link p-0 text-white pt-3'>
                                    {data?.pages?.map((item) => {
                                        return <li className='mb-1'>
                                            <Link className='ms-0' href={`/pages/${item.slug}`}>{item.name}</Link>
                                        </li>
                                    })}
                                    <li className='mb-1'>
                                        <Link className='ms-0' href="/contact">Contact Us</Link>
                                    </li>

                                </ul>
                            </div>
                            <div className="col-md-4 ">
                                <h2 className='my-auto text-white fw-bolder'>Shop By Country</h2>
                                <ul className='footer-link p-0 text-white pt-3'>
                                    {country?.slice(0, 6).map((countrydd) => {
                                        return <li className='mb-1'>
                                            <Link className='ms-0' href={`/country/${countrydd.slug}`}>{countrydd.name}</Link>
                                        </li>

                                    })}

                                </ul>
                            </div>
                            <div className="col-md-4 ">
                                <h2 className='my-auto text-white fw-bolder'>What's Trending</h2>
                                <ul className='footer-link p-0 text-white pt-3'>
                                    {season?.data?.slice(0, 6).map((seasondd) => {
                                        return <li className='mb-1'>
                                            <Link className='ms-0' href={`/season/${seasondd.slug}`}>{seasondd.name}</Link>
                                        </li>
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="copright_text">
                                <hr className='text-white opacity-1' />
                                <p className='text-white'>{FOOTER_DESC}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {isPopupVisible && (
  <div
  className={`cookie-policy-containers ${
    isSlidingOut ? 'slide-out' : 'slide-up'
  }`}
>
          <div className="alert alert-black alert-dismissible fade show bg-black text-white m-auto py-4" role="alert">
            <div className="row align-items-center">
              <div className="col-10">
                {data?.cookies_policy_popup_text || ''}{' '}
                <Link className="text-white" href="/pages/cookies-policy">Cookies Policy</Link> and <Link className="text-white" href="/pages/privacy-policy">Privacy Policy</Link>.
              </div>
              <div className="col-2 text-end">
                <button className="btn btn-light" onClick={handleAcceptCookies}>
                  OKAY
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
    )
}

export default Footer2