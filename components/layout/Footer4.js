import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  APP_KEY,
  APP_URL,
} from "@/public/settings/there_is_nothing_holding_me_back/config";

const Footer4 = ({ data }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  let FOOTER_CONFIG = data?.footer?.menu;
  let TRENDING_BLOGS = data?.blogs;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${APP_URL}api/subscribe`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          email,
          key: APP_KEY,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setEmail("");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="row">
           <div className="col-md-4">
              <h3 className="footer-title text-footer">Trending</h3>
              <ul className="footer-links">
                {TRENDING_BLOGS.map((blogs, linkIndex) => (
                  <li key={blogs.id}>
                    <Link href={`/blog/${blogs.slug}`} className="footer-link text-footer">
                      {blogs.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          {/* Dynamic Columns from JSON */}
          {FOOTER_CONFIG?.columns.map((column, columnIndex) => (
            <div key={columnIndex} className="col-md-2">
              <h3 className="footer-title text-footer">{column.title}</h3>
              <ul className="footer-links">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.url} className="footer-link text-footer">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Column */}
          <div className="col-md-4 newsletter-column">
            <h3 className="newsletter-title text-footer">
              {FOOTER_CONFIG?.newsletter.title}
            </h3>

            <form onSubmit={handleEmailSubmit} className="newsletter-form">
              <div className="newsletter-input-group">
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder={FOOTER_CONFIG?.newsletter.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="newsletter-button"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Subscribing..."
                    : FOOTER_CONFIG?.newsletter.buttonText}
                </button>
              </div>
            </form>

            {/* You can remove the local success/error messages since we're using toast notifications */}
          </div>
        </div>

        {/* Social Links */}
        <div className="footer-social">
          <ul className="social-links">
            {FOOTER_CONFIG?.socialLinks.map((social, index) => (
              <li key={index}>
                <Link
                  href={social.url}
                  className="social-link text-footer"
                  aria-label={social.ariaLabel}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Copyright Section */}
        <div className="footer-copyright">
          <p className="text-footer">
            © {FOOTER_CONFIG?.copyright.year},{" "}
            {FOOTER_CONFIG?.copyright.company} |{" "}
            {FOOTER_CONFIG?.copyright.links.map((link, index) => (
              <span key={index} className="text-footer">
                <Link href={link.url} className="copyright-link text-footer">
                  {link.text}
                </Link>
                {index < FOOTER_CONFIG?.copyright.links.length - 1 && " | "}
              </span>
            ))}{" "}
            <span className="privacy-icon">
              {FOOTER_CONFIG?.copyright.privacyIcon}
            </span>
          </p>
        </div>
      </div>
      <style jsx>{`
        /* Custom CSS footer design matching the Neiman Marcus footer style */
        .bg-footer {
          width: 100%;
          padding: 60px 0;
          color: #000;
        }

        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
        }

        /* Main Footer Grid Layout */
        .footer-main {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
        }

        .footer-title {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
          text-transform: uppercase;
          line-height: 1.4;
        }
        .newsletter-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
          text-transform: uppercase;
          line-height: 1.4;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-link {
          font-size: 13px;
          color: var(--footer-text) !important;
          text-decoration: none;
          transition: opacity 0.3s ease;
          line-height: 1.6;
        }

        .footer-link:hover {
          opacity: 0.7;
        }

        /* Newsletter Column */
        .newsletter-column {
          grid-column: 4;
        }

        .newsletter-form {
          margin-top: 15px;
          margin-bottom: 15px;
        }

        .newsletter-input-group {
          display: flex;
          gap: 0;
          margin-bottom: 12px;
        }

        .newsletter-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #d3d3d3;
          font-size: 13px;
          border-radius: 0;
          outline: none;
          background: #fff;
          color: #000;
        }

        .newsletter-input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }

        .newsletter-input::placeholder {
          color: #999;
        }

        .newsletter-input:focus {
          border-color: #000;
        }

        .newsletter-button {
          background-color: #000;
          color: #fff;
          border: none;
          padding: 12px 20px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          padding: 12px 32px;
        }

        .newsletter-button:disabled {
          background-color: #666;
          cursor: not-allowed;
        }

        .newsletter-button:hover:not(:disabled) {
          background-color: #222;
        }

        /* Social Links */
        .footer-social {
          text-align: center;
          padding: 20px 0;
        }

        .social-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          color: #000;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: opacity 0.3s ease;
        }

        .social-link:hover {
          opacity: 0.6;
        }

        /* Copyright Section */
        .footer-copyright {
          text-align: center;
          border-top: 1px solid #e0e0e0;
          padding-top: 20px;
        }

        .footer-copyright p {
          font-size: 12px;
          color: #666;
          margin: 0;
          line-height: 1.6;
        }

        .copyright-link {
          color: #000;
          text-decoration: none;
          transition: opacity 0.3s ease;
        }

        .copyright-link:hover {
          opacity: 0.7;
        }

        .privacy-icon {
          margin: 0 4px;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .footer-main {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }

          .newsletter-column {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 768px) {
          .footer-container {
            padding: 0 20px;
          }

          .footer-main {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .newsletter-input-group {
            flex-direction: column;
          }

          .newsletter-button {
            width: 100%;
          }

          .footer-title {
            font-size: 12px;
          }

          .footer-link {
            font-size: 12px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer4;
