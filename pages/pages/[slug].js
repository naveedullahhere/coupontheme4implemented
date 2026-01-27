// pages/[slug].js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { APP_KEY, APP_URL } from "@/public/settings/there_is_nothing_holding_me_back/config";
import Spinner from "@/components/Spinner";

const PageDetail = ({ data, metas, setMetas, initialMetas }) => {
  const router = useRouter();
  const { slug } = router.query;

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set initial metas from server-side
  useEffect(() => {
    if (initialMetas) {
      setMetas(initialMetas);
    }
  }, [initialMetas, setMetas]);

  // Fetch page data
  useEffect(() => {
    if (!slug) return;

    const fetchPageData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${APP_URL}api/pages?key=${APP_KEY}&slug=${slug}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setPage(result.data);

          // Update metas with page data
          const metaTitle = result.data.seo_title || result.data.name || data?.siteTitle || slug;
          const metaDescription = result.data.seo_description || result.data.description;
          const metaKeywords = result.data.meta_keywords || result.data.name || data?.siteTitle;



          setMetas({
            ...metas,
            title: metaTitle,
            metaTitle: metaTitle,
            metaDescription: metaDescription,
            metaKeyword: metaKeywords,
          });
        } else {
          throw new Error(result.message || "Page not found");
        }
      } catch (err) {
        console.error("Error fetching page:", err);
        setError(err.message || "Failed to load page. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [slug, data, setMetas]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <h2 className="text-danger mb-4">Error Loading Page</h2>
          <p className="text-muted mb-4">{error}</p>
          <a href="/" className="btn btn-primary">
            ← Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <h2 className="mb-4">Page Not Found</h2>
          <p className="text-muted mb-4">
            The page you're looking for doesn't exist.
          </p>
          <a href="/" className="btn btn-primary">
            ← Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Page Title */}
            <h1 className="display-5 fw-bold mb-4">
              {page.name}
            </h1>

            {/* Page Description */}
            {page.description && (
              <div className="page-cntent mt-5">
                <div
                  className="content-styls fs-5 "
                  dangerouslySetInnerHTML={{ __html: page.description }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

     
    </>
  );
};

// Server-side props for dynamic page
PageDetail.getInitialProps = async ({ query, req }) => {
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
        "data.json"
      );
      const fileContents = fs.readFileSync(filePath, "utf8");
      themeData = JSON.parse(fileContents);

      // Try to fetch page data for meta tags
      try {
        const response = await fetch(
          `${APP_URL}api/pages?key=${APP_KEY}&slug=${slug}`
        );
        const pageData = await response.json();

        if (pageData.success && pageData.data) {
          const page = pageData.data;
          const metaTitle = page.seo_title || page.name || slug;
          const metaDescription = page.seo_description || themeData?.meta?.description;
          
          const metaKeywords = page.meta_keywords || themeData?.meta?.keywords;

          initialMetas = {
            title: metaTitle,
            metaTitle: metaTitle,
            metaDescription: metaDescription,
            metaKeyword: metaKeywords,
          };
        } else {
          throw new Error("Page not found");
        }
      } catch (apiError) {
        console.error("Error fetching page in getInitialProps:", apiError);
        
        // Fallback if API fails
        const formattedSlug = slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        const finalTitle = themeData?.siteTitle 
          ? `${themeData.siteTitle} - ${formattedSlug}`
          : formattedSlug;

        initialMetas = {
          title: finalTitle,
          metaTitle: finalTitle,
          metaDescription: `${formattedSlug} - Read our page`,
          metaKeyword: `${formattedSlug}, page`,
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
        metaDescription: `${formattedSlug} - Read our page`,
        metaKeyword: `${formattedSlug}, page`,
      };
    }
  }

  return {
    data: themeData,
    initialMetas,
  };
};

export default PageDetail;