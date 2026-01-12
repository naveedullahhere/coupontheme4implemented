import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  APP_KEY,
  APP_URL,
} from "@/public/settings/there_is_nothing_holding_me_back/config";
import Spinner from "./Spinner";

const CategoryWiseBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`${APP_URL}api/v1/blogs?key=${APP_KEY}&type=featured`)
      .then((res) => res.json())
      .then((response) => {
        setBlogs(response?.data || []);
        setImageBaseUrl(response?.url || "");
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white vh-100 vw-100 d-flex justify-content-center align-items-center position-fixed top-0 start-0 z-1">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container-fluid my-5">
      {/* <h3 className="head1 pt-5 mb-4">Category Wise Blog</h3> */}

      <div className="row">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div className="col-md-4 mb-3" key={blog.id}>
              <div className="card h-100 rounded-0 border-0">
                <Image
                  src={
                    blog.image
                      ? `${imageBaseUrl}/${blog.image}`
                      : "/assets/no-image.jpg"
                  }
                  alt={blog.title}
                  width={100}
                  height={200}
                  className="card-img-top"
                />

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title blog-title-theme-4">
                    {blog.title}
                  </h5>

                  {/* ✅ Truncated description */}
                  <p className="card-text blog-description-theme-4">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: blog.short_description,
                      }}
                    />
                  </p>

                  <div className="card-footer bg-white align-items-center p-0 bg-transparent border-0 d-flex justify-content-between">
                    <p className="card-text text-muted m-0">
                      Published on:{" "}
                      {blog.created_at
                        ? new Date(blog.created_at).toLocaleDateString()
                        : "N/A"}
                    </p>

                    <Link
                      href={`/blog/${blog.slug}`}
                      className="btn btn-primary m-0"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No blogs found</p>
        )}
      </div>
    </div>
  );
};

export default CategoryWiseBlog;
