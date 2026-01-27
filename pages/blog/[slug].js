// pages/blog/[slug].js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import {
  APP_KEY,
  APP_URL,
} from "@/public/settings/there_is_nothing_holding_me_back/config";
import Spinner from "@/components/Spinner";

const BlogDetailPage = ({
  data,
  metas,
  setMetas,
  initialMetas,
  slug: propSlug,
}) => {
  const router = useRouter();
  const currentSlug = router?.query?.slug || propSlug;

  const [blog, setBlog] = useState(null);
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    // Set initial metas from server-side
    if (initialMetas) {
      setMetas(initialMetas);
    }
  }, [initialMetas, setMetas]);

  // Fetch blog details
  useEffect(() => {
    if (!currentSlug) return;

    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${APP_URL}api/v1/single-blog/${currentSlug}?key=${APP_KEY}&type=featured`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setBlog(result.data);
          setImageBaseUrl(result.url || "");

          // Update metas with blog data
          setMetas({
            ...metas,
            title: result.data.meta_title || result.data.title,
            metaTitle: result.data.meta_title || result.data.title,
            metaDescription:
              result.data.meta_description ||
              result.data.short_description?.replace(/<[^>]*>/g, ""),
            metaKeyword:
              result.data.meta_keyword ||
              result.data.meta_key ||
              result.data.title,
          });

          // Fetch related blogs after getting current blog details
          fetchRelatedBlogs(result.data.category_id);
        } else {
          throw new Error(result.message || "Blog not found");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(err.message || "Failed to load blog. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [currentSlug]);

  // Fetch related blogs
  const fetchRelatedBlogs = async (categoryId) => {
    try {
      setLoadingRelated(true);

      const response = await fetch(
        `${APP_URL}api/v1/blogs?key=${APP_KEY}&type=featured${
          categoryId ? `&category=${categoryId}` : ""
        }&limit=3`,
      );

      if (response.ok) {
        const result = await response.json();
        // Filter out current blog from related blogs
        const filtered =
          result.data?.filter((item) => item.slug !== currentSlug) || [];
        setRelatedBlogs(filtered.slice(0, 2));
      }
    } catch (err) {
      console.error("Error fetching related blogs:", err);
    } finally {
      setLoadingRelated(false);
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center py-5">
          <h2 className="text-danger mb-4">Error Loading Blog</h2>
          <p className="text-muted mb-4">{error}</p>
          <Link href="/" className="btn btn-primary">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center py-5">
          <h2 className="mb-4">Blog Not Found</h2>
          <p className="text-muted mb-4">
            The blog you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/" className="btn btn-primary">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = blog.image
    ? `${imageBaseUrl}/${blog.image}`
    : "/assets/no-image.jpg";

  // Get category name safely
  const getCategoryName = () => {
    if (typeof blog.category === "string") {
      return blog.category;
    } else if (
      blog.category &&
      typeof blog.category === "object" &&
      blog.category.name
    ) {
      return blog.category.name;
    }
    return null;
  };

  // Get tags safely - handle both array and object formats
  const getTags = () => {
    if (!blog.tags) return [];

    if (Array.isArray(blog.tags)) {
      // Check if tags are objects with name property
      if (blog.tags.length > 0 && typeof blog.tags[0] === "object") {
        return blog.tags.map((tag) => tag.name || tag);
      }
      return blog.tags;
    }
    return [];
  };

  const categoryName = getCategoryName();
  const tags = getTags();

  return (
    <>
      <div className="blog-detail-page blogbg">
        {/* Hero Section */}
        <div className="blog-hero-section position-relative">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-lg-10 col-xl-8">
                <nav aria-label="breadcrumb" className="mb-4 d-none">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link
                        href="/"
                        className="text-decoration-none text-muted"
                      >
                        Home
                      </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link
                        href="/blogs"
                        className="text-decoration-none text-muted"
                      >
                        Blogs
                      </Link>
                    </li>
                    <li
                      className="breadcrumb-item active text-primary"
                      aria-current="page"
                    >
                      {blog.title}
                    </li>
                  </ol>
                </nav>

                <div className="text-center mb-5 mt-5">
                  <h1 className="display-5 fw- mb-4 text-dark font-modernMTPro">
                    {blog.title}
                  </h1>

                  <div className="d-flex justify-content-center align-items-center gap-4 text-muted mb-4">
                    <span className="d-flex align-items-center gap-2">
                      <i className="bi bi-calendar3"></i>
                      {formatDate(blog.created_at)}
                    </span>

                    {categoryName && (
                      <span className="badge outline-dark  bg-primary rounded-pill px-3 py-2 font-modernMTPro">
                        {categoryName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Featured Image */}
                <div className="featured-image-container position-relative rounded-0 overflow-hidden shadow-lg">
                  <div style={{ height: "500px" }}>
                    <Image
                      src={imageUrl}
                      alt={blog.title}
                      fill
                      sizes="100vw"
                      className="object-fit-cover"
                      priority
                    />
                  </div>

                  {/* Image Overlay Gradient */}
                  <div
                    className="position-absolute bottom-0 start-0 w-100 h-50"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.3), transparent)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="blog-content-section py-5">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                {/* Long Description */}
                {blog.long_description && (
                  <div className="long-description mb-5">
                    <div
                      className="content-styles fs-5 lh-base text-dark"
                      style={{ fontWeight: 400 }}
                      dangerouslySetInnerHTML={{
                        __html: blog.long_description,
                      }}
                    />
                  </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="tags-section mb-5">
                    <h4 className="h5 mb-3 fw-semibold">Tags:</h4>
                    <div className="d-flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="badge bg-light text-dark border px-3 py-2 rounded-pill"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {relatedBlogs.length > 0 && (
          <div className="related-blogs-section bg- py-5">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <h2 className="mb-5 fw-bold text-center font-modernMTPro">
                    Related Articles
                  </h2>
                </div>

                {loadingRelated ? (
                  <div className="text-center py-4">
                    <Spinner />
                  </div>
                ) : (
                  relatedBlogs.map((relatedBlog) => {
                    // Get related blog category name safely
                    const relatedCategoryName = relatedBlog.category
                      ? typeof relatedBlog.category === "string"
                        ? relatedBlog.category
                        : relatedBlog.category.name || null
                      : null;

                    return (
                      <div className="col-md-6 mb-4" key={relatedBlog.id}>
                        <div className="card h-100 border-0 transition-all">
                          <div
                            className="position-relative"
                            style={{ height: "200px" }}
                          >
                            <Image
                              src={
                                relatedBlog.image
                                  ? `${imageBaseUrl}/${relatedBlog.image}`
                                  : "/assets/no-image.jpg"
                              }
                              alt={relatedBlog.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="card-img-top object-fit-cover"
                            />
                          </div>
                          <div className="card-body px-0">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              {relatedCategoryName && (
                                <span className="badge btn-outline-dark  bg-primary rounded-pill px-3 py-1 font-modernMTPro">
                                  {relatedCategoryName}
                                </span>
                              )}
                              <small className="text-muted">
                                {formatDate(relatedBlog.created_at)}
                              </small>
                            </div>
                            <h4 className="card-title mb-3 font-modernMTPro">
                              {relatedBlog.title}
                            </h4>
                            <div
                              className="card-text text-muted mb-3"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                minHeight: "72px",
                              }}
                              dangerouslySetInnerHTML={{
                                __html: relatedBlog.short_description || "",
                              }}
                            />
                            <Link
                              href={`/blog/${relatedBlog.slug}`}
                              className="btn btn-link text-dark p-0 text-decoration-none font-modernMTPro"
                            >
                              Read More{" "}
                              <i className="fa fa-arrow-right ms-2"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-12">
              <div className="d-flex justify-content-between">
                <Link
                  href="/blogs"
                  className="btn btn-outline-dark fw-normal px-4 py-2 font-modernMTPro"
                >
                  Back to All Blogs <i className="fa fa-arrow-left ms-2"></i>
                </Link>

                <button
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="btn btn-outline-dark fw-normal px-4 py-2 font-modernMTPro"
                >
                  Back to Top <i className="fa fa-arrow-up ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        h1,
        h2,
        h3 {
          font-family: "romie-r";
        }
        .blog-detail-page {
          font-family:
            "Inter",
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            sans-serif;
        }

        .featured-image-container {
          transition: transform 0.3s ease;
        }

        .featured-image-container:hover {
          transform: translateY(-5px);
        }

        .hover-shadow {
          transition: all 0.3s ease;
        }

        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
        }
        .long-description img {
          width: 100%;
          height: 500px;
          object-position: left;
          object-fit: contain;
        }
        .content-styles h2,
        .content-styles h3,
        .content-styles h4 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .content-styles p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }

        .content-styles ul,
        .content-styles ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }

        .content-styles li {
          margin-bottom: 0.5rem;
        }

        .content-styles strong {
          font-weight: 600;
          color: #1a1a1a;
        }

        .content-styles a {
          color: #0d6efd;
          text-decoration: none;
        }

        .content-styles a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .featured-image-container div {
            height: 300px !important;
          }

          .display-5 {
            font-size: 2rem;
          }

          .lead {
            font-size: 1.1rem !important;
          }

          .content-styles {
            font-size: 1rem !important;
          }

          .d-flex.justify-content-center.align-items-center.gap-4 {
            flex-direction: column;
            gap: 1rem !important;
          }
        }
      `}</style>
    </>
  );
};

// Server-side props for blog detail page
BlogDetailPage.getInitialProps = async ({ query, req }) => {
  const { slug } = query;

  let themeData = null;
  let initialMetas = null;

  // Only fetch on server-side
  if (typeof window === "undefined") {
    try {
      const fs = (await import("fs")).default;
      const path = (await import("path")).default;

      const filePath = path.join(
        process.cwd(),
        "public",
        "settings",
        "data.json",
      );
      const fileContents = fs.readFileSync(filePath, "utf8");
      themeData = JSON.parse(fileContents);

      // Try to fetch blog data for meta tags
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/v1/single-blog/${slug}?key=${process.env.APP_KEY}&type=featured`,
        );
        const blogData = await response.json();

        if (blogData.success && blogData.data) {
          initialMetas = {
            title: blogData.data.meta_title || blogData.data.title,
            metaTitle: blogData.data.meta_title || blogData.data.title,
            metaDescription:
              blogData.data.meta_description ||
              blogData.data.short_description?.replace(/<[^>]*>/g, ""),
            metaKeyword:
              blogData.data.meta_keyword ||
              blogData.data.meta_key ||
              blogData.data.title,
          };
        } else {
          throw new Error("Blog not found");
        }
      } catch (apiError) {
        // Fallback if API fails
        const formattedSlug = slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        initialMetas = {
          title: formattedSlug,
          metaTitle: formattedSlug,
          metaDescription: `${formattedSlug} - Read our latest article`,
          metaKeyword: `${formattedSlug}, blog, article`,
        };
      }
    } catch (error) {
      console.error("Error reading data.json on server:", error);
      themeData = {};
      const formattedSlug = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      initialMetas = {
        title: formattedSlug,
        metaTitle: formattedSlug,
        metaDescription: `${formattedSlug} - Read our latest article`,
        metaKeyword: `${formattedSlug}, blog, article`,
      };
    }
  }

  return {
    themeData,
    initialMetas,
    slug,
  };
};

export default BlogDetailPage;
