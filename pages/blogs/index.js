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

const BlogsPage = ({ data, metas, setMetas }) => {
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
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);
  const [categoriesWithBlogs, setCategoriesWithBlogs] = useState([]);

  // Update metas when category changes
  useEffect(() => {
    if (selectedCategoryName && typeof setMetas === "function") {
      const newMetas = {
        title: `${selectedCategoryName} | Blog Category`,
        metaTitle: `${selectedCategoryName} | Blog Category`,
        metaDescription: `Explore all articles in ${selectedCategoryName} category`,
        metaKeyword: `${selectedCategoryName}, blog, articles, insights`,
      };
      setMetas(newMetas);
    }
  }, [selectedCategoryName, setMetas]);

  // Fetch filter options (categories and tags)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch(
          `${APP_URL}api/v1/blog-filterations?key=${APP_KEY}&type=featured`,
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const categoriesData = result.data.categories || [];
            setCategories(categoriesData);
            setTags(result.data.tags || []);

            // Filter categories that have blogs
            const checkCategoriesWithBlogs = async () => {
              try {
                const categoryChecks = categoriesData.map(async (category) => {
                  try {
                    const blogResponse = await fetch(
                      `${APP_URL}api/v1/blogs?key=${APP_KEY}&type=featured&categories=${category.id}&page=1`,
                    );

                    if (blogResponse.ok) {
                      const blogResult = await blogResponse.json();
                      if (
                        blogResult.success &&
                        blogResult.data &&
                        blogResult.data.length > 0
                      ) {
                        return category;
                      }
                    }
                  } catch (err) {
                    console.error(
                      `Error checking category ${category.id}:`,
                      err,
                    );
                  }
                  return null;
                });

                const results = await Promise.all(categoryChecks);
                const categoriesWithData = results.filter(
                  (cat) => cat !== null,
                );

                setCategoriesWithBlogs(categoriesWithData);
              } catch (err) {
                console.error("Error checking categories:", err);
                setCategoriesWithBlogs(categoriesData);
              }
            };

            checkCategoriesWithBlogs();
            setHasInitialized(true);
          }
        }
      } catch (err) {
        console.error("Error fetching filter options:", err);
        setHasInitialized(true);
      }
    };

    fetchFilterOptions();
  }, []);

  // Fetch blogs with filters
  const fetchBlogs = useCallback(async () => {
    if (!hasInitialized || categories.length === 0) return;

    try {
      setLoadingBlogs(true);
      setBlogs([]);

      let apiUrl = `${APP_URL}api/v1/blogs?key=${APP_KEY}&type=featured&page=${currentPage}`;

      if (selectedCategories.length > 0) {
        apiUrl += `&categories=${selectedCategories.join(",")}`;
      }

      if (selectedTags.length > 0) {
        apiUrl += `&tags=${selectedTags.join(",")}`;
      }

      if (searchQuery.trim()) {
        apiUrl += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const response = await fetch(apiUrl);

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const blogsData = result.data || [];
          setBlogs(blogsData);
          setImageBaseUrl(result.url || "");
          setTotalPages(result.last_page || 1);
          setTotalBlogs(result.total || 0);
        } else {
          setBlogs([]);
          setTotalPages(1);
          setTotalBlogs(0);
        }
      } else {
        setBlogs([]);
        setTotalPages(1);
        setTotalBlogs(0);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setBlogs([]);
      setTotalPages(1);
      setTotalBlogs(0);
    } finally {
      setLoading(false);
      setLoadingBlogs(false);
    }
  }, [
    selectedCategories,
    selectedTags,
    currentPage,
    searchQuery,
    hasInitialized,
    categories.length,
  ]);

  // Initial fetch and when filters change
  useEffect(() => {
    if (hasInitialized && categories.length > 0) {
      fetchBlogs();
    }
  }, [
    selectedCategories,
    selectedTags,
    currentPage,
    searchQuery,
    hasInitialized,
    categories.length,
  ]);

  // Handle category selection
  const handleCategoryToggle = (categoryId, categorySlug) => {
    const isCurrentlySelected = selectedCategories.includes(categoryId);

    if (isCurrentlySelected) {
      setSelectedCategories([]);
      setSelectedCategoryName("");
      router.push("/blogs", undefined, { shallow: true });
    } else {
      const category = categories.find((cat) => cat.id === categoryId);
      if (category) {
        setSelectedCategories([categoryId]);
        setSelectedCategoryName(category.name);

        router.push(`/blogs/${category.slug || category.id}`, undefined, {
          shallow: true,
        });
      }
    }

    setSelectedTags([]);
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
    if (hasInitialized && categories.length > 0) {
      fetchBlogs();
    }
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
    setSelectedCategoryName("");
    router.push("/blogs", undefined, { shallow: true });
  };

  const removeCategory = () => {
    setSelectedCategories([]);
    setSelectedCategoryName("");
    setCurrentPage(1);
    router.push("/blogs", undefined, { shallow: true });
  };

  const removeTag = (tagId) => {
    setSelectedTags((prev) => prev.filter((id) => id !== tagId));
    setCurrentPage(1);
  };

  if (loading && !hasInitialized) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="blogs-page py-5 blogbg">
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar Filters */}
            <div className="col-lg-3 mb-4 mb-lg-0">
              <div
                className="sidebar-filters bg-white p-4 sticky-top"
                style={{ top: "20px" }}
              >
                <div className="mb-5">
                  <h5 className="font-modernMTPro mb-3 text-dark">
                    Search Articles
                  </h5>
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
                      <h5 className="mb-0 text-dark font-modernMTPro">
                        Active Filters
                      </h5>
                      <button
                        onClick={clearFilters}
                        className="btn d-flex align-items-center justify-content-center btn-outline-dark btn-sm font-modernMTPro"
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
                              onClick={() => removeCategory()}
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
                              onClick={() => removeTag(tagId)}
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
                {(() => {
                  const categoriesToShow = [...categoriesWithBlogs];
                  if (selectedCategories.length > 0) {
                    selectedCategories.forEach((selectedCatId) => {
                      const selectedCat = categories.find(
                        (c) => c.id === selectedCatId,
                      );
                      if (
                        selectedCat &&
                        !categoriesToShow.find((c) => c.id === selectedCatId)
                      ) {
                        categoriesToShow.push(selectedCat);
                      }
                    });
                  }

                  return categoriesToShow.length > 0 ? (
                    <div className="mb-5">
                      <h5 className="font-modernMTPro mb-3 text-dark">
                        Categories
                      </h5>
                      <div className="filter-options">
                        {categoriesToShow.map((category) => {
                          const isSelected = selectedCategories.includes(
                            category.id,
                          );
                          return (
                            <button
                              key={category.id}
                              className={`filter-option ${
                                isSelected ? "active" : ""
                              }`}
                              onClick={() =>
                                handleCategoryToggle(category.id, category.slug)
                              }
                            >
                              {category.name}
                              {isSelected && <i className="bi bi-check-lg"></i>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-modernMTPro mb-3 text-dark">Tags</h5>
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
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2 className="h2  mb-2 font-modernMTPro">
                    {searchQuery
                      ? `Search Results for "${searchQuery}"`
                      : selectedCategoryName
                        ? selectedCategoryName
                        : "Latest Articles"}
                  </h2>
                </div>
                {selectedCategoryName && (
                  <button
                    onClick={clearFilters}
                    className="button bg-transparent text-dark font-modernMTPro border-0"
                  >
                    <span className="text-dark">View All Categories</span>
                    <i className="fa fa-arrow-right ms-2 text-dark"></i>
                  </button>
                )}
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
                          <div className="card h-100 border-0 rounded-0 ">
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

                            <div className="card-body d-flex flex-column px-0">
                              <h3 className="card-title text-dark font-modernMTPro">
                                <Link
                                  href={`/blog/${blog.slug}`}
                                  className="text-decoration-none text-dark"
                                >
                                  {blog.title}
                                </Link>
                              </h3>

                              <div className="flex-grow-1">
                                <div
                                  className="text-dark font-neuzeit-grotesk"
                                  style={{
                                    fontWeight: 500,
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
                              <div className="text-muted author-name mb-2">
                                <span className="text-muted text-uppercase">
                                  BY:{" "}
                                  <span className="text-dark">
                                    {blog.author_name
                                      ? blog.author_name
                                      : "Unknown"}
                                  </span>
                                </span>
                              </div>

                              <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                                <span className="text-muted small">
                                  {formattedDate}
                                </span>
                                <Link
                                  href={`/blog/${blog.slug}`}
                                  className="text-decoration-none font-modernMTPro text-dark small"
                                >
                                  Read More{" "}
                                  <i className="fa fa-arrow-right ms-2"></i>
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
                          },
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
                  <p className="text-muted mb-4">
                    {searchQuery
                      ? `No articles match your search for "${searchQuery}"`
                      : selectedCategoryName
                        ? `No articles found in "${selectedCategoryName}" category`
                        : "No articles available at the moment"}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="button button-primary"
                  >
                    {selectedCategoryName
                      ? "View All Categories"
                      : "Clear Filters"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .blogs-page {
          font-family:
            "Inter",
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            sans-serif;
        }

        .filter-chip {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          background: #000;
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
          width: 100%;
          text-align: left;
        }

        .filter-option:hover {
          border-color: black;
          color: var(--primary);
        }

        .filter-option.active {
          background: black;
          border-color: black;
          color: white;
        }

        .page-item.active .page-link {
          background: black;
          color: white;
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

        @media (max-width: 768px) {
          .sidebar-filters {
            position: static !important;
          }

          .filter-option {
            width: calc(50% - 4px);
          }
        }
      `}</style>
    </>
  );
};

// Server-side props for main blogs page
BlogsPage.getInitialProps = async ({ query, req }) => {
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

      // Default metas for main blogs page
      initialMetas = {
        title: "Blogs | Our Articles & Insights",
        metaTitle: "Blogs | Our Articles & Insights",
        metaDescription:
          "Explore our collection of insightful articles, tips, and guides on various topics.",
        metaKeyword: "blog, articles, insights, guides, tips",
      };
    } catch (error) {
      console.error("Error reading data.json on server:", error);
      themeData = {};
      initialMetas = {
        title: "Blogs | Our Articles & Insights",
        metaTitle: "Blogs | Our Articles & Insights",
        metaDescription:
          "Explore our collection of insightful articles, tips, and guides on various topics.",
        metaKeyword: "blog, articles, insights, guides, tips",
      };
    }
  }

  return {
    themeData,
    initialMetas,
  };
};

export default BlogsPage;
