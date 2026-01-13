import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  APP_KEY,
  APP_URL,
} from "@/public/settings/there_is_nothing_holding_me_back/config";
import Spinner from "./Spinner";

const CategoryWiseBlog = ({ data = null }) => {
  const [blogs, setBlogs] = useState([]);
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${APP_URL}api/v1/blogs?key=${APP_KEY}&type=featured`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setBlogs(result?.data || []);
      setImageBaseUrl(result?.url || "");
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs. Please try again later.");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Blog Card Component for reusability
  const BlogCard = ({ blog, isStyle4 = false }) => {
    const imageUrl = blog.image
      ? `${imageBaseUrl}/${blog.image}`
      : "/assets/no-image.jpg";

    const formattedDate = blog.created_at
      ? new Date(blog.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

    if (isStyle4) {
      return (
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="card h-100 border-0 rounded-0 shadow-hover">
            <div
              className="position-relative overflow-hidden"
              style={{ height: "250px" }}
            >
              <Image
                src={imageUrl}
                alt={blog.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="card-img-top rounded-0 object-fit-cover"
                priority={false}
              />
            </div>

            <div className="card-body d-flex flex-column p-4">
              <h3 className="card-title fw-bold fs-5 mb-3 text-dark">
                <Link href={`/blog/${blog.slug}`} className="text-decoration-none text-dark">
                  {blog.title}
                </Link>
              </h3>

              <div className="flex-grow-1 mb-3">
                <div
                  className="text-dark lh-base fs-6"
                  style={{
                    fontWeight: 400,
                    lineHeight: 1.6,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                  dangerouslySetInnerHTML={{ __html: blog.short_description }}
                />
              </div>

              <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                <span className="text-muted small">{formattedDate}</span>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="text-decoration-none fw-bold text-dark small"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default Style
    return (
      <div className="col-md-4 mb-4">
        <div className="card h-100 rounded-0 border shadow-sm">
          <div className="position-relative" style={{ height: "200px" }}>
            <Image
              src={imageUrl}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="card-img-top object-fit-cover"
              priority={false}
            />
          </div>

          <div className="card-body d-flex flex-column">
            <h5 className="card-title fw-bold mb-3">
              <Link href={`/blog/${blog.slug}`} className="text-decoration-none text-dark">
                {blog.title}
              </Link>
            </h5>

            <div className="flex-grow-1 mb-3">
              <div
                className="text-muted"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
                dangerouslySetInnerHTML={{ __html: blog.short_description }}
              />
            </div>

            <div className="d-flex align-items-center justify-content-between mt-auto">
              <span className="text-muted small">{formattedDate}</span>
              <Link
                href={`/blog/${blog.slug}`}
                className="btn btn-primary btn-sm rounded-0"
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-vh-50 d-flex justify-content-center align-items-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid my-3">
        <div className="alert alert-danger text-center" role="alert">
          {error}
          <button onClick={fetchBlogs} className="btn btn-link p-0 ms-2">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="container-fluid my-3">
        <div className="text-center py-5">
          <p className="text-muted fs-5">No blogs found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid my-3">
      <div className="row g-4">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} isStyle4={data?.Style == 4} />
        ))}
      </div>
    </div>
  );
};

export default CategoryWiseBlog;
