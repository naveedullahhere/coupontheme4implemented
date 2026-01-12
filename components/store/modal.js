import { APP_URL } from '@/public/settings/there_is_nothing_holding_me_back/config';
import Image from 'next/image';
import Link from 'next/link'
import React, { useState } from 'react'


const modal = ({ img, data, popup, store }) => {


    const [isOpen, setIsOpen] = useState(true)
    return (



        <div class={`modal ${isOpen && 'fade show d-block'}`} tabindex="-1" aria-modal="true" role="dialog">
            <div class="modal-dialog m-0  h-100 d-flex align-items-center mx-auto">
                <div class="modal-content">
                    {data.Style === 1 ?
                        <>
                            <div class="modal-header bg-light">
                                <h3 class="modal-title fs-5 text-decoration-underline" id="exampleModalLiveLabel">
                                    <small>{"«"} More {store} coupons</small></h3>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setIsOpen(!isOpen)}></button>
                            </div>
                            <div class="modal-body pb-0">
                                <Link className='h5 text-secondary fs-3' href="#">{popup?.title}</Link>
                                <p className='tr-2 my-1' dangerouslySetInnerHTML={{ __html: popup?.description }}></p>
                                <div className='text-center d-flex flex-column align-items-center gap-3 pt-5 pb-3 justify-content-end'>
                                    <div className="coupon-style-1 mb-0">{popup?.code || 'No Coupon Needed'}</div>
                                    <Link href={`${popup?.url}`} className={`button button-secondary px-1 ${popup?.code ? '' : 'mt-1'}`} onClick={() => navigator.clipboard.writeText(`${popup?.code}`)}>{popup?.code ? `Copy and Go To the ${store}` : `Go To the ${store}`}</Link>
                                </div>
                            </div>
                            <div class="p-3 pt-0">
                                <h5 className='mb-3'>Share With Friends</h5>
                                <div className=" modal-social ">
                                    <ul class="list-unstyled d-flex justify-content-start mb-0">
                                        <li class="p-3   ">
                                            <Link href={`http://www.facebook.com/sharer.php?u=${APP_URL}/store/${popup.title}/${popup.id}`} target="_blank">
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="text-secondary bi bi-facebook" viewBox="0 0 16 16">
                                                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                                                    </svg>
                                                </span>
                                            </Link>
                                        </li>

                                        <li class="p-3   ">
                                            <Link href={`https://wa.me/?text=${APP_URL}/store/${popup.title}/${popup.id}`} target="_blank">
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-whatsapp text-secondary" viewBox="0 0 16 16">
                                                        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                                                    </svg>
                                                </span>
                                            </Link>
                                        </li>

                                        <li class="p-3">
                                            <Link href={`https://telegram.me/share/url?url=${APP_URL}/store/${popup.title}/${popup.id}`} target="_blank">
                                                <span><svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24" className='text-secondary' xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Zm-9.641-2.617c-.973.405-2.918 1.242-5.833 2.512-.472.188-.721.373-.744.553-.037.303.344.423.863.587l.219.069c.51.166 1.197.36 1.554.367.325.008.686-.125 1.085-.4 2.723-1.838 4.13-2.767 4.217-2.787.063-.015.15-.033.207.02.06.051.053.15.047.176-.038.161-1.534 1.551-2.308 2.271-.241.225-.412.384-.447.42a10.52 10.52 0 0 1-.235.233c-.475.457-.83.8.018 1.36.41.27.737.491 1.063.713.355.243.71.484 1.17.787.116.075.229.156.338.233.413.296.787.56 1.246.518.267-.025.543-.275.683-1.025.332-1.771.983-5.607 1.133-7.189.01-.131.004-.263-.016-.393a.421.421 0 0 0-.143-.272.658.658 0 0 0-.387-.116c-.375.006-.954.207-3.73 1.363Z"></path>
                                                </svg></span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div> </> :

                        <>
                            <div class="modal-header back-light h-100 border-0 position-relative">

                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setIsOpen(!isOpen)}></button>
                            </div>
                            <div className="d-flex justify-content-center">
                                <div class="modal-body back-light position-relative custom-them text-center">
                                    <Image className='mx-auto col-5 modal-logo position-relative mb-4' src={img + "/" + data.logo.header} fill={true}></Image>
                                    <br /> <Link className='h4 text-dark' href="#">{popup?.title}</Link>
                                    <div className='text-center mt-3 d-flex justify-content-center align-items-center flex-column'>
                                        <div className="d-flex align-items-center justify-content-center">

                                            <small className={`d-flex align-items-center justify-content-center px-3 mb-0 ${popup?.code && 'bg-code h3'}`}>{popup?.code || 'No Coupon Needed'}</small>

                                            <Link href={`${popup?.code ? '#' : popup?.url}`} className='d-flex align-items-center justify-content-center code-btn px-3 button button-secondary px-1 mt-0' onClick={() => navigator.clipboard.writeText(`${popup?.code}`)}>{popup?.code ? `Copy` : `Go To the ${store}`}</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="p-3">
                                <p className='tr-2 my-1 text-center' dangerouslySetInnerHTML={{ __html: popup?.description }}></p>

                            </div> </>
                    }
                </div>
            </div>
        </div>

    )
}

export default modal
