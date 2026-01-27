'use client'

import { APP_KEY, APP_URL } from '@/public/settings/there_is_nothing_holding_me_back/config'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export default function ContactPage({ data: { contact_detail,siteTitle,contact_us_meta }, setMetas, metas, initialMetas }) {
    const [isLoading, setIsLoading] = useState(false)
    console.log(contact_detail);
    useEffect(() => {
        if (initialMetas) {
            setMetas(initialMetas);
        }
    }, [initialMetas, setMetas]);
    useEffect(() => {
        setMetas({
            ...metas,
            title: contact_us_meta?.title || `Contact Us ${siteTitle ? "- " + siteTitle : ""}`,
            metaTitle: contact_us_meta?.title || `Contact Us ${siteTitle ? "- " + siteTitle : ""}`,
            metaDescription: contact_us_meta?.description || `Contact Us ${siteTitle ? "- " + siteTitle : ""}`,
            metaKeyword: contact_us_meta?.keywords || `Contact Us ${siteTitle ? "- " + siteTitle : ""}`,
        });
    }, [metas, setMetas]);
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        // Show preloader at the top of the form
        const formContainer = e.currentTarget.closest('.form-container')
        if (formContainer) {
            formContainer.scrollIntoView({ behavior: 'smooth' })
        }

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message'),
            key: { APP_KEY }
        }

        try {
            const response = await fetch(`${APP_URL}api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (response.ok) {
                toast.success('Message sent successfully!')
                    ; (e.target).reset()
            } else {
                toast.error(result.message || 'Something went wrong!')
            }
        } catch (error) {
            toast.error('Failed to send message')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="contact-wrapper">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-12">
                        <div className="text-center mb-5">
                            <h1 className="section-title">Get in Touch</h1>
                            <p className="section-subtitle">
                                We'd love to hear from you. Our friendly team is always here to chat.
                            </p>
                        </div>

                        <div className="row g-4">
                            <div className="col-lg-7 mx-auto">
                                <div className="form-container p-4 p-md-5">
                                    {isLoading && (
                                        <div className="spinner-overlay">
                                            <div className="spinner-border text-dark" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    )}
                                    <h3 className="mb-4">Send us a Message</h3>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                            <label className="form-label" htmlFor="name">Full Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="name"
                                                id="name"
                                                required
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label" htmlFor="email">Email Address</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                id="email"
                                                required
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label" htmlFor="phone">Phone Number</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                name="phone"
                                                id="phone"
                                                placeholder="Enter your phone number"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label" htmlFor="message">Message</label>
                                            <textarea
                                                className="form-control"
                                                name="message"
                                                id="message"
                                                rows={4}
                                                required
                                                placeholder="Tell us more about your inquiry..."
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            className="submit-button d-flex align-items-center justify-content-center gap-2"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="spinner-border spinner-border-sm" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    <span>Sending...</span>
                                                </>
                                            ) : (
                                                'Send Message'
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                            {(contact_detail?.business_name ||
                                contact_detail?.business_phone ||
                                contact_detail?.business_address ||
                                contact_detail?.business_email) && (
                                    <div className="col-lg-5">
                                        <div className="contact-info p-4 p-md-5">
                                            {contact_detail?.business_name && (
                                                <div className="contact-card">
                                                    <div className="d-flex align-items-center">
                                                        <div className="contact-icon">
                                                            <i className="fas fa-building"></i>
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-1">Name</h4>
                                                            <p className="mb-1">{contact_detail.business_name}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {contact_detail?.business_email && (
                                                <div className="contact-card">
                                                    <div className="d-flex align-items-center">
                                                        <div className="contact-icon">
                                                            <i className="fas fa-envelope"></i>
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-1">Email</h4>
                                                            <p className="mb-1">{contact_detail.business_email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {contact_detail?.business_address && (
                                                <div className="contact-card">
                                                    <div className="d-flex align-items-center">
                                                        <div className="contact-icon">
                                                            <i className="fas fa-building"></i>
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-1">Address</h4>
                                                            <p className="mb-1">{contact_detail.business_address}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {contact_detail?.business_phone && (
                                                <div className="contact-card">
                                                    <div className="d-flex align-items-center">
                                                        <div className="contact-icon">
                                                            <i className="fas fa-phone"></i>
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-1">Phone</h4>
                                                            <p className="mb-1">{contact_detail.business_phone}</p>
                                                            <a href={`tel:${contact_detail.business_phone}`} className="contact-link">
                                                                Call now →
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

