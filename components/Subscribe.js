import { APP_KEY, APP_URL } from '@/public/settings/there_is_nothing_holding_me_back/config'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'

const Subscribe = ({ }) => { 

    const [isLoading, setIsLoading] = useState(false);

    const handleContact = (e) => {
        e.preventDefault();

        setIsLoading(true);

        let email = e.target.elements['email'].value;

        fetch(`${APP_URL}api/subscribe`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ email, key: APP_KEY })
        }).then(res => res.json()).then((data) => {
            if (data.success) {
                 toast.success(data.message)
                 maill.reset()
            } else {
                 toast.error(data.message)
            }
            setIsLoading(false);
        }).catch(err => {
            console.error(err);
            setIsLoading(false);
            toast.error('Something went wrong!')
        });
    }


    return (
        <>
            <div className="container">
            <div class=" my-5">
                <div className="col-7">
                    <h1 class="subscribe-head text-md-start ">Best Deals From Top Stores.</h1>
                    <h3 class="mt-1 text-md-start fw-normal">Helping Customers Save Million Dollars</h3>
                    <p class="mt-2 text-md-start">Get latest disocunts from top brands Instantly</p>
                   
                    <form class="px-0 my-3 subscribe-form input-group " id='maill' onSubmit={handleContact}>
                        <div class="input-group mb-3 h-100 w-100">
                            <input class="form-control col-9 border-0" id="email_" type="email" name="email" placeholder="Email Address"/>
                            <button class="btn button-secondary  bg-secondary text-uppercase text-white col-3 fw-bolder z-0" type="submit" name="newsletter">{isLoading ? 'Subscribing...' : 'Suscribe'}</button>
                        </div>
                    </form>
                </div>
            </div>
            </div>
        </>
    )
}

export default Subscribe