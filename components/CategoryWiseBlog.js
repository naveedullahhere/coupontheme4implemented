import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  APP_KEY,
  APP_URL,
} from "@/public/settings/there_is_nothing_holding_me_back/config";
import Spinner from "./Spinner";

const CategoryWiseBlog = ({ data = null }) => {
  const [categories, setCategories] = useState([]);
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${APP_URL}api/v1/category-wise-blogs?key=${APP_KEY}&type=featured`
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      setCategories(result?.data || []);
      setImageBaseUrl(result?.url || "");
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs. Please try again later.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  if (loading)
    return (
      <div className="min-vh-50 d-flex justify-content-center align-items-center">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <div className="container my-3">
        <div className="alert alert-danger text-center" role="alert">
          {error}
          <button onClick={fetchBlogs} className="btn btn-link p-0 ms-2">
            Retry
          </button>
        </div>
      </div>
    );

  if (categories.length === 0)
    return (
      <div className="container-fluid my-3">
        <div className="text-center py-5">
          <p className="text-muted fs-5">No blogs found</p>
        </div>
      </div>
    );

  return (
    <div className="container my-3">
      {categories.map((category, index) => {
        // Even index -> layout 0, Odd index -> layout 1
        const isEven = index % 2 === 0;

        return (
          <div
            key={category.id}
            className={`mb-5 layout-index-${index} layout-${
              isEven ? "even" : "odd"
            }`}
          >
            <div className="row align-items-center blog-category-block-header-moderno">
              <div className="col-lg-9">
                <h2 className="text-dark font-modernMTPro">{category.name}</h2>
              </div>
              <div className="col-lg-3 text-lg-end">
                <Link
                  href={`/blogs/${category.slug}`}
                  className="text-decoration-none text-dark font-modernMTPro"
                >
                  <span className="text-dark">View All</span>
                  <i className="fa fa-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>

            {category.blogs.length === 0 ? (
              <p className="text-muted">No blogs in this category</p>
            ) : (
              <div className="ro g-4">
                {isEven ? (
                  <>
                    {/* Layout 0 */}
                    <div className="row">
                      <div className="col-lg-8">
                        {category.blogs.slice(0, 1).map((blog) => (
                          <div
                            key={blog.id}
                            className="card rounded-0 border-0 mb-3"
                          >
                            <div
                              className="position-relative"
                              style={{ height: "350px" }}
                            >
                              <Image
                                src={
                                  blog.image
                                    ? `${imageBaseUrl}${blog.image}`
                                    : "/assets/no-image.jpg"
                                }
                                alt={blog.title}
                                fill
                                className="object-fit-cover"
                              />
                            </div>
                            <div className="card-body px-0">
                              <h1 className="fw font-modernMTPro m-0">
                                <Link
                                  href={`/blog/${blog.slug}`}
                                  className="font-modernMTPro text-decoration-none text-dark"
                                >
                                  {blog.title}
                                </Link>
                              </h1>
                              <div
                                className="text-muted"
                                dangerouslySetInnerHTML={{
                                  __html: blog.short_description,
                                }}
                              />
                              <div className="text-muted author-name">
                                <span className="text-muted text-uppercase">
                                  BY:{" "}
                                  <span className="text-dark">
                                    {blog.author_name
                                      ? blog.author_name
                                      : "Unknown"}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="col-lg-4">
                        <div className="row g-2">
                          {category.blogs.slice(1, 4).map((blog) => (
                            <div key={blog.id} className="col-12 sideblog-card">
                              <div className="card rounded-0 border-0">
                                <div className="card-body p-0">
                                  <div className="row">
                                    <div className="col-5">
                                      <Image
                                        src={
                                          blog.image
                                            ? `${imageBaseUrl}${blog.image}`
                                            : "/assets/no-image.jpg"
                                        }
                                        alt={blog.title}
                                        width={100}
                                        height={150}
                                        className="object-fit-cover w-100"
                                      />
                                    </div>
                                    <div className="col-7">
                                      <h5 className="mb-1 font-modernMTPro">
                                        <Link
                                          href={`/blog/${blog.slug}`}
                                          className="font-modernMTPro text-decoration-none text-dark"
                                        >
                                          {blog.title}
                                        </Link>
                                      </h5>
                                      <div className="text-muted  author-name">
                                        <span className="text-muted text-uppercase">
                                          BY:{" "}
                                          <span className="text-dark">
                                            {blog.author_name
                                              ? blog.author_name
                                              : "Unknown"}
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {category.blogs.length > 4 && (
                      <div className="row g-4 mt-3">
                        {category.blogs.slice(4).map((blog) => (
                          <div key={blog.id} className="col-lg-4 col-md-6">
                            <div className="card rounded-0 border-0 h-100">
                              <div
                                className="position-relative"
                                style={{ height: "200px" }}
                              >
                                <Image
                                  src={
                                    blog.image
                                      ? `${imageBaseUrl}${blog.image}`
                                      : "/assets/no-image.jpg"
                                  }
                                  alt={blog.title}
                                  fill
                                  className="object-fit-cover"
                                />
                              </div>
                              <div className="card-body px-0">
                                <h5 className="font-modernMTPro">
                                  <Link
                                    href={`/blog/${blog.slug}`}
                                    className="text-decoration-none text-dark"
                                  >
                                    {blog.title}
                                  </Link>
                                </h5>
                                <div className="text-muted  author-name">
                                  <span className="text-muted text-uppercase">
                                    BY:{" "}
                                    <span className="text-dark">
                                      {blog.author_name
                                        ? blog.author_name
                                        : "Unknown"}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Layout 1 */}
                    <div className="row">
                    {category.blogs.map((blog) => (
                      <div key={blog.id} className="col-lg-4 col-md-6">
                        <div className="card rounded-0 border-0 h-100">
                          <div
                            className="position-relative"
                            style={{ height: "200px" }}
                          >
                            <Image
                              src={
                                blog.image
                                  ? `${imageBaseUrl}${blog.image}`
                                  : "/assets/no-image.jpg"
                              }
                              alt={blog.title}
                              fill
                              className="object-fit-cover"
                            />
                          </div>
                          <div className="card-body px-0">
                            <h4 className="font-modernMTPro">
                              <Link
                                href={`/blog/${blog.slug}`}
                                className="font-modernMTPro text-decoration-none text-dark"
                              >
                                {blog.title}
                              </Link>
                            </h4>
                            <div className="text-muted ">
                              <span className="text-muted text-uppercase author-name  ">
                                BY:{" "}
                                <span className="text-dark">
                                  {blog.author_name
                                    ? blog.author_name
                                    : "Unknown"}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryWiseBlog;
