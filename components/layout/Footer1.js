import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import logo from '@/public/assets/footerlogo.png'
import Link from 'next/link'
import { CONTAINER_TYPE } from '@/public/settings/there_is_nothing_holding_me_back/config'

const Footer1 = ({ data }) => {
  
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

// Call this function on page load to ensure consistency
startRealTimeCookieCheck();

  
  

  return (
    <>

      <div className='container-fluid bg-footer  footer-1'>
        <div className="row">
          <div className="col-md-3 my-auto text-center text-md-start">
            <Link href="/"> <Image src={data?.url + "/" + data?.logo?.header || logo} fill={true} className="footer1-logo w-40 position-relative"></Image></Link>
          </div>
          <div className="col-md-3 text-white text-center my-auto">
            <p className='my-auto text-footer '> All Right Reserved</p>
          </div>
          <div className="col-md-6 footer-link text-center my-auto">

            {data?.pages?.map((item) => {
              return <Link href={`/pages/${item.slug}`}>{item.name}</Link>
            })}

            <Link href="/all-stores">Stores</Link>
            <Link href="/contact">Contact Us</Link>
            <Link href="/category">Categories</Link>
            <Link href=""><i class="fab fa-twitter" aria-hidden="true"></i></Link>
            <Link href=""><i class="fab fa-pinterest" aria-hidden="true"></i></Link>
            <Link href=""><i class="fab fa-facebook" aria-hidden="true"></i></Link>
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

export default Footer1