import { useRouter } from "next/router";
import BlogsPage from "./index";

const CategoryPage = ({ themeData }) => {
  const router = useRouter();
  const { category } = router.query;

  return <BlogsPage categoryParam={category} themeData={themeData} />;
};

// Server-side props for category page
CategoryPage.getInitialProps = async ({ query, req }) => {
  const { category } = query;

  let themeData = null;

  // Only fetch on server-side
  if (typeof window === "undefined") {
    try {
      // Dynamic import for fs module (only on server)
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
    } catch (error) {
      console.error("Error reading data.json on server:", error);
      themeData = {};
    }
  }

  return {
    categoryParam: category || null,
    themeData,
  };
};

export default CategoryPage;
