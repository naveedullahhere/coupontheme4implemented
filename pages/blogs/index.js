// pages/blogs/index.js
import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  APP_KEY,
  APP_URL,
} from "@/public/settings/there_is_nothing_holding_me_back/config";
import Spinner from "@/components/Spinner";

const BlogsPage = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch filter options (categories and tags)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch(
          `${APP_URL}api/v1/blog-filterations?key=${APP_KEY}&type=featured`
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setCategories(result.data.categories || []);
            setTags(result.data.tags || []);
          }
        }
      } catch (err) {
        console.error("Error fetching filter options:", err);
      }
    };

    fetchFilterOptions();
  }, []);

  // Fetch blogs with filters
  const fetchBlogs = useCallback(async () => {
    try {
      setLoadingBlogs(true);

      let apiUrl = `${APP_URL}api/v1/blogs?key=${APP_KEY}&type=featured&page=${currentPage}`;

      // Add category filters
      if (selectedCategories.length > 0) {
        apiUrl += `&categories=${selectedCategories.join(",")}`;
      }

      // Add tag filters
      if (selectedTags.length > 0) {
        apiUrl += `&tags=${selectedTags.join(",")}`;
      }

      // Add search query
      if (searchQuery.trim()) {
        apiUrl += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const response = await fetch(apiUrl);

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setBlogs(result.data || []);
          setImageBaseUrl(result.url || "");
          setTotalPages(result.last_page || 1);
          setTotalBlogs(result.total || 0);
        }
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
      setLoadingBlogs(false);
    }
  }, [selectedCategories, selectedTags, currentPage, searchQuery]);

  // Initial fetch and when filters change
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Handle category selection
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
    setCurrentPage(1);
  };

  // Handle tag selection
  const handleTagToggle = (tagId) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Blogs | Our Articles & Insights</title>
        <meta
          name="description"
          content="Explore our collection of insightful articles, tips, and guides on various topics."
        />
        <meta
          name="keywords"
          content="blog, articles, insights, guides, tips"
        />
      </Head>

      <div className="blogs-page py-5">
        {/* Hero Section */}
        <div className="hero-section py-5 mb-5 d-none">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-lg-10 col-xl-8 text-center">
                <h1 className="display-4 fw-bold mb-4">Our Blog</h1>
                <p className="lead mb-0">
                  Discover insightful articles, tips, and guides from our
                  experts
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="row">
            {/* Sidebar Filters */}
            <div className="col-lg-3 mb-4 mb-lg-0">
              <div
                className="sidebar-filters bg-white p-4 sticky-top"
                style={{ top: "20px" }}
              >
                {/* Search */}
                <div className="mb-5">
                  <h5 className="fw-bold mb-3 text-dark">Search Articles</h5>
                  <form onSubmit={handleSearch}>
                    <div className="input-group search-group">
                      <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button
                        className="button button-primary search-btn"
                        type="submit"
                      >
                        <i className="bi bi-search me-2"></i>
                        Search
                      </button>
                    </div>
                  </form>
                </div>

                {/* Active Filters */}
                {(selectedCategories.length > 0 || selectedTags.length > 0) && (
                  <div className="mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-bold mb-0 text-dark">Active Filters</h5>
                      <button
                        onClick={clearFilters}
                        className="button button-secondary btn-sm"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedCategories.map((catId) => {
                        const cat = categories.find((c) => c.id === catId);
                        return cat ? (
                          <span key={catId} className="filter-chip">
                            {cat.name}
                            <button
                              onClick={() => handleCategoryToggle(catId)}
                              className="filter-remove"
                            >
                              <i className="bi bi-x">x</i>
                            </button>
                          </span>
                        ) : null;
                      })}
                      {selectedTags.map((tagId) => {
                        const tag = tags.find((t) => t.id === tagId);
                        return tag ? (
                          <span key={tagId} className="filter-chip">
                            {tag.name}
                            <button
                              onClick={() => handleTagToggle(tagId)}
                              className="filter-remove"
                            >
                              <i className="bi bi-x">x</i>
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Categories */}
                {categories.length > 0 && (
                  <div className="mb-5">
                    <h5 className="fw-bold mb-3 text-dark">Categories</h5>
                    <div className="filter-options">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          className={`filter-option ${
                            selectedCategories.includes(category.id)
                              ? "active"
                              : ""
                          }`}
                          onClick={() => handleCategoryToggle(category.id)}
                        >
                          {category.name}
                          {selectedCategories.includes(category.id) && (
                            <i className="bi bi-check-lg"></i>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="mb-4">
                    <h5 className="fw-bold mb-3 text-dark">Tags</h5>
                    <div className="filter-options">
                      {tags.map((tag) => (
                        <button
                          key={tag.id}
                          className={`filter-option ${
                            selectedTags.includes(tag.id) ? "active" : ""
                          }`}
                          onClick={() => handleTagToggle(tag.id)}
                        >
                          {tag.name}
                          {selectedTags.includes(tag.id) && (
                            <i className="bi bi-check-lg"></i>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Blogs Grid */}
            <div className="col-lg-9">
              {/* Results Header */}
              <div className="d-flex justify-content-between align-items-center mb-2 d-none">
                <div>
                  <h2 className="h3 fw-bold mb-1">
                    {searchQuery
                      ? `Search Results for "${searchQuery}"`
                      : "Latest Articles"}
                  </h2>
                  <p className="text-muted mb-0 d-none">
                    {totalBlogs} article{totalBlogs !== 1 ? "s" : ""} found
                  </p>
                </div>
              </div>

              {/* Blogs Grid */}
              {loadingBlogs ? (
                <div className="text-center py-5">
                  <Spinner />
                  <p className="mt-3 text-muted">Loading articles...</p>
                </div>
              ) : blogs.length > 0 ? (
                <>
                  <div className="row">
                    {blogs.map((blog) => {
                      const imageUrl = blog.image
                        ? `${imageBaseUrl}/${blog.image}`
                        : "/assets/no-image.jpg";
                      const formattedDate = formatDate(blog.created_at);

                      return (
                        <div className="col-lg-6 col-md-6 mb-4" key={blog.id}>
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
                                  dangerouslySetInnerHTML={{
                                    __html: blog.short_description || "",
                                  }}
                                />
                              </div>

                              <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                                <span className="text-muted small">
                                  {formattedDate}
                                </span>
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
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav
                      aria-label="Blog pagination"
                      className="mt-5 pt-4 border-top"
                    >
                      <ul className="pagination justify-content-center">
                        <li
                          className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <i className="bi bi-chevron-left"></i> Previous
                          </button>
                        </li>

                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <li
                                key={pageNum}
                                className={`page-item ${
                                  currentPage === pageNum ? "active" : ""
                                }`}
                              >
                                <button
                                  className="page-link"
                                  onClick={() => handlePageChange(pageNum)}
                                >
                                  {pageNum}
                                </button>
                              </li>
                            );
                          }
                        )}

                        <li
                          className={`page-item ${
                            currentPage === totalPages ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next <i className="bi bi-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <div className="mb-4">
                    <i className="bi bi-search display-1 text-muted"></i>
                  </div>
                  <h3 className="h4 fw-bold mb-3">No articles found</h3>
                  <p className="text-muted mb-4">
                    {searchQuery
                      ? `No articles match your search for "${searchQuery}"`
                      : "No articles available at the moment"}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="button button-primary"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Newsletter Section */}
              {blogs.length > 0 && !searchQuery && (
                <div className="mt-5 pt-5 border-top d-none">
                  <div className="newsletter-section bg-primary text-white rounded p-5">
                    <div className="row align-items-center">
                      <div className="col-lg-8">
                        <h2 className="fw-bold mb-3">Stay Updated</h2>
                        <p className="lead mb-4 opacity-75">
                          Subscribe to our newsletter and never miss our latest
                          articles, tips, and exclusive content.
                        </p>
                        <form className="d-flex gap-2 newsletter-form">
                          <input
                            type="email"
                            className="form-control newsletter-input"
                            placeholder="Your email address"
                          />
                          <button
                            type="submit"
                            className="button button-secondary"
                          >
                            Subscribe
                          </button>
                        </form>
                      </div>
                      <div className="col-lg-4 text-center">
                        <div className="newsletter-icon">
                          <i className="bi bi-envelope-paper display-1"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .blogs-page {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
        }

        .hero-section {
          // background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          // border-bottom: 1px solid #dee2e6;
        }

        /* Card Design */
        .shadow-hover {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
        }

        .shadow-hover:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          transform: translateY(-5px);
          border-color: #e0e0e0;
        }

        .card-img-top {
          transition: transform 0.5s ease;
        }

        .shadow-hover:hover .card-img-top {
          transform: scale(1.05);
        }

        .btn-sm {
          padding: 6px 16px;
          font-size: 13px;
        }

        /* Search */
        .search-group {
          position: relative;
        }

        .search-input {
          padding: 12px 16px;
          border: 1px solid #dee2e6;
          border-radius: 8px 0 0 8px;
          border-right: none;
        }

        .search-input:focus {
          box-shadow: none;
          border-color: var(--primary);
        }

        .search-btn {
          border-radius: 0 8px 8px 0;
          padding: 12px 20px;
          white-space: nowrap;
        }

        /* Filter Chips */
        .filter-chip {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          background: linear-gradient(
            135deg,
            var(--primary) 0%,
            var(--primary) 100%
          );
          color: white;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
        }

        .filter-remove {
          background: none;
          border: none;
          color: white;
          margin-left: 6px;
          padding: 0;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0.8;
        }

        .filter-remove:hover {
          opacity: 1;
        }

        /* Filter Options */
        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .filter-option {
          padding: 8px 16px;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          background: white;
          color: #495057;
          font-size: 14px;
          transition: all 0.2s ease;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .filter-option:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .filter-option.active {
          background: linear-gradient(
            135deg,
            var(--primary) 0%,
            var(--primary) 100%
          );
          border-color: var(--primary);
          color: white;
        }

        /* Pagination */
        .page-item.active .page-link {
          background: linear-gradient(
            135deg,
            var(--primary) 0%,
            var(--primary) 100%
          );
          border-color: var(--primary);
          color: white;
        }

        .page-link {
          padding: 8px 16px;
          border: 1px solid #dee2e6;
          color: #495057;
          margin: 0 4px;
          border-radius: 8px !important;
        }

        .page-link:hover {
          background: #f8f9fa;
          color: var(--primary);
          border-color: #dee2e6;
        }

        /* Newsletter */
        .newsletter-section {
          background: linear-gradient(
            135deg,
            var(--primary) 0%,
            var(--primary) 100%
          );
        }

        .newsletter-input {
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
        }

        .newsletter-input:focus {
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
        }

        .newsletter-icon {
          opacity: 0.8;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .sidebar-filters {
            position: static !important;
          }
        }

        @media (max-width: 768px) {
          .hero-section .display-4 {
            font-size: 2rem;
          }

          .search-group {
            flex-direction: column;
          }

          .search-input {
            border-radius: 8px;
            border-right: 1px solid #dee2e6;
            margin-bottom: 10px;
          }

          .search-btn {
            border-radius: 8px;
            width: 100%;
          }

          .newsletter-form {
            flex-direction: column;
          }

          .newsletter-input {
            margin-bottom: 10px;
          }

          .position-relative {
            height: 220px !important;
          }
        }

        @media (max-width: 576px) {
          .col-lg-4,
          .col-md-6 {
            margin-bottom: 1.5rem;
          }

          .pagination .page-link {
            padding: 6px 12px;
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
};

export default BlogsPage;
